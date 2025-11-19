"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Activitis } from "@/convex/dashboard";
import { Post } from "@/convex/schema";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  PlusCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

// types
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

  // Loading states
  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-slate-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Default values if no data
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

  // Format time relative to now
  const formatTime = (timestamp: number | string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text-primary">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Welcome back! Here`s what`s happening with your content.
          </p>
        </div>

        <Link href="/dashboard/create">
          <Button variant={"default"}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* views */}
        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalView.toLocaleString()}
            </div>
            {stats.viewsGrowth > 0 && (
              <div className="flex items-center text-xs text-green-400 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />+{stats.viewsGrowth}%
                from last month
              </div>
            )}
          </CardContent>
        </Card>

        {/* likes */}
        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Likes
            </CardTitle>
            <Heart className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalLikes.toLocaleString()}
            </div>
            {stats.likesGrowth > 0 && (
              <div className="flex items-center text-xs text-green-400 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />+{stats.likesGrowth}%
                from last month
              </div>
            )}
          </CardContent>
        </Card>

        {/* comments */}
        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">
              Comments
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.recentComments.toLocaleString()}
            </div>
            {stats.commentsGrowth > 0 && (
              <div className="flex items-center text-xs text-green-400 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />+{stats.commentsGrowth}%
                from last month
              </div>
            )}
          </CardContent>
        </Card>

        {/* followers */}
        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">
              Followers
            </CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalFollowers.toLocaleString()}
            </div>
            {stats.followersGrowth > 0 && (
              <div className="flex items-center text-xs text-green-400 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />+{stats.followersGrowth}%
                from last month
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* main content grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Posts */}
          <Card className="card-glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Recent Posts</CardTitle>
                <Link href="/dashboard/posts">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                </div>
              ) : recentPosts && recentPosts?.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Link
                      href={`/dashboard/posts/edit/${post._id}`}
                      key={post._id}
                      className="flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-700/30 cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-white truncate">
                          {post.title || "Untitled Post"}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : post.status === "draft"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              post.status === "published"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : post.status === "draft"
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                            }
                          >
                            {post.status}
                          </Badge>

                          {/* post age */}
                          <span className="text-sm text-slate-400">
                            {post.status === "published" && post.publishedAt
                              ? `Published ${formatTime(post.publishedAt)}`
                              : post.status === "draft"
                                ? `Updated ${formatTime(post.updatedAt)}`
                                : post.scheduledFor
                                  ? `Scheduled for ${new Date(post.scheduledFor).toLocaleDateString()}`
                                  : `Updated ${formatTime(post.updatedAt)}`}
                          </span>
                        </div>
                      </div>

                      {/* post analytics */}
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.viewCount || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likeCount || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.commentCount || 0}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">No posts yet</p>
                  <Link href="/dashboard/create">
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Your First Post
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription>
                Latest interactions with your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                </div>
              ) : recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                          activity.type === "like"
                            ? "bg-red-500/20 text-red-300"
                            : activity.type === "comment"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {activity.type === "like" && (
                          <Heart className="h-3 w-3" />
                        )}
                        {activity.type === "comment" && (
                          <MessageCircle className="h-3 w-3" />
                        )}
                        {activity.type === "follow" && (
                          <Users className="h-3 w-3" />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-white">
                          <span className="font-medium">{activity.user}</span>
                          {activity.type === "like" &&
                            ` liked your post "${activity.post}"`}
                          {activity.type === "comment" &&
                            ` commented on "${activity.post}"`}
                          {activity.type === "follow" &&
                            " started following you"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatTime(activity.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/create">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Post
                </Button>
              </Link>

              <Link href="/dashboard/posts">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Posts
                </Button>
              </Link>

              <Link href="/dashboard/followers">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Followers
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
