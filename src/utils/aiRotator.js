/**
 * Multi-Provider AI Rotator
 * Priority: Groq (fastest, 14400 RPD) → OpenRouter (fallback) → Gemini (emergency)
 *
 * Keys are stored in localStorage so admin can add/remove without redeployment.
 * Hardcoded Gemini keys act as emergency fallback.
 */

// ─── HARDCODED EMERGENCY FALLBACK (Gemini) ──────────────────────────────────
const GEMINI_FALLBACK_KEYS = [
  'AIzaSyCkkNyYiHexe15FmVojJcONuq4kjGVL0_8',
  'AIzaSyAQcUqF6evILt2giIz5I-YASz7bhPOwKsU',
  'AIzaSyBiz9pkZolIhqay8OfeMXrTsv2VEiA-NVw',
  'AIzaSyCmjPkvmoWH9JIgjolAVHqzgTX_uBFt3D0',
  'AIzaSyAVJ7maopW0Z8dje4dSkiot7kSO7TPFn6A',
  'AIzaSyDqh9mthWzl3paXjJP1NHvMnRzWz_Uv03k',
  'AIzaSyASj0wR9bfuKJ0Z_NXmXkxOnVIwuKx0A5s',
  'AIzaSyDonKE0LNJ18LJIdbjFIAeuHqUk1yRVQtU',
  'AIzaSyA2RAmceCc5GZSO0wPUXjFxWIELBAxPglA',
  'AIzaSyCoLyzuh_5rFumCwtNHKNsK7HBN8-qB18w',
];

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────
const LS_GROQ_KEYS       = 'creatify_groq_keys';
const LS_OPENROUTER_KEYS = 'creatify_openrouter_keys';
const LS_GEMINI_KEYS     = 'creatify_gemini_keys';

// ─── PROVIDER CONFIGS ─────────────────────────────────────────────────────────
const PROVIDERS = {
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    models: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'],
    rpmLimit: 30,
    rpd: 14400, // for 8B model
    authHeader: (key) => `Bearer ${key}`,
    parseResponse: (data) => data?.choices?.[0]?.message?.content,
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    models: ['meta-llama/llama-3.2-3b-instruct:free', 'mistralai/mistral-7b-instruct:free'],
    rpmLimit: 20,
    rpd: 1000,
    authHeader: (key) => `Bearer ${key}`,
    extraHeaders: { 'HTTP-Referer': 'https://creatifybd.com', 'X-Title': 'CreatifyBD' },
    parseResponse: (data) => data?.choices?.[0]?.message?.content,
  },
  gemini: {
    name: 'Gemini',
    baseUrl: null, // dynamic per model
    models: ['gemini-2.0-flash-lite', 'gemini-2.0-flash'],
    rpmLimit: 15,
    rpd: 1500,
    isGemini: true,
    parseResponse: (data) => data?.candidates?.[0]?.content?.parts?.[0]?.text,
  },
};

// ─── COOLDOWN TRACKING ────────────────────────────────────────────────────────
// Map: `provider:keyIndex` → timestamp when safe to use
const cooldowns = new Map();

function setCooldown(provider, keyIdx, ms) {
  cooldowns.set(`${provider}:${keyIdx}`, Date.now() + ms);
}

function isAvailable(provider, keyIdx) {
  const expiry = cooldowns.get(`${provider}:${keyIdx}`) || 0;
  return Date.now() > expiry;
}

// ─── KEY MANAGEMENT (localStorage-backed) ────────────────────────────────────
export function getStoredKeys(provider) {
  try {
    const map = { groq: LS_GROQ_KEYS, openrouter: LS_OPENROUTER_KEYS, gemini: LS_GEMINI_KEYS };
    const raw = localStorage.getItem(map[provider]);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveKeys(provider, keys) {
  try {
    const map = { groq: LS_GROQ_KEYS, openrouter: LS_OPENROUTER_KEYS, gemini: LS_GEMINI_KEYS };
    localStorage.setItem(map[provider], JSON.stringify(keys.filter(k => k.trim())));
  } catch {}
}

function getAllKeys(provider) {
  const stored = getStoredKeys(provider);
  if (provider === 'gemini') {
    // Merge stored + hardcoded fallbacks (deduplicated)
    const combined = [...new Set([...stored, ...GEMINI_FALLBACK_KEYS])];
    return combined;
  }
  return stored;
}

// ─── ROUND-ROBIN STATE ────────────────────────────────────────────────────────
const pointers = { groq: 0, openrouter: 0, gemini: 0 };

function findAvailableKey(provider) {
  const keys = getAllKeys(provider);
  if (!keys.length) return null;
  for (let i = 0; i < keys.length; i++) {
    const idx = (pointers[provider] + i) % keys.length;
    if (isAvailable(provider, idx)) {
      pointers[provider] = idx;
      return { key: keys[idx], idx };
    }
  }
  return null; // all in cooldown
}

// ─── SLEEP ────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── CALL ONE PROVIDER ────────────────────────────────────────────────────────
async function callProvider(provider, model, promptText) {
  const cfg = PROVIDERS[provider];
  const keyObj = findAvailableKey(provider);
  if (!keyObj) return { error: 'all_cooldown', provider };

  const { key, idx } = keyObj;

  try {
    let url, body, headers;

    if (cfg.isGemini) {
      url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      body = JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1800 },
      });
      headers = { 'Content-Type': 'application/json' };
    } else {
      url = cfg.baseUrl;
      body = JSON.stringify({
        model,
        messages: [{ role: 'user', content: promptText }],
        temperature: 0.7,
        max_tokens: 1800,
      });
      headers = {
        'Content-Type': 'application/json',
        'Authorization': cfg.authHeader(key),
        ...(cfg.extraHeaders || {}),
      };
    }

    const res = await fetch(url, { method: 'POST', headers, body });

    // Success
    if (res.status === 200) {
      const data = await res.json();
      const text = cfg.parseResponse(data);
      if (text) {
        pointers[provider] = (idx + 1) % getAllKeys(provider).length;
        return { text, provider, model, keyIdx: idx + 1 };
      }
      return { error: 'empty', provider };
    }

    const errData = await res.json().catch(() => ({}));
    const errMsg  = errData?.error?.message || '';

    // Rate limit (RPM)
    if (res.status === 429) {
      const isDaily = errMsg.includes('quota') || errMsg.includes('billing') || errMsg.includes('exceeded');
      setCooldown(provider, idx, isDaily ? 86_400_000 : 65_000);
      return { error: isDaily ? 'daily_quota' : 'rpm', provider, errMsg };
    }

    // Invalid / unauthorised key
    if (res.status === 401 || (res.status === 400 && errMsg.includes('API key not valid'))) {
      setCooldown(provider, idx, 99_999_999_999); // permanent skip
      return { error: 'invalid_key', provider, errMsg };
    }

    // Model not found
    if (res.status === 404) return { error: 'model_not_found', provider };

    // Other errors
    setCooldown(provider, idx, 15_000);
    return { error: `http_${res.status}`, provider, errMsg };

  } catch (e) {
    setCooldown(provider, idx, 5_000);
    return { error: 'network', provider, errMsg: e.message };
  }
}

// ─── MAIN ROTATION FUNCTION ───────────────────────────────────────────────────
/**
 * Try providers in priority order: Groq → OpenRouter → Gemini
 * onProgress(status) — called with status object for UI updates
 */
export async function generateWithAI(promptText, onProgress = null) {
  const ATTEMPT_DELAY = 200;

  // Provider priority list
  const providerPlan = [
    { provider: 'groq',       models: PROVIDERS.groq.models },
    { provider: 'openrouter', models: PROVIDERS.openrouter.models },
    { provider: 'gemini',     models: PROVIDERS.gemini.models },
  ];

  for (const { provider, models } of providerPlan) {
    const keys = getAllKeys(provider);
    if (!keys.length) continue; // skip if no keys configured

    const cfg = PROVIDERS[provider];
    if (onProgress) onProgress({ provider: cfg.name, status: 'trying' });

    // Try each key for each model
    for (const model of models) {
      for (let attempt = 0; attempt < keys.length; attempt++) {
        if (attempt > 0) await sleep(ATTEMPT_DELAY);

        const keyObj = findAvailableKey(provider);
        if (!keyObj) break; // all keys in cooldown for this provider

        if (onProgress) onProgress({ provider: cfg.name, model, keyNum: keyObj.idx + 1, status: 'calling' });

        const result = await callProvider(provider, model, promptText);

        if (result.text) {
          return { text: result.text, provider: cfg.name, model, keyNum: result.keyIdx };
        }

        // Log and continue
        console.warn(`[AI Rotator] ${cfg.name}/${model} key${keyObj.idx + 1}: ${result.error} — ${result.errMsg || ''}`);

        if (result.error === 'all_cooldown') break;
        if (result.error === 'model_not_found') break; // try next model
      }
    }
  }

  // All providers failed
  if (onProgress) onProgress({ status: 'failed' });
  throw new Error(
    'All AI providers are currently rate-limited or unavailable. ' +
    'Add Groq API keys in Admin → AI Keys, or try again after midnight UTC.'
  );
}

// ─── PROVIDER STATUS ─────────────────────────────────────────────────────────
export function getProviderStatus() {
  return Object.entries(PROVIDERS).map(([id, cfg]) => {
    const keys = getAllKeys(id);
    const available = keys.filter((_, i) => isAvailable(id, i)).length;
    return {
      id,
      name: cfg.name,
      totalKeys: keys.length,
      availableKeys: available,
      models: cfg.models,
      rpd: cfg.rpd,
      dailyCapacity: cfg.rpd * keys.length,
    };
  });
}

// ─── BUSINESS STUDY ───────────────────────────────────────────────────────────
export async function analyzeLeadBusiness(lead, onProgress = null) {
  const prompt = `You are a Senior Growth Strategist and Creative Director at CreatifyBD (an international agency providing Branding, Social Media Management, Video Editing, and Web Design).

Perform an in-depth audit & business study for the following prospect:
- Business Name: ${lead.business_name || 'Business'}
- Business Type / Niche: ${lead.type || 'Local Business'}
- City/State: ${lead.city || ''}, ${lead.state || ''}
- Country: ${lead.country || 'International'}
- Rating: ${lead.rating || 'N/A'} (${lead.user_ratings_total || 0} reviews)
- Website: ${lead.website || 'Not provided'}
- Instagram: ${lead.instagram || 'Not provided'}
- Facebook: ${lead.facebook || 'Not provided'}
- Phone/WhatsApp: ${lead.phone_e164 || lead.phone || 'Not provided'}

Deliver a comprehensive audit covering:
1. **Strengths** (2-3): What makes this business competitive in its local market?
2. **Lackings / Pain Points** (3): Specific gaps in their digital presence — e.g. weak branding, no reels, poor website UX, no email capture.
3. **WhatsApp Outreach** (1): A friendly, personalised, non-spammy message offering CreatifyBD's free visual mockup.
4. **Cold Email** (1): Professional proposal with subject line and body.

Respond in valid JSON only (no markdown fences, no text outside JSON):
{
  "strengths": ["strength 1", "strength 2"],
  "lackings": ["lacking 1", "lacking 2", "lacking 3"],
  "whatsappMessage": "...",
  "emailSubject": "...",
  "emailBody": "..."
}`;

  const result = await generateWithAI(prompt, onProgress);

  try {
    let clean = result.text.trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const parsed = JSON.parse(clean);
    return { ...parsed, provider: result.provider, model: result.model, keyNum: result.keyNum };
  } catch {
    return {
      strengths: [`Established ${lead.type || 'business'} in ${lead.city || 'local market'}`],
      lackings: [
        'Inconsistent visual branding across platforms',
        'Website lacks mobile conversion optimisation',
        'Missing short-form video reels for social growth',
      ],
      whatsappMessage: `Hi ${lead.business_name || 'there'} team! I came across your brand while reviewing top ${lead.type || 'businesses'} in ${lead.city || 'your area'}.\n\nOur team at CreatifyBD put together 2 custom social media graphics & a quick mobile layout for you.\n\nCould I share them for free? No pitch — just want to show you the concept!`,
      emailSubject: `Quick design idea for ${lead.business_name || 'your business'}`,
      emailBody: `Hi ${lead.business_name || 'Team'},\n\nWhile reviewing top ${lead.type || 'businesses'} in ${lead.city || 'your city'}, our team at CreatifyBD spotted a chance to enhance your online presence.\n\nWe created a few complimentary mockups — would you be open to seeing them?\n\nBest,\nCreatifyBD\nhttps://creatifybd.com`,
      provider: result.provider,
      model: result.model,
      keyNum: result.keyNum,
    };
  }
}
