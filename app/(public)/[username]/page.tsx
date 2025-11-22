"use client";

import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { notFound } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  UserCheck,
  UserPlus,
  Grid,
  List,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import PostCard, { PostWithAuthor } from "@/components/dashboard-com/PostCard";
import { useUser } from "@clerk/nextjs";

// types
interface UserProfileFnProp {
  // Next.js 15 params are Promises
  params: Promise<{ username: string }>;
}

interface GetUserByUsername {
  data:
    | {
        _id: string;
        name: string;
        username: string;
        imageUrl: string;
        createdAt: number;
      }
    | undefined;
  isLoading: boolean;
  error: string | null;
}

function UserProfilePage({ params }: UserProfileFnProp) {
  const { username } = React.use(params);

  // get current logged user
  const { user: currentUser } = useUser();

  // get profile user
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useConvexQuery(api.users.getUserByUsername, {
    username,
  }) as GetUserByUsername;

  // get user published posts
  const { data: postsData, isLoading: postsLoading } = useConvexQuery(
    api.public.getPublishedPostsByUserName,
    {
      username,
      limit: 20,
    },
  ) as { data: { posts: PostWithAuthor[] } | undefined; isLoading: boolean };

  // get followers count
  const { data: followersCount } = useConvexQuery(
    api.follows.getFollowerCount,
    { userId: user?._id },
  );

  // Check current logged user following this profile
  const { data: isFollowing } = useConvexQuery(api.follows.isFollowing, {
    followingId: user?._id,
  });

  // toggleFollow
  const toggleFollow = useConvexMutation(api.follows.toggleFollow);

  // loading
  if (userLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    notFound();
  }

  // check current user on own profile page
  const isOwnProfile = currentUser && currentUser.username === user?.username;
  const posts = postsData?.posts || [];

  // handle user follow toggle
  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please sign in to follow users");
      return;
    }

    if (username === user.username) {
      toast.error("You can not follow yourself");
      return;
    }

    try {
      await toggleFollow.mutate({ followingId: user?._id });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update follow status");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-900 font-sans">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-60" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 blur-[100px] rounded-full opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-50/50 blur-[100px] rounded-full opacity-50" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 relative z-10 pt-24 md:pt-32">
        {/* Profile Header Card */}
        <Card className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden mb-10">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative w-28 h-28 mb-6 group">
                <div className="absolute inset-0 rounded-full bg-indigo-100/50 scale-110 group-hover:scale-125 transition-transform duration-500" />
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.name}
                    fill
                    loading="eager"
                    className="rounded-full object-cover border-4 border-white shadow-md relative z-10"
                    sizes="112px"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-white shadow-md relative z-10">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name & Handle */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1 tracking-tight">
                {user.name}
              </h1>
              <p className="text-lg text-slate-500 font-medium mb-6">
                @{user.username}
              </p>

              {/* Follow Button */}
              {!isOwnProfile && currentUser && (
                <Button
                  onClick={handleFollowToggle}
                  disabled={toggleFollow.isLoading}
                  className={`mb-8 px-8 h-10 rounded-full font-semibold transition-all ${
                    isFollowing
                      ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-red-600"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-8 md:gap-16 w-full max-w-lg mx-auto border-t border-slate-100 pt-8">
                <div className="flex flex-col items-center group">
                  <div className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {posts.length}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">
                    Posts
                  </div>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {followersCount || 0}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">
                    Followers
                  </div>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {posts
                      .reduce((acc, post) => acc + post.likeCount, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">
                    Likes
                  </div>
                </div>
              </div>

              {/* Date Joined */}
              <div className="mt-8 flex items-center text-sm text-slate-400 bg-slate-50 px-4 py-2 rounded-full">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Recent Posts
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-indigo-600"
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-indigo-600"
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {posts.length === 0 ? (
            <Card className="bg-slate-50 border-dashed border-2 border-slate-200 shadow-none rounded-2xl">
              <CardContent className="text-center py-16">
                <p className="text-slate-500 text-lg font-medium">
                  No posts published yet
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  This user hasn&apos;t shared any stories.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  showActions={false}
                  showAuthor={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
