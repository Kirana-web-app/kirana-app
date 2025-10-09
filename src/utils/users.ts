import { BusinessProfileFormData } from "../types/profileSetup";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { auth } from "../lib/firebase";
import { Store, UserRole } from "../types/user";

export const createStoreProfile = async (
  userId: string,
  data: BusinessProfileFormData
) => {
  if (!userId) {
    throw new Error("No user found");
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data();

    // Create the store profile data combining user data with business profile data
    const storeProfileData = {
      // Keep existing user data
      ...userData,
      // Update role to store
      role: "store" as const,

      // Add business profile data
      ownerName: data.ownerName,
      type: data.businessType,
      address: {
        country: data.location.country,
        city: data.location.city,
        addressLine: data.location.address,
        location: null,
      },
      storeName: data.storeName || null,
      //   businessProfileImage: data.businessProfileImage || null,
      profileImage: null,

      // Add store-specific fields
      profileCreated: true,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userDocRef, storeProfileData);

    console.log("Successfully created store profile");
  } catch (error) {
    console.error("Error creating store profile:", error);
    throw error;
  }
};

export const updateRole = async (userId: string, newRole: UserRole) => {
  try {
    // Get the current user data from the existing collection
    const currentDocRef = doc(db, "users", userId);

    const currentDoc = await getDoc(currentDocRef);

    if (!currentDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = currentDoc.data();

    const updatedUserData = {
      ...userData,
      role: newRole,
    };

    await setDoc(currentDocRef, updatedUserData);

    console.log(`Successfully updated user role to ${newRole}`);
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};
