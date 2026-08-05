import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { pretendard } from "@/app/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  // Makes every relative URL in metadata (OG images, canonicals) absolute.
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `${site.name} — RSS` }],
    },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  // Keeps mobile browser chrome in step with the palette. This follows the
  // system preference only — the manual toggle does not update it.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables must live on :root. `--font-sans` is declared there by
    // Tailwind's @theme, and a custom property's var() references resolve on the
    // element that declares it — put these on <body> and --font-sans resolves
    // against an undefined --font-geist-sans and silently dies.
    <html
      lang="ko"
      className={`${GeistSans.variable} ${GeistMono.variable} ${pretendard.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white text-zinc-800 antialiased dark:bg-zinc-950 dark:text-zinc-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 sm:px-8">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
