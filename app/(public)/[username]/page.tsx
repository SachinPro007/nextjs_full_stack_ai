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
  Sparkles,
  MapPin,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import PostCard, { PostWithAuthor } from "@/components/dashboard-com/PostCard";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { User } from "@/convex/users";

// types
interface UserProfileFnProp {
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
        bio?: string;
        state?: string;
        country?: string;
      }
    | undefined;
  isLoading: boolean;
  error: string | null;
}

function UserProfilePage({ params }: UserProfileFnProp) {
  const { username } = React.use(params);
  const { user: clerkuser } = useUser();

  // Get Current logged in user
  const { data: currentUser } = useConvexQuery(
    api.users.getCurrentUser,
    clerkuser ? {} : "skip",
  ) as { data: User | undefined };

  // --- Data Fetching ---
  // Get Profile User (Public - Runs for everyone)
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useConvexQuery(api.users.getUserByUsername, {
    username,
  }) as GetUserByUsername;

  const { data: postsData, isLoading: postsLoading } = useConvexQuery(
    api.public.getPublishedPostsByUserName,
    {
      username,
      limit: 20,
    },
  ) as { data: { posts: PostWithAuthor[] } | undefined; isLoading: boolean };

  const { data: followersCount } = useConvexQuery(
    api.follows.getFollowerCount,
    { userId: user?._id },
  );

  const { data: isFollowing } = useConvexQuery(api.follows.isFollowing, {
    followingId: user?._id,
  });

  const toggleFollow = useConvexMutation(api.follows.toggleFollow);

  // --- Loading State ---
  if (userLoading || postsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50">
        <div className="p-4 rounded-full bg-white shadow-xl shadow-indigo-100 animate-bounce">
          <Sparkles className="h-8 w-8 text-indigo-600" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">
          Fetching profile...
        </p>
      </div>
    );
  }

  if (userError || !user) {
    notFound();
  }

  const isOwnProfile = currentUser && currentUser.username === user?.username;
  const posts = postsData?.posts || [];

  // --- Handlers ---
  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please sign in to follow users");
      return;
    }
    if (user.username === currentUser.username) {
      toast.error("You cannot follow yourself");
      return;
    }

    try {
      await toggleFollow.mutate({ followingId: user?._id });
      if (!isFollowing) toast.success(`You are now following ${user.name}`);
    } catch (error) {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error("Failed to update follow status");
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
        {/* --- PROFILE CARD --- */}
        <div className="relative mb-12">
          {/* Main Card Container */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/40 border border-slate-200 overflow-hidden">
            {/* 1. Cover Gradient (Twitter Style Banner) */}
            <div className="h-48 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
              <div className="absolute inset-0 bg-black opacity-20" />{" "}
            </div>

            <div className="px-8 pb-10 relative">
              {/* 2. Floating Avatar */}
              <div className="flex justify-between items-end -mt-16 mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-4xl p-1.5 bg-white shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="w-full h-full rounded-3xl overflow-hidden relative bg-slate-100">
                      {user.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt={user.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-4xl font-bold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Follow Button (Top Right Alignment) */}
                {!isOwnProfile && currentUser && (
                  <Button
                    onClick={handleFollowToggle}
                    className={`rounded-xl h-12 px-8 font-bold shadow-lg transition-all hover:-translate-y-1 ${
                      isFollowing
                        ? "bg-white text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 shadow-sm"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" /> Follow
                      </>
                    )}
                  </Button>
                )}

                {/* Edit Profile Button (If Own Profile) */}
                {isOwnProfile && (
                  <Link href={"/dashboard/settings"}>
                    <Button
                      variant="outline"
                      className="rounded-xl h-12 px-6 font-bold border-slate-200 hover:text-indigo-600 text-slate-700 cursor-pointer"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </div>

              {/* 3. User Info */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    {user.name}
                    {/*Verified Badge */}
                    <span className="bg-blue-500 text-white rounded-full p-1">
                      <Check className="w-2 h-2" />
                    </span>
                  </h1>
                  <p className="text-lg text-slate-500 font-medium">
                    @{user.username}
                  </p>
                </div>

                {/* Bio Section */}
                <div className="max-w-2xl">
                  {user.bio ? (
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {user.bio}
                    </p>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-slate-400 italic text-lg">
                      <span>No bio added yet.</span>
                      {isOwnProfile && (
                        <Link
                          href="/dashboard/settings"
                          className="not-italic font-semibold text-indigo-600 hover:text-indigo-700 hover:underline decoration-indigo-200 underline-offset-4 transition-all"
                        >
                          Complete your profile
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Meta Details */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-400 font-medium pt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined{" "}
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {user.state && user.country
                        ? `${user.state}, ${user.country}`
                        : "Unknown "}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Stats Strip */}
              <div className="mt-8 py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap gap-8 md:gap-12 items-center w-fit">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">
                    {posts.length}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Posts
                  </span>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">
                    {followersCount || 0}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Followers
                  </span>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">
                    {posts
                      .reduce((acc, post) => acc + post.likeCount, 0)
                      .toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Likes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 delay-200">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-indigo-500 rounded-full" />
              <h2 className="text-2xl font-bold text-slate-900">
                Latest Writings
              </h2>
            </div>

            {/* View Toggle (Visual Only) */}
            <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex">
              <button className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Grid className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-slate-200 rounded-4xl bg-white/50">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No posts yet
              </h3>
              <p className="text-slate-500 max-w-sm">
                {user.name} hasn&apos;t published any stories yet. Check back
                later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <div key={post._id} className="h-full">
                  <PostCard
                    post={post}
                    showActions={false}
                    showAuthor={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
