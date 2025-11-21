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

  // LOGIC: Header show only home or feed (KEPT EXACTLY THE SAME)
  if (path !== "/" && path !== "/feed" && path.includes("/")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      {/* CONTAINER: Changed from simple pill to a 'Floating Island' aesthetic */}
      <div className="container mx-auto max-w-6xl px-4">
        <div
          className={`
            relative flex items-center justify-between px-4 py-3 md:px-6
            rounded-2xl border transition-all duration-500
            ${
              scrolled
                ? "bg-black/80 backdrop-blur-xl border-white/10 shadow-2xl shadow-indigo-500/10"
                : "bg-black/40 backdrop-blur-lg border-white/5 shadow-lg"
            }
          `}
        >
          {/* GLOW EFFECT: A subtle gradient orb behind the logo */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full pointer-events-none" />

          {/* LOGO SECTION */}
          <Link
            href={isAuthenticated ? "/feed" : "/"}
            className="relative flex items-center gap-3 group z-10"
          >
            <Image
              src={"/logo.png"}
              alt="Logo"
              width={96}
              height={32}
              className="relative w-full h-full object-contain drop-shadow-lg"
            />
          </Link>

          {/* NAV LINKS: Changed to 'Pill Tabs' style */}
          {path === "/" && (
            <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1 p-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
              <Link
                href="#features"
                className="px-4 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="px-4 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              >
                Testimonials
              </Link>
            </nav>
          )}

          {/* AUTH ACTIONS: Totally redesigned buttons */}
          <div className="flex items-center gap-3 z-10">
            <Unauthenticated>
              <SignInButton>
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex h-9 px-4 text-zinc-400 hover:text-white hover:bg-transparent font-medium text-sm tracking-wide hover:underline decoration-indigo-500 underline-offset-4"
                >
                  Log in
                </Button>
              </SignInButton>

              <SignUpButton>
                {/* BUTTON DESIGN: 'Shining Metal' Look */}
                <button className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-lg bg-white px-4 font-medium text-black transition-all duration-300 hover:bg-indigo-50 hover:w-auto hover:scale-105">
                  <span className="mr-2 size-4 transition-transform group-hover:-translate-x-1">
                    <Sparkles className="w-full h-full fill-indigo-500 text-indigo-600" />
                  </span>
                  <span className="text-sm font-bold tracking-tight">
                    Get Started
                  </span>
                  <div className="absolute inset-0 -z-10 bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-0 transition-opacity duration-500 group-hover:opacity-10 group-active:opacity-20" />
                </button>
              </SignUpButton>
            </Unauthenticated>

            <Authenticated>
              <Link href="/dashboard">
                <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 group">
                  <LayoutDashboard className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  <span>Dashboard</span>
                </button>
              </Link>

              {/* AVATAR: Added a ring container */}
              <div className="ml-2 p-0.5 rounded-full bg-linear-to-b from-white/20 to-transparent">
                <div className="p-px bg-black rounded-full">
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

          {/* LOADING BAR: Moved to a 'Cyber Line' at the bottom of the container */}
          {isLoading && (
            <div className="absolute bottom-0 left-4 right-4 h-px overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/20" />
              <BarLoader
                width={"100%"}
                color="#818cf8"
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
