export default async function handler(req, res) {
    // Enable CORS first so the error actually shows up in the browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        const response = await fetch("https://nextendo.network/api/online-counts", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.5"
            }
        });

        // If the server blocks us (e.g., Error 403 Forbidden), grab the text to see why
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                error: `Nextendo API blocked the request. Status: ${response.status}`,
                details: errorText.substring(0, 200) // First 200 characters of the block page
            });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("Detailed Fetch Error:", error);
        return res.status(500).json({ 
            error: "The serverless function crashed while fetching.",
            message: error.message 
        });
    }
}