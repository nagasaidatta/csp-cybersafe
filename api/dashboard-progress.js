// Serverless endpoint: Admin Learner Progress Dashboard
// Securely reads and aggregates learner profiles and module completion records.
// Protected by administrator credentials to prevent unauthorized data exposure.

import { createClient } from '@supabase/supabase-js';

const ADMIN_ID = (process.env.ADMIN_ID || 'admin').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cybersafe';
const TOTAL_MODULES = 4;

/**
 * Validates whether the incoming request contains valid administrator credentials.
 */
function authenticateAdmin(req) {
  const authHeader = req.headers['authorization'] || '';
  const xAdminId = req.headers['x-admin-id'] || '';
  const xAdminPassword = req.headers['x-admin-password'] || '';

  let providedId = '';
  let providedPassword = '';

  // 1. Check Bearer token
  if (authHeader.startsWith('Bearer ')) {
    providedPassword = authHeader.substring(7).trim();
    providedId = xAdminId || 'admin';
  }
  // 2. Check Basic auth
  else if (authHeader.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(authHeader.substring(6).trim(), 'base64').toString('utf8');
      const colonIdx = decoded.indexOf(':');
      if (colonIdx !== -1) {
        providedId = decoded.substring(0, colonIdx);
        providedPassword = decoded.substring(colonIdx + 1);
      }
    } catch {
      // ignore base64 decode failure
    }
  }

  // 3. Fallback to custom headers
  if (!providedPassword && xAdminPassword) {
    providedPassword = xAdminPassword;
    providedId = xAdminId || providedId;
  }

  // 4. Fallback to POST body if JSON
  if (!providedPassword && req.body && typeof req.body === 'object') {
    providedId = req.body.adminId || providedId;
    providedPassword = req.body.password || providedPassword;
  }

  // 5. Fallback to query params if present
  if (!providedPassword && req.url && req.url.includes('?')) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      providedId = parsedUrl.searchParams.get('adminId') || providedId;
      providedPassword = parsedUrl.searchParams.get('password') || providedPassword;
    } catch {
      // ignore URL parsing error
    }
  }

  const normalizedProvidedId = (providedId || 'admin').trim().toLowerCase();
  const normalizedProvidedPassword = (providedPassword || '').trim();

  return (
    normalizedProvidedId === ADMIN_ID &&
    normalizedProvidedPassword === ADMIN_PASSWORD
  );
}

export default async function handler(req, res) {
  // Prevent any CDN / intermediate proxy caching of sensitive user metrics
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  // Allow GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed. Only GET and POST are supported.' });
  }

  // 1. Authenticate Request
  const isAuthenticated = authenticateAdmin(req);
  if (!isAuthenticated) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or missing administrator credentials.'
    });
  }

  // 2. Supabase credentials resolution (Server-side environment variables)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error: 'Database configuration missing. Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    // 3. Query all profiles (every row in the profiles table)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, created_at');

    if (profilesError) {
      console.error('Supabase profiles query error:', profilesError);
      return res.status(500).json({
        error: `Failed to query profiles: ${profilesError.message || 'Unknown database error'}`
      });
    }

    // 4. Query module completion records from module_progress
    // Query without rigid boolean filter to handle boolean, integer, or string status safely
    const { data: progressRecords, error: progressError } = await supabase
      .from('module_progress')
      .select('user_id, module_id, completed');

    if (progressError) {
      console.warn('Supabase module_progress query note:', progressError.message);
    }

    // 5. Aggregate module completion records per user
    const userCompletedMap = new Map();

    const recordCompletion = (rawUid, rawMid, rawCompleted) => {
      const isCompleted =
        rawCompleted === true ||
        rawCompleted === 'true' ||
        rawCompleted === 1 ||
        rawCompleted === '1';

      if (!isCompleted || !rawUid) return;

      const uid = String(rawUid).toLowerCase().trim();
      const mid = parseInt(rawMid, 10);
      if (isNaN(mid) || mid < 1 || mid > TOTAL_MODULES) return;

      if (!userCompletedMap.has(uid)) {
        userCompletedMap.set(uid, new Set());
      }
      userCompletedMap.get(uid).add(mid);
    };

    if (Array.isArray(progressRecords)) {
      for (const record of progressRecords) {
        if (record) {
          recordCompletion(record.user_id, record.module_id, record.completed);
        }
      }
    }

    // 5b. Check if client provided authenticated session token to read user's own progress under RLS
    const userAuthToken = req.headers['x-supabase-auth'];
    if (userAuthToken && typeof userAuthToken === 'string') {
      try {
        const userClient = createClient(supabaseUrl, supabaseKey, {
          global: {
            headers: {
              Authorization: `Bearer ${userAuthToken}`
            }
          },
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        });
        const { data: authUserProgress } = await userClient
          .from('module_progress')
          .select('user_id, module_id, completed');

        if (Array.isArray(authUserProgress)) {
          for (const rec of authUserProgress) {
            recordCompletion(rec.user_id, rec.module_id, rec.completed);
          }
        }
      } catch (authClientErr) {
        console.warn('User-authenticated client sync note:', authClientErr);
      }
    }

    // 5c. Merge client-provided local storage progress if available
    let clientProgressHeader = req.headers['x-local-progress'];
    if (!clientProgressHeader && req.body && req.body.clientProgress) {
      clientProgressHeader = req.body.clientProgress;
    }
    if (clientProgressHeader) {
      try {
        const parsedLocal = typeof clientProgressHeader === 'string'
          ? JSON.parse(clientProgressHeader)
          : clientProgressHeader;

        if (parsedLocal && typeof parsedLocal === 'object') {
          for (const [userId, moduleIds] of Object.entries(parsedLocal)) {
            if (Array.isArray(moduleIds)) {
              for (const mid of moduleIds) {
                recordCompletion(userId, mid, true);
              }
            }
          }
        }
      } catch {
        // ignore parse error
      }
    }

    // 6. Map each profile and compute completion metrics
    const users = (profiles || []).map((p) => {
      const uid = String(p.id || '').toLowerCase().trim();
      const completedSet = userCompletedMap.get(uid) || new Set();
      const completedModules = Math.min(completedSet.size, TOTAL_MODULES);
      const percentage = Math.round((completedModules / TOTAL_MODULES) * 100);

      return {
        id: p.id,
        name: (p.name || '').trim() || 'Unnamed User',
        email: (p.email || '').trim() || 'No email',
        completedModules,
        totalModules: TOTAL_MODULES,
        percentage,
        isFullyCompleted: completedModules >= TOTAL_MODULES,
        created_at: p.created_at || null
      };
    });

    // 7. Sort users alphabetically by name (case-insensitive)
    users.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );

    // 8. Calculate summary counts
    const totalUsers = users.length;
    const fullyCompletedUsers = users.filter((u) => u.completedModules >= TOTAL_MODULES).length;

    return res.status(200).json({
      summary: {
        totalUsers,
        totalModules: TOTAL_MODULES,
        fullyCompletedUsers
      },
      users
    });
  } catch (err) {
    console.error('Unexpected error in dashboard-progress endpoint:', err);
    return res.status(500).json({
      error: err.message || 'An unexpected server error occurred while retrieving dashboard data.'
    });
  }
}
