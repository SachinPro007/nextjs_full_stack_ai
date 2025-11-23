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
  Type,
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
  loading: () => (
    <div className="h-96 w-full bg-slate-50 animate-pulse rounded-xl border border-slate-100 flex items-center justify-center text-slate-400">
      Loading Editor...
    </div>
  ),
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
        ["clean"],
      ],
      handlers: { image: function () {} }, // Handled by custom logic
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
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-10">
          {/* Featured Image Section */}
          <div className="group relative">
            {watchValue.featuredImage ? (
              <div className="relative overflow-hidden rounded-4xl shadow-xl shadow-slate-200 border border-slate-200 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100">
                <Image
                  src={watchValue.featuredImage}
                  alt="Featured"
                  width={1200}
                  height={600}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Image Overlay Actions */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                  <Button
                    onClick={() => onImageUpload("featured")}
                    className="bg-white text-slate-900 hover:bg-slate-100 border-0 rounded-xl h-12 px-6 font-semibold shadow-lg transition-transform hover:-translate-y-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Cover
                  </Button>
                  <Button
                    onClick={() => setValue("featuredImage", "")}
                    className="bg-rose-500/20 hover:bg-rose-500/30 backdrop-blur text-rose-100 border border-rose-500/30 rounded-xl h-12 px-6 transition-transform hover:-translate-y-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>

                {/* Badge */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/20 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Cover Image
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onImageUpload("featured")}
                className="w-full h-[300px] rounded-4xl border-2 border-dashed border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50/30 transition-all duration-300 group flex flex-col items-center justify-center gap-4 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px] opacity-50" />

                <div className="relative z-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon className="h-8 w-8 text-indigo-500" />
                </div>
                <div className="relative z-10 text-center space-y-1">
                  <p className="text-slate-900 font-bold text-lg">
                    Add Cover Image
                  </p>
                  <p className="text-slate-500 text-sm">
                    Drag & drop or click to upload
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* Title Input */}
          <div className="relative group">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden xl:block">
              <Type className="w-6 h-6 text-slate-300" />
            </div>
            <Input
              {...register("title")}
              placeholder="Enter your title here..."
              className="border-0 bg-transparent px-0 text-4xl md:text-5xl font-extrabold text-slate-900 placeholder:text-slate-300 h-auto py-4 focus-visible:ring-0 focus-visible:ring-offset-0 leading-tight tracking-tight transition-colors"
            />
            {errors.title && (
              <div className="mt-2 flex items-center gap-2 text-rose-500 text-sm font-medium animate-in slide-in-from-top-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                {errors.title.message?.toString()}
              </div>
            )}
          </div>

          {/* AI Tools Section */}
          <div className="bg-white rounded-3xl p-2 border border-slate-200 shadow-sm">
            {!hasContent ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="shrink-0 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <Wand2 className="w-8 h-8 text-violet-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-slate-900 text-lg">
                    Magic Draft
                  </h3>
                  <p className="text-slate-500 text-sm max-w-md">
                    Stuck? Let our AI write a first draft based on your title.
                  </p>
                </div>
                <Button
                  onClick={() => handleAI("generate")}
                  disabled={!hasTitle || isGenerating || isImproving}
                  className="w-full md:w-auto bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-200 h-12 px-8 rounded-xl font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
                >
                  {isGenerating ? (
                    <>
                      <BarLoader
                        color="white"
                        width={20}
                        height={2}
                        className="mr-2"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" /> Generate with AI
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                  <Sparkles className="w-3 h-3" /> AI Assistant
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      type: "enhance",
                      icon: Sparkles,
                      label: "Enhance Content",
                      color: "emerald",
                      gradient: "from-emerald-500 to-teal-500",
                    },
                    {
                      type: "expand",
                      icon: Plus,
                      label: "Expand Text",
                      color: "blue",
                      gradient: "from-blue-500 to-cyan-500",
                    },
                    {
                      type: "simplify",
                      icon: Minus,
                      label: "Simplify",
                      color: "amber",
                      gradient: "from-amber-500 to-orange-500",
                    },
                  ].map((tool) => (
                    <Button
                      key={tool.type}
                      onClick={() => handleAI("improve", tool.type)}
                      disabled={isGenerating || isImproving}
                      variant="outline"
                      className={`group relative h-auto py-3 px-4 border-slate-200 hover:border-${tool.color}-200 hover:bg-${tool.color}-50/50 transition-all justify-start gap-3 rounded-xl`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-linear-to-br ${tool.gradient} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <tool.icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span
                          className={`block text-sm font-bold text-slate-700 group-hover:text-${tool.color}-700`}
                        >
                          {tool.label}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>

                {(isGenerating || isImproving) && (
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 animate-in fade-in">
                    <BarLoader color="#6366f1" width={100} />
                    <span className="text-xs font-bold text-indigo-600">
                      AI is working...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="relative">
            <div className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-p:text-slate-600 prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
              <QuillWrapper
                ref={setQuillRef}
                theme="snow"
                value={watchValue.content || ""}
                onChange={(content) => setValue("content", content)}
                formats={quillConfig.formats}
                modules={getQuillModules()}
                placeholder="Tell your story..."
              />
            </div>
            {errors.content && (
              <div className="mt-2 flex items-center gap-2 text-rose-500 text-sm font-medium animate-in slide-in-from-top-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                {errors.content.message?.toString()}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- QUILL LIGHT THEME OVERRIDES --- */}
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          padding: 12px !important;
          background: white !important;
          position: sticky !important;
          top: 85px !important;
          z-index: 30 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
          margin-bottom: 24px !important;
        }

        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit !important;
        }

        .ql-editor {
          min-height: 400px !important;
          padding: 0 !important;
          font-size: 1.125rem !important;
          line-height: 1.8 !important;
          color: #334155 !important; /* slate-700 */
        }

        .ql-editor.ql-blank::before {
          color: #cbd5e1 !important; /* slate-300 */
          font-style: normal !important;
          font-weight: 500 !important;
        }

        /* Headings */
        .ql-editor h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: #0f172a; /* slate-900 */
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .ql-editor h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b; /* slate-800 */
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }

        /* Quote Block */
        .ql-editor blockquote {
          border-left: 4px solid #6366f1 !important; /* indigo-500 */
          background: #f8fafc !important; /* slate-50 */
          color: #475569 !important; /* slate-600 */
          padding: 1rem 1.5rem !important;
          border-radius: 0 0.5rem 0.5rem 0 !important;
          font-style: italic !important;
        }

        /* Code Block */
        .ql-editor pre.ql-syntax {
          background: #1e293b !important; /* slate-800 */
          color: #e2e8f0 !important; /* slate-200 */
          border-radius: 0.75rem !important;
          padding: 1.5rem !important;
          font-family: "Fira Code", monospace !important;
        }

        /* Toolbar Icons */
        .ql-snow .ql-stroke {
          stroke: #64748b !important; /* slate-500 */
        }
        .ql-snow .ql-fill {
          fill: #64748b !important;
        }
        .ql-snow .ql-picker {
          color: #64748b !important;
        }

        /* Toolbar Hover States */
        .ql-snow .ql-picker-label:hover,
        .ql-snow .ql-picker-item:hover {
          color: #6366f1 !important; /* indigo-500 */
        }
        .ql-snow .ql-picker-label:hover .ql-stroke,
        .ql-snow button:hover .ql-stroke {
          stroke: #6366f1 !important;
        }
        .ql-snow button.ql-active .ql-stroke {
          stroke: #6366f1 !important;
        }
        .ql-snow button:hover .ql-fill,
        .ql-snow button.ql-active .ql-fill {
          fill: #6366f1 !important;
        }

        /* Active Button Background */
        .ql-toolbar button:hover,
        .ql-toolbar button.ql-active {
          background: #eef2ff !important; /* indigo-50 */
          border-radius: 6px !important;
        }
      `}</style>
    </>
  );
}

export default PostContentEditor;
