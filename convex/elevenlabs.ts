// import { action } from "./_generated/server";
// import { v } from "convex/values";
// import { Readable } from "stream";
// import { Buffer } from 'buffer';

// import { ElevenLabsClient } from "elevenlabs";

// const client = new ElevenLabsClient({
//     apiKey: process.env.ELEVENLABS_API_KEY,
// });

// export const generateAudioAction = action({
//     args: { input: v.string(), voice: v.string() },
//     handler: async (_, { voice, input }) => {
//         const audioResponse = await client.generate({
//             voice: voice,
//             model_id: "eleven_turbo_v2_5",
//             text: input,
//         });

//         const readableAudio = Readable.from(audioResponse);
//         const chunks = [];

//         for await (const chunk of readableAudio) {
//             chunks.push(chunk);
//         }
//         // Convert chunks to a Buffer
//         const audioBuffer = Buffer.concat(chunks);

//         return {audioBuffer};
//     }
// })