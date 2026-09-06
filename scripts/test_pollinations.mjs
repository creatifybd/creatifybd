// Test Pollinations.ai Free Image Generation API (Flux/SDXL backend)
async function testPollinations() {
  const prompt = encodeURIComponent('Awwwards style luxury modern website hero section for Sydney skin clinic, 8k resolution, minimalist gold and white');
  const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1280&height=720&nologo=true&model=flux`;

  console.log('Testing Pollinations.ai Image Generation URL...');
  console.log('URL:', imageUrl);

  try {
    const start = Date.now();
    const res = await fetch(imageUrl, { method: 'HEAD' });
    const elapsed = Date.now() - start;

    console.log(`Status: ${res.status} (${elapsed}ms)`);
    console.log(`Content-Type: ${res.headers.get('content-type')}`);
    if (res.ok) {
      console.log('✅ Pollinations.ai Free Image API is 100% ACTIVE and working!');
    }
  } catch (e) {
    console.log('❌ Error:', e.message);
  }
}

testPollinations();
