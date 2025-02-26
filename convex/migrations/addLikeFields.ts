import { mutation } from "../_generated/server";

export const addLikeFields = mutation({
  handler: async (ctx) => {
    const podcasts = await ctx.db.query("podcasts").collect();
    
    for (const podcast of podcasts) {
      if (!podcast.likes || !podcast.likeCount) {
        await ctx.db.patch(podcast._id, {
          likes: [],
          likeCount: 0
        });
      }
    }
    
    return "Migration completed successfully";
  },
});
