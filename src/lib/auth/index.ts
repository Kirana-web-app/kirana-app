import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  deleteUser,
  User,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import {
  sendEmailVerification,
  UserCredential,
} from "firebase/auth/web-extension";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { User as UserType, UserRole, UType } from "@/src/types/user";

export const createUser = async (
  fullName: string,
  email: string,
  password: string,
  role: UserRole
): Promise<UserCredential> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userData: UserType = {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      fullName,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      defaultLanguage: "en",
      readReceipts: true,
    };

    /* TODO
    change after route of verification email to production link
    */
    await sendEmailVerification(userCredential.user, {
      url: process.env.NEXT_PUBLIC_APP_URL ?? "",
    });
    await setDoc(doc(db, "users", userCredential.user.uid), userData);

    return userCredential;
  } catch (error) {
    if (auth.currentUser) await deleteUser(auth.currentUser);
    console.error("Error creating user:", error);
    throw error;
  }
};

export const resendVerificationEmail = async (auth: Auth): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error("No user is currently signed in.");
  }

  try {
    /* TODO
    change after route of verification email to production link
    */
    await sendEmailVerification(auth.currentUser, {
      url: process.env.NEXT_PUBLIC_APP_URL ?? "",
    });
    console.log("Verification email resent successfully.");
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw error;
  }
};

export async function getUserData(
  user: User
  // role?: UserRole
): Promise<{ user: User; userData: UType }> {
  try {
    const ref = await getDoc(doc(db, "users", user.uid));
    console.log("UserData", ref.data());

    return {
      user,
      userData: ref.data() as UType,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
