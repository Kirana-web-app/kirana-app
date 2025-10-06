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
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  role: "customer" | "store";
  defaultLanguage: string;
  readReceipts: boolean;
}

export interface Store extends User {
  storeName?: string;

  type: string;
  rating?: number;
  deliverySpeed?: string;
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
  location?: Location;
}
