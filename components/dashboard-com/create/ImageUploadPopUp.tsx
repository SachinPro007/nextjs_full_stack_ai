"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  UploadResponse,
} from "@imagekit/next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { TabsContent } from "@radix-ui/react-tabs";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod/v3";
import { useDropzone } from "react-dropzone";
import {
  ArrowRight,
  Check,
  FileCheck,
  ImageIcon,
  Loader2,
  Sparkles,
  UploadIcon,
  Wand2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
// import Image from "next/image";
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

//////////
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

  // image drag and drop by React dropzone packeg
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFile) => {
      const file = acceptedFile[0];

      // file validation
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
          // Authentication parameters
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
        if (error instanceof ImageKitAbortError) {
          toast.error(`Upload aborted: , ${error.reason}`);
        } else if (error instanceof ImageKitInvalidRequestError) {
          toast.error(`Invalid request:, ${error.message}`);
        } else if (error instanceof ImageKitUploadNetworkError) {
          toast.error(`Network error:, ${error.message}`);
        } else if (error instanceof ImageKitServerError) {
          toast.error(`Server error:, ${error.message}`);
        } else {
          // Handle any other errors that may occur.
          toast.error(`Upload error:, ${error}`);
        }
      } finally {
        setIsUploading(false);
      }
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
  });

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl! h-[90vh]! overflow-y-auto">
          {/* Header */}
          <DialogHeader className="relative p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-12 h-12 bg-linear-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white mb-1">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm">
                  Upload and apply AI-powered transformations
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={() =>
              setActiveTab(activeTab === "transform" ? "upload" : "transform")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="transform" disabled={!uploadedImage}>
                Transform
              </TabsTrigger>
            </TabsList>

            {/* image upload tab */}
            <TabsContent value="upload" className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-purple-400 bg-purple-400/10"
                    : "border-slate-600 hover:border-slate-500"
                }`}
              >
                <input {...getInputProps()} />

                {/* image drop card or loader */}
                {isUploading ? (
                  <div className="text-center space-y-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-cyan-500 rounded-full blur-3xl opacity-50 animate-pulse" />
                      <Loader2 className="relative w-14 h-14 text-purple-400 animate-spin mx-auto" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white mb-2">
                        Uploading...
                      </p>
                      <p className="text-sm text-gray-400">
                        Processing your file
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-7">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-cyan-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
                      <div className="relative w-24 h-24 bg-linear-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <UploadIcon className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-white mb-2">
                          {isDragActive ? "Drop it here!" : "Upload Your Image"}
                        </p>
                        <p className="text-gray-400 text-base">
                          Drag and drop or click to browse
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-300 font-medium">
                          Click to select
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 pt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ImageIcon className="w-4 h-4" />
                        <span>JPG, PNG, WebP</span>
                      </div>
                      <div className="w-px h-4 bg-white/10" />
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileCheck className="w-4 h-4" />
                        <span>Max 10MB</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Success State */}
              {uploadedImage && (
                <div className="bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-5 border border-emerald-500/20 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold text-base">
                          Upload Successful!
                        </h4>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                          Ready
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                        <span className="truncate max-w-[200px]">
                          {uploadedImage.name}
                        </span>
                        <span>•</span>
                        <span>
                          {uploadedImage.width} × {uploadedImage.height}
                        </span>
                        <span>•</span>
                        <span>{Math.round(uploadedImage.size! / 1024)}KB</span>
                      </div>
                      <Button
                        onClick={() => setActiveTab("transform")}
                        className="bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Transform Image
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* image transform tab */}
            <TabsContent value="transform" className="space-y-6">
              <ImageTransform
                form={{ reset, setValue, watchValue }}
                handleClose={handleClose}
                handleSelectImage={handleSelectImage}
                setTransformedImage={setTransformedImage}
                transformedImage={transformedImage}
                uploadedImage={uploadedImage}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ImageUploadPopUp;
