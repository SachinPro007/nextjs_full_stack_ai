"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function PublicHeader({ link, title }: { link: string; title: string }) {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for that "premium app" feel
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
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
          {/* Back Button */}
          <Link href={link}>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium text-sm tracking-wide gap-2 pl-2 pr-4 rounded-xl transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              {title}
            </Button>
          </Link>

          {/* Brand Logo (Matches Home/Footer Style) */}
          <Link href={"/"} className="shrink-0 group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 transition-transform group-hover:scale-105 group-hover:rotate-3">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                Ezensi
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;
