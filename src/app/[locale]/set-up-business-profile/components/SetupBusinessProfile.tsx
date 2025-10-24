import { Dispatch, FC, SetStateAction, useEffect } from "react";
import SetUpBusinessProfileImg from "@/src/assets/images/set-up-business-profile.jpg";
import { Button } from "@/src/components/UI/Button";
import { ROUTES } from "@/src/constants/routes/routes";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { updateRole } from "@/src/utils/users";
import { UserRole } from "@/src/types/user";
import useAuthStore from "@/src/stores/authStore";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { useMutation } from "@tanstack/react-query";

const SetupBusinessProfile: FC<{
  setupProfile: Dispatch<SetStateAction<number>>;
}> = ({ setupProfile }) => {
  const { user, userData, authLoading, setUserData } = useAuthStore();
  const t = useTranslations("SetUpBusinessProfile");
  const router = useRouter();

  // Mutation for updating user role
  const updateRoleMutation = useMutation({
    mutationFn: (role: UserRole) => {
      if (!user) throw new Error("No user found");
      return updateRole(user.uid, role);
    },
    onSuccess: (_, role) => {
      // Update the userData in auth store with the new role
      if (userData) {
        const updatedUserData = {
          ...userData,
          role: role,
        };
        setUserData(updatedUserData);
      }

      // Navigate based on role
      if (role === "store") {
        setupProfile(1);
      } else if (role === "customer") {
        router.push(ROUTES.BAZAAR("near"));
      }
    },
    onError: (error) => {
      console.error("Error updating role:", error);
      alert("Failed to update role. Please try again.");
    },
  });

  const handleRoleUpdate = async (role: UserRole) => {
    if (!user) return;
    updateRoleMutation.mutate(role);
  };

  console.log(user, userData);

  // useEffect(() => {
  //   if (user) {
  //     router.push(ROUTES.BAZAAR);
  //   }
  // }, [user, router]);

  if (authLoading) return <LoadingSpinner heightScreen />;

  if (!user) return null;

  if (updateRoleMutation.isPending)
    return <LoadingSpinner className="" heightScreen />;

  return (
    <div className="flex flex-wrap-reverse content-end">
      <div className="flex flex-1 lg:w-[45%] flex-col justify-center px-4 py-8 sm:px-6 lg:flex-none lg:px-12">
        <div className="mx-auto w-full max-w-sm ">
          {/* text-center */}
          <div className=" flex-1 md:space-y-4 space-y-2">
            <h1 className="text-xl md:text-2xl font-semibold !text-center">
              {t("title_1")}
            </h1>
            <p className="md:text-base text-sm text-center">
              <span>{t("description")}</span>
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => handleRoleUpdate("store")}
              disabled={updateRoleMutation.isPending}
            >
              {t("yes")}
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => handleRoleUpdate("customer")}
              disabled={updateRoleMutation.isPending}
            >
              {t("no")}
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

export default SetupBusinessProfile;
