export default async function handler(req, res) {
    try {
        // Fetch the data from Nextendo just like a browser would
        const response = await fetch("https://nextendo.network/api/online-counts", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Nextendo API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Add CORS headers so your frontend is allowed to read it
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        
        // Send the data back to your website
        res.status(200).json(data);

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch status" });
    }
}