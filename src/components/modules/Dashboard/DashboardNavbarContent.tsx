"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import { Input } from "@/components/ui/input";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";


interface DashboardNavbarProps {
    userInfo:UserInfo;
    navItems:NavSection[];
    dashboardHome:string
}

const DashboardNavbarContent = ({dashboardHome,navItems,userInfo}:DashboardNavbarProps) => {

    const [isOpen,setIsOpen]=useState(false);

    const [isMobile,setIsMobile]=useState(false);

    useEffect(()=>{
        const checkSmallerScreen=()=>{
            setIsMobile(window.innerWidth<768);
        }

        checkSmallerScreen();
        window.addEventListener("resize",checkSmallerScreen);

        return ()=>{
            window.removeEventListener("resize",checkSmallerScreen);
        }
    },[])

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center justify-between px-6 py-3 w-full gap-4">
          {/* Mobile menu Toggle Button and Menu */}
          <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                  <Button variant={"outline"} size={"icon"} className="hover:bg-gray-100">
                      <Menu className="h-5 w-5"/>
                  </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                  <DashboardMobileSidebar userInfo={userInfo} dashboardHome={dashboardHome} navItems={navItems}/>
              </SheetContent>
          </Sheet>

          {/* Search Component - Full Width */}
          <div className="flex-1 hidden sm:block">
              <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input type="text" placeholder="Search..." className="w-full pl-9 pr-4 h-9 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:border-gray-300 transition-colors"/>
              </div>
          </div>

          {/* Right Side Actions - Notifications and User Dropdown */}
          <div className="flex items-center gap-4 flex-shrink-0">
              {/* Notification */}
              <NotificationDropdown/>

              {/* User Dropdown */}
              <UserDropdown userInfo={userInfo}/>
          </div>
      </div>
    </nav>
  );
};

export default DashboardNavbarContent;