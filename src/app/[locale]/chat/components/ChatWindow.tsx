import { ChatMessage, ChatUser } from "@/src/types/messageTypes";
import { FC, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  IoSend,
  IoAttach,
  IoCall,
  IoVideocam,
  IoArrowBack,
} from "react-icons/io5";
import Message from "./Message";

interface ChatWindowProps {
  selectedUser: ChatUser | null;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onBackToUserList?: () => void;
  showBackButton?: boolean;
}

const ChatWindow: FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  onSendMessage,
  onBackToUserList,
  showBackButton = false,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const t = useTranslations("Chat");

  const viewRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
      // Scroll to bottom after sending a message
      setTimeout(() => {
        viewRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  return (
    <div className="flex-1 flex flex-col h-svh">
      {/* Chat Header */}
      <div className="p-3 md:p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button for Mobile */}
            {showBackButton && onBackToUserList && (
              <button
                onClick={onBackToUserList}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <IoArrowBack className="w-5 h-5" />
              </button>
            )}

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
                    <span className="date">{selectedUser.timestamp}</span>
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
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 ">
        <div className="space-y-3 md:space-y-4">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={viewRef}></div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("typeMessage")}
              className="w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className={`p-1.5 md:p-2 rounded-lg transition-colors ${
              messageInput.trim()
                ? "bg-primary text-white hover:bg-orange-600"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <IoSend className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
