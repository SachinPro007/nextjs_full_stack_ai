import React, { memo, useState } from "react";
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
  BarChart3,
  User,
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
import { currentTime } from "@/hooks/use-convex-query";
import { cn } from "@/lib/utils";
import { Post } from "@/convex/schema";

// types
export interface PostWithAuthor extends Post {
  username: string;
  author: {
    _id: string;
    name: string;
    username: string;
    imageUrl: string;
  };
}

interface PostCardProps {
  post: PostWithAuthor;
  showActions: boolean;
  showAuthor: boolean;
  onEdit?: (post: PostWithAuthor) => void;
  onDelete?: (post: PostWithAuthor) => void;
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const now = currentTime;

  const getStatusBadge = () => {
    if (post.status === "published") {
      if (post.scheduledFor && post.scheduledFor > now) {
        return {
          className: "bg-blue-50 text-blue-700 border-blue-200",
          label: "Scheduled",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
      } else {
        return {
          className: "bg-green-50 text-green-700 border-green-200",
          label: "Published",
          icon: <BarChart3 className="h-3 w-3 mr-1" />,
        };
      }
    }

    return {
      className: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Draft",
      icon: <Edit className="h-3 w-3 mr-1" />,
    };
  };

  const getPostUrl = () => {
    if (post.status === "published" && post.author.username) {
      return `/${post.author.username}/${post._id}`;
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
        "bg-white border border-slate-200 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-200 group",
        featuredView && "border-2 border-indigo-100",
        className,
      )}
    >
      <CardContent className={cn("p-6", featuredView && "p-8")}>
        {/* Featured Image */}
        <Link
          href={publicUrl || "#"}
          className={cn(
            "block relative overflow-hidden rounded-xl mb-5 border border-slate-100",
            !publicUrl && "pointer-events-none",
            featuredView ? "h-64" : "h-48",
          )}
        >
          <Image
            src={featuredImage}
            alt={post.title}
            fill
            loading="eager"
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
            <div className="absolute inset-0 bg-slate-100 animate-pulse" />
          )}

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/5 transition-colors duration-300" />

          {/* Status badge on image */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className={cn(
                "backdrop-blur-md bg-white/90 shadow-sm",
                statusBadge.className,
              )}
            >
              {statusBadge.icon}
              {statusBadge.label}
            </Badge>
          </div>
        </Link>

        <div className="space-y-3">
          {/* Header with title and actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {isScheduled && (
                  <div className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.scheduledFor!).toLocaleDateString()}
                  </div>
                )}

                {/* Author */}
                {showAuthor && post.author && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                      {post.author.imageUrl ? (
                        <Image
                          src={post.author.imageUrl}
                          alt={post.author.name}
                          width={20}
                          height={20}
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                    <span className="font-medium text-slate-700">
                      {post.author.name}
                    </span>
                    {post.author.username && (
                      <span className="text-slate-400 text-xs">
                        @{post.author.username}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Post title */}
              <Link
                href={publicUrl || "#"}
                className={!publicUrl ? "pointer-events-none" : "block"}
              >
                <h3
                  className={cn(
                    "font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-tight",
                    featuredView ? "text-2xl" : "text-lg",
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
                    className="shrink-0 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 border-slate-200 shadow-md"
                >
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={() => onEdit(post)}
                      className="text-slate-600 focus:text-indigo-600 focus:bg-indigo-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                  )}
                  {publicUrl && (
                    <DropdownMenuItem
                      asChild
                      className="text-slate-600 focus:text-indigo-600 focus:bg-indigo-50"
                    >
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
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem
                        onClick={() => onDelete(post)}
                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
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
            <div
              className="text-slate-600 text-sm leading-relaxed line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              {post.tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 transition-colors font-medium text-[10px]"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 4 && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-500 border-slate-200 text-[10px]"
                >
                  +{post.tags.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Stats & Meta */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <div
                className="flex items-center gap-1.5 group/stat"
                title="Views"
              >
                <Eye className="h-3.5 w-3.5 group-hover/stat:text-indigo-600 transition-colors" />
                <span className="group-hover/stat:text-slate-700 transition-colors">
                  {post.viewCount?.toLocaleString() || 0}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 group/stat"
                title="Likes"
              >
                <Heart className="h-3.5 w-3.5 group-hover/stat:text-pink-600 transition-colors" />
                <span className="group-hover/stat:text-slate-700 transition-colors">
                  {post.likeCount?.toLocaleString() || 0}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 group/stat"
                title="Comments"
              >
                <MessageCircle className="h-3.5 w-3.5 group-hover/stat:text-indigo-600 transition-colors" />
                <span className="group-hover/stat:text-slate-700 transition-colors">
                  0
                </span>
              </div>
            </div>

            <time className="text-xs text-slate-400 flex items-center gap-1">
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

export default memo(PostCard);
