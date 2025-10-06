import { Customer, Store } from "../types/user";

export const user_profile: Customer = {
  id: "user_12345",
  name: "Anwar",
  role: "customer",
  email: "anwar@nucleus-ui.com",
  profileImage:
    "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
  savedStores: ["store_123", "store_456", "store_789"],
  defaultLanguage: "ur",
  readReceipts: true,
  location: { latitude: 24.8607, longitude: 67.0011 },
};

export const store_profile: Store = {
  id: "1",
  name: "John's Electronics Malang",
  email: "john@example.com",
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
  role: "store",
  defaultLanguage: "en",
  readReceipts: true,
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
};
