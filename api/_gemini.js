// Server-side Gemini API helper for Cyber Safe
// Automatically queries ModelService.ListModels to detect active, low-token Flash models.

export const DEFAULT_FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-3.8-flash'
];

let cachedAvailableModels = null;
let lastModelFetchTime = 0;

/**
 * Queries Google Gemini API ModelService.ListModels to find models supporting generateContent.
 */
export async function listAvailableModels(apiKey) {
  const now = Date.now();
  // Cache model list for 5 minutes
  if (cachedAvailableModels && now - lastModelFetchTime < 300000) {
    return cachedAvailableModels;
  }

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: {
        'x-goog-api-key': apiKey
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.models)) {
        const supported = data.models
          .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m) => m.name.replace(/^models\//, ''));

        if (supported.length > 0) {
          cachedAvailableModels = supported;
          lastModelFetchTime = now;
          return supported;
        }
      }
    }
  } catch (err) {
    console.warn('[Gemini] Model listing query failed:', err.message);
  }

  return null;
}

/**
 * Resolves the best available low-token model for the given API key.
 */
export async function resolveModel(apiKey) {
  const configured = process.env.GEMINI_MODEL?.trim();
  const available = await listAvailableModels(apiKey);

  if (available && available.length > 0) {
    // 1. If configured explicitly and available, use it
    if (configured && available.includes(configured)) {
      return { model: configured, available };
    }

    // 2. Look for best lightweight flash models in order of efficiency
    for (const pref of DEFAULT_FALLBACK_MODELS) {
      if (available.includes(pref)) {
        return { model: pref, available };
      }
    }

    // 3. Any model with "flash" in the name
    const anyFlash = available.find((m) => m.toLowerCase().includes('flash'));
    if (anyFlash) {
      return { model: anyFlash, available };
    }

    // 4. Default to first available model supporting generateContent
    return { model: available[0], available };
  }

  // Fallback if listModels could not be reached
  return {
    model: configured || 'gemini-2.5-flash',
    available: []
  };
}

// In-memory IP rate limiter for server-side link checks (1 check per 30 seconds per IP)
const ipRateLimits = new Map();

// Clean up entries older than 2 minutes every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamp] of ipRateLimits.entries()) {
    if (now - timestamp > 120000) {
      ipRateLimits.delete(ip);
    }
  }
}, 60000).unref?.();

/**
 * Extracts client IP from request headers or socket.
 */
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const firstIp = (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown-client';
}

/**
 * Verifies if the client IP is within the 30-second cooldown period.
 * Allows language switches / re-requests on the exact same target URL or message.
 * Returns { allowed: boolean, remainingSeconds: number }
 */
export function checkRateLimit(ip, cooldownMs = 30000, contextKey = null) {
  const now = Date.now();
  const entry = ipRateLimits.get(ip);
  const lastTime = typeof entry === 'object' ? entry?.time : (entry || 0);
  const lastKey = typeof entry === 'object' ? entry?.contextKey : null;
  const elapsed = now - lastTime;

  // If the user is re-requesting the exact same target (e.g. switching language), allow it!
  if (contextKey && lastKey === contextKey) {
    ipRateLimits.set(ip, { time: now, contextKey });
    return { allowed: true, remainingSeconds: 0 };
  }

  if (elapsed < cooldownMs) {
    const remainingSeconds = Math.ceil((cooldownMs - elapsed) / 1000);
    return { allowed: false, remainingSeconds };
  }

  ipRateLimits.set(ip, { time: now, contextKey });
  return { allowed: true, remainingSeconds: 0 };
}

/**
 * Executes a generateContent call against Gemini API.
 */
async function sendGenerateContent({ apiKey, model, systemInstruction, prompt, timeoutMs }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const requestPayload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
        maxOutputTokens: 800
      }
    };

    if (systemInstruction) {
      requestPayload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return { ok: response.ok, status: response.status, response };
  } catch (err) {
    clearTimeout(timeoutId);
    return { ok: false, status: err.name === 'AbortError' ? 504 : 500, error: err };
  }
}

/**
 * Calls Gemini API with automatic model resolution and graceful low-token failover.
 */
export async function callGemini({ systemInstruction, prompt, timeoutMs = 20000 }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      status: 500,
      error: 'GEMINI_API_KEY environment variable is not configured on the server. Please set GEMINI_API_KEY in your server environment variables.'
    };
  }

  const { model: primaryModel, available } = await resolveModel(apiKey);
  console.log(`[Gemini API] Selected model: ${primaryModel} (Available: ${available.length ? available.join(', ') : 'unknown'})`);

  // Try primary model first
  let execResult = await sendGenerateContent({
    apiKey,
    model: primaryModel,
    systemInstruction,
    prompt,
    timeoutMs
  });

  // If primary model failed due to 404 (not found) or 429 high demand, try alternative available flash models
  if (!execResult.ok && (execResult.status === 404 || execResult.status === 429)) {
    const candidateAlternatives = (available.length > 0 ? available : DEFAULT_FALLBACK_MODELS)
      .filter((m) => m !== primaryModel && (m.includes('flash') || m.includes('lite')));

    for (const altModel of candidateAlternatives) {
      console.log(`[Gemini API] Primary model ${primaryModel} failed (${execResult.status}). Trying fallback: ${altModel}...`);
      const altResult = await sendGenerateContent({
        apiKey,
        model: altModel,
        systemInstruction,
        prompt,
        timeoutMs
      });

      if (altResult.ok) {
        execResult = altResult;
        break;
      }
    }
  }

  // Handle final response
  if (!execResult.ok) {
    if (execResult.error) {
      return {
        success: false,
        status: execResult.status,
        error: execResult.status === 504
          ? `Analysis timed out after ${timeoutMs / 1000} seconds.`
          : `Network or internal error connecting to Gemini API: ${execResult.error.message}`
      };
    }

    const errorText = await execResult.response.text();
    let errorMessage = `Gemini API returned status ${execResult.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson?.error?.message) {
        errorMessage = errorJson.error.message;
      }
    } catch {
      // keep default text
    }

    const availableInfo = available.length > 0
      ? ` Available models on your API key: [${available.join(', ')}].`
      : '';

    return {
      success: false,
      status: execResult.status,
      error: `${errorMessage}.${availableInfo}`
    };
  }

  try {
    const data = await execResult.response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return {
        success: false,
        status: 502,
        error: 'Received empty response from Gemini model.'
      };
    }

    const cleaned = candidateText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsedResult = JSON.parse(cleaned);

    return {
      success: true,
      data: parsedResult
    };
  } catch (err) {
    return {
      success: false,
      status: 502,
      error: `Failed to parse Gemini response as JSON: ${err.message}`
    };
  }
}
