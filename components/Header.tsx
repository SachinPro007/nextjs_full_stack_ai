"use client";

import { useStoreUser } from "@/hooks/use-store-user";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";
import { LayoutDashboard, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

function Header() {
  const { isLoading, isAuthenticated } = useStoreUser();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // LOGIC: Header hide on dashboard
  if (path.includes("/dashboard")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      {/* CONTAINER: Floating Style (Light Mode) */}
      <div className="container mx-auto max-w-6xl px-4">
        <div
          className={`
            relative flex items-center justify-between px-4 py-3 md:px-6
            rounded-2xl border transition-all duration-500
            ${
              scrolled
                ? "bg-white/80 backdrop-blur-xl border-slate-200/80 shadow-xl shadow-slate-200/40"
                : "bg-white/60 backdrop-blur-lg border-slate-200/50 shadow-lg shadow-slate-100"
            }
          `}
        >
          {/* LOGO SECTION */}
          <Link
            href={isAuthenticated ? "/feed" : "/"}
            className="relative flex items-center gap-3 group z-10"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Ezensi</span>
            </div>
          </Link>

          {/* NAV LINKS (Home only) */}
          {path === "/" && (
            <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1 p-1 rounded-full bg-slate-100/50 border border-slate-200/50 backdrop-blur-md">
              <Link
                href="#features"
                className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-white rounded-full transition-all duration-300 shadow-sm hover:shadow"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-white rounded-full transition-all duration-300 shadow-sm hover:shadow"
              >
                Testimonials
              </Link>
            </nav>
          )}

          {/* AUTH ACTIONS */}
          <div className="flex items-center gap-3 z-10">
            <Unauthenticated>
              <SignInButton>
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex h-9 px-4 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium text-sm tracking-wide cursor-pointer"
                >
                  Log in
                </Button>
              </SignInButton>

              <SignUpButton>
                {/* Primary CTA */}
                <button className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-lg bg-indigo-600 px-4 font-medium text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 hover:scale-105 cursor-pointer">
                  <span className="mr-2 size-4 transition-transform group-hover:-translate-x-1">
                    <Sparkles className="w-full h-full text-indigo-200 group-hover:text-white" />
                  </span>
                  <span className="text-sm font-bold tracking-wide">
                    Get Started
                  </span>
                </button>
              </SignUpButton>
            </Unauthenticated>

            <Authenticated>
              <Link href="/dashboard">
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-white hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm transition-all duration-300 group">
                  <LayoutDashboard className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="hidden sm:flex">Dashboard</span>
                </button>
              </Link>

              {/* AVATAR: Light mode ring */}
              <div className="ml-2 p-0.5 rounded-full bg-linear-to-b from-indigo-100 to-transparent">
                <div className="p-px bg-white rounded-full shadow-sm">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-full",
                      },
                    }}
                  />
                </div>
              </div>
            </Authenticated>
          </div>

          {/* LOADING BAR: Indigo Color */}
          {isLoading && (
            <div className="absolute bottom-0 left-4 right-4 h-0.5 overflow-hidden rounded-full">
              <BarLoader
                width={"100%"}
                color="#4f46e5" // Indigo-600
                height={2}
                cssOverride={{
                  borderRadius: "100px",
                  backgroundColor: "transparent",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
