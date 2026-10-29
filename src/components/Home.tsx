"use client";

import Link from "next/link";
import { Cat, moodFor, moodLine } from "@/components/Cat";
import { formulaNotes } from "@/lib/questions";
import {
  cardCount,
  doneCount,
  examScore,
  formatMarks,
  practiceScore,
  practiceTotal,
  sectionDone,
  sectionMarks,
  sectionTotal,
  decks,
} from "@/lib/score";
import { useStore, type Section } from "@/lib/storage";

const sections: { id: Section; href: string; label: string; note: string }[] = [
  { id: "fill", href: "/fill", label: "填空", note: "先把数字算出来" },
  { id: "choice", href: "/choice", label: "选择", note: "概念用一句话卡住" },
  { id: "long", href: "/long", label: "分步大题", note: "拆开练，不计入 70" },
  { id: "full", href: "/full", label: "完整大题", note: "三道里取最高两道" },
];

export function Home() {
  const { store, ready, update } = useStore();
  const done = doneCount(store);
  const all = cardCount();
  const percent = all === 0 ? 0 : Math.round((done / all) * 100);
  const exam = examScore(store);
  const practice = practiceScore(store);
  const practiceMax = practiceTotal();
  const mood = moodFor(percent);

  function resetAll() {
    update((draft) => {
      draft.fill = {};
      draft.choice = {};
      draft.long = {};
      draft.full = {};
      draft.cursor = { fill: 0, choice: 0, long: 0, full: 0 };
    });
  }

  if (!ready) return <p className="text-[var(--muted)]">小猫在翻记分本…</p>;

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--muted)]">复习计分</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight">
              {formatMarks(exam.total)}
              <span className="text-xl text-[var(--muted)]"> / 70</span>
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6">{moodLine(percent)}</p>
          </div>
          <div className="flex">
            <Cat mood={mood} className="h-24 w-28" />
            <Cat mood={percent > 70 ? "proud" : "sleep"} className="-ml-6 h-20 w-24" />
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#f6e4d8]">
          <div className="h-full rounded-full bg-[#e07a5f]" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">
          做过 {done}/{all} 题（{percent}%）· 短题 {formatMarks(exam.shorts)}/50 · 大题取两道 {formatMarks(exam.bestTwo)}/20
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          练习总分（含分步）{formatMarks(practice)}/{formatMarks(practiceMax)}
        </p>
        <button type="button" className="mt-3 text-sm underline" onClick={resetAll}>
          清空全部记录
        </button>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((section) => {
          const got = sectionMarks(section.id, store);
          const max = sectionTotal(section.id);
          const finished = sectionDone(section.id, store);
          const count = decks[section.id].length;
          return (
            <Link
              key={section.id}
              href={section.href}
              className="rounded-[24px] border border-[var(--line)] bg-white/80 p-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{section.label}</h2>
                <span className="text-sm text-[var(--muted)]">
                  {finished}/{count}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">{section.note}</p>
              <p className="mt-3 text-2xl font-semibold">
                {formatMarks(got)}
                <span className="text-base text-[var(--muted)]"> / {formatMarks(max)}</span>
              </p>
            </Link>
          );
        })}
      </div>

      <section className="rounded-[28px] border border-[var(--line)] bg-white/70 p-5">
        <div className="flex items-center gap-2">
          <Cat mood="sit" className="h-12 w-14" />
          <h2 className="text-lg font-semibold">公式小抄</h2>
        </div>
        <dl className="mt-3 space-y-3">
          {formulaNotes.map(([name, text]) => (
            <div key={name}>
              <dt className="font-medium">{name}</dt>
              <dd className="text-sm leading-6 text-[var(--muted)]">{text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
