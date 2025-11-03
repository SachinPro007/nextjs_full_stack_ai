"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Rocket,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle2,
  ArrowUpRight,
  PlayCircle,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

import {
  advancedCapabilities,
  comparisonFeatures,
  faqs,
  heroFeatures,
  keyFeatures,
  platforms,
  stats,
  testimonials,
  workflows,
} from "@/lib/data";
import { useStoreUser } from "@/hooks/use-store-user";

const Home = () => {
  const { isAuthenticated } = useStoreUser();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const dashOrSignUp = isAuthenticated ? "/dashboard" : "/sign-up";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-[#030014] text-white overflow-hidden">
      {/* Sophisticated background layers */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-purple-900/20 via-[#030014] to-[#030014]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% ${scrollY * 0.3}px, rgba(88, 28, 135, 0.15) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-32 pb-32 px-6"
      >
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="space-y-8">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </div>
                <span className="text-sm font-medium text-purple-300">
                  Trusted by 50K+ creators worldwide
                </span>
              </div>

              {/* Main headline */}
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight">
                  Create content that{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                      actually works
                    </span>
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      height="12"
                      viewBox="0 0 300 12"
                      fill="none"
                    >
                      <path
                        d="M2 10C50 5 100 3 150 5C200 7 250 8 298 10"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#A855F7" />
                          <stop offset="50%" stopColor="#EC4899" />
                          <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-2xl">
                  The all-in-one platform that combines AI-powered writing,
                  advanced analytics, and growth tools to help you build a
                  thriving creator business.
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-4">
                {heroFeatures.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                  >
                    <feature.icon className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href={dashOrSignUp}>
                  <Button
                    size="lg"
                    className="group relative h-14 px-8 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-2xl shadow-purple-500/50 transition-all hover:scale-105 hover:shadow-purple-500/70"
                  >
                    Start Creating for Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 border-2 border-white/20 hover:border-purple-500/50 hover:bg-purple-500/10 rounded-xl backdrop-blur-sm transition-all"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Social proof compact */}
              <div className="flex flex-wrap items-center gap-8 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[
                      "1580489944761-15a19d654956",
                      "1507003211169-0a1dd7228f2d",
                      "1544005313-94ddf0286df2",
                    ].map((id, i) => (
                      <div
                        key={i}
                        className="relative w-10 h-10 rounded-full border-2 border-[#030014] overflow-hidden ring-2 ring-purple-500/30"
                      >
                        <Image
                          src={`https://images.unsplash.com/photo-${id}?w=100&h=100&fit=crop`}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">
                      4.9/5 from 10K+ reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20" />

                {/* Main image container */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm p-4">
                  <Image
                    src="https://img.freepik.com/premium-vector/ai-powered-tools-illustration-featuring-ai-powered-data-analytics-automated-information-research-mobile-intelligent-interfaces-seo-advertising_2175-36581.jpg?w=1060"
                    alt="Platform"
                    width={700}
                    height={700}
                    className="w-full h-auto rounded-2xl"
                    priority
                  />
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl p-4 shadow-2xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Growth Rate
                      </div>
                      <div className="text-2xl font-bold text-white">+340%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-linear-to-br from-cyan-600 to-blue-600 rounded-2xl p-4 shadow-2xl animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Active Users
                      </div>
                      <div className="text-2xl font-bold text-white">2.5M+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by section */}
      <section className="relative py-20 px-6 border-y border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-12">
            Integrates with your favorite platforms
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {platforms.map((platform, i) => (
              <div
                key={i}
                className="flex items-center gap-3 hover:opacity-100 transition-opacity"
              >
                <platform.icon className="w-6 h-6 text-gray-400" />
                <span className="text-gray-400 font-medium">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="relative py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-purple-500/50 transition-all">
                  <div className="text-5xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-white mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500">{stat.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section
        id="features"
        className="relative py-32 px-6 bg-linear-to-b from-transparent via-purple-950/10 to-transparent"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-1.5 bg-purple-500/10 border-purple-500/20 text-purple-300">
              Powerful Features
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Everything you need to{" "}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                dominate
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Professional-grade tools that give you an unfair advantage in
              content creation, distribution, and growth.
            </p>
          </div>

          <div className="space-y-32">
            {keyFeatures.map((feature, i) => (
              <div
                key={i}
                className={`grid lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={`space-y-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div>
                    <Badge className="mb-4 px-3 py-1 bg-white/5 border-white/10 text-gray-300">
                      {feature.category}
                    </Badge>
                    <h3 className="text-4xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-lg text-gray-400">
                      {feature.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {feature.features.map((item, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={dashOrSignUp}>
                    <Button className="mt-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all">
                      Explore Feature
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${feature.gradient} rounded-3xl blur-3xl opacity-20`}
                  />
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm p-6">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={600}
                      height={600}
                      className="w-full h-auto rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities Grid */}
      <section className="relative py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-1.5 bg-purple-500/10 border-purple-500/20 text-purple-300">
              Advanced Capabilities
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Built for{" "}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                professionals
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedCapabilities.map((cap, i) => (
              <div
                key={i}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 rounded-2xl transition-all" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <cap.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-32 px-6 bg-linear-to-b from-purple-950/10 to-transparent">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-1.5 bg-purple-500/10 border-purple-500/20 text-purple-300">
              Simple Process
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Your workflow,{" "}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                simplified
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflows.map((workflow, i) => (
              <div key={i} className="relative">
                {i < workflows.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-linear-to-r from-purple-500 to-transparent" />
                )}
                <div className="relative">
                  <div className="text-6xl font-bold text-purple-500/20 mb-4">
                    {workflow.step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6">
                    <workflow.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{workflow.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {workflow.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="relative py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-1.5 bg-purple-500/10 border-purple-500/20 text-purple-300">
              Why Choose Us
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              We`re{" "}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                different
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how we stack up against other platforms
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">
                    Feature
                  </th>
                  <th className="text-center py-4 px-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-600 to-pink-600">
                      <span className="font-bold text-white">Our Platform</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-6 text-gray-400 font-medium">
                    Other Platforms
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-300">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.us === "boolean" ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                      ) : (
                        <span className="text-green-400 font-medium">
                          {feature.us}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.others === "boolean" ? (
                        feature.others ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
                            <Check className="w-5 h-5 text-green-400" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20">
                            <X className="w-5 h-5 text-red-400" />
                          </div>
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">
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

      {/* Testimonials */}
      <section
        id="testimonials"
        className="relative py-32 px-6 bg-linear-to-b from-transparent via-purple-950/10 to-transparent"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-1.5 bg-purple-500/10 border-purple-500/20 text-purple-300">
              Success Stories
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Loved by creators{" "}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                everywhere
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real results from real creators who transformed their content game
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="relative group bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 hover:bg-white/10 transition-all"
              >
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 rounded-3xl transition-all" />

                <div className="relative">
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    {/* eslint-disable-next-line */}"{testimonial.quote}"
                  </p>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    {Object.entries(testimonial.metrics).map(
                      ([key, value], j) => (
                        <div
                          key={j}
                          className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30"
                        >
                          <div className="text-sm text-gray-400 capitalize">
                            {key}
                          </div>
                          <div className="text-lg font-bold text-purple-300">
                            {value}
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="relative w-14 h-14 rounded-full border-2 border-purple-500/30 overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/photo-${testimonial.image}?w=100&h=100&fit=crop`}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-purple-400">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-32 px-6 bg-linear-to-b from-purple-950/10 to-transparent">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-1.5 bg-purple-500/10 border-purple-500/20 text-purple-300">
              FAQ
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Got{" "}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                questions?
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about the platform
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-white/10 transition-all"
              >
                <h3 className="text-lg font-bold mb-3 text-white">{faq.q}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-[3rem] blur-3xl opacity-30" />

            {/* Content */}
            <div className="relative bg-linear-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-[3rem] p-16 text-center backdrop-blur-sm">
              <h2 className="text-5xl lg:text-6xl font-bold mb-6">
                Ready to transform your content?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join 50,000+ creators already building their audience and
                growing their business with our platform.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <Link href={dashOrSignUp}>
                  <Button
                    size="lg"
                    className="h-14 px-10 bg-white text-purple-900 hover:bg-gray-100 font-bold rounded-xl transition-all hover:scale-105"
                  >
                    Get Started Free
                    <Rocket className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={dashOrSignUp}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-10 border-2 border-white/30 hover:border-white/50 hover:bg-white/10 rounded-xl backdrop-blur-sm"
                  >
                    Explore Content
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={120} height={40} />
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <Link
                href="#features"
                className="hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="hover:text-white transition-colors"
              >
                Testimonials
              </Link>
              <Link href="/feed" className="hover:text-white transition-colors">
                Feed
              </Link>
              <Link
                href={dashOrSignUp}
                className="hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              © 2025 Ezensi. All rights reserved. Developed by{" "}
              <a
                href="https://sachinpro.vercel.app/"
                target="_blank"
                className="text-purple-700 text-xl underline cursor-pointer hover:text-pink-700"
              >
                Sachin
              </a>
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
