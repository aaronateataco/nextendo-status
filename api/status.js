// api/status.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Let Vercel's edge/CDN cache the response for 1 hour.
  // stale-while-revalidate means visitors after the hour still get the
  // old cached copy instantly while Vercel refetches in the background,
  // so ScraperAPI only gets hit roughly once per hour, not per-visitor.
  res.setHeader(
    'Cache-Control',
    's-maxage=3600, stale-while-revalidate=86400'
  );

  try {
    // keep_headers=true tells ScraperAPI to actually forward our Cookie/Referer/UA
    // to the target site instead of using its own defaults.
    const proxyUrl =
      `https://api.scraperapi.com/?api_key=${process.env.SCRAPERAPI_KEY}` +
      `&url=https%3A%2F%2Fnextendo.network%2Fapi%2Fonline-counts` +
      `&keep_headers=true`;

    const response = await fetch(proxyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
        "Cookie": process.env.NEXTENDO_COOKIE,
        "Referer": "https://nextendo.network/status"
      }
    });

    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(`Target responded ${response.status}: ${rawText.slice(0, 300)}`);
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(`Non-JSON response from target: ${rawText.slice(0, 300)}`);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Fetch Error:", error.message);
    // No KV fallback available here — if this fails, the client just gets
    // a 500. Vercel's CDN cache (if a previous successful response is still
    // within its cache window) may still serve older visitors the old data
    // without this function even running.
    return res.status(500).json({ error: "Failed to fetch status", message: error.message });
  }
}