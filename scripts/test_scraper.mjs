// Test live website fetching and text extraction for business leads
async function fetchWebsiteData(url) {
  if (!url || url === 'Not provided') return null;

  let targetUrl = url;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const html = await res.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract meta description
    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const description = metaMatch ? metaMatch[1].trim() : '';

    // Extract h1 and h2 headings
    const headings = [];
    const hMatches = html.matchAll(/<h[12][^>]*>([^<]+)<\/h[12]>/gi);
    for (const match of hMatches) {
      const hText = match[1].replace(/<[^>]+>/g, '').trim();
      if (hText && hText.length > 3 && !headings.includes(hText)) {
        headings.push(hText);
      }
      if (headings.length >= 5) break;
    }

    // Strip scripts and styles for raw text preview
    const cleanText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1000);

    return { title, description, headings, snippet: cleanText.slice(0, 500) };
  } catch (e) {
    return { error: e.message };
  }
}

async function test() {
  const testUrls = [
    '1919lanzhoubeefnoodle.com.au',
    'https://www.australianskinclinics.com.au'
  ];

  for (const u of testUrls) {
    console.log(`\nFetching: ${u}...`);
    const data = await fetchWebsiteData(u);
    console.log('Result:', JSON.stringify(data, null, 2));
  }
}

test();
