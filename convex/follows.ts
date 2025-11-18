import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// toggle follow/unfollow a user
export const toggleFollow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const follower = await ctx.runQuery(api.users.getCurrentUser);

    if (!follower) {
      return;
    }

    if (follower._id === args.followingId) {
      throw new Error("You can not follow yourself");
    }

    const existingFollow = await ctx.db
      .query("follows")
      .filter((q) =>
        q.add(
          q.eq(q.field("followerId"), follower._id),
          q.eq(q.field("followingId"), args.followingId),
        ),
      )
      .unique();

    if (existingFollow) {
      // if exist delete (unfollow)
      await ctx.db.delete(existingFollow._id);
      return { following: false };
    } else {
      // follow
      await ctx.db.insert("follows", {
        followerId: follower._id,
        followingId: args.followingId,
        createdAt: Date.now(),
      });
      return { following: true };
    }
  },
});

// check current user following the user
export const isFollowing = query({
  args: { followingId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return false;
    }

    const follower = await ctx.runQuery(api.users.getCurrentUser);

    const follow = await ctx.db
      .query("follows")
      .filter((q) =>
        q.and(
          q.eq(q.field("followerId"), follower._id),
          q.eq(q.field("followingId"), args.followingId),
        ),
      )
      .unique();

    if (follow) {
      return { following: true };
    } else {
      return { following: false };
    }
  },
});

// get followers count for user
export const getFollowerCount = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), args.userId))
      .collect();

    return follows.length;
  },
});

// Get current user followers
export const getMyFollowers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(api.users.getCurrentUser);

    if (!currentUser) {
      return [];
    }

    const limit = args.limit || 20;

    const follows = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), currentUser._id))
      .order("desc")
      .take(limit);
  },
});
