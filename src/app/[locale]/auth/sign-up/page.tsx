"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "@/src/components/UI/Input";
import { ROUTES } from "@/src/constants/routes/routes";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/UI/Button";
import useAuthStore from "@/src/stores/authStore";
import { getFirebaseErrorMessage } from "@/src/constants/authErrors";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";

interface SignupFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage: FC = () => {
  const { signUp, authLoading, user } = useAuthStore();
  const [authError, setAuthError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>();

  const password = watch("password");

  const router = useRouter();

  // useEffect(() => {
  //   if (user) {
  //     router.push(ROUTES.BAZAAR);
  //   }
  // }, [user, router]);

  const onSubmit = async (data: SignupFormData) => {
    // Clear any previous errors
    setAuthError("");

    console.log("Signup attempt:", data);

    try {
      await signUp(data.fullName, data.email, data.password, data.phoneNumber);
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
    }
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
                pattern: {
                  value: /^[\p{L}\p{M}\s]+$/u,
                  message: "Full name can only contain letters and spaces",
                },
              })}
              id="fullName"
              name="fullName"
              type="text"
              label="Full Name"
              required
              error={errors.fullName?.message}
            />

            {/* Email Input */}
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              id="email"
              name="email"
              type="email"
              label="Email"
              required
              error={errors.email?.message}
            />

            {/* Phone Number Input */}
            <Input
              {...register("phoneNumber", {
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: "Invalid phone number format",
                },
                minLength: {
                  value: 10,
                  message: "Phone number must be at least 10 digits",
                },
              })}
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              label="Phone Number (Optional)"
              error={errors.phoneNumber?.message}
            />

            {/* Password Input */}
            <Input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message:
                    "Password must contain uppercase, lowercase, number and special character",
                },
              })}
              id="password"
              name="password"
              type="password"
              label="Password"
              required
              error={errors.password?.message}
            />

            {/* Confirm Password Input */}
            <Input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              required
              error={errors.confirmPassword?.message}
            />

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

      {/* Mobile Sign Up Button - Fixed at bottom, always visible */}
      <div className="sm:hidden flex-shrink-0 m-6">
        <div className="">
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
