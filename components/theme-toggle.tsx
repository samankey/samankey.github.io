"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // `resolvedTheme` is only known on the client, so render a neutral
  // placeholder on the server pass and swap it in after hydration.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? (isDark ? "밝은 테마로 전환" : "어두운 테마로 전환") : "테마 전환"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="-mr-1.5 grid size-8 place-items-center rounded-md text-zinc-400 transition-colors duration-200 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none dark:text-zinc-500 dark:hover:text-zinc-100"
    >
      <span className="relative block size-4">
        <SunIcon
          className={`absolute inset-0 transition-all duration-300 ${
            mounted && isDark ? "scale-75 rotate-45 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        />
        <MoonIcon
          className={`absolute inset-0 transition-all duration-300 ${
            mounted && isDark ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-45 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="3.1" />
      <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3.05 3.05l1.13 1.13M11.82 11.82l1.13 1.13M12.95 3.05l-1.13 1.13M4.18 11.82l-1.13 1.13" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13.5 9.8A5.8 5.8 0 0 1 6.2 2.5 5.8 5.8 0 1 0 13.5 9.8Z" />
    </svg>
  );
}
