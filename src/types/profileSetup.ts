import { UseFormReturn } from "react-hook-form";
import { BusinessProfileFormData } from "../app/[locale]/set-up-business-profile/page";

export interface StepProps {
  currentStep: number;
  changeStep: (targetStep: number) => Promise<void>;
  form: UseFormReturn<BusinessProfileFormData>;
}
