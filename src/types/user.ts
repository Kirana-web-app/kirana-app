import { FieldValue, Timestamp } from "firebase/firestore";

export type UserRole = "user" | "customer" | "store";

export type UType = Store | Customer;

export interface DeliverySpeed {
  deliverySpeed: "1" | "2" | "3" | "4" | "5" | null; // 1 to 5
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  deliverySpeed?: DeliverySpeed | null;
  createdAt: FieldValue | Timestamp;
  updatedAt: FieldValue | Timestamp;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
  role: UserRole;
  defaultLanguage: "en" | "ur";
  readReceipts: boolean;
  createdAt: FieldValue | Timestamp;
  updatedAt: FieldValue | Timestamp;
  profileCreated?: boolean;
}

export interface Store extends User {
  ownerName: string;
  storeName?: string | null;
  type: string;
  avgRating?: number;
  avgDeliverySpeed?: DeliverySpeed | null;
  address: Address;
  reviews?: Review[];
}

export interface Customer extends User {
  savedStores: string[]; // Array of Store IDs
  location?: Location;
}

export interface Address {
  country: string;
  city: string;
  addressLine: string;
  location?: Location | null;
}
