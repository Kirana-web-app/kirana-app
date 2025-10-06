"use client";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { user_profile } from "@/src/data/mockProfile";
import { Customer } from "@/src/types/user";
import CustomerProfile from "./CustomerProfile";

const UserProfilePage: FC = () => {
  const { userId } = useParams() as { userId: string };
  const router = useRouter();
  const [user, setUser] = useState<Customer>(user_profile);

  const handleBackClick = () => {
    router.back();
  };

  if (!user) {
    return <div>User not found</div>;
  }

  return <CustomerProfile handleBackClick={handleBackClick} userData={user} />;
};

export default UserProfilePage;
