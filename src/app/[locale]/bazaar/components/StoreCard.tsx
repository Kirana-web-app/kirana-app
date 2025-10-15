import { FC } from "react";
import SetUpBusinessProfileImg from "@/src/assets/images/set-up-business-profile.jpg";
import Image from "next/image";
import { MdDeliveryDining } from "react-icons/md";
import { Store } from "@/src/types/user";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes/routes";
import { useTranslations } from "next-intl";
import {
  businessTypesEnglish,
  businessTypesUrdu,
} from "@/src/data/businessTypes";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { deliveryRate } from "@/src/constants/deliverySpeeds";

interface StoreCardProps {
  store: Store;
  isSaved?: boolean;
  onToggleSave?: (storeId: string) => void;
}

const StoreCard: FC<StoreCardProps> = ({
  store,
  isSaved = false,
  onToggleSave,
}) => {
  const t = useTranslations("Bazaar");
  const l = useTranslations("locale");

  // Function to translate business type
  const getTranslatedBusinessType = (businessType: string) => {
    if (l("locale") === "ur") {
      // Find index in English array and return corresponding Urdu translation
      const index = businessTypesEnglish.findIndex(
        (type) => type.toLowerCase() === businessType.toLowerCase()
      );
      return index !== -1 ? businessTypesUrdu[index] : businessType;
    }
    return businessType;
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(store.id);
  };

  return (
    <Link href={ROUTES.PROFILE.STORE(store.id)} className="">
      <div className="relative rounded-xl overflow-hidden">
        <div className="h-56 w-full bg-gray-100">
          {store.profileImage && (
            <Image
              src={store.profileImage}
              alt={"store img"}
              className="w-full h-56 object-cover"
              width={400}
              height={128}
            />
          )}
        </div>
        {/* Save/Unsave Button */}
        <button
          onClick={handleToggleSave}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
        >
          {isSaved ? (
            <GoBookmarkFill className="w-5 h-5 text-primary" />
          ) : (
            <GoBookmark className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      <div className="py-4 px-2">
        <h3 className="text-lg font-semibold line-clamp-2 mb-1 store-name">
          {store.storeName ?? store.ownerName}
        </h3>
        <p className="text-gray-600 text-sm store-type">
          {getTranslatedBusinessType(store.type)}
        </p>
        <div className="text-primary">
          {store.avgRating ? (
            <div className="">
              {[1, 2, 3, 4, 5].map((key) => (
                <span key={key} className="text-xl">
                  {key <= Math.floor(store.avgRating ?? 0) ? "★" : "☆"}{" "}
                </span>
              ))}
              <p className="font-semibold text-sm rating">
                ({store.avgRating})
              </p>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">
              <span data-translated>{t("notRatedYet")}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <MdDeliveryDining className="size-5 text-primary" />
          <p className="delivery-speed">
            {store.avgDeliverySpeed ? (
              <span className="delivery-speed">
                {
                  deliveryRate[
                    store.avgDeliverySpeed as unknown as keyof typeof deliveryRate
                  ]
                }
              </span>
            ) : (
              <span data-translated>{t("newStore")}</span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default StoreCard;
