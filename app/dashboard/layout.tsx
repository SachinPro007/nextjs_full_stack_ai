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
    <div className="relative min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
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

      {/* Main Content Wrapper */}
      <div
        className={cn(
          "relative transition-all duration-500 ease-in-out z-10 flex flex-col min-h-screen",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-80",
        )}
      >
        {/* Top Bar */}
        <div className={`fixed top-0 w-full z-999`}>
          <Header setMobileOpen={setMobileOpen} />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="min-h-full w-full mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
