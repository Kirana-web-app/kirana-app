import { Button } from "@/src/components/UI/Button";
import Toggle from "@/src/components/UI/Toogle";
import CustomSelect from "@/src/components/UI/CustomSelect";
import { ROUTES } from "@/src/constants/routes/routes";
import { Store } from "@/src/types/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import { GoBookmark } from "react-icons/go";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { CiUser } from "react-icons/ci";

const StoreProfile: FC<{
  userData: Store;
  handleBackClick: () => void;
}> = ({ userData, handleBackClick }) => {
  const [user, setUser] = useState(userData);
  const router = useRouter();
  const t = useTranslations("StoreProfile");

  const languageOptions = [
    {
      value: "en",
      label: t("english"),
      onClick: () => {
        setUser({ ...user, defaultLanguage: "en" });
        router.push(`/en${ROUTES.PROFILE.STORE(user.id)}`);
      },
    },
    {
      value: "ur",
      label: t("urdu"),
      onClick: () => {
        setUser({ ...user, defaultLanguage: "ur" });
        router.push(`/ur${ROUTES.PROFILE.STORE(user.id)}`);
      },
    },
  ];

  return (
    <div className="pb-6">
      <div className="mx-auto max-w-4xl">
        <div className="">
          <div className="w-full">
            <div className="relative">
              <div className="h-80 w-full relative">
                <div className="bg-linear-0 from-black/50 to-black/0 absolute inset-0"></div>
                <Image
                  src={user.profileImage}
                  alt={`${user.name}'s profile picture`}
                  className="w-full h-full object-cover"
                  width={576}
                  height={576}
                />
              </div>

              {/* Back Button */}
              <div className="absolute top-6 left-4 text-white">
                <button
                  onClick={handleBackClick}
                  className="p-2.5 rounded-full bg-black/50 hover:text-primary transition-colors"
                >
                  <MdOutlineArrowBackIosNew className="size-6" />
                </button>
              </div>
              <div className="absolute bottom-6 left-6 text-white space-y-2 w-80">
                <h2 className="font-bold text-2xl store-name">{user.name}</h2>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            <div className="px-4 space-y-6 py-6">
              <div className="">
                <Button variant="secondary" fullWidth>
                  {t("editProfile")}
                </Button>
              </div>
              <div className="">
                <div className="flex gap-20 items-center justify-between py-6 border-b border-gray-200">
                  <p className="font-medium text-lg">{t("storeRating")}</p>
                  <div className="text-primary flex items-center gap-2 font-semibold text-lg rating">
                    {userData.rating}
                    <div className="">
                      {[1, 2, 3, 4, 5].map((key) => (
                        <span key={key} className="text-xl">
                          {key <= Math.floor(userData.rating ?? 0) ? "★" : "☆"}{" "}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-20 items-center justify-between py-6 border-b border-gray-200">
                  <p className="font-medium text-lg">{t("deliveryRate")}</p>

                  <div className="text-primary flex items-center gap-2 font-semibold text-lg dynamic-content">
                    {userData.deliverySpeed}
                  </div>
                </div>
                <div className="flex gap-20 items-center justify-between py-6 border-b border-gray-200">
                  <p className="font-medium text-lg">{t("address")}</p>
                  <div className="text-primary flex items-center gap-2 font-semibold text-lg address-line">
                    {userData.address.addressLine}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-8 border-gray-100 "></div>
      <div className="mx-auto max-w-4xl">
        <div className="px-4 py-6 w-full">
          <h3 className="text-xl font-bold">
            <span data-translated>{t("reviews")}</span>
          </h3>
          <div className="">
            {userData.reviews && userData.reviews.length > 0 ? (
              userData.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 py-4 flex justify-between gap-4"
                >
                  <div className="flex items-center justify-center text-primary shrink-0 rounded-full bg-primary-light size-10">
                    <CiUser className="size-5" />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center gap-2 font-medium">
                      <p className="font-semibold user-name">
                        {review.userName}
                      </p>
                      <div className="text-primary rating">
                        {userData.rating} ★
                      </div>
                    </div>
                    <p className="text-base pt-2 review-content">
                      {review.comment}
                    </p>
                  </div>
                  <p className="text-sm opacity-50  shrink-0 date">
                    {review.date}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">{t("noReviews")}</p>
            )}
          </div>
        </div>
      </div>
      <div className="border-b-8 border-gray-100 "></div>
      <div className="mx-auto max-w-4xl">
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
            <div className="flex items-center justify-between gap-2">
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
              <Button fullWidth variant="destructive">
                {t("logOut")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProfile;
