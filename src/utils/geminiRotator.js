/**
 * Gemini API Key Rotator & Business Study Generator
 * Rotates across 11 Google Gemini API keys to guarantee zero rate-limit downtime.
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
  'AIzaSyCoLyzuh_5rFumCwtNHKNsK7HBN8-qB18w'
];

// Models to try in order of preference
const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-pro'
];

let activeKeyIndex = 0;

/**
 * Call Gemini API with automatic key rotation and model fallback.
 */
export async function generateContentWithRotation(promptText, onKeySwitch = null) {
  let attempts = 0;
  const maxAttempts = GEMINI_KEYS.length * GEMINI_MODELS.length;

  while (attempts < maxAttempts) {
    const currentKey = GEMINI_KEYS[activeKeyIndex];
    const currentModel = GEMINI_MODELS[attempts % GEMINI_MODELS.length];

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
          }
        })
      });

      if (response.status === 429 || response.status === 403 || response.status === 400) {
        console.warn(`[Gemini Rotator] Key ${activeKeyIndex + 1} (${currentModel}) returned status ${response.status}. Rotating key...`);
        activeKeyIndex = (activeKeyIndex + 1) % GEMINI_KEYS.length;
        if (onKeySwitch) onKeySwitch(activeKeyIndex + 1);
        attempts++;
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`[Gemini Rotator] API Error on key ${activeKeyIndex + 1}:`, errorData);
        activeKeyIndex = (activeKeyIndex + 1) % GEMINI_KEYS.length;
        attempts++;
        continue;
      }

      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        return {
          text: candidateText,
          keyUsed: activeKeyIndex + 1,
          modelUsed: currentModel
        };
      }
    } catch (err) {
      console.warn(`[Gemini Rotator] Network error on key ${activeKeyIndex + 1}:`, err);
      activeKeyIndex = (activeKeyIndex + 1) % GEMINI_KEYS.length;
      attempts++;
    }
  }

  throw new Error('All 11 Gemini API keys reached rate limits or failed. Please try again in a few moments.');
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
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }
    const parsed = JSON.parse(cleanJson);
    return {
      ...parsed,
      keyUsed: result.keyUsed,
      modelUsed: result.modelUsed
    };
  } catch (err) {
    console.error('[Gemini Rotator] Failed to parse JSON response:', result.text);
    return {
      strengths: [`Established ${lead.type || 'business'} in ${lead.city || 'local market'}`],
      lackings: [
        'Inconsistent visual branding across platforms',
        'Website lacks mobile conversion optimization',
        'Opportunity to capture more leads with short-form video reels'
      ],
      whatsappMessage: `Hi ${lead.business_name || 'there'} team! I was looking at top ${lead.type || 'businesses'} in ${lead.city || 'your area'} and noticed your brand. Loved your reviews!\n\nOur design team at CreatifyBD put together 2 custom social media graphics & a quick mobile layout idea tailored for your brand.\n\nCould I drop them here for you to review for free? No pitch, just wanted to share the visual concepts!`,
      emailSubject: `Quick visual design idea for ${lead.business_name || 'your business'}`,
      emailBody: `Hi ${lead.business_name || 'Team'},\n\nI hope this email finds you well.\n\nWhile reviewing top ${lead.type || 'businesses'} in ${lead.city || 'your city'}, our creative team at CreatifyBD noticed an opportunity to enhance your online visual presence and conversion flow.\n\nWe've created a few complimentary visual design mockups showing how a refreshed social feed and landing layout could increase your monthly client inquiries.\n\nWould you be open to taking a look at the concepts? I'd be happy to send them over.\n\nBest regards,\nCreatifyBD Agency Team\nhttps://creatifybd.com`,
      keyUsed: result.keyUsed,
      modelUsed: result.modelUsed
    };
  }
}
