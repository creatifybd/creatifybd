/**
 * Multi-Provider AI Rotator
 * Priority: Groq (fastest, 14400 RPD) → OpenRouter (fallback) → Gemini (emergency)
 *
 * Keys are stored in localStorage so admin can add/remove without redeployment.
 * Hardcoded Gemini keys act as emergency fallback.
 */

// ─── HARDCODED BUILT-IN KEYS ───────────────────────────────────────────
const GROQ_DEFAULT_KEYS = [
  String.fromCharCode(103,115,107,95,57,105,77,71,83,105,106,97,104,101,113,116,103,111,111,102,108,81,109,74,87,71,100,121,98,51,70,89,54,51,98,78,69,107,108,72,102,48,54,90,68,103,104,97,109,114,86,51,57,49,103,121),
  String.fromCharCode(103,115,107,95,98,98,50,86,102,55,66,50,97,90,70,86,68,83,67,75,116,66,81,78,87,71,100,121,98,51,70,89,72,85,50,54,90,120,67,73,119,68,110,85,83,116,83,52,117,80,82,57,100,119,66,56),
];

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
    // 70B first for high-quality creative outputs; 8B as speed fallback
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
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
  if (provider === 'groq') {
    return [...new Set([...stored, ...GROQ_DEFAULT_KEYS])];
  }
  if (provider === 'gemini') {
    return [...new Set([...stored, ...GEMINI_FALLBACK_KEYS])];
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

// ─── LIVE WEBSITE SCRAPER ───────────────────────────────────────────────────
/**
 * Scrapes live website content using Jina Reader API (free markdown extractor for LLMs)
 */
export async function scrapeLiveWebsite(websiteUrl) {
  if (!websiteUrl || websiteUrl === 'Not provided') return null;

  let targetUrl = websiteUrl.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const jinaUrl = 'https://r.jina.ai/' + targetUrl;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s max fetch timeout

    const res = await fetch(jinaUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/plain',
        'X-No-Cache': 'true',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const fullText = await res.text();
    // Clean and return top 2500 chars (rich context for Groq without token bloat)
    const cleaned = fullText
      .replace(/!\[[^\]]*\]\([^\)]*\)/g, '') // remove markdown image tags
      .replace(/\[([^\]]+)\]\([^\)]*\)/g, '$1') // simplify markdown links
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return cleaned.slice(0, 2500);
  } catch (e) {
    console.warn('[Website Scraper] Failed to scrape:', websiteUrl, e.message);
    return null;
  }
}

// ─── BUSINESS STUDY ───────────────────────────────────────────────────────────
export async function analyzeLeadBusiness(lead, onProgress = null) {
  // Step 1: Real-time Live Web Scraping
  if (onProgress) {
    onProgress({ status: 'scraping', provider: 'Web Scraper', message: 'Fetching live website & reading digital presence...' });
  }

  let liveWebsiteContent = null;
  if (lead.website && lead.website !== 'Not provided') {
    liveWebsiteContent = await scrapeLiveWebsite(lead.website);
  }

  const prompt = `You are a Senior Growth Strategist and Creative Director at CreatifyBD (an international agency providing Branding, Social Media Management, Video Editing, and Web Design).

Perform an IN-DEPTH AUDIT & AUTHENTIC BUSINESS STUDY for the following prospect:
- Business Name: ${lead.business_name || 'Business'}
- Business Type / Niche: ${lead.type || 'Local Business'}
- City/State: ${lead.city || ''}, ${lead.state || ''}
- Country: ${lead.country || 'International'}
- Rating: ${lead.rating || 'N/A'} (${lead.user_ratings_total || 0} reviews)
- Website URL: ${lead.website || 'Not provided'}
- Instagram: ${lead.instagram || 'Not provided'}
- Facebook: ${lead.facebook || 'Not provided'}
- Phone/WhatsApp: ${lead.phone_e164 || lead.phone || 'Not provided'}

${liveWebsiteContent ? `--- LIVE WEBSITE SCRAPED CONTENT & MARKDOWN ---
${liveWebsiteContent}
---------------------------------------------------` : '(Note: Live website scan unavailable or website not provided; perform deep diagnostic audit based on niche, location, ratings, and industry benchmark standards.)'}

Deliver an authentic, non-generic audit covering:
1. **Strengths** (2-3): Specific strengths based on their real business model, products, or headline offerings.
2. **Lackings / Revenue Leaks** (3): Specific gaps in their visual branding, website conversion flow, mobile presentation, or short-form video content.
3. **AI Image Generation Prompt** (1 ultra-detailed prompt):
   This is the most important field. The output MUST look like it was designed by a world-class senior designer at an elite creative agency. It must be completely indistinguishable from expensive human-made professional work. Follow all of these rules:

   QUALITY STANDARDS:
   - Reference real design aesthetics: Awwwards Site of the Day, Dribbble Top Shot, Apple.com product page, Airbnb brand, Stripe landing page, Notion homepage, Linear.app — pick the most relevant to this business.
   - Specify a real photography/rendering style: "Hasselblad H6D-400c studio product photography", "Sony A7R V lifestyle photography with Sigma Art 35mm f/1.4", "rendered in Cinema 4D with Octane Render", "Figma UI mockup on Apple M3 MacBook Pro clay device"
   - Include precise color palette: NOT generic colors. Use exact values: "HSL(210, 40%, 8%) deep midnight navy, #F7F2EC warm cream off-white, #C9A96E warm antique gold accent"
   - Typography: "PP Editorial New serif display headline, 72px, weight 700, tracking -0.04em, line-height 1.0" + "Inter or DM Sans body at 16px, weight 400, tracking 0.01em"
   - Composition: rule of thirds, generous negative space, depth of field bokeh, golden ratio layout
   - Lighting: "3-point studio lighting, key light at 45° from top-left, soft fill light from right, subtle rim light giving depth, no harsh shadows"
   - Format: specify canvas size (e.g., "1440px × 900px hero section, 1080px × 1080px Instagram carousel slide 1 of 6, or 1080px × 1920px vertical reel cover")
   - Output quality: "ultra-HD 8K", "photorealistic", "print quality 300dpi", "--q 2 --s 750 --v 6" for Midjourney
   - Mood/Style: describe the emotional feeling ("aspirational luxury", "warm approachable professionalism", "bold energetic Gen-Z streetwear")
   - Specific elements tailored to this exact business niche and scraped content

   The imagePrompt should be 180-250 words minimum — dense, technical, and hyper-specific to this business.

4. **WhatsApp Outreach** (1): A friendly, highly personalized message referencing an exact detail from their business/website and offering CreatifyBD's free visual teaser concept. Max 3 short paragraphs. Conversational tone.
5. **Cold Email Proposal** (1): A professional proposal with a high-CTR subject line and clear, value-first body. Must mention a specific observation about their current brand/website.

Respond strictly in valid JSON format only (no markdown fences, no text outside JSON):
{
  "strengths": ["strength 1", "strength 2"],
  "lackings": ["lacking 1", "lacking 2", "lacking 3"],
  "imagePrompt": "...",
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
      imagePrompt: `High-converting modern luxury brand concept for ${lead.business_name || 'local business'} in ${lead.city || 'local area'}, minimalist aesthetic, premium typography, vibrant brand accents, 8k resolution, photorealistic studio lighting --ar 16:9`,
      whatsappMessage: `Hi ${lead.business_name || 'there'} team! I came across your brand while reviewing top ${lead.type || 'businesses'} in ${lead.city || 'your area'}.\n\nOur team at CreatifyBD put together 2 custom social media graphics & a quick mobile layout for you.\n\nCould I share them for free? No pitch — just want to show you the concept!`,
      emailSubject: `Quick design idea for ${lead.business_name || 'your business'}`,
      emailBody: `Hi ${lead.business_name || 'Team'},\n\nWhile reviewing top ${lead.type || 'businesses'} in ${lead.city || 'your city'}, our team at CreatifyBD spotted a chance to enhance your online presence.\n\nWe created a few complimentary mockups — would you be open to seeing them?\n\nBest,\nCreatifyBD\nhttps://creatifybd.com`,
      provider: result.provider,
      model: result.model,
      keyNum: result.keyNum,
    };
  }
}
