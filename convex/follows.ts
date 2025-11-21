import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { User } from "./users";

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
        q.and(
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

    const follower: User = await ctx.runQuery(api.users.getCurrentUser);

    const follow = await ctx.db
      .query("follows")
      .filter((q) =>
        q.and(
          q.eq(q.field("followerId"), follower._id),
          q.eq(q.field("followingId"), args.followingId),
        ),
      )
      .unique();

    return !!follow;
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
    const currentUser: User = await ctx.runQuery(api.users.getCurrentUser);
    const limit = args.limit || 20;

    const followers = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), currentUser._id))
      .order("desc")
      .take(limit);

    // Get user details for each follower
    const followersWithInfo = await Promise.all(
      followers.map(async (follower) => {
        const user = await ctx.db.get(follower.followerId);

        if (!user) return null;

        // / Check if current user follows them back
        const followsBack = await ctx.db
          .query("follows")
          .filter((q) =>
            q.and(
              q.eq(q.field("followerId"), currentUser._id),
              q.eq(q.field("followingId"), user._id),
            ),
          )
          .unique();

        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          imageUrl: user.imageUrl,
          followsBack: !!followsBack,
          followedAt: follower.createdAt,
        };
      }),
    );

    return followersWithInfo.filter((user) => user !== null);
  },
});

// Get current user followings
export const getMyFollowings = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user: User = await ctx.runQuery(api.users.getCurrentUser);
    const limit = args.limit || 20;

    const followings = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followerId"), user._id))
      .order("desc")
      .take(limit);

    // Getting following users
    const followingsUsers = await Promise.all(
      followings.map(async (follow) => {
        const user = await ctx.db.get(follow.followingId);
        if (!user) return null;

        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          imageUrl: user.imageUrl,
          followedAt: follow.createdAt,
        };
      }),
    );

    return followingsUsers.filter((user) => user !== null);
  },
});
