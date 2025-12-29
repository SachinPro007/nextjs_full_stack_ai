"use client";

import React from "react";
import { Button } from "../ui/button";
import { Bell, Menu, Search } from "lucide-react"; // Added Sparkles to match home brand
import { UserButton } from "@clerk/nextjs";

function Header({
  setMobileOpen,
}: {
  setMobileOpen: (value: boolean) => void;
}) {
  return (
    <header className="sticky top-0 w-full h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-999">
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden hover:bg-slate-100 text-slate-600 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar - Styled to match Home inputs */}
          <div className="hidden md:flex items-center gap-3 bg-slate-100/50 border border-slate-200 rounded-2xl px-4 py-2.5 w-80 group focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100 transition-all duration-300">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 w-full font-medium"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="sticky right-6 flex items-center gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-slate-100 rounded-xl transition-all duration-300 group"
          >
            <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            {/* Changed red dot to Indigo/Violet to match brand, or keep red for urgency. using brand color pulse here */}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse border border-white" />
          </Button>

          {/* User Profile */}
          <div className="relative group pl-2">
            {/* Gradient Glow Effect - Matched to Home Page (Indigo -> Violet) */}
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-violet-500 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500" />

            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 rounded-2xl ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform duration-300",
                  userButtonPopoverCard:
                    "bg-white border border-slate-200 shadow-xl shadow-indigo-100/50 rounded-2xl backdrop-blur-3xl",
                  userPreviewMainIdentifier: "text-slate-900 font-bold",
                  userPreviewSecondaryIdentifier: "text-slate-500",
                  userButtonPopoverActionButton:
                    "hover:bg-slate-50 rounded-xl text-slate-600 hover:text-indigo-600 font-medium",
                  userButtonPopoverActionButtonIcon: "text-slate-400",
                  userButtonPopoverFooter: "hidden",
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
