"use client";
import { FC, useState, useEffect } from "react";
import UserList from "./components/UserList";
import ChatWindow from "./components/ChatWindow";
import { Chat } from "@/src/types/messageTypes";
import useAuthStore from "@/src/stores/authStore";
import { subscribeToChats } from "@/src/utils/chat";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { useSearchParams } from "next/navigation";

const ChatPage: FC = () => {
  const { userData, authLoading } = useAuthStore();

  // get param fronm url
  const searchParams = useSearchParams();
  const storeId = searchParams.get("id");

  const [selectedUserId, setSelectedUserId] = useState<string | null>(storeId);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [showUserList, setShowUserList] = useState(storeId ? false : true);

  // Real-time chats listener
  useEffect(() => {
    if (!userData?.id) {
      setChats([]);
      return;
    }

    setChatsLoading(true);

    const unsubscribe = subscribeToChats(userData.id, (updatedChats) => {
      console.log("Updated chats:", updatedChats);

      setChats(updatedChats);
      setChatsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userData?.id]);

  // Helper function to get the other user in a chat
  const getOtherUser = (chat: Chat) => {
    if (!userData) return null;
    return chat.userA.id === userData.id ? chat.userB : chat.userA;
  };

  // Get selected user from chats
  const selectedUser = selectedUserId
    ? (() => {
        const chat = chats.find((c: Chat) => {
          const otherUser = getOtherUser(c);
          return otherUser?.id === selectedUserId;
        });
        return chat ? getOtherUser(chat) : null;
      })()
    : null;

  // Get current messages using chat ID
  const selectedChatId = selectedUserId
    ? (() => {
        const chat = chats.find((c: Chat) => {
          const otherUser = getOtherUser(c);
          return otherUser?.id === selectedUserId;
        });
        return chat?.id || null;
      })()
    : null;

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    //set query param
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("id", userId);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );
    // Hide user list on mobile when a user is selected
    setShowUserList(false);
  };

  const handleBackToUserList = () => {
    // Clear query param
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("id");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );

    setShowUserList(true);
    setSelectedUserId(null);
    // Don't clear selectedUserId to maintain the selection
  };

  if (authLoading) return <LoadingSpinner heightScreen />;

  return (
    <div className="h-svh flex relative">
      {/* User List - Hidden on mobile when chat is open */}
      <div
        className={`${
          showUserList ? "block" : "hidden"
        } md:block w-full md:w-80 lg:w-96 absolute md:relative inset-0 md:inset-auto z-10 md:z-auto`}
      >
        <UserList
          users={chats || []}
          selectedUserId={selectedUserId}
          onUserSelect={handleUserSelect}
          loading={chatsLoading}
        />
      </div>

      {/* Chat Window - Full width on mobile, flex-1 on desktop */}
      <div
        className={`${
          !showUserList || selectedUserId ? "block" : "hidden"
        } md:block flex-1 w-full md:w-auto`}
      >
        <ChatWindow
          selectedUser={selectedUser}
          selectedChatId={selectedChatId}
          onBackToUserList={handleBackToUserList}
          showBackButton={!showUserList}
        />
      </div>
    </div>
  );
};

export default ChatPage;
