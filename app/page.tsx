"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStoreUser } from "@/hooks/use-store-user";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Share2,
  Code2,
  Check,
  X,
  ChevronDown,
  Wand2,
  PenTool,
  Zap,
  Globe,
  MousePointer2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateSmartSuggestion } from "./actions/gemini";

import {
  comparisonFeatures,
  faqs,
  keyFeatures,
  platforms,
  testimonials,
  workflows,
} from "@/lib/data";

const Home = () => {
  const { isAuthenticated } = useStoreUser();
  const dashOrSignUp = isAuthenticated ? "/dashboard" : "/sign-up";

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

    // Call the Server Action
    const res = await generateSmartSuggestion(input);

    if (res.success && res.content) {
      setSuggestion(res.content);
      setIsLoading(false);
    } else {
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
    <div className="relative min-h-screen bg-white text-slate-900 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Modern Dot Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-60" />
        {/* Soft Blue Gradient Top Right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/80 blur-[100px] rounded-full opacity-70" />
        {/* Soft Purple Gradient Bottom Left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-50/80 blur-[100px] rounded-full opacity-70" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Value Proposition */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm transition-transform hover:scale-105 cursor-default">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">
                Ezensi v2.0 • AI-Native Editor
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              The Editor that <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
                Thinks With You.
              </span>
            </h1>

            <div className="space-y-4">
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Writing technical blogs is hard. Ezensi is a{" "}
                <strong>full-screen block editor</strong> with a built-in Gemini
                AI assistant that helps you research, draft, and polish in
                seconds.
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  <span>
                    Generate intros, summaries, and SEO tags instantly.
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  <span>
                    Distraction-free, block-based writing environment.
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  <span>One-click publish to your custom domain.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href={dashOrSignUp}>
                <Button className="h-14 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1">
                  Start Writing Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-base font-semibold shadow-sm transition-all"
                >
                  Explore Community
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              * No credit card required. Free tier forever.
            </p>
          </div>

          {/* Right: The "Contextual" Demo */}
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
                    <span className="font-bold text-indigo-500">Note:</span>{" "}
                    This is a limited demo. The full app handles entire posts.
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
        </div>
      </section>

      {/* --- LOGO CLOUD --- */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
            Powering Technical Blogs At
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {platforms.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2 group cursor-default"
              >
                <p.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span className="font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENTO GRID CAPABILITIES --- */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Built for Technical Writing
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              A comprehensive content platform that combines a modern editor
              with advanced AI capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
            {/* Large Card 1: The Editor */}
            <div className="md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 p-8 relative overflow-hidden group hover:border-indigo-200 transition-colors">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Block-Based Editor
                </h3>
                <p className="text-slate-600 max-w-md leading-relaxed">
                  A clean, distraction-free writing environment. Supports
                  Markdown formatting, code blocks with syntax highlighting, and
                  easy media embedding.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-1/3 h-full bg-linear-to-l from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Small Card 2: SEO */}
            <div className="rounded-3xl bg-white border border-slate-200 p-8 group hover:shadow-xl hover:shadow-indigo-100/50 transition-all">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                SEO Optimized
              </h3>
              <p className="text-slate-600 text-sm">
                Automatically generates static sitemaps and meta tags to ensure
                your content is indexed correctly.
              </p>
            </div>

            {/* Small Card 3: Branding/Tech */}
            <div className="rounded-3xl bg-white border border-slate-200 p-8 group hover:shadow-xl hover:shadow-indigo-100/50 transition-all">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4 text-violet-600">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Custom Branding
              </h3>
              <p className="text-slate-600 text-sm">
                Personalize your blog&apos;s appearance to match your personal
                brand or portfolio identity.
              </p>
            </div>

            {/* Large Card 4: AI */}
            <div className="md:col-span-2 rounded-3xl bg-indigo-600 text-white p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  Integrated Gemini AI
                </h3>
                <p className="text-indigo-100 max-w-md leading-relaxed">
                  Directly access Google&apos;s Gemini model within the editor
                  to generate ideas, draft sections, or summarize your technical
                  concepts.
                </p>
              </div>
              {/* Decorative Circles */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* --- KEY FEATURES --- */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-32">
          {keyFeatures.map((feature, i) => (
            <div
              key={i}
              className={`flex flex-col lg:flex-row gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                  <feature.icon className="w-4 h-4" />
                  {feature.category}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feature.features.map((item, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 text-slate-700"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full">
                {/* Mock UI Card representing the Feature Image */}
                <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl p-2 group hover:border-indigo-200 transition-all">
                  <div className="rounded-xl overflow-hidden bg-slate-100 aspect-video relative">
                    {/* Replace this div with <Image /> if you have real URLs */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      {/* Mocking an interface */}
                      <div className="w-3/4 h-3/4 bg-white rounded-lg shadow-sm p-4 space-y-3">
                        <div className="h-4 w-1/3 bg-slate-200 rounded" />
                        <div className="h-2 w-full bg-slate-100 rounded" />
                        <div className="h-2 w-full bg-slate-100 rounded" />
                        <div className="h-2 w-2/3 bg-slate-100 rounded" />
                        {/* Active Element */}
                        <div className="mt-4 p-3 bg-indigo-50 rounded border border-indigo-100 flex gap-2 items-center">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <div className="h-2 w-1/2 bg-indigo-200 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- COMPARISON TABLE --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              Why developers switch to Ezensi
            </h2>
            <p className="text-slate-600">
              Stop wrestling with WordPress or raw Markdown files.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="py-5 px-6 text-left text-slate-500 font-medium text-sm uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="py-5 px-6 text-center text-indigo-600 font-bold bg-indigo-50/50 border-x border-slate-100">
                    Ezensi
                  </th>
                  <th className="py-5 px-6 text-center text-slate-400 font-medium">
                    Others
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0"
                  >
                    <td className="py-4 px-6 text-slate-700 font-medium">
                      {feature.name}
                    </td>
                    <td className="py-4 px-6 text-center bg-indigo-50/10 border-x border-slate-50">
                      {feature.us === true ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                          <Check className="w-4 h-4 text-indigo-600" />
                        </div>
                      ) : (
                        <span className="text-indigo-600 font-bold text-sm">
                          {feature.us}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.others === false ? (
                        <X className="w-5 h-5 text-slate-300 mx-auto" />
                      ) : (
                        <span className="text-slate-400 text-sm">
                          {feature.others}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900">
            From Idea to Publish
          </h2>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-slate-200 border-t border-dashed border-slate-300" />

            {workflows.map((flow, i) => (
              <div key={i} className="relative pt-4 group text-center">
                <div className="w-16 h-16 mx-auto bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center relative z-10 shadow-sm group-hover:-translate-y-2 group-hover:border-indigo-200 group-hover:shadow-indigo-100 transition-all duration-300">
                  <flow.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {flow.title}
                  </h3>
                  <p className="text-sm text-slate-500 px-2">
                    {flow.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900">
            Trusted by Engineering Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className="w-4 h-4 bg-amber-400 rounded-sm"
                    />
                  ))}
                </div>
                <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 relative overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/photo-${t.image}?w=100&h=100&fit=crop`}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-500">
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Common Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 open:shadow-md open:border-indigo-200"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-lg font-medium text-slate-700 hover:text-indigo-600">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 relative bg-slate-900 text-white overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to ship your content?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of developers using Ezensi to share their knowledge
            with the world.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={dashOrSignUp}>
              <Button className="h-14 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-900/50 hover:scale-105 transition-transform">
                Get Started Free
              </Button>
            </Link>
            <Link href="/feed">
              <Button
                variant="outline"
                className="h-14 px-10 rounded-xl border-slate-700 bg-transparent text-white hover:bg-white/10 text-lg"
              >
                View Feed
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Ezensi</span>
          </div>

          <div className="text-slate-500 text-sm">
            © 2025 Ezensi. Built for the modern web. Build with ❤ Sachin
          </div>

          <div className="flex gap-6 text-slate-400">
            <Link href="#" className="hover:text-indigo-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">
              <Code2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
