import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: "최민기(samankey)의 이력서",
  alternates: { canonical: "/resume" },
  openGraph: { url: "/resume", title: `Resume — ${site.name}` },
};

const intro = [
  "5년 차 프론트엔드 개발자 최민기입니다. 대규모 서비스 마이그레이션, 성능 최적화, 그리고 디자인 시스템 구축 경험을 보유하고 있습니다.",
  "재사용 가능한 시스템과 기준을 세워 문제를 해결합니다. 반복되는 문제를 개별 기능으로 임시 조치하기보다, 주도적으로 구조를 설계하고 표준화하여 팀 전체의 생산성을 높이는 방식으로 접근합니다. 디자인 전공 배경을 바탕으로 디자인팀과의 협업에도 강점이 있습니다.",
];

interface Project {
  title: string;
  period: string;
  description?: string;
  achievements: string[];
}

interface Experience {
  company: string;
  role: string;
  period: string;
  description?: string;
  projects: Project[];
}

const experiences: Experience[] = [
  {
    company: "니더(급구)",
    role: "프론트엔드 개발자 (정규직)",
    period: "2021.09 - 재직중",
    description:
      "5년 차 프론트엔드 개발자로 재직하며 대규모 서비스 마이그레이션, 아키텍처 재설계, B2B SaaS 개발 및 백오피스 구축을 주도했습니다.",
    projects: [
      {
        title: "급구 앱 Next.js 마이그레이션 및 프론트엔드 아키텍처 재설계",
        period: "2025.11 - 2026.08",
        description:
          "Vue/Nuxt EOL에 따른 기술부채와 성능·SEO 한계, 사내 기술 스택 통일 필요성을 배경으로, 레거시 서비스를 Next.js App Router 기반으로 단계적으로 마이그레이션하며 공통 프론트엔드 플랫폼을 재설계했습니다.",
        achievements: [
          "주도적으로 반복 구현되던 UI 패턴을 분석하고, 디자인 시스템·Overlay·Storage 공통 플랫폼을 직접 설계·구축하여 상태 및 데이터 관리 규칙을 표준화 (팀 내 개발 생산성 개선)",
          "Popup 기반 Navigation의 한계를 먼저 발견하고 개선을 제안, 페이지 단위 라우팅 구조로 전환하며 History API 기반의 브라우저 탐색 경험을 안정적으로 지원하도록 개선",
          "수백 건 카드 렌더링 시 발생하던 메모리 누수 문제를 데이터 기반으로 진단, Viewport Rendering과 TanStack Virtual 가상 스크롤을 도입하여 DOM 노드 98%, 메모리 사용량 83% 감소라는 성과 달성",
          "분산되어 있던 로깅 방식의 비일관성을 문제로 정의하고, 선언적 Tracking Pipeline을 설계하여 Typed Schema·Sentry·Batch/Retry·sendBeacon 도입, 로그 품질과 운영 안정성 향상",
          "디자인팀과 긴밀히 협업하여 Figma Design Token 기반 디자인 시스템 도입을 리드, 팀 내 약 20개 공용 컴포넌트 개발 및 개발 기준 정립을 주도하고 신규 개발자 온보딩 가이드라인까지 마련",
        ],
      },
      {
        title: "급구 앱 기존 서비스 개발 및 개선",
        period: "2023.03 - 2026.08",
        achievements: [
          "업무·업종 키워드 시스템: 자연어 입력 방식의 한계(구조화 부재로 매칭·분류 어려움)를 발견하고 구조화된 키워드 트리 도입을 제안, 기획을 총괄하고 DB 구조 설계에 기여. 사장님 구인글 등록, 알바 회원 추천, 일감 추천 알고리즘 등 서비스 전반의 기준 데이터로 활용되도록 구축",
          "급여 지급 시스템 내재화: 파견 서비스 특성상 임금이 영업이익에 반영되지 않던 구조를 내재화하여 영업이익으로 인식되도록 전환, 정산 로직과 UI 개발에 직접 참여 (관련 기간 일간 영업이익 40% 증가)",
          "구인글 등록 프로세스 개선 (2023.12 - 2024.01): 단일 폼으로 되어있던 등록 플로우를 단계별로 분리해 특히 고연령대 사용자의 사용성을 개선, 등록률 약 10% 증가",
          "채팅 시스템 내재화 사전 검증 (2025.11 - 2025.12): 외부 채팅 SaaS에서 자체 WebSocket 시스템으로 전환하기 위한 사전 검증 담당. 기존 벤더 API 호출 지점에 자체 게이트웨이 호출을 병행 적용해 실트래픽 기반으로 검증 및 이관 규모 산정. 사내 realtime SDK 모노레포 패키지 편입, 연결 상태 관리 및 구형 기기 검증 등 주도",
        ],
      },
      {
        title: "급구플러스 B2B SaaS 개발 및 운영 (프론트엔드 단독 개발)",
        period: "2021.09 - 2022.09",
        achievements: [
          "앱 서비스를 웹 기반으로 확장하는 B2B SaaS 프로덕트의 프론트엔드를 처음부터 끝까지 단독으로 개발 (채용 관리 시스템, 정산 내역, 대시보드)",
          "Chart.js 기반 재사용 가능한 공통 차트 컴포넌트를 직접 설계하고, 백엔드의 비정형 API 응답을 표준 데이터 모델로 변환하는 매퍼(어댑터)를 구축하여 업종별 다양한 요구사항에 유연하게 대응",
          "대용량 정산 데이터 테이블 및 필터링 UI 설계, 백엔드 응답을 표준화된 형태로 변환하는 어댑터 구축으로 화면 로직 재사용성 확보",
          "조직 및 권한 관리 기능 및 이용권(바우처) 기능의 설계 및 개발 담당",
        ],
      },
      {
        title: "사내 백오피스 개발 및 유지보수",
        period: "2025.01 - 2026.08",
        achievements: [
          "보건증 유효기간 관리 CS 자동화: 알바 회원 보건증 등록·만료일 자동 추적 및 알림 기능을 백오피스에 구축하여 CS 업무 부담 경감",
          "운영 요구사항 기반 신규 기능 개발 및 기존 기능 개선",
        ],
      },
      {
        title: "CU 제휴 채용 서비스 페이지",
        period: "2022.03 - 2022.04",
        achievements: [
          "CU(BGF리테일)와 급구 제휴로 단기~3개월 알바 채용에 특화된 서비스를 1개월 내 직접 개발",
          "출시 이후 3년간 지속 운영되며 누적 신청 334건, 평균 매칭률 56% 기록",
        ],
      },
    ],
  },
];

interface SkillGroup {
  category: string;
  items: string[];
}

const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["JavaScript", "TypeScript"],
  },
  {
    category: "Frameworks",
    items: ["React", "Vue.js", "Next.js"],
  },
  {
    category: "Libraries",
    items: ["Zustand"],
  },
];

interface Education {
  school: string;
  major: string;
  period: string;
}

const education: Education[] = [
  {
    school: "국민대학교",
    major: "디자인학부 영상디자인과",
    period: "2013.03 - 2021.09",
  },
];

interface LinkItem {
  label: string;
  href: string;
}

const links: LinkItem[] = [
  {
    label: "Email",
    href: `mailto:${site.email}`,
  },
  {
    label: "Github",
    href: site.github,
  },
  {
    label: "기술블로그",
    href: "https://samankey.github.io/",
  },
];

export default function ResumePage() {
  return (
    <div className="flex flex-col gap-14 sm:gap-16">
      {/* 타이틀 및 연락처 정보 */}
      <section className="flex flex-col gap-3">
        <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          최민기
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[13px] text-zinc-500 dark:text-zinc-400">
          <a href={`mailto:${site.email}`} className="hover:underline">
            {site.email}
          </a>
          <span>•</span>
          <a
            href="https://samankey.github.io/"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            samankey.github.io
          </a>
        </div>
      </section>

      {/* 소개 섹션 */}
      <Section title="소개">
        <div className="flex flex-col gap-5 text-[15px] leading-[1.8] text-zinc-600 dark:text-zinc-400">
          {intro.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </Section>

      {/* 경력 섹션 */}
      <Section title="경력">
        <div className="flex flex-col gap-12">
          {experiences.map((exp, idx) => (
            <div key={idx} className="flex flex-col gap-6">
              <div className="flex flex-col justify-between gap-1 border-b border-zinc-100 pb-2 sm:flex-row sm:items-baseline dark:border-zinc-800">
                <h3 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-100">
                  {exp.company}{" "}
                  <span className="text-[15px] font-normal text-zinc-600 dark:text-zinc-400">
                    {exp.role}
                  </span>
                </h3>
                <span className="font-mono text-[12px] text-zinc-400 dark:text-zinc-600">
                  {exp.period}
                </span>
              </div>
              {exp.description && (
                <p className="text-[14.5px] leading-[1.7] text-zinc-500 dark:text-zinc-400">
                  {exp.description}
                </p>
              )}

              {/* 회사 내 개별 프로젝트 리스트 */}
              <div className="flex flex-col gap-8 pl-1 sm:pl-3">
                {exp.projects.map((proj, pIdx) => (
                  <div key={pIdx} className="flex flex-col gap-2.5">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                      <h4 className="text-[15px] font-medium text-zinc-950 dark:text-zinc-50">
                        {proj.title}
                      </h4>
                      <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
                        {proj.period}
                      </span>
                    </div>
                    {proj.description && (
                      <p className="text-[14px] leading-[1.7] text-zinc-600 dark:text-zinc-400">
                        {proj.description}
                      </p>
                    )}
                    <ul className="list-disc pl-5 text-[14px] leading-[1.8] text-zinc-600 dark:text-zinc-400 flex flex-col gap-1.5">
                      {proj.achievements.map((ach, aIdx) => (
                        <li key={aIdx}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 기술 섹션 */}
      <Section title="스킬">
        <ul className="flex flex-col gap-4">
          {skills.map((skill, idx) => (
            <li key={idx} className="sm:flex sm:gap-6">
              <span className="font-mono text-[11.5px] tracking-[0.08em] text-zinc-400 sm:w-24 sm:shrink-0 sm:pt-0.75 dark:text-zinc-600">
                {skill.category}
              </span>
              <span className="text-[15px] text-zinc-600 dark:text-zinc-400">
                {skill.items.join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 학력 섹션 */}
      <Section title="학력">
        <div className="flex flex-col gap-4">
          {education.map((edu, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline"
            >
              <div className="text-[15px] text-zinc-600 dark:text-zinc-400">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {edu.school}
                </span>{" "}
                — {edu.major}
              </div>
              <span className="font-mono text-[11.5px] text-zinc-400 dark:text-zinc-600">
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* 링크 섹션 */}
      <Section title="링크">
        <ul className="flex flex-col gap-3">
          {links.map((link) => (
            <li key={link.label} className="sm:flex sm:gap-6">
              <span className="font-mono text-[11.5px] tracking-[0.08em] text-zinc-400 sm:w-24 sm:shrink-0 sm:pt-0.75 dark:text-zinc-600">
                {link.label}
              </span>
              <a
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                className="mt-1 inline-block text-[15px] text-zinc-600 underline decoration-zinc-300 decoration-1 underline-offset-[3px] transition-colors duration-200 hover:text-zinc-950 hover:decoration-zinc-900 sm:mt-0 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50 dark:hover:decoration-zinc-100"
              >
                {link.href.replace(/^https?:\/\//, "")}
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
