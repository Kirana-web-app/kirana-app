import { ChatMessage, ChatUser } from "../types/messageTypes";

export const mockUsers: ChatUser[] = [
  {
    id: "1",
    name: "Ahmed Khan",
    avatar: "/api/placeholder/32/32",
    lastMessage: "Salam! Kya grocery items available hain?",
    timestamp: "2 min ago",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Fatima Ali",
    avatar: "/api/placeholder/32/32",
    lastMessage: "Thank you for the quick delivery!",
    timestamp: "15 min ago",
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Hassan Sheikh",
    avatar: "/api/placeholder/32/32",
    lastMessage: "Order ready hai?",
    timestamp: "1 hour ago",
    isOnline: false,
    unreadCount: 1,
  },
  {
    id: "4",
    name: "Ayesha Rahman",
    avatar: "/api/placeholder/32/32",
    lastMessage: "Discount kitna hai is item pe?",
    timestamp: "2 hours ago",
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: "5",
    name: "Muhammad Tariq",
    avatar: "/api/placeholder/32/32",
    lastMessage: "Store timing kya hai?",
    timestamp: "1 day ago",
    isOnline: false,
    unreadCount: 0,
  },
];

export const mockMessages: { [userId: string]: ChatMessage[] } = {
  "1": [
    {
      id: "m1",
      senderId: "1",
      senderName: "Ahmed Khan",
      content: "Salam! Aap ka store open hai?",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: "m2",
      senderId: "owner",
      senderName: "You",
      content: "Wa alaykum salam! Haan bilkul, abhi tak 9 PM tak open hai.",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: "m3",
      senderId: "1",
      senderName: "Ahmed Khan",
      content: "Kya grocery items available hain? Rice aur daal hai?",
      timestamp: "10:35 AM",
      isOwn: false,
    },
    {
      id: "m4",
      senderId: "owner",
      senderName: "You",
      content:
        "Haan sab available hai. Basmati rice 120 Rs/kg aur masoor daal 180 Rs/kg.",
      timestamp: "10:36 AM",
      isOwn: true,
    },
    {
      id: "m5",
      senderId: "1",
      senderName: "Ahmed Khan",
      content: "Salam! Kya grocery items available hain?",
      timestamp: "11:45 AM",
      isOwn: false,
    },
  ],
  "2": [
    {
      id: "m6",
      senderId: "2",
      senderName: "Fatima Ali",
      content: "Order deliver kar diya?",
      timestamp: "9:15 AM",
      isOwn: false,
    },
    {
      id: "m7",
      senderId: "owner",
      senderName: "You",
      content: "Jee haan, abhi 10 min main pahunch jayega.",
      timestamp: "9:16 AM",
      isOwn: true,
    },
    {
      id: "m8",
      senderId: "2",
      senderName: "Fatima Ali",
      content: "Thank you for the quick delivery!",
      timestamp: "9:45 AM",
      isOwn: false,
    },
  ],
  "3": [
    {
      id: "m9",
      senderId: "3",
      senderName: "Hassan Sheikh",
      content: "Bhai order ready hai?",
      timestamp: "8:30 AM",
      isOwn: false,
    },
  ],
};

export const mockChatData = {
  users: mockUsers,
  messages: mockMessages,
};
