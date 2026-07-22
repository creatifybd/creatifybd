/**
 * Gemini API Key Rotator & Business Study Generator
 * Uses ONLY gemini-1.5-flash (free-tier safe).
 * gemini-2.0-flash requires billing → causes 400 on free keys → REMOVED.
 * Features: per-key cooldown, 200ms delay between attempts, auto-wait when all keys busy.
 */

const GEMINI_KEYS = [
  'AIzaSyCkkNyYiHexe15FmVojJcONuq4kjGVL0_8',
  'AIzaSyB562VLVXvmmagA2KeCnESJtzpc0cJSW5o',
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

// ONLY gemini-1.5-flash — stable, free-tier, no billing required
const MODEL = 'gemini-1.5-flash';

// Per-key cooldown: keyIndex → timestamp when safe to use again
const keyCooldowns = new Array(GEMINI_KEYS.length).fill(0);

// Round-robin pointer
let activeKeyIndex = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Returns index of next available key, or -1 if all in cooldown. */
function findAvailableKey() {
  const now = Date.now();
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const idx = (activeKeyIndex + i) % GEMINI_KEYS.length;
    if (keyCooldowns[idx] <= now) return idx;
  }
  return -1;
}

/** Milliseconds until earliest cooling key recovers. */
function getMinWaitMs() {
  return Math.max(0, Math.min(...keyCooldowns) - Date.now());
}

/**
 * Call Gemini API with smart key rotation.
 *
 * Status behaviour:
 *  429 / 403  → 65s rate-limit cooldown (free RPM reset)
 *  400        → 10min cooldown (model not enabled for this key)
 *  other err  → 15s soft cooldown
 *  network    → 5s soft cooldown
 *
 * 200ms pause between each key attempt (no simultaneous hammering).
 */
export async function generateContentWithRotation(promptText, onKeySwitch = null) {
  const RATE_COOLDOWN   = 65_000;   // 65s  — free tier RPM resets
  const PERM_COOLDOWN   = 600_000;  // 10m  — 400 means model/billing blocked
  const SOFT_COOLDOWN   = 15_000;   // 15s  — other HTTP errors
  const NET_COOLDOWN    = 5_000;    // 5s   — network failures
  const ATTEMPT_DELAY   = 200;      // ms   — gap between key attempts
  const MAX_WAIT        = 130_000;  // give up if cooldown > 2min

  // Two passes: first try all keys, then wait & retry
  for (let pass = 0; pass < 2; pass++) {
    for (let attempt = 0; attempt < GEMINI_KEYS.length; attempt++) {
      const keyIdx = findAvailableKey();

      if (keyIdx === -1) {
        const waitMs = getMinWaitMs();
        if (waitMs > MAX_WAIT) {
          throw new Error(
            `All Gemini keys are rate-limited. Please wait ${Math.ceil(waitMs / 1000)}s and try again.`
          );
        }
        console.warn(`[Gemini] All keys cooling. Waiting ${Math.ceil(waitMs / 1000)}s...`);
        if (onKeySwitch) onKeySwitch(-1); // signal UI: waiting
        await sleep(waitMs + 500);
        break; // restart pass after wait
      }

      activeKeyIndex = keyIdx;
      if (onKeySwitch) onKeySwitch(keyIdx + 1);
      if (attempt > 0) await sleep(ATTEMPT_DELAY); // pace requests

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEYS[keyIdx]}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1800 },
          }),
        });

        if (res.status === 429 || res.status === 403) {
          console.warn(`[Gemini] Key ${keyIdx + 1} rate-limited (${res.status}). Cooling 65s.`);
          keyCooldowns[keyIdx] = Date.now() + RATE_COOLDOWN;
          activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
          continue;
        }

        if (res.status === 400) {
          const body = await res.json().catch(() => ({}));
          console.warn(`[Gemini] Key ${keyIdx + 1} → 400 (model not available/billing). Cooling 10min.`, body?.error?.message || '');
          keyCooldowns[keyIdx] = Date.now() + PERM_COOLDOWN;
          activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
          continue;
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.warn(`[Gemini] Key ${keyIdx + 1} HTTP ${res.status}.`, body?.error?.message || '');
          keyCooldowns[keyIdx] = Date.now() + SOFT_COOLDOWN;
          activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
          continue;
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length; // advance for next call
          return { text, keyUsed: keyIdx + 1, modelUsed: MODEL };
        }

        console.warn(`[Gemini] Key ${keyIdx + 1} returned empty response.`);
        activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;

      } catch (err) {
        console.warn(`[Gemini] Network error on key ${keyIdx + 1}:`, err.message);
        keyCooldowns[keyIdx] = Date.now() + NET_COOLDOWN;
        activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
      }
    }
  }

  const waitSec = Math.ceil(getMinWaitMs() / 1000);
  throw new Error(
    waitSec > 5
      ? `All API keys are rate-limited. Please wait ${waitSec} seconds and try again.`
      : 'AI study failed after all retries. Please try again.'
  );
}

/**
 * Deep AI business study for a lead — returns JSON with strengths, lackings,
 * a WhatsApp message and a cold email proposal.
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
    // Fallback on JSON parse failure
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
