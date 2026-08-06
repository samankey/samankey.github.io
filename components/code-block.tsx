"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";

type CodeBlockProps = ComponentPropsWithoutRef<"pre"> & {
  /** Stamped onto the `pre` by the filename transformer in mdx.tsx. */
  "data-filename"?: string;
};

/**
 * Wraps Shiki's `pre` — every prop it emits (the theme classes and the
 * per-token CSS variables in `style`) has to be spread straight through, so
 * this only adds a frame around it.
 */
export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const filename = props["data-filename"];
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    const text = preRef.current?.innerText;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Insecure context or a denied permission — say nothing rather than
      // flashing a success state for a copy that did not happen.
      return;
    }

    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 1500);
  }

  return (
    <figure className="code-block group">
      {filename && <figcaption>{filename}</figcaption>}

      <button
        type="button"
        onClick={copy}
        aria-label={`${filename ?? "코드"} 복사`}
        className={`absolute right-2.5 z-10 rounded px-1.5 py-0.5 font-mono text-[11.5px] text-zinc-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:outline-none hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 ${
          filename ? "top-1.5" : "top-2.5"
        }`}
      >
        {copied ? "copied" : "copy"}
      </button>

      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </figure>
  );
}
