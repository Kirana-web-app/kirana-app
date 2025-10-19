"use client";
import Image from "next/image";
import GetStartedImg from "../../assets/images/get-started.jpg";
import Link from "next/link";
import { Button } from "@/src/components/UI/Button";
import { ROUTES } from "@/src/constants/routes/routes";
import useAuthRedirect from "@/src/hooks/useAuthRedirect";

export default function GetStarted() {
  useAuthRedirect();

  return (
    <>
      <div className="flex min-h-full flex-wrap-reverse content-between">
        <div className="flex flex-1 lg:w-[45%] flex-col justify-center px-4 py-8 sm:px-6 lg:flex-none lg:px-12">
          <div className="mx-auto w-full max-w-sm ">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-medium font-serif">Kirana</h2>
              <p className="text-lg">Sheher ki dukan, ab aapke phone mein.</p>
            </div>

            <div className="mt-10 space-y-6">
              <Button variant="primary" size="padding_0" fullWidth asChild>
                <Link
                  href={ROUTES.AUTH.SIGN_UP}
                  className="w-full h-full text-center p-3"
                >
                  Get Started
                </Link>
              </Button>

              <div className="">
                <div className="relative opacity-30">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm/6 font-medium">
                    <span className="bg-white px-6 font-semibold">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-8">
                  {[1, 2, 3].map((key) => (
                    <a
                      href="#"
                      key={key}
                      className="flex w-12 h-12 items-center justify-center rounded-full bg-white  inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-5 w-5"
                      >
                        <path
                          d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                          fill="#EA4335"
                        />
                        <path
                          d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                          fill="#34A853"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
                <div className="text-center my-8">
                  <span className="text-lg">
                    Have an account?{" "}
                    <Link
                      href={ROUTES.AUTH.LOGIN}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign in
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:flex-1 lg:h-screen h-[380px]">
          <Image
            alt="get started"
            src={GetStartedImg}
            className="h-full w-full object-cover"
            width={600}
            priority
          />
        </div>
      </div>
    </>
  );
}
