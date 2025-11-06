import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/convex/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  Save,
  Send,
  Settings,
  Clock,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FnProps {
  mode: string;
  initialData: Post | undefined;
  isPublishing: boolean;
  onSave: () => void;
  onPublish: () => void;
  onSchedule: () => void;
  onSettingsOpen: () => void;
}

function PostEditorHeader({
  mode,
  initialData,
  isPublishing,
  onSave,
  onPublish,
  onSchedule,
  onSettingsOpen,
}: FnProps) {
  const [isPublishMenuOpen, setIsPublishMenuOpen] = useState(false);
  const router = useRouter();

  const isDraft = initialData?.status === "draft";
  const isEdit = mode === "edit";

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5">
      {/* Gradient glow effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>

            {/* Status Badges */}
            <div className="flex items-center gap-2">
              {isDraft && (
                <Badge className="bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold shadow-lg shadow-amber-500/10">
                  <Clock className="h-3 w-3 mr-1.5" />
                  Draft
                </Badge>
              )}

              {isEdit && (
                <Badge className="bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                  Editing
                </Badge>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsOpen}
              className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group relative"
            >
              <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            </Button>

            {/* Save Button (Only in create mode) */}
            {!isEdit && (
              <Button
                onClick={onSave}
                disabled={isPublishing}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 gap-2"
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Save Draft</span>
              </Button>
            )}

            {/* Publish/Update Button */}
            {isEdit ? (
              <Button
                disabled={isPublishing}
                onClick={() => {
                  onPublish();
                  setIsPublishMenuOpen(false);
                }}
                className="relative bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 gap-2 px-5"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Update Post</span>
                  </>
                )}
              </Button>
            ) : (
              <DropdownMenu
                open={isPublishMenuOpen}
                onOpenChange={setIsPublishMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={isPublishing}
                    className="relative bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-200 gap-2 px-6"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Publish</span>
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      onPublish();
                      setIsPublishMenuOpen(false);
                    }}
                    className="rounded-xl px-3 py-3 text-white hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Send className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">Publish Now</span>
                        <span className="text-xs text-gray-400">
                          Make it live immediately
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      onSchedule();
                      setIsPublishMenuOpen(false);
                    }}
                    className="rounded-xl px-3 py-3 text-white hover:bg-white/5 cursor-pointer transition-colors group mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          Schedule Post
                        </span>
                        <span className="text-xs text-gray-400">
                          Choose publish date & time
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default PostEditorHeader;
