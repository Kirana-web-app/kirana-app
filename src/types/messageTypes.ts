import { FieldValue, Timestamp } from "firebase/firestore";

export interface Chat {
  id: string; // combination of user IDs (user1_user3)
  // compare userA and userB with current user to determine other user
  userA: {
    id: string;
    name: string;
    avatar: string;
  };
  userB: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage?: Message | null;
  lastMessageCreatedAt: FieldValue | Timestamp | null;
  // messages?: Message[] | null; // subcollection of messages
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: FieldValue | Timestamp;
  updatedAt: FieldValue | Timestamp;
  read: boolean;
}
