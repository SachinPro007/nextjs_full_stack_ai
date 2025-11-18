"use client";

import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { useInView } from "react-intersection-observer";
import React, { useState } from "react";
import { toast } from "sonner";
import PostCard, { PostWithAuthor } from "@/components/dashboard-com/PostCard";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, TrendingUp, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/convex/users";
import { useUser } from "@clerk/nextjs";

function Feed() {
  const { user: currentUser } = useUser();
  console.log(currentUser);

  // const { data: currentUser } = useConvexQuery(api.users.getCurrentUser) as {
  //   data: User | undefined;
  // };
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
    <div className="min-h-screen bg-slate-900 text-white pt-32 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Feed Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold gradient-text-primary pb-2">
            Discover Amazing Content
          </h1>
          <p className="text-slate-400">
            Stay up to date with the latest posts from creators you follow
          </p>
        </div>

        {/* Main Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4 space-y-6">
            {/* Feed Tabs */}
            <div className="flex space-x-2">
              <Button
                onClick={() => setActiveTab("feed")}
                variant={activeTab === "feed" ? "default" : "ghost"}
                className="flex-1"
              >
                For You
              </Button>
              <Button
                onClick={() => setActiveTab("trending")}
                variant={activeTab === "trending" ? "default" : "ghost"}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </Button>
            </div>

            {/* Create Post Prompt */}
            {currentUser && (
              <Link
                href="/dashboard/create"
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="relative w-10 h-10">
                  {currentUser.imageUrl ? (
                    <Image
                      src={currentUser.imageUrl}
                      alt={currentUser.firstName || "User"}
                      fill
                      className="rounded-full object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                      {(currentUser.firstName || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-slate-800 border border-slate-600 rounded-full px-4 py-3 text-slate-400 hover:border-slate-500 transition-colors">
                    What`s on your mind? Share your thoughts...
                  </div>
                </div>
              </Link>
            )}

            {/* Posts Feed */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
                  <p className="text-slate-400">Loading posts...</p>
                </div>
              </div>
            ) : currentPosts.length === 0 ? (
              <Card className="card-glass">
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <div className="text-6xl">📝</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {activeTab === "trending"
                          ? "No trending posts right now"
                          : "No posts to show"}
                      </h3>
                      <p className="text-slate-400 mb-6">
                        {activeTab === "trending"
                          ? "Check back later for trending content"
                          : "Follow some creators to see their posts here"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Posts Grid */}
                <div className="space-y-6">
                  {currentPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      showActions={false}
                      showAuthor={true}
                      className="max-w-none"
                    />
                  ))}
                </div>

                {/* Load More Indicator */}
                {activeTab === "feed" && feedData?.hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Left Sidebar - Following */}
          <div className="lg:col-span-2 space-y-6 mt-14">
            {/* Suggested Users */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Suggested Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestionsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                  </div>
                ) : !suggestedUsers || suggestedUsers.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-slate-400 text-sm">
                      No suggestions available
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestedUsers.map((user) => (
                      <div key={user._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Link href={`/${user.username}`}>
                            <div className="flex items-center space-x-3 cursor-pointer">
                              <div className="relative w-10 h-10">
                                {user.imageUrl ? (
                                  <Image
                                    src={user.imageUrl}
                                    alt={user.name}
                                    fill
                                    className="rounded-full object-cover"
                                    sizes="40px"
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">
                                  {user.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                  @{user.username}
                                </p>
                              </div>
                            </div>
                          </Link>
                          <Button
                            onClick={() => handleFollowToggle(user._id)}
                            variant="outline"
                            size="sm"
                            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Follow
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
