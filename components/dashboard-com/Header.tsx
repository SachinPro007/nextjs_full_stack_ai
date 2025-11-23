import React from "react";
import { Button } from "../ui/button";
import { Bell, Menu, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

function Header({
  setMobileOpen,
}: {
  setMobileOpen: (value: boolean) => void;
}) {
  return (
    <header className="sticky top-0 w-full h-20 bg-zinc-950 backdrop-blur-2xl border-b border-white/5 z-999">
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden hover:bg-white/5 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 w-80 group hover:border-white/20 transition-all duration-300">
            <Search className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500 w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="sticky right-6 flex items-center gap-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-white/5 rounded-xl transition-all duration-300 group"
          >
            <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </Button>

          {/* User Profile */}
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-cyan-500 rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 rounded-2xl ring-2 ring-white/10 hover:ring-white/20 transition-all relative",
                  userButtonPopoverCard:
                    "bg-zinc-950 border border-white/10 shadow-2xl rounded-2xl backdrop-blur-2xl",
                  userPreviewMainIdentifier: "text-white font-semibold",
                  userButtonPopoverActionButton:
                    "hover:bg-white/5 rounded-xl text-gray-300",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
