"use client";

import { useStoreUser } from "@/hooks/use-store-user";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
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

  if (path.includes("/dashboard")) return null;

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4 transition-all duration-300">
      <div
        className={`
          h-16 backdrop-blur-xl bg-linear-to-r from-white/15 via-white/10 to-white/15 
          border border-white/30 rounded-full px-4 sm:px-6 py-3.5
          flex items-center justify-between gap-4
          shadow-[0_8px_32px_0_rgba(108,71,255,0.15)]
          transition-all duration-300 ease-out
          ${scrolled ? "shadow-[0_8px_40px_0_rgba(108,71,255,0.25)] scale-[0.98]" : "hover:shadow-[0_8px_40px_0_rgba(108,71,255,0.2)]"}
          group
        `}
      >
        {/* Logo/Home Link with glow effect */}
        <Link
          href={isAuthenticated ? "/feed" : "/"}
          className="relative flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="absolute inset-0 bg-linear-to-r from-violet-500/20 to-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={96}
            height={32}
            style={{ width: 96, height: 32 }}
            className="relative z-10"
          />
        </Link>

        {/* Nav Links with enhanced hover effects */}
        {path === "/" && (
          <nav className="hidden lg:flex space-x-6 flex-1 justify-center text-sm font-medium">
            <Link
              href="#features"
              className="relative text-white/90 hover:text-white transition-all duration-200 group/link"
            >
              <span className="relative z-10">Features</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-linear-to-r from-violet-400 to-purple-400 scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left" />
            </Link>
            <Link
              href="#testimonials"
              className="relative text-white/90 hover:text-white transition-all duration-200 group/link"
            >
              <span className="relative z-10">Testimonials</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-linear-to-r from-violet-400 to-purple-400 scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left" />
            </Link>
          </nav>
        )}

        {/* Auth Actions with enhanced styling */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Unauthenticated>
            <SignInButton>
              <Button
                variant="ghost"
                className="hidden sm:inline-flex text-white/90 hover:text-white hover:bg-white/10 transition-all"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <button
                className="
                relative overflow-hidden
                bg-linear-to-r from-[#6c47ff] to-[#7c3aed]
                hover:from-[#5a39e8] hover:to-[#6d28d9]
                transition-all duration-300
                text-white rounded-full font-semibold text-sm sm:text-base 
                h-10 px-5 sm:h-10 sm:px-6 
                cursor-pointer
                shadow-lg shadow-violet-500/30
                hover:shadow-xl hover:shadow-violet-500/40
                hover:scale-105
                active:scale-95
                group/btn
              "
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                  Sign Up
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              </button>
            </SignUpButton>
          </Unauthenticated>

          <Authenticated>
            {/* Enhanced Dashboard Button */}
            <Link href="/dashboard" className="flex items-center">
              <Button
                variant="outline"
                className="
                  hidden sm:flex whitespace-nowrap
                  border-white/30 bg-white/5 hover:bg-white/10
                  text-white/90 hover:text-white
                  backdrop-blur-sm
                  transition-all duration-200
                  hover:border-violet-400/50
                  hover:shadow-lg hover:shadow-violet-500/20
                  group/dash
                "
              >
                <LayoutDashboard className="h-4 w-4 group-hover/dash:rotate-[-5deg] transition-transform" />
                <span className="hidden md:inline ml-2">Dashboard</span>
              </Button>
            </Link>

            {/* User Profile with enhanced container */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-violet-500/30 to-purple-500/30 blur-md rounded-full opacity-0 hover:opacity-100 transition-opacity" />
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 ring-2 ring-white/20 hover:ring-violet-400/50 transition-all",
                  },
                }}
              />
            </div>
          </Authenticated>
        </div>

        {/* Enhanced Loading Indicator */}
        {isLoading && (
          <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
            <div className="relative w-[95%]">
              <BarLoader width={"100%"} color="#A78BFA" height={3} />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-violet-400/50 to-transparent blur-sm" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
