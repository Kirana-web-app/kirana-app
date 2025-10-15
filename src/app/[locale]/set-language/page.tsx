"use client";

import { FC, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes/routes";
import { RadioButton } from "@/src/components/UI/RadioButton";
import { Button } from "@/src/components/UI/Button";
import { Link } from "@/src/i18n/navigation";
import { updateStore } from "@/src/utils/users";
import useAuthStore from "@/src/stores/authStore";

type Language = "en" | "ur";

const SetLanguagePage: FC = () => {
  const { user } = useAuthStore();
  const { locale } = useParams() as { locale: Language };

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    locale ?? "en"
  );

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  const router = useRouter();

  const handleSubmit = async () => {
    // Handle language selection logic here
    console.log("Selected language:", selectedLanguage);
    if (!user) return;

    await updateStore(user.uid, { defaultLanguage: selectedLanguage });

    // You can redirect to home or next page here
    router.push(ROUTES.SET_UP_BUSINESS_PROFILE);
  };

  return (
    <div className="h-svh flex flex-col gap-6">
      {/* Header */}
      <div className="flex-shrink-0 mt-4 p-6">
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.HOME}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MdOutlineArrowBackIosNew className="size-6 text-primary" />
          </Link>
          <div className=" flex-1">
            <h1 className="!text-center text-2xl font-semibold">
              Select Default Language
            </h1>
          </div>
          <div className="size-6"></div>
        </div>
      </div>

      {/* Form Content - Top aligned on mobile */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full overflow-y-auto">
        <div className="flex-1 flex flex-col justify-start sm:justify-center py-4 px-4">
          <div className="space-y-6">
            {/* Language Options */}
            <div className="space-y-4">
              {/* English Option */}
              <Link
                locale="en"
                href={ROUTES.SET_LANGUAGE}
                className={`block w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedLanguage === "en"
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleLanguageChange("en")}
              >
                <RadioButton
                  id="english"
                  name="language"
                  value="en"
                  checked={selectedLanguage === "en"}
                  onChange={handleLanguageChange}
                  label="English"
                />
              </Link>

              {/* Urdu Option */}
              <Link
                locale="ur"
                href={ROUTES.SET_LANGUAGE}
                className={`block w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedLanguage === "ur"
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleLanguageChange("ur")}
              >
                <RadioButton
                  id="urdu"
                  name="language"
                  value="ur"
                  checked={selectedLanguage === "ur"}
                  onChange={handleLanguageChange}
                  label="اردو (Urdu)"
                />
              </Link>
            </div>

            {/* Desktop Continue Button - Hidden on mobile */}
            <div className="hidden sm:block">
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                className="mt-8"
                onClick={handleSubmit}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Continue Button - Fixed at bottom, always visible */}
      <div className="sm:hidden flex-shrink-0 m-6">
        <Button
          type="button"
          variant="primary"
          size="md"
          fullWidth
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SetLanguagePage;
