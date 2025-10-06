"use client";
import Navbar from "../UI/Navbar";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { OMIT_NAVBAR_ROUTES } from "@/src/constants/routes/routes";

const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const l = useTranslations("locale");

  const hideNavbar =
    OMIT_NAVBAR_ROUTES.some((route) => pathname.includes(route)) ||
    pathname === `/${l("locale")}`;

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? "" : "pb-16 lg:pb-0 lg:pt-16"}>
        {children}
      </div>
    </div>
  );
};

export default NavbarLayout;
