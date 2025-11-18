import { api } from "./_generated/api";
import { query } from "./_generated/server";

export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.runQuery(api.users.getCurrentUser);

    // Get user all posts
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .collect();

    // Get user followers
    const followers = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), user._id))
      .collect();

    // Calculate analytics
    const totalView = posts.reduce((sum, post) => sum + post.viewCount, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);

    //Get user all post comments
    const postIds = posts.map((p) => p._id);

    let totalComments = 0;

    for (const postId of postIds) {
      const comments = await ctx.db
        .query("comments")
        .filter((q) =>
          q.and(
            q.eq(q.field("postId"), postId),
            q.eq(q.field("status"), "approved"),
          ),
        )
        .collect();

      totalComments += comments.length;
    }

    // Calculate  growth percentages
    const thirtyDatysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const recentPosts = posts.filter((p) => p.createdAt > thirtyDatysAgo);
    const recentViews = recentPosts.reduce(
      (sum, post) => sum + post.viewCount,
      0,
    );
    const recentLikes = recentPosts.reduce(
      (sum, post) => sum + post.likeCount,
      0,
    );

    // simple growth calculation
    const viewsGrowth = totalView > 0 ? (recentViews / totalView) * 100 : 0;
    const likesGrowth = totalLikes > 0 ? (recentLikes / totalLikes) * 100 : 0;
    const commentsGrowth = totalComments > 0 ? 15 : 0;
    const followersGrowth = followers.length > 0 ? 12 : 0;

    return {
      totalView,
      totalLikes,
      totalComments,
      totalFollowers: followers.length,
      viewsGrowth: viewsGrowth.toFixed(1),
      likesGrowth: likesGrowth.toFixed(1),
      commentsGrowth,
      followersGrowth,
    };
  },
});

export const recentActivity = query({
  args: {},
  handler: async (ctx) => {},
});
