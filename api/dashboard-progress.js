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

    // 4b. Query quiz scores from quiz_scores table
    const userQuizScoreMap = new Map();
    try {
      const { data: quizRecords, error: quizError } = await supabase
        .from('quiz_scores')
        .select('user_id, highest_score');

      if (!quizError && Array.isArray(quizRecords)) {
        for (const row of quizRecords) {
          if (row && row.user_id) {
            const uid = String(row.user_id).toLowerCase().trim();
            const score = parseInt(row.highest_score, 10);
            if (!isNaN(score)) {
              userQuizScoreMap.set(uid, score);
            }
          }
        }
      }
    } catch (quizQueryErr) {
      console.warn('Supabase quiz_scores query note:', quizQueryErr.message);
    }

    // 4c. Safely check if profiles table has highest_quiz_score column
    try {
      const { data: profileScores, error: pScoresError } = await supabase
        .from('profiles')
        .select('id, highest_quiz_score');

      if (!pScoresError && Array.isArray(profileScores)) {
        for (const row of profileScores) {
          if (row && row.id && row.highest_quiz_score !== null && row.highest_quiz_score !== undefined) {
            const uid = String(row.id).toLowerCase().trim();
            const score = parseInt(row.highest_quiz_score, 10);
            if (!isNaN(score)) {
              const current = userQuizScoreMap.get(uid);
              userQuizScoreMap.set(uid, current !== undefined ? Math.max(current, score) : score);
            }
          }
        }
      }
    } catch {
      // Column may not exist yet in profiles table
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

        const { data: authUserQuiz } = await userClient
          .from('quiz_scores')
          .select('user_id, highest_score');

        if (Array.isArray(authUserQuiz)) {
          for (const rec of authUserQuiz) {
            if (rec && rec.user_id) {
              const uid = String(rec.user_id).toLowerCase().trim();
              const score = parseInt(rec.highest_score, 10);
              if (!isNaN(score)) {
                const current = userQuizScoreMap.get(uid);
                userQuizScoreMap.set(uid, current !== undefined ? Math.max(current, score) : score);
              }
            }
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

    // 5d. Merge client-provided local storage quiz scores if available
    let clientScoresHeader = req.headers['x-local-quiz-scores'];
    if (!clientScoresHeader && req.body && req.body.clientQuizScores) {
      clientScoresHeader = req.body.clientQuizScores;
    }
    if (clientScoresHeader) {
      try {
        const parsedScores = typeof clientScoresHeader === 'string'
          ? JSON.parse(clientScoresHeader)
          : clientScoresHeader;

        if (parsedScores && typeof parsedScores === 'object') {
          for (const [userId, scoreVal] of Object.entries(parsedScores)) {
            const uid = String(userId).toLowerCase().trim();
            const s = parseInt(scoreVal, 10);
            if (!isNaN(s) && s >= 0) {
              const current = userQuizScoreMap.get(uid);
              userQuizScoreMap.set(uid, current !== undefined ? Math.max(current, s) : s);
            }
          }
        }
      } catch {
        // ignore parse error
      }
    }

    // 6. Map each profile and compute completion and quiz metrics
    const users = (profiles || []).map((p) => {
      const uid = String(p.id || '').toLowerCase().trim();
      const completedSet = userCompletedMap.get(uid) || new Set();
      const completedModules = Math.min(completedSet.size, TOTAL_MODULES);
      const percentage = Math.round((completedModules / TOTAL_MODULES) * 100);
      const highestScore = userQuizScoreMap.has(uid) ? userQuizScoreMap.get(uid) : null;

      return {
        id: p.id,
        name: (p.name || '').trim() || 'Unnamed User',
        email: (p.email || '').trim() || 'No email',
        completedModules,
        totalModules: TOTAL_MODULES,
        percentage,
        isFullyCompleted: completedModules >= TOTAL_MODULES,
        highestQuizScore: highestScore,
        highestScore: highestScore,
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
    const attemptedUsers = users.filter((u) => typeof u.highestQuizScore === 'number');
    const quizzesAttempted = attemptedUsers.length;
    const avgHighestScore = quizzesAttempted > 0
      ? Number((attemptedUsers.reduce((sum, u) => sum + (u.highestQuizScore || 0), 0) / quizzesAttempted).toFixed(1))
      : null;

    return res.status(200).json({
      summary: {
        totalUsers,
        totalModules: TOTAL_MODULES,
        fullyCompletedUsers,
        quizzesAttempted,
        avgHighestScore
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
