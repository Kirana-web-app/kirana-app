import { ChatUser } from "@/src/types/messageTypes";
import SearchBar from "@/src/components/UI/SearchBar";
import { FC, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes/routes";

interface UserListProps {
  users: ChatUser[];
  selectedUserId: string | null;
  onUserSelect: (userId: string) => void;
}

const UserList: FC<UserListProps> = ({
  users,
  selectedUserId,
  onUserSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 md:p-4 border-b border-gray-200">
        {/* Back Button */}
        <button onClick={() => router.push(ROUTES.BAZAAR)} className="">
          <MdOutlineArrowBackIosNew className="size-5" />
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          Messages
        </h2>
      </div>

      {/* Search Bar */}
      <div className="p-3 md:p-4 mt-2">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search conversations..."
          className=""
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto pt-2">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={`p-3 md:p-4 cursor-pointer  transition-colors ${
              selectedUserId === user.id
                ? "bg-primary-lightest border-primary-light"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar with online status */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs md:text-sm font-medium text-gray-700">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm md:text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {user.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs md:text-sm text-gray-600 truncate pr-2">
                    {user.lastMessage}
                  </p>
                  {user.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 text-xs font-medium text-white bg-primary rounded-full flex-shrink-0">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
