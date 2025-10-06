"use client";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { store_profile } from "@/src/data/mockProfile";
import { Store } from "@/src/types/user";
import StoreProfile from "./StoreProfile";

const StoreProfilePage: FC = () => {
  const { storeId } = useParams() as { storeId: string };
  const router = useRouter();
  const [store, setStore] = useState<Store>(store_profile);

  const handleBackClick = () => {
    router.back();
  };

  if (!store) {
    return <div>Store not found</div>;
  }

  return <StoreProfile handleBackClick={handleBackClick} userData={store} />;
};

export default StoreProfilePage;
