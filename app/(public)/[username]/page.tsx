"use client";

import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { notFound } from "next/navigation";
import React, { Usable } from "react";
import PublicHeader from "./_components/PublicHeader";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, UserCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/convex/users";
import { Card, CardContent } from "@/components/ui/card";
import PostCard, { PostWithAuthor } from "@/components/dashboard-com/PostCard";

// types
interface UserProfileFnProp {
  params: Usable<{ username: string }>;
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
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser) as {
    data: User | undefined;
  };

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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
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

    try {
      await toggleFollow.mutate({ followingId: user?._id });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update follow status");
      }
    }
  };

  return (
    <>
      <PublicHeader link="/" title="Back to Home" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name}
                fill
                loading="eager"
                className="rounded-full object-cover border-2 border-slate-700"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-2 gradient-text-primary">
            {user.name}
          </h1>

          <p className="text-xl text-slate-400 mb-4">@{user.username}</p>

          {/* Follow Button */}
          {!isOwnProfile && currentUser && (
            <Button
              onClick={handleFollowToggle}
              disabled={toggleFollow.isLoading}
              variant={isFollowing ? "outline" : "secondary"}
              className="mb-4"
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
          <div className="flex items-center justify-center text-sm text-slate-500">
            <Calendar className="h-4 w-4 mr-2" />
            Joined{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {posts.length}
              </div>
              <div className="text-sm text-slate-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {followersCount || 0}
              </div>
              <div className="text-sm text-slate-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {posts
                  .reduce((acc, post) => acc + post.viewCount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {posts
                  .reduce((acc, post) => acc + post.likeCount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">Total Likes</div>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Recent Posts</h2>

          {posts.length === 0 ? (
            <Card className="card-glass">
              <CardContent className="text-center py-12">
                <p className="text-slate-400 text-lg">No posts yet</p>
                <p className="text-slate-500 text-sm mt-2">
                  Check back later for new content!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </>
  );
}

export default UserProfilePage;
