import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateThumbnailAction = action({
    args: { prompt: "string" },
    handler: async (ctx, args) => {
        try {
            const response = await fetch(`${process.env.FREEPIK_API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FREEPIK_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: args.prompt
                })
            });

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            // First check if the response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                throw new Error(`Invalid response format: ${text.substring(0, 100)}...`);
            }

            const data = await response.json();
            return data.url || data.image_url; // adjust based on actual API response structure
            
        } catch (error) {
            console.error("Error generating thumbnail:", error);
            throw new Error(error instanceof Error ? error.message : "Failed to generate thumbnail");
        }
    },
});