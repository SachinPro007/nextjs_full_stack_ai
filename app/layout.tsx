import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ezensi.vercel.app/"),

  title: {
    default: "Ezensi | The AI-Native Blogging Platform",
    template: "%s | Ezensi",
  },
  description:
    "Draft faster, write better, and grow your audience with Ezensi. An AI-powered publishing platform designed for modern creators and developers.",

  keywords: [
    "AI Blogging",
    "Next.js Blog",
    "Content Creation",
    "Writing Assistant",
    "Developer Portfolio",
    "Ezensi",
  ],

  authors: [
    { name: "Sachin Sehrawat", url: "https://github.com/SachinPro007" },
  ],
  creator: "Sachin Sehrawat",

  // Open Graph (For LinkedIn, WhatsApp, Facebook)
  openGraph: {
    title: "Ezensi | The AI-Native Blogging Platform",
    description:
      "Experience the future of writing. AI-powered tools, real-time analytics, and a seamless reading experience.",
    url: "https://ezensi.vercel.app/",
    siteName: "Ezensi",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Ezensi.png",
        width: 1200,
        height: 630,
        alt: "Ezensi Platform Preview",
      },
    ],
  },

  // Twitter Card (For X/Twitter)
  twitter: {
    card: "summary_large_image",
    title: "Ezensi | The AI-Native Blogging Platform",
    description:
      "Draft faster, write better, and grow your audience with Ezensi.",
    images: ["/Ezensi.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen overflow-hidden">
              <ConvexClientProvider>
                <Header />
                {children}
              </ConvexClientProvider>
            </main>
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
