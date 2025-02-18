import { z } from "zod";

export const formSchema = z.object({
    podcastTitle: z.string().min(2, {
        message: "Podcast title must be at least 2 characters.",
    }),
    podcastDescription: z.string().min(2, {
        message: "Podcast description must be at least 2 characters.",
    }),
    podcastType: z.string({
        required_error: "Please select a podcast type.",
    }),
});