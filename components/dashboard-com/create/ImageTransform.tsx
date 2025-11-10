import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadResponse } from "@imagekit/next";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Check,
  CheckCircle,
  Circle,
  Crop,
  ImageIcon,
  Loader2,
  RefreshCw,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const ASPECT_RATIOS = [
  { label: "Original", value: "original" },
  { label: "Square (1:1)", value: "1:1", width: 400, height: 400 },
  { label: "Landscape (16:9)", value: "16:9", width: 800, height: 450 },
  { label: "Portrait (4:5)", value: "4:5", width: 400, height: 500 },
  { label: "Story (9:16)", value: "9:16", width: 450, height: 800 },
  { label: "Custom", value: "custom" },
];

const SMART_CROP_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "Face", value: "face" },
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
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

  // Apply transformations
  const applyTransformations = async () => {
    if (!uploadedImage) return;

    setIsTransforming(true);

    try {
      let transformationString = "";

      // image ratio
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

      // image crop
      if (
        watchValue.aspectRatio !== "original" &&
        watchValue.smartCropFocus !== "auto"
      ) {
        if (transformationString.length > 0) transformationString += ",";

        transformationString += `fo-${watchValue.smartCropFocus}`;
      }

      // image bg remove or shadow
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

      // Simulating the time it takes for a transformation to apply/load
      await new Promise((resolver) => setTimeout(resolver, 1500));
      toast.success("Image transformed");

      return finalUrl;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          error.message || "Something went wrong on image transformation",
        );
      }
    } finally {
      setIsTransforming(false);
    }
  };

  // Reset transformations
  const resetTransformations = () => {
    setTransformedImage(uploadedImage?.url);
    reset();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Wand2 className="h-5 w-5 mr-2" />
            AI Transformation
          </h3>

          {/* Background Removal */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white font-medium">
                Remove Background
              </Label>
              <Button
                type="button"
                className="cursor-pointer"
                variant={watchValue.backgroundRemoved ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setValue("backgroundRemoved", !watchValue.backgroundRemoved)
                }
              >
                {watchValue.backgroundRemoved ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-slate-400">
              AI-powered background removal
            </p>
          </div>

          {/* Drop Shadow */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white font-medium">Drop Shadow</Label>
              <Button
                type="button"
                variant={watchValue.dropShadow ? "default" : "outline"}
                size="sm"
                disabled={!watchValue.backgroundRemoved}
                onClick={() => setValue("dropShadow", !watchValue.dropShadow)}
              >
                {watchValue.dropShadow ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-slate-400">
              {watchValue.backgroundRemoved
                ? "Add realistic shadow"
                : "Requires background removal"}
            </p>
          </div>

          {/* Aspect Ratio & Cropping */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Crop className="h-5 w-5 mr-2" />
              Resize & Crop
            </h3>

            <div className="space-y-3">
              <Label className="text-white">Aspect Ratio</Label>
              <Select
                value={watchValue.aspectRatio}
                onValueChange={(value) => setValue("aspectRatio", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {watchValue.aspectRatio === "custom" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white">Width</Label>
                  <Input
                    type="number"
                    value={watchValue.customWidth}
                    onChange={(e) =>
                      setValue("customWidth", parseInt(e.target.value) || 800)
                    }
                    min="100"
                    max="2000"
                  />
                </div>
                <div>
                  <Label className="text-white">Height</Label>
                  <Input
                    type="number"
                    value={watchValue.customHeight}
                    onChange={(e) =>
                      setValue("customHeight", parseInt(e.target.value) || 600)
                    }
                    min="100"
                    max="2000"
                  />
                </div>
              </div>
            )}

            {watchValue.aspectRatio !== "original" && (
              <div className="space-y-3">
                <Label className="text-white">Smart Crop Focus</Label>
                <Select
                  value={watchValue.smartCropFocus}
                  onValueChange={(value) => setValue("smartCropFocus", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SMART_CROP_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={applyTransformations}
            disabled={isTransforming}
            variant={"default"}
          >
            {isTransforming ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Apply Transformations
          </Button>

          <Button onClick={resetTransformations} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Image Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Preview
        </h3>

        {transformedImage && (
          <div className="relative">
            {/* Image */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <Image
                src={transformedImage}
                alt="Trasformed preview"
                width={uploadedImage?.width}
                height={uploadedImage?.height}
                className="w-full h-auto max-h-96 object-contain rounded-lg mx-auto"
                onError={() => {
                  toast.error("Faild to load transformed image");
                  setTransformedImage(uploadedImage?.url);
                }}
              />
            </div>

            {/* Loader */}
            {isTransforming && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="bg-slate-800 rounded-lg p-4 flex items-center space-x-3">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                  <span className="text-white">
                    Applying transformations...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image use or cancel action */}
        {uploadedImage && transformedImage && (
          <div className="text-center space-y-4">
            <div className="text-sm text-slate-400">
              Current image URL ready for use
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleSelectImage}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Use This Image
              </Button>

              <Button
                onClick={handleClose}
                variant="outline"
                className="border-slate-600 hover:bg-slate-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageTransform;
