// Test v1 vs v1beta, and find which key+model combos work
const KEYS = [
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

const BODY = JSON.stringify({
  contents: [{ parts: [{ text: 'Say hello in one word.' }] }],
  generationConfig: { maxOutputTokens: 10 }
});

const COMBOS = [
  { version: 'v1beta', model: 'gemini-2.0-flash-lite' },
  { version: 'v1beta', model: 'gemini-2.0-flash' },
  { version: 'v1',     model: 'gemini-1.5-flash' },
  { version: 'v1',     model: 'gemini-2.0-flash-lite' },
  { version: 'v1',     model: 'gemini-2.0-flash' },
];

async function test(key, version, model) {
  const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${key}`;
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: BODY });
    const data = await r.json().catch(() => ({}));
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    const errMsg = data?.error?.message?.slice(0, 80) || '';
    return { status: r.status, ok: r.status === 200, text, err: errMsg };
  } catch(e) {
    return { status: 'NET', ok: false, err: e.message };
  }
}

async function main() {
  console.log('=== Testing first key with multiple version/model combos ===');
  for (const { version, model } of COMBOS) {
    const r = await test(KEYS[0], version, model);
    console.log(`[${r.status}] ${version}/${model}: ${r.ok ? '✅ ' + r.text : '❌ ' + r.err}`);
    await new Promise(res => setTimeout(res, 500));
  }

  console.log('\n=== Testing gemini-2.0-flash-lite across all 11 keys (v1beta) ===');
  for (let i = 0; i < KEYS.length; i++) {
    const r = await test(KEYS[i], 'v1beta', 'gemini-2.0-flash-lite');
    console.log(`Key ${i+1}: [${r.status}] ${r.ok ? '✅ ' + r.text : '❌ ' + r.err.slice(0,60)}`);
    await new Promise(res => setTimeout(res, 300));
  }
}

main().catch(console.error);
