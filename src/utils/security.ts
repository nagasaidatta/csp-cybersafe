// Client-side security, caching, normalization, and cooldown utilities for Cyber Safe

import type { LinkSafetyResult, MessageSafetyResult } from '../types';

const LINK_COOLDOWN_MS = 30000; // 30 seconds
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

const STORAGE_KEYS = {
  LINK_COOLDOWN: 'cyber_safe_link_cooldown',
  LINK_CACHE: 'cyber_safe_link_cache_v1',
  MSG_CACHE: 'cyber_safe_msg_cache_v1',
};

/**
 * Normalizes and validates user-submitted URLs.
 * Rejects non-HTTP(S) schemes, control characters, and malformed strings.
 */
export function normalizeUrl(input: string): { normalizedUrl: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { normalizedUrl: '', error: 'Please enter a website URL to analyze.' };
  }

  if (trimmed.length > 2048) {
    return { normalizedUrl: '', error: 'URL exceeds maximum length of 2048 characters.' };
  }

  // Prepend https:// if no protocol is given
  let formatted = trimmed;
  if (!/^https?:\/\//i.test(formatted)) {
    if (/^[a-z0-9+.-]+:/i.test(formatted)) {
      return { normalizedUrl: '', error: 'Unsupported URL protocol. Only standard HTTP and HTTPS links are allowed.' };
    }
    formatted = 'https://' + formatted;
  }

  try {
    const parsed = new URL(formatted);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { normalizedUrl: '', error: 'Unsupported protocol. Only http:// and https:// URLs are supported.' };
    }

    if (!parsed.hostname || parsed.hostname.includes(' ')) {
      return { normalizedUrl: '', error: 'Invalid hostname in the submitted URL.' };
    }

    // Remove default ports and hash fragment
    if (parsed.protocol === 'http:' && parsed.port === '80') parsed.port = '';
    if (parsed.protocol === 'https:' && parsed.port === '443') parsed.port = '';
    parsed.hash = '';

    return { normalizedUrl: parsed.href };
  } catch {
    return { normalizedUrl: '', error: 'Please enter a valid website URL (e.g. example.com or https://example.com).' };
  }
}

/**
 * Computes a SHA-256 hash string for caching untrusted messages without saving plain text.
 */
export async function computeSha256(text: string): Promise<string> {
  const trimmed = text.trim();
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(trimmed);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }

  // Fallback string hash
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash << 5) - hash + trimmed.charCodeAt(i);
    hash |= 0;
  }
  return 'fallback_' + Math.abs(hash).toString(16);
}

/**
 * Check if the 30-second cooldown is currently active.
 * Returns remaining seconds (> 0 if on cooldown, 0 if allowed).
 */
export function getLinkCooldownRemaining(): number {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LINK_COOLDOWN);
    if (!saved) return 0;
    const lastTime = parseInt(saved, 10);
    if (isNaN(lastTime)) return 0;

    const elapsed = Date.now() - lastTime;
    if (elapsed < LINK_COOLDOWN_MS) {
      return Math.ceil((LINK_COOLDOWN_MS - elapsed) / 1000);
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Marks the start of a 30-second cooldown for new link checks.
 */
export function markLinkCooldown(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LINK_COOLDOWN, Date.now().toString());
  } catch {
    // Storage might be unavailable
  }
}

/**
 * Retrieves cached link assessment if available and not expired.
 */
export function getCachedLinkResult(normalizedUrl: string): LinkSafetyResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LINK_CACHE);
    if (!raw) return null;
    const cacheMap: Record<string, { result: LinkSafetyResult; timestamp: number }> = JSON.parse(raw);
    const entry = cacheMap[normalizedUrl] || cacheMap[`${normalizedUrl}::en`];
    if (!entry) return null;

    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return {
        ...entry.result,
        cachedAt: entry.timestamp
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Saves a successful link assessment to browser cache.
 */
export function setCachedLinkResult(normalizedUrl: string, result: LinkSafetyResult): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LINK_CACHE);
    let cacheMap: Record<string, { result: LinkSafetyResult; timestamp: number }> = {};
    if (raw) {
      try {
        cacheMap = JSON.parse(raw);
      } catch {
        cacheMap = {};
      }
    }

    // Prune entries older than TTL
    const now = Date.now();
    for (const key of Object.keys(cacheMap)) {
      if (now - cacheMap[key].timestamp > CACHE_TTL_MS) {
        delete cacheMap[key];
      }
    }

    cacheMap[normalizedUrl] = {
      result,
      timestamp: now
    };

    localStorage.setItem(STORAGE_KEYS.LINK_CACHE, JSON.stringify(cacheMap));
  } catch {
    // Gracefully handle storage quota or privacy mode errors
  }
}

/**
 * Retrieves cached message assessment if available and not expired.
 */
export function getCachedMessageResult(hash: string): MessageSafetyResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MSG_CACHE);
    if (!raw) return null;
    const cacheMap: Record<string, { result: MessageSafetyResult; timestamp: number }> = JSON.parse(raw);
    const entry = cacheMap[hash] || cacheMap[`${hash}::en`];
    if (!entry) return null;

    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return {
        ...entry.result,
        cachedAt: entry.timestamp
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Saves a successful message assessment to browser cache (using SHA-256 hash key only, no plain text).
 */
export function setCachedMessageResult(hash: string, result: MessageSafetyResult): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MSG_CACHE);
    let cacheMap: Record<string, { result: MessageSafetyResult; timestamp: number }> = {};
    if (raw) {
      try {
        cacheMap = JSON.parse(raw);
      } catch {
        cacheMap = {};
      }
    }

    const now = Date.now();
    for (const key of Object.keys(cacheMap)) {
      if (now - cacheMap[key].timestamp > CACHE_TTL_MS) {
        delete cacheMap[key];
      }
    }

    cacheMap[hash] = {
      result,
      timestamp: now
    };

    localStorage.setItem(STORAGE_KEYS.MSG_CACHE, JSON.stringify(cacheMap));
  } catch {
    // Gracefully handle storage quota or privacy mode errors
  }
}

/**
 * Formats a model identifier to a clean, human-readable name.
 * e.g. "gemini-3.1-flash-lite" -> "Gemini 3.1 Flash Lite"
 */
export function formatModelName(model?: string): string {
  if (!model) return '';
  return model
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Checks if a submitted URL belongs to this Cyber Safe Portal itself.
 */
export function isPortalSelfUrl(url: string): boolean {
  try {
    let toParse = url.trim();
    if (!toParse) return false;
    if (!/^https?:\/\//i.test(toParse)) {
      toParse = 'https://' + toParse;
    }
    const parsed = new URL(toParse);
    const host = parsed.hostname.toLowerCase();

    // Recognize official production domain, preview domains, or current host
    if (
      host === 'csp-cybersafe.vercel.app' ||
      host.endsWith('.csp-cybersafe.vercel.app') ||
      (typeof window !== 'undefined' && window.location.hostname && host === window.location.hostname.toLowerCase())
    ) {
      return true;
    }
  } catch {
    // ignore parse error
  }
  return false;
}

/**
 * Returns an instant, pre-verified safe report for the official Cyber Safe Portal without calling external APIs.
 */
export function getPortalSelfSafetyResult(url: string): LinkSafetyResult {
  return {
    submittedUrl: url.trim(),
    classification: 'No Known Threat Detected',
    riskLevel: 'Low',
    categories: ['Verified Official Portal', 'Cybersecurity Awareness Service'],
    explanation:
      'This URL belongs to the official Cyber Safe public portal. It is safe and verified for cyber awareness and scam defense checks.',
    evidence: [
      'Official verified domain (csp-cybersafe.vercel.app)',
      'Valid encrypted HTTPS certificate on secure cloud infrastructure',
      'Non-commercial public security service with zero known threat signatures'
    ],
    translations: {
      te: {
        explanation:
          'ఈ URL అధికారిక సైబర్ సేఫ్ పబ్లిక్ పోర్టల్‌కు చెందినది. ఇది సురక్షితమైనది మరియు సైబర్ అవగాహన మరియు స్కామ్ రక్షణ తనిఖీల కోసం ధృవీకరించబడింది.',
        evidence: [
          'ధృవీకరించబడిన అధికారిక డొమైన్ (csp-cybersafe.vercel.app)',
          'సురక్షిత క్లౌడ్ మౌలిక సదుపాయాలపై చెల్లుబాటు అయ్యే ఎన్‌క్రిప్ట్ చేయబడిన HTTPS సర్టిఫికేట్',
          'ఎలాంటి ముప్పు సంకేతాలు లేని పబ్లిక్ సైబర్ సెక్యూరిటీ సేవ'
        ]
      },
      hi: {
        explanation:
          'यह URL आधिकारिक साइबर सेफ पब्लिक पोर्टल का है। यह सुरक्षित है और साइबर जागरूकता व धोखाधड़ी सुरक्षा जांच के लिए सत्यापित है।',
        evidence: [
          'सत्यापित आधिकारिक डोमेन (csp-cybersafe.vercel.app)',
          'सुरक्षित क्लाउड इन्फ्रास्ट्रक्चर पर वैध एन्क्रिप्टेड HTTPS प्रमाणपत्र',
          'बिना किसी ज्ञात खतरे के आधिकारिक सार्वजनिक सुरक्षा सेवा'
        ]
      }
    },
    limitations:
      'Verified as the official Cyber Safe portal. Verified locally with zero external API calls.'
  };
}

