"use client";

import useAuthStore from "@/src/stores/authStore";
import { useEffect } from "react";

export default function InitAuth() {
  const { initAuth } = useAuthStore();
  useEffect(() => {
    const unsub = initAuth();
    return () => unsub();
  }, []);
  return null;
}
