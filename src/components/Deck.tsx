"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Cat, moodFor } from "@/components/Cat";
import type { Blank, Block, Card } from "@/lib/questions";
import {
  blankCorrect,
  cardEarned,
  cardMarks,
  formatMarks,
  scoreBlock,
  blockMarks,
} from "@/lib/score";
import { emptyAttempt, readStore, useStore, type Section } from "@/lib/storage";

export function Deck({
  section,
  cards,
  heading,
  blurb,
}: {
  section: Section;
  cards: Card[];
  heading: string;
  blurb: string;
}) {
  const { store, ready, update, resetSection } = useStore();
  const saved = store.cursor[section] ?? 0;
  const index = Math.min(Math.max(saved, 0), Math.max(cards.length - 1, 0));
  const card = cards[index];
  const attempt = card ? (store[section][card.id] ?? emptyAttempt()) : emptyAttempt();
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [burst, setBurst] = useState(0);
  const clearBurst = useCallback(() => setBurst(0), []);
  const values = draft ?? attempt.values;
  const locked = attempt.revealed;
  const checked = attempt.tries > 0;

  const earned = card ? cardEarned(card, { ...attempt, values: checked ? attempt.values : {} }) : 0;
  const total = card ? cardMarks(card) : 0;
  const progress = useMemo(() => {
    const done = cards.filter((item) => (store[section][item.id]?.tries ?? 0) > 0).length;
    return { done, all: cards.length };
  }, [cards, section, store]);

  function persist(nextValues: Record<string, string>, patch?: Partial<typeof attempt>) {
    if (!card) return;
    update((draftStore) => {
      const current = draftStore[section][card.id] ?? emptyAttempt();
      draftStore[section][card.id] = { ...current, ...patch, values: nextValues };
    });
  }

  function setField(id: string, value: string) {
    if (!card) return;
    update((draftStore) => {
      const current = draftStore[section][card.id] ?? emptyAttempt();
      draftStore[section][card.id] = {
        ...current,
        values: { ...current.values, [id]: value },
      };
    });
    const savedValues = readStore()[section][card.id]?.values ?? {};
    setDraft(savedValues);
  }

  function check() {
    if (!card || locked) return;
    const latest = readStore()[section][card.id]?.values ?? values;
    const got = scoreBlockSum(card, latest);
    const full = cardMarks(card);
    const correct = got + 1e-6 >= full && full > 0;
    persist(latest, {
      tries: attempt.tries + 1,
      correct,
    });
    setDraft(null);
    if (correct) setBurst((n) => n + 1);
  }

  function reveal() {
    if (!card) return;
    persist(readStore()[section][card.id]?.values ?? attempt.values, { revealed: true });
    setDraft(null);
  }

  function go(nextIndex: number) {
    setDraft(null);
    update((draftStore) => {
      draftStore.cursor[section] = nextIndex;
    });
  }

  if (!ready || !card) {
    return <p className="text-[var(--muted)]">豆沙正在把卷子铺开…</p>;
  }

  return (
    <div>
      {burst > 0 ? <CheerBurst key={burst} token={burst} onDone={clearBurst} /> : null}
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{heading}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{blurb}</p>
        </div>
        <Cat mood={moodFor((progress.done / progress.all) * 100)} className="h-16 w-20" />
      </div>
      <div className="mb-3 flex items-center justify-between text-sm text-[var(--muted)]">
        <span>
          {progress.done}/{progress.all} 已检查 · 本题 {formatMarks(earned)}/{formatMarks(total)}
        </span>
        <button
          type="button"
          className="underline"
          onClick={() => {
            setDraft(null);
            resetSection(section);
          }}
        >
          清空本部分
        </button>
      </div>
      <article
        className={`rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm ${burst ? "cheer-glow" : ""}`}
      >
        <p className="text-xs font-medium tracking-wide text-[var(--coral)]">{card.kicker}</p>
        <h2 className="mt-1 text-xl font-semibold">
          {index + 1}. {card.title}
        </h2>
        {card.intro ? (
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-[#fff1e8] p-3 text-sm leading-6">
            {card.intro}
          </pre>
        ) : null}
        <div className="mt-4 space-y-5">
          {card.blocks.map((block) => (
            <BlockView
              key={block.id}
              block={block}
              values={values}
              checked={checked}
              locked={locked}
              onChange={setField}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={locked}
            onClick={check}
            className="rounded-full bg-[#e07a5f] px-4 py-2 text-white disabled:opacity-40"
          >
            对一下
          </button>
          <button
            type="button"
            onClick={reveal}
            className="rounded-full bg-white px-4 py-2 ring-1 ring-[var(--line)]"
          >
            看答案
          </button>
          <span className="ml-auto flex gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => go(index - 1)}
              className="rounded-full bg-white px-4 py-2 ring-1 ring-[var(--line)] disabled:opacity-40"
            >
              上一题
            </button>
            <button
              type="button"
              disabled={index === cards.length - 1}
              onClick={() => go(index + 1)}
              className="rounded-full bg-[#4a322c] px-4 py-2 text-white disabled:opacity-40"
            >
              下一题
            </button>
          </span>
        </div>
      </article>
    </div>
  );
}

function CheerBurst({ token, onDone }: { token: number; onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1700);
    return () => window.clearTimeout(timer);
  }, [token, onDone]);

  const bits = ["♥", "爪", "★", "✿", "♥", "爪", "★", "✿", "♥", "爪", "★", "✿"];
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" role="status">
      {bits.map((bit, index) => (
        <span
          key={index}
          className="cheer-bit text-2xl"
          style={{
            left: `${8 + ((index * 37) % 84)}%`,
            animationDuration: `${1.35 + (index % 4) * 0.12}s`,
            animationDelay: `${(index % 5) * 0.06}s`,
            color: index % 2 === 0 ? "#e07a5f" : "#e18b96",
          }}
        >
          {bit}
        </span>
      ))}
      <div className="cheer-banner flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-lg ring-1 ring-[#d7e6d2]">
        <Cat mood="proud" className="h-16 w-20" />
        <p className="text-2xl font-semibold text-[#3e5a3c]">做对了</p>
      </div>
    </div>
  );
}

function scoreBlockSum(card: Card, values: Record<string, string>) {
  return card.blocks.reduce((sum, block) => sum + scoreBlock(block, values), 0);
}

function BlockView({
  block,
  values,
  checked,
  locked,
  onChange,
}: {
  block: Block;
  values: Record<string, string>;
  checked: boolean;
  locked: boolean;
  onChange: (id: string, value: string) => void;
}) {
  const got = scoreBlock(block, values);
  const full = blockMarks(block);
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold">{block.title}</h3>
        <span className="text-xs text-[var(--muted)]">
          {formatMarks(checked ? got : 0)}/{formatMarks(full)}
        </span>
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{block.prompt}</p>
      {block.blanks ? (
        <div
          className="mt-3 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${block.columns ?? 1}, minmax(0, 1fr))` }}
        >
          {block.blanks.map((blank) => (
            <BlankField
              key={blank.id}
              blank={blank}
              value={values[blank.id] ?? ""}
              checked={checked}
              locked={locked}
              onChange={onChange}
            />
          ))}
        </div>
      ) : null}
      {block.options ? (
        <div className="mt-3 space-y-2">
          {block.options.map((option) => {
            const selected = values[block.id] === option.id;
            const show = checked || locked;
            const right = option.id === block.correctOption;
            const tone = !show
              ? "bg-white"
              : right
                ? "bg-[#eef6ea]"
                : selected
                  ? "bg-[#fde8e4]"
                  : "bg-white";
            return (
              <label key={option.id} className={`flex cursor-pointer gap-2 rounded-2xl px-3 py-2 ring-1 ring-[var(--line)] ${tone}`}>
                <input
                  type="radio"
                  name={block.id}
                  checked={selected}
                  disabled={locked}
                  onChange={() => onChange(block.id, option.id)}
                />
                <span className="text-sm leading-6">{option.text}</span>
              </label>
            );
          })}
        </div>
      ) : null}
      {locked ? (
        <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-[#f4f8f1] px-3 py-2 text-sm leading-6 text-[#3e5a3c]">
          {block.explanation}
        </p>
      ) : null}
    </section>
  );
}

function BlankField({
  blank,
  value,
  checked,
  locked,
  onChange,
}: {
  blank: Blank;
  value: string;
  checked: boolean;
  locked: boolean;
  onChange: (id: string, value: string) => void;
}) {
  const ok = blankCorrect(blank.accept, value);
  const ring = !checked ? "ring-[var(--line)]" : ok ? "ring-[#6e8b6a]" : "ring-[#e07a5f]";
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-[var(--muted)]">{blank.label}</span>
      <input
        value={value}
        disabled={locked}
        onChange={(event) => onChange(blank.id, event.target.value)}
        className={`w-full rounded-2xl bg-white px-3 py-2 ring-1 outline-none ${ring}`}
      />
      {locked ? <span className="mt-1 block text-xs text-[var(--leaf)]">答案 {blank.show ?? blank.accept[0]}</span> : null}
    </label>
  );
}
