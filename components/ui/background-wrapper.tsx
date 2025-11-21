import React from "react";

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

export const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-zinc-950 selection:bg-indigo-500/30">
      {/* 1. Subtle Grid Pattern */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white dark:bg-zinc-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* 2. The "AI Glow" - A radial gradient at the top center */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px] dark:opacity-30"></div>

      {/* 3. Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
