import {
  Zap,
  Shield,
  Rocket,
  Users,
  TrendingUp,
  BarChart3,
  PenTool,
  Calendar,
  Search,
  ImageIcon,
  Globe,
  Lightbulb,
  Target,
  Workflow,
  Database,
  Lock,
  Gauge,
  Palette,
  Code,
} from "lucide-react";

export const heroFeatures = [
  { icon: Zap, text: "10x faster content creation" },
  { icon: Target, text: "AI-powered insights" },
  { icon: TrendingUp, text: "Proven growth strategies" },
];

export const platforms = [
  { name: "AI Writing", icon: PenTool },
  { name: "Analytics", icon: BarChart3 },
  { name: "Automation", icon: Workflow },
  { name: "Community", icon: Users },
  { name: "Publishing", icon: Globe },
  { name: "Security", icon: Shield },
];

export const keyFeatures = [
  {
    category: "Content Creation",
    title: "AI-Powered Writing Studio",
    description:
      "Transform ideas into compelling narratives with our advanced AI engine. Get real-time suggestions, tone adjustments, and SEO optimization.",
    icon: PenTool,
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    features: [
      "GPT-4 powered suggestions",
      "Real-time grammar & style",
      "SEO optimization engine",
      "Multi-language support",
      "Plagiarism detection",
      "Content templates library",
    ],
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765",
  },
  {
    category: "Analytics",
    title: "Deep Performance Insights",
    description:
      "Understand what drives engagement with comprehensive analytics. Track every metric that matters and make data-driven decisions.",
    icon: BarChart3,
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    features: [
      "Real-time view tracking",
      "Engagement heatmaps",
      "Audience demographics",
      "Content performance AI",
      "Competitor analysis",
      "Custom reporting",
    ],
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765",
  },
  {
    category: "Growth",
    title: "Audience Building Engine",
    description:
      "Grow your reach exponentially with intelligent distribution and community management tools designed for modern creators.",
    icon: Users,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    features: [
      "Smart content distribution",
      "Follower growth automation",
      "Engagement optimizer",
      "Community moderation",
      "Influencer collaboration",
      "Newsletter integration",
    ],
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765",
  },
];

export const advancedCapabilities = [
  {
    icon: ImageIcon,
    title: "Advanced Media Studio",
    desc: "Professional image editing with AI background removal, smart cropping, filters, and text overlays.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "AI-powered optimal posting times, content calendar, and automatic publishing across platforms.",
  },
  {
    icon: Workflow,
    title: "Automation Workflows",
    desc: "Set up automated content pipelines, cross-posting, and engagement responses.",
  },
  {
    icon: Search,
    title: "Content Discovery",
    desc: "Curated feed algorithm, trending topics, and personalized content recommendations.",
  },
  {
    icon: Database,
    title: "Content Library",
    desc: "Organize, tag, and search through your entire content archive with AI-powered search.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    desc: "Bank-level encryption, 2FA, role-based access, and compliance certifications.",
  },
  {
    icon: Gauge,
    title: "Performance Optimization",
    desc: "Lightning-fast loading, CDN delivery, and optimized media serving worldwide.",
  },
  {
    icon: Code,
    title: "Developer API",
    desc: "RESTful API, webhooks, and SDK for custom integrations and automation.",
  },
  {
    icon: Palette,
    title: "Brand Customization",
    desc: "Custom domains, white-labeling, brand kits, and design system management.",
  },
];

export const stats = [
  { number: "50K+", label: "Active Creators", sublabel: "Growing daily" },
  { number: "2.5M+", label: "Content Pieces", sublabel: "Published" },
  { number: "15M+", label: "Monthly Readers", sublabel: "Worldwide" },
  { number: "4.9/5", label: "Creator Rating", sublabel: "10K+ reviews" },
];

export const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Tech Content Creator",
    company: "TechVoice Media",
    image: "1580489944761-15a19d654956",
    quote:
      "This platform revolutionized my content workflow. What used to take me 6 hours now takes 45 minutes. The AI writing assistant is frighteningly good.",
    metrics: { growth: "+340%", time: "5hrs saved/week" },
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Newsletter Entrepreneur",
    company: "GrowthLetters",
    image: "1507003211169-0a1dd7228f2d",
    quote:
      "I've tried every platform out there. This is the only one that actually helped me scale from 1K to 50K subscribers in 8 months. The analytics alone are worth it.",
    metrics: { growth: "+5000%", subscribers: "50K" },
    rating: 5,
  },
  {
    name: "Elena Chen",
    role: "Content Strategist",
    company: "Digital Narratives",
    image: "1544005313-94ddf0286df2",
    quote:
      "The ROI is insane. My client engagement tripled, and I'm managing 3x more accounts with less stress. This is what professional content tools should be.",
    metrics: { engagement: "+285%", clients: "3x more" },
    rating: 5,
  },
  {
    name: "David Park",
    role: "Marketing Director",
    company: "SaaS Ventures",
    image: "1506794778202-cad84cf45f1d",
    quote:
      "We consolidated 5 different tools into this one platform. The team collaboration features and analytics dashboard are enterprise-grade quality.",
    metrics: { saved: "$24K/year", efficiency: "+220%" },
    rating: 5,
  },
];

export const comparisonFeatures = [
  { name: "AI Writing Assistant", us: true, others: "Limited" },
  { name: "Advanced Analytics", us: true, others: "Basic" },
  { name: "Unlimited Content", us: true, others: false },
  { name: "API Access", us: true, others: "Paid Add-on" },
  { name: "Priority Support", us: true, others: false },
  { name: "Custom Branding", us: true, others: "Enterprise Only" },
  { name: "Multi-user Collaboration", us: true, others: "Limited" },
  { name: "White-label Options", us: true, others: false },
];

export const workflows = [
  {
    step: "01",
    title: "Ideate & Plan",
    description:
      "Use AI to brainstorm topics, generate outlines, and plan your content calendar with data-driven insights.",
    icon: Lightbulb,
  },
  {
    step: "02",
    title: "Create & Polish",
    description:
      "Write with AI assistance, add media, optimize for SEO, and perfect your content with real-time suggestions.",
    icon: PenTool,
  },
  {
    step: "03",
    title: "Publish & Distribute",
    description:
      "Schedule optimal posting times, cross-post to multiple platforms, and reach your audience effectively.",
    icon: Rocket,
  },
  {
    step: "04",
    title: "Analyze & Grow",
    description:
      "Track performance, understand engagement patterns, and use insights to continuously improve and grow.",
    icon: TrendingUp,
  },
];

export const faqs = [
  {
    q: "How does the AI writing assistant work?",
    a: "Our AI uses advanced language models to provide contextual suggestions, grammar corrections, style improvements, and SEO optimization in real-time as you write.",
  },
  {
    q: "Can I migrate my existing content?",
    a: "Yes! We provide easy import tools for all major platforms including WordPress, Medium, Substack, and more. Your content, images, and metadata transfer seamlessly.",
  },
  {
    q: "Is there a limit on content creation?",
    a: "On paid plans, you get unlimited posts, drafts, and revisions. Free plan is limited to 5 posts per month.",
  },
  {
    q: "What kind of analytics do you provide?",
    a: "Comprehensive analytics including views, engagement rates, reader demographics, traffic sources, content performance, growth trends, and AI-powered insights.",
  },
  {
    q: "Do you offer team collaboration features?",
    a: "Yes! Business plans include multi-user access, role-based permissions, commenting, version history, and workflow management.",
  },
  {
    q: "How secure is my content?",
    a: "We use bank-level encryption, regular security audits, SOC 2 compliance, automatic backups, and 2FA. Your content is always safe and private.",
  },
];
