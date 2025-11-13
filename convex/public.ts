import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get published posts by username (for public profile)
export const getPublishedPostsByUserName = query({
  args: { username: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .unique();

    if (!user) {
      return { posts: [], hasMore: false };
    }

    // Get published posts by this user
    const query = ctx.db
      .query("posts")
      .filter((q) =>
        q.and(
          q.eq(q.field("authorId"), user._id),
          q.eq(q.field("status"), "published"),
        ),
      )
      .order("desc");

    const limit = args.limit || 10;
    const posts = await query.take(limit + 1);

    const hasMore = posts.length > limit;
    const finnalPosts = hasMore ? posts.slice(0, limit) : posts;

    const postWithAuthor = await Promise.all(
      finnalPosts.map(async (post) => ({
        ...post,
        author: {
          _id: user._id,
          name: user.name,
          username: user.username,
          imageUrl: user.imageUrl,
        },
      })),
    );

    return {
      posts: postWithAuthor,
      hasMore,
    };
  },
});

// Get a single published post by username and post Id
export const getPublishedPost = query({
  args: {
    username: v.string(),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .unique();
    if (!user) {
      return null;
    }
    const post = await ctx.db.get(args.postId);
    if (!post) {
      return null;
    }

    // Verify the post belongs to this user and is published
    if (post.authorId !== user._id && post.status !== "published") {
      return null;
    }

    return {
      ...post,
      author: {
        _id: user._id,
        name: user.name,
        username: user.username,
        imageUrl: user.imageUrl,
      },
    };
  },
});

// Increament view count for a post
export const IncreamentPostViewCount = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post || post.status !== "published") {
      return;
    }

    // update view count
    await ctx.db.patch(args.postId, { viewCount: post.viewCount + 1 });

    const today = Date.now().toLocaleString().split("T")[0];

    // Check If already have stats for today
    const existingStats = await ctx.db
      .query("dailyStats")
      .filter((q) =>
        q.and(
          q.eq(q.field("postId"), args.postId),
          q.eq(q.field("date"), today),
        ),
      )
      .first();

    if (existingStats) {
      // update existing stats
      await ctx.db.patch(existingStats._id, {
        views: existingStats.views + 1,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("dailyStats", {
        postId: args.postId,
        date: today,
        views: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});
