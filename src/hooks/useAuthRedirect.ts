// hook to redirect user to page if authenticated

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes/routes";
import useAuthStore from "@/src/stores/authStore";

const useAuthRedirect = () => {
  const { userData } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!userData) return;

    if (
      (userData.role === "store" && !userData.profileCreated) ||
      userData.role === "user"
    ) {
      router.push(ROUTES.SET_UP_BUSINESS_PROFILE);
      return;
    }

    if (userData.role === "customer" || userData.role === "store") {
      router.push(ROUTES.BAZAAR);
      return;
    }
  }, [userData, router]);
};
export default useAuthRedirect;
