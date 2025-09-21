import { Button } from "@/src/components/UI/Button";
import { ROUTES } from "@/src/constants/routes/routes";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import SetUpBusinessProfileImg from "@/src/assets/images/set-up-business-profile.jpg";
import { useTranslations } from "next-intl";

const SetUpBusinessProfilePage: FC = () => {
  const t = useTranslations("SetUpBusinessProfile");

  return (
    <div className="flex min-h-full flex-wrap-reverse content-end">
      <div className="flex flex-1 lg:w-[45%] flex-col justify-center px-4 py-8 sm:px-6 lg:flex-none lg:px-12">
        <div className="mx-auto w-full max-w-sm ">
          {/* text-center */}
          <div className=" flex-1 md:space-y-4 space-y-2">
            <h1 className="text-xl md:text-2xl font-semibold !text-center">
              {t("title")}
            </h1>
            <p className="md:text-base text-sm">{t("description")}</p>
          </div>

          <div className="mt-10 space-y-4">
            <Button variant="primary" size="md" fullWidth>
              {t("button-primary")}
            </Button>
            <Button variant="secondary" size="padding_0" fullWidth asChild>
              <Link
                href={ROUTES.AUTH.SIGN_UP}
                className="w-full h-full text-center p-3"
              >
                {t("button-secondary")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full lg:flex-1 lg:h-screen h-[480px]">
        <Image
          alt="get started"
          src={SetUpBusinessProfileImg}
          className="h-full w-full object-cover"
          width={600}
          priority
        />
      </div>
    </div>
  );
};

export default SetUpBusinessProfilePage;
