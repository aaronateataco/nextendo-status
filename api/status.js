export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (!process.env.NEXTENDO_COOKIE) {
    console.error("Missing NEXTENDO_COOKIE env var");
    return res.status(500).json({ error: "Server misconfigured: missing cookie" });
  }

  try {
    const response = await fetch("https://nextendo.network/api/online-counts", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://nextendo.network/status",
        "Connection": "keep-alive",
        "Cookie": process.env.NEXTENDO_COOKIE
      }
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`Target responded ${response.status}: ${body}`);
      throw new Error(`Target responded with status: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({
      error: "Failed to fetch status",
      message: error.message
    });
  }
}