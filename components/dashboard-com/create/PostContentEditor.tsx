"use client";

import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  Minus,
  Plus,
  Sparkles,
  Wand2,
  Upload,
  Trash2,
  Zap,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FieldErrors } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { generatBlogContent, improveContent } from "@/app/actions/gemini";
import ReactQuill from "react-quill-new";

const QuillWrapper = dynamic(() => import("@/components/other/QuillWrapper"), {
  ssr: false,
});

if (typeof window !== "undefined") {
  import("react-quill-new/dist/quill.snow.css"!);
}

const quillConfig = {
  modules: {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "blockquote", "code-block"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["image", "video"],
      ],
      handlers: { image: function () {} },
    },
  },
  formats: [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "link",
    "blockquote",
    "code-block",
    "list",
    "indent",
    "image",
    "video",
  ],
};

export interface PostFormData {
  content: string;
  title: string;
  tags: string[];
  category?: string;
  featuredImage?: string;
  scheduledFor?: string;
}

interface PostEditorFnArgs {
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
  setQuillRef: (ref: ReactQuill | null) => void;
  onImageUpload: (type: "featured" | "content") => void;
}

function PostContentEditor({
  form,
  onImageUpload,
  setQuillRef,
}: PostEditorFnArgs) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchValue = watch();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const getQuillModules = () => ({
    ...quillConfig.modules,
    toolbar: {
      ...quillConfig.modules.toolbar,
      handlers: { image: () => onImageUpload("content") },
    },
  });

  const hasTitle = watchValue.title?.trim();
  const hasContent = watchValue.content && watchValue.content !== "<p><br></p>";

  const handleAI = async (
    type: "generate" | "improve",
    improvementType?: string,
  ) => {
    const { title, content, tags, category } = watchValue;

    // validation
    if (type === "generate") {
      if (!title?.trim()) {
        return toast.error("Please add a Title before generating content");
      }
      setIsGenerating(true);
    } else {
      if (!content || content === "<p><br></p>") {
        return toast.error("Please add some content before improving it");
      }
      setIsImproving(true);
    }

    try {
      const result =
        type === "generate"
          ? await generatBlogContent(title, category, tags || [])
          : await improveContent(content, improvementType);

      if (result?.success) {
        setValue("content", result?.content);
        toast.success(
          `Content ${type === "generate" ? "generated" : improvementType + "d"} successfully!`,
        );
      } else {
        toast.error(result?.error);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to ${type} content. Please try again.`);
    } finally {
      if (type === "generate") {
        setIsGenerating(false);
      } else {
        setIsImproving(false);
      }
    }
  };

  return (
    <>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Featured Image Section */}
          {watchValue.featuredImage ? (
            <div className="relative group overflow-hidden rounded-3xl">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10" />

              <Image
                src={watchValue.featuredImage}
                alt="Featured"
                width={1200}
                height={600}
                className="w-full h-96 object-cover"
              />

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex items-center justify-center gap-4">
                <Button
                  onClick={() => onImageUpload("featured")}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-2xl px-6 py-3 transition-all duration-200"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Image
                </Button>
                <Button
                  onClick={() => setValue("featuredImage", "")}
                  className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md border border-red-500/30 text-red-400 rounded-2xl px-6 py-3 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>

              {/* Image Badge */}
              <div className="absolute top-6 right-6 z-20">
                <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                  <span className="text-white text-sm font-medium">
                    Featured Image
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onImageUpload("featured")}
              className="relative w-full h-72 rounded-3xl border-2 border-dashed border-white/10 bg-linear-to-br from-white/5 to-transparent hover:border-white/20 hover:from-white/10 transition-all duration-300 group overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative w-20 h-20 bg-linear-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-white" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-white text-xl font-semibold">
                    Add a stunning cover image
                  </p>
                  <p className="text-gray-400 text-sm max-w-md">
                    Upload and transform with AI-powered tools • Supports JPG,
                    PNG, WebP
                  </p>
                </div>

                <div className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <Upload className="h-4 w-4 text-gray-300" />
                  <span className="text-gray-300 text-sm font-medium">
                    Click to upload
                  </span>
                </div>
              </div>
            </button>
          )}

          {/* Title Input */}
          <div className="space-y-3">
            <Input
              {...register("title")}
              placeholder="Untitled Post"
              className="border-0 text-5xl font-bold bg-transparent placeholder:text-gray-700 text-white p-4 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{ fontSize: "3rem", lineHeight: "1.1" }}
            />
            {errors.title && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                <span>⚠️</span>
                <p>{errors.title.message?.toString()}</p>
              </div>
            )}
          </div>

          {/* AI Tools Section */}
          <div className="bg-linear-to-br from-white/5 to-white/2 rounded-3xl p-6 border border-white/10 backdrop-blur-sm">
            {!hasContent ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      AI Content Generator
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Let AI create your first draft based on your title
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleAI("generate")}
                  disabled={!hasTitle || isGenerating || isImproving}
                  className="w-full bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-2xl py-6 text-base font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 className="h-5 w-5 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Content with AI"}
                </Button>

                {!hasTitle && (
                  <p className="text-center text-xs text-gray-500">
                    💡 Add a title above to unlock AI content generation
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      AI Content Improver
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Enhance, expand, or simplify your content instantly
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      type: "enhance",
                      icon: Sparkles,
                      gradient: "from-emerald-500 to-teal-500",
                      bg: "bg-emerald-500/10",
                      border: "border-emerald-500/30",
                      text: "text-emerald-400",
                      label: "Enhance",
                      desc: "Improve quality",
                    },
                    {
                      type: "expand",
                      icon: Plus,
                      gradient: "from-blue-500 to-cyan-500",
                      bg: "bg-blue-500/10",
                      border: "border-blue-500/30",
                      text: "text-blue-400",
                      label: "Expand",
                      desc: "Add more detail",
                    },
                    {
                      type: "simplify",
                      icon: Minus,
                      gradient: "from-orange-500 to-amber-500",
                      bg: "bg-orange-500/10",
                      border: "border-orange-500/30",
                      text: "text-orange-400",
                      label: "Simplify",
                      desc: "Make concise",
                    },
                  ].map(
                    ({
                      type,
                      icon: Icon,
                      gradient,
                      bg,
                      border,
                      text,
                      label,
                      desc,
                    }) => (
                      <Button
                        key={type}
                        onClick={() => handleAI("improve", type)}
                        disabled={isGenerating || isImproving}
                        className={`group relative overflow-hidden ${bg} hover:${bg} ${border} border rounded-2xl py-6 transition-all duration-200 disabled:opacity-50`}
                      >
                        <div className="flex justify-center items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-center">
                            <p className={`${text} font-semibold text-sm`}>
                              {label}
                            </p>
                            <p className="text-gray-500 text-xs">{desc}</p>
                          </div>
                        </div>
                      </Button>
                    ),
                  )}
                </div>
              </div>
            )}

            {(isGenerating || isImproving) && (
              <div className="mt-4 space-y-2">
                <BarLoader width={"100%"} color="#A78BFA" height={3} />
                <p className="text-center text-sm text-gray-400">
                  {isGenerating
                    ? "✨ Generating amazing content..."
                    : "🔮 Improving your content..."}
                </p>
              </div>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="bg-linear-to-br from-white/5 to-white/2 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="prose prose-lg max-w-none">
              <QuillWrapper
                ref={setQuillRef}
                theme="snow"
                value={watchValue.content || ""}
                onChange={(content) => setValue("content", content)}
                formats={quillConfig.formats}
                modules={getQuillModules()}
                placeholder="Start writing your story... ✨"
                style={{
                  minHeight: "500px",
                  fontSize: "1.125rem",
                  lineHeight: "1.8",
                }}
              />

              {errors.content && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mt-4">
                  <span>⚠️</span>
                  <p>{errors.content.message?.toString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .ql-editor {
          color: white !important;
          font-size: 1.125rem !important;
          line-height: 1.8 !important;
          padding: 0 !important;
          min-height: 500px !important;
          overflow-y: visible !important;
        }
        .ql-editor::before {
          color: rgb(75, 85, 99) !important;
          font-style: normal !important;
        }
        .ql-toolbar {
          border: none !important;
          padding: 1rem !important;
          position: sticky !important;
          top: 85px !important;
          background: rgba(0, 0, 0, 0.8) !important;
          backdrop-filter: blur(20px) !important;
          z-index: 30 !important;
          border-radius: 1rem !important;
          margin-bottom: 2rem !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .ql-container {
          border: none !important;
        }
        .ql-snow .ql-tooltip {
          background: rgb(24, 24, 27) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 0.75rem !important;
          padding: 0.75rem !important;
        }
        .ql-snow .ql-picker {
          color: white !important;
        }
        .ql-snow .ql-picker-options {
          background: rgb(24, 24, 27) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
          padding: 0.5rem !important;
        }
        .ql-snow .ql-fill,
        .ql-snow .ql-stroke.ql-fill {
          fill: white !important;
        }
        .ql-snow .ql-stroke {
          stroke: white !important;
        }
        .ql-snow .ql-picker-label:hover,
        .ql-snow .ql-picker-item:hover {
          color: rgb(168, 85, 247) !important;
        }
        .ql-editor h1 {
          font-size: 2.5rem !important;
          font-weight: 700 !important;
          color: white !important;
          margin: 1.5rem 0 !important;
        }
        .ql-editor h2 {
          font-size: 2rem !important;
          font-weight: 600 !important;
          color: white !important;
          margin: 1.25rem 0 !important;
        }
        .ql-editor h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          color: white !important;
          margin: 1rem 0 !important;
        }
        .ql-editor blockquote {
          border-left: 4px solid rgb(168, 85, 247) !important;
          background: rgba(168, 85, 247, 0.1) !important;
          color: rgb(226, 232, 240) !important;
          padding: 1rem 1.5rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
          border-radius: 0.5rem !important;
        }
        .ql-editor a {
          color: rgb(168, 85, 247) !important;
          text-decoration: underline !important;
        }
        .ql-editor code {
          background: rgba(255, 255, 255, 0.1) !important;
          color: rgb(251, 146, 60) !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 0.375rem !important;
          font-family: "Fira Code", monospace !important;
        }
        .ql-editor pre {
          background: rgba(0, 0, 0, 0.5) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
          padding: 1rem !important;
          margin: 1rem 0 !important;
        }
        .ql-editor img {
          border-radius: 1rem !important;
          margin: 1.5rem 0 !important;
        }
        .ql-toolbar button {
          border-radius: 0.5rem !important;
          transition: all 0.2s !important;
        }
        .ql-toolbar button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .ql-toolbar button.ql-active {
          background: rgba(168, 85, 247, 0.2) !important;
          color: rgb(168, 85, 247) !important;
        }
      `}</style>
    </>
  );
}

export default PostContentEditor;
