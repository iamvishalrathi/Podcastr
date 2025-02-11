import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateThumbnailAction = action({
    args: { prompt: v.string() },
    handler: async (ctx, args) => {
        // Check if environment variables are configured
        const apiUrl = process.env.FREEPIK_API_URL;
        const apiKey = process.env.FREEPIK_API_KEY;

        if (!apiUrl || !apiKey) {
            console.error("Freepik API configuration missing:", {
                hasUrl: !!apiUrl,
                hasKey: !!apiKey
            });
            throw new Error("Freepik API not properly configured. Please check your Convex environment variables.");
        }

        try {
            // Log the request details (without the full API key)
            console.log("Making Freepik API request:", {
                url: apiUrl,
                hasApiKey: !!apiKey,
                prompt: args.prompt
            });

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Freepik-API-Key': apiKey // Changed to use X-Freepik-API-Key header
                },
                body: JSON.stringify({
                    prompt: args.prompt,
                    type: "image", // Add required parameters
                    style: "realistic"
                })
            });

            // Log response status
            console.log("Freepik API response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Freepik API error response:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const resJson = await response.json();
            console.log("Freepik API response structure:", {
                hasData: !!resJson.data,
                dataLength: resJson.data?.length,
                firstItemKeys: resJson.data?.[0] ? Object.keys(resJson.data[0]) : []
            });

            if (!resJson.data?.[0]?.url) {
                console.error("Unexpected API response format:", resJson);
                throw new Error("Invalid response format from API");
            }

            return resJson.data[0].url;
        } catch (error) {
            console.error("Error in generateThumbnailAction:", error);
            throw new Error(error instanceof Error ? error.message : "Failed to generate thumbnail");
        }
    },
});