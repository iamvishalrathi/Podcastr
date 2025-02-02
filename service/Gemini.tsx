import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Generate a podcast script and description for a podcast titled \"${title}\". \n\n            Return the response in the following JSON format:\n\n            {\n\n                \"description\": \"engaging podcast description here\",\n\n                \"script\": \"detailed podcast script here\"\n\n            }\n\n            Make the content engaging and natural sounding. The description should be 2-3 sentences and the script should be 3-4 paragraphs.\n" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n{\n  \"description\": \"Welcome to 'Unraveled Threads,' the podcast where we explore the unexpected connections between seemingly disparate topics. Join us each week as we pull at the loose ends of history, science, and culture, revealing surprising patterns and fascinating insights.\",\n  \"script\": \"**(Intro Music with a curious, slightly whimsical feel fades in and then out)**\\n\\n**Host:** Hello and welcome to Unraveled Threads, the podcast that delights in the unexpected! I'm your host, Alex, and I’m absolutely thrilled you're joining me today. We often move through the world with our own carefully curated categories, but what happens when we start to look for the links between those seemingly separate boxes? That's exactly what we're going to do here. We'll be diving into history, art, science, and well, just about anything that catches our eye, all in the hopes of revealing the hidden connections that make our world so wonderfully complex.\\n\\n**Host:** Today, our focus is on something that may appear to be quite different at first: the intricate dance of bees and the evolution of impressionist art. Now, you might be thinking, “What on earth do bees have to do with Monet and Renoir?” And that’s precisely the question that makes this so intriguing! On one hand, we have the incredible organizational abilities of these tiny creatures, their sophisticated communication methods, and their crucial role in our ecosystem. On the other, we have a movement in painting that aimed to capture the ephemeral quality of light and fleeting moments. So, where's the thread? \\n\\n**Host:** Well, it all starts with the understanding of light and color, not just from an artistic perspective but also a biological one. Scientists have long studied how bees see the world, and we've learned that their perception is quite different from ours. They see ultraviolet light, for instance, and patterns that are invisible to the human eye. Interestingly, some art historians argue that the changing approaches to color theory and the development of new pigments during the same era, influenced the Impressionists' ability to capture the vibrant world around them. They were also very interested in the idea of 'visual perception', a similar area that scientists were also pursuing at the time! So, could the scientific curiosity surrounding vision have played a role in the way these artists 'saw' and consequently painted the world?\\n\\n**Host:**  It’s a fascinating connection, isn’t it? It's a reminder that innovation rarely occurs in a vacuum, and that progress, whether in science, art, or even the lives of buzzing pollinators, often influences and informs the others in ways we might not immediately suspect.  That's all for this episode of Unraveled Threads, thank you for joining me and I can't wait to pull at the next thread with you all again next week! \\n\\n**(Outro music with the same whimsical feel fades in and then out)**\"\n}\n```\n" },
            ],
        },
    ],
});