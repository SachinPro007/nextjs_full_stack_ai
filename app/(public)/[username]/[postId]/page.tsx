"use client";

import React, { Usable, useEffect, useState } from "react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { PostWithAuthor } from "@/components/dashboard-com/PostCard";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Loader2,
  MessageCircle,
  Trash2,
  User,
  Clock,
  Share2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50">
        <div className="p-4 rounded-full bg-white shadow-xl shadow-indigo-100 animate-bounce">
          <Sparkles className="h-8 w-8 text-indigo-600" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">
          Loading article...
        </p>
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
        toast.error(error.message);
      }
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      deleteComment.mutate({ commentId });
      toast.success("Comment deleted");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      toast.error("Failed to delete comment");
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
    <div className="min-h-screen bg-white pb-20 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Gradients (Subtle) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 blur-[120px] rounded-full" />
        <div className="absolute top-40 left-0 w-[600px] h-[600px] bg-violet-50/50 blur-[100px] rounded-full" />
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Breadcrumb / Back */}
          <Link
            href={`/${username}`}
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile
          </Link>

          {/* Meta Badges */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
            {post.tags &&
              post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100"
                >
                  {tag}
                </span>
              ))}
            <span className="flex items-center text-xs font-medium text-slate-400">
              <Clock className="w-3 h-3 mr-1" /> {getReadingTime(post.content)}{" "}
              min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            {post.title}
          </h1>

          {/* Author Block */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link
              href={`/${username}`}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-12 h-12 rounded-full p-0.5 bg-linear-to-tr from-indigo-500 to-violet-500">
                <div className="relative w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-100">
                  {post.author.imageUrl ? (
                    <Image
                      src={post.author.imageUrl}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-full h-full p-2 text-slate-400" />
                  )}
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {post.author.name}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {typeof post.publishedAt !== "undefined" &&
                    new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100 aspect-21/9">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Article Body */}
        <article className="prose max-w-none mb-16">
          <div
            className="prose prose-lg max-w-none prose-invert prose-purple"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <hr className="border-slate-100 my-12" />

        {/* Engagement Bar (Floating/Sticky feel) */}
        <div className="flex items-center justify-between bg-white border border-slate-100 rounded-full px-6 py-3 shadow-lg shadow-slate-100 mb-16 sticky bottom-6 md:relative md:bottom-0 md:shadow-none md:border-0 md:bg-transparent md:px-0">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLikeToggle}
              size="lg"
              className={`rounded-full gap-2 transition-all ${
                hasLiked
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-500"
              }`}
            >
              <Heart className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
              <span className="font-bold">
                {post.likeCount.toLocaleString()}
              </span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .getElementById("comments")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-full gap-2 border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 bg-white"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-bold">{comments?.length || 0}</span>
            </Button>
          </div>

          <Button
            onClick={handleShare}
            variant="ghost"
            className="rounded-full text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>

        {/* --- COMMENTS SECTION --- */}
        <div
          id="comments"
          className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Discussion</h3>
          </div>

          {/* Comment Form */}
          {currentUser ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-10">
              <div className="flex gap-4">
                <div className="shrink-0 hidden sm:block">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                    {currentUser.imageUrl ? (
                      <Image
                        src={currentUser.imageUrl}
                        alt="You"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {currentUser.firstName?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <form onSubmit={handleCommentSubmit} className="flex-1">
                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl min-h-[100px] resize-none text-base mb-3"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">
                      {commentContent.length}/1000
                    </span>
                    <Button
                      type="submit"
                      disabled={isSubmittingComment || !commentContent.trim()}
                      className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 font-bold"
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Post Comment"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200 mb-10">
              <p className="text-slate-600 mb-4">
                Log in to join the conversation
              </p>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="rounded-full border-slate-300"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
              </div>
            ) : comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-4 group">
                  <div className="shrink-0">
                    <Link
                      href={
                        comment.author?.username
                          ? `/${comment.author.username}`
                          : "#"
                      }
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-white">
                        {comment.author?.imageUrl ? (
                          <Image
                            src={comment.author.imageUrl}
                            alt={comment.authorName}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-full h-full p-2 text-slate-400" />
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-slate-900 mr-2">
                            {comment.author?.name}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {currentUser &&
                          (currentUser.id === comment.authorId ||
                            currentUser.id === post.authorId) && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-4 italic">
                No comments yet. Be the first!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom prose styles */}
      <style jsx global>{`
        .prose-invert h1 {
          color: white;
          font-weight: 700;
          font-size: 2.5rem;
          margin: 1.5rem 0;
        }
        .prose-invert h2 {
          color: white;
          font-weight: 600;
          font-size: 2rem;
          margin: 1.25rem 0;
        }
        .prose-invert h3 {
          color: white;
          font-weight: 600;
          font-size: 1.5rem;
          margin: 1rem 0;
        }
        .prose-invert p {
          color: rgb(203, 213, 225);
          line-height: 1.7;
          margin: 1rem 0;
        }
        .prose-invert blockquote {
          border-left: 4px solid rgb(147, 51, 234);
          color: rgb(203, 213, 225);
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
        }
        .prose-invert a {
          color: rgb(147, 51, 234);
        }
        .prose-invert a:hover {
          color: rgb(168, 85, 247);
        }
        .prose-invert code {
          background: rgb(51, 65, 85);
          color: rgb(248, 113, 113);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        .prose-invert pre {
          background: rgb(30, 41, 59);
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgb(71, 85, 105);
          overflow-x: auto;
        }
        .prose-invert ul,
        .prose-invert ol {
          color: rgb(203, 213, 225);
          padding-left: 1.5rem;
        }
        .prose-invert li {
          margin: 0.25rem 0;
        }
        .prose-invert img {
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .prose-invert strong {
          color: white;
        }
        .prose-invert em {
          color: rgb(203, 213, 225);
        }
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
  );
}

export default UserPostPage;
