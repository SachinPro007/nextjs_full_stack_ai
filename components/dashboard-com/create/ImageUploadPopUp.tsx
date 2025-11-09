"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
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
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

// types
interface ImageUploadFnArgs {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: () => void;
  title: string;
}

// Form validation schema
const transformationSchema = z.object({
  aspectRatio: z.string().default("original"),
  customWidth: z.number().min(100).max(2000).default(800),
  customHeight: z.number().min(100).max(2000).default(600),
  smartCropFocus: z.string().default("auto"),
  textOverlay: z.string().optional(),
  textFontSize: z.number().min(12).max(200).default(50),
  textColor: z.string().default("#ffffff"),
  textPosition: z.string().default("center"),
  backgroundRemoved: z.boolean().default(false),
  dropShadow: z.boolean().default(false),
});

function ImageUploadPopUp({
  isOpen,
  onClose,
  onImageSelect,
  title = "Upload & Transform Image",
}: ImageUploadFnArgs) {
  const [uploadedImage, setUploadedImage] = useState<string | null | undefined>(
    null,
  );
  const [transformedImage, setTransformedImage] = useState<null | string>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [activeTab, setActiveTab] = useState<"transform" | "upload">("upload");

  const { control, setValue, reset } = useForm({
    resolver: zodResolver(transformationSchema),
    defaultValues: {
      aspectRatio: "original",
      customWidth: 800,
      customHeight: 600,
      smartCropFocus: "auto",
      textOverlay: "",
      textFontSize: 50,
      textColor: "#ffffff",
      textPosition: "center",
      backgroundRemoved: false,
      dropShadow: false,
    },
  });

  const watchValue = useWatch({ control });

  const authenticator = async () => {
    const response = await fetch("/api/imagekit/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
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
          console.log(uploadResponse);

          setUploadedImage(uploadResponse.url);
          setIsUploading(false);
        }
      } catch (error) {
        if (error instanceof ImageKitAbortError) {
          console.error("Upload aborted:", error.reason);
        } else if (error instanceof ImageKitInvalidRequestError) {
          console.error("Invalid request:", error.message);
        } else if (error instanceof ImageKitUploadNetworkError) {
          console.error("Network error:", error.message);
        } else if (error instanceof ImageKitServerError) {
          console.error("Server error:", error.message);
        } else {
          // Handle any other errors that may occur.
          console.error("Upload error:", error);
        }
      }
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
  });

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl! h-[90vh]! overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Upload an image and apply AI-powered trandformations
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="transform" disabled={!uploadedImage}>
                Transform
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              {uploadedImage ? (
                <>
                  <Image
                    src={uploadedImage}
                    alt="Sachin"
                    width={500}
                    height={500}
                  />
                </>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-purple-400 bg-purple-400/10"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <input {...getInputProps()} />

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
              )}
            </TabsContent>
            <TabsContent value="transform" className="space-y-6"></TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ImageUploadPopUp;
