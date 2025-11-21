"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStoreUser } from "@/hooks/use-store-user";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  // Terminal,
  Share2,
  Code2,
  Check,
  X,
  ChevronDown,
  // Zap,
  // Shield,
  // Database,
  // Bot,
  Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

// Import your exact data
import {
  advancedCapabilities,
  comparisonFeatures,
  faqs,
  heroFeatures,
  keyFeatures,
  platforms,
  // stats,
  testimonials,
  workflows,
} from "@/lib/data";

const Home = () => {
  const { isAuthenticated } = useStoreUser();
  const dashOrSignUp = isAuthenticated ? "/dashboard" : "/sign-up";

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden selection:bg-blue-500/30 selection:text-blue-100">
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Top Light Source - Soft Blue */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-blue-600/20 blur-[120px] rounded-full opacity-50" />
        {/* Bottom Light Source - Soft Indigo */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full opacity-50" />
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[32px_32px] opacity-20" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-36 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* Pill Badge - Cleaner Look */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-semibold text-blue-200 tracking-wide uppercase">
                v2.0 is Live
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              The Intelligent <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
                Content Platform
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Ezensi combines a powerful block-based editor with Google&apos;s
              Gemini AI. Write, edit, and publish faster than ever before.
            </p>

            {/* Feature Pills - Lighter and Friendlier */}
            <div className="flex flex-wrap gap-3">
              {heroFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                >
                  <feature.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href={dashOrSignUp}>
                {/* Primary Button: Solid Blue/Indigo - High Trust Color */}
                <Button className="h-12 px-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]">
                  Start Writing Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button
                  variant="outline"
                  className="h-12 px-8 rounded-lg border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white text-base transition-all"
                >
                  <Layout className="mr-2 w-5 h-5 text-slate-400" />
                  View Feed
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Visual (Clean SaaS Dashboard Look) */}
          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
            {/* Shadow instead of Glow */}
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full opacity-50" />

            <div className="relative rounded-xl border border-slate-700 bg-[#0f172a] shadow-2xl overflow-hidden">
              {/* Mock Window Bar */}
              <div className="h-10 border-b border-slate-700 bg-slate-900/50 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-600" />
                  <div className="w-3 h-3 rounded-full bg-slate-600" />
                </div>
                <div className="text-xs font-medium text-slate-500">
                  New Post
                </div>
                <div className="w-4" />
              </div>

              {/* Mock Editor UI - Clean & Readable */}
              <div className="p-8 bg-[#0f172a]">
                {/* Title Placeholder */}
                <div className="h-8 w-3/4 bg-slate-800 rounded-md mb-6 animate-pulse" />

                {/* Text Lines */}
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-800/50 rounded-sm" />
                  <div className="h-4 w-[90%] bg-slate-800/50 rounded-sm" />
                  <div className="h-4 w-[95%] bg-slate-800/50 rounded-sm" />
                </div>

                {/* AI Popover Visualization */}
                <div className="mt-8 p-4 rounded-lg border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Gemini AI Suggestion
                  </div>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    &quot;Consider expanding this section to include real-world
                    examples. This will improve reader engagement by 25%.&quot;
                  </p>
                  <div className="mt-3 flex gap-2">
                    <div className="px-3 py-1 rounded bg-blue-600 text-xs font-bold text-white">
                      Accept
                    </div>
                    <div className="px-3 py-1 rounded bg-blue-900/50 text-xs font-bold text-blue-300">
                      Try Again
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LOGO CLOUD (TRUST) --- */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
            Built with industry standard tech
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {platforms.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2 group cursor-default"
              >
                <p.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                <span className="font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 1: CAPABILITIES --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Engineered for Growth
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to build, scale, and manage your content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedCapabilities.map((cap, i) => (
              <div
                key={i}
                className="group p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 hover:bg-slate-800/80 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors border border-slate-700">
                  <cap.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                </div>

                <h3 className="text-lg font-bold mb-2 text-slate-100">
                  {cap.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 2: KEY FEATURES --- */}
      <section className="py-24 px-6 bg-slate-900/20">
        <div className="max-w-7xl mx-auto space-y-32">
          {keyFeatures.map((feature, i) => (
            <div
              key={i}
              className={`flex flex-col lg:flex-row gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold">
                  <feature.icon className="w-4 h-4" />
                  {feature.category}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {feature.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {feature.features.map((item, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 text-slate-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full">
                {/* Image Card */}
                <div className="relative rounded-xl border border-slate-700 bg-slate-800 overflow-hidden shadow-2xl group hover:border-slate-600 transition-all">
                  <div className="aspect-video relative">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 3: COMPARISON --- */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why developers switch</h2>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="py-5 px-6 text-left text-slate-400 font-medium text-sm uppercase">
                    Feature
                  </th>
                  <th className="py-5 px-6 text-center text-blue-400 font-bold">
                    Ezensi
                  </th>
                  <th className="py-5 px-6 text-center text-slate-600 font-medium">
                    Others
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-slate-300 font-medium">
                      {feature.name}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.us === true ? (
                        <Check className="w-5 h-5 text-blue-500 mx-auto" />
                      ) : (
                        <span className="text-blue-400 font-bold text-sm">
                          {feature.us}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.others === false ? (
                        <X className="w-5 h-5 text-slate-600 mx-auto" />
                      ) : (
                        <span className="text-slate-600 text-sm">
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
      <section className="py-24 px-6 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How Ezensi Works
          </h2>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-slate-800" />

            {workflows.map((flow, i) => (
              <div key={i} className="relative pt-4 group text-center">
                <div className="w-16 h-16 mx-auto bg-slate-900 border-4 border-slate-950 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                  <flow.icon className="w-6 h-6 text-blue-500" />
                </div>
                <div className="mt-6">
                  <div className="text-xs font-bold text-blue-500 mb-2 tracking-widest">
                    STEP 0{i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {flow.title}
                  </h3>
                  <p className="text-sm text-slate-400 px-2">
                    {flow.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Trusted by Developers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 relative overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/photo-${t.image}?w=100&h=100&fit=crop`}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
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
      <section className="py-24 px-6 bg-slate-900/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Questions?</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-all duration-300 open:bg-slate-800"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-lg font-medium text-slate-300 hover:text-white">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Ready to build your audience?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join the platform designed for modern technical writing.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={dashOrSignUp}>
              <Button className="h-14 px-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-900/20">
                Get Started Free
              </Button>
            </Link>
            <Link href="/feed">
              <Button
                variant="outline"
                className="h-14 px-10 rounded-lg border-slate-700 text-white hover:bg-slate-800 text-lg"
              >
                View Feed
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Ezensi</span>
          </div>

          <div className="text-slate-500 text-sm">
            © 2025 Ezensi. Built with Next.js 16 & Convex.
          </div>

          <div className="flex gap-6 text-slate-400">
            <Link href="#" className="hover:text-blue-400 transition-colors">
              <Share2 className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">
              <Code2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
