# AGENT.md

Guidance for an agent working in this repo. This is a personal dev blog: Next.js 15 App Router, MDX files in `content/posts/`. See [README.md](README.md) for how the site itself is built.

The main job here is **turning a topic into a published post**. Everything below is about that.

Write this file, commit messages, and code comments in English. Write the posts themselves in Korean.

---

## 1. The input

The author hands over a topic. Usually it arrives as their own writing — rough notes, a summary of a talk they watched, something they worked out at work. Sometimes it is just a title.

Treat that material as the spine of the post, not as raw material to replace. The author's own understanding and phrasing is the point. The job is to shape it, fill the holes, and check it — not to rewrite it into something generic.

## 2. Close the gaps before writing anything

**This is the part that matters most. Do not skip it, and do not fold it into the same turn as the writing.**

The author does not want to publish an explanation they do not actually understand. So before writing, read their material and look for gaps:

- A claim that is asserted but whose mechanism is never explained ("it doesn't get rendered" — why not?)
- A tool or API named without saying what it does or when you'd reach for it
- A "how" with no "why" — the reader will ask why this approach and not the obvious one
- Something in the notes that looks **wrong or imprecise**, not merely thin
- The obvious next question a reader would have, left unanswered

### How to ask

Post the gaps as a plain numbered list, most important first. Cap it at about five per round — a list of twelve is not answerable.

For each gap, give the author a choice. The options are always roughly these three:

- **A — I know this, and here's the explanation.** The author supplies it, in their words.
- **B — I don't know this. Explain it to me first.** You explain it in a later turn; it does not go into the post until the author has read the explanation and is comfortable with it.
- **C — Leave it out.** Out of scope for this post. Drop it, and don't leave a dangling half-claim behind where it was.

Say concretely what each gap is and why it matters for the post, so the choice is a real one. "Do you know how tree shaking works?" is useless. "The notes say TypeScript can't do tree shaking properly, but not why — the reason is `/*#__PURE__*/` annotations. Do you want to explain that, have me explain it to you, or leave it as a bare recommendation?" is answerable.

### Then stop

**End the turn after asking. Do not write the post in the same message.** The author answers, and that answer is the material for the next round.

Repeat as needed. When the author picks **B**, the next turn is an explanation and a short check that it landed — that turn ends too. Ask again only about what is still open; do not re-litigate settled points.

Start writing when every gap is either answered, explained-and-confirmed, or explicitly cut. If there were no real gaps in the first place, say so plainly and write.

## 3. Writing the post

**Keep it approachable.** Aim at a working developer who has not met this specific thing before — not at a specialist. Concretely:

- Explain the mechanism, not the jargon. If a term is unavoidable, define it in the sentence where it first appears.
- Prefer a short real example over an abstract description.
- One idea per section. If a section needs three paragraphs of setup, it is two sections.
- Cut hedging and filler. Short declarative sentences.
- Depth is fine where it earns its place; density is not.

**Tone.** Plain Korean, `-다` endings (`…하지 않는다`, `…쓰면 된다`) — not `-습니다`. That is the README's register, not the posts'. No exclamation marks, no "여러분", no marketing voice.

**Structure.**

- Open with one or two sentences that say what the problem is. No preamble, no "이번 글에서는".
- `##` for sections, `###` sparingly. Never `#` — the title comes from frontmatter.
- **Every post ends with a `## 정리` section**: a short bullet list, one line per takeaway, no more than about five. It should be readable on its own by someone who skimmed.
- If the post is a summary of someone else's talk or article, say so in the first line with a link.

**Accuracy outranks fidelity to the notes.** If the author's material contains an error, do not reproduce it. Fix it, and say plainly in your reply what you changed and why — especially for anything permanent like a title or slug. Silently "improving" a claim is worse than leaving it alone.

**Do not reproduce other people's prose.** If the notes contain a passage copied from an article or docs, rewrite the idea in Korean in the post's own voice. At most one short quote, with attribution. Never paste in a block of someone else's text.

**Verify technical claims.** Read the relevant `node_modules` source, or run it, rather than reasoning from memory about how a library behaves. If a claim cannot be checked, either drop it or mark it as uncertain in the post — do not launder a guess into a flat assertion.

## 4. Mechanics

Filename is `YYYY-MM-DD-slug.mdx`. The date prefix is stripped from the URL, so it must match frontmatter `date` or the build fails. Slugs are English, lowercase, hyphenated.

```
content/posts/2022-09-04-vue-next-tick.mdx  →  /blog/vue-next-tick
```

```mdx
---
title: "제목"
date: "2022-09-04"
summary: "한 줄 요약 — 메타 설명과 검색 결과에 쓰인다"
tags: ["vue", "nuxt"]
---
```

- `summary` — write one. It is the meta description and the OG card text.
- `tags` — lowercase single words, two or three. Reuse existing tags before inventing new ones; each new tag creates a page.
- `draft: true` hides the post from production builds while keeping it visible in dev.
- Code fences need a language Shiki knows; only the languages actually used get their grammar loaded, so a new language is worth checking after the build. `filename=path` on the fence renders a caption, and `{1,3-5}` highlights lines.
- Images live in `public/images/<slug>/` and are referenced by absolute path. Prefer `<Img src alt width height />` over markdown `![alt](src)` so the box is reserved and lazy-loaded images don't shift the page. Note the capital `I` — a lowercase `<img>` written directly in MDX skips the component map entirely and renders unstyled. Always write real alt text.

Frontmatter is validated by zod and internal links are checked, both in [lib/posts.ts](lib/posts.ts). Broken links warn in dev and fail the production build.

## 5. Verify, then commit

Never report a post as done on the strength of the file existing.

```bash
pnpm typecheck && pnpm lint && pnpm build
```

**Do not start a server to check the result.** Every route here is statically prerendered, so the build writes the finished HTML to disk and you can read it directly:

```
.next/server/app/index.html
.next/server/app/blog/<slug>.html
.next/server/app/blog/tag/<tag>.html
.next/server/app/sitemap.xml.body
```

This is what actually ships, and it sidesteps the dev server, which has served pre-edit HTML more than once. Check in those files:

- the post's HTML exists, and a file exists for every new tag
- it lands in the right year group on `/`, in the right order — strip `<script>` first, since the inlined RSC payload repeats the visible text
- code blocks are highlighted — especially a language the repo has not used before
- prev/next links point where they should

Commit only after that. One post per commit, subject `Add post: <title>`. If you changed or corrected anything the author gave you, put that in the commit body.

There is no remote yet — commit locally and leave pushing alone.
