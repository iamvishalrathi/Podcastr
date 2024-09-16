import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateThumbnailAction = action({
    args: { prompt: v.string() },
    handler: async (_, { prompt }) => {
        try {
            const options = {
                method: 'POST',
                headers: { 'x-freepik-api-key': `${process.env.FREEPIK_API_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ prompt, num_images: 1 }),
            };

            const response = await fetch('https://api.freepik.com/v1/ai/text-to-image', options);
            const resJson = await response.json();
            const base64 = resJson.data[0].base64
            const imgUrl = `data:image/png;base64,${base64}`
            console.log(imgUrl);
            return imgUrl;

        } catch (error) {
            console.error('Error generating Thumbnail:', error);
            throw error;
        }
    }
})