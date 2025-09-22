import { Button } from "@/src/components/UI/Button";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { Controller } from "react-hook-form";
import ComboboxDropDown from "@/src/components/UI/ComboBox";
import {
  businessTypesEnglish,
  businessTypesUrdu,
} from "@/src/data/businessTypes";
import { StepProps } from "@/src/types/profileSetup";

const StepTwo: FC<StepProps> = ({ currentStep, changeStep, form }) => {
  const t = useTranslations("StepTwo");
  const l = useTranslations("locale");

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Form Content - Top aligned on mobile */}
      <div className="flex-1 flex flex-col py-4 px-4">
        <div className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="heading-1">{t("heading")}</h1>
              <p className="md:text-lg opacity-60">{t("sub-heading")}</p>
            </div>
            <Controller
              name="businessType"
              control={control}
              rules={{
                required: "Business type is required",
                minLength: {
                  value: 2,
                  message: "Business type must be at least 2 characters",
                },
              }}
              render={({ field }) => (
                <ComboboxDropDown
                  options={
                    l("locale") === "ur"
                      ? businessTypesUrdu
                      : businessTypesEnglish
                  }
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("placeholder")}
                  error={errors.businessType?.message}
                  required
                  name={field.name}
                  id="businessType"
                />
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

export default StepTwo;
