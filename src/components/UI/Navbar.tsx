"use client";

import { ROUTES } from "@/src/constants/routes/routes";
import { IoChatbubblesOutline } from "react-icons/io5";
import { CiShoppingBasket } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import Link from "next/link";
import { Button } from "./Button";
import useAuthStore from "@/src/stores/authStore";
import { IoLogInOutline } from "react-icons/io5";

const navLinks = [
  {
    id: 1,
    label: "Bazaar",
    href: ROUTES.BAZAAR("near"),
    icon: <CiShoppingBasket className="size-7" />,
  },
  {
    id: 2,
    label: "Chat",
    href: ROUTES.CHAT(),
    icon: <IoChatbubblesOutline className="size-6" />,
  },
];

const Navbar = () => {
  const { user, userData, authLoading, logOut } = useAuthStore();

  const profileLink = {
    label: "Profile",
    icon: <CiUser className="size-6" />,
  };

  if (authLoading) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto bg-white py-1 border-t lg:border-t-0 lg:border-b border-gray-200 z-50">
      {/* <button onClick={() => logOut()}>Log out</button> */}
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
            {userData ? (
              <Link
                href={
                  userData.role === "customer"
                    ? ROUTES.PROFILE.USER(userData.id)
                    : ROUTES.PROFILE.STORE(userData.id)
                }
                className="flex flex-col items-center text-gray-500 hover:text-primary"
              >
                {profileLink.icon}
                <span className="text-sm mt-1">{profileLink.label}</span>
              </Link>
            ) : (
              <Link
                href={ROUTES.AUTH.LOGIN}
                className="flex flex-col items-center text-primary hover:text-primary"
              >
                <IoLogInOutline className="size-6" />
                <span className="text-sm mt-1">Log In</span>
              </Link>
            )}
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
            {userData ? (
              <Link
                href={
                  userData.role === "customer"
                    ? ROUTES.PROFILE.USER(userData.id)
                    : ROUTES.PROFILE.STORE(userData.id)
                }
                className="text-gray-900 hover:text-primary font-medium flex-col flex justify-between text-center"
              >
                <div className="w-fit mx-auto scale-110">
                  {profileLink.icon}
                </div>
                <p className="text-xs">{profileLink.label}</p>
              </Link>
            ) : (
              <Link
                className="px-5 py-2 text-sm bg-primary text-white hover:bg-primary/60 focus-visible:ring-primary inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer duration-200"
                href={ROUTES.AUTH.LOGIN}
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
