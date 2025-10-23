"use client";
import { Message as MessageType } from "@/src/types/messageTypes";
import { FC, useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { IoCall, IoVideocam, IoArrowBack } from "react-icons/io5";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useAuthStore from "@/src/stores/authStore";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { markMessagesAsRead } from "@/src/utils/chat";
import { IoIosClose } from "react-icons/io";

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface ChatWindowProps {
  selectedUser: ChatUser | null;
  selectedChatId: string | null;
  onBackToUserList?: () => void;
  showBackButton?: boolean;
}

const ChatWindow: FC<ChatWindowProps> = ({
  selectedUser,
  selectedChatId,
  onBackToUserList,
  showBackButton = false,
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<
    Map<
      string,
      {
        id: string;
        content: string;
        status: "sending" | "sent" | "failed";
        senderId: string;
        receiverId: string;
        createdAt: any;
      }
    >
  >(new Map());
  const t = useTranslations("Chat");
  const { userData } = useAuthStore();

  const viewRef = useRef<HTMLDivElement | null>(null);

  // Real-time messages listener
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      setOptimisticMessages(new Map()); // Clear optimistic messages when changing chats
      return;
    }

    setMessagesLoading(true);

    const messagesRef = collection(db, "chats", selectedChatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesData: MessageType[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Only add messages that have a valid createdAt timestamp
          if (data.createdAt) {
            messagesData.push({ id: doc.id, ...data } as MessageType);
          }
        });

        // Sort messages by createdAt to ensure proper order
        messagesData.sort((a, b) => {
          const aTime = a.createdAt;
          const bTime = b.createdAt;

          const aTimestamp =
            aTime && typeof aTime === "object" && "toDate" in aTime
              ? aTime.toDate().getTime()
              : new Date(aTime as any).getTime();
          const bTimestamp =
            bTime && typeof bTime === "object" && "toDate" in bTime
              ? bTime.toDate().getTime()
              : new Date(bTime as any).getTime();

          return aTimestamp - bTimestamp;
        });

        setMessages(messagesData);
        setMessagesLoading(false);
      },
      (error) => {
        console.error("Error listening to messages:", error);
        setMessagesLoading(false);
      }
    );

    // Cleanup subscription on unmount or chat change
    return () => unsubscribe();
  }, [selectedChatId]);

  useEffect(() => {
    // Auto-scroll to bottom when new chat is selected and messages finish loading
    viewRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messagesLoading, selectedChatId]);

  // Auto-scroll when new messages are added
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      viewRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages.length]);

  // Transform messages to include isOwn and formatted timestamp
  const chatMessages = messages.map((message: MessageType) => ({
    ...message,
    isOwn: message.senderId === userData?.id,
  }));

  // Combine real messages with optimistic messages
  const optimisticMessagesArray = Array.from(optimisticMessages.values()).map(
    (msg) => ({
      ...msg,
      isOwn: msg.senderId === userData?.id,
      read: false,
      updatedAt: msg.createdAt,
    })
  );

  const allMessages = [...chatMessages, ...optimisticMessagesArray].sort(
    (a, b) => {
      // Handle null/undefined timestamps by putting them at the end
      const aTime = a.createdAt;
      const bTime = b.createdAt;

      // If either timestamp is null/undefined, handle appropriately
      if (!aTime && !bTime) return 0;
      if (!aTime) return 1; // Put messages with no timestamp at the end
      if (!bTime) return -1;

      // Convert to milliseconds for comparison
      const aTimestamp =
        aTime && typeof aTime === "object" && "toDate" in aTime
          ? aTime.toDate().getTime()
          : new Date(aTime as any).getTime();
      const bTimestamp =
        bTime && typeof bTime === "object" && "toDate" in bTime
          ? bTime.toDate().getTime()
          : new Date(bTime as any).getTime();

      return aTimestamp - bTimestamp;
    }
  );

  // Handle optimistic message updates
  const handleOptimisticMessage = (optimisticMessage: {
    id: string;
    content: string;
    status: "sending" | "sent" | "failed";
  }) => {
    if (!userData || !selectedUser) return;

    setOptimisticMessages((prev) => {
      const newMap = new Map(prev);

      if (optimisticMessage.status === "sent") {
        // Remove optimistic message when it's confirmed sent
        // The real message will appear via the real-time listener
        setOptimisticMessages((current) => {
          const updated = new Map(current);
          updated.delete(optimisticMessage.id);
          return updated;
        });
      } else {
        // Add or update optimistic message
        newMap.set(optimisticMessage.id, {
          ...optimisticMessage,
          senderId: userData.id,
          receiverId: selectedUser.id,
          createdAt: new Date(),
        });
      }

      return newMap;
    });
  };

  // Handle auto-scroll when a new message is sent
  const handleMessageSent = () => {
    viewRef.current?.scrollIntoView({ behavior: "instant" });
  };

  // Handle marking messages as read when they come into view
  const handleMessageRead = async (messageId: string) => {
    if (!selectedChatId || !userData) return;

    try {
      await markMessagesAsRead(
        selectedChatId,
        messageId,
        userData.readReceipts
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-svh">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            <span>{t("selectConversation")}</span>
          </h3>
          <p className="text-gray-500 text-sm">
            <span>{t("chooseCustomer")}</span>
          </p>
        </div>
      </div>
    );
  }

  if (messagesLoading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="flex-1 flex flex-col h-svh bg-gray-100/60">
      {/* Chat Header */}
      <div className="p-3 md:p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs md:text-sm font-medium text-gray-700">
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              {selectedUser.isOnline && (
                <div className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            {/* User Info */}
            <div className="min-w-0">
              <h3 className="text-sm md:text-lg font-medium text-gray-900 truncate user-name">
                {selectedUser.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 truncate">
                {selectedUser.isOnline ? (
                  <span>online</span>
                ) : (
                  <>
                    <span>last Seen </span>
                    <span className="date">
                      {selectedUser.lastSeen || "recently"}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* <button className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <IoCall className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <IoVideocam className="w-4 h-4 md:w-5 md:h-5" />
            </button> */}
            {/* Back Button for Mobile */}
            {onBackToUserList && (
              <button
                onClick={onBackToUserList}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="close chat"
              >
                <IoIosClose className="size-8" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 ">
        <div className="space-y-3 md:space-y-4">
          {allMessages.map((message: any) => (
            <Message
              key={message.id}
              message={message}
              onMessageRead={handleMessageRead}
              chatId={selectedChatId}
            />
          ))}
          <div ref={viewRef}></div>
        </div>
      </div>

      {/* Message Input Component */}
      <MessageInput
        selectedChatId={selectedChatId}
        selectedUser={selectedUser}
        onMessageSent={handleMessageSent}
        // onOptimisticMessage={handleOptimisticMessage}
      />
    </div>
  );
};

export default ChatWindow;
