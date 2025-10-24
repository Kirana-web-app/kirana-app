import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import Navbar from "@/src/components/UI/Navbar";
import NavbarLayout from "@/src/components/layout/NavbarLayout";
import InitAuth from "@/src/components/auth/InitAuth";
import { ReactQueryClientProvider } from "@/src/components/auth/react-query/ReactQueryClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kirana",
  description: "Your one-stop shop for all your daily needs.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <ReactQueryClientProvider>
      <html lang={locale} className="h-full" data-locale={locale}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
        >
          <InitAuth />

          <NextIntlClientProvider messages={messages}>
            <NavbarLayout>{children}</NavbarLayout>
          </NextIntlClientProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
