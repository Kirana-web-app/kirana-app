"use client";

import Link from "next/link";
import { FC, useState } from "react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { Button } from "@/src/components/UI/Button";
import { ROUTES } from "@/src/constants/routes/routes";

type Inputs = {
  email: string;
};

const ForgotPassword: FC = () => {
  const [Loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email, {
        url: process.env.NEXT_PUBLIC_APP_URL + "/" + ROUTES.AUTH.LOGIN,
      });
      setEmailSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (Loading)
    return (
      <>
        <LoadingSpinner heightScreen />
      </>
    );

  if (emailSent) {
    return (
      <>
        <div className="flex min-h-svh flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12 text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-12 w-12 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Please check your email and click on the reset link to continue.
                The link will expire in 15 minutes.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setEmailSent(false)}
                  className="flex w-full justify-center rounded-md bg-bbg-green px-3 py-1.5 text-sm/6 font-medium text-white shadow-xs hover:bg-bbg-green/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bbg-green"
                >
                  Send another email
                </button>
                <Link
                  href="/auth/login"
                  className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-medium hover:bg-bbg-green/5 duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bbg-green text-bbg-green"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex min-h-svh flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl/9 tracking-tight text-gray-900">
          Forgot your password?
        </h2>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="px-6">
            <h4 className="mb-4 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password.
            </h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              method="POST"
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
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
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-bbg-green sm:text-sm/6"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Button type="submit" fullWidth size="sm" disabled={Loading}>
                  {Loading ? "Sending..." : "Send reset link"}
                </Button>

                <Link
                  href={ROUTES.AUTH.LOGIN}
                  className="flex w-full justify-center rounded-full px-3 py-1.5 text-sm/6 font-medium hover:bg-primary-light duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
