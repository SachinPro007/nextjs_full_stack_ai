import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export interface User {
  _id: Id<"users">;
  _creationTime: number;
  imageUrl?: string | undefined;
  username?: string | undefined;
  name: string;
  email: string;
  tokenIdentifier: string;
  createdAt: number;
  lastActiveAt: number;
}

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      email: identity.email as string,
      tokenIdentifier: identity.tokenIdentifier,
      imageUrl: identity.pictureUrl,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    });
  },
});

// get current logged user
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

// update current logged username
export const updateUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user: User = await ctx.runQuery(api.users.getCurrentUser);

    // Validate username query
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(args.username)) {
      throw new Error(
        "Username can only contain letters, numbers, underscores, and hyphens",
      );
    }

    if (args.username.length < 3 || args.username.length > 20) {
      throw new Error("Username must be between 3 and 20 characters");
    }

    // Check if username is already taken (skip check if it's the same as current)
    if (args.username !== user.username) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .unique();

      if (existingUser) {
        throw new Error("Username is already taken");
      }
    }

    // Update username
    await ctx.db.patch(user._id, {
      username: args.username,
      lastActiveAt: Date.now(),
    });

    return user._id;
  },
});

// Get user by username for public profile
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .unique();

    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      name: user.name,
      username: user.username,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    };
  },
});
