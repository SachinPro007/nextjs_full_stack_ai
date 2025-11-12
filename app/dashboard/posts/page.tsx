"use client";

import PostCard from "@/components/dashboard-com/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Post } from "@/convex/schema";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import {
  FileText,
  Filter,
  PlusCircle,
  Search,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

// types
export interface PostWithUsername extends Post {
  username: string;
}

function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [now, setNow] = useState(0);
  const router = useRouter();

  // Get posts with refetch capability
  const { data: posts, isLoading } = useConvexQuery(
    api.posts.getUserAllPosts,
  ) as { data: PostWithUsername[] | undefined; isLoading: boolean };

  const deletePost = useConvexMutation(api.posts.deletePost);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Filter posts
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

    // Sort posts
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

  // Stats calculation
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
      totalLikes: posts.reduce((sum, post) => sum + (post.likeCount || 0), 0),
    };
  }, [posts, now]);

  // Delete post
  const handleDeletePost = async (post: PostWithUsername) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deletePost.mutate({ _id: post._id });
      toast.success("Post deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to delete post");
      }
    }
  };

  // Edit post
  const handleEditPost = (post: PostWithUsername) => {
    router.push(`/dashboard/posts/edit/${post._id}`);
  };

  // refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <BarLoader width={200} color="#3b82f6" />
          <p className="text-slate-400">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold gradient-text-primary">
            My Posts
          </h1>
          <p className="text-slate-400 text-lg">
            Manage and track your content performance
          </p>

          {/* Stats */}
          {stats && (
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-300">
                  {stats.published} Published
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-slate-300">
                  {stats.draft} Drafts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-300">
                  {stats.scheduled} Scheduled
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-slate-300">
                  {stats.totalViews} total views
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Link href="/dashboard/create" className="flex-1 lg:flex-none">
            <Button variant="default" className="w-full lg:w-auto">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card className="card-glass">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search posts by title or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-800/50 border-slate-600">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-800/50 border-slate-600">
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
        </CardContent>
      </Card>

      {/* Content */}
      {filteredPosts.length === 0 ? (
        <Card className="card-glass">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery || statusFilter !== "all"
                ? "No posts found"
                : "No posts yet"}
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Start creating amazing content for your audience. Your first post is just a click away!"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/dashboard/create">
                <Button variant="default" size="lg">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create Your First Post
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              showActions={true}
              showAuthor={false}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}

      {/* Refresh loading overlay */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-purple-500" />
            <span className="text-white">Refreshing posts...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostsPage;
