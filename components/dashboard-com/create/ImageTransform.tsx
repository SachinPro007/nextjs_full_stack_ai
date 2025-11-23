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
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const ASPECT_RATIOS = [
  {
    label: "Original",
    value: "original",
    icon: "🔲",
    desc: "Keep original size",
  },
  {
    label: "Square 1:1",
    value: "1:1",
    width: 400,
    height: 400,
    icon: "⬜",
    desc: "Perfect square",
  },
  {
    label: "Landscape 16:9",
    value: "16:9",
    width: 800,
    height: 450,
    icon: "🖼️",
    desc: "Widescreen",
  },
  {
    label: "Portrait 4:5",
    value: "4:5",
    width: 400,
    height: 500,
    icon: "📱",
    desc: "Mobile friendly",
  },
  {
    label: "Story 9:16",
    value: "9:16",
    width: 450,
    height: 800,
    icon: "📲",
    desc: "Instagram story",
  },
  { label: "Custom", value: "custom", icon: "✂️", desc: "Set your own" },
];

const SMART_CROP_OPTIONS = [
  { label: "Auto Detect", value: "auto", desc: "AI-powered focus", icon: "🤖" },
  { label: "Face Focus", value: "face", desc: "Detect faces", icon: "👤" },
  { label: "Center", value: "center", desc: "Center of image", icon: "🎯" },
  { label: "Top", value: "top", desc: "Top portion", icon: "⬆️" },
  { label: "Bottom", value: "bottom", desc: "Bottom portion", icon: "⬇️" },
];

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
    <div className="flex flex-col gap-6">
      {/* Left Panel - Controls */}
      <div className="space-y-6 max-h-[65vh] lg:max-h-[60vh]">
        {/* AI Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-slate-900" />
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
          <div className="group relative rounded-2xl bg-linear-to-br from-white/5 to-white/2 border border-white/10 p-4 lg:p-5 hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Scissors className="w-4 h-4 lg:w-5 lg:h-5 text-slate-900" />
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
                  className="data-[state=checked]:bg-linear-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500 shrink-0"
                />
              </div>
            </div>
          </div>

          {/* Drop Shadow Card */}
          <div
            className={`group relative rounded-2xl bg-linear-to-br from-white/5 to-white/2 border border-white/10 p-4 lg:p-5 hover:border-pink-500/30 transition-all duration-300 overflow-hidden ${!watchValue.backgroundRemoved && "opacity-50"}`}
          >
            <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-slate-900" />
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
                  disabled={!watchValue.backgroundRemoved}
                  onCheckedChange={(checked) => setValue("dropShadow", checked)}
                  className="data-[state=checked]:bg-linear-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-rose-500 shrink-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resize & Crop Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center shrink-0">
              <Crop className="w-5 h-5 text-slate-900" />
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
            <Label className="text-slate-900 font-medium text-sm flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              Aspect Ratio
            </Label>
            <Select
              value={watchValue.aspectRatio}
              onValueChange={(value) => setValue("aspectRatio", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-slate-900 rounded-xl h-11 lg:h-12 hover:bg-white/10 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10 rounded-xl">
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem
                    key={ratio.value}
                    value={ratio.value}
                    className="text-slate-900 hover:bg-white/5 rounded-lg my-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg lg:text-xl">{ratio.icon}</span>
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
            <div className="p-4 rounded-xl bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 space-y-3">
              <p className="text-slate-900 text-sm font-medium">
                Custom Dimensions
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-slate-900 text-xs font-medium">
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
                    className="bg-white/5 border-white/10 text-slate-900 rounded-lg h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-900 text-xs font-medium">
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
                    className="bg-white/5 border-white/10 text-slate-900 rounded-lg h-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Smart Crop Focus */}
          {watchValue.aspectRatio !== "original" && (
            <div className="space-y-3">
              <Label className="text-slate-900 font-medium text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Smart Crop Focus
              </Label>
              <Select
                value={watchValue.smartCropFocus}
                onValueChange={(value) => setValue("smartCropFocus", value)}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-slate-900 rounded-xl h-11 lg:h-12 hover:bg-white/10 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10 rounded-xl">
                  {SMART_CROP_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-slate-900 hover:bg-white/5 rounded-lg my-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg lg:text-xl">
                          {option.icon}
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
        <div className="space-y-3 pt-4 border-t border-white/10">
          <Button
            onClick={applyTransformations}
            disabled={isTransforming}
            className="w-full bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-slate-900 rounded-xl h-11 lg:h-12 text-sm lg:text-base font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200"
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
            className="w-full border-white/10 hover:bg-white/5 text-slate-900 rounded-xl h-11 lg:h-12"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex flex-col space-y-4 lg:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5 text-slate-900" />
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
        <div className="flex-1 flex items-center justify-center rounded-2xl lg:rounded-3xl bg-linear-to-br from-zinc-900/50 to-black/50 border border-white/10 p-6 lg:p-8 relative overflow-hidden min-h-[300px] lg:min-h-[400px]">
          {/* Grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-size-[24px_24px] lg:bg-size-[32px_32px]" />

          {transformedImage && (
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <Image
                src={transformedImage}
                alt="Transformed preview"
                width={uploadedImage?.width}
                height={uploadedImage?.height}
                className="w-full h-auto max-h-[300px] lg:max-h-[500px] object-contain rounded-xl lg:rounded-2xl shadow-2xl"
                onError={() => {
                  toast.error("Failed to load image");
                  setTransformedImage(uploadedImage?.url);
                }}
              />

              {/* Loading Overlay */}
              {isTransforming && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center rounded-xl lg:rounded-2xl">
                  <div className="text-center space-y-4 px-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                      <Loader2 className="relative w-10 h-10 lg:w-12 lg:h-12 text-purple-400 animate-spin mx-auto" />
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
          )}
        </div>

        {/* Bottom Action Bar */}
        {uploadedImage && transformedImage && (
          <div className="p-4 lg:p-6 rounded-2xl bg-linear-to-br from-white/5 to-white/2 border border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 lg:w-6 lg:h-6 text-slate-900" />
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

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 sm:flex-none border-white/10 hover:bg-white/5 text-slate-900 rounded-xl px-4 lg:px-6 h-10 lg:h-11"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSelectImage}
                  className="flex-1 sm:flex-none bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-900 rounded-xl px-4 lg:px-6 h-10 lg:h-11 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
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
