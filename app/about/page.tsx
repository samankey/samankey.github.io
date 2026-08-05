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

const experience = [
  {
    period: "2023 — 현재",
    role: "Frontend Engineer",
    company: "Gubgoo",
    description: "웹 프로덕트 프론트엔드 전반과 디자인 시스템을 담당하고 있습니다.",
  },
  {
    period: "2021 — 2023",
    role: "Software Engineer",
    company: "Freelance",
    description: "스타트업의 초기 웹 서비스를 설계하고 구현했습니다.",
  },
];

const skills = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python"] },
  { label: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { label: "Backend", items: ["Node.js", "PostgreSQL", "Prisma"] },
  { label: "Tools", items: ["Git", "Figma", "Vercel", "Docker"] },
];

const links = [
  { label: "GitHub", href: site.github, display: "github.com/mingichoi" },
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

      <Section title="경력">
        <ul className="flex flex-col gap-7">
          {experience.map((job) => (
            <li key={`${job.company}-${job.period}`}>
              <p className="font-mono text-[11.5px] tracking-[0.08em] text-zinc-400 tabular-nums dark:text-zinc-600">
                {job.period}
              </p>
              <p className="mt-1.5 text-[15px] text-zinc-900 dark:text-zinc-100">
                {job.role}
                <span className="text-zinc-400 dark:text-zinc-600"> · </span>
                <span className="text-zinc-500 dark:text-zinc-400">{job.company}</span>
              </p>
              <p className="mt-1 text-[14px] leading-[1.75] text-zinc-500 dark:text-zinc-400">
                {job.description}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="스킬">
        <dl className="flex flex-col gap-4">
          {skills.map((group) => (
            <div key={group.label} className="sm:flex sm:gap-6">
              <dt className="font-mono text-[11.5px] tracking-[0.08em] text-zinc-400 sm:w-24 sm:shrink-0 sm:pt-[3px] dark:text-zinc-600">
                {group.label}
              </dt>
              <dd className="mt-1 text-[15px] text-zinc-600 sm:mt-0 dark:text-zinc-400">
                {group.items.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
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
