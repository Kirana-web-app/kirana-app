"use client";

import { ROUTES } from "@/src/constants/routes/routes";
import { IoChatbubblesOutline } from "react-icons/io5";
import { CiShoppingBasket } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import Link from "next/link";
import { Button } from "./Button";
import useAuthStore from "@/src/stores/authStore";

const navLinks = [
  {
    id: 1,
    label: "Bazaar",
    href: ROUTES.BAZAAR,
    icon: <CiShoppingBasket className="size-7" />,
  },
  {
    id: 2,
    label: "Chat",
    href: ROUTES.CHAT,
    icon: <IoChatbubblesOutline className="size-6" />,
  },
];

const profileLink = {
  label: "Profile",
  href: ROUTES.PROFILE.USER("user123"), // Default to user profile, can be dynamic later
  icon: <CiUser className="size-6" />,
};

const Navbar = () => {
  const { user, authLoading } = useAuthStore();

  if (authLoading) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto bg-white py-1 border-t lg:border-t-0 lg:border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center  lg:justify-between items-center h-16">
          {/* Mobile/Tablet Navigation - Bottom */}
          <div className="flex px-12 w-full lg:hidden items-center justify-between space-x-8">
            {navLinks.map((nav) => (
              <Link
                key={nav.id}
                href={nav.href}
                className="flex flex-col items-center text-gray-500 hover:text-primary"
              >
                {nav.icon}
                <span className="text-sm mt-1">{nav.label}</span>
              </Link>
            ))}
            <Link
              href={profileLink.href}
              className="flex flex-col items-center text-gray-500 hover:text-primary"
            >
              {profileLink.icon}
              <span className="text-sm mt-1">{profileLink.label}</span>
            </Link>
          </div>

          {/* Desktop Navigation - Top */}
          <div className="hidden w-full lg:flex lg:items-center lg:space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-serif text-primary">Kirana</h1>
            </div>
            <div className="mx-auto flex gap-10">
              {navLinks.map((nav) => (
                <Link
                  key={nav.id}
                  href={nav.href}
                  className="text-gray-900 hover:text-primary font-medium flex-col flex justify-between text-center"
                >
                  <div className="w-fit mx-auto scale-110">{nav.icon}</div>
                  <p className="text-xs">{nav.label}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:space-x-4 shrink-0">
            {user ? (
              <Link
                href={profileLink.href}
                className="text-gray-900 hover:text-primary font-medium flex-col flex justify-between text-center"
              >
                <div className="w-fit mx-auto scale-110">
                  {profileLink.icon}
                </div>
                <p className="text-xs">{profileLink.label}</p>
              </Link>
            ) : (
              <Button size="padding_0" className="py-2 px-6">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
