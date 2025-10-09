import { FieldValue, Timestamp } from "firebase/firestore";
import { Store } from "../types/user";

export const store: Store[] = [
  {
    id: "1",
    storeName: "John's Electronics Malang",
    fullName: "John Doe",
    email: "john@example.com",
    role: "store",
    defaultLanguage: "en",
    readReceipts: true,
    type: "Electronics & mobile shops",
    profileImage:
      "https://kirana-app-nine.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fset-up-business-profile.eb7ec835.jpg&w=1200&q=75",
    rating: 3.5,
    deliverySpeed: "Average",
    address: {
      country: "Pakistan",
      city: "Karachi",
      addressLine: "North Nazimabad, Block J, Street 12, Near Majid-e-Ashraf",
    },
    reviews: [
      {
        id: "r1",
        userId: "1",
        userName: "Alice",
        rating: 4,
        comment:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo nec lectus porta aliquet. Suspendisse consectetur tincidunt urna.",
        date: "2023-01-01",
      },
      {
        id: "r2",
        userId: "2",
        userName: "Bob",
        rating: 5,
        comment: "Highly recommend!",
        date: "2023-01-02",
      },
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: "2",
    storeName: "Fresh Mart",
    fullName: "Ali bhai",
    email: "fresh@example.com",
    type: "Catering services",
    role: "store",
    defaultLanguage: "en",
    readReceipts: true,
    profileImage:
      "https://kirana-app-nine.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fset-up-business-profile.eb7ec835.jpg&w=1200&q=75",
    address: {
      country: "Pakistan",
      city: "Karachi",
      addressLine: "North Nazimabad, Block J, Street 12, Near Majid-e-Ashraf",
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: "3",
    fullName: "Ramish Khan",
    email: "style@example.com",
    role: "store",
    defaultLanguage: "en",
    readReceipts: true,
    type: "Tailors & fashion designers",
    profileImage:
      "https://kirana-app-nine.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fset-up-business-profile.eb7ec835.jpg&w=1200&q=75",
    rating: 4.5,
    deliverySpeed: "Slow",
    address: {
      country: "Pakistan",
      city: "Karachi",
      addressLine: "North Nazimabad, Block J, Street 12, Near Majid-e-Ashraf",
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];
