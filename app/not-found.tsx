import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="text-[17px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 text-[15px] text-zinc-500 dark:text-zinc-400">
        주소가 바뀌었거나 삭제된 글일 수 있습니다.
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 text-[14px] text-zinc-500 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
        목록으로
      </Link>
    </div>
  );
}
