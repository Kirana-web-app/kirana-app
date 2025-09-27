import { Store } from "../types/user";

export const store: Store[] = [
  {
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
  },
  {
    id: "2",
    name: "Fresh Mart",
    email: "fresh@example.com",
    type: "Catering services",
    profileImage:
      "https://kirana-app-nine.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fset-up-business-profile.eb7ec835.jpg&w=1200&q=75",
    address: {
      country: "Pakistan",
      city: "Karachi",
      addressLine: "North Nazimabad, Block J, Street 12, Near Majid-e-Ashraf",
    },
  },
  {
    id: "3",
    name: "Style Hub",
    email: "style@example.com",
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
  },
];
