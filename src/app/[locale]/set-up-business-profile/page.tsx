"use client";
import { FC, useState, useEffect, use } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import SetupBusinessProfile from "./components/SetupBusinessProfile";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import StepFour from "./components/StepFour";
import StepFive from "./components/StepFive";
import StepSix from "./components/StepSix";
import ProgressBar from "./components/ProgressBar";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useTranslations } from "next-intl";
import { classNames } from "@/src/utils";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes/routes";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { BusinessProfileFormData } from "@/src/types/profileSetup";
import { createStoreProfile } from "@/src/utils/users";
import useAuthStore from "@/src/stores/authStore";

const SetUpBusinessProfilePage: FC = () => {
  const { user, userData } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations("SetUpBusinessProfile");

  const router = useRouter();

  // Local storage keys
  const STORAGE_KEY = "businessProfileFormData";
  const STEP_KEY = "businessProfileCurrentStep";

  // Load saved data from localStorage
  const loadFromStorage = () => {
    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        const savedStep = localStorage.getItem(STEP_KEY);

        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Handle file restoration separately since File objects can't be JSON stringified
          return {
            data: parsedData,
            step: savedStep ? parseInt(savedStep) : 0,
          };
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    }
    return null;
  };

  // Save data to localStorage
  const saveToStorage = (data: BusinessProfileFormData, step: number) => {
    if (typeof window !== "undefined") {
      try {
        // Create a copy of data without the File object for JSON serialization
        const dataToSave = {
          ...data,
          businessProfileImage: undefined, // Files can't be serialized
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        localStorage.setItem(STEP_KEY, step.toString());
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  };

  // Setup React Hook Form
  const form = useForm<BusinessProfileFormData>({
    defaultValues: {
      ownerName: "",
      businessType: "",
      location: {
        country: "Pakistan",
        city: "Karachi",
        address: "",
      },
      storeName: "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  // Load saved data on component mount
  useEffect(() => {
    const savedState = loadFromStorage();
    if (savedState) {
      // Restore form data
      form.reset(savedState.data);
      // Restore current step
      setCurrentStep(savedState.step);
    }
    setIsLoaded(true);
  }, [form]);

  // Auto-save form data on changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load

    const subscription = form.watch((data) => {
      // Save form data whenever it changes
      saveToStorage(data as BusinessProfileFormData, currentStep);
    });

    return () => subscription.unsubscribe();
  }, [form, currentStep, isLoaded]);

  useEffect(() => {
    if (userData?.profileCreated) {
      router.push(ROUTES.PROFILE.STORE(user!.uid));
    }
  }, [userData]);

  const onSubmit = async (data: BusinessProfileFormData) => {
    // Clear localStorage on successful submission
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_KEY);
    }

    // Handle form submission logic here
    console.log("Form submitted:", data);

    if (!user) {
      console.error("No user found. Cannot create store profile.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createStoreProfile(user.uid, data);
      router.push(ROUTES.PROFILE.STORE(user.uid));
    } catch (error) {
      console.error("Error creating store profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generic changeStep function with step-specific validation
  const changeStep = async (targetStep: number) => {
    if (targetStep > currentStep) {
      // Moving forward - validate current step
      let isValid = true;

      switch (currentStep) {
        case 1: // Step One - validate ownerName
          isValid = await form.trigger("ownerName");
          break;
        case 2: // Step Two - validate businessType
          isValid = await form.trigger("businessType");
          break;
        case 3: // Step Three - validate location fields
          isValid = await form.trigger([
            "location.country",
            "location.city",
            "location.address",
          ]);
          break;
        case 4: // Step Four - validate storeName (optional, so always valid)
          isValid = await form.trigger("storeName");
          break;
        case 5: // Step Five - validate businessProfileImage
          isValid = await form.trigger("businessProfileImage");
          break;
        case 6: // Step Six - final review, no validation needed
          isValid = true;
          break;
        default:
          isValid = true;
      }

      if (isValid) {
        setCurrentStep(targetStep);
        // Save current form data and step to localStorage
        const currentData = form.getValues();
        saveToStorage(currentData, targetStep);
      }
    } else {
      // Moving backward - no validation needed
      setCurrentStep(targetStep);
      // Save current form data and step to localStorage
      const currentData = form.getValues();
      saveToStorage(currentData, targetStep);
    }
  };

  const steps = [
    <StepOne
      key="step-1"
      currentStep={currentStep}
      changeStep={changeStep}
      form={form}
    />,
    <StepTwo
      key="step-2"
      currentStep={currentStep}
      changeStep={changeStep}
      form={form}
    />,
    <StepThree
      key="step-3"
      currentStep={currentStep}
      changeStep={changeStep}
      form={form}
    />,
    <StepFour
      key="step-4"
      currentStep={currentStep}
      changeStep={changeStep}
      form={form}
    />,
    <StepFive
      key="step-5"
      currentStep={currentStep}
      changeStep={changeStep}
      form={form}
    />,
    <StepSix
      key="step-6"
      currentStep={currentStep}
      changeStep={changeStep}
      onSubmit={onSubmit}
      form={form}
    />,
  ];

  const totalSteps = steps.length;

  if (isSubmitting) return <LoadingSpinner heightScreen />;

  // Show loading state until data is loaded from localStorage
  if (!isLoaded) {
    return <LoadingSpinner heightScreen />;
  }

  return (
    <div
      className={classNames("min-h-svh", currentStep > 0 && "flex flex-col")}
    >
      {currentStep === 0 ? (
        <SetupBusinessProfile setupProfile={setCurrentStep} />
      ) : (
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="flex-shrink-0 pt-10 px-6">
            <div className="flex items-center justify-between">
              <button
                className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => changeStep(currentStep - 1)}
              >
                <MdOutlineArrowBackIosNew className="size-6 text-primary" />
              </button>
              <div className=" flex-1">
                <h1 className="!text-center md:text-2xl text-xl font-semibold">
                  {t("title_2")}
                </h1>
              </div>
              <div className="size-6"></div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="px-4 mt-12 max-w-xl mx-auto w-full">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          <div className="flex-1 flex flex-col">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="sm:pb-12 flex-1 flex flex-col max-w-xl mx-auto w-full overflow-y-auto"
            >
              {steps[currentStep - 1]}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetUpBusinessProfilePage;
