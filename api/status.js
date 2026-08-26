export default async function handler(req, res) {
    // Enable CORS for your frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        const TARGET_URL = encodeURIComponent("https://nextendo.network/api/online-counts");
        
        // Switching to CorsProxy.io which has a better success rate against Cloudflare
        const PROXY_URL = `https://corsproxy.io/?url=${TARGET_URL}`;

        const response = await fetch(PROXY_URL, {
            // Adding basic headers to look slightly more like a real browser
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`CorsProxy responded with status: ${response.status}`);
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("Proxy Fetch Error:", error);
        return res.status(500).json({ 
            error: "Failed to bypass Cloudflare and fetch status",
            message: error.message 
        });
    }
}