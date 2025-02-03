import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        try {
            const uploadUrl = await ctx.storage.generateUploadUrl();
            if (!uploadUrl) {
                throw new Error("Failed to generate upload URL");
            }
            return uploadUrl;
        } catch (error) {
            console.error("Error generating upload URL:", error);
            throw new Error("Failed to generate upload URL");
        }
    },
});

export const getUrl = mutation({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        try {
            const url = await ctx.storage.getUrl(args.storageId);
            if (!url) {
                throw new Error("Failed to get URL for file");
            }
            return url;
        } catch (error) {
            console.error("Error getting URL:", error);
            throw error;
        }
    },
});

export const deleteFile = mutation({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        try {
            await ctx.storage.delete(args.storageId);
            return true;
        } catch (error) {
            console.error("Error deleting file:", error);
            throw new Error("Failed to delete file");
        }
    },
});