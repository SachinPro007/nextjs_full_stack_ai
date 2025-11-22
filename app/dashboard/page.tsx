"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Activitis } from "@/convex/dashboard";
import { Post } from "@/convex/schema";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { formatDistanceToNow } from "date-fns";
import {
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  PlusCircle,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
  Zap,
  PenTool,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import React from "react";

// --- Types ---
interface PostWithCommentCount extends Post {
  commentCount: number;
}

interface Analytics {
  data:
    | {
        totalView: number;
        totalLikes: number;
        recentComments: number;
        totalFollowers: number;
        viewsGrowth: number;
        likesGrowth: number;
        commentsGrowth: number;
        followersGrowth: number;
      }
    | undefined;
  isLoading: boolean;
}

interface PostsWithAnalytics {
  data: PostWithCommentCount[] | undefined;
  isLoading: boolean;
}

interface RecentActivitis {
  data: Activitis[] | undefined;
  isLoading: boolean;
}

function Dashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useConvexQuery(
    api.dashboard.getAnalytics,
  ) as Analytics;
  const { data: recentPosts, isLoading: postsLoading } = useConvexQuery(
    api.dashboard.getPostsWithAnalytics,
  ) as PostsWithAnalytics;
  const { data: recentActivity, isLoading: activityLoading } = useConvexQuery(
    api.dashboard.recentActivity,
  ) as RecentActivitis;

  // --- Loading State ---
  if (analyticsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse" />
          <div className="relative bg-white p-4 rounded-2xl shadow-xl border border-indigo-100">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse">
          Syncing dashboard...
        </p>
      </div>
    );
  }

  // --- Default Values ---
  const stats = analytics || {
    totalView: 0,
    totalLikes: 0,
    recentComments: 0,
    totalFollowers: 0,
    viewsGrowth: 0,
    likesGrowth: 0,
    commentsGrowth: 0,
    followersGrowth: 0,
  };

  const formatTime = (timestamp: number | string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const statsCard = [
    {
      icon: Eye,
      growth: stats.viewsGrowth,
      text: "Total Views",
      count: stats.totalView.toLocaleString(),
      color: "indigo",
    },
    {
      icon: Heart,
      growth: stats.likesGrowth,
      text: "Total Likes",
      count: stats.totalLikes.toLocaleString(),
      color: "pink",
    },
    {
      icon: MessageCircle,
      growth: stats.commentsGrowth,
      text: "Comments",
      count: stats.recentComments.toLocaleString(),
      color: "amber",
    },
    {
      icon: Users,
      growth: stats.followersGrowth,
      text: "Followers",
      count: stats.totalFollowers.toLocaleString(),
      color: "violet",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">
              Live Overview
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Welcome back, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
              Creator.
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            Here&apos;s what&apos;s happening with your content ecosystem today.
          </p>
        </div>

        <Link href="/dashboard/create">
          <Button className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all">
            <PenTool className="h-4 w-4 mr-2" />
            Write New Post
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCard.map((s) => (
          <div
            key={s.text}
            className={`relative p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <s.icon className={`w-24 h-24 text-${s.color}-600 -mr-4 -mt-4`} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 bg-${s.color}-50 rounded-xl border border-${s.color}-100 group-hover:bg-${s.color}-100 transition-colors`}
                >
                  <s.icon className={`h-6 w-6 text-${s.color}-600`} />
                </div>

                {s.growth > 0 && (
                  <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 shadow-none">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {s.growth}%
                  </Badge>
                )}
              </div>

              <p className="text-sm font-medium text-slate-500 mb-1">
                {s.text}
              </p>

              <h3 className="text-3xl font-black text-slate-900">{s.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Recent Posts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Latest Writings
            </h2>
            <Link href="/dashboard/posts">
              <Button
                variant="ghost"
                className="text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {postsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
              </div>
            ) : recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div
                  key={post._id}
                  className="group relative bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-3 sm:gap-4">
                    {/* Content Wrapper */}
                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Status Badge Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                            post.status === "published"
                              ? "bg-emerald-500"
                              : "bg-amber-400"
                          }`}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {post.status}
                        </span>
                        <span className="text-xs text-slate-300 hidden sm:inline">
                          •
                        </span>
                        <span className="text-xs text-slate-400 font-medium truncate">
                          {formatTime(
                            post.status === "published"
                              ? post.publishedAt!
                              : post.updatedAt,
                          )}
                        </span>
                      </div>

                      {/* Title */}
                      <Link
                        href={`/dashboard/posts/edit/${post._id}`}
                        className="block group-hover:text-indigo-600 transition-colors"
                      >
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate pr-2">
                          {post.title || "Untitled Draft"}
                        </h3>
                      </Link>

                      {/* Metrics Row - Responsive Gaps */}
                      <div className="flex items-center gap-4 sm:gap-6 pt-1">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm group-hover:text-indigo-500/70 transition-colors">
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="font-medium">
                            {post.viewCount || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm group-hover:text-pink-500/70 transition-colors">
                          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="font-medium">
                            {post.likeCount || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm group-hover:text-amber-500/70 transition-colors">
                          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="font-medium">
                            {post.commentCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button - Edit post */}
                    <Link
                      href={`/dashboard/posts/edit/${post._id}`}
                      className="shrink-0"
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-xl h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
                      >
                        <PenTool className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Empty State
              <div className="text-center py-12 sm:py-16 px-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No content yet
                </h3>
                <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                  Your audience is waiting. Create your first masterpiece today.
                </p>
                <Link href="/dashboard/create">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200">
                    Create Post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Actions & Activity */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="rounded-3xl p-1 bg-linear-to-br from-indigo-600 to-violet-600 shadow-2xl shadow-indigo-200/50">
            <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-6 text-white h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                  <Zap className="w-5 h-5 text-yellow-300" />
                </div>
                <h3 className="font-bold text-lg">Quick Actions</h3>
              </div>

              <div className="space-y-3">
                <Link href="/dashboard/create" className="block">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all text-sm font-semibold text-left">
                    <PlusCircle className="w-4 h-4 text-indigo-200 shrink-0" />
                    Create New Post
                  </button>
                </Link>
                <Link href="/dashboard/posts" className="block">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all text-sm font-semibold text-left">
                    <MoreHorizontal className="w-4 h-4 text-indigo-200 shrink-0" />
                    Manage Content
                  </button>
                </Link>
                <Link href="/settings" className="block">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all text-sm font-semibold text-left">
                    <Users className="w-4 h-4 text-indigo-200 shrink-0" />
                    View Audience
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Activity Feed
            </h3>

            <div className="space-y-6 pl-2">
              {activityLoading ? (
                <div className="py-4 text-center text-slate-400 text-sm">
                  Loading activity...
                </div>
              ) : recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="relative pl-6 pb-2 border-l border-slate-100 last:border-0"
                  >
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ring-1 ${
                        activity.type === "like"
                          ? "bg-pink-500 ring-pink-100"
                          : activity.type === "comment"
                            ? "bg-amber-500 ring-amber-100"
                            : "bg-emerald-500 ring-emerald-100"
                      }`}
                    />

                    <div className="text-sm">
                      <p className="text-slate-700 leading-snug">
                        <span className="font-bold text-slate-900">
                          {activity.user}
                        </span>
                        <span className="text-slate-500">
                          {activity.type === "like" && " liked "}
                          {activity.type === "comment" && " commented on "}
                          {activity.type === "follow" && " followed you"}
                        </span>
                        {activity.post && (
                          <span className="text-indigo-600 font-medium block mt-1 truncate max-w-[200px] sm:max-w-full">
                            &quot;{activity.post}&quot;
                          </span>
                        )}
                      </p>
                      <span className="text-xs text-slate-400 mt-1 block">
                        {formatTime(activity.time)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm italic">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
