"use client";

import { upload, UploadResponse } from "@imagekit/next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod/v3";
import { useDropzone } from "react-dropzone";
import {
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  UploadIcon,
  Wand2,
  Image as LucideImage,
} from "lucide-react";
import { toast } from "sonner";
import { authenticator } from "@/lib/imagekit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageDataObj } from "./PostEditor";
import ImageTransform from "./ImageTransform";

// types
interface ImageUploadFnArgs {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (obj: ImageDataObj) => void;
  title: string;
}

// Form validation schema
const transformationSchema = z.object({
  aspectRatio: z.string().default("original"),
  customWidth: z.number().min(100).max(2000).default(800),
  customHeight: z.number().min(100).max(2000).default(600),
  smartCropFocus: z.string().default("auto"),
  backgroundRemoved: z.boolean().default(false),
  dropShadow: z.boolean().default(false),
});

function ImageUploadPopUp({
  isOpen,
  onClose,
  onImageSelect,
  title = "Upload & Transform Image",
}: ImageUploadFnArgs) {
  const [uploadedImage, setUploadedImage] = useState<
    UploadResponse | undefined
  >();
  const [transformedImage, setTransformedImage] = useState<
    string | undefined
  >();
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"transform" | "upload">("upload");

  const { control, reset, setValue } = useForm({
    resolver: zodResolver(transformationSchema),
    defaultValues: {
      aspectRatio: "original",
      customWidth: 800,
      customHeight: 600,
      smartCropFocus: "auto",
      backgroundRemoved: false,
      dropShadow: false,
    },
  });

  const watchValue = useWatch({ control });

  const handleSelectImage = () => {
    if (transformedImage) {
      onImageSelect({
        url: transformedImage,
        originalUrl: uploadedImage?.url,
        fileId: uploadedImage?.fileId,
        name: uploadedImage?.name,
        width: uploadedImage?.width,
        height: uploadedImage?.height,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setUploadedImage(undefined);
    setTransformedImage(undefined);
    setActiveTab("upload");
    reset();
  };

  // image drag and drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFile) => {
      const file = acceptedFile[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        return toast.error("Please select an image file");
      }

      if (file.size > 10 * 1024 * 1024) {
        return toast.error("File size must be less then 10MB");
      }

      setIsUploading(true);

      try {
        const { signature, expire, token, publicKey } = await authenticator();
        const uploadResponse = await upload({
          expire,
          token,
          signature,
          publicKey,
          file,
          fileName: file.name,
        });

        if (uploadResponse) {
          setUploadedImage(uploadResponse);
          setTransformedImage(uploadResponse.url);
          setActiveTab("transform");
          toast.success("Image upload successfully!");
        }
      } catch (error) {
        if (error instanceof Error) {
          return toast.error(error.message);
        }
        toast.error("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* --- HEADER --- */}
        <div className="shrink-0 p-6 bg-white border-b border-slate-100 z-10 relative">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {title}
                  {uploadedImage && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-600 border-emerald-200 font-medium"
                    >
                      Uploaded
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-slate-500 mt-1">
                  Upload assets and enhance them with AI transformations.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* --- TABS CONTAINER --- */}
        <Tabs
          value={activeTab}
          onValueChange={(val: string) =>
            setActiveTab(val as "transform" | "upload")
          }
          className="flex-1 flex flex-col min-h-0"
        >
          {/* Tabs List */}
          <div className="shrink-0 px-6 py-3 bg-slate-50/50 border-b border-slate-100">
            <TabsList className="bg-white p-1 border border-slate-200 rounded-xl h-auto inline-flex w-full sm:w-auto">
              <TabsTrigger
                value="upload"
                className="flex-1 sm:flex-none rounded-lg px-6 py-2 text-sm font-semibold data-[state=active]:bg-indigo-50! data-[state=active]:text-indigo-700! transition-all gap-2"
              >
                <UploadIcon className="w-4 h-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="transform"
                disabled={!uploadedImage}
                className="flex-1 sm:flex-none rounded-lg px-6 py-2 text-sm font-semibold data-[state=active]:bg-indigo-50! data-[state=active]:text-indigo-700! transition-all gap-2"
              >
                <Wand2 className="w-4 h-4" />
                Transform
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50/30 p-6 relative">
            {/* UPLOAD TAB */}
            <TabsContent
              value="upload"
              className="h-full mt-0 outline-none animate-in fade-in slide-in-from-bottom-2"
            >
              <div
                {...getRootProps()}
                className={`h-full w-full border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group relative overflow-hidden bg-white ${
                  isDragActive
                    ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
                    : "border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50"
                }`}
              >
                <input {...getInputProps()} />

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[20px_20px] opacity-50 pointer-events-none" />

                {isUploading ? (
                  <div className="text-center space-y-6 relative z-10">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Uploading Asset...
                      </h3>
                      <p className="text-slate-500">
                        Optimizing for web performance
                      </p>
                    </div>
                  </div>
                ) : uploadedImage ? (
                  // Success State
                  <div className="text-center space-y-6 relative z-10 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
                      <Check className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        Upload Complete!
                      </h3>
                      <p className="text-slate-500 mb-6 font-mono text-sm bg-slate-100 px-3 py-1 rounded-md inline-block">
                        {uploadedImage.name}
                      </p>
                      <br />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab("transform");
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 px-8 h-12 font-bold"
                      >
                        Continue to Transform{" "}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">
                      Drag & drop a new file to replace
                    </p>
                  </div>
                ) : (
                  // Idle State
                  <div className="text-center space-y-6 relative z-10 px-4">
                    <div className="w-24 h-24 bg-indigo-50 rounded-4xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner ring-4 ring-white">
                      <LucideImage className="w-10 h-10 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {isDragActive ? "Drop to Upload" : "Upload Media"}
                      </h3>
                      <p className="text-slate-500 max-w-xs mx-auto">
                        Drag & drop your image here, or click to browse.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <Badge
                        variant="secondary"
                        className="bg-white border-slate-200 text-slate-500 font-normal py-1.5 px-3"
                      >
                        JPG, PNG, WEBP
                      </Badge>
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <Badge
                        variant="secondary"
                        className="bg-white border-slate-200 text-slate-500 font-normal py-1.5 px-3"
                      >
                        Max 10MB
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TRANSFORM TAB */}
            <TabsContent
              value="transform"
              className="h-full mt-0 outline-none animate-in fade-in slide-in-from-right-4"
            >
              <ImageTransform
                form={{ reset, setValue, watchValue }}
                handleClose={handleClose}
                handleSelectImage={handleSelectImage}
                setTransformedImage={setTransformedImage}
                transformedImage={transformedImage}
                uploadedImage={uploadedImage}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ImageUploadPopUp;
