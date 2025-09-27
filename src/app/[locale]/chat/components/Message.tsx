import { ChatMessage } from "@/src/types/messageTypes";
import { FC } from "react";

interface MessageProps {
  message: ChatMessage;
}

const Message: FC<MessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.isOwn
            ? "bg-primary-light"
            : "bg-white text-gray-900 border border-gray-200"
        }`}
      >
        {/* {!message.isOwn && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium">{message.senderName}</span>
          </div>
        )} */}
        <p className="text-sm">{message.content}</p>
        <span
          className={`text-xs mt-2 block ${
            message.isOwn ? "text-right opacity-50" : "text-gray-500"
          }`}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};

export default Message;
