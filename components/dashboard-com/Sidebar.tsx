"use client";

import {
  FileText,
  LayoutDashboard,
  Menu,
  PenTool,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  X,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useStoreUser } from "@/hooks/use-store-user";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

// types

interface Analytics {
  data:
    | {
        totalView: number;
        totalLikes: number;
        recentComments: number;
        totalFollowers: number;
        viewsGrowth: number;
        likesGrowth: number;
        commentsGrowth: number;
        followersGrowth: number;
      }
    | undefined;
}

interface SideBarFunProp {
  mobileOpen: boolean;
  sidebarCollapsed: boolean;
  setMobileOpen: (value: boolean) => void;
  setSidebarCollapsed: (value: boolean) => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    variant: "default",
    gradient: "from-blue-600 to-indigo-600",
    shadow: "shadow-indigo-500/20",
  },
  {
    title: "Create Post",
    href: "/dashboard/create",
    icon: PenTool,
    variant: "accent", // Special styling for primary action
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
  },
  {
    title: "My Posts",
    href: "/dashboard/posts",
    icon: FileText,
    variant: "default",
    gradient: "from-orange-500 to-pink-500",
    shadow: "shadow-orange-500/20",
  },
  {
    title: "Followers",
    href: "/dashboard/followers",
    icon: Users,
    variant: "default",
    gradient: "from-violet-500 to-purple-500",
    shadow: "shadow-violet-500/20",
  },
];

function Sidebar({
  mobileOpen,
  sidebarCollapsed,
  setMobileOpen,
  setSidebarCollapsed,
}: SideBarFunProp) {
  const pathname = usePathname();
  const { isAuthenticated } = useStoreUser();

  const { data: draftPost } = useConvexQuery(api.posts.getDraftPost);
  const { data: analytics } = useConvexQuery(
    api.dashboard.getAnalytics,
  ) as Analytics;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
        // Glassmorphism & Background Styling
        "bg-white/90 backdrop-blur-xl border-r border-slate-200/60 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]",
        sidebarCollapsed ? "w-20" : "w-80",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      {/* Background Decor: Subtle gradient wash */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-50/50 via-transparent to-slate-50/50 pointer-events-none" />

      {/* --- LOGO HEADER --- */}
      <div className="relative h-20 flex items-center justify-between px-5 border-b border-slate-100/80">
        <Link
          href={isAuthenticated ? "/feed" : "/"}
          className="flex items-center gap-3 group outline-none"
        >
          {/* Logo Icon with Hover Rotation */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative w-10 h-10 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 transition-transform duration-500 group-hover:rotate-10 group-hover:scale-110">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Text Logo */}
          {!sidebarCollapsed && (
            <div className="flex flex-col transition-opacity duration-300">
              {/* Replace Image with text if image fails, or keep image */}
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 tracking-tight">
                Ezensi
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Creator
              </span>
            </div>
          )}
        </Link>

        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden hover:bg-slate-100 text-slate-500 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* --- CONTENT SCROLL AREA --- */}
      <div className="flex flex-col h-[calc(100%-5rem)] justify-between py-6 px-3 overflow-y-auto scrollbar-hide">
        <div className="space-y-8">
          {/* 1. Quick Stats (Only Expanded) */}
          {!sidebarCollapsed && (
            <div className="px-2 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-sm group hover:shadow-md hover:border-indigo-100 transition-all duration-300">
                {/* Decorative BG Blob */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-indigo-50 to-violet-50 rounded-full blur-2xl -mr-8 -mt-8" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                      Weekly Views
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>

                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                      {analytics?.totalView.toLocaleString() || "0"}
                    </span>
                  </div>

                  {/* Progress Bar Visual */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-emerald-600">
                        +{analytics?.viewsGrowth || 0}%
                      </span>
                      <span className="text-slate-400">Target</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full"
                        style={{
                          width: `${Math.min(analytics?.viewsGrowth || 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Navigation Menu */}
          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block group outline-none"
                >
                  <div
                    className={cn(
                      "relative flex items-center rounded-xl transition-all duration-300 ease-out border border-transparent",
                      // Layout
                      !sidebarCollapsed ? "px-3.5 py-3" : "justify-center py-3",
                      // Active State Styles
                      isActive
                        ? "bg-slate-50 border-slate-100 shadow-sm"
                        : "hover:bg-slate-50 hover:border-slate-100/50",
                    )}
                  >
                    {/* Active Side Indicator (Left Strip) */}
                    {isActive && (
                      <div
                        className={cn(
                          "absolute left-0 w-1 rounded-r-full bg-linear-to-b",
                          item.gradient,
                          !sidebarCollapsed
                            ? "h-8"
                            : "h-1.5 w-1.5 rounded-full left-1/2 -translate-x-1/2 bottom-1",
                        )}
                      />
                    )}

                    {/* Icon Container */}
                    <div
                      className={cn(
                        "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 z-10",
                        isActive
                          ? `bg-linear-to-br ${item.gradient} text-white ${item.shadow}`
                          : "bg-white border border-slate-100 text-slate-500 group-hover:scale-105 group-hover:text-slate-700 group-hover:border-slate-200 shadow-sm",
                      )}
                    >
                      <item.icon
                        className="w-5 h-5"
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                    </div>

                    {/* Text Label */}
                    {!sidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between ml-4 overflow-hidden">
                        <span
                          className={cn(
                            "font-semibold text-sm transition-colors truncate",
                            isActive
                              ? "text-slate-900"
                              : "text-slate-600 group-hover:text-slate-900",
                          )}
                        >
                          {item.title}
                        </span>

                        {/* Special Badges */}
                        {item.title === "Create Post" && draftPost && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                        )}
                        {/* Hover Arrow */}
                        {!isActive && (
                          <ChevronRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 3. Footer Actions */}
        <div className="space-y-2 pt-6 border-t border-slate-100/80">
          {/* Settings */}
          <Link href="/dashboard/settings" className="block group">
            <div
              className={cn(
                "flex items-center rounded-xl transition-colors hover:bg-slate-50",
                !sidebarCollapsed ? "px-3 py-2.5 gap-3" : "justify-center p-2",
              )}
            >
              <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors group-hover:rotate-45 duration-500" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
                  Settings
                </span>
              )}
            </div>
          </Link>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "hidden lg:flex w-full items-center rounded-xl bg-slate-50/50 hover:bg-slate-100 border border-slate-100 transition-all active:scale-[0.98]",
              !sidebarCollapsed ? "px-3 py-2.5 gap-3" : "justify-center p-2.5",
            )}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <Menu
                className={cn(
                  "w-4 h-4 text-slate-500 transition-transform duration-300",
                  !sidebarCollapsed ? "" : "rotate-90",
                )}
              />
            </div>
            {!sidebarCollapsed && (
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Collapse
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
