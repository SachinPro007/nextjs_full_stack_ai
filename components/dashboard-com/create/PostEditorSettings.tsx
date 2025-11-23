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
import { Plus, X, Calendar, Hash, Grid } from "lucide-react";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-0 overflow-hidden border border-slate-100 shadow-2xl shadow-indigo-100/50">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Grid className="w-5 h-5 text-indigo-600" />
              Post Configuration
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Organize your content to help readers find it.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-8">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-slate-700 text-sm font-bold flex items-center gap-2">
              Category
            </Label>
            <Select
              value={watchValues.category}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger className="bg-white border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-indigo-200 focus:ring-2 focus:ring-indigo-100 h-11 rounded-xl transition-all">
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl bg-white">
                {CATEGORIES.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-slate-700 focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer rounded-lg my-1"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-slate-700 text-sm font-bold flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-500" />
                Tags
              </Label>
              <span className="text-xs text-slate-400 font-medium">
                {watchValues.tags.length}/10
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                placeholder="e.g., react, coding"
                className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 h-10 rounded-xl text-sm"
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim() || watchValues.tags.length >= 10}
                size="icon"
                className="h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-md shadow-indigo-200"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tags List */}
            <div className="flex flex-wrap gap-2 min-h-10">
              {watchValues.tags.length > 0 ? (
                watchValues.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors group"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 text-indigo-400 group-hover:text-rose-500 transition-colors outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic w-full text-center py-2 border-2 border-dashed border-slate-100 rounded-xl">
                  No tags added yet.
                </p>
              )}
            </div>

            <p className="text-[10px] text-slate-400 ml-1">
              Press{" "}
              <kbd className="font-sans bg-slate-100 px-1 rounded border border-slate-200 text-slate-500">
                Enter
              </kbd>{" "}
              or comma to add
            </p>
          </div>

          {/* Scheduling (Only create mode) */}
          {mode === "create" && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <Label className="text-slate-700 text-sm font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Schedule Publication
              </Label>
              <div className="relative">
                <Input
                  value={watchValues.scheduledFor}
                  onChange={(e) => setValue("scheduledFor", e.target.value)}
                  type="datetime-local"
                  className="bg-white text-slate-900 border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 h-11 rounded-xl scheme-light"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <p className="text-xs text-slate-400">
                Leave empty to publish immediately.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PostEditorSettings;
