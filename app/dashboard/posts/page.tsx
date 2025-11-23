"use client";

import PostCard, { PostWithAuthor } from "@/components/dashboard-com/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import {
  currentTime,
  useConvexMutation,
  useConvexQuery,
} from "@/hooks/use-convex-query";
import {
  BarChart3,
  FileText,
  Filter,
  LayoutGrid,
  PlusCircle,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const now = currentTime;

  // --- Data Fetching ---
  const { data: posts, isLoading } = useConvexQuery(
    api.posts.getUserAllPosts,
  ) as { data: PostWithAuthor[] | undefined; isLoading: boolean };

  const deletePost = useConvexMutation(api.posts.deletePost);

  // --- Logic: Filter & Sort ---
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    const filtered = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b._creationTime).getTime() -
            new Date(a._creationTime).getTime()
          );
        case "oldest":
          return (
            new Date(a._creationTime).getTime() -
            new Date(b._creationTime).getTime()
          );
        case "mostViews":
          return (b.viewCount || 0) - (a.viewCount || 0);
        case "mostLikes":
          return (b.likeCount || 0) - (a.likeCount || 0);
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        default:
          return (
            new Date(b._creationTime).getTime() -
            new Date(a._creationTime).getTime()
          );
      }
    });

    return filtered;
  }, [posts, searchQuery, statusFilter, sortBy]);

  // --- Logic: Stats ---
  const stats = useMemo(() => {
    if (!posts) return null;

    return {
      total: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      draft: posts.filter((p) => p.status === "draft").length,
      scheduled: posts.filter(
        (p) =>
          p.status === "published" && p.scheduledFor && p.scheduledFor > now,
      ).length,
      totalViews: posts.reduce((sum, post) => sum + (post.viewCount || 0), 0),
    };
  }, [posts, now]);

  // --- Handlers ---
  const handleDeletePost = async (post: PostWithAuthor) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      await deletePost.mutate({ _id: post._id });
      toast.success("Post deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      toast.error("Failed to delete post");
    }
  };

  const handleEditPost = (post: PostWithAuthor) => {
    router.push(`/dashboard/posts/edit/${post._id}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh for UX (Convex is real-time, but this gives feedback)
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dashboard synced");
    }, 800);
  };

  // --- Loading View ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="p-4 rounded-full bg-white shadow-xl shadow-indigo-100 animate-bounce">
          <Sparkles className="h-8 w-8 text-indigo-600" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">
          Loading your masterpieces...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-20 pt-24 px-6">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-60" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-100/40 blur-[100px] rounded-full opacity-70" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-violet-100/40 blur-[100px] rounded-full opacity-70" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-3">
              <LayoutGrid className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-600 tracking-wide uppercase">
                Content Manager
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              My Posts
            </h1>
            <p className="text-lg text-slate-500 max-w-xl">
              Create, edit, and track the performance of your articles.
            </p>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="hidden sm:flex bg-white hover:bg-slate-50 text-slate-600 border-slate-200 rounded-xl shadow-sm"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`}
              />
              Sync
            </Button>
            <Link href="/dashboard/create" className="flex-1 lg:flex-none">
              <Button className="w-full lg:w-auto h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-transform hover:-translate-y-0.5">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* --- STATS STRIP --- */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900">
                {stats.published}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Published
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900">
                {stats.draft}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Drafts
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900">
                {stats.scheduled}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Scheduled
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900">
                {stats.totalViews}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <BarChart3 className="w-3 h-3 text-violet-500" />
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Total Views
                </span>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTROLS TOOLBAR --- */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-2 sticky top-4 z-20">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 text-slate-700"
            />
          </div>

          <div className="flex gap-2">
            <div className="h-8 w-px bg-slate-100 my-auto hidden md:block" />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[140px] h-10 border-0 bg-slate-50 hover:bg-slate-100 text-slate-600 focus:ring-0 rounded-xl">
                <Filter className="h-4 w-4 mr-2 opacity-50" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40 h-10 border-0 bg-slate-50 hover:bg-slate-100 text-slate-600 focus:ring-0 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="updated">Recently Updated</SelectItem>
                <SelectItem value="mostViews">Most Views</SelectItem>
                <SelectItem value="mostLikes">Most Likes</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <FileText className="h-10 w-10 text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchQuery || statusFilter !== "all"
                ? "No matching posts found"
                : "No posts created yet"}
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Your audience is waiting. Write something amazing today and share your knowledge with the world."}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/dashboard/create">
                <Button
                  size="lg"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Write Your First Post
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {filteredPosts.map((post) => (
              // Ensuring the PostCard wrapper fits the theme
              <div key={post._id} className="h-full">
                <PostCard
                  post={post}
                  showActions={true}
                  showAuthor={false}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- REFRESH OVERLAY --- */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl shadow-indigo-100 border border-indigo-50 flex items-center gap-4">
            <div className="p-2 bg-indigo-50 rounded-full">
              <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />
            </div>
            <span className="text-slate-700 font-bold">
              Syncing latest data...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostsPage;
