"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Button } from "../../components/UI/Button";
import { RadioButton } from "../../components/UI/RadioButton";
import { ROUTES } from "../../constants/routes/routes";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useRouter } from "next/navigation";

type Language = "english" | "urdu";

const SetLanguagePage: FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("english");

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  const router = useRouter();

  const handleSubmit = () => {
    // Handle language selection logic here
    console.log("Selected language:", selectedLanguage);
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
          <div className="text-center flex-1">
            <h1 className="text-2xl font-semibold">Select Default Language</h1>
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
              <div
                className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedLanguage === "english"
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleLanguageChange("english")}
              >
                <RadioButton
                  id="english"
                  name="language"
                  value="english"
                  checked={selectedLanguage === "english"}
                  onChange={handleLanguageChange}
                  label="English"
                />
              </div>

              {/* Urdu Option */}
              <div
                className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedLanguage === "urdu"
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleLanguageChange("urdu")}
              >
                <RadioButton
                  id="urdu"
                  name="language"
                  value="urdu"
                  checked={selectedLanguage === "urdu"}
                  onChange={handleLanguageChange}
                  label="اردو (Urdu)"
                />
              </div>
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
