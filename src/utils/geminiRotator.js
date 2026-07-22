/**
 * Gemini API Key Rotator & Business Study Generator
 *
 * Model situation (tested 2026-07-22):
 *  - gemini-1.5-flash / 1.5-flash-8b  → 404 (removed from v1beta)
 *  - gemini-2.0-flash-lite             → 429 when quota exceeded, 200 when fresh
 *  - gemini-2.0-flash                  → 429 when quota exceeded, 200 when fresh
 *  - gemini-2.5-flash                  → 200 when available (newer keys)
 *
 * Free-tier daily quota: ~1500 req/day/key
 * RPM limit: 15 req/min/key (resets each minute)
 * Daily quota resets at midnight UTC.
 *
 * Strategy: try gemini-2.0-flash-lite first (cheapest), fall back to gemini-2.0-flash.
 */

// Valid API keys (Key 2 was invalid — removed)
const GEMINI_KEYS = [
  'AIzaSyCkkNyYiHexe15FmVojJcONuq4kjGVL0_8', // Key 1
  // Key 2 removed — "API key not valid"
  'AIzaSyAQcUqF6evILt2giIz5I-YASz7bhPOwKsU', // Key 3
  'AIzaSyBiz9pkZolIhqay8OfeMXrTsv2VEiA-NVw', // Key 4
  'AIzaSyCmjPkvmoWH9JIgjolAVHqzgTX_uBFt3D0', // Key 5
  'AIzaSyAVJ7maopW0Z8dje4dSkiot7kSO7TPFn6A', // Key 6
  'AIzaSyDqh9mthWzl3paXjJP1NHvMnRzWz_Uv03k', // Key 7
  'AIzaSyASj0wR9bfuKJ0Z_NXmXkxOnVIwuKx0A5s', // Key 8
  'AIzaSyDonKE0LNJ18LJIdbjFIAeuHqUk1yRVQtU', // Key 9
  'AIzaSyA2RAmceCc5GZSO0wPUXjFxWIELBAxPglA', // Key 10
  'AIzaSyCoLyzuh_5rFumCwtNHKNsK7HBN8-qB18w', // Key 11
];

// Models in preference order — both are free-tier on AI Studio keys
const MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash'];
const API_VERSION = 'v1beta';

// Per-key cooldown state
const keyCooldowns = new Array(GEMINI_KEYS.length).fill(0);

// Round-robin pointer
let activeKeyIndex = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findAvailableKey() {
  const now = Date.now();
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const idx = (activeKeyIndex + i) % GEMINI_KEYS.length;
    if (keyCooldowns[idx] <= now) return idx;
  }
  return -1;
}

function getMinWaitMs() {
  return Math.max(0, Math.min(...keyCooldowns) - Date.now());
}

/**
 * Call Gemini API with multi-model + multi-key rotation.
 *
 * Error handling:
 *  429 (RPM exceeded) → 65s cooldown on this key (minute resets)
 *  429 (daily quota)  → 24h cooldown on this key
 *  400 (invalid key)  → permanent skip (set to year 2099)
 *  404 (model gone)   → try next model immediately
 *  other              → 15s soft cooldown
 */
export async function generateContentWithRotation(promptText, onKeySwitch = null) {
  const RPM_COOLDOWN   = 65_000;          // 65s  — per-minute rate limit
  const DAILY_COOLDOWN = 86_400_000;      // 24h  — daily quota exceeded
  const PERM_COOLDOWN  = 99_999_999_999;  // permanent — invalid key
  const SOFT_COOLDOWN  = 15_000;          // 15s  — other errors
  const NET_COOLDOWN   = 5_000;           // 5s   — network errors
  const ATTEMPT_DELAY  = 300;             // 300ms gap between attempts
  const MAX_WAIT       = 130_000;         // give up if cooldown > 2 min

  // Two passes: try all keys with all models, then wait if needed
  for (let pass = 0; pass < 2; pass++) {
    for (let keyAttempt = 0; keyAttempt < GEMINI_KEYS.length; keyAttempt++) {
      const keyIdx = findAvailableKey();

      if (keyIdx === -1) {
        const waitMs = getMinWaitMs();
        if (waitMs > MAX_WAIT) {
          // All keys have hit daily quota — need to wait until tomorrow
          const hours = Math.ceil(waitMs / 3_600_000);
          throw new Error(
            hours > 1
              ? `Daily quota exhausted on all keys. Quota resets at midnight UTC (~${hours}h from now).`
              : `All API keys are rate-limited. Please wait ~${Math.ceil(waitMs / 60_000)} minutes.`
          );
        }
        console.warn(`[Gemini] All keys cooling. Waiting ${Math.ceil(waitMs / 1000)}s...`);
        if (onKeySwitch) onKeySwitch(-1);
        await sleep(waitMs + 500);
        break;
      }

      activeKeyIndex = keyIdx;
      if (keyAttempt > 0) await sleep(ATTEMPT_DELAY);

      // Try each model for this key
      for (const model of MODELS) {
        if (onKeySwitch) onKeySwitch(keyIdx + 1);

        try {
          const url = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${model}:generateContent?key=${GEMINI_KEYS[keyIdx]}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1800 },
            }),
          });

          if (res.status === 200) {
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
              return { text, keyUsed: keyIdx + 1, modelUsed: model };
            }
            console.warn(`[Gemini] Key ${keyIdx + 1}/${model}: empty response.`);
            continue; // try next model
          }

          const body = await res.json().catch(() => ({}));
          const errMsg = body?.error?.message || '';

          if (res.status === 429) {
            const isDaily = errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('billing');
            if (isDaily) {
              console.warn(`[Gemini] Key ${keyIdx + 1}/${model}: Daily quota exhausted. Cooling 24h.`);
              keyCooldowns[keyIdx] = Date.now() + DAILY_COOLDOWN;
            } else {
              console.warn(`[Gemini] Key ${keyIdx + 1}/${model}: RPM limited. Cooling 65s.`);
              keyCooldowns[keyIdx] = Date.now() + RPM_COOLDOWN;
            }
            break; // move to next key (this key is exhausted regardless of model)
          }

          if (res.status === 400) {
            if (errMsg.toLowerCase().includes('api key not valid') || errMsg.toLowerCase().includes('invalid')) {
              console.warn(`[Gemini] Key ${keyIdx + 1}: Invalid key. Permanently skipping.`);
              keyCooldowns[keyIdx] = Date.now() + PERM_COOLDOWN;
              break; // move to next key
            }
            console.warn(`[Gemini] Key ${keyIdx + 1}/${model}: 400 - ${errMsg}. Skipping model.`);
            continue; // try next model
          }

          if (res.status === 404) {
            console.warn(`[Gemini] ${model} not found (404). Trying next model.`);
            continue; // try next model
          }

          if (res.status === 403) {
            console.warn(`[Gemini] Key ${keyIdx + 1}: 403 - ${errMsg}. Permanently skipping.`);
            keyCooldowns[keyIdx] = Date.now() + PERM_COOLDOWN;
            break;
          }

          console.warn(`[Gemini] Key ${keyIdx + 1}/${model}: HTTP ${res.status} - ${errMsg}`);
          keyCooldowns[keyIdx] = Date.now() + SOFT_COOLDOWN;
          break;

        } catch (err) {
          console.warn(`[Gemini] Key ${keyIdx + 1}/${model}: Network error -`, err.message);
          keyCooldowns[keyIdx] = Date.now() + NET_COOLDOWN;
          break;
        }
      }

      // Move to next key
      activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
    }
  }

  const waitMs = getMinWaitMs();
  const isLong = waitMs > 3_600_000;
  throw new Error(
    isLong
      ? `Daily API quota exhausted. Resets at midnight UTC. Please try again tomorrow.`
      : waitMs > 5_000
        ? `All API keys rate-limited. Please wait ${Math.ceil(waitMs / 60_000)} min and try again.`
        : 'AI study failed. Please try again.'
  );
}

/**
 * Deep AI business study for a lead.
 */
export async function analyzeLeadBusiness(lead, onProgress = null) {
  const prompt = `You are a Senior Growth Strategist and Creative Director at CreatifyBD (an international agency providing Branding, Social Media Management, Video Editing, and Web Design).

Perform an in-depth audit & business study for the following prospect:
- Business Name: ${lead.business_name || 'Business'}
- Business Type / Niche: ${lead.type || 'Local Business'}
- City/State: ${lead.city || ''}, ${lead.state || ''}
- Country: ${lead.country || 'International'}
- Website URL: ${lead.website || 'Not provided'}
- Instagram: ${lead.instagram || 'Not provided'}
- Facebook: ${lead.facebook || 'Not provided'}
- Phone/WhatsApp: ${lead.phone_e164 || lead.phone || 'Not provided'}

Task Objectives:
1. Identify 2-3 Core Strengths of this business niche in their city.
2. Identify 3 Specific Lacking / Pain Points (e.g. outdated visual presentation, lack of mobile-friendly landing pages, irregular social posting, missing short-form video reels, weak brand consistency).
3. Draft a High-Converting, Personalized WhatsApp Outreach Message (friendly, non-spammy, offering a free visual teaser/mini mockup from CreatifyBD).
4. Draft a Professional Cold Email Proposal (compelling subject line, clear value proposition, low-friction call-to-action).

Respond strictly in valid JSON format matching this exact structure (no markdown fences or text outside JSON):
{
  "strengths": ["strength 1", "strength 2"],
  "lackings": ["lacking 1", "lacking 2", "lacking 3"],
  "whatsappMessage": "Exact text for WhatsApp outreach...",
  "emailSubject": "Subject line...",
  "emailBody": "Full email proposal body..."
}`;

  const result = await generateContentWithRotation(prompt, onProgress);

  try {
    let clean = result.text.trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const parsed = JSON.parse(clean);
    return { ...parsed, keyUsed: result.keyUsed, modelUsed: result.modelUsed };
  } catch {
    return {
      strengths: [`Established ${lead.type || 'business'} in ${lead.city || 'local market'}`],
      lackings: [
        'Inconsistent visual branding across platforms',
        'Website lacks mobile conversion optimisation',
        'Missing short-form video reels for social growth',
      ],
      whatsappMessage: `Hi ${lead.business_name || 'there'} team! I came across your brand while looking at top ${lead.type || 'businesses'} in ${lead.city || 'your area'}.\n\nOur team at CreatifyBD put together 2 custom social media graphics & a quick mobile layout idea for your brand.\n\nCould I share them here for free? No pitch — just wanted to show you the concept!`,
      emailSubject: `Quick visual design idea for ${lead.business_name || 'your business'}`,
      emailBody: `Hi ${lead.business_name || 'Team'},\n\nI hope this finds you well.\n\nWhile reviewing top ${lead.type || 'businesses'} in ${lead.city || 'your city'}, our creative team at CreatifyBD spotted an opportunity to enhance your online visual presence.\n\nWe've created a few complimentary design mockups — would you be open to a look?\n\nBest regards,\nCreatifyBD Agency\nhttps://creatifybd.com`,
      keyUsed: result.keyUsed,
      modelUsed: result.modelUsed,
    };
  }
}
