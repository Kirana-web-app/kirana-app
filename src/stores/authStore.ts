// import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { create } from "zustand";
import { Customer, Store, UserRole, UType } from "../types/user";
import { auth } from "../lib/firebase";
import { createUser, getUserData } from "../lib/auth";

type State = {
  user: User | null;
  userData: UType | null;
  authLoading: boolean;
};

type Action = {
  setUser: (user: User) => void;
  setAuthLoading: (authLoading: boolean) => void;
  setUserData: (user: UType) => void;
  initAuth: () => () => void;
  signUp: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<UserCredential>;
  logIn: (
    email: string,
    password: string,
    role: UserRole
  ) => Promise<UserCredential>;
  logOut: () => Promise<void>;
};

const useAuthStore = create<State & Action>((set) => ({
  user: null,
  authLoading: false,
  userData: null,

  setUser: (user) => set(() => ({ user: user })),
  setUserData: (userData) => set(() => ({ userData: userData })),
  setAuthLoading: (authLoading) => set(() => ({ authLoading: authLoading })),

  initAuth: () => {
    set({ authLoading: true });
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Force token refresh to ensure we have the latest custom claims
          await user.getIdToken(true);

          const { userData } = await getUserData(user);

          // Set user and userData in the store
          set({ user: user, userData: userData, authLoading: false });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          set({ user: null, userData: null, authLoading: false });
        }
      } else {
        set({ user: null, userData: null, authLoading: false });
      }
    });
    return unsub;
  },
  signUp: async (fullName, email, password) => {
    set({ authLoading: true });

    try {
      const userCredential = await createUser(
        fullName,
        email,
        password,
        "user"
      );

      // Force token refresh to get updated custom claims
      //   await userCredential.user.getIdToken(true);

      const { userData } = await getUserData(userCredential.user);

      //   await signOut(auth);
      set({
        user: userCredential.user,
        userData: userData,
      });

      return userCredential;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    } finally {
      set({ authLoading: false });
    }
  },

  logIn: async (email: string, password: string, role: UserRole) => {
    set({ authLoading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Force token refresh to get updated custom claims
      //   await userCredential.user.getIdToken(true);

      const { userData } = await getUserData(userCredential.user);

      set({ user: userCredential.user, userData });

      return userCredential;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    } finally {
      set({ authLoading: false });
    }
  },
  logOut: async () => {
    set({ authLoading: true });
    try {
      await signOut(auth);
      set({ user: null, userData: null });
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    } finally {
      set({ authLoading: false });
    }
  },
}));

export default useAuthStore;
