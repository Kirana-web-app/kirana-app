// hook to redirect user to page if authenticated

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes/routes";
import useAuthStore from "@/src/stores/authStore";

const useAuthRedirect = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(ROUTES.BAZAAR);
    }
  }, [user, router]);
};
export default useAuthRedirect;
