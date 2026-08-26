// api/status.js
import { kv } from '@vercel/kv';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const cached = await kv.get('nextendo-status');
    const lastFetch = await kv.get('nextendo-status-time') || 0;
    const isStale = Date.now() - lastFetch > CACHE_TTL_MS;

    if (cached && !isStale) {
      return res.status(200).json(cached);
    }

    // Cache missing or stale — fetch fresh
    const proxyUrl = `https://api.scraperapi.com/?api_key=${process.env.SCRAPERAPI_KEY}&url=https%3A%2F%2Fnextendo.network%2Fapi%2Fonline-counts`;

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
    await kv.set('nextendo-status-time', Date.now());

    return res.status(200).json(data);

  } catch (error) {
    console.error("Fetch Error:", error);
    // fall back to stale cache if we have one, rather than erroring out
    const cached = await kv.get('nextendo-status').catch(() => null);
    if (cached) return res.status(200).json(cached);
    return res.status(500).json({ error: "Failed to fetch status", message: error.message });
  }
}