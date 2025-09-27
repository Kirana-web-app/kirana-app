"use client";
import { useParams } from "next/navigation";
import { FC } from "react";

const ProfilePage: FC = () => {
  const { userId } = useParams() as { userId: string };

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default ProfilePage;
