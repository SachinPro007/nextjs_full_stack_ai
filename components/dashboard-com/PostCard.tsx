import { PostWithUsername } from "@/app/dashboard/posts/page";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Edit,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Trash2,
  Clock,
  Tag,
  User,
  BarChart3,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { User as UserType } from "@/convex/users";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostWithUsername;
  showActions: boolean;
  showAuthor: boolean;
  onEdit: (post: PostWithUsername) => void;
  onDelete: (post: PostWithUsername) => void;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

function PostCard({
  post,
  showActions,
  showAuthor,
  onEdit,
  onDelete,
  className = "",
  variant = "default",
}: PostCardProps) {
  const [now, setNow] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { data: author } = useConvexQuery(api.users.getCurrentUser) as {
    data: UserType | undefined;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    if (post.status === "published") {
      if (post.scheduledFor && post.scheduledFor > now) {
        return {
          className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          label: "Scheduled",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
      } else {
        return {
          className: "bg-green-500/20 text-green-300 border-green-500/30",
          label: "Published",
          icon: <BarChart3 className="h-3 w-3 mr-1" />,
        };
      }
    }

    return {
      className: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      label: "Draft",
      icon: <Edit className="h-3 w-3 mr-1" />,
    };
  };

  const getPostUrl = () => {
    if (post.status === "published" && post.username) {
      return `/${post.username}/${post._id}`;
    }
    return null;
  };

  const statusBadge = getStatusBadge();
  const publicUrl = getPostUrl();
  const isScheduled = post.scheduledFor && post.scheduledFor > now;
  const featuredImage = imageError
    ? "/blankImage.png"
    : post.featuredImage || "/blankImage.png";

  const featuredView = variant === "featured";

  return (
    <Card
      className={cn(
        "card-glass hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group",
        featuredView && "border-2 border-purple-500/30",
        className,
      )}
    >
      <CardContent className={cn("p-6", featuredView && "p-8")}>
        {/* Featured Image */}
        <Link
          href={publicUrl || "#"}
          className={cn(
            "block relative overflow-hidden rounded-xl mb-4",
            !publicUrl && "pointer-events-none",
            featuredView ? "h-64" : "h-48",
          )}
        >
          <Image
            src={featuredImage}
            alt={post.title}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
              "group-hover:scale-105",
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sizes={
              featuredView
                ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
            priority={featuredView}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-blue-500/20 animate-pulse" />
          )}

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Status badge on image */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="default"
              className={cn("backdrop-blur-sm", statusBadge.className)}
            >
              {statusBadge.icon}
              {statusBadge.label}
            </Badge>
          </div>
        </Link>

        <div className="space-y-4">
          {/* Header with title and actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {isScheduled && (
                  <div className="flex items-center text-sm text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.scheduledFor!).toLocaleDateString()}
                  </div>
                )}

                {/* Author */}
                {showAuthor && author && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <User className="h-3 w-3" />
                    <span>{author.name}</span>
                    {author.username && (
                      <span className="text-slate-500">@{author.username}</span>
                    )}
                  </div>
                )}
              </div>

              <Link
                href={publicUrl || "#"}
                className={!publicUrl ? "pointer-events-none" : "block"}
              >
                <h3
                  className={cn(
                    "font-bold text-white hover:text-purple-300 transition-colors line-clamp-2 leading-tight",
                    featuredView ? "text-2xl" : "text-xl",
                  )}
                >
                  {post.title}
                </h3>
              </Link>
            </div>

            {/* Post Actions */}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(post)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                  )}
                  {publicUrl && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={publicUrl}
                        target="_blank"
                        className="flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Public
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(post)}
                        className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Post
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Description/Excerpt */}
          {post.content && (
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
              {post.content}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-3 w-3 text-slate-500" />
              {post.tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs hover:bg-purple-500/30 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 4 && (
                <Badge
                  variant="secondary"
                  className="bg-slate-500/20 text-slate-300 border-slate-500/30 text-xs"
                >
                  +{post.tags.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Stats & Meta */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div
                className="flex items-center gap-1.5 tooltip"
                data-tip="Views"
              >
                <Eye className="h-4 w-4" />
                <span className="font-medium">
                  {post.viewCount?.toLocaleString() || 0}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 tooltip"
                data-tip="Likes"
              >
                <Heart className="h-4 w-4" />
                <span className="font-medium">
                  {post.likeCount?.toLocaleString() || 0}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 tooltip"
                data-tip="Comments"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">0</span>
              </div>
            </div>

            <time className="text-sm text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.status === "published" && post.publishedAt
                ? formatDistanceToNow(new Date(post.publishedAt), {
                    addSuffix: true,
                  })
                : formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;
