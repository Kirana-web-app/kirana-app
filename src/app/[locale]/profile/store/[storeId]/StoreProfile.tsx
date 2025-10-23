import { Button } from "@/src/components/UI/Button";
import Toggle from "@/src/components/UI/Toogle";
import CustomSelect from "@/src/components/UI/CustomSelect";
import { Input } from "@/src/components/UI/Input";
import ComboboxDropDown from "@/src/components/UI/ComboBox";
import { ROUTES } from "@/src/constants/routes/routes";
import { Store } from "@/src/types/user";
import {
  businessTypesEnglish,
  businessTypesUrdu,
} from "@/src/data/businessTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FC, useState, useRef } from "react";
import { GoBookmark } from "react-icons/go";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import {
  MdOutlineArrowBackIosNew,
  MdEdit,
  MdSave,
  MdCancel,
  MdCameraAlt,
} from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { Timestamp } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStoreReviews, updateStore } from "@/src/utils/users";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { deliveryRate } from "@/src/constants/deliverySpeeds";
import GiveReview from "./GiveReview";
import Review from "./Review";
import useAuthStore from "@/src/stores/authStore";
import { createNewChat } from "@/src/utils/chat";
import {
  compressImage,
  COMPRESSION_PRESETS,
  formatFileSize,
  CompressionResult,
} from "@/src/utils/imageCompressor";

const StoreProfile: FC<{
  storeData: Store;
  handleBackClick: () => void;
  userAuthenticated: boolean;
}> = ({ storeData, handleBackClick, userAuthenticated }) => {
  const { user, userData, logOut, setUserData } = useAuthStore();
  const queryClient = useQueryClient();

  const [store, setStore] = useState(storeData);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [togglingReadReceipts, setTogglingReadReceipts] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [editedStoreName, setEditedStoreName] = useState(
    storeData.storeName || ""
  );
  const [editedOwnerName, setEditedOwnerName] = useState(storeData.ownerName);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(
    storeData.phoneNumber || ""
  );
  const [editedStoreType, setEditedStoreType] = useState(storeData.type);
  const [editedAddress, setEditedAddress] = useState(
    storeData.address.addressLine
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [compressedImageData, setCompressedImageData] = useState<string | null>(
    null
  );
  const [compressionInfo, setCompressionInfo] =
    useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations("StoreProfile");
  const l = useTranslations("locale");

  const {
    data: reviews,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: [`reviews_${store.id}`],
    queryFn: () => getStoreReviews(store.id),
    staleTime: "static",
  });

  // Mutation for updating store profile
  const updateStoreMutation = useMutation({
    mutationFn: (updateData: Partial<Store>) =>
      updateStore(store.id, updateData),
    onSuccess: (_, variables) => {
      // Update the store query cache
      queryClient.setQueryData(
        [`store_${store.id}`],
        (oldData: Store | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, ...variables };
        }
      );

      // Update local state
      setStore((prev) => ({ ...prev, ...variables }));

      // IMPORTANT: Update authStore if this is the authenticated user
      if (userAuthenticated) {
        setUserData({ ...store, ...variables } as Store);
      }

      // Invalidate any queries that might display store info (like bazaar, chats, reviews, etc.)
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => {
      console.error("Error updating store profile:", error);
      alert("Failed to update store profile. Please try again.");
    },
  });

  const languageOptions = [
    {
      value: "en",
      label: t("english"),
      onClick: async () => {
        try {
          await updateStoreMutation.mutateAsync({ defaultLanguage: "en" });
          router.push(`/en${ROUTES.PROFILE.STORE(store.id)}`);
        } catch (error) {
          console.error("Error updating language:", error);
        }
      },
    },
    {
      value: "ur",
      label: t("urdu"),
      onClick: async () => {
        try {
          await updateStoreMutation.mutateAsync({ defaultLanguage: "ur" });
          router.push(`/ur${ROUTES.PROFILE.STORE(store.id)}`);
        } catch (error) {
          console.error("Error updating language:", error);
        }
      },
    },
  ];

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedStoreName(store.storeName || "");
    setEditedOwnerName(store.ownerName);
    setEditedPhoneNumber(store.phoneNumber || "");
    setEditedStoreType(store.type);
    setEditedAddress(store.address.addressLine);
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setCompressedImageData(null);
    setCompressionInfo(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedStoreName(store.storeName || "");
    setEditedOwnerName(store.ownerName);
    setEditedPhoneNumber(store.phoneNumber || "");
    setEditedStoreType(store.type);
    setEditedAddress(store.address.addressLine);
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setCompressedImageData(null);
    setCompressionInfo(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      alert("Please select an image smaller than 10MB");
      return;
    }

    setProfileImageFile(file);
    setIsCompressing(true);

    try {
      // Create preview for immediate display
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Compress image for Firestore storage
      const compressionResult = await compressImage(
        file,
        COMPRESSION_PRESETS.SMALL
      );

      setCompressedImageData(compressionResult.compressedImage);
      setCompressionInfo(compressionResult);

      console.log("Image compressed successfully:", {
        originalSize: formatFileSize(compressionResult.originalSize),
        compressedSize: formatFileSize(compressionResult.compressedSize),
        compressionRatio: `${compressionResult.compressionRatio.toFixed(1)}%`,
      });
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Failed to process image. Please try a different image.");
      setProfileImageFile(null);
      setProfileImagePreview(null);
      setCompressedImageData(null);
      setCompressionInfo(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editedOwnerName.trim()) {
      alert("Owner name is required");
      return;
    }

    if (!editedStoreType.trim()) {
      alert("Store type is required");
      return;
    }

    if (!editedAddress.trim()) {
      alert("Address is required");
      return;
    }

    // Basic phone number validation (optional field)
    if (editedPhoneNumber.trim() && editedPhoneNumber.trim().length < 10) {
      alert("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    setIsSaving(true);
    try {
      const updateData: Partial<Store> = {
        ownerName: editedOwnerName.trim(),
        storeName: editedStoreName.trim() || null,
        phoneNumber: editedPhoneNumber.trim() || null,
        type: editedStoreType.trim(),
        address: {
          ...store.address,
          addressLine: editedAddress.trim(),
        },
      };

      // Save compressed image to Firestore
      if (compressedImageData) {
        updateData.profileImage = compressedImageData;
        console.log("Saving compressed image to Firestore:", {
          size: formatFileSize(compressionInfo?.compressedSize || 0),
          compression: `${compressionInfo?.compressionRatio.toFixed(1)}%`,
        });
      }

      // Use mutation instead of direct update
      await updateStoreMutation.mutateAsync(updateData);

      setIsEditing(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
      setCompressedImageData(null);
      setCompressionInfo(null);

      console.log("Store profile updated successfully");
    } catch (error) {
      console.error("Error updating store profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logOut();
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error) {
      console.error("Error during logout:", error);
      setLoggingOut(false);
    }
  };

  const handleNewChat = async () => {
    if (!userData) return;

    setCreatingChat(true);
    try {
      if (userData.userChatList?.includes(store.id)) {
        router.push(ROUTES.CHAT(store.id));
      } else {
        await createNewChat(
          {
            id: userData.id,
            name: userData.fullName,
            avatar: userData.profileImage || "",
          },
          {
            id: store.id,
            name: store.storeName || store.ownerName,
            avatar: store.profileImage || "",
          }
        );
        router.push(ROUTES.CHAT(store.id));
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setCreatingChat(false);
    }
  };

  if (loggingOut) return <LoadingSpinner heightScreen />;

  return (
    <div className="pb-6">
      <div className="mx-auto max-w-4xl">
        <div className="">
          <div className="w-full">
            <div className="relative">
              <div className="h-[360px] w-full relative">
                <div className="bg-linear-0 from-black/70 to-black/0 absolute inset-0"></div>
                {(profileImagePreview || store.profileImage) && (
                  <Image
                    src={profileImagePreview || store.profileImage!}
                    alt={`${
                      store.storeName ?? store.ownerName
                    }'s profile picture`}
                    className="w-full h-full object-cover"
                    width={576}
                    height={576}
                  />
                )}
                {isEditing && userAuthenticated && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isCompressing}
                      className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCompressing ? (
                        <LoadingSpinner className="size-6" />
                      ) : (
                        <MdCameraAlt className="size-6" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                )}
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
              <div className="absolute top-6 right-4">
                {isEditing ? (
                  <ComboboxDropDown
                    value={editedStoreType}
                    onChange={(value) => value && setEditedStoreType(value)}
                    placeholder="Store Type"
                    options={
                      l("locale") === "ur"
                        ? businessTypesUrdu
                        : businessTypesEnglish
                    }
                  />
                ) : (
                  <div className=" text-primary font-medium bg-primary-lightest px-3 py-1 rounded-full">
                    {store.type}
                  </div>
                )}
              </div>
              <div className="absolute bottom-6 left-6 text-white space-y-1 w-80">
                {isEditing && userAuthenticated ? (
                  <div className="space-y-1 ">
                    <Input
                      label="Store Name"
                      value={editedStoreName}
                      onChange={(e) => setEditedStoreName(e.target.value)}
                      placeholder="Store Name"
                      className="!p-2 bg-white/70 border-white/30 placeholder-black/70"
                    />
                    <Input
                      value={editedOwnerName}
                      onChange={(e) => setEditedOwnerName(e.target.value)}
                      label="Owner Name"
                      placeholder="Owner Name"
                      className="!p-2 bg-white/70 border-white/30 placeholder-black/70"
                    />
                    <Input
                      value={editedPhoneNumber}
                      onChange={(e) => setEditedPhoneNumber(e.target.value)}
                      placeholder="Phone Number"
                      label="Phone Number"
                      type="tel"
                      className="!p-2 bg-white/70 border-white/30 placeholder-black/70"
                    />
                    <p className="text-white/80 text-sm">{store.email}</p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-bold text-2xl store-name">
                      {store.storeName ?? store.ownerName}
                    </h2>
                    <div className="">
                      <p className="dynamic-content">
                        Owned By <strong>{store.ownerName}</strong>
                      </p>
                      <p className="user-email">{store.email}</p>
                      {store.phoneNumber && (
                        <p className="user-email">{store.phoneNumber}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="px-4 space-y-6 py-6">
              <div className="">
                {userAuthenticated ? (
                  isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2"
                      >
                        <MdCancel className="size-4" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={handleEditClick}
                      className="flex items-center justify-center gap-2"
                    >
                      <MdEdit className="size-4" />
                      {t("editProfile")}
                    </Button>
                  )
                ) : (
                  <Button
                    disabled={creatingChat}
                    variant="secondary"
                    fullWidth
                    onClick={handleNewChat}
                  >
                    {creatingChat ? (
                      <>
                        {t("creatingChat")}
                        <LoadingSpinner className="size-5 mx-4" />
                      </>
                    ) : (
                      t("chatWithSeller")
                    )}
                  </Button>
                )}
              </div>
              <div className="">
                {store.avgRating && (
                  <div className="flex gap-20 items-center justify-between py-6 border-b border-gray-200">
                    <p className="font-medium text-lg">{t("storeRating")}</p>
                    <div className="text-primary flex items-center gap-2 font-semibold text-lg rating">
                      {store.avgRating}
                      <div className="">
                        {[1, 2, 3, 4, 5].map((key) => (
                          <span key={key} className="text-xl">
                            {key <= Math.floor(store.avgRating ?? 0)
                              ? "★"
                              : "☆"}{" "}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {store.avgDeliverySpeed && (
                  <div className="flex gap-20 items-center justify-between py-6 border-b border-gray-200">
                    <p className="font-medium text-lg">{t("deliveryRate")}</p>

                    <div className="text-primary flex items-center gap-2 font-semibold text-lg dynamic-content">
                      {
                        deliveryRate[
                          `${
                            Math.round(
                              +store.avgDeliverySpeed
                            ) as unknown as keyof typeof deliveryRate
                          }`
                        ]
                      }
                    </div>
                  </div>
                )}
                <div className="flex gap-20 items-center justify-between py-6 border-b border-gray-200">
                  <p className="font-medium text-lg">{t("address")}</p>
                  <div className="text-primary flex items-center gap-2 font-semibold text-lg address-line">
                    {isEditing && userAuthenticated ? (
                      <Input
                        value={editedAddress}
                        onChange={(e) => setEditedAddress(e.target.value)}
                        placeholder="Store Address"
                        className="text-right min-w-[200px]"
                      />
                    ) : (
                      store.address.addressLine
                    )}
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
            {!userAuthenticated && user && (
              <div className="py-4">
                {!showReviewForm ? (
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowReviewForm(true)}
                  >
                    <span data-translated>{t("giveReview")}</span>
                  </Button>
                ) : (
                  <div className="space-y-1">
                    <GiveReview
                      storeId={store.id}
                      closeEditor={() => setShowReviewForm(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {reviewsLoading ? (
              <LoadingSpinner />
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <Review
                  key={review.id}
                  review={review}
                  storeId={store.id}
                  onReviewUpdated={refetchReviews}
                />
              ))
            ) : (
              <p className="text-gray-600">{t("noReviews")}</p>
            )}
          </div>
        </div>
      </div>
      {userAuthenticated && (
        <>
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
                    value={store.defaultLanguage}
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
                    isLoading={togglingReadReceipts}
                    onChange={async () => {
                      setTogglingReadReceipts(true);
                      try {
                        await updateStoreMutation.mutateAsync({
                          readReceipts: !store.readReceipts,
                        });
                      } catch (error) {
                        console.error("Error toggling read receipts:", error);
                      } finally {
                        setTogglingReadReceipts(false);
                      }
                    }}
                    checked={store.readReceipts}
                  />
                </div>
                <div className="">
                  <Button
                    fullWidth
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    {t("logOut")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StoreProfile;
