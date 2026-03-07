"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo or Brand Name - Fixed */}
      <div className="flex h-15 items-center border-b px-6 shrink-0 bg-linear-to-r from-blue-50 to-blue-25">
        <Link href={dashboardHome}>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PH</span>
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Healthcare</span>
          </div>
        </Link>
      </div>

      {/* Navigation Area - Scrollable */}
      <ScrollArea className="flex-1 overflow-hidden">
        <nav className="space-y-6 px-3 py-4">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h4>
              )}
              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;

                  // icon mapper function
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info at bottom - Fixed */}
      <div className="border-t px-3 py-4 shrink-0 bg-card">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{userInfo.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {userInfo.role.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebarContent;