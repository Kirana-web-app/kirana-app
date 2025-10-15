import { BusinessProfileFormData } from "../types/profileSetup";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { auth } from "../lib/firebase";
import { Customer, Review, Store, UserRole } from "../types/user";

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

export const getStores = async (): Promise<Store[] | null> => {
  const collectionRef = collection(db, "users");
  const q = query(collectionRef, where("role", "==", "store"));
  try {
    const data = await getDocs(q);

    return data.docs.map((doc) => ({
      // id: doc.id,
      ...doc.data(),
    })) as Store[];
  } catch (e) {
    console.error("Error finding stores:", e);
    return null;
  }
};

export const getStore = async (storeId: string): Promise<Store | null> => {
  if (!storeId) return null;
  try {
    const docRef = doc(db, "users", storeId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error("Store not found");
      return null;
    }
    const store = {
      id: docSnap.id,
      ...docSnap.data(),
    } as Store;

    if (store.role !== "store") return null;

    return store;
  } catch (e) {
    console.error("Error finding store:", e);
    return null;
  }
};

export const getCustomer = async (
  customerId: string
): Promise<Customer | null> => {
  console.log("getCustomer called with ID:", customerId);

  if (!customerId) return null;
  try {
    const docRef = doc(db, "users", customerId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error("Customer not found");
      return null;
    }
    const customer = {
      id: docSnap.id,
      ...docSnap.data(),
    } as Customer;

    if (customer.role !== "customer") return null;

    return customer;
  } catch (e) {
    console.error("Error finding customer:", e);
    return null;
  }
};

export const updateStore = async (
  storeId: string,
  updatedData: Partial<Omit<Store, "id" | "role" | "createdAt" | "updatedAt">>
) => {
  if (!storeId) {
    throw new Error("No store ID provided");
  }
  try {
    const storeDocRef = doc(db, "users", storeId);
    await updateDoc(storeDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating store:", error);
    throw error;
  }
};

export const updateCustomer = async (
  customerId: string,
  updatedData: Partial<
    Omit<Customer, "id" | "role" | "createdAt" | "updatedAt">
  >
) => {
  if (!customerId) {
    throw new Error("No customer ID provided");
  }
  try {
    const customerDocRef = doc(db, "users", customerId);
    await updateDoc(customerDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// adding review in a sub collection of a store doc
export const addStoreReview = async (
  storeId: string,
  reviewData: Omit<Review, "id" | "createdAt" | "updatedAt">
): Promise<void> => {
  if (!storeId) {
    throw new Error("No store ID provided");
  }
  try {
    const storeDocRef = doc(db, "users", storeId);
    const storeDoc = await getDoc(storeDocRef);
    if (!storeDoc.exists()) {
      throw new Error("Store not found");
    }
    const reviewsCollectionRef = collection(storeDocRef, "reviews");
    await setDoc(doc(reviewsCollectionRef), {
      ...reviewData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Review added successfully");

    // Update store's avgRating and avgDeliverySpeed
    await calcAvgs(storeId);
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const getStoreReviews = async (
  storeId: string
): Promise<Review[] | null> => {
  if (!storeId) return null;
  try {
    const storeDocRef = doc(db, "users", storeId);
    const reviewsCollectionRef = collection(storeDocRef, "reviews");
    const reviewsSnapshot = await getDocs(reviewsCollectionRef);
    const reviews = reviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
};

export const deleteStoreReview = async (
  storeId: string,
  reviewId: string
): Promise<void> => {
  if (!storeId || !reviewId) {
    throw new Error("Store ID and Review ID must be provided");
  }
  try {
    const storeDocRef = doc(db, "users", storeId);
    const reviewsCollectionRef = collection(storeDocRef, "reviews");
    const reviewDocRef = doc(reviewsCollectionRef, reviewId);
    await deleteDoc(reviewDocRef);
    console.log("Review deleted successfully");

    // Update store's avgRating and avgDeliverySpeed after deletion
    await calcAvgs(storeId);
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

export const updateStoreReview = async (
  storeId: string,
  reviewId: string,
  updatedData: Partial<
    Omit<Review, "id" | "createdAt" | "updatedAt" | "userId" | "userName">
  >
): Promise<void> => {
  if (!storeId || !reviewId) {
    throw new Error("Store ID and Review ID must be provided");
  }
  try {
    const storeDocRef = doc(db, "users", storeId);
    const reviewsCollectionRef = collection(storeDocRef, "reviews");
    const reviewDocRef = doc(reviewsCollectionRef, reviewId);

    await updateDoc(reviewDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });

    console.log("Review updated successfully");

    // Update store's avgRating and avgDeliverySpeed after update
    await calcAvgs(storeId);
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

const calcAvgs = async (storeId: string) => {
  try {
    const reviews = await getStoreReviews(storeId);
    if (!reviews || reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = (totalRating / reviews.length).toFixed(1);

    const totalDeliverySpeed = reviews.reduce((sum, review) => {
      if (review.deliverySpeed) {
        return sum + parseInt(`${review.deliverySpeed}`);
      }
      return sum;
    }, 0);
    const avgDeliverySpeed = Math.round(totalDeliverySpeed / reviews.length);

    const storeDocRef = doc(db, "users", storeId);
    await updateDoc(storeDocRef, {
      avgRating,
      avgDeliverySpeed,
    });
  } catch (error) {
    console.error("Error calculating averages:", error);
  }
};
