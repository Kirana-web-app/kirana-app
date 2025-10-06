import { Button } from "@/src/components/UI/Button";
import { useTranslations } from "next-intl";
import { FC, useRef, useState, useEffect } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { BusinessProfileFormData } from "../page";
import ProgressBar from "./ProgressBar";
import { IoCloudUploadOutline, IoImageOutline } from "react-icons/io5";
import Image from "next/image";
import { StepProps } from "@/src/types/profileSetup";

const StepFive: FC<StepProps> = ({ currentStep, changeStep, form }) => {
  const t = useTranslations("StepFive");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = form;

  const selectedFile = watch("businessProfileImage");

  // Create image preview when file changes
  useEffect(() => {
    if (selectedFile && selectedFile instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  }, [selectedFile]);

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
              name="businessProfileImage"
              control={control}
              rules={{
                required: t("errors.required"),
                validate: {
                  fileType: (file: File | undefined) => {
                    if (!file) return true;
                    const allowedTypes = [
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "image/webp",
                    ];
                    return (
                      allowedTypes.includes(file.type) || t("errors.fileType")
                    );
                  },
                  fileSize: (file: File | undefined) => {
                    if (!file) return true;
                    const maxSize = 5 * 1024 * 1024; // 5MB
                    return file.size <= maxSize || t("errors.fileSize");
                  },
                },
              }}
              render={({ field }) => (
                <div className="space-y-2">
                  <div
                    onClick={handleFileSelect}
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      errors.businessProfileImage
                        ? "border-red-300 bg-red-50 hover:border-red-400"
                        : "border-gray-300  hover:border-gray-400"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />

                    <div className="space-y-3">
                      {selectedFile && imagePreview ? (
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
                            {/* <p className="text-sm font-medium text-gray-900">
                              {selectedFile.name}
                            </p> */}
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
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
                              PNG, JPG, WebP up to 5MB
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {errors.businessProfileImage && (
                    <p className="text-sm text-red-600">
                      {errors.businessProfileImage.message}
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
