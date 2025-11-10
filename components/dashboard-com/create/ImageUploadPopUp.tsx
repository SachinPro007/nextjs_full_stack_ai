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
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod/v3";
import { useDropzone } from "react-dropzone";
import { Check, Loader2, Upload, Wand2 } from "lucide-react";
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

  useEffect(() => {
    console.log("watchValues", watchValue);
  }, [watchValue]);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl! h-[90vh]! overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Upload an image and apply AI-powered trandformations
            </DialogDescription>
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
                  <div className="space-y-4">
                    <Loader2 className="h-12 w-12 mx-auto animate-spin text-purple-400" />
                    <p className="text-slate-300">Uploading image...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-slate-400" />
                    <div>
                      <p className="text-lg text-white">
                        {isDragActive
                          ? "Drop the image here"
                          : "Drag & drop an image here"}
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        or click to select a file (JPG, PNG, WebP, GIF - Max
                        10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* image uploaded */}
              {uploadedImage && (
                <div className="text-center space-y-4">
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-300 border-green-500/30"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Image uploaded successfully!
                  </Badge>
                  <div className="text-sm text-slate-400">
                    {uploadedImage.width} × {uploadedImage.height} •{" "}
                    {Math.round(uploadedImage.size! / 1024)}KB
                  </div>
                  <Button
                    onClick={() => setActiveTab("transform")}
                    className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Start Transforming
                  </Button>
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
