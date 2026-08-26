export default async function handler(req, res) {
    // Enable CORS for your frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

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