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
  ChevronDown,
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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 transition-all duration-200">
      {/* Optional: Top progress bar or decorative line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0" />

      <div className="max-w-5xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section: Navigation & Status */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 group pl-2 pr-3"
            >
              <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              {isDraft && (
                <Badge className="bg-amber-50 text-amber-600 border-amber-100 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  <Clock className="h-3 w-3 mr-1.5" />
                  Draft
                </Badge>
              )}

              {isEdit && (
                <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  Editing
                </Badge>
              )}
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3">
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsOpen}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
              title="Post Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Save Button (Create Mode Only) */}
            {!isEdit && (
              <Button
                onClick={onSave}
                disabled={isPublishing}
                variant="outline"
                size="sm"
                className="hidden sm:flex border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 gap-2 shadow-sm"
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Save Draft</span>
              </Button>
            )}

            {/* Main Action Button */}
            {isEdit ? (
              <Button
                disabled={isPublishing}
                onClick={() => {
                  onPublish();
                  setIsPublishMenuOpen(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 gap-2 px-6 font-bold hover:-translate-y-0.5"
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
                    className="group bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 gap-2 px-5 font-bold hover:-translate-y-0.5"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 fill-white/20" />
                        <span>Publish</span>
                        <ChevronDown className="h-4 w-4 ml-1 opacity-70 group-hover:translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-white border border-slate-100 rounded-2xl p-2 shadow-xl shadow-indigo-100/50 animate-in zoom-in-95 duration-200"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      onPublish();
                      setIsPublishMenuOpen(false);
                    }}
                    className="rounded-xl px-3 py-3 cursor-pointer focus:bg-indigo-50 focus:text-indigo-900 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                        <Send className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-700">
                          Publish Now
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-indigo-500/80">
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
                    className="rounded-xl px-3 py-3 cursor-pointer focus:bg-blue-50 focus:text-blue-900 transition-colors group mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-blue-700">
                          Schedule Post
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-blue-500/80">
                          Choose a future date
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
