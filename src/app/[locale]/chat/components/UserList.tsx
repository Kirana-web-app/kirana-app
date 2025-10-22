import { Chat } from "@/src/types/messageTypes";
import SearchBar from "@/src/components/UI/SearchBar";
import { FC, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/src/constants/routes/routes";
import useAuthStore from "@/src/stores/authStore";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { formatTimestamp } from "@/src/utils";

interface UserListProps {
  users: Chat[];
  selectedUserId: string | null;
  onUserSelect: (userId: string) => void;
  loading: boolean;
}

const UserList: FC<UserListProps> = ({
  users,
  selectedUserId,
  onUserSelect,
  loading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const t = useTranslations("Chat");
  const { userData } = useAuthStore();

  // Helper function to get the other user in the chat
  const getOtherUser = (chat: Chat) => {
    if (!userData) return null;
    return chat.userA.id === userData.id ? chat.userB : chat.userA;
  };

  // Filter users based on search query
  const filteredUsers = users.filter((chat) => {
    const otherUser = getOtherUser(chat);
    if (!otherUser) return false;

    const nameMatch = otherUser.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const messageMatch = chat.lastMessage?.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return nameMatch || messageMatch;
  });

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-3 md:p-4 border-b border-gray-200">
        {/* Back Button */}
        <button
          onClick={() => router.push(ROUTES.BAZAAR)}
          className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
        >
          <MdOutlineArrowBackIosNew className="size-5" />
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
          <span data-translated>{t("messages")}</span>
        </h2>
      </div>

      {/* Search Bar */}
      <div className="p-3 md:p-4 mt-2">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("searchConversations")}
          className=""
        />
      </div>

      {/* User List */}
      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <div className="flex-1 overflow-y-auto pt-2">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 mt-10 max-w-[250px] mx-auto">
              {t("noConversationsFound")}
            </p>
          ) : (
            filteredUsers &&
            filteredUsers.map((chat) => {
              const otherUser = getOtherUser(chat);
              if (!otherUser) return null;

              return (
                <div
                  key={chat.id}
                  onClick={() => onUserSelect(otherUser.id)}
                  className={`p-3 md:p-4 cursor-pointer transition-colors ${
                    selectedUserId === otherUser.id
                      ? "bg-primary-lightest border-primary-light"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar with online status */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs md:text-sm font-medium text-gray-700">
                          {otherUser.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      {/* TODO: Add online status when available */}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm md:text-sm font-medium text-gray-900 truncate user-name">
                          {otherUser.name}
                        </h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2 date">
                            {formatTimestamp(chat.lastMessageCreatedAt)}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs md:text-sm text-gray-600 truncate pr-2 dynamic-content">
                            {chat.lastMessage.content}
                          </p>
                          {/* TODO: Add unread count when available */}
                          {!chat.lastMessage.read &&
                            chat.lastMessage.senderId !== userData?.id && (
                              <span className="inline-flex items-center justify-center w-3 h-3 text-xs font-medium text-white bg-primary rounded-full flex-shrink-0"></span>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
