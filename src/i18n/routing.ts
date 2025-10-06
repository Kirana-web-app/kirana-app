import { defineRouting } from "next-intl/routing";
import { user_profile } from "../data/mockProfile";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ur"],

  // Used when no locale matches
  defaultLocale: "en",
});
