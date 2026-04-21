/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  Bookmark,
  Home,
  Mail,
  MoreHorizontal,
  Search,
  User,
} from "lucide-react";
import TwitterLogo from "../TwitterLogo";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";

const Sidebar = ({ onNavigate }: any) => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Home", icon: Home, page: "home" },
    { name: "Explore", icon: Search, page: "explore" },
    { name: "Notifications", icon: Bell, page: "notifications" },
    { name: "Messages", icon: Mail, page: "messages" },
    { name: "Bookmarks", icon: Bookmark, page: "bookmarks" },
    { name: "Profile", icon: User, page: "profile" },
    { name: "More", icon: MoreHorizontal, page: "more" },
  ];

  return (
    <div
      className="
      flex flex-col
      shrink-0
      h-full
      md:border-r md:border-gray-800
      bg-black
      w-20 lg:w-64
      transition-all duration-200
    "
    >
      {/* LOGO */}
      <div className="p-3 lg:p-4 flex justify-center lg:justify-start">
        <TwitterLogo size="lg" />
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-1 lg:px-2 space-y-1">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className="
              w-full
              flex items-center
              justify-center lg:justify-start
              text-lg
              py-3 lg:py-5
              px-2 lg:px-4
              rounded-full
              hover:bg-blue-500/10
              hover:text-white
              transition-colors
            "
            onClick={() => onNavigate(item.page)}
          >
            <item.icon className="h-6 w-6 lg:mr-4" />

            {/* TEXT HIDDEN ON TABLET */}
            <span className="hidden lg:inline">{item.name}</span>
          </Button>
        ))}
      </nav>

      {/* USER SECTION */}
      {user && (
        <div className="p-2 lg:p-4 border-t border-gray-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="
                  w-full
                  flex items-center
                  justify-center lg:justify-start
                  gap-3
                  p-2 lg:p-3
                  rounded-full
                  hover:bg-gray-800
                "
              >
                <Avatar className="h-9 w-9 rounded-full overflow-hidden">
                  <AvatarImage
                    src={user.avatar || ""}
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback className="rounded-full">
                    {user.displayName?.[0]}
                  </AvatarFallback>
                </Avatar>

                {/* TEXT HIDDEN ON TABLET */}
                <div className="hidden lg:block text-left">
                  <div className="text-white font-semibold">
                    {user.displayName}
                  </div>
                  <div className="text-gray-400 text-sm">@{user.username}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="start"
              className="w-56 bg-black p-2 border border-gray-800"
            >
              <DropdownMenuItem className="px-3 py-2 text-white text-sm cursor-pointer">
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={logout}
                className="px-3 py-2 text-red-400 text-sm cursor-pointer"
              >
                Log out @{user.username}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
