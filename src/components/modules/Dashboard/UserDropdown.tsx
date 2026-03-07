import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user.types";
import { Key, LogOut, User } from "lucide-react";
import Link from "next/link";

interface UserDropdownProps {
  userInfo: UserInfo;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={"outline"} 
          size={"icon"} 
         className="rounded-full"
        >
          <span className="text-sm font-bold">
            {userInfo.name.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-lg">
        <DropdownMenuLabel className="px-2 py-3">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-semibold text-gray-900">{userInfo.name}</p>
            <p className="text-xs text-gray-500">{userInfo.email}</p>
            <div className="inline-flex items-center">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full capitalize">
                {userInfo.role.toLowerCase().replace("_", " ")}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem className="px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-md mx-1 transition-colors">
          <Link href={"/my-profile"} className="flex items-center w-full">
            <User className="mr-3 h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">My Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-md mx-1 transition-colors">
          <Link href={"/change-password"} className="flex items-center w-full">
            <Key className="mr-3 h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">Change Password</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem 
          onClick={() => {}} 
          className="px-2 py-2 cursor-pointer hover:bg-red-50 rounded-md mx-1 transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600 font-medium">Logout</span>
        </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;