import { action } from "./_generated/server";
import { v } from "convex/values";

// Function to clean and validate base64 string
function cleanBase64(str: string) {
    // Remove any whitespace, newlines, or invalid characters
    return str.replace(/[\r\n\s]/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
}

// Function to validate base64 string
function isValidBase64(str: string) {
    if (!str) return false;
    try {
        // Check if the string length is valid (should be multiple of 4)
        if (str.length % 4 !== 0) {
            return false;
        }
        // Check if the string contains only valid base64 characters
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}

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
            throw new Error("Freepik API not properly configured");
        }

        try {
            const requestBody = {
                prompt: args.prompt,
                n: 1,
                size: "1080x1080",
                response_format: "b64_json"
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Freepik-API-Key': apiKey
                },
                body: JSON.stringify(requestBody)
            });

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

            if (!resJson.data || !Array.isArray(resJson.data) || resJson.data.length === 0) {
                console.error("Invalid API response format:", JSON.stringify(resJson));
                throw new Error("Invalid response format from API");
            }

            const imageData = resJson.data[0];
            
            if (!imageData.base64) {
                console.error("No base64 image data in response");
                throw new Error("No image data received");
            }

            // Clean and validate the base64 string
            const cleanedBase64 = cleanBase64(imageData.base64);
            
            if (!isValidBase64(cleanedBase64)) {
                console.error("Invalid base64 string after cleaning");
                throw new Error("Invalid image data format");
            }

            // Create data URL
            const dataUrl = `data:image/png;base64,${cleanedBase64}`;

            return dataUrl;

        } catch (error) {
            console.error("Error in generateThumbnailAction:", {
                name: error.name,
                message: error.message,
                stack: error.stack,
                fullError: error
            });
            throw error;
        }
    },
});