import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Chat, Message } from "../types/messageTypes";
import { decryptMessage, encryptMessage } from "../lib/encryption";

const createChatId = (userId1: string, userId2: string): string => {
  return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
};

export const createNewChat = async (
  userA: { id: string; name: string; avatar: string },
  userB: { id: string; name: string; avatar: string }
) => {
  try {
    const chatId = createChatId(userA.id, userB.id);
    const chatRef = doc(db, "chats", chatId);

    const newChat: Chat = {
      id: chatId,
      userA,
      userB,
      lastMessage: null,
      lastMessageCreatedAt: serverTimestamp(),
    };

    await setDoc(chatRef, newChat);

    await Promise.all([
      updateUserChatList(userA.id, userB.id),
      updateUserChatList(userB.id, userA.id),
    ]);
    console.log("Chat created successfully with ID:", chatId);
  } catch (e) {
    console.error("Error creating chat:", e);
  }
};

export const updateUserChatList = async (userIdA: string, userIdB: string) => {
  try {
    const userRef = doc(db, "users", userIdA);

    if (!userRef) {
      console.error("User not found for updating chat list");
      return;
    }

    const updateData = arrayUnion(userIdB);
    // updateData[fieldName] = arrayUnion(userIdB);

    // update the user's array of users whom they have chat
    await updateDoc(userRef, { userChatList: updateData });

    // const userChatRef = doc(collection(db, "users", userIdA, "chats"), userIdB);
    // await setDoc(userChatRef, { chatId: userIdB });
  } catch (e) {
    console.error("Error updating user chat list:", e);
  }
};

export const getChats = async (userId: string): Promise<Chat[] | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error("User not found for fetching chat list");
      return null;
    }
    const userData = userDoc.data();
    const userChatIds: string[] = userData.userChatList || [];

    const chatPromises = userChatIds.map(async (userChatId) => {
      const chatId = createChatId(userId, userChatId);
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      return chatDoc.data() as Chat;
    });

    return await Promise.all(chatPromises);
  } catch (e) {
    console.error("Error fetching chats:", e);
    return null;
  }
};

export const sendMessage = async (
  chatId: string,
  messageData: {
    senderId: string;
    receiverId: string;
    content: string;
  }
) => {
  try {
    const chatRef = collection(db, "chats", chatId, "messages");
    const chatDocRef = doc(db, "chats", chatId);

    const timestamp = serverTimestamp();
    const content = encryptMessage(messageData.content);

    const message: Omit<Message, "id"> = {
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      content,
      createdAt: timestamp,
      updatedAt: timestamp,
      read: false,
    };

    const docRef = await addDoc(chatRef, message);
    await updateDoc(docRef, { id: docRef.id });

    // Update the chat's lastMessage
    const lastMessage: Message = {
      id: docRef.id,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      content,
      createdAt: timestamp,
      updatedAt: timestamp,
      read: false,
    };

    await updateDoc(chatDocRef, {
      lastMessage,
      lastMsgId: docRef.id,
      lastMessageCreatedAt: timestamp,
    });

    console.log("Message sent successfully");
  } catch (e) {
    console.error("Error sending message:", e);
  }
};

export const getMessages = async (
  chatId: string | null
): Promise<Message[] | null> => {
  if (!chatId) return null;

  try {
    const chatRef = collection(db, "chats", chatId, "messages");
    const q = query(chatRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);

    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
      } as Message);
    });
    return messages;
  } catch (e) {
    console.error("Error fetching messages:", e);
    return null;
  }
};

export const markMessagesAsRead = async (
  chatId: string,
  messageId: string,
  readReceipts: boolean
) => {
  try {
    if (readReceipts) {
      const messageRef = doc(db, "chats", chatId, "messages", messageId);
      await updateDoc(messageRef, { read: true });
    }

    // Also update the chat's lastMessage read status if this is the last message
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    if (chatDoc.exists()) {
      const chatData = chatDoc.data() as Chat;
      if (chatData.lastMessage?.read) return; // already read

      if (chatData.lastMessage && chatData.lastMessage.id === messageId) {
        await updateDoc(chatRef, {
          "lastMessage.read": true,
        });
      }
    }

    console.log("Message marked as read");
  } catch (e) {
    console.error("Error marking message as read:", e);
  }
};

export const editMessage = async (
  chatId: string,
  messageId: string,
  newContent: string
) => {
  try {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);

    const content = encryptMessage(newContent);

    await updateDoc(messageRef, {
      content,
      updatedAt: serverTimestamp(),
    } as Partial<Message>);

    const msgDoc = await getDoc(messageRef);
    const lastMsg = await getDoc(doc(db, "chats", chatId));

    if (lastMsg.exists()) {
      const lastMsgData = lastMsg.data() as Chat;
      if (lastMsgData.lastMessage?.id === messageId) {
        const chatRef = doc(db, "chats", chatId);

        await updateDoc(chatRef, {
          "lastMessage.content": content,
          "lastMessage.updatedAt": serverTimestamp(),
        } as Partial<Chat>);
      }
    }

    console.log("Message edited successfully");
  } catch (e) {
    console.error("Error editing message:", e);
  }
};

export const deleteMessage = async (chatId: string, messageId: string) => {
  try {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    await deleteDoc(messageRef);
    console.log("Message deleted successfully");
  } catch (e) {
    console.error("Error deleting message:", e);
  }
};

// Real-time listener for chats
export const subscribeToChats = (
  userId: string,
  callback: (chats: Chat[]) => void
) => {
  let chatListeners: (() => void)[] = [];
  let currentChats: Map<string, Chat> = new Map();

  const userRef = doc(db, "users", userId);

  const userListener = onSnapshot(userRef, async (userDoc) => {
    if (!userDoc.exists()) {
      console.error("User not found for real-time chat updates");
      // Clean up existing chat listeners
      chatListeners.forEach((unsubscribe) => unsubscribe());
      chatListeners = [];
      currentChats.clear();
      callback([]);
      return;
    }

    const userData = userDoc.data();
    const userChatIds: string[] = userData.userChatList || [];

    // Clean up existing chat listeners
    chatListeners.forEach((unsubscribe) => unsubscribe());
    chatListeners = [];

    if (userChatIds.length === 0) {
      currentChats.clear();
      callback([]);
      return;
    }

    // Set up real-time listeners for each chat
    userChatIds.forEach((userChatId) => {
      const chatId = createChatId(userId, userChatId);
      const chatRef = doc(db, "chats", chatId);

      const chatListener = onSnapshot(chatRef, (chatDoc) => {
        if (chatDoc.exists()) {
          const chatData = { id: chatDoc.id, ...chatDoc.data() } as Chat;
          currentChats.set(chatId, chatData);
        } else {
          currentChats.delete(chatId);
        }

        // Convert map to array and sort by lastMessageCreatedAt
        const chatsArray = Array.from(currentChats.values());
        chatsArray.sort((a, b) => {
          const aTime = a.lastMessageCreatedAt;
          const bTime = b.lastMessageCreatedAt;

          // Handle null/undefined timestamps
          if (!aTime && !bTime) return 0;
          if (!aTime) return 1;
          if (!bTime) return -1;

          // Handle Firestore Timestamp
          const aTimestamp =
            aTime && typeof aTime === "object" && "toDate" in aTime
              ? aTime.toDate().getTime()
              : new Date(aTime as any).getTime();
          const bTimestamp =
            bTime && typeof bTime === "object" && "toDate" in bTime
              ? bTime.toDate().getTime()
              : new Date(bTime as any).getTime();

          return bTimestamp - aTimestamp; // Most recent first
        });

        callback(chatsArray);
      });

      chatListeners.push(chatListener);
    });
  });

  // Return cleanup function that unsubscribes from all listeners
  return () => {
    userListener();
    chatListeners.forEach((unsubscribe) => unsubscribe());
  };
};
