"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import {
  Loader2,
  UserMinus,
  UserPlus,
  Users,
  Search,
  UserCheck,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

// --- Types ---
interface FetchData {
  _id: Id<"users">;
  name: string;
  username: string | undefined;
  imageUrl: string | undefined;
  followedAt: number;
  followsBack?: boolean;
}

interface UserCardProps {
  user: FetchData;
  currentLoadingId: string | null;
  variant?: "follower" | "following";
  onToggle: (userId: Id<"users">) => void;
}

// --- Component: User Card ---
const UserCard = ({
  user,
  currentLoadingId,
  variant = "follower",
  onToggle,
}: UserCardProps) => {
  const isLoading = currentLoadingId === user._id;

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(user._id);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <Link
          href={user.username ? `/${user.username}` : "#"}
          className="flex gap-4 items-center flex-1 min-w-0"
        >
          <div className="relative w-14 h-14 shrink-0">
            <div className="absolute inset-0 bg-indigo-100 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-full h-full rounded-full border-2 border-white shadow-sm overflow-hidden ring-2 ring-slate-50 group-hover:ring-indigo-100 transition-all">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-lg truncate leading-tight group-hover:text-indigo-600 transition-colors">
              {user.name}
            </h4>
            <p className="text-sm text-slate-500 truncate">
              @{user.username || "user"}
            </p>
          </div>
        </Link>
      </div>

      <div className="pt-3 mt-auto flex items-center justify-between border-t border-slate-50">
        <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
          {variant === "follower" && user.followsBack && (
            <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Follows you
            </span>
          )}
          {variant === "following" && (
            <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
              Following
            </span>
          )}
        </div>

        {variant === "follower" ? (
          !user.followsBack ? (
            <Button
              onClick={handleButtonClick}
              disabled={isLoading}
              size="sm"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  Follow Back
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleButtonClick}
              disabled={isLoading}
              variant="ghost"
              size="sm"
              className="rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Unfollow"
              )}
            </Button>
          )
        ) : (
          <Button
            onClick={handleButtonClick}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserMinus className="h-4 w-4 mr-1.5" />
                Unfollow
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// --- Component: Empty State ---
const EmptyState = ({ type }: { type: "followers" | "following" }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50 col-span-full">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
      <Users className="w-8 h-8 text-slate-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">
      {type === "followers"
        ? "No followers yet"
        : "You aren't following anyone"}
    </h3>
    <p className="text-slate-500 max-w-xs mx-auto mb-6">
      {type === "followers"
        ? "Keep creating great content! They will come."
        : "Explore the community to find amazing creators."}
    </p>
    {type === "following" && (
      <Link href="/feed">
        <Button
          variant="outline"
          className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
        >
          Explore Community
        </Button>
      </Link>
    )}
  </div>
);

// --- Page ---
function FollowersPage() {
  const [searchInput, setsearchInput] = useState("");
  const [activeTab, setActiveTab] = useState<string>("followers");

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: followers, isLoading: followersLoading } = useConvexQuery(
    api.follows.getMyFollowers,
    { limit: 100 },
  ) as { data: FetchData[] | undefined; isLoading: boolean };

  const { data: followings, isLoading: followingsLoading } = useConvexQuery(
    api.follows.getMyFollowings,
    { limit: 100 },
  ) as { data: FetchData[] | undefined; isLoading: boolean };

  const { mutate: toggleFollow } = useConvexMutation(api.follows.toggleFollow);

  const handleFollowToggle = async (userId: Id<"users">) => {
    setTogglingId(userId);
    try {
      await toggleFollow({ followingId: userId });
      toast.success("Success");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setTogglingId(null);
    }
  };

  if (followersLoading || followingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="p-4 rounded-full bg-white shadow-xl shadow-indigo-100 animate-bounce">
          <Sparkles className="h-8 w-8 text-indigo-600" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">
          Syncing community...
        </p>
      </div>
    );
  }

  const searchInputLower = searchInput.trim().toLowerCase();
  const filterFollowers =
    followers &&
    followers.filter(
      (f) =>
        f.name.toLowerCase().includes(searchInputLower) ||
        f.username?.toLowerCase().includes(searchInputLower),
    );
  const filterFollowings =
    followings &&
    followings.filter(
      (f) =>
        f.name.toLowerCase().includes(searchInputLower) ||
        f.username?.toLowerCase().includes(searchInputLower),
    );

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-20 pt-24 px-6">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-60" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100/40 blur-[100px] rounded-full opacity-70" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-100/40 blur-[100px] rounded-full opacity-70" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-3">
              <HeartHandshake className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-600 tracking-wide uppercase">
                Community
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              Connections
            </h1>
            <p className="text-lg text-slate-500">
              Manage your audience and the creators you love.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-center min-w-[100px]">
              <div className="text-2xl font-black text-slate-900">
                {followers?.length || 0}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Followers
              </div>
            </div>
            <div className="px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-center min-w-[100px]">
              <div className="text-2xl font-black text-slate-900">
                {followings?.length || 0}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Following
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="followers"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <TabsList className="h-14 p-1 bg-white border border-slate-200 rounded-full shadow-sm inline-flex w-full sm:w-auto">
              <TabsTrigger
                value="followers"
                className="flex-1 sm:flex-none rounded-full px-6 h-full text-sm font-bold transition-all data-[state=active]:bg-indigo-600! data-[state=active]:text-white! data-[state=active]:shadow-md!"
              >
                Followers
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="flex-1 sm:flex-none rounded-full px-6 h-full text-sm font-bold transition-all data-[state=active]:bg-indigo-600! data-[state=active]:text-white! data-[state=active]:shadow-md!"
              >
                Following
              </TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setsearchInput(e.target.value)}
                placeholder="Filter users..."
                className="w-full pl-9 pr-4 h-10 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Content */}
          <TabsContent value="followers" className="outline-none">
            {filterFollowers && filterFollowers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterFollowers.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    variant="follower"
                    currentLoadingId={togglingId}
                    onToggle={handleFollowToggle}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="followers" />
            )}
          </TabsContent>

          <TabsContent value="following" className="outline-none">
            {filterFollowings && filterFollowings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterFollowings.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    variant="following"
                    currentLoadingId={togglingId}
                    onToggle={handleFollowToggle}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="following" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default FollowersPage;
