import { Message, Chat } from "../types/messageTypes";
import { Timestamp } from "firebase/firestore";

const myId = "9bfxozDdUYh6A7F1XYAAm48jh7p2";
// Mock Chats - These represent the main chat documents
// Each chat document has a combined ID of both users (user1_user3)
// and contains userA, userB, and lastMessage
export const mockChats: Chat[] = [
  {
    id: `${myId}_user3`, // Combined ID following Firebase pattern
    userA: {
      id: myId,
      name: "Ahmed Khan",
      avatar: "/api/placeholder/32/32",
    },
    userB: {
      id: "user3",
      name: "Hassan Sheikh",
      avatar: "/api/placeholder/32/32",
    },
    lastMessage: {
      id: "m1_latest",
      senderId: "user3",
      receiverId: myId,
      content: "Ji haan, store 9 AM se 10 PM tak khula hai.",
      createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000)), // 5 minutes ago
      updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000)),
      read: false,
    },
    lastMessageCreatedAt: Timestamp.fromDate(
      new Date(Date.now() - 5 * 60 * 1000)
    ),
  },
  {
    id: `${myId}_user2`, // Combined ID
    userA: {
      id: myId,
      name: "Ahmed Khan",
      avatar: "/api/placeholder/32/32",
    },
    userB: {
      id: "user2",
      name: "Fatima Ali",
      avatar: "/api/placeholder/32/32",
    },
    lastMessage: {
      id: "m2_latest",
      senderId: "user2",
      receiverId: myId,
      content: "Thank you for the quick delivery! Everything was fresh.",
      createdAt: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000)), // 30 minutes ago
      updatedAt: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000)),
      read: true,
    },
    lastMessageCreatedAt: Timestamp.fromDate(
      new Date(Date.now() - 30 * 60 * 1000)
    ),
  },
  {
    id: `${myId}_user4`, // Combined ID
    userA: {
      id: myId,
      name: "Ahmed Khan",
      avatar: "/api/placeholder/32/32",
    },
    userB: {
      id: "user4",
      name: "Omar Raza",
      avatar: "/api/placeholder/32/32",
    },
    lastMessage: {
      id: "m3_latest",
      senderId: "user4",
      receiverId: myId,
      content: "Can I change my delivery address to a different location?",
      createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
      updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
      read: false,
    },
    lastMessageCreatedAt: Timestamp.fromDate(
      new Date(Date.now() - 2 * 60 * 60 * 1000)
    ),
  },
  {
    id: `${myId}_user5`, // Combined ID
    userA: {
      id: myId,
      name: "Ahmed Khan",
      avatar: "/api/placeholder/32/32",
    },
    userB: {
      id: "user5",
      name: "Ayesha Siddiqui",
      avatar: "/api/placeholder/32/32",
    },
    lastMessage: {
      id: "m4_latest",
      senderId: myId,
      receiverId: "user5",
      content: "Aap ka order ready hai. Main 15 minute mein deliver kar dunga.",
      createdAt: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000)), // 4 hours ago
      updatedAt: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000)),
      read: true,
    },
    lastMessageCreatedAt: Timestamp.fromDate(
      new Date(Date.now() - 4 * 60 * 60 * 1000)
    ),
  },
];

// Mock Messages - These represent the subcollection messages for each chat
// In Firebase, these would be stored as subcollections under each chat document
// For example: /chats/user1_user3/messages/m1, /chats/user1_user3/messages/m2, etc.

// Messages for chat: user1_user3 (Ahmed Khan <-> Hassan Sheikh)
export const mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user3: Message[] = [
  {
    id: "m1",
    senderId: myId,
    receiverId: "user3",
    content: "Salam! Aap ka store open hai?",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000)), // 30 minutes ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000)),
    read: true,
  },
  {
    id: "m2",
    senderId: "user3",
    receiverId: myId,
    content: "Walaikum Salam! Ji haan bilkul.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 25 * 60 * 1000)), // 25 minutes ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 25 * 60 * 1000)),
    read: true,
  },
  {
    id: "m3",
    senderId: myId,
    receiverId: "user3",
    content: "Kya grocery items available hain? Milk, bread aur eggs chahiye.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 20 * 60 * 1000)), // 20 minutes ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 20 * 60 * 1000)),
    read: true,
  },
  {
    id: "m4",
    senderId: "user3",
    receiverId: myId,
    content: "Sab kuch available hai. Timing kya hai?",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 15 * 60 * 1000)), // 15 minutes ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 15 * 60 * 1000)),
    read: true,
  },
  {
    id: "m5",
    senderId: myId,
    receiverId: "user3",
    content: "Store kitne baje tak khula rehta hai?",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 10 * 60 * 1000)), // 10 minutes ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 10 * 60 * 1000)),
    read: true,
  },
  {
    id: "m1_latest",
    senderId: "user3",
    receiverId: myId,
    content: "Ji haan, store 9 AM se 10 PM tak khula hai.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000)), // 5 minutes ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000)),
    read: false,
  },
];

// Messages for chat: user1_user2 (Ahmed Khan <-> Fatima Ali)
export const mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user2: Message[] = [
  {
    id: "m1",
    senderId: "user2",
    receiverId: myId,
    content: "Hello! I placed an order yesterday. When will it be delivered?",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
    read: true,
  },
  {
    id: "m2",
    senderId: myId,
    receiverId: "user2",
    content:
      "Your order is being prepared. Should be delivered within 30 minutes.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 90 * 60 * 1000)), // 1.5 hours ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 90 * 60 * 1000)),
    read: true,
  },
  {
    id: "m2_latest",
    senderId: "user2",
    receiverId: myId,
    content: "Thank you for the quick delivery! Everything was fresh.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000)), // 30 minutes ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000)),
    read: true,
  },
];

// Messages for chat: user1_user4 (Ahmed Khan <-> Omar Raza)
export const mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user4: Message[] = [
  {
    id: "m1",
    senderId: "user4",
    receiverId: myId,
    content: "I need to update my delivery address for future orders.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 60 * 60 * 1000)), // 3 hours ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 60 * 60 * 1000)),
    read: true,
  },
  {
    id: "m2",
    senderId: myId,
    receiverId: "user4",
    content:
      "Sure! You can update it in your profile settings or let me know the new address.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 150 * 60 * 1000)), // 2.5 hours ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 150 * 60 * 1000)),
    read: true,
  },
  {
    id: "m3_latest",
    senderId: "user4",
    receiverId: myId,
    content: "Can I change my delivery address to a different location?",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
    read: false,
  },
];

// Messages for chat: user1_user5 (Ahmed Khan <-> Ayesha Siddiqui)
export const mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user5: Message[] = [
  {
    id: "m1",
    senderId: "user5",
    receiverId: myId,
    content:
      "Hi! I placed an order 30 minutes ago. How long will delivery take?",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 60 * 1000)), // 5 hours ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 60 * 1000)),
    read: true,
  },
  {
    id: "m2",
    senderId: myId,
    receiverId: "user5",
    content: "Order confirm ho gaya hai. Main items pack kar raha hun.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 4.5 * 60 * 60 * 1000)), // 4.5 hours ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 4.5 * 60 * 60 * 1000)),
    read: true,
  },
  {
    id: "m4_latest",
    senderId: myId,
    receiverId: "user5",
    content: "Aap ka order ready hai. Main 15 minute mein deliver kar dunga.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000)), // 4 hours ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000)),
    read: true,
  },
];

// Combined messages object for easy access (simulating how you'd query Firebase subcollections)
export const mockMessages: Record<string, Message[]> = {
  [`${myId}_user3`]: mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user3,
  [`${myId}_user2`]: mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user2,
  [`${myId}_user4`]: mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user4,
  [`${myId}_user5`]: mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user5,
};

// For backward compatibility, export a flat array of all messages
export const allMockMessages: Message[] = [
  ...mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user3,
  ...mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user2,
  ...mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user4,
  ...mockMessages_9bfxozDdUYh6A7F1XYAAm48jh7p2_user5,
];
