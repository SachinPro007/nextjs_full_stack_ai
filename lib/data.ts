import {
  Zap,
  Shield,
  Globe,
  Database,
  Code,
  Sparkles,
  Layout,
  Bot,
  Terminal,
  Fingerprint,
  Repeat,
} from "lucide-react";

export const heroFeatures = [
  { icon: Bot, text: "Powered by Google Gemini" },
  { icon: Database, text: "Real-time Convex DB" },
  { icon: Fingerprint, text: "Secure Clerk Auth" },
];

export const platforms = [
  { name: "Next.js 16", icon: Globe },
  { name: "Convex", icon: Database },
  { name: "Clerk", icon: Shield },
  { name: "Tailwind v4", icon: Layout },
  { name: "TypeScript", icon: Code },
  { name: "Gemini AI", icon: Sparkles },
];

export const keyFeatures = [
  {
    category: "Core Engine",
    title: "Google Gemini Powered Editor",
    description:
      "Experience the future of writing. Our editor integrates Google's latest GenAI models to help you draft, edit, and refine content in milliseconds.",
    icon: Bot,
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    features: [
      "Context-aware text generation",
      "Automatic tone adjustment",
      "Grammar & syntax correction",
      "One-click summarization",
      "SEO-optimized suggestions",
      "Real-time collaboration",
    ],
    // Keep your existing image or use a placeholder for the editor UI
    image:
      "https://img.freepik.com/free-vector/artificial-intelligence-concept-illustration_114360-7970.jpg?w=1060",
  },
  {
    category: "Backend Architecture",
    title: "Real-Time Sync with Convex",
    description:
      "Forget manual refreshing. Built on Convex, Ezensi syncs data instantly across all clients. Write on one device, see it on another.",
    icon: Database,
    gradient: "from-orange-500 via-red-500 to-yellow-500",
    features: [
      "End-to-end type safety",
      "Real-time subscriptions",
      "Automatic caching",
      "Optimistic UI updates",
      "Serverless functions",
      "Zero-config backend",
    ],
    image:
      "https://img.freepik.com/free-vector/server-room-concept-illustration_114360-4582.jpg?w=1060",
  },
  {
    category: "Security",
    title: "Enterprise-Grade Auth",
    description:
      "Secured by Clerk. We handle user sessions, multi-factor authentication, and route protection so you don't have to worry about data breaches.",
    icon: Shield,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    features: [
      "Social logins (Google, GitHub)",
      "Multi-factor authentication",
      "Session management",
      "User profile customization",
      "Role-based access control",
      "Bot protection",
    ],
    image:
      "https://img.freepik.com/free-vector/secure-login-concept-illustration_114360-4685.jpg?w=1060",
  },
];

export const advancedCapabilities = [
  {
    icon: Zap,
    title: "Instant Deployments",
    desc: "Optimized for Vercel Edge Network with Next.js 16 capabilities.",
  },
  {
    icon: Terminal,
    title: "Type-Safe API",
    desc: "Full TypeScript support from database schema to frontend components.",
  },
  {
    icon: Repeat,
    title: "Reactive UI",
    desc: "Built with React 19 and Convex to handle state updates instantly.",
  },
  {
    icon: Layout,
    title: "Responsive Design",
    desc: "Mobile-first UI built with Tailwind CSS v4 and Radix Primitives.",
  },
  {
    icon: Sparkles,
    title: "AI Image Gen",
    desc: "Generate cover images for your blogs using integrated AI tools.",
  },
  {
    icon: Code,
    title: "Modern Stack",
    desc: "Leveraging the latest features of Next.js App Router and Server Actions.",
  },
];

export const stats = [
  { number: "0.1s", label: "Latency", sublabel: "Global Edge Network" },
  { number: "99%", label: "Uptime", sublabel: "Serverless Architecture" },
  { number: "100%", label: "Type Safe", sublabel: "End-to-end TypeScript" },
  { number: "AI", label: "Native", sublabel: "Built-in LLM Support" },
];

export const testimonials = [
  {
    name: "Alex Chen",
    role: "Senior Developer",
    company: "TechFlow",
    image: "1507003211169-0a1dd7228f2d",
    quote:
      "The integration of Google Gemini with a WYSIWYG editor is seamless. It feels like having a pair programmer but for writing technical blogs.",
    metrics: { efficiency: "2x Faster" },
    rating: 5,
  },
  {
    name: "Sarah Miller",
    role: "Technical Writer",
    company: "DevCorp",
    image: "1580489944761-15a19d654956",
    quote:
      "Finally, a blogging platform that understands developers. The code highlighting is perfect, and the real-time sync is magic.",
    metrics: { publishing: "Instant" },
    rating: 5,
  },
];

export const comparisonFeatures = [
  { name: "Real-time DB (Convex)", us: true, others: false },
  { name: "AI Writing (Gemini)", us: true, others: "Paid Plugin" },
  { name: "Type-Safety", us: "100%", others: "Partial" },
  { name: "Auth (Clerk)", us: "Enterprise", others: "Basic" },
  { name: "Modern UI (Tailwind 4)", us: true, others: false },
];

export const workflows = [
  {
    step: "01",
    title: "Authenticate",
    description: "Secure login via Clerk using Email or Social Providers.",
    icon: Fingerprint,
  },
  {
    step: "02",
    title: "Create",
    description:
      "Draft content with Gemini AI assistance in our rich text editor.",
    icon: Bot,
  },
  {
    step: "03",
    title: "Store",
    description: "Data saves instantly to Convex DB with automatic validation.",
    icon: Database,
  },
  {
    step: "04",
    title: "Publish",
    description: "Content goes live globally via Next.js Edge Runtime.",
    icon: Globe,
  },
];

export const faqs = [
  {
    q: "What AI model does Ezensi use?",
    a: "Ezensi integrates Google's Gemini Pro model for high-performance text generation and analysis.",
  },
  {
    q: "Is the database real-time?",
    a: "Yes, we use Convex, which provides websocket-based real-time updates. You never need to refresh the page.",
  },
  {
    q: "How secure is the authentication?",
    a: "We rely on Clerk, an industry-standard authentication provider that handles 2FA, session management, and security best practices.",
  },
  {
    q: "Is this project open source?",
    a: "This is a portfolio project demonstrating modern full-stack capabilities with Next.js 16.",
  },
];
