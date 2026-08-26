// api/cron-update.js — triggered on a schedule, not by visitors
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const targetUrl = "https://nextendo.network/api/online-counts";
  const proxyUrl = `https://api.scraperapi.com/?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(targetUrl)}&keep_headers=true`;

  try {
    const response = await fetch(proxyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
        "Cookie": process.env.NEXTENDO_COOKIE,
        "Referer": "https://nextendo.network/status"
      }
    });

    if (!response.ok) throw new Error(`Target responded ${response.status}`);
    const data = await response.json();

    await kv.set('nextendo-status', data);
    await kv.set('nextendo-status-updated', Date.now());

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Cron update failed:", error);
    return res.status(500).json({ error: error.message });
  }
}