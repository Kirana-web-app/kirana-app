"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/src/components/UI/Input";
import { ROUTES } from "@/src/constants/routes/routes";
import {
  MdOutlineArrowBackIosNew,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/UI/Button";
import useAuthStore from "@/src/stores/authStore";
import { getFirebaseErrorMessage } from "@/src/constants/authErrors";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import useAuthRedirect from "@/src/hooks/useAuthRedirect";

interface SignupFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUpPage: FC = () => {
  const { signUp, authLoading } = useAuthStore();
  const [authError, setAuthError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    } else if (formData.fullName.trim().length > 64) {
      newErrors.fullName = "Full name must be at most 64 characters";
    } else if (!/^[\p{L}\p{M}\s]+$/u.test(formData.fullName)) {
      newErrors.fullName = "Full name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Phone Number validation (optional) - Pakistani format
    if (formData.phoneNumber.trim()) {
      const phoneNumber = formData.phoneNumber.trim().replace(/[\s-]/g, ""); // Remove spaces and hyphens

      // Pakistani phone number formats:
      // +923XXXXXXXXX (13 digits with +92)
      // 923XXXXXXXXX (12 digits without +)
      // 03XXXXXXXXX (11 digits local format)
      const pakistaniPhoneRegex = /^(\+92|92|0)?3\d{9}$/;

      if (!pakistaniPhoneRegex.test(phoneNumber)) {
        newErrors.phoneNumber =
          "Invalid Pakistani phone number. Use format: 03XXXXXXXXX or +923XXXXXXXXX";
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number and special character(@ $ ! % * ? &)";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear any previous errors
    setAuthError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    console.log("Signup attempt:", formData);
    console.log("Form errors:", errors);

    try {
      // console.log("HO gaya sign up");
      await signUp(
        formData.fullName,
        formData.email,
        formData.password,
        formData.phoneNumber
      );
      router.push(ROUTES.SET_LANGUAGE);
    } catch (error: any) {
      console.error("Signup error:", error);

      // Handle Firebase errors
      if (error?.code) {
        setAuthError(getFirebaseErrorMessage(error.code));
      } else if (error?.message) {
        setAuthError(error.message);
      } else {
        setAuthError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useAuthRedirect();

  if (authLoading || isSubmitting) return <LoadingSpinner heightScreen />;

  return (
    <div className="h-svh flex flex-col gap-6 ">
      {/* Header */}
      <div className="flex-shrink-0 mt-4 p-6">
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MdOutlineArrowBackIosNew className="size-6 text-primary" />
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-semibold">Create an Account</h1>
          </div>
          <div className="size-6"></div>
        </div>
      </div>

      {/* Form Content - Top aligned on mobile */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="flex-1 flex flex-col justify-start sm:justify-center py-4 px-4">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Error Message Display */}
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{authError}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        type="button"
                        onClick={() => setAuthError("")}
                        className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                      >
                        <span className="sr-only">Dismiss</span>
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Name Input */}
            <Input
              id="fullName"
              name="fullName"
              type="text"
              label="Full Name"
              maxLength={64}
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
            />

            {/* Email Input */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />

            {/* Phone Number Input */}
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              label="Phone Number (Optional)"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
            />

            {/* Password Input */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 pt-6"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <MdVisibilityOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <MdVisibility className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 pt-6"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <MdVisibilityOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <MdVisibility className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* Desktop Sign Up Button - Hidden on mobile */}
            <div className="hidden sm:block">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                className="mt-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </div>

            {/* Mobile Sign Up Button - Inside form for validation */}
            <div className="sm:hidden">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </div>
          </form>

          {/* Login Link - Centered on mobile, bottom on desktop */}
          <div className="mt-8 text-center sm:mt-6">
            <span className="text-gray-600">
              Already have an account?{" "}
              <Link
                href={ROUTES.AUTH.LOGIN}
                className="text-primary font-medium hover:underline"
              >
                Log in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
