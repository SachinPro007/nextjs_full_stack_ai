"use client";

import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { useInView } from "react-intersection-observer";
import React, { useState } from "react";
import { toast } from "sonner";
import PostCard, { PostWithAuthor } from "@/components/dashboard-com/PostCard";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Sparkles,
  TrendingUp,
  UserPlus,
  PenTool,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/convex/users";
import { useUser } from "@clerk/nextjs";

function Feed() {
  const { user: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<"feed" | "trending">("feed");

  // Infinite scroll detection
  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const { data: feedData, isLoading: feedLoading } = useConvexQuery(
    api.feed.getFeed,
    { limit: 15 },
  ) as {
    data: { posts: PostWithAuthor[]; hasMore: boolean } | undefined;
    isLoading: boolean;
  };

  const { data: suggestedUsers, isLoading: suggestionsLoading } =
    useConvexQuery(api.feed.getSuggestedUsers) as {
      data: User[] | undefined;
      isLoading: boolean;
    };

  const { data: trendingPosts, isLoading: trendingLoading } = useConvexQuery(
    api.feed.getTrendingPosts,
  );

  // Mutation
  const toggleFollow = useConvexMutation(api.follows.toggleFollow);

  // handle user follow toggle
  const handleFollowToggle = async (userId: string) => {
    if (!currentUser) {
      toast.error("Please sign in to follow users");
      return;
    }

    try {
      await toggleFollow.mutate({ followingId: userId });
      toast.success("Updated follow status");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update follow status");
      }
    }
  };

  // Get current posts based on active tab
  const currentPosts =
    activeTab === "trending" ? trendingPosts || [] : feedData?.posts || [];
  const isLoading =
    feedLoading || (activeTab === "trending" && trendingLoading);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-10">
      {/* Abstract Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Feed Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Discover
            </h1>
            <p className="text-slate-500 mt-1">
              Insights from the best technical writers.
            </p>
          </div>

          {/* Feed Tabs - Segmented Control Style */}
          <div className="flex p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
            <Button
              onClick={() => setActiveTab("feed")}
              variant="ghost"
              size="sm"
              className={`flex-1 rounded-md transition-all ${
                activeTab === "feed"
                  ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              For You
            </Button>
            <Button
              onClick={() => setActiveTab("trending")}
              variant="ghost"
              size="sm"
              className={`flex-1 rounded-md transition-all ${
                activeTab === "trending"
                  ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Center Feed (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/*Left Sidebar - Create Post Prompt */}
            {currentUser && (
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden hover:border-indigo-200 transition-colors">
                <CardContent className="p-4">
                  <Link
                    href="/dashboard/create"
                    className="flex items-center space-x-4 cursor-pointer group"
                  >
                    <div className="relative w-10 h-10 shrink-0">
                      {currentUser.imageUrl ? (
                        <Image
                          src={currentUser.imageUrl}
                          alt={currentUser.firstName || "User"}
                          fill
                          className="rounded-full object-cover border border-slate-200"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                          {(currentUser.firstName || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-slate-500 text-sm group-hover:bg-white group-hover:border-indigo-200 group-hover:text-indigo-500 transition-all flex items-center gap-2">
                        <PenTool className="w-4 h-4" />
                        <span>What are you building today?</span>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Posts Feed */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  <p className="text-slate-500 text-sm">
                    Curating your feed...
                  </p>
                </div>
              </div>
            ) : currentPosts.length === 0 ? (
              <Card className="border-dashed border-2 border-slate-200 bg-slate-50 shadow-none">
                <CardContent className="text-center py-12">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {activeTab === "trending"
                          ? "No trending posts yet"
                          : "Your feed is empty"}
                      </h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
                        {activeTab === "trending"
                          ? "Be the first to create a viral post!"
                          : "Follow more creators to populate your personal feed."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-6">
                  {currentPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      showActions={true}
                      showAuthor={true}
                    />
                  ))}
                </div>

                {activeTab === "feed" && feedData?.hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar - Suggestions (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Suggestions Card */}
            <Card className="border-slate-200 shadow-sm bg-white sticky top-24">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  Who to follow
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {suggestionsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  </div>
                ) : !suggestedUsers || suggestedUsers.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-slate-500 text-sm">
                      No suggestions available right now.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {suggestedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between group"
                      >
                        <Link
                          href={`/${user.username}`}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="relative w-10 h-10 shrink-0">
                            {user.imageUrl ? (
                              <Image
                                src={user.imageUrl}
                                alt={user.name}
                                fill
                                className="rounded-full object-cover border border-slate-100"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              @{user.username}
                            </p>
                          </div>
                        </Link>

                        <Button
                          onClick={() => handleFollowToggle(user._id)}
                          variant="outline"
                          size="sm"
                          className="ml-2 h-8 px-3 border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 text-xs text-slate-400">
              <Link href="#" className="hover:text-indigo-600 hover:underline">
                About
              </Link>
              <Link href="#" className="hover:text-indigo-600 hover:underline">
                Help
              </Link>
              <Link href="#" className="hover:text-indigo-600 hover:underline">
                Terms
              </Link>
              <Link href="#" className="hover:text-indigo-600 hover:underline">
                Privacy
              </Link>
              <span>© 2025 Ezensi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
