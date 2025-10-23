"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/UI/Button";
import { Input } from "../../../../components/UI/Input";
import { ROUTES } from "../../../../constants/routes/routes";
import {
  MdOutlineArrowBackIosNew,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import useAuthStore from "@/src/stores/authStore";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { useRouter } from "next/navigation";
import { getFirebaseErrorMessage } from "@/src/constants/authErrors";
import useAuthRedirect from "@/src/hooks/useAuthRedirect";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: FC = () => {
  const { logIn, authLoading, userData } = useAuthStore();
  const [authError, setAuthError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useAuthRedirect();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    // Clear any previous errors
    setAuthError("");

    console.log("Login attempt:", data);

    try {
      await logIn(data.email, data.password);
    } catch (error: any) {
      console.error("Login error:", error);

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

  useEffect(() => {
    if (userData) {
      if (
        userData.role === "user" ||
        (userData.role === "store" && !userData.profileCreated)
      )
        router.push(ROUTES.SET_UP_BUSINESS_PROFILE);
      else router.push(ROUTES.BAZAAR("near"));
    }
  }, [userData]);

  if (authLoading) return <LoadingSpinner heightScreen />;

  return (
    <div className="h-svh flex flex-col gap-6 ">
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
            <h1 className="text-2xl font-semibold">Login</h1>
          </div>
          <div className="size-6"></div>
        </div>
      </div>

      {/* Form Content - Top aligned on mobile */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full overflow-y-auto ">
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
              placeholder="Email"
              error={errors.email?.message}
            />

            {/* Password Input */}
            <div className="relative">
              <Input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <MdVisibilityOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <MdVisibility className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href={ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-primary font-medium hover:underline text-sm"
              >
                Forgot password?
              </Link>
            </div>

            {/* Desktop Login Button - Hidden on mobile */}
            <div className="hidden sm:block">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                className="mt-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loging In..." : "Log In"}
              </Button>
            </div>
          </form>

          {/* Sign Up Link - Centered on mobile, bottom on desktop */}
          <div className="mt-8 text-center sm:mt-6">
            <span className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href={ROUTES.AUTH.SIGN_UP}
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Login Button - Fixed at bottom, always visible */}
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
            {isSubmitting ? "Loging In..." : "Log In"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
