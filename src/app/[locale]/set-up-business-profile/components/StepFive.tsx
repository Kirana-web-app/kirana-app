import { Button } from "@/src/components/UI/Button";
import { useTranslations } from "next-intl";
import { FC, useRef, useState, useEffect } from "react";
import { UseFormReturn, Controller } from "react-hook-form";

import ProgressBar from "./ProgressBar";
import { IoCloudUploadOutline, IoImageOutline } from "react-icons/io5";
import Image from "next/image";
import { BusinessProfileFormData, StepProps } from "@/src/types/profileSetup";
import {
  compressImage,
  COMPRESSION_PRESETS,
  formatFileSize,
  CompressionResult,
} from "@/src/utils/imageCompressor";

const StepFive: FC<StepProps> = ({ currentStep, changeStep, form }) => {
  const t = useTranslations("StepFive");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedImageData, setCompressedImageData] = useState<string | null>(
    null
  );
  const [compressionInfo, setCompressionInfo] =
    useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = form;

  const businessProfileImage = watch("profileImage");

  // Create image preview when compressed image changes
  useEffect(() => {
    if (businessProfileImage) {
      setImagePreview(businessProfileImage);
    } else {
      setImagePreview(null);
    }
  }, [businessProfileImage]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      alert("Please select an image smaller than 10MB");
      return;
    }

    setSelectedFile(file);
    setIsCompressing(true);

    try {
      // Create preview for immediate display
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Compress image for Firestore storage
      const compressionResult = await compressImage(
        file,
        COMPRESSION_PRESETS.SMALL
      );

      setCompressedImageData(compressionResult.compressedImage);
      setCompressionInfo(compressionResult);

      // Set the compressed image in the form
      setValue("profileImage", compressionResult.compressedImage);

      console.log("Image compressed successfully:", {
        originalSize: formatFileSize(compressionResult.originalSize),
        compressedSize: formatFileSize(compressionResult.compressedSize),
        compressionRatio: `${compressionResult.compressionRatio.toFixed(1)}%`,
      });
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Failed to process image. Please try a different image.");
      setSelectedFile(null);
      setImagePreview(null);
      setCompressedImageData(null);
      setCompressionInfo(null);
      setValue("profileImage", null);
    } finally {
      setIsCompressing(false);
    }
  };

  const onSubmit = (data: BusinessProfileFormData) => {
    console.log("Business profile form submitted:", data);
    // Handle final form submission
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Form Content - Top aligned on mobile */}
      <div className="flex-1 flex flex-col py-4 px-4">
        <div className="mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="heading-1">{t("heading")}</h1>
              <p className="md:text-lg opacity-60">{t("sub-heading")}</p>
            </div>

            {/* File Upload Area */}
            <Controller
              name="profileImage"
              control={control}
              rules={{
                required: t("errors.required"),
              }}
              render={({ field }) => (
                <div className="space-y-2">
                  <div
                    onClick={handleFileSelect}
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      errors.profileImage
                        ? "border-red-300 bg-red-50 hover:border-red-400"
                        : "border-gray-300  hover:border-gray-400"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />

                    <div className="space-y-3">
                      {isCompressing ? (
                        <>
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                          <p className="text-sm text-gray-600">
                            Compressing image...
                          </p>
                        </>
                      ) : businessProfileImage && imagePreview ? (
                        <>
                          <div className="relative w-40 h-40 mx-auto">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              className="rounded-full w-full h-full object-cover border-2 border-gray-200"
                              width={160}
                              height={160}
                            />
                          </div>
                          <div>
                            {/* {selectedFile && (
                              <p className="text-xs text-gray-500">
                                {formatFileSize(selectedFile.size)} →{" "}
                                {compressionInfo &&
                                  formatFileSize(
                                    compressionInfo.compressedSize
                                  )}
                              </p>
                            )}
                            {compressionInfo && (
                              <p className="text-xs text-green-600">
                                Compressed by{" "}
                                {compressionInfo.compressionRatio.toFixed(1)}%
                              </p>
                            )} */}
                            <p className="text-sm text-primary mt-1">
                              Click to change image
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <IoCloudUploadOutline className="w-12 h-12 mx-auto text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {t("placeholder")}
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, WebP up to 10MB
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {errors.profileImage && (
                    <p className="text-sm text-red-600">
                      {errors.profileImage.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Desktop Submit Button - Hidden on mobile */}
          <div className="hidden sm:block">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              className="mt-8"
              onClick={() => changeStep(currentStep + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Submit Button - Fixed at bottom, always visible */}
      <div className="sm:hidden flex-shrink-0 m-6">
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => changeStep(currentStep + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepFive;
