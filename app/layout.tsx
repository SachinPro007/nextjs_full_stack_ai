import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
// import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Header from "@/components/Header";
import { Toaster } from "sonner";

// const roboto = Roboto({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Ezensi | Ai Blogging Platform",
    template: "%s | Ai Blogging Platform",
  },
  description:
    "AI-powered writing, advanced analytics, and growth tools to help you build a thriving creator business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        theme: dark,
      }}
    >
      <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
        <body className={``}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen bg-[#030014] text-white overflow-hidden">
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
