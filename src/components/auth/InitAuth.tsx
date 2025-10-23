"use client";

import { ROUTES } from "@/src/constants/routes/routes";
import useAuthStore from "@/src/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const routes = ["auth"];

export default function InitAuth() {
  const { initAuth, user } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();

  const redirectUser = routes.some((route) => pathname.includes(route));

  useEffect(() => {
    const unsub = initAuth();
    return () => unsub();
  }, []);

  useEffect(() => {
    console.log("Auth initialized, current user:", user);

    if (user && redirectUser) {
      router.push(ROUTES.BAZAAR("near"));
    }
  }, [user]);

  return null;
}
