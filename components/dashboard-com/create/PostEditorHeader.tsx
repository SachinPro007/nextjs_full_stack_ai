import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/convex/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  Save,
  Send,
  Settings,
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
    <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* letf */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {isDraft && (
            <Badge
              variant="secondary"
              className="bg-orange-500/20 text-orange-300 border-orange-500/30"
            >
              Draft
            </Badge>
          )}
        </div>

        {/* right */}
        <div className="flex items-center space-x-3">
          {/* setting button */}
          <Button
            variant="ghost"
            size="sm"
            // onClick={onSettingsOpen}
            className="text-slate-400 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {!isEdit && (
            <Button
              // onClick={onSave}
              // disabled={isPublishing}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              {isPublishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          )}

          {isEdit ? (
            <Button
              variant={"default"}
              disabled={isPublishing}
              onClick={() => {
                onPublish();
                setIsPublishMenuOpen(false);
              }}
            >
              {isPublishing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Update
            </Button>
          ) : (
            <DropdownMenu
              open={isPublishMenuOpen}
              onOpenChange={setIsPublishMenuOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant={"default"} disabled={isPublishing}>
                  {isPublishing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Publish
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    onPublish();
                    setIsPublishMenuOpen(false);
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish now
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    onSchedule();
                    setIsPublishMenuOpen(false);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule for later
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

export default PostEditorHeader;
