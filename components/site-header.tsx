import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

const nav = [{ href: "/about", label: "about" }];

export function SiteHeader() {
  return (
    <header className="flex items-baseline justify-between gap-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
      <Link
        href="/"
        className="text-[15px] font-medium tracking-tight text-zinc-900 transition-opacity duration-200 hover:opacity-60 dark:text-zinc-100"
      >
        {site.name}
      </Link>

      <nav className="flex items-center gap-5 text-[15px]">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-zinc-500 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {item.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
