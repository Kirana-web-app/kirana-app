import { Message as MessageType } from "@/src/types/messageTypes";
import { FC, useEffect, useRef, useState } from "react";
import useAuthStore from "@/src/stores/authStore";
import { formatTimestamp } from "@/src/utils";
import { GoKebabHorizontal } from "react-icons/go";
import { deleteMessage, editMessage } from "@/src/utils/chat";
import { IoIosClose } from "react-icons/io";
import { Button } from "@/src/components/UI/Button";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { decryptMessage } from "@/src/lib/encryption";

interface ChatMessage extends MessageType {
  isOwn: boolean;
  status?: "sending" | "sent" | "failed"; // For optimistic updates
}

interface MessageProps {
  message: ChatMessage;
  onMessageRead?: (messageId: string) => void;
  chatId: string | null;
  index: number;
}

const Message: FC<MessageProps> = ({
  message,
  onMessageRead,
  chatId,
  index,
}) => {
  const { userData } = useAuthStore();
  const decryptedMessage = decryptMessage(message.content);

  const messageRef = useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showMenuButton, setShowMenuButton] = useState(false);
  const [deletingMsg, setDeletingMsg] = useState(false);
  const [editedMsg, setEditedMsg] = useState(decryptedMessage);
  const [editingMsg, setEditingMsg] = useState(false);

  const editModalRef = useRef<HTMLDialogElement>(null);
  const deleteModalRef = useRef<HTMLDialogElement>(null);

  // Function to check if message is within 30-minute edit window
  const isWithinEditWindow = (): boolean => {
    const EDIT_WINDOW_MINUTES = 30;
    const messageTime = message.createdAt;

    // Handle Firestore Timestamp
    let messageDate: Date;
    if (
      messageTime &&
      typeof messageTime === "object" &&
      "toDate" in messageTime
    ) {
      messageDate = messageTime.toDate();
    } else {
      messageDate = new Date(messageTime as any);
    }

    const now = new Date();
    const timeDiffMs = now.getTime() - messageDate.getTime();
    const timeDiffMinutes = timeDiffMs / (1000 * 60); // Convert to minutes

    return timeDiffMinutes <= EDIT_WINDOW_MINUTES;
  };

  // Check if user can edit/delete this message
  const canEditMessage = message.isOwn && isWithinEditWindow();

  // Set up intersection observer to detect when message comes into view
  useEffect(() => {
    if (
      !messageRef.current ||
      message.isOwn ||
      message.read ||
      !onMessageRead ||
      !chatId
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Message is at least 50% visible, mark as read
            onMessageRead(message.id);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the message is visible
        rootMargin: "0px 0px -50px 0px", // Give some margin at the bottom
      }
    );

    observer.observe(messageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [message.id, message.isOwn, message.read, onMessageRead, chatId]);

  const getStatusIndicator = () => {
    if (!message.isOwn || !message.status) return null;

    switch (message.status) {
      case "sending":
        return (
          <div className="flex items-center gap-1 mt-1">
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-400">Sending...</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-red-500 text-xs">✗</span>
            <span className="text-xs text-red-500">Failed to send</span>
          </div>
        );
      case "sent":
        return (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-green-500 text-xs">✓</span>
            <span className="text-xs text-green-500">Sent</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleDeleteMessage = async () => {
    if (!chatId) return;
    setDeletingMsg(true);
    try {
      await deleteMessage(chatId, message.id);
    } catch (err) {
      console.error("Error deleting message:", err);
    } finally {
      setDeletingMsg(false);
      deleteModalRef.current?.close();
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatId) return;
    setEditingMsg(true);
    try {
      await editMessage(chatId, message.id, editedMsg);
    } catch (err) {
      console.error("Error editing message:", err);
    } finally {
      setEditingMsg(false);
      editModalRef.current?.close();
    }
  };

  const handleClose = () => {
    editModalRef.current?.close();
    setEditedMsg(decryptedMessage);
  };

  if (!userData) return null;

  if (deletingMsg && message.isOwn) {
    return (
      <div className="flex justify-end">
        <div className="">
          <div className="shrink-0 max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-primary-light ">
            <span className="text-sm text-gray-500">Deleting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* EDIT MODAL */}
      <dialog
        ref={editModalRef}
        className="backdrop:bg-black/50 bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border-0 mx-auto mt-60"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-1">
            <button
              className="mt-0.5 rounded-lg hover:bg-gray-100"
              onClick={handleClose}
            >
              <IoIosClose className="size-8" />
            </button>
            <h3 className="text-lg">Edit Message</h3>
          </div>
          <form action="">
            <textarea
              value={editedMsg}
              onChange={(e) => setEditedMsg(e.currentTarget.value)}
              rows={5}
              className="border border-gray-300 rounded-md p-2 w-full "
            />

            <div className="flex items-center gap-2 justify-end mt-4">
              <Button
                onClick={handleClose}
                type="button"
                variant="secondary"
                size="sm"
                className="px-10"
                disabled={editingMsg}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                type="submit"
                variant="primary"
                size="sm"
                className="px-10"
                disabled={editedMsg.trim() === "" || editingMsg}
              >
                {editingMsg ? (
                  <span className="flex items-center gap-2">
                    Saving
                    <LoadingSpinner className="size-5 mt-1" />
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </div>
      </dialog>
      {/* DELETE MODAL */}
      <dialog
        ref={deleteModalRef}
        className="backdrop:bg-black/50 bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border-0 mx-auto mt-60"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-1">
            <button
              className="mt-0.5 rounded-lg hover:bg-gray-100"
              onClick={() => deleteModalRef.current?.close()}
            >
              <IoIosClose className="size-8" />
            </button>
            <h3 className="text-lg">Delete Message</h3>
          </div>
          <div className="flex items-center justify-center">
            <div className="shrink-0 max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-primary-light ">
              <span className="text-sm">{decryptedMessage}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end mt-4">
            <Button
              onClick={() => deleteModalRef.current?.close()}
              type="button"
              variant="secondary"
              size="sm"
              className="px-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              className="px-10"
              onClick={handleDeleteMessage}
            >
              Delete
            </Button>
          </div>
        </div>
      </dialog>

      <div
        className={`flex ${
          message.isOwn ? "justify-end" : "justify-start"
        } group`}
        onMouseLeave={() => {
          setShowOptions(false);
          setShowMenuButton(false);
        }}
      >
        <div className={`flex ${!message.isOwn && "flex-row-reverse"} `}>
          <div
            className={`md:group-hover:flex md:hidden  justify-end p-2 text-sm shrink-0
            ${showMenuButton ? "flex" : "hidden"}
            `}
          >
            {message.isOwn && canEditMessage && (
              <div className="flex items-center justify-center relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="cursor-pointer p-2 hover:bg-gray-200 rounded-lg"
                >
                  <GoKebabHorizontal />
                </button>
                <div
                  className={`${
                    showOptions ? "block" : "hidden"
                  } flex-col flex justify-start items-start  bg-white p-2 shadow-md rounded-lg absolute ${
                    index < 2 ? "top-1/2 mt-5" : "bottom-1/2 mb-5"
                  } w-28 z-50  ${message.isOwn ? "left-1" : "right-1"}`}
                >
                  {[
                    // { label: "Translate" },
                    {
                      label: "Edit",
                      handleClick: () => editModalRef.current?.showModal(),
                    },
                    {
                      label: "Delete",
                      handleClick: () => deleteModalRef.current?.showModal(),
                    },
                  ].map((option) => {
                    return (
                      <button
                        onClick={option.handleClick}
                        key={option.label}
                        className="hover:bg-gray-100 active:bg-gray-200/60 text-left w-full py-2 pr-6 pl-3 rounded-lg"
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div
            ref={messageRef}
            className={`shrink-0 max-w-xs lg:max-w-md px-4 py-2 rounded-lg   ${
              message.isOwn
                ? "bg-primary-light"
                : "bg-white text-gray-900 border border-gray-200"
            } ${message.status === "sending" ? "opacity-70" : ""} ${
              message.status === "failed" ? "border-red-200 bg-red-50" : ""
            }
        `}
            onTouchStart={() => setShowMenuButton(!showMenuButton)}
          >
            <p className="text-sm">{}</p>
            <p className="text-sm">{decryptedMessage}</p>

            <div
              className={`text-xs mt-2 block space-x-2 ${
                message.isOwn ? "text-right opacity-50" : "text-gray-500"
              }`}
            >
              {/* Edited Status */}
              {formatTimestamp(message.createdAt) !==
                formatTimestamp(message.updatedAt) && <span>edited</span>}
              {/* Timestamp */}

              <span>{formatTimestamp(message.createdAt)}</span>
              {/* Edit window indicator */}
              {/* {message.isOwn && canEditMessage && (
                <span className="ml-1 text-blue-500">• editable</span>
              )} */}
              {/* Read Status */}
              {userData.readReceipts && (
                <span>{message.read ? "seen" : "sent"}</span>
              )}
            </div>

            {/* Status indicator for own messages */}
            {getStatusIndicator()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
