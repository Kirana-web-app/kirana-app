import { Button } from "@/src/components/UI/Button";
import { Input } from "@/src/components/UI/Input";
import { Textarea } from "@/src/components/UI/Textarea";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { StepProps } from "@/src/types/profileSetup";

const StepThree: FC<StepProps> = ({ currentStep, changeStep, form }) => {
  const t = useTranslations("StepThree");

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

            {/* Country Input */}
            <Input
              {...register("location.country", {
                required: "Country is required",
                minLength: {
                  value: 2,
                  message: "Country must be at least 2 characters",
                },
              })}
              id="country"
              name="location.country"
              type="text"
              label={t("label_1")}
              placeholder={t("placeholder_1")}
              required
              disabled
              error={errors.location?.country?.message}
            />

            {/* City Input */}
            <Input
              {...register("location.city", {
                required: "City is required",
                minLength: {
                  value: 2,
                  message: "City must be at least 2 characters",
                },
              })}
              id="city"
              name="location.city"
              type="text"
              label={t("label_2")}
              placeholder={t("placeholder_2")}
              required
              disabled
              error={errors.location?.city?.message}
            />

            {/* Address Input */}
            <Textarea
              {...register("location.address", {
                required: "Address is required",
                minLength: {
                  value: 5,
                  message: "Address must be at least 5 characters",
                },
              })}
              id="address"
              name="location.address"
              label={t("label_3")}
              placeholder={t("placeholder_3")}
              required
              rows={4}
              error={errors.location?.address?.message}
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

export default StepThree;
