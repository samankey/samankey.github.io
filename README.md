# blog

타이포그래피 중심의 개인 개발 블로그.

## 시작하기

```bash
pnpm install
pnpm dev
```

배포 전에 `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 설정하세요 (`.env.example` 참고). canonical, OG 태그, RSS, sitemap URL이 모두 이 값을 기준으로 생성되며, 미설정 시 `http://localhost:3000`으로 폴백합니다.

| 스크립트 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 (Turbopack) |
| `pnpm build` | 프로덕션 빌드 — 모든 포스트를 정적 생성 (`.next/`) |
| `pnpm build:verify` | 같은 빌드를 `.next-verify/`에 — dev 서버를 켠 채 쓸 수 있음 |
| `pnpm start` | 빌드 결과 서빙 |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

**dev 서버를 켠 상태에서 `pnpm build`를 돌리지 마세요.** `next build`와 `next dev`는 `.next/`를 공유하고 빌드가 그 디렉터리를 다시 씁니다. 돌아가던 dev 서버는 자기가 쓰던 파일이 사라져 `ENOENT … .next/static/development/_buildManifest.js.tmp.*`를 매 새로고침마다 뱉고, 재시작해야 풀립니다. 확인용 빌드는 `pnpm build:verify`를 쓰면 출력이 `.next-verify/`로 가서 dev 서버를 건드리지 않습니다.

## 구조

```
app/
  layout.tsx                    루트 레이아웃 — 폰트, 테마, 메타데이터, 컨테이너
  page.tsx                      홈 — 연도별 포스트 목록
  about/page.tsx                About — 내용을 이 파일에서 직접 수정
  blog/[slug]/page.tsx          포스트 상세 (SSG)
  blog/[slug]/opengraph-image.tsx  포스트별 OG 이미지
  blog/tag/[tag]/page.tsx       태그별 목록
  opengraph-image.tsx           사이트 기본 OG 이미지
  feed.xml/route.ts             RSS 2.0
  sitemap.ts / robots.ts
  icon.svg                      파비콘
  not-found.tsx
  globals.css                   Tailwind 설정 + 본문/코드 블록 스타일
  fonts/                        Pretendard 서브셋 + OFL 라이선스
components/
  mdx.tsx               MDXRemote + Shiki/slug/autolink 설정, MDX 엘리먼트 매핑
  code-block.tsx        코드 블록 프레임 + 복사 버튼 (클라이언트)
  post-list.tsx         연도별 목록
  post-nav.tsx          이전 / 다음 글
  tag-list.tsx          포스트 하단 태그
  site-header.tsx / site-footer.tsx
  theme-provider.tsx / theme-toggle.tsx
lib/
  posts.ts              content/posts 로더 — 검증, 태그, 링크 검사
  site.ts               이름·이메일·링크 등 사이트 메타
  og.tsx                OG 카드 렌더러 (Satori)
content/posts/
  YYYY-MM-DD-slug.mdx   포스트
```

## 글 추가하기

`content/posts/`에 `.mdx` 파일을 만들고 프론트매터를 채웁니다.

```
2022-04-10-bundle-diet.mdx  →  /blog/bundle-diet
```

파일명은 `YYYY-MM-DD-slug.mdx` 형태로 씁니다. **날짜 접두사는 slug에서 벗겨지므로 URL에는 들어가지 않습니다.** 접두사가 URL에 남으면 글의 날짜를 고칠 때마다 퍼머링크를 버려야 하는데, 그러면 접두사를 붙인 이유(파일 목록의 시간순 정렬)와 맞바꾸는 게 너무 큽니다.

접두사는 선택입니다 — 없으면 파일명 전체가 slug가 됩니다. 있으면 frontmatter `date`와 일치해야 하고, 다르면 빌드가 실패합니다. 파일명은 파일 목록에서만 보이고 사이트에 렌더되는 건 frontmatter 쪽이라, 이 둘이 어긋나면 한참 뒤에나 발견됩니다.

접두사를 벗기면 날짜가 다른 두 파일이 같은 slug가 될 수 있습니다(`2022-01-01-foo.mdx`와 `2023-01-01-foo.mdx`). 그러면 한쪽이 조용히 도달 불가가 되므로, slug 중복도 빌드를 세웁니다.

```mdx
---
title: "제목"
date: "2026-08-05"
summary: "메타 설명에 쓰이는 한 줄 요약 (선택)"
tags: ["next.js", "mdx"]
draft: false
---

본문…
```

`date`는 `YYYY-MM-DD`. 목록에서는 `YYYY.MM.DD`로 표시되고, 문자열 그대로 잘라 쓰기 때문에 타임존 영향을 받지 않습니다. 정렬과 연도 그룹핑도 이 값을 기준으로 자동 처리됩니다.

프론트매터는 zod로 검증합니다([`lib/posts.ts`](lib/posts.ts)). 형식이 틀리면 파일명과 필드를 짚어 즉시 실패합니다 — 정규식만으로는 통과하는 `2026-02-31` 같은 날짜도 실제 달력 날짜인지 확인합니다.

`draft: true`인 글은 개발 서버에서는 보이고 프로덕션 빌드에서는 제외됩니다. 해당 글에만 붙어 있던 태그의 태그 페이지도 함께 사라집니다.

## 태그

`tags`를 적으면 `/blog/tag/<태그>` 페이지가 자동으로 생기고 sitemap에도 포함됩니다. 태그는 문자열 그대로 매칭하며 URL에서만 인코딩되므로, 공백이 섞인 태그도 동작하지만 URL이 지저분해집니다 — 소문자 한 단어를 권합니다.

## 이미지

`public/images/<slug>/`에 두고 본문에서 절대 경로로 참조합니다.

```mdx
![대체 텍스트](/images/samnail-maker/overview.gif)

<Img src="/images/samnail-maker/overview.gif" alt="대체 텍스트" width="800" height="425" />
```

둘 다 같은 컴포넌트로 렌더됩니다. 크기를 넘길 수 있는 `<Img>`를 권합니다 — 이미지가 여러 장이면 lazy 로딩된 아래쪽 이미지가 뜰 때마다 레이아웃이 밀립니다.

**대문자 `<Img>`인 이유**는 MDX가 마크다운에서 생성된 노드만 컴포넌트 맵으로 넘기기 때문입니다. MDX 파일에 소문자 `<img>`를 직접 쓰면 맵을 지나쳐 스타일도 `loading`도 없는 맨 엘리먼트가 됩니다.

`next/image`는 쓰지 않습니다. 에셋이 로컬이고 이미 적정 크기인데다, 애니메이션 GIF는 어차피 최적화되지 않고, 나중에 `output: "export"`로 가는 길을 막지 않기 위해서입니다.

## 내부 링크·이미지 검사

본문의 `/blog/...`, `/about` 링크가 실제로 존재하는지, 이미지 경로가 `public/` 아래에 실제로 있는지 포스트를 읽을 때마다 확인합니다. 코드 블록과 인라인 코드는 먼저 제거하므로 코드 안의 마크다운 링크 문법은 오탐하지 않습니다. 이미지 문법도 먼저 걷어냅니다 — `![alt](/path)` 안에 `](/path)`가 들어 있어 그대로 두면 이미지 경로를 페이지 링크로 오인합니다.

개발 중에는 경고만 출력합니다(대상 글을 만들기 전에 링크를 먼저 쓸 수 있도록). 프로덕션 빌드에서는 예외를 던져 빌드를 세웁니다.

## 다크 모드

`next-themes`의 `class` 전략을 씁니다. Tailwind v4의 `dark:`는 기본이 `prefers-color-scheme` 미디어 쿼리이므로, `globals.css`에서 배리언트를 다시 선언해 클래스 기반으로 바꿔뒀습니다.

```css
@custom-variant dark (&:where(.dark, .dark *));
```

기본값은 `system`이고, 헤더의 토글을 누르면 그 선택이 `localStorage`에 저장됩니다. `color-scheme`도 함께 전환해 스크롤바·폼 컨트롤·캐럿 같은 네이티브 UI가 테마를 따라갑니다.

`theme-color` 메타는 미디어 쿼리 기반이라 시스템 설정만 따라갑니다 — 수동 토글로는 모바일 브라우저 크롬 색이 바뀌지 않습니다. 필요하면 토글에서 메타 태그를 직접 갱신하세요.

## 폰트

Geist에는 한글 글리프가 없습니다. 그대로 두면 한글이 OS 폴백(macOS는 Apple SD Gothic Neo, Windows는 맑은 고딕)으로 렌더링돼 플랫폼마다 다른 사이트처럼 보입니다. 그래서 Pretendard를 Geist 바로 뒤에 세웁니다.

```css
--font-sans: var(--font-geist-sans), var(--font-pretendard), sans-serif;
```

CSS 폰트 폴백은 글자 단위로 동작하므로 라틴 문자는 Geist에서 해결되고, Geist에 없는 코드포인트만 Pretendard까지 내려옵니다.

두 가지 함정이 있어 미리 처리해뒀습니다.

- **`@theme`에 `inline`을 쓰면 안 됩니다.** `@theme inline`은 값을 유틸리티에 인라인하고 커스텀 프로퍼티를 내보내지 않아서, 직접 작성한 `font-family: var(--font-sans)` 규칙에서 `--font-sans`가 정의되지 않은 상태가 됩니다.
- **폰트 변수 클래스는 `<html>`에 있어야 합니다.** 커스텀 프로퍼티의 `var()`는 그 프로퍼티를 *선언한* 엘리먼트에서 해석됩니다. `--font-sans`는 `@theme`에 의해 `:root`에 선언되므로, `--font-geist-sans`를 `<body>`에 두면 `:root`에서는 미정의 상태라 폰트 지정이 조용히 무효화됩니다.

`app/fonts/`의 파일은 KS X 1001 서브셋(완성형 2,350자)이며 가중치당 약 262KB입니다. 갱신하려면:

```bash
pnpm add -D pretendard
cp node_modules/pretendard/dist/web/static/woff2-subset/Pretendard-{Regular,Medium}.subset.woff2 app/fonts/
cp node_modules/pretendard/dist/web/static/woff-subset/Pretendard-Regular.subset.woff app/fonts/
pnpm remove pretendard
```

서브셋 밖의 희귀 음절은 OS 폴백으로 넘어갑니다. 그게 문제가 되면 `web/variable/woff2-dynamic-subset`(unicode-range로 쪼갠 92개 파일)로 교체하면 커버리지와 전송량을 동시에 개선할 수 있지만, `next/font/local`은 `unicode-range`를 지원하지 않으므로 `@font-face`를 직접 작성해야 합니다.

Pretendard는 OFL-1.1입니다 — `app/fonts/Pretendard-LICENSE.txt`.

제목과 목록 항목에는 `word-break: keep-all`을 적용했습니다. 기본값으로 두면 한국어가 어절 중간에서 끊겨 `MDX` / `를 렌더링하는` 처럼 조사만 다음 줄로 넘어갑니다.

## OG 이미지

`next/og`(Satori)로 빌드 타임에 생성합니다. Satori는 woff2를 파싱하지 못하고 내장 폰트는 라틴만 커버하므로, 한글 제목이 빈 박스로 나오지 않도록 woff 서브셋을 명시적으로 넘깁니다 — 이 파일은 클라이언트 번들에 포함되지 않습니다.

카드 디자인은 [`lib/og.tsx`](lib/og.tsx)에 있습니다. Satori는 Yoga 레이아웃을 쓰므로 자식이 둘 이상인 컨테이너에는 `display: flex`가 명시돼 있어야 하고, `text-overflow: ellipsis`가 없어서 제목은 `maxHeight`로 잘라냅니다.

## 헤딩 앵커

`rehype-slug`가 헤딩에 `id`를 붙이고, `rehype-autolink-headings`가 `#` 앵커를 덧붙입니다. 앵커는 본문 링크와 다른 요소이므로 [`components/mdx.tsx`](components/mdx.tsx)의 `Anchor`가 클래스를 보고 갈라내 밑줄 없이 왼쪽 여백에 배치하고, 헤딩 hover 시에만 드러냅니다.

## 코드 하이라이팅

`@shikijs/rehype`를 `defaultColor: false`로 실행해 토큰마다 `--shiki-light` / `--shiki-dark`를 함께 내보내고, `globals.css`에서 어느 쪽을 쓸지 결정합니다. 하이라이팅은 빌드 타임에만 일어나며 클라이언트 번들에는 포함되지 않습니다. 코드 블록 배경은 테마 색 대신 zinc로 고정해 사이트 팔레트와 맞췄습니다.

테마를 바꾸려면 [`components/mdx.tsx`](components/mdx.tsx)의 `shikiOptions`를 수정하세요.

하이라이터는 직접 만들어 rehype 플러그인에 넘깁니다. `@shikijs/rehype`는 이미 `getSingletonHighlighter`로 프로세스 전역에서 하나를 공유하므로 재생성이 문제는 아닙니다 — 문제는 `options.langs || Object.keys(bundledLanguages)`입니다. 기본값으로 두면 번들의 모든 그래머를 등록합니다.

| | 그래머 | 생성 시간 | RSS |
| --- | --- | --- | --- |
| 기본값 (전체 번들) | 364개 | ~2,020ms | ~250MB |
| 사용하는 언어만 | 11개 | ~31ms | ~78MB |

언어 목록은 포스트의 코드 펜스를 스캔해 자동으로 구성되므로 따로 관리할 필요가 없습니다. Shiki가 모르는 언어를 쓰면 파일명과 함께 빌드가 실패합니다.

언어 목록은 하이라이터를 만드는 시점에 고정되지만, dev 서버는 글을 고쳐도 프로세스가 살아 있습니다. 그래서 렌더할 때마다 등록되지 않은 언어가 있는지 확인해 그때 추가합니다 — 없으면 Shiki가 `Language X not found`를 던지고, 서버를 재시작할 때까지 매 새로고침마다 같은 에러가 납니다. 생성이 실패한 경우에도 거부된 Promise를 캐시에 남기지 않습니다. 남기면 원인을 고친 뒤에도 에러가 계속됩니다.

### 파일명과 라인 강조

````
```ts filename=lib/posts.ts {3}
// {3} 은 3번째 줄을 강조
const x = 1              // [!code highlight] 도 같은 효과
```
````

파일명은 Shiki 기본 기능이 아니라 펜스 meta를 읽어 `pre`에 `data-filename`으로 붙이는 작은 transformer를 [`components/mdx.tsx`](components/mdx.tsx)에 직접 두었습니다.

diff transformer(`[!code ++]`)는 넣지 않았습니다. 관례적인 초록/빨강이 "포인트 컬러 없음" 규칙과 부딪히고, 흑백으로 표현하면 diff의 가독성이 오히려 떨어집니다.

### 복사 버튼

`pre`를 [`components/code-block.tsx`](components/code-block.tsx)의 클라이언트 컴포넌트로 매핑해 `figure` 안에 감쌉니다. Shiki가 `pre`에 실어 보내는 테마 클래스와 토큰별 CSS 변수(`style`)를 그대로 통과시켜야 하므로 props를 전부 spread합니다.

블록 hover 시 우상단에 나타나고, 클립보드 쓰기가 실패하면(비보안 컨텍스트 등) 성공 표시를 하지 않고 조용히 넘어갑니다. 이 사이트의 유일한 클라이언트 JS이며 `/blog/[slug]` 라우트에만 694 B 붙습니다.

블록 프레임(테두리·라운드·배경)은 `pre`가 아니라 `figure`에 있습니다. 파일명 바가 테두리 안쪽에 들어가야 하기 때문입니다. 그리고 `pre`의 좌우 패딩을 각 `.line`으로 옮겼습니다 — 그래야 강조된 줄의 배경이 블록 끝까지 닿습니다.

## 피드

`/feed.xml`은 요약만 담습니다 — 본문을 두 번 렌더링하지 않으려는 의도적인 선택입니다. 전문 피드가 필요하면 MDX를 HTML로 컴파일해 `<content:encoded>`에 넣으세요.

## 커스터마이즈

- 이름·이메일·GitHub 링크 → [`lib/site.ts`](lib/site.ts)
- 소개·경력·스킬·링크 → [`app/about/page.tsx`](app/about/page.tsx) 상단 상수
- 네비게이션 항목 → [`components/site-header.tsx`](components/site-header.tsx)의 `nav`

## 스택

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · next-mdx-remote · Shiki · next-themes · zod · Geist · Pretendard
