import {
  FileText,
  LayoutDashboard,
  Menu,
  PenTool,
  Settings,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useStoreUser } from "@/hooks/use-store-user";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "../ui/badge";

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
    color: "from-indigo-500 via-purple-500 to-pink-500",
    bg: "bg-indigo-500/10",
    glow: "shadow-indigo-500/50",
  },
  {
    title: "Create Post",
    href: "/dashboard/create",
    icon: PenTool,
    color: "from-emerald-400 via-teal-500 to-cyan-500",
    bg: "bg-emerald-500/10",
    glow: "shadow-emerald-500/50",
  },
  {
    title: "My Posts",
    href: "/dashboard/posts",
    icon: FileText,
    color: "from-orange-400 via-rose-500 to-pink-500",
    bg: "bg-orange-500/10",
    glow: "shadow-orange-500/50",
  },
  {
    title: "Followers",
    href: "/dashboard/followers",
    icon: Users,
    color: "from-violet-400 via-fuchsia-500 to-purple-500",
    bg: "bg-violet-500/10",
    glow: "shadow-violet-500/50",
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
        "fixed top-0 left-0 h-full bg-zinc-950 backdrop-blur-2xl border-r border-white/5 z-50 transition-all duration-500 ease-in-out",
        sidebarCollapsed ? "w-20" : "w-80",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      {/* Sidebar Glow Effect */}
      <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-purple-500/50 to-transparent" />

      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
        <Link
          href={isAuthenticated ? "/feed" : "/"}
          className="flex items-center gap-3 group"
        >
          <div className="relative -ml-2">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-12 h-12 bg-linear-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          {!sidebarCollapsed && (
            <Image
              src="/logo.png"
              alt="Creatr"
              width={100}
              height={32}
              style={{ width: 100, height: 32 }}
              className="h-8 w-auto object-contain"
            />
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden hover:bg-white/5 rounded-xl"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick Stats Cards - Only when expanded */}
      {!sidebarCollapsed && (
        <div className="px-4 py-6 space-y-3">
          <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total Views
              </span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {analytics && analytics.totalView.toLocaleString()}
            </div>
            <div className="text-xs text-green-400 mt-1">
              {(analytics?.viewsGrowth && analytics.viewsGrowth) || 0}% this
              week
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="px-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block"
            >
              <div
                className={cn(
                  "group relative rounded-2xl transition-all duration-300",
                  isActive
                    ? `${item.bg} shadow-lg ${item.glow}`
                    : "hover:bg-white/5",
                )}
              >
                <div
                  className={cn(
                    "relative flex items-center ",
                    !sidebarCollapsed && "justify-center gap-4 px-4 py-4",
                  )}
                >
                  {/* Icon Container */}
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-linear-to-br " + item.color
                        : "bg-white/5 group-hover:bg-white/10",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-white" : "text-gray-400",
                      )}
                    />
                  </div>

                  {/* Label */}
                  {!sidebarCollapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span
                        className={cn(
                          "font-semibold text-sm transition-colors",
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white",
                        )}
                      >
                        {item.title}
                      </span>

                      {item.title === "Create Post" && draftPost && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 text-xs px-2 py-0.5">
                          Draft
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-6 left-0 right-0 px-4 space-y-3">
        {/* Collapse Button - Desktop Only */}
        <Button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex w-full justify-center items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 transition-all duration-300"
        >
          <Menu className="w-4 h-4 text-white" />
          {!sidebarCollapsed && (
            <span className="text-xs text-white font-medium">Collapse</span>
          )}
        </Button>

        {/* Settings */}
        <Link href="/dashboard/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 hover:bg-white/5 rounded-xl py-3 transition-all",
              sidebarCollapsed && "justify-center",
            )}
          >
            <Settings className="w-5 h-5 text-gray-400" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium text-gray-400">
                Settings
              </span>
            )}
          </Button>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
