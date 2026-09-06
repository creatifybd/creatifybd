// Test Jina AI Web Reader (free URL to Markdown converter for LLMs)
async function fetchWithJina(url) {
  let targetUrl = url;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  const jinaUrl = 'https://r.jina.ai/' + targetUrl;
  console.log(`Fetching via Jina Reader: ${jinaUrl}...`);

  try {
    const start = Date.now();
    const res = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'X-No-Cache': 'true'
      }
    });

    const elapsed = Date.now() - start;
    if (!res.ok) {
      console.log(`❌ Jina error: HTTP ${res.status}`);
      return null;
    }

    const text = await res.text();
    console.log(`✅ Success in ${elapsed}ms! Extracted length: ${text.length} chars.`);
    console.log('--- SAMPLE MARKDOWN EXTRACT ---');
    console.log(text.slice(0, 800));
    return text;
  } catch (e) {
    console.log(`❌ Network error: ${e.message}`);
    return null;
  }
}

async function main() {
  await fetchWithJina('https://www.australianskinclinics.com.au');
  await fetchWithJina('1919lanzhoubeefnoodle.com.au');
}

main().catch(console.error);
