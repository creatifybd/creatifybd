/**
 * Gemini API Key Rotator & Business Study Generator
 * Smart rotation: per-key cooldown tracking, exponential backoff, no simultaneous hammering.
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

// Only use free-tier reliable models
const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
];

// Per-key cooldown tracking: keyIndex -> timestamp when it's safe to retry
const keyCooldowns = new Array(GEMINI_KEYS.length).fill(0);

// Which key to start from (persists across calls in session)
let activeKeyIndex = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Find the next available key that is not in cooldown.
 * Returns the key index, or -1 if all are in cooldown.
 */
function findAvailableKey() {
  const now = Date.now();
  // Try from activeKeyIndex first (round-robin with cooldown awareness)
  for (let offset = 0; offset < GEMINI_KEYS.length; offset++) {
    const idx = (activeKeyIndex + offset) % GEMINI_KEYS.length;
    if (keyCooldowns[idx] <= now) {
      return idx;
    }
  }
  return -1; // all in cooldown
}

/**
 * Get the minimum wait time until any key becomes available.
 */
function getMinWaitMs() {
  const now = Date.now();
  const minCooldown = Math.min(...keyCooldowns);
  return Math.max(0, minCooldown - now);
}

/**
 * Call Gemini API with smart key rotation — cooldown tracking + backoff.
 */
export async function generateContentWithRotation(promptText, onKeySwitch = null) {
  const COOLDOWN_MS = 65_000; // 65 seconds (Gemini free tier: 15 RPM, resets each minute)
  const MAX_WAIT_MS = 130_000; // max 2 mins total wait before giving up

  for (let round = 0; round < 3; round++) {
    // Try every key once per round
    for (let attempt = 0; attempt < GEMINI_KEYS.length; attempt++) {
      const keyIdx = findAvailableKey();

      if (keyIdx === -1) {
        // All keys in cooldown — wait for the earliest one to recover
        const waitMs = getMinWaitMs();
        if (waitMs > MAX_WAIT_MS) {
          throw new Error(
            'All 11 Gemini API keys are in cooldown. Please wait ~1 minute and try again.'
          );
        }
        console.warn(`[Gemini Rotator] All keys cooling down. Waiting ${Math.ceil(waitMs / 1000)}s...`);
        if (onKeySwitch) onKeySwitch(-1); // signal: waiting
        await sleep(waitMs + 500);
        continue;
      }

      activeKeyIndex = keyIdx;
      const currentKey = GEMINI_KEYS[keyIdx];
      // Alternate model each attempt for variety
      const currentModel = GEMINI_MODELS[attempt % GEMINI_MODELS.length];

      if (onKeySwitch) onKeySwitch(keyIdx + 1);

      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${currentKey}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1800,
            },
          }),
        });

        if (response.status === 429 || response.status === 403) {
          // Rate limited — put this key into cooldown
          console.warn(`[Gemini Rotator] Key ${keyIdx + 1} (${currentModel}) rate limited (${response.status}). Cooling down for 65s.`);
          keyCooldowns[keyIdx] = Date.now() + COOLDOWN_MS;
          // Move to next key
          activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
          continue;
        }

        if (response.status === 400) {
          // Bad request — try next model, not a rate limit issue
          console.warn(`[Gemini Rotator] Key ${keyIdx + 1} model ${currentModel} returned 400. Trying next model.`);
          activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.warn(`[Gemini Rotator] API Error on key ${keyIdx + 1}:`, errorData);
          keyCooldowns[keyIdx] = Date.now() + 10_000; // 10s soft cooldown
          activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
          continue;
        }

        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          // Success — move to next key for next call (distribute load)
          activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
          return {
            text: candidateText,
            keyUsed: keyIdx + 1,
            modelUsed: currentModel,
          };
        }

        // Empty response
        console.warn(`[Gemini Rotator] Key ${keyIdx + 1} returned empty response.`);
        activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
        continue;

      } catch (err) {
        console.warn(`[Gemini Rotator] Network error on key ${keyIdx + 1}:`, err.message);
        keyCooldowns[keyIdx] = Date.now() + 5_000; // 5s soft cooldown on network err
        activeKeyIndex = (keyIdx + 1) % GEMINI_KEYS.length;
        continue;
      }
    }
  }

  const waitMs = getMinWaitMs();
  throw new Error(
    waitMs > 0
      ? `All Gemini API keys are rate-limited. Please wait ${Math.ceil(waitMs / 1000)} seconds and try again.`
      : 'All Gemini API keys failed. Please try again in a moment.'
  );
}

/**
 * Conducts a deep AI business study for a given lead.
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
    let cleanJson = result.text.trim();
    // Strip markdown code fences if present
    cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);
    return {
      ...parsed,
      keyUsed: result.keyUsed,
      modelUsed: result.modelUsed,
    };
  } catch (err) {
    console.error('[Gemini Rotator] Failed to parse JSON response:', result.text);
    // Fallback with generic content
    return {
      strengths: [`Established ${lead.type || 'business'} in ${lead.city || 'local market'}`],
      lackings: [
        'Inconsistent visual branding across platforms',
        'Website lacks mobile conversion optimization',
        'Opportunity to capture more leads with short-form video reels',
      ],
      whatsappMessage: `Hi ${lead.business_name || 'there'} team! I was looking at top ${lead.type || 'businesses'} in ${lead.city || 'your area'} and noticed your brand. Loved your reviews!\n\nOur design team at CreatifyBD put together 2 custom social media graphics & a quick mobile layout idea tailored for your brand.\n\nCould I drop them here for you to review for free? No pitch, just wanted to share the visual concepts!`,
      emailSubject: `Quick visual design idea for ${lead.business_name || 'your business'}`,
      emailBody: `Hi ${lead.business_name || 'Team'},\n\nI hope this email finds you well.\n\nWhile reviewing top ${lead.type || 'businesses'} in ${lead.city || 'your city'}, our creative team at CreatifyBD noticed an opportunity to enhance your online visual presence and conversion flow.\n\nWe've created a few complimentary visual design mockups showing how a refreshed social feed and landing layout could increase your monthly client inquiries.\n\nWould you be open to taking a look at the concepts? I'd be happy to send them over.\n\nBest regards,\nCreatifyBD Agency Team\nhttps://creatifybd.com`,
      keyUsed: result.keyUsed,
      modelUsed: result.modelUsed,
    };
  }
}
