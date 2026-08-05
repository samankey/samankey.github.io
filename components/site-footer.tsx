import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-between pt-24 pb-16 text-[13px] text-zinc-400 sm:pt-32 dark:text-zinc-600">
      <span>© {site.name}</span>
      <div className="flex items-center gap-4">
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="transition-colors duration-200 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          github
        </a>
        <a
          href={`mailto:${site.email}`}
          className="transition-colors duration-200 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          email
        </a>
      </div>
    </footer>
  );
}
