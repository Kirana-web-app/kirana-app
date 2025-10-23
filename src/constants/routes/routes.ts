export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    SIGN_UP: "/auth/sign-up",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  SET_LANGUAGE: "/set-language",
  SET_UP_BUSINESS_PROFILE: "/set-up-business-profile",
  BAZAAR: (tab?: "near" | "saved") => `/bazaar?tab=${tab ? tab : "near"}`,
  CHAT: (userId?: string) => (userId ? `/chat?id=${userId}` : "/chat"),
  PROFILE: {
    USER: (userId: string) => `/profile/user/${userId}`,
    STORE: (storeId: string) => `/profile/store/${storeId}`,
    // EDIT: "/profile/edit",
  },
};

export const OMIT_NAVBAR_ROUTES = [
  "auth",
  "chat",
  ROUTES.SET_LANGUAGE,
  ROUTES.SET_UP_BUSINESS_PROFILE,
];
