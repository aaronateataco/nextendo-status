export default async function handler(req, res) {
    // Enable CORS for your frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        // We use AllOrigins IN the backend to bypass Nextendo's Cloudflare bot protection
        const TARGET_URL = encodeURIComponent("https://nextendo.network/api/online-counts");
        const PROXY_URL = `https://api.allorigins.win/raw?url=${TARGET_URL}`;

        const response = await fetch(PROXY_URL);

        if (!response.ok) {
            throw new Error(`Proxy responded with status: ${response.status}`);
        }

        // Parse the data from the proxy
        const data = await response.json();
        
        // Send it cleanly to your frontend
        return res.status(200).json(data);

    } catch (error) {
        console.error("Proxy Fetch Error:", error);
        return res.status(500).json({ 
            error: "Failed to bypass Cloudflare and fetch status",
            message: error.message 
        });
    }
}