import { v } from "convex/values";
import { api } from "./_generated/api";
import { query } from "./_generated/server";
import { User } from "./users";

export interface Activitis {
  type: string;
  user: string | undefined;
  post?: string;
  time: number;
}

// Get dashboard analytics
export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const user: User = await ctx.runQuery(api.users.getCurrentUser);

    // Get user all posts
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .collect();

    // Get user all followers
    const followers = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), user._id))
      .collect();

    // total views or total likes
    const totalView = posts.reduce((sum, post) => sum + post.viewCount, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);

    // Calculate growth percentages
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = Date.now() - 60 - 24 * 60 * 60 * 1000;

    const recentPosts = posts.filter((p) => p.createdAt > thirtyDaysAgo);
    const recentViews = recentPosts.reduce(
      (sum, post) => sum + post.viewCount,
      0,
    );
    const recentLikes = recentPosts.reduce(
      (sum, post) => sum + post.likeCount,
      0,
    );

    // Commenets Growth
    const postIds = posts.map((p) => p._id);

    let recentComments = 0;
    let previousComments = 0;

    for (const postId of postIds) {
      const allComments = await ctx.db
        .query("comments")
        .filter((q) =>
          q.and(
            q.eq(q.field("postId"), postId),
            q.eq(q.field("status"), "approved"),
          ),
        )
        .collect();

      recentComments = allComments.filter(
        (c) => c.createdAt > thirtyDaysAgo,
      ).length;

      previousComments = allComments.filter(
        (c) => c.createdAt > sixtyDaysAgo,
      ).length;
    }

    const commentsGrowth =
      previousComments > 0
        ? ((previousComments - recentComments) / recentComments) * 100
        : recentComments > 0
          ? 100
          : 0;

    // followers growth
    const recentFollowers = followers.filter(
      (f) => f.createdAt > thirtyDaysAgo,
    ).length;
    const previousFollowers = followers.filter(
      (f) => f.createdAt > sixtyDaysAgo,
    ).length;

    const followersGrowth =
      previousFollowers > 0
        ? ((previousFollowers - recentFollowers) / recentFollowers) * 100
        : recentFollowers > 0
          ? 100
          : 0;

    // simple growth calculation
    const viewsGrowth = totalView > 0 ? (recentViews / totalView) * 100 : 0;
    const likesGrowth = totalLikes > 0 ? (recentLikes / totalLikes) * 100 : 0;

    return {
      totalView,
      totalLikes,
      recentComments,
      totalFollowers: followers.length,
      viewsGrowth: viewsGrowth,
      likesGrowth: likesGrowth,
      commentsGrowth: commentsGrowth,
      followersGrowth: followersGrowth,
    };
  },
});

// Get recent actibitis
export const recentActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.getCurrentUser);

    // Get user all posts
    const posts = await ctx.db
      .query("posts")
      .filter((q) =>
        q.and(
          q.eq(q.field("authorId"), user._id),
          q.eq(q.field("status"), "published"),
        ),
      )
      .collect();

    const postIds = posts.map((p) => p._id);
    const activitis: Activitis[] = [];

    // Get recent likes
    for (const postId of postIds) {
      const likes = await ctx.db
        .query("likes")
        .filter((q) => q.eq(q.field("postId"), postId))
        .order("desc")
        .take(5);

      for (const like of likes) {
        if (like.postId) {
          const likeUser = await ctx.db.get(like.userId!);
          const post = posts.find((p) => p._id === postId);

          if (likeUser && post) {
            activitis.push({
              type: "like",
              user: likeUser.username,
              post: post.title,
              time: like.createdAt,
            });
          }
        }
      }
    }

    // Get recent comments
    for (const postId of postIds) {
      const comments = await ctx.db
        .query("comments")
        .filter((q) =>
          q.and(
            q.eq(q.field("postId"), postId),
            q.eq(q.field("status"), "approved"),
          ),
        )
        .order("desc")
        .take(5);

      for (const comment of comments) {
        const post = posts.find((p) => p._id === postId);

        if (post) {
          activitis.push({
            type: "comment",
            user: comment.authorName,
            post: post.title,
            time: comment.createdAt,
          });
        }
      }
    }

    // Get recent followers
    const recentFollowers = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), user._id))
      .order("desc")
      .take(5);

    for (const follow of recentFollowers) {
      const follower = await ctx.db.get(follow.followerId);

      if (follower) {
        activitis.push({
          type: "follow",
          user: follower.name,
          time: follow.createdAt,
        });
      }
    }

    // sort all activitis by time or limit
    activitis.sort((a, b) => b.time - a.time);
    return activitis.slice(0, args.limit || 10);
  },
});

// Get posts with analytics
export const getPostsWithAnalytics = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user: User = await ctx.runQuery(api.users.getCurrentUser);

    // Get recent posts
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .order("desc")
      .take(args.limit || 5);

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await ctx.db
          .query("comments")
          .filter((q) =>
            q.and(
              q.eq(q.field("postId"), post._id),
              q.eq(q.field("status"), "approved"),
            ),
          )
          .collect();

        return {
          ...post,
          commentCount: comments.length,
        };
      }),
    );

    return postsWithComments;
  },
});
