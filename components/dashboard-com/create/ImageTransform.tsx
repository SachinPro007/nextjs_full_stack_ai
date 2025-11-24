"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UploadResponse } from "@imagekit/next";
import { Label } from "@/components/ui/label";
import {
  Check,
  Crop,
  ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
  Scissors,
  Maximize2,
  Eye,
  Zap,
  Wand2,
  ScanLine,
  Monitor,
  Smartphone,
  Image as LucideImage,
  Focus,
  ArrowUp,
  ArrowDown,
  Square,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

// Updated Icons to Lucide (Logic/Values remain identical)
const ASPECT_RATIOS = [
  {
    label: "Original",
    value: "original",
    icon: LucideImage,
    desc: "Keep original size",
  },
  {
    label: "Square 1:1",
    value: "1:1",
    width: 400,
    height: 400,
    icon: Square,
    desc: "Perfect square",
  },
  {
    label: "Landscape 16:9",
    value: "16:9",
    width: 800,
    height: 450,
    icon: Monitor,
    desc: "Widescreen",
  },
  {
    label: "Portrait 4:5",
    value: "4:5",
    width: 400,
    height: 500,
    icon: ScanLine,
    desc: "Mobile friendly",
  },
  {
    label: "Story 9:16",
    value: "9:16",
    width: 450,
    height: 800,
    icon: Smartphone,
    desc: "Instagram story",
  },
  { label: "Custom", value: "custom", icon: Crop, desc: "Set your own" },
];

const SMART_CROP_OPTIONS = [
  {
    label: "Auto Detect",
    value: "auto",
    desc: "AI-powered focus",
    icon: Wand2,
  },
  { label: "Face Focus", value: "face", desc: "Detect faces", icon: Eye },
  { label: "Center", value: "center", desc: "Center of image", icon: Focus },
  { label: "Top", value: "top", desc: "Top portion", icon: ArrowUp },
  { label: "Bottom", value: "bottom", desc: "Bottom portion", icon: ArrowDown },
];

// types
interface ImageTransformData {
  backgroundRemoved?: boolean | undefined;
  dropShadow?: boolean | undefined;
  aspectRatio?: string | undefined;
  smartCropFocus?: string | undefined;
  customWidth?: number | undefined;
  customHeight?: number | undefined;
}

interface ImageTransformFnArg {
  form: {
    watchValue: ImageTransformData;
    setValue: (
      name: keyof ImageTransformData,
      value: ImageTransformData[keyof ImageTransformData],
      options?: object,
    ) => void;
    reset: () => void;
  };
  setTransformedImage: (url: string | undefined) => void;
  transformedImage: string | undefined;
  uploadedImage: UploadResponse | undefined;
  handleClose: () => void;
  handleSelectImage: () => void;
}

function ImageTransform({
  form,
  uploadedImage,
  setTransformedImage,
  transformedImage,
  handleSelectImage,
  handleClose,
}: ImageTransformFnArg) {
  const [isTransforming, setIsTransforming] = useState(false);
  const { setValue, watchValue, reset } = form;

  const applyTransformations = async () => {
    if (!uploadedImage) return;

    setIsTransforming(true);

    try {
      let transformationString = "";

      if (watchValue.aspectRatio !== "original") {
        let width: number | undefined, height: number | undefined;

        if (watchValue.aspectRatio !== "custom") {
          const ratio = ASPECT_RATIOS.find(
            (r) => r.value === watchValue.aspectRatio,
          );
          width = ratio?.width || 800;
          height = ratio?.height || 600;
        } else {
          width = watchValue.customWidth;
          height = watchValue.customHeight;
        }

        transformationString += `w-${width},h-${height}`;
      }

      if (
        watchValue.aspectRatio !== "original" &&
        watchValue.smartCropFocus !== "auto"
      ) {
        if (transformationString.length > 0) transformationString += ",";
        transformationString += `fo-${watchValue.smartCropFocus}`;
      }

      if (watchValue.backgroundRemoved) {
        if (transformationString.length > 0) transformationString += ",";
        transformationString += `e-remove-bg`;

        if (watchValue.dropShadow) {
          transformationString += `:e-dropshadow`;
        }
      }

      let finalUrl = uploadedImage.url;
      if (transformationString.length > 0) {
        finalUrl += `/tr:${transformationString}`;
      }

      setTransformedImage(finalUrl);
      await new Promise((resolver) => setTimeout(resolver, 1500));
      toast.success("Image transformed successfully!");

      return finalUrl;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setIsTransforming(false);
    }
  };

  const resetTransformations = () => {
    setTransformedImage(uploadedImage?.url);
    reset();
    toast.success("Transformations reset");
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-20">
      {/* Panel - Controls */}
      <div className="space-y-6 max-h-[65vh] lg:max-h-[60vh]">
        {/* AI Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base lg:text-lg font-bold text-slate-900">
                AI Tools
              </h3>
              <p className="text-xs text-slate-500 truncate">
                Powered by advanced AI
              </p>
            </div>
          </div>

          {/* Background Removal Card */}
          <div className="group relative rounded-2xl bg-white border border-slate-200 p-4 lg:p-5 hover:border-indigo-300 transition-all duration-300 overflow-hidden shadow-sm">
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Scissors className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-slate-900 font-semibold text-sm lg:text-base block">
                      Remove Background
                    </Label>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      AI-powered extraction
                    </p>
                  </div>
                </div>
                <Switch
                  checked={watchValue.backgroundRemoved}
                  onCheckedChange={(checked) =>
                    setValue("backgroundRemoved", checked)
                  }
                  className="bg-slate-200! data-[state=checked]:bg-indigo-600! shrink-0"
                />
              </div>
            </div>
          </div>

          {/* Drop Shadow Card */}
          <div
            className={`group relative rounded-2xl bg-white border border-slate-200 p-4 lg:p-5 hover:border-amber-300 transition-all duration-300 overflow-hidden shadow-sm ${!watchValue.backgroundRemoved && "opacity-50"}`}
          >
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-slate-900 font-semibold text-sm lg:text-base block">
                      Drop Shadow
                    </Label>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {watchValue.backgroundRemoved
                        ? "Add realistic depth"
                        : "Requires background removal"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={watchValue.dropShadow}
                  onCheckedChange={(checked) => setValue("dropShadow", checked)}
                  disabled={!watchValue.backgroundRemoved}
                  className="bg-slate-200! data-[state=checked]:bg-indigo-600! border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resize & Crop Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Crop className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base lg:text-lg font-bold text-slate-900">
                Resize & Crop
              </h3>
              <p className="text-xs text-slate-500 truncate">
                Adjust dimensions
              </p>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-3">
            <Label className="text-slate-700 font-medium text-sm flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              Aspect Ratio
            </Label>
            <Select
              value={watchValue.aspectRatio}
              onValueChange={(value) => setValue("aspectRatio", value)}
            >
              <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl h-11 lg:h-12 hover:bg-slate-50 transition-colors py-6">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 rounded-xl">
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem
                    key={ratio.value}
                    value={ratio.value}
                    className="text-slate-900 hover:bg-slate-50 rounded-lg my-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg lg:text-xl text-slate-500">
                        <ratio.icon className="w-5 h-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-medium text-sm lg:text-base">
                          {ratio.label}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {ratio.desc}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Dimensions */}
          {watchValue.aspectRatio === "custom" && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in slide-in-from-top-2">
              <p className="text-slate-700 text-sm font-medium">
                Custom Dimensions
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-slate-500 text-xs font-medium">
                    Width (px)
                  </Label>
                  <Input
                    type="number"
                    value={watchValue.customWidth}
                    onChange={(e) =>
                      setValue("customWidth", parseInt(e.target.value) || 800)
                    }
                    min="100"
                    max="2000"
                    className="bg-white border-slate-200 text-slate-900 rounded-lg h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-500 text-xs font-medium">
                    Height (px)
                  </Label>
                  <Input
                    type="number"
                    value={watchValue.customHeight}
                    onChange={(e) =>
                      setValue("customHeight", parseInt(e.target.value) || 600)
                    }
                    min="100"
                    max="2000"
                    className="bg-white border-slate-200 text-slate-900 rounded-lg h-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Smart Crop Focus */}
          {watchValue.aspectRatio !== "original" && (
            <div className="space-y-3 animate-in slide-in-from-top-2">
              <Label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Smart Crop Focus
              </Label>
              <Select
                value={watchValue.smartCropFocus}
                onValueChange={(value) => setValue("smartCropFocus", value)}
              >
                <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl h-11 lg:h-12 hover:bg-slate-50 transition-colors py-6">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl">
                  {SMART_CROP_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-slate-900 hover:bg-slate-50 rounded-lg my-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg lg:text-xl text-slate-500">
                          <option.icon className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-sm lg:text-base">
                            {option.label}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {option.desc}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <Button
            onClick={applyTransformations}
            disabled={isTransforming}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 lg:h-12 text-sm lg:text-base font-semibold shadow-lg shadow-slate-200 transition-all duration-200 hover:-translate-y-0.5"
          >
            {isTransforming ? (
              <>
                <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 mr-2 animate-spin" />
                <span className="truncate">Transforming...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                <span className="truncate">Apply Transformations</span>
              </>
            )}
          </Button>

          <Button
            onClick={resetTransformations}
            variant="outline"
            className="w-full border-slate-200 hover:bg-slate-100! text-slate-600 hover:text-indigo-600 rounded-xl h-11 lg:h-12"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Panel - Preview */}
      <div className="flex flex-col space-y-4 lg:space-y-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base lg:text-lg font-bold text-slate-900">
              Live Preview
            </h3>
            <p className="text-xs text-slate-500 truncate">
              See changes in real-time
            </p>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center rounded-2xl lg:rounded-3xl bg-slate-100 border border-slate-200 p-6 lg:p-8 relative overflow-hidden min-h-[300px] lg:min-h-[400px] group">
          {/* Grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%,transparent_75%,#e2e8f0_75%,#e2e8f0),linear-gradient(45deg,#e2e8f0_25%,transparent_25%,transparent_75%,#e2e8f0_75%,#e2e8f0)] bg-size-[20px_20px] bg-position-[0_0,10px_10px] opacity-40 pointer-events-none" />

          {transformedImage ? (
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <Image
                src={transformedImage}
                alt="Transformed preview"
                width={uploadedImage?.width}
                height={uploadedImage?.height}
                className="w-full h-auto max-h-[300px] lg:max-h-[500px] object-contain rounded-xl lg:rounded-2xl shadow-xl"
                unoptimized
                onError={() => {
                  toast.error("Failed to load image");
                  setTransformedImage(uploadedImage?.url);
                }}
              />

              {/* Loading Overlay */}
              {isTransforming && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl lg:rounded-2xl">
                  <div className="text-center space-y-4 px-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse" />
                      <Loader2 className="relative w-10 h-10 lg:w-12 lg:h-12 text-indigo-600 animate-spin mx-auto" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-semibold text-base lg:text-lg">
                        Applying AI Magic...
                      </p>
                      <p className="text-slate-500 text-xs lg:text-sm">
                        This will just take a moment
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative z-10 text-slate-400 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm font-medium">Loading Preview...</span>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        {uploadedImage && transformedImage && (
          <div className="p-4 lg:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-900 font-semibold text-sm lg:text-base">
                    Image Ready
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    Your transformed image is ready to use
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 w-full">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 sm:flex-none border-slate-200 hover:bg-slate-100! hover:text-indigo-700 text-slate-700 rounded-xl px-4 lg:px-6 h-10 lg:h-11"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSelectImage}
                  className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 lg:px-6 h-10 lg:h-11 shadow-md shadow-indigo-100 transition-all"
                >
                  <Check className="h-4 w-4 mr-2" />
                  <span className="truncate">Use This Image</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageTransform;
