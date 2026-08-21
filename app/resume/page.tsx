import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `${site.name}의 이력서`,
  alternates: { canonical: "/resume" },
  openGraph: { url: "/resume", title: `Resume — ${site.name}` },
};

// ==========================================
// 이력서 데이터 설정 (여기에 내용을 입력해주세요)
// ==========================================

const intro: string[] = [
  // 예: "안녕하세요. 프론트엔드 엔지니어 홍길동입니다."
];

interface Experience {
  company: string;
  role: string;
  period: string;
  description?: string;
  achievements?: string[];
}

const experiences: Experience[] = [
  // {
  //   company: "회사명",
  //   role: "직무 및 직급",
  //   period: "2024.01 - 현재",
  //   description: "담당 업무 및 부서 소개에 대한 짧은 요약",
  //   achievements: [
  //     "주요 성과 및 기여 항목 1",
  //     "주요 성과 및 기여 항목 2",
  //   ],
  // },
];

interface Project {
  title: string;
  period: string;
  description: string;
  techStack: string[];
  links?: { label: string; href: string }[];
}

const projects: Project[] = [
  // {
  //   title: "프로젝트명",
  //   period: "2024.02 - 2024.03",
  //   description: "프로젝트의 목적과 주요 기능 설명",
  //   techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
  //   links: [
  //     { label: "Link", href: "https://example.com" }
  //   ],
  // },
];

interface SkillGroup {
  category: string;
  items: string[];
}

const skills: SkillGroup[] = [
  // {
  //   category: "Languages",
  //   items: ["JavaScript", "TypeScript"],
  // },
];

interface Education {
  school: string;
  major: string;
  period: string;
}

const education: Education[] = [
  // {
  //   school: "대학교",
  //   major: "전공 학과",
  //   period: "2018.03 - 2024.02",
  // },
];

// ==========================================

export default function ResumePage() {
  return (
    <div className="flex flex-col gap-14 sm:gap-16">
      {/* 소개 섹션 */}
      <Section title="소개">
        {intro.length > 0 ? (
          <div className="flex flex-col gap-5 text-[15px] leading-[1.8] text-zinc-600 dark:text-zinc-400">
            {intro.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-zinc-400 dark:text-zinc-600 italic">
            이력서 소개 내용을 추가해주세요.
          </p>
        )}
      </Section>

      {/* 경력 섹션 */}
      <Section title="경력">
        {experiences.length > 0 ? (
          <div className="flex flex-col gap-8">
            {experiences.map((exp, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">
                    {exp.company} <span className="text-zinc-300 dark:text-zinc-700">|</span> {exp.role}
                  </h3>
                  <span className="font-mono text-[11.5px] text-zinc-400 dark:text-zinc-600">
                    {exp.period}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-[14.5px] text-zinc-600 dark:text-zinc-400">
                    {exp.description}
                  </p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc pl-5 text-[14.5px] text-zinc-600 dark:text-zinc-400 flex flex-col gap-1">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx}>{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-zinc-400 dark:text-zinc-600 italic">
            경력 정보를 추가해주세요.
          </p>
        )}
      </Section>

      {/* 프로젝트 섹션 */}
      <Section title="프로젝트">
        {projects.length > 0 ? (
          <div className="flex flex-col gap-8">
            {projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">
                    {proj.title}
                  </h3>
                  <span className="font-mono text-[11.5px] text-zinc-400 dark:text-zinc-600">
                    {proj.period}
                  </span>
                </div>
                <p className="text-[14.5px] text-zinc-600 dark:text-zinc-400">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {proj.links && proj.links.length > 0 && (
                  <div className="flex gap-3 mt-1">
                    {proj.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[13px] text-zinc-500 underline decoration-zinc-300 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-100"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-zinc-400 dark:text-zinc-600 italic">
            프로젝트 정보를 추가해주세요.
          </p>
        )}
      </Section>

      {/* 기술 섹션 */}
      <Section title="기술">
        {skills.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {skills.map((skill, idx) => (
              <li key={idx} className="sm:flex sm:gap-6">
                <span className="font-mono text-[11.5px] tracking-[0.08em] text-zinc-400 sm:w-24 sm:shrink-0 sm:pt-[3px] dark:text-zinc-600">
                  {skill.category}
                </span>
                <span className="text-[15px] text-zinc-600 dark:text-zinc-400">
                  {skill.items.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-zinc-400 dark:text-zinc-600 italic">
            기술 정보를 추가해주세요.
          </p>
        )}
      </Section>

      {/* 학력 섹션 */}
      <Section title="학력">
        {education.length > 0 ? (
          <div className="flex flex-col gap-4">
            {education.map((edu, idx) => (
              <div key={idx} className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                <div className="text-[15px] text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{edu.school}</span>{" "}
                  — {edu.major}
                </div>
                <span className="font-mono text-[11.5px] text-zinc-400 dark:text-zinc-600">
                  {edu.period}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-zinc-400 dark:text-zinc-600 italic">
            학력 정보를 추가해주세요.
          </p>
        )}
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
