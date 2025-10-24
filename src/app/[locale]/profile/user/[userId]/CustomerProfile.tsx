import { Button } from "@/src/components/UI/Button";
import Toggle from "@/src/components/UI/Toogle";
import CustomSelect from "@/src/components/UI/CustomSelect";
import { Input } from "@/src/components/UI/Input";
import { ROUTES } from "@/src/constants/routes/routes";
import { Customer } from "@/src/types/user";
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
import useAuthStore from "@/src/stores/authStore";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import Link from "next/link";
import { updateCustomer } from "@/src/utils/users";
import {
  compressImage,
  COMPRESSION_PRESETS,
  formatFileSize,
  CompressionResult,
} from "@/src/utils/imageCompressor";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CustomerProfile: FC<{
  userData: Customer;
  handleBackClick: () => void;
  userAuthenticated: boolean;
}> = ({ userData, handleBackClick, userAuthenticated }) => {
  const { logOut, authLoading, setUserData } = useAuthStore();
  const queryClient = useQueryClient();

  const [user, setUser] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingReadReceipts, setTogglingReadReceipts] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);
  const [editedFullName, setEditedFullName] = useState(userData.fullName);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(
    userData.phoneNumber || ""
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
  const t = useTranslations("CustomerProfile");

  // Mutation for updating customer profile
  const updateCustomerMutation = useMutation({
    mutationFn: (updateData: Partial<Customer>) =>
      updateCustomer(user.id, updateData),
    onSuccess: (_, variables) => {
      // Update the customer query cache
      queryClient.setQueryData(
        [`customer_${user.id}`],
        (oldData: Customer | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, ...variables };
        }
      );

      // Update local state
      setUser((prev) => ({ ...prev, ...variables }));

      // IMPORTANT: Update authStore if this is the authenticated user
      if (userAuthenticated) {
        setUserData({ ...user, ...variables } as Customer);
      }

      // Invalidate any queries that might display user info (like chats, reviews, etc.)
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
    onError: (error) => {
      console.error("Error updating customer profile:", error);
      alert("Failed to update profile. Please try again.");
    },
  });

  const languageOptions = [
    {
      value: "en",
      label: t("english"),
      onClick: async () => {
        try {
          await updateCustomerMutation.mutateAsync({ defaultLanguage: "en" });
          router.push(`/en${ROUTES.PROFILE.USER(user.id)}`);
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
          await updateCustomerMutation.mutateAsync({ defaultLanguage: "ur" });
          router.push(`/ur${ROUTES.PROFILE.USER(user.id)}`);
        } catch (error) {
          console.error("Error updating language:", error);
        }
      },
    },
  ];

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedFullName(user.fullName);
    setEditedPhoneNumber(user.phoneNumber || "");
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setCompressedImageData(null);
    setCompressionInfo(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedFullName(user.fullName);
    setEditedPhoneNumber(user.phoneNumber || "");
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
        COMPRESSION_PRESETS.PROFILE
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
    if (!editedFullName.trim()) {
      alert("Full name is required");
      return;
    }

    // Basic phone number validation (optional field)
    if (editedPhoneNumber.trim() && editedPhoneNumber.trim().length < 10) {
      alert("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    setIsSaving(true);
    try {
      const updateData: Partial<Customer> = {
        fullName: editedFullName.trim(),
        phoneNumber: editedPhoneNumber.trim() || null,
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
      await updateCustomerMutation.mutateAsync(updateData);

      setIsEditing(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
      setCompressedImageData(null);
      setCompressionInfo(null);

      // Success feedback
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogOut = async () => {
    setLoggingOut(true);

    try {
      await logOut();
      router.push("/en/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setLoggingOut(false);
    }
  };

  if (authLoading) return <LoadingSpinner className="mt-80" />;

  if (loggingOut) return <LoadingSpinner heightScreen />;

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
              <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden">
                {(profileImagePreview || user.profileImage) && (
                  <Image
                    src={profileImagePreview || user.profileImage!}
                    alt={`${user.fullName}'s profile picture`}
                    className="rounded-full w-full h-full object-cover "
                    width={64}
                    height={64}
                  />
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isCompressing}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCompressing ? (
                        <LoadingSpinner className="size-6 text-white" />
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
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editedFullName}
                      onChange={(e) => setEditedFullName(e.target.value)}
                      placeholder="Full Name"
                      className="text-xl font-bold"
                    />
                    <Input
                      value={editedPhoneNumber}
                      onChange={(e) => setEditedPhoneNumber(e.target.value)}
                      placeholder="Phone Number"
                      type="tel"
                    />
                    <p className="user-email text-gray-500">{user.email}</p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-bold text-2xl user-name">
                      {user.fullName}
                    </h2>
                    <p className="user-email">{user.email}</p>
                    {user.phoneNumber && (
                      <p className="user-email">{user.phoneNumber}</p>
                    )}
                  </>
                )}
              </div>
            </div>
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
                <Button variant="secondary" fullWidth>
                  {t("chatWithCustomer")}
                </Button>
              )}
            </div>
            {userAuthenticated && (
              <Link
                href={ROUTES.BAZAAR("saved")}
                className="flex hover:bg-gray-50 px-4 rounded-xl items-center justify-between py-6"
              >
                <div className="flex items-center gap-3">
                  <GoBookmark className="size-6" />
                  <p className="font-medium">{t("saved")}</p>
                </div>
                <div className="rotate-180">
                  <MdOutlineArrowBackIosNew />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      {userAuthenticated && (
        <>
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
                    isLoading={togglingReadReceipts}
                    onChange={async () => {
                      setTogglingReadReceipts(true);
                      try {
                        await updateCustomerMutation.mutateAsync({
                          readReceipts: !user.readReceipts,
                        });
                      } catch (error) {
                        console.error("Error toggling read receipts:", error);
                      } finally {
                        setTogglingReadReceipts(false);
                      }
                    }}
                    checked={user.readReceipts}
                  />
                </div>
                <div className="">
                  <Button
                    fullWidth
                    variant="destructive"
                    onClick={handleLogOut}
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

export default CustomerProfile;
