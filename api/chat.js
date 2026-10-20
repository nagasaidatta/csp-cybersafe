// Serverless endpoint: CyberSafe AI Chat powered by Groq API
// Specialized in cybersecurity, scam awareness, and CyberSafe portal guidance.
// Supports English, Telugu (తెలుగు), and Hindi (हिन्दी) with interactive page redirection links.

import fs from 'fs';
import path from 'path';
import { getClientIp, checkRateLimit } from './_gemini.js';

const SYSTEM_PROMPT = `You are "CyberSafe AI" (సైబర్‌సేఫ్ AI / साइबरसेफ AI), the official cybersecurity assistant for the "CyberSafe" portal.

WHO DEVELOPED CYBERSAFE & HISTORY:
- Creators: CyberSafe and CyberSafe AI were created and developed by engineering students of Sri Vasavi Engineering College (SVEC).
- The student team consists of 15 members:
  B. Naga Sai Datta, K. Balu, M. Sai Ravi Teja, P. Symon, R. Pavan Narasimha, A. Supriya, Ch. Gopika, Ch. Manisha, M. Sumanaswi, O. Dhathri, P. Bhavya sri, Sk. Sharmila, V. Gayathri Sai, V. Geethika, and V. Santhi Reddy.
- STRICT RULE ON CREATORS:
  * NEVER mention only a single person or "so-and-so and their team". All members contributed equally.
  * In general answers (e.g. "Who developed you?"), state that it was developed collaboratively by "engineering students of Sri Vasavi Engineering College (SVEC)".
  * If the user specifically asks for all team members or names, list all 15 members completely. Never highlight a single individual alone.
- History: Created as a collaborative student initiative at Sri Vasavi Engineering College to protect citizens from online financial scams, phishing websites, OTP theft, and UPI fraud.

EXACT CYBERSAFE WEBSITE TOOLS & FUNCTIONALITY:
1. Link Safety Checker (route: #link-safety):
   - Uses AI to scan any web link or URL for phishing, fake bank portals, and malware -> [Open Link Safety Checker](#link-safety)
2. Message Safety Checker (route: #message-safety):
   - Analyzes suspicious SMS, WhatsApp forwards, electricity cutoff alerts, lottery prizes, and fake job messages -> [Open Message Safety Checker](#message-safety)
3. Password Checker (route: #password-checker):
   - Evaluates password strength, crack time, and entropy with instant tips -> [Open Password Checker](#password-checker)
4. Interactive Learning Modules (route: #modules):
   - Exactly 4 official awareness modules:
     * Module 1: Phishing Websites
     * Module 2: Strong Passwords
     * Module 3: OTP Sharing Scams
     * Module 4: UPI & QR Code Scams
   - Completing all 4 modules unlocks the quiz -> [Start Learning Modules](#modules)
5. Cyber Awareness Quiz (route: #quiz):
   - 10 interactive practical questions to test your scam detection IQ and record your high score -> [Take Cyber Quiz](#quiz)
6. User Profile & Avatars (route: #profile, edit: #edit-profile):
   - View completed modules, quiz records, and choose from exactly 10 unique avatars -> [View Profile](#profile)
7. Dashboard (route: #dashboard):
   - Admin view displaying aggregated learner statistics -> [View Dashboard](#dashboard)
8. Emergency Help in India:
   - National Cyber Crime Helpline: 1930 (Toll-Free 24x7)
   - Official Portal: https://cybercrime.gov.in
   - Golden Hour: Report within 2 hours to freeze stolen money!

STRICT BOUNDARY & REFUSAL RULES:
- You ONLY answer questions about cybersecurity, scams, fraud prevention, and this CyberSafe portal.
- If asked about irrelevant topics (movies, cricket, cooking, politics, homework, etc.), strictly refuse in 1 polite sentence and prompt the user to ask about cybersecurity or our portal tools.

MANDATORY RESPONSE STYLE (CRITICAL):
- Provide 1–2 short conversational sentences with clear action steps (under 50-70 words total).
- Use simple, friendly, everyday words that anyone can easily understand.
- NEVER write long essays, giant paragraphs, or markdown tables.
- Respond in the language used by the user: English, Telugu (తెలుగు), or Hindi (हिन्दी).`;

const CANDIDATE_GROQ_MODELS = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant'
];

let cachedAvailableGroqModels = null;
let lastGroqModelFetch = 0;

/**
 * Dynamically resolves the Groq API key from request, process.env, or .env.local on disk.
 */
function resolveGroqKey(req) {
  const headerKey = req.headers?.['x-groq-api-key'];
  if (headerKey && typeof headerKey === 'string' && headerKey.trim()) {
    return headerKey.trim();
  }

  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim()) {
    return process.env.GROQ_API_KEY.trim();
  }
  if (process.env.VITE_GROQ_API_KEY && process.env.VITE_GROQ_API_KEY.trim()) {
    return process.env.VITE_GROQ_API_KEY.trim();
  }

  // Read .env.local dynamically in case the dev server was started before .env.local was updated
  try {
    const cwd = process.cwd();
    const files = ['.env.local', '.env'];
    for (const f of files) {
      const p = path.resolve(cwd, f);
      if (fs.existsSync(p)) {
        const text = fs.readFileSync(p, 'utf8');
        const match = text.match(/^GROQ_API_KEY\s*=\s*([^\r\n#]+)/m);
        if (match && match[1]) {
          const val = match[1].trim().replace(/^['"]|['"]$/g, '');
          if (val) {
            process.env.GROQ_API_KEY = val;
            return val;
          }
        }
      }
    }
  } catch {
    // ignore
  }

  return '';
}

/**
 * Queries Groq's active model list to avoid 404s on deprecated models.
 */
async function getGroqModels(apiKey) {
  const now = Date.now();
  if (cachedAvailableGroqModels && now - lastGroqModelFetch < 300000) {
    return cachedAvailableGroqModels;
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data)) {
        const chatModels = data.data
          .map((m) => m.id)
          .filter((id) => !id.includes('whisper') && !id.includes('prompt-guard'));
        if (chatModels.length > 0) {
          cachedAvailableGroqModels = chatModels;
          lastGroqModelFetch = now;
          return chatModels;
        }
      }
    }
  } catch (err) {
    console.warn('[Groq API] Could not list models:', err.message);
  }

  return CANDIDATE_GROQ_MODELS;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Only POST is supported.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON request body.' });
    }
  }

  const { messages, userLanguage = 'en' } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  // Rate limiting (1 request per 1 second per IP)
  const clientIp = getClientIp(req);
  const rateCheck = checkRateLimit(clientIp + '_chat', 1000);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: `Please wait ${rateCheck.remainingSeconds} seconds before sending another message.`,
      remainingSeconds: rateCheck.remainingSeconds
    });
  }

  const apiKey = resolveGroqKey(req);

  // Format messages
  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.slice(-6).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content || '').slice(0, 3000)
    }))
  ];

  // If Groq API Key is present, call Groq API with auto-detected models
  if (apiKey) {
    const available = await getGroqModels(apiKey);
    const configuredModel = (process.env.GROQ_MODEL || 'qwen/qwen3.8-27b').trim();

    const modelsToTry = [
      configuredModel,
      ...CANDIDATE_GROQ_MODELS.filter((m) => available.includes(m)),
      ...available
    ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages: formattedMessages,
            temperature: 0.2,
            max_tokens: 220
          })
        });

        if (!groqResponse.ok) {
          const errorText = await groqResponse.text();
          let errMsg = `Groq status ${groqResponse.status}`;
          try {
            const errJson = JSON.parse(errorText);
            if (errJson?.error?.message) errMsg = errJson.error.message;
          } catch {
            // ignore
          }
          lastError = errMsg;
          console.warn(`[Groq API] Model ${model} failed (${groqResponse.status}): ${errMsg}`);
          continue;
        }

        const data = await groqResponse.json();
        const content = data?.choices?.[0]?.message?.content?.trim();

        if (content) {
          const redirects = extractRedirects(content);
          return res.status(200).json({
            success: true,
            model,
            message: { role: 'assistant', content },
            redirects
          });
        }
      } catch (err) {
        lastError = err.message;
        console.warn(`[Groq API] Network error for model ${model}:`, err.message);
      }
    }
  }

  // Fallback 1: Call Gemini API if GEMINI_API_KEY is configured
  const geminiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
  if (geminiKey) {
    try {
      const geminiResult = await callGeminiChat(formattedMessages, geminiKey);
      if (geminiResult) {
        const redirects = extractRedirects(geminiResult);
        return res.status(200).json({
          success: true,
          model: 'gemini-fallback',
          message: { role: 'assistant', content: geminiResult },
          redirects
        });
      }
    } catch (err) {
      console.warn('[Gemini Fallback] Failed:', err.message);
    }
  }

  // Fallback 2: Accurate context-aware fallback with creator details
  const userPrompt = messages[messages.length - 1]?.content || '';
  const fallbackResponse = getContextualFallback(userPrompt, userLanguage);

  return res.status(200).json({
    success: true,
    model: 'fallback',
    message: fallbackResponse,
    redirects: fallbackResponse.redirects
  });
}

/**
 * Calls Gemini generateContent for dynamic AI answers if Groq is temporarily down.
 */
async function callGeminiChat(formattedMessages, apiKey) {
  const lastUserMsg = formattedMessages.filter((m) => m.role === 'user').pop()?.content || '';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question:\n${lastUserMsg}` }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 200 }
    })
  });

  if (res.ok) {
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  }
  return null;
}

/**
 * Extracts recognized portal page hash redirects from the AI's response text.
 */
function extractRedirects(text) {
  const matches = [];
  const validViews = [
    { hash: '#link-safety', view: 'link-safety', label: '🔗 Open Link Safety Checker' },
    { hash: '#message-safety', view: 'message-safety', label: '💬 Open Message Safety Checker' },
    { hash: '#password-checker', view: 'password-checker', label: '🔑 Open Password Checker' },
    { hash: '#modules', view: 'modules', label: '🎓 Start Learning Modules' },
    { hash: '#quiz', view: 'quiz', label: '📝 Take Cyber Quiz' },
    { hash: '#dashboard', view: 'dashboard', label: '📊 View Dashboard' },
    { hash: '#profile', view: 'profile', label: '👤 View Profile' }
  ];

  for (const item of validViews) {
    if (text.includes(item.hash)) {
      matches.push(item);
    }
  }

  return matches;
}

/**
 * Contextual fallback for distinct inquiries with exact creator and website accuracy.
 */
function getContextualFallback(userPrompt, lang = 'en') {
  const lower = (userPrompt || '').toLowerCase();

  // Questions about creators / who developed you / history
  if (
    lower.includes('who developed') ||
    lower.includes('who made') ||
    lower.includes('who created') ||
    lower.includes('developer') ||
    lower.includes('history') ||
    lower.includes('ఎవరు తయారు') ||
    lower.includes('ఎవరు డెవలప్') ||
    lower.includes('किसने बनाया') ||
    lower.includes('निर्माता')
  ) {
    if (lang === 'te') {
      return {
        role: 'assistant',
        content: `నన్ను మరియు ఈ CyberSafe వెబ్‌సైట్‌ను **శ్రీ వాసవి ఇంజనీరింగ్ కాలేజీ (SVEC)** ఇంజనీరింగ్ విద్యార్థుల బృందం ప్రజలను ఆన్‌లైన్ మోసాల నుండి రక్షించడానికి అభివృద్ధి చేశారు.`,
        redirects: [{ hash: '#modules', view: 'modules', label: '🎓 Start Learning Modules' }]
      };
    }
    if (lang === 'hi') {
      return {
        role: 'assistant',
        content: `मुझे और इस CyberSafe पोर्टल को **श्री वास्वी इंजीनियरिंग कॉलेज (SVEC)** के इंजीनियरिंग छात्रों के दल ने नागरिकों को ऑनलाइन फ्रॉड से बचाने के लिए बनाया है।`,
        redirects: [{ hash: '#modules', view: 'modules', label: '🎓 Start Learning Modules' }]
      };
    }
    return {
      role: 'assistant',
      content: `I and the CyberSafe portal were developed by engineering students of **Sri Vasavi Engineering College (SVEC)** to protect citizens from digital fraud and online scams.`,
      redirects: [{ hash: '#modules', view: 'modules', label: '🎓 Start Learning Modules' }]
    };
  }

  // Refusal for irrelevant queries
  const isIrrelevant = [
    'recipe', 'cook', 'cake', 'biryani', 'movie', 'actor', 'cinema',
    'cricket', 'football', 'ipl', 'song', 'weather', 'president', 'election',
    'joke', 'solve 2+2', 'capital of', 'tallest mountain'
  ].some((w) => lower.includes(w));

  if (isIrrelevant) {
    if (lang === 'te') {
      return {
        role: 'assistant',
        content: `నేను కేవలం సైబర్ సెక్యూరిటీ, ఆన్‌లైన్ మోసాలు మరియు మన సైబర్‌సేఫ్ పోర్టల్ సేవలపై మాత్రమే సమాధానాలు ఇవ్వగలను. దయచేసి సైబర్ భద్రత గురించి అడగండి.`,
        redirects: []
      };
    }
    if (lang === 'hi') {
      return {
        role: 'assistant',
        content: `मैं केवल साइबर सुरक्षा, ऑनलाइन धोखाधड़ी और हमारे साइबरसेफ पोर्टल के बारे में ही जानकारी दे सकता हूँ। कृपया साइबर सुरक्षा से जुड़ा प्रश्न पूछें।`,
        redirects: []
      };
    }
    return {
      role: 'assistant',
      content: `I specialize exclusively in cybersecurity and the CyberSafe portal. Please ask me about online scams, passwords, or our portal tools.`,
      redirects: []
    };
  }

  // Link safety inquiry
  if (lower.includes('link') || lower.includes('url') || lower.includes('website') || lower.includes('లింక్') || lower.includes('लिंक')) {
    return {
      role: 'assistant',
      content: `You can check any suspicious link for phishing and scams using our AI scanner: [Open Link Safety Checker](#link-safety).`,
      redirects: [{ hash: '#link-safety', view: 'link-safety', label: '🔗 Open Link Safety Checker' }]
    };
  }

  // Message safety inquiry
  if (lower.includes('message') || lower.includes('sms') || lower.includes('whatsapp') || lower.includes('otp') || lower.includes('సందేశం') || lower.includes('संदेश')) {
    return {
      role: 'assistant',
      content: `To verify if an SMS or WhatsApp alert is fraudulent, test it here: [Open Message Safety Checker](#message-safety).`,
      redirects: [{ hash: '#message-safety', view: 'message-safety', label: '💬 Open Message Safety Checker' }]
    };
  }

  // Password inquiry
  if (lower.includes('password') || lower.includes('పాస్‌వర్డ్') || lower.includes('पासवर्ड')) {
    return {
      role: 'assistant',
      content: `Test how strong your password is and estimate its crack time: [Open Password Checker](#password-checker).`,
      redirects: [{ hash: '#password-checker', view: 'password-checker', label: '🔑 Open Password Checker' }]
    };
  }

  // Modules inquiry
  if (lower.includes('module') || lower.includes('learn') || lower.includes('course') || lower.includes('పాఠం') || lower.includes('पाठ')) {
    return {
      role: 'assistant',
      content: `CyberSafe has 4 video modules: Phishing Websites, Strong Passwords, OTP Scams, and UPI Fraud. Start here: [Start Learning Modules](#modules).`,
      redirects: [{ hash: '#modules', view: 'modules', label: '🎓 Start Learning Modules' }]
    };
  }

  // Quiz inquiry
  if (lower.includes('quiz') || lower.includes('test') || lower.includes('క్విజ్') || lower.includes('क्विज')) {
    return {
      role: 'assistant',
      content: `Test your scam-spotting IQ with our 10-question evaluation: [Take Cyber Quiz](#quiz).`,
      redirects: [{ hash: '#quiz', view: 'quiz', label: '📝 Take Cyber Quiz' }]
    };
  }

  // Emergency / 1930
  if (lower.includes('1930') || lower.includes('report') || lower.includes('stolen') || lower.includes('lost money') || lower.includes('మోసం')) {
    return {
      role: 'assistant',
      content: `If defrauded, call **1930** immediately within 2 hours to freeze stolen money, and report at [cybercrime.gov.in](https://cybercrime.gov.in).`,
      redirects: []
    };
  }

  return {
    role: 'assistant',
    content: `I am **CyberSafe AI**. You can ask me how to check links, detect scam messages, or explore our [Learning Modules](#modules).`,
    redirects: [
      { hash: '#link-safety', view: 'link-safety', label: '🔗 Link Safety' },
      { hash: '#message-safety', view: 'message-safety', label: '💬 Message Safety' }
    ]
  };
}
