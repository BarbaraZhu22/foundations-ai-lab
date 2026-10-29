"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cat } from "@/components/Cat";
import { examScore, formatMarks, practiceScore, practiceTotal } from "@/lib/score";
import { useStore } from "@/lib/storage";

const links = [
  { href: "/", label: "计分" },
  { href: "/fill", label: "填空" },
  { href: "/choice", label: "选择" },
  { href: "/long", label: "分步" },
  { href: "/full", label: "大题" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { store, ready } = useStore();
  const exam = examScore(store);
  const practice = practiceScore(store);
  const practiceMax = practiceTotal();
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-5">
      <div className="sticky top-0 z-30 -mx-4 mb-4 bg-[var(--cream)]/90 px-4 py-2 backdrop-blur-md">
        <div className="flex items-end justify-between gap-3 rounded-full bg-white/90 px-4 py-2 ring-1 ring-[var(--line)]">
          <p className="text-sm">
            记分{" "}
            <span className="text-xl font-semibold">{ready ? formatMarks(exam.total) : "0"}</span>
          </p>
          <p className="text-sm text-[var(--muted)]">
            总分 <span className="font-semibold text-[var(--ink)]">70</span>
          </p>
          <p className="text-xs text-[var(--muted)]">
            练习 {ready ? formatMarks(practice) : "0"}/{formatMarks(practiceMax)}
          </p>
        </div>
      </div>
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Cat mood="happy" className="h-14 w-16 shrink-0" />
          <span>
            <span className="block whitespace-nowrap text-lg font-semibold tracking-tight">公式练习本</span>
            <span className="block text-sm text-[var(--muted)]">SEMTM0051 · 样卷</span>
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1.5 sm:justify-end">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  active ? "bg-[#4a322c] text-white" : "bg-white/80 text-[var(--ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      {children}
    </div>
  );
}
