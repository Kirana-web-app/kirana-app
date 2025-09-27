export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
}

export interface Store extends User {
  storeName?: string;
  type: string;
  rating?: number;
  deliverySpeed?: string;
  address: Address;
}

export interface Address {
  country: string;
  city: string;
  addressLine: string;
  location?: { latitude: number; longitude: number };
}
