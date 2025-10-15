"use client";
import { useParams, useRouter } from "next/navigation";
import { FC } from "react";
import StoreProfile from "./StoreProfile";
import useAuthStore from "@/src/stores/authStore";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { getStore } from "@/src/utils/users";
import { ROUTES } from "@/src/constants/routes/routes";

const StoreProfilePage: FC = () => {
  const { userData, authLoading } = useAuthStore();
  const { storeId } = useParams() as { storeId: string };

  const router = useRouter();
  // const [store, setStore] = useState<Store | null>(userData as Store);
  const userAuthenticated = userData?.id === storeId;

  const { data: store, isLoading } = useQuery({
    queryKey: [`store_${storeId}`],
    queryFn: () => getStore(storeId),
    staleTime: "static",
  });

  const handleBackClick = () => {
    router.push(ROUTES.BAZAAR);
  };

  if (authLoading || isLoading) return <LoadingSpinner heightScreen />;

  if (!store) {
    return <div>Store not found</div>;
  }

  return (
    <StoreProfile
      handleBackClick={handleBackClick}
      storeData={store}
      userAuthenticated={userAuthenticated}
    />
  );
};

export default StoreProfilePage;
