"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Wand2, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateSmartSuggestion } from "@/app/actions/gemini";
import { toast } from "sonner";

function HomeAiDemo({ dashOrSignUp }: { dashOrSignUp: string }) {
  // --- AI DEMO STATE ---
  const [suggestion, setSuggestion] = useState<string>("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const getAiAdvice = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setHasGenerated(true);
    setSuggestion("");
    setDisplayedText("");

    try {
      const res = (await generateSmartSuggestion(input)) as {
        success: boolean;
        content?: string;
        error?: string;
      };

      if (res.success && res.content) {
        setSuggestion(res.content);
      } else {
        console.error("AI Error:", res.error); // See the error in browser console
        toast.error(res.error || "Something went wrong. Try again.");
        setHasGenerated(false); // Reset UI so they can try again
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to connect to server.");
        setHasGenerated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Typewriter Effect
  useEffect(() => {
    if (suggestion && !isLoading) {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayedText(suggestion.substring(0, i + 1));
        i++;
        if (i === suggestion.length) clearInterval(timer);
      }, 20);
      return () => clearInterval(timer);
    }
  }, [suggestion, isLoading]);

  return (
    <div className="relative hidden lg:block perspective-1000 mt-10 lg:mt-0">
      {/* EXPLANATORY LABEL: Background */}
      <div className="absolute -left-12 top-20 z-20 hidden xl:flex items-center gap-2 animate-in fade-in slide-in-from-right-4 delay-700">
        <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
          1. You write content
        </span>
        <ArrowRight className="w-4 h-4 text-slate-300" />
      </div>

      {/* LAYER 1: The "Blurred" Full Editor (To show context) */}
      <div className="relative rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden opacity-40 scale-95 blur-[1px] select-none pointer-events-none transform rotate-1 origin-bottom-right">
        <div className="h-8 border-b border-slate-100 bg-slate-50 flex items-center px-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
        </div>
        <div className="p-8 space-y-4">
          <div className="h-8 w-3/4 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-5/6 bg-slate-100 rounded" />
          <div className="h-32 w-full bg-slate-50 rounded border border-slate-100" />
        </div>
      </div>

      {/* EXPLANATORY LABEL: Foreground */}
      <div className="absolute -right-8 top-1/2 z-20 hidden xl:flex items-center gap-2 animate-in fade-in slide-in-from-left-4 delay-1000">
        <ArrowRight className="w-4 h-4 text-indigo-400 rotate-180" />
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded shadow-sm border border-indigo-100">
          2. AI helps you polish
        </span>
      </div>

      {/* LAYER 2: The "Active" AI Assistant (The Hero Feature) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl border border-indigo-100 shadow-[0_20px_50px_-12px_rgba(79,70,229,0.2)] overflow-hidden animate-in zoom-in-95 duration-700">
          {/* AI Header */}
          <div className="bg-linear-to-r from-indigo-600 to-violet-600 p-1">
            <div className="bg-white rounded-t-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Ezensi AI Assistant
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Try it live below
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Body */}
          <div className="p-6">
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              What do you want to write?
            </label>

            <div className="relative">
              <Input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setHasGenerated(false);
                }}
                placeholder="e.g., Intro for a React tutorial..."
                className="pr-10 border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
              />
              <div className="absolute right-3 top-2.5">
                <Wand2 className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="mt-4">
              {!hasGenerated ? (
                <Button
                  onClick={getAiAdvice}
                  disabled={!input || isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 transition-all"
                >
                  {isLoading ? "Generating..." : "Generate Preview"}
                </Button>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100 mb-4">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {displayedText}
                      <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-1 align-middle animate-pulse" />
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setHasGenerated(false);
                        setInput("");
                      }}
                      className="flex-1 text-slate-500 border-slate-200 hover:text-indigo-600"
                    >
                      Try Another
                    </Button>
                    <Link href={dashOrSignUp}>
                      <Button
                        size="sm"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Use in Editor
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400">
              <span className="font-bold text-indigo-500">Note:</span> This is a
              limited demo. The full app handles entire posts.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Cursor Element */}
      <div className="absolute bottom-20 right-10 bg-white/80 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-full shadow-lg animate-bounce delay-1000 hidden xl:flex items-center gap-2">
        <MousePointer2 className="w-4 h-4 text-indigo-500 fill-indigo-500" />
        <span className="text-xs font-bold text-slate-600">
          Drag & Drop Blocks
        </span>
      </div>
    </div>
  );
}

export default HomeAiDemo;
