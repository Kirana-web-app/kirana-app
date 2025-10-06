import { FC } from "react";
import SetUpBusinessProfileImg from "@/src/assets/images/set-up-business-profile.jpg";
import Image from "next/image";
import { MdDeliveryDining } from "react-icons/md";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { Store } from "@/src/types/user";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes/routes";

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
  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(store.id);
  };

  return (
    <Link href={ROUTES.PROFILE.STORE(store.id)} className="">
      <div className="relative rounded-xl overflow-hidden">
        <Image
          src={store.profileImage}
          alt={"store img"}
          className="w-full h-56 object-cover"
          width={400}
          height={128}
        />
        {/* Save/Unsave Button */}
        <button
          onClick={handleToggleSave}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
        >
          {isSaved ? (
            <IoHeart className="w-5 h-5 text-primary" />
          ) : (
            <IoHeartOutline className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      <div className="py-4 px-2">
        <h3 className="text-lg font-semibold line-clamp-2 mb-1">
          {store.name}
        </h3>
        <p className="text-gray-600 text-sm">{store.type}</p>
        <div className="text-primary">
          {store.rating ? (
            <div className="">
              {[1, 2, 3, 4, 5].map((key) => (
                <span key={key} className="text-xl">
                  {key <= Math.floor(store.rating ?? 0) ? "★" : "☆"}{" "}
                </span>
              ))}
              <p className="font-semibold text-sm">({store.rating})</p>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Not rated yet</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <MdDeliveryDining className="size-5 text-primary" />
          <p className="">{store.deliverySpeed ?? "New store"}</p>
        </div>
      </div>
    </Link>
  );
};
export default StoreCard;
