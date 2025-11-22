"use client";

import React, { Usable, useEffect, useState } from "react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { PostWithAuthor } from "@/components/dashboard-com/PostCard";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  Send,
  Trash2,
  User,
  Clock,
  Share2,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";

interface CommentWithAuthor {
  author: {
    _id: string;
    name: string;
    username: string | undefined;
    imageUrl: string | undefined;
  } | null;
  _id: string;
  _creationTime: number;
  authorId?: string | undefined;
  authorEmail?: string | undefined;
  createdAt: number;
  content: string;
  status: "approved" | "pending" | "rejected";
  postId: string;
  authorName: string;
}

interface UserPostFnProp {
  params: Usable<{ username: string; postId: string }>;
}

function UserPostPage({ params }: UserPostFnProp) {
  const { username, postId } = React.use(params);
  const { user: currentUser } = useUser();
  const [commentContent, setCommentContent] = useState("");

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useConvexQuery(api.public.getPublishedPost, { username, postId }) as {
    data: PostWithAuthor | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  const { data: hasLiked } = useConvexQuery(api.likes.hasUserLiked, {
    postId,
  }) as { data: boolean | undefined };

  const toggleLike = useConvexMutation(api.likes.toggleLike);

  const { data: comments, isLoading: commentsLoading } = useConvexQuery(
    api.comments.getPostComments,
    { postId },
  ) as { data: CommentWithAuthor[] | undefined; isLoading: boolean };

  const { mutate: addComment, isLoading: isSubmittingComment } =
    useConvexMutation(api.comments.addComment);
  const deleteComment = useConvexMutation(api.comments.deleteComment);
  const increamentView = useConvexMutation(api.public.IncreamentPostViewCount);

  useEffect(() => {
    if (post && !postLoading) {
      increamentView.mutate({ postId });
    }
    // eslint-disable-next-line
  }, [postLoading]);

  // Reading time calculation
  const getReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading Post...</p>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    notFound();
  }

  const handleLikeToggle = () => {
    if (!currentUser) {
      toast.error("Please sign in to like posts");
      return;
    }
    try {
      toggleLike.mutate({ postId });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Failed to update like");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please sign in to comment");
      return;
    }
    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await addComment({ postId, comment: commentContent.trim() });
      setCommentContent("");
      toast.success("Comment added!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to add comment");
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      deleteComment.mutate({ commentId });
      toast.success("Comment deleted");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to delete comment");
      }
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="min-h-screen pt-12 bg-slate-50 pb-20">
      {/* Background Decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-60" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <article className="space-y-8 bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-md">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          )}

          <div className="space-y-6">
            {/* Tags & Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 px-3 py-1 text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Reading Time */}
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Clock className="h-4 w-4" />
                <span>{getReadingTime(post.content)} min read</span>
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15]">
              {post.title}
            </h1>

            {/* Author & Meta Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-6 border-y border-slate-100">
              {/* Author Info */}
              <Link
                href={`/${username}`}
                className="group flex items-center gap-4"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-indigo-200 transition-colors">
                  {post.author.imageUrl ? (
                    <Image
                      src={post.author.imageUrl}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    @{post.author.username}
                  </p>
                </div>
              </Link>

              {/* Stats Row */}
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium">
                    {typeof post.publishedAt !== "undefined" &&
                      new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full">
                  <Eye className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium">
                    {post.viewCount.toLocaleString()} views
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-img:rounded-xl prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Interactions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-slate-100 mt-12">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleLikeToggle}
                variant={hasLiked ? "secondary" : "outline"}
                size="lg"
                className={`gap-2 rounded-full border-slate-200 ${
                  hasLiked
                    ? "bg-pink-50 text-pink-600 hover:bg-pink-100 border-pink-100"
                    : "text-slate-600 hover:border-pink-200 hover:text-pink-600"
                }`}
                disabled={toggleLike.isLoading}
              >
                <Heart
                  className={`h-5 w-5 ${hasLiked ? "fill-current" : ""}`}
                />
                <span className="font-semibold">
                  {post.likeCount.toLocaleString()}
                </span>
                <span className="hidden sm:inline">
                  {post.likeCount === 1 ? "Like" : "Likes"}
                </span>
              </Button>

              <Button
                onClick={handleShare}
                variant="outline"
                size="lg"
                className="gap-2 rounded-full border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
              >
                <Share2 className="h-5 w-5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-4 py-2 rounded-full">
              <MessageCircle className="h-5 w-5 text-indigo-500" />
              {comments?.length || 0} Comments
            </div>
          </div>
        </article>

        {/* Comment Section */}
        <div className="mt-12 space-y-8">
          {/* Section Header */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Discussion</h2>
            </div>
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400 font-medium">
              {comments?.length || 0}{" "}
              {comments?.length === 1 ? "comment" : "comments"}
            </span>
          </div>

          {/* Comment Form */}
          {currentUser ? (
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
              <CardContent className="p-6">
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="flex gap-4">
                    {/* Current User Avatar */}
                    <div className="shrink-0 hidden sm:block">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-slate-100">
                        {currentUser.imageUrl ? (
                          <Image
                            src={currentUser.imageUrl}
                            alt="You"
                            width={44}
                            height={44}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {currentUser.firstName?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2 sm:hidden">
                          Commenting as {currentUser.firstName || "User"}
                        </p>
                        <Textarea
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          placeholder="Share your thoughts on this article..."
                          className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 resize-none focus:ring-indigo-500/20 min-h-[120px] rounded-xl"
                          maxLength={1000}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <p className="text-xs text-slate-400 font-medium">
                            {commentContent.length}/1000
                          </p>
                          {commentContent.length > 800 && (
                            <p className="text-xs text-amber-500 font-medium">
                              {1000 - commentContent.length} characters left
                            </p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          disabled={
                            isSubmittingComment || !commentContent.trim()
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 rounded-full px-6"
                        >
                          {isSubmittingComment ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-50 border-dashed border-2 border-slate-200 shadow-none rounded-2xl">
              <CardContent className="p-10 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-700 font-semibold text-lg mb-2">
                  Join the conversation
                </p>
                <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                  Sign in to share your thoughts and engage with other readers
                </p>
                <Link href="/sign-in">
                  <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8">
                    Sign In to Comment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="group flex gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                      {comment.author?.imageUrl ? (
                        <Image
                          src={comment.author.imageUrl}
                          alt={comment.author.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900">
                            {comment.author?.name || "Anonymous"}
                          </span>
                          {comment.authorId === post.authorId && (
                            <Badge
                              variant="secondary"
                              className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5"
                            >
                              Author
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                          {" • "}
                          {new Date(comment.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>

                      {/* Delete Button */}
                      {currentUser &&
                        comment.author &&
                        (currentUser.id === comment.authorId ||
                          currentUser.id === post.authorId) && (
                          <Button
                            onClick={() => handleDeleteComment(comment._id)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                    </div>

                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
              <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-semibold text-lg">
                No comments yet
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>

        {/* Custom prose styles */}
        <style jsx global>{`
          .prose h1,
          .prose h2,
          .prose h3,
          .prose h4,
          .prose strong {
            color: #0f172a;
            font-weight: 700;
          }
          .prose h2 {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e2e8f0;
          }
          .prose h2:first-of-type {
            border-top: none;
            padding-top: 0;
          }
          .prose p,
          .prose ul,
          .prose ol {
            color: #334155;
            line-height: 1.8;
          }
          .prose blockquote {
            border-left: 4px solid #6366f1;
            color: #475569;
            background-color: #f8fafc;
            padding: 1rem 1.5rem;
            border-radius: 0 0.5rem 0.5rem 0;
            font-style: italic;
          }
          .prose a {
            color: #4f46e5;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
          }
          .prose a:hover {
            border-bottom-color: #4f46e5;
          }
          .prose code {
            background: #f1f5f9;
            color: #0f172a;
            padding: 0.2em 0.4em;
            border-radius: 0.25rem;
            font-size: 0.9em;
            font-weight: 600;
          }
          .prose pre {
            background: #1e293b;
            color: #e2e8f0;
            border-radius: 0.75rem;
            padding: 1.25rem;
            overflow-x: auto;
          }
          .prose pre code {
            background: transparent;
            color: inherit;
            padding: 0;
            font-size: 0.9em;
            font-weight: 400;
          }
          .prose img {
            border-radius: 0.75rem;
            box-shadow:
              0 4px 6px -1px rgb(0 0 0 / 0.1),
              0 2px 4px -2px rgb(0 0 0 / 0.1);
          }
          .prose ul li::marker {
            color: #6366f1;
          }
          .prose ol li::marker {
            color: #6366f1;
            font-weight: 600;
          }
          .prose hr {
            border-color: #e2e8f0;
            margin: 2.5rem 0;
          }
          .prose table {
            width: 100%;
            border-collapse: collapse;
          }
          .prose th,
          .prose td {
            border: 1px solid #e2e8f0;
            padding: 0.75rem 1rem;
            text-align: left;
          }
          .prose th {
            background: #f8fafc;
            font-weight: 600;
          }
        `}</style>
      </div>
    </div>
  );
}

export default UserPostPage;
