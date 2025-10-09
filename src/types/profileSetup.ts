import { UseFormReturn } from "react-hook-form";

export interface BusinessProfileFormData {
  ownerName: string;
  businessType: string;
  location: {
    country: string;
    city: string;
    address: string;
    // geolocation?: { latitude: number; longitude: number };
  };
  storeName?: string;
  businessProfileImage: File;
}

export interface StepProps {
  currentStep: number;
  changeStep: (targetStep: number) => Promise<void>;
  form: UseFormReturn<BusinessProfileFormData>;
}
