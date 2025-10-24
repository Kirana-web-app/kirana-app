"use client";
import { FC, useState } from "react";
import { useTranslations } from "next-intl";
import { IoSend } from "react-icons/io5";
import { sendMessage } from "@/src/utils/chat";
import useAuthStore from "@/src/stores/authStore";

interface MessageInputProps {
  selectedChatId: string | null;
  selectedUser: {
    id: string;
    name: string;
    avatar: string;
    isOnline?: boolean;
    lastSeen?: string;
  } | null;
  onMessageSent?: () => void;
  onOptimisticMessage?: (message: {
    id: string;
    content: string;
    status: "sending" | "sent" | "failed";
  }) => void;
}

const MessageInput: FC<MessageInputProps> = ({
  selectedChatId,
  selectedUser,
  onMessageSent,
  onOptimisticMessage,
}) => {
  const [messageInput, setMessageInput] = useState("");

  const [sendingMessage, setSendingMessage] = useState(false);

  const t = useTranslations("Chat");
  const { userData } = useAuthStore();

  const handleSendMessage = async () => {
    if (!selectedChatId || !userData || !selectedUser || !messageInput.trim())
      return;

    const messageContent = messageInput.trim();
    const tempMessageId = `temp_${Date.now()}`;

    // Clear input immediately for better UX
    setMessageInput("");

    // Optimistic update - show message as sending
    onOptimisticMessage?.({
      id: tempMessageId,
      content: messageContent,
      status: "sending",
    });

    setSendingMessage(true);
    try {
      await sendMessage(selectedChatId, {
        senderId: userData.id,
        receiverId: selectedUser.id,
        content: messageContent,
      });
      setSendingMessage(false);

      // Update optimistic message status to sent
      onOptimisticMessage?.({
        id: tempMessageId,
        content: messageContent,
        status: "sent",
      });

      // Notify parent component that message was sent
      onMessageSent?.();
    } catch (error) {
      console.error("Error sending message:", error);
      setSendingMessage(false);

      // Update optimistic message status to failed
      onOptimisticMessage?.({
        id: tempMessageId,
        content: messageContent,
        status: "failed",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
      {/* <div className="flex justify-end w-full pb-3 px-12">
        {sendingMessage && `sending message...`}
      </div> */}
      <div className="flex items-center gap-2">
        {/* Message Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("typeMessage")}
            className="w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className={`p-1.5 md:p-2 rounded-lg transition-colors bg-primary text-white hover:bg-orange-600`}
        >
          <IoSend className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
