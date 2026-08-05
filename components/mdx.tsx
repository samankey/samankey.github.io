import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";

/**
 * `defaultColor: false` makes Shiki emit both themes as CSS variables
 * (`--shiki-light` / `--shiki-dark`) instead of baking one in; globals.css
 * decides which one applies.
 */
const shikiOptions = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
  defaultColor: false,
} as const;

function Anchor({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const className =
    "underline decoration-zinc-300 decoration-1 underline-offset-[3px] transition-colors duration-200 hover:decoration-zinc-900 dark:decoration-zinc-600 dark:hover:decoration-zinc-100";

  if (href.startsWith("/")) {
    return <Link href={href} className={className} {...props} />;
  }

  return (
    <a
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noreferrer"}
      className={className}
      {...props}
    />
  );
}

const components = {
  a: Anchor,
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-12 mb-4 text-[17px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-10 mb-3 text-[15px] font-medium text-zinc-900 dark:text-zinc-100"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-5 text-[15px] leading-[1.8]" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="my-5 list-disc space-y-2 pl-5 text-[15px] leading-[1.8] marker:text-zinc-300 dark:marker:text-zinc-600" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="my-5 list-decimal space-y-2 pl-5 text-[15px] leading-[1.8] marker:text-zinc-400 dark:marker:text-zinc-500" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l border-zinc-200 pl-4 text-[15px] leading-[1.8] text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-zinc-200 dark:border-zinc-800" />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium text-zinc-900 dark:text-zinc-100" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-7 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[14px]" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border-b border-zinc-300 py-2 pr-4 font-medium text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border-b border-zinc-100 py-2 pr-4 dark:border-zinc-800" {...props} />
  ),
};

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypeShiki, shikiOptions]],
        },
      }}
    />
  );
}
