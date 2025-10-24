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
                <div className="text-center">
                  <span className="text-lg">
                    Have an account?{" "}
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
