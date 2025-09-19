"use client";

import { FC } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/UI/Button";
import { Input } from "../../../components/UI/Input";
import { ROUTES } from "../../../constants/routes/routes";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    // Handle login logic here
    console.log("Login attempt:", data);
  };

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
              type="password"
              placeholder="Password"
              error={errors.password?.message}
            />

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="#"
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
