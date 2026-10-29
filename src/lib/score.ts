import { isMatch } from "@/lib/grade";
import {
  type Attempt,
  type Section,
  type Store,
} from "@/lib/storage";
import {
  type Block,
  type Card,
  choiceCards,
  fillCards,
  fullCards,
  longCards,
} from "@/lib/questions";

export const decks: Record<Section, Card[]> = {
  fill: fillCards,
  choice: choiceCards,
  long: longCards,
  full: fullCards,
};

export function blockMarks(block: Block) {
  const blanks = (block.blanks ?? []).reduce((sum, blank) => sum + blank.marks, 0);
  const choice = block.correctOption ? (block.optionMarks ?? 0) : 0;
  return blanks + choice;
}

export function cardMarks(card: Card) {
  return card.blocks.reduce((sum, block) => sum + blockMarks(block), 0);
}

export function scoreBlock(block: Block, values: Record<string, string>) {
  let earned = 0;
  for (const blank of block.blanks ?? []) {
    if (isMatch(values[blank.id] ?? "", blank.accept)) earned += blank.marks;
  }
  if (block.correctOption && values[block.id] === block.correctOption) {
    earned += block.optionMarks ?? 0;
  }
  return earned;
}

export function scoreCard(card: Card, values: Record<string, string>) {
  return card.blocks.reduce((sum, block) => sum + scoreBlock(block, values), 0);
}

export function cardEarned(card: Card, attempt?: Attempt) {
  if (!attempt || attempt.tries < 1) return 0;
  return scoreCard(card, attempt.values);
}

export function isDone(attempt?: Attempt) {
  return !!attempt && attempt.tries > 0;
}

export function sectionMarks(section: Section, store: Store) {
  return decks[section].reduce(
    (sum, card) => sum + cardEarned(card, store[section][card.id]),
    0,
  );
}

export function sectionTotal(section: Section) {
  return decks[section].reduce((sum, card) => sum + cardMarks(card), 0);
}

export function sectionDone(section: Section, store: Store) {
  return decks[section].filter((card) => isDone(store[section][card.id])).length;
}

export function examScore(store: Store) {
  const shorts = sectionMarks("fill", store) + sectionMarks("choice", store);
  const longs = fullCards
    .map((card) => cardEarned(card, store.full[card.id]))
    .sort((a, b) => b - a);
  const bestTwo = (longs[0] ?? 0) + (longs[1] ?? 0);
  return { shorts, bestTwo, total: shorts + bestTwo };
}

export function practiceScore(store: Store) {
  return (Object.keys(decks) as Section[]).reduce(
    (sum, section) => sum + sectionMarks(section, store),
    0,
  );
}

export function practiceTotal() {
  return (Object.keys(decks) as Section[]).reduce(
    (sum, section) => sum + sectionTotal(section),
    0,
  );
}

export function doneCount(store: Store) {
  return (Object.keys(decks) as Section[]).reduce(
    (sum, section) => sum + sectionDone(section, store),
    0,
  );
}

export function cardCount() {
  return (Object.keys(decks) as Section[]).reduce(
    (sum, section) => sum + decks[section].length,
    0,
  );
}

export function formatMarks(value: number) {
  const rounded = Math.round(value * 10) / 10;
  if (Math.abs(rounded - Math.round(rounded)) < 0.05) return String(Math.round(rounded));
  return rounded.toFixed(1);
}

export function blankCorrect(blankAccept: string[], value: string) {
  return isMatch(value, blankAccept);
}
