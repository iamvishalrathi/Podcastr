// import { action } from "./_generated/server";
// import { v } from "convex/values";
// import axios from 'axios';

// const authorizationHeader = {
//     'Authorization': process.env.UNREAL_SPEECH_API_KEY,
// };

// export const generateAudioAction = action({
//     args: { input: v.string(), voice: v.string() },
//     handler: async (_, { voice, input }) => {
//         try {
//             const response = await axios({
//                 method: 'post',
//                 url: 'https://api.v7.unrealspeech.com/synthesisTasks',
//                 headers: authorizationHeader,
//                 data: {
//                     'Text': input,
//                     'VoiceId': voice, // Dan, Will, Scarlett, Liv, Amy
//                     'Bitrate': '192k', // 320k, 256k, 192k
//                     'Speed': '0', // -1.0 to 1.0
//                     'Pitch': '1', // -0.5 to 1.5
//                     'TimestampType': 'sentence', // word or sentence
//                     //'CallbackUrl': '<URL>', // pinged when ready
//                 },
//             })
//             const audioUrl = response.data.SynthesisTask.OutputUri;
//             console.log(audioUrl);

//             return audioUrl;
//         } catch (error) {
//             console.error('Error generating audio:', error);
//             throw error;
//         }
//     },
// });