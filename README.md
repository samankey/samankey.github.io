# blog

타이포그래피 중심의 개인 개발 블로그.

## 시작하기

```bash
pnpm install
pnpm dev
```

| 스크립트 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 (Turbopack) |
| `pnpm build` | 프로덕션 빌드 — 모든 포스트를 정적 생성 |
| `pnpm start` | 빌드 결과 서빙 |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

## 구조

```
app/
  layout.tsx            루트 레이아웃 — 폰트, 테마, 컨테이너
  page.tsx              홈 — 연도별 포스트 목록
  about/page.tsx        About — 내용을 이 파일에서 직접 수정
  blog/[slug]/page.tsx  포스트 상세 (SSG)
  not-found.tsx
  globals.css           Tailwind 설정 + 본문/코드 블록 스타일
components/
  mdx.tsx               MDXRemote + Shiki 설정, MDX 엘리먼트 매핑
  post-list.tsx         연도별 목록
  site-header.tsx / site-footer.tsx
  theme-provider.tsx / theme-toggle.tsx
lib/
  posts.ts              content/posts 로더
  site.ts               이름·이메일·링크 등 사이트 메타
content/posts/
  *.mdx                 포스트
```

## 글 추가하기

`content/posts/`에 `.mdx` 파일을 만들고 프론트매터를 채웁니다. 파일명이 slug가 됩니다.

```mdx
---
title: "제목"
date: "2026-08-05"
summary: "메타 설명에 쓰이는 한 줄 요약 (선택)"
---

본문…
```

`date`는 `YYYY-MM-DD`. 목록에서는 `YYYY.MM.DD`로 표시되고, 문자열 그대로 잘라 쓰기 때문에 타임존 영향을 받지 않습니다. 정렬과 연도 그룹핑도 이 값을 기준으로 자동 처리됩니다.

## 다크 모드

`next-themes`의 `class` 전략을 씁니다. Tailwind v4의 `dark:`는 기본이 `prefers-color-scheme` 미디어 쿼리이므로, `globals.css`에서 배리언트를 다시 선언해 클래스 기반으로 바꿔뒀습니다.

```css
@custom-variant dark (&:where(.dark, .dark *));
```

기본값은 `system`이고, 헤더의 토글을 누르면 그 선택이 `localStorage`에 저장됩니다.

## 코드 하이라이팅

`@shikijs/rehype`를 `defaultColor: false`로 실행해 토큰마다 `--shiki-light` / `--shiki-dark`를 함께 내보내고, `globals.css`에서 어느 쪽을 쓸지 결정합니다. 하이라이팅은 빌드 타임에만 일어나며 클라이언트 번들에는 포함되지 않습니다. 코드 블록 배경은 테마 색 대신 zinc로 고정해 사이트 팔레트와 맞췄습니다.

테마를 바꾸려면 [`components/mdx.tsx`](components/mdx.tsx)의 `shikiOptions`를 수정하세요.

## 커스터마이즈

- 이름·이메일·GitHub 링크 → [`lib/site.ts`](lib/site.ts)
- 소개·경력·스킬·링크 → [`app/about/page.tsx`](app/about/page.tsx) 상단 상수
- 네비게이션 항목 → [`components/site-header.tsx`](components/site-header.tsx)의 `nav`

## 스택

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · next-mdx-remote · Shiki · next-themes · Geist
