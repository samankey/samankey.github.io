import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} 소개`,
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: `About — ${site.name}` },
};

/* ------------------------------------------------------------------ *
 * 내용은 이 파일에서 직접 수정하세요.                                    *
 * ------------------------------------------------------------------ */

const intro = [
  "웹에서 쓰이는 인터페이스를 만듭니다. 대부분의 시간을 프론트엔드에 쓰지만, 제품이 어떻게 쓰이는지 이해하는 데 필요하다면 어디든 손을 댑니다.",
  "빠르게 만드는 것보다 오래 유지되는 것에 관심이 많습니다. 좋은 타이포그래피, 군더더기 없는 인터랙션, 그리고 6개월 뒤에 읽어도 이해되는 코드를 좋아합니다.",
];

const links = [
  // 표시 문자열은 URL에서 뽑는다. 손으로 적어두면 계정을 옮겼을 때 한쪽만 바뀐다.
  { label: "GitHub", href: site.github, display: site.github.replace(/^https?:\/\//, "") },
  { label: "Email", href: `mailto:${site.email}`, display: site.email },
];

/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-14 sm:gap-16">
      <Section title="소개">
        <div className="flex flex-col gap-5 text-[15px] leading-[1.8] text-zinc-600 dark:text-zinc-400">
          <p className="text-zinc-900 dark:text-zinc-100">{site.name}</p>
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section title="링크">
        <ul className="flex flex-col gap-3">
          {links.map((link) => (
            <li key={link.label} className="sm:flex sm:gap-6">
              <span className="font-mono text-[11.5px] tracking-[0.08em] text-zinc-400 sm:w-24 sm:shrink-0 sm:pt-[3px] dark:text-zinc-600">
                {link.label}
              </span>
              <a
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                className="mt-1 inline-block text-[15px] text-zinc-600 underline decoration-zinc-300 decoration-1 underline-offset-[3px] transition-colors duration-200 hover:text-zinc-950 hover:decoration-zinc-900 sm:mt-0 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50 dark:hover:decoration-zinc-100"
              >
                {link.display}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-mono text-[11px] tracking-[0.14em] text-zinc-400 dark:text-zinc-600">
        {title}
      </h2>
      {children}
    </section>
  );
}
