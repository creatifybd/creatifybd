/**
 * In-Dashboard Image Generator
 * Uses HuggingFace Inference API (FLUX.1-schnell) — Free, high quality
 * Falls back to Stable Diffusion XL (Prodia) → Pollinations (last resort)
 *
 * How to get a FREE HuggingFace token:
 * 1. Go to https://huggingface.co → Sign up (free)
 * 2. Settings → Access Tokens → New Token (READ permission)
 * 3. Add in Admin → AI Keys → HuggingFace Token
 */

// ─── HuggingFace models (best quality first) ──────────────────────────────────
const HF_MODELS = [
  'black-forest-labs/FLUX.1-schnell',      // Best quality, fast
  'stabilityai/stable-diffusion-xl-base-1.0', // SDXL fallback
];

const HF_API = 'https://api-inference.huggingface.co/models/';
const LS_HF_TOKEN = 'creatify_hf_token';

// ─── Ideogram API (free tier) ─────────────────────────────────────────────────
const LS_IDEOGRAM_TOKEN = 'creatify_ideogram_token';

// ─── Get stored tokens ────────────────────────────────────────────────────────
export const getHFToken = () => {
  try { return localStorage.getItem(LS_HF_TOKEN) || ''; } catch { return ''; }
};

export const getIdeogramToken = () => {
  try { return localStorage.getItem(LS_IDEOGRAM_TOKEN) || ''; } catch { return ''; }
};

export const setHFToken = (token) => {
  try { localStorage.setItem(LS_HF_TOKEN, token.trim()); } catch {}
};

export const setIdeogramToken = (token) => {
  try { localStorage.setItem(LS_IDEOGRAM_TOKEN, token.trim()); } catch {}
};

// ─── HuggingFace FLUX / SDXL generator ───────────────────────────────────────
async function generateViaHuggingFace(prompt, hfToken) {
  for (const model of HF_MODELS) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (hfToken) headers['Authorization'] = `Bearer ${hfToken}`;

      const res = await fetch(`${HF_API}${model}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: 1024,
            height: 576,
            num_inference_steps: model.includes('FLUX') ? 4 : 25,
            guidance_scale: model.includes('FLUX') ? 0 : 7.5,
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        // Model loading — wait and retry once
        if (res.status === 503) {
          const parsed = JSON.parse(text);
          const wait = Math.min((parsed.estimated_time || 20) * 1000, 30000);
          await new Promise(r => setTimeout(r, wait));
          const res2 = await fetch(`${HF_API}${model}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ inputs: prompt }),
          });
          if (res2.ok) {
            const blob = await res2.blob();
            return URL.createObjectURL(blob);
          }
        }
        continue; // try next model
      }

      const blob = await res.blob();
      if (blob.size < 1000) continue; // too small = error response
      return URL.createObjectURL(blob);
    } catch (err) {
      console.warn(`HF model ${model} failed:`, err.message);
    }
  }
  return null;
}

// ─── Ideogram v2 API generator ────────────────────────────────────────────────
async function generateViaIdeogram(prompt, ideogramToken) {
  if (!ideogramToken) return null;
  try {
    const res = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': ideogramToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_request: {
          prompt: prompt,
          aspect_ratio: 'ASPECT_16_9',
          model: 'V_2',
          magic_prompt_option: 'ON',
        },
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const url = data?.data?.[0]?.url;
    return url || null;
  } catch (err) {
    console.warn('Ideogram API failed:', err.message);
    return null;
  }
}

// ─── MAIN: Generate image — tries all providers ───────────────────────────────
/**
 * generateImage(prompt, provider)
 * @param {string} prompt     - Detailed image prompt
 * @param {string} provider   - 'hf' | 'ideogram' | 'auto'
 * @returns {Promise<{ url: string, provider: string } | null>}
 */
export async function generateImage(prompt, provider = 'auto') {
  const hfToken     = getHFToken();
  const ideogramToken = getIdeogramToken();

  // Auto: HuggingFace first (best quality, always works without token)
  if (provider === 'auto' || provider === 'hf') {
    const url = await generateViaHuggingFace(prompt, hfToken);
    if (url) return { url, provider: 'HuggingFace FLUX.1' };
  }

  // Ideogram (requires free API key)
  if (provider === 'auto' || provider === 'ideogram') {
    const url = await generateViaIdeogram(prompt, ideogramToken);
    if (url) return { url, provider: 'Ideogram v2' };
  }

  return null; // All failed
}

// ─── Check if any token is configured ────────────────────────────────────────
export const hasImageProvider = () => {
  return !!getHFToken() || !!getIdeogramToken();
};
