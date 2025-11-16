import { v } from "convex/values";
import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { User } from "./users";

// types
interface UpdatedPost {
  title?: string;
  content?: string;
  status?: "draft" | "published";
  tags?: string[];
  category?: string;
  featuredImage?: string;
  scheduledFor?: number;
  updatedAt: number;
  publishedAt?: number | undefined;
}

// Get Draft Post
export const getDraftPost = query({
  handler: async (ctx) => {
    const user: User = await ctx.runQuery(api.users.getCurrentUser);

    const draft = await ctx.db
      .query("posts")
      .filter((q) =>
        q.and(
          q.eq(q.field("authorId"), user._id),
          q.eq(q.field("status"), "draft"),
        ),
      )
      .unique();

    return draft;
  },
});

// Create a new Post
export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    tags: v.array(v.string()),
    category: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user: User = await ctx.runQuery(api.users.getCurrentUser);

    const existingDraft = await ctx.db
      .query("posts")
      .filter((q) =>
        q.and(
          q.eq(q.field("authorId"), user._id),
          q.eq(q.field("status"), "draft"),
        ),
      )
      .unique();

    // If publishing and we have an existing draft, update it to publish
    if (args.status === "published" && existingDraft) {
      await ctx.db.patch(existingDraft._id, {
        title: args.title,
        content: args.content,
        status: "published",
        tags: args.tags || [],
        featuredImage: args.featuredImage,
        updatedAt: Date.now(),
        publishedAt: Date.now(),
        scheduledFor: args.scheduledFor,
      });
      return existingDraft._id;
    }

    // If creating a draft and we have an existing draft, update it
    if (args.status === "draft" && existingDraft) {
      await ctx.db.patch(existingDraft._id, {
        title: args.title,
        content: args.content,
        tags: args.tags || [],
        featuredImage: args.featuredImage,
        scheduledFor: args.scheduledFor,
      });
      return existingDraft._id;
    }

    // Create new Post
    const postId = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      status: args.status,
      authorId: user._id,
      tags: args.tags || [],
      category: args.category,
      featuredImage: args.featuredImage,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      publishedAt: args.status === "published" ? Date.now() : undefined,
      scheduledFor: args.scheduledFor,
      viewCount: 0,
      likeCount: 0,
    });

    return postId;
  },
});

// Update an existing Post
export const updatePost = mutation({
  args: {
    _id: v.id("posts"),
    title: v.string(),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    tags: v.array(v.string()),
    category: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.getCurrentUser);

    // Get the Post
    const post = await ctx.db.get(args._id);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user owns the post
    if (post.authorId !== user._id) {
      throw new Error("Not authorized to update this post");
    }

    const updatedPost: UpdatedPost = {
      updatedAt: Date.now(),
    };

    // Add provided fields to update
    if (args.title !== undefined) updatedPost.title = args.title;
    if (args.content !== undefined) updatedPost.content = args.content;
    if (args.tags !== undefined) updatedPost.tags = args.tags;
    if (args.category !== undefined) updatedPost.category = args.category;
    if (args.featuredImage !== undefined)
      updatedPost.featuredImage = args.featuredImage;
    if (args.scheduledFor !== undefined)
      updatedPost.scheduledFor = args.scheduledFor;

    if (args.status !== undefined) {
      updatedPost.status = args.status;

      if (args.status === "published" && post.status === "draft") {
        updatedPost.publishedAt = Date.now();
      }
    }

    await ctx.db.patch(args._id, updatedPost);

    return args._id;
  },
});

// Get User All Posts
export const getUserAllPosts = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const user: User = await ctx.runQuery(api.users.getCurrentUser);

    if (!user) {
      return [];
    }

    let query = ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id));

    // Filter by status if provided
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const posts = await query.order("desc").collect();

    // add username each post
    return posts.map((post) => ({
      ...post,
      author: {
        _id: user._id,
        name: user.name,
        username: user.username,
        imageUrl: user.imageUrl,
      },
    }));
  },
});

// Get a single post by Id
export const getPostById = query({
  args: { _id: v.id("posts") },

  handler: async (ctx, args) => {
    await ctx.runQuery(api.users.getCurrentUser);

    return await ctx.db.get(args._id);
  },
});

// Delete post
export const deletePost = mutation({
  args: {
    _id: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.getCurrentUser);

    // get the post
    const post = await ctx.db.get(args._id);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check user owns the post
    if (post.authorId !== user._id) {
      throw new Error("Not authorized to delete this post");
    }

    await ctx.db.delete(args._id);
    return { success: true };
  },
});

// Get a post author by Post authorId
export const getPostAuthor = query({
  args: { _id: v.id("users") },

  handler: async (ctx, args) => {
    return await ctx.db.get(args._id);
  },
});
