import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// toggle like
export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.getCurrentUser);

    const post = await ctx.db.get(args.postId);

    if (!post || post.status !== "published") {
      throw new Error("Post not found or not published");
    }

    // Check if already liked
    const likeExist = await ctx.db
      .query("likes")
      .filter((q) =>
        q.and(
          q.eq(q.field("postId"), args.postId),
          q.eq(q.field("userId"), user?._id),
        ),
      )
      .unique();

    if (likeExist) {
      // Unlike - remove the like
      await ctx.db.delete(likeExist._id);

      // Decrement like count from post
      await ctx.db.patch(args.postId, {
        likeCount: Math.max(0, post.likeCount - 1),
      });
      return { liked: false, likeCount: Math.max(0, post.likeCount - 1) };
    } else {
      // like - add the like
      await ctx.db.insert("likes", {
        postId: args.postId,
        userId: user?._id,
        createdAt: Date.now(),
      });

      await ctx.db.patch(args.postId, { likeCount: post.likeCount + 1 });
      return { liked: true, likeCount: post.likeCount + 1 };
    }
  },
});

export const hasUserLiked = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.getCurrentUser);

    const likeExist = await ctx.db
      .query("likes")
      .filter((q) =>
        q.and(
          q.eq(q.field("postId"), args.postId),
          q.eq(q.field("userId"), user._id),
        ),
      )
      .unique();

    if (likeExist) {
      return true;
    } else {
      return false;
    }
  },
});
