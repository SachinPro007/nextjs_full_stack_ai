"use client";

import Header from "@/components/dashboard-com/Header";
import Sidebar from "@/components/dashboard-com/Sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out relative z-10",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-80",
        )}
      >
        {/* Top Bar */}
        <Header setMobileOpen={setMobileOpen} />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)]">{children}</main>
      </div>
    </div>
  );
}
