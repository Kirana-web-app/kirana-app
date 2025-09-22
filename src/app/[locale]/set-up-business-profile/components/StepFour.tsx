import { Button } from "@/src/components/UI/Button";
import { Input } from "@/src/components/UI/Input";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { StepProps } from "@/src/types/profileSetup";

const StepFour: FC<StepProps> = ({ currentStep, changeStep, form }) => {
  const t = useTranslations("StepFour");

  const {
    register,
    formState: { errors },
  } = form;

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

            {/* Store Name Input - Optional */}
            <Input
              {...register("storeName", {
                minLength: {
                  value: 2,
                  message: "Store name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Store name must be less than 50 characters",
                },
              })}
              id="storeName"
              name="storeName"
              type="text"
              placeholder={t("placeholder")}
              error={errors.storeName?.message}
            />
          </div>

          {/* Desktop Continue Button - Hidden on mobile */}
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

      {/* Mobile Continue Button - Fixed at bottom, always visible */}
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

export default StepFour;
