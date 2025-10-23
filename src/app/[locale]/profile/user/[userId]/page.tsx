"use client";
import { useParams, useRouter } from "next/navigation";
import { FC } from "react";
import CustomerProfile from "./CustomerProfile";
import useAuthStore from "@/src/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getCustomer } from "@/src/utils/users";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { ROUTES } from "@/src/constants/routes/routes";

const UserProfilePage: FC = () => {
  const { user, userData, authLoading } = useAuthStore();

  const { userId } = useParams() as { userId: string };
  const router = useRouter();
  // const [customer, setCustomer] = useState<Customer>(user_profile);
  const userAuthenticated = userData?.id === userId;

  const { data: customer, isLoading } = useQuery({
    queryKey: [`customer_${userId}`],
    queryFn: () => getCustomer(userId),
    staleTime: "static",
  });

  const handleBackClick = () => {
    router.push(ROUTES.BAZAAR("near"));
  };

  if (authLoading || isLoading) return <LoadingSpinner heightScreen />;

  if (!customer) {
    return <div>User not found</div>;
  }

  return (
    <CustomerProfile
      handleBackClick={handleBackClick}
      userData={customer}
      userAuthenticated={userAuthenticated}
    />
  );
};

export default UserProfilePage;
