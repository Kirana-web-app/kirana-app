"use client";
import { FC, useState } from "react";
import UserList from "./components/UserList";
import ChatWindow from "./components/ChatWindow";
import { mockChatData } from "@/src/data/mockChat";
import { ChatMessage } from "@/src/types/messageTypes";

const ChatPage: FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState(mockChatData.messages);
  const [showUserList, setShowUserList] = useState(true);

  const selectedUser = selectedUserId
    ? mockChatData.users.find((user) => user.id === selectedUserId) || null
    : null;

  const currentMessages = selectedUserId ? messages[selectedUserId] || [] : [];

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    // Hide user list on mobile when a user is selected
    setShowUserList(false);
  };

  const handleBackToUserList = () => {
    setShowUserList(true);
    setSelectedUserId(null);
    // Don't clear selectedUserId to maintain the selection
  };

  const handleSendMessage = (content: string) => {
    if (!selectedUserId) return;

    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "owner",
      senderName: "You",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
    }));
  };

  return (
    <div className="h-svh flex relative">
      {/* User List - Hidden on mobile when chat is open */}
      <div
        className={`${
          showUserList ? "block" : "hidden"
        } md:block w-full md:w-80 lg:w-96 absolute md:relative inset-0 md:inset-auto z-10 md:z-auto`}
      >
        <UserList
          users={mockChatData.users}
          selectedUserId={selectedUserId}
          onUserSelect={handleUserSelect}
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
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onBackToUserList={handleBackToUserList}
          showBackButton={!showUserList}
        />
      </div>
    </div>
  );
};

export default ChatPage;
