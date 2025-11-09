import React, { useState } from "react";
import { PostFormData } from "./PostContentEditor";
import { FieldErrors } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  "Technology",
  "Design",
  "Marketing",
  "Business",
  "Lifestyle",
  "Education",
  "Health",
  "Travel",
  "Food",
  "Entertainment",
];

// types
interface EditorSettingsFnArgs {
  isOpen: boolean;
  onClose: () => void;
  form: {
    register: (name: keyof PostFormData, options?: object) => object;
    watch: () => PostFormData;
    setValue: (
      name: keyof PostFormData,
      value: PostFormData[keyof PostFormData],
      options?: object,
    ) => void;
    formState: { errors: FieldErrors };
  };
  mode: string;
}

// component
function PostEditorSettings({
  isOpen,
  onClose,
  form,
  mode,
}: EditorSettingsFnArgs) {
  const [tagInput, setTagInput] = useState("");
  const { setValue, watch } = form;

  const watchValues = watch();

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (
      tag &&
      !watchValues.tags.includes(tag) &&
      watchValues.tags.length < 10
    ) {
      setValue("tags", [...watchValues.tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchValues.tags.filter((item) => item !== tagToRemove),
    );
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Post Settings</DialogTitle>
            <DialogDescription>Configure your post details</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* category */}
            <div className="space-y-2">
              <Select
                value={watchValues.category}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label className="text-white text-sm font-medium">Tags</Label>

              <div className="flex space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder="Add Tags..."
                  className="bg-slate-800 border-slate-600"
                />

                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  size="sm"
                  className="border-slate-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {watchValues.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchValues.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="default"
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-400">
                {watchValues.tags.length}/10 tags • Press Enter or comma to add
              </p>
            </div>

            {/* Scheduling */}
            {mode === "create" && (
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">
                  Schedule Publication
                </label>
                <Input
                  value={watchValues.scheduledFor}
                  onChange={(e) => setValue("scheduledFor", e.target.value)}
                  type="datetime-local"
                  className="bg-slate-800 border-slate-600"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-slate-400">
                  Leave empty to publish immediately
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PostEditorSettings;
