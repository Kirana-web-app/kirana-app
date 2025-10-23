import { Button } from "@/src/components/UI/Button";
import { useTranslations } from "next-intl";
import { FC, useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import ProgressBar from "./ProgressBar";
import Image from "next/image";
import { BusinessProfileFormData, StepProps } from "@/src/types/profileSetup";

const StepSix: FC<
  StepProps & { onSubmit: (data: BusinessProfileFormData) => void }
> = ({ currentStep, changeStep, form, onSubmit }) => {
  const t = useTranslations("StepSix");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { watch, handleSubmit } = form;

  const formData = watch();

  // Create image preview for the uploaded image
  useEffect(() => {
    if (formData.profileImage) {
      // The profileImage is already a base64 string from compression
      setImagePreview(formData.profileImage);
    }
  }, [formData.profileImage]);

  // Determine heading hierarchy based on store name availability
  const hasStoreName = formData.storeName && formData.storeName.trim() !== "";
  const mainHeading = hasStoreName ? formData.storeName : formData.ownerName;
  const subHeading = hasStoreName ? formData.ownerName : null;

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Form Content - Top aligned on mobile */}
      <div className="flex-1 flex flex-col py-4 px-4">
        <div className="mt-4">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="heading-1">{t("heading")}</h1>
              <p className="md:text-lg opacity-60">{t("sub-heading")}</p>
            </div>

            {/* Profile Preview Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              {/* Profile Image */}
              {imagePreview && (
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <Image
                      src={imagePreview}
                      alt="Business Profile"
                      className="rounded-full w-full h-full object-cover border-4 border-gray-100"
                      width={128}
                      height={128}
                    />
                  </div>
                </div>
              )}

              {/* Business/Owner Information */}
              <div className="text-center space-y-1.5">
                <div className="">
                  {/* Sub Heading (Owner name when store name exists) */}
                  {subHeading && (
                    <p className="!text-center font-medium text-gray-600">
                      {subHeading}
                    </p>
                  )}
                  {/* Main Heading */}
                  <h2 className="!text-center text-2xl font-bold text-gray-900">
                    {mainHeading}
                  </h2>
                </div>

                {/* Business Type */}
                <p className="!text-center text-base text-gray-500">
                  {formData.businessType}
                </p>

                {/* Address */}
                <div className="!text-center text-sm text-gray-500 space-y-1">
                  <p className="!text-center">{formData.location.address}</p>
                  <p className="!text-center">
                    {formData.location.city}, {formData.location.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Options */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">{t("edit-message")}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => changeStep(1)}
              >
                {t("edit-button")}
              </Button>
            </div>
          </div>

          {/* Desktop Submit Button - Hidden on mobile */}
          <div className="hidden sm:block">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              className="mt-8"
              onClick={handleSubmit(onSubmit)}
            >
              {t("submit-button")}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Submit Button - Fixed at bottom, always visible */}
      <div className="sm:hidden flex-shrink-0 m-6">
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          onClick={handleSubmit(onSubmit)}
        >
          {t("submit-button")}
        </Button>
      </div>
    </div>
  );
};

export default StepSix;
