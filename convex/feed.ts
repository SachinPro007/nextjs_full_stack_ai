import { v } from "convex/values";
import { query } from "./_generated/server";

export const getFeed = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const allPosts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("status"), "published"))
      .order("desc")
      .take(limit + 1);

    if (!allPosts) {
      return [];
    }

    const hasMore = allPosts.length > limit;
    const feedPosts = hasMore ? allPosts.slice(0, limit) : allPosts;

    // add post author in every post object
    const postsWithAuthor = await Promise.all(
      feedPosts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);

        return {
          ...post,
          author: author
            ? {
                _id: author._id,
                name: author.name,
                username: author.username,
                imageUrl: author.imageUrl,
              }
            : null,
        };
      }),
    );

    return {
      posts: postsWithAuthor.filter((post) => post.author !== null),
      hasMore,
    };
  },
});

//Get suggested users to follow
export const getSuggestedUsers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const limit = args.limit || 10;

    const user = await ctx.db
      .query("users")
      .filter((q) =>
        q.eq(q.field("tokenIdentifier"), identity?.tokenIdentifier),
      )
      .unique();

    if (!user) {
      return;
    }

    // Get following users
    const follows = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followerId"), user._id))
      .collect();

    const followedUserIds = follows.map((follow) => follow.followingId);

    // Get all users
    const allUsers = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("_id"), user._id || ""))
      .collect();

    // filter not following users
    const suggestions = allUsers
      .filter((user) => !followedUserIds.includes(user._id))
      .slice(0, limit);

    return suggestions;
  },
});

// Get trending posts
export const getTrendingPosts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const allPosts = await ctx.db
      .query("posts")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "published"),
          q.eq(q.field("publishedAt"), weekAgo),
        ),
      )
      .collect();

    // sort trending posts
    const trendingPosts = allPosts
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);

    // add authors info
    const postsWithAuthor = await Promise.all(
      trendingPosts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);

        return {
          ...post,
          author: author
            ? {
                _id: author?._id,
                name: author?.name,
                username: author.username,
                imageUrl: author.imageUrl,
              }
            : null,
        };
      }),
    );

    return postsWithAuthor.filter((post) => post.author !== null);
  },
});
