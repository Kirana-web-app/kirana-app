import { Button } from "@/src/components/UI/Button";
import Toggle from "@/src/components/UI/Toogle";
import CustomSelect from "@/src/components/UI/CustomSelect";
import { ROUTES } from "@/src/constants/routes/routes";
import { Customer } from "@/src/types/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import { GoBookmark } from "react-icons/go";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import useAuthStore from "@/src/stores/authStore";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";

const CustomerProfile: FC<{
  userData: Customer;
  handleBackClick: () => void;
}> = ({ userData, handleBackClick }) => {
  const { logOut, authLoading } = useAuthStore();

  const [user, setUser] = useState(userData);
  const router = useRouter();
  const t = useTranslations("CustomerProfile");

  const languageOptions = [
    {
      value: "en",
      label: t("english"),
      onClick: () => {
        setUser({ ...user, defaultLanguage: "en" });
        router.push(`/en${ROUTES.PROFILE.USER(user.id)}`);
      },
    },
    {
      value: "ur",
      label: t("urdu"),
      onClick: () => {
        setUser({ ...user, defaultLanguage: "ur" });
        router.push(`/ur${ROUTES.PROFILE.USER(user.id)}`);
      },
    },
  ];

  const handleLogOut = async () => {
    try {
      await logOut();
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (authLoading) return <LoadingSpinner className="mt-80" />;

  return (
    <div className="py-6">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="px-4 mb-4 hover:text-primary transition-colors"
        >
          <MdOutlineArrowBackIosNew className="size-6" />
        </button>
        <div className="py-4 ">
          <div className="px-4 space-y-6 w-full">
            <div className=" flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
                {user.profileImage && (
                  <Image
                    src={user.profileImage}
                    alt={`${user.fullName}'s profile picture`}
                    className="rounded-full w-16 h-16 object-cover"
                    width={64}
                    height={64}
                  />
                )}
              </div>
              <div className="">
                <h2 className="font-bold text-2xl user-name">
                  {user.fullName}
                </h2>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            <div className="">
              <Button variant="secondary" fullWidth>
                {t("editProfile")}
              </Button>
            </div>
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-3">
                <GoBookmark className="size-6" />
                <p className="font-medium">{t("saved")}</p>
              </div>
              <div className="rotate-180">
                <MdOutlineArrowBackIosNew />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-8 border-gray-100 "></div>
      <div className="mx-auto max-w-2xl">
        <div className="px-4 py-6 w-full">
          <h3 className="text-xl font-bold">
            <span data-translated>{t("settings")}</span>
          </h3>

          <div className="mt-6 space-y-6">
            <div className="">
              <label
                htmlFor="default-language"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("defaultLanguage")}
              </label>
              <CustomSelect
                options={languageOptions}
                value={user.defaultLanguage}
                placeholder={t("selectLanguage")}
                className="w-full"
              />
            </div>
            <div className=" flex items-center justify-between gap-2">
              <div className="flex in-checked gap-2">
                <IoCheckmarkDoneOutline className="size-6" />
                <span>{t("readReceipts")}</span>
              </div>
              <Toggle
                onChange={() => {
                  setUser({ ...user, readReceipts: !user.readReceipts });
                }}
                checked={user.readReceipts}
              />
            </div>
            <div className="">
              <Button fullWidth variant="destructive" onClick={handleLogOut}>
                {t("logOut")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
