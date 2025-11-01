import { v } from "convex/values";
import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { User } from "./users";

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
