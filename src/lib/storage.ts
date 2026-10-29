"use client";

import { useCallback, useEffect, useState } from "react";

export const STORAGE_KEY = "semtm0051-practice-v1";

export type Attempt = {
  values: Record<string, string>;
  revealed: boolean;
  correct: boolean | null;
  tries: number;
};

export type Section = "fill" | "choice" | "long" | "full";

export type Store = {
  fill: Record<string, Attempt>;
  choice: Record<string, Attempt>;
  long: Record<string, Attempt>;
  full: Record<string, Attempt>;
  cursor: Record<Section, number>;
};

export const emptyAttempt = (): Attempt => ({
  values: {},
  revealed: false,
  correct: null,
  tries: 0,
});

export const emptyStore = (): Store => ({
  fill: {},
  choice: {},
  long: {},
  full: {},
  cursor: { fill: 0, choice: 0, long: 0, full: 0 },
});

function sanitize(raw: unknown): Store {
  const base = emptyStore();
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Partial<Store>;
  for (const key of ["fill", "choice", "long", "full"] as const) {
    const bucket = data[key];
    if (!bucket || typeof bucket !== "object") continue;
    for (const [id, attempt] of Object.entries(bucket)) {
      if (!attempt || typeof attempt !== "object") continue;
      const row = attempt as Partial<Attempt>;
      base[key][id] = {
        values: row.values && typeof row.values === "object" ? row.values : {},
        revealed: Boolean(row.revealed),
        correct: row.correct === true ? true : row.correct === false ? false : null,
        tries: typeof row.tries === "number" ? row.tries : 0,
      };
    }
  }
  if (data.cursor) {
    for (const key of ["fill", "choice", "long", "full"] as const) {
      const n = data.cursor[key];
      if (typeof n === "number" && n >= 0) base.cursor[key] = n;
    }
  }
  return base;
}

export function readStore(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const text = window.localStorage.getItem(STORAGE_KEY);
    if (!text) return emptyStore();
    return sanitize(JSON.parse(text));
  } catch {
    return emptyStore();
  }
}

const listeners = new Set<() => void>();

export function writeStore(store: Store) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  listeners.forEach((listener) => listener());
}

export function subscribeStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useStore() {
  const [store, setStore] = useState<Store>(emptyStore);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStore(readStore());
    setReady(true);
    return subscribeStore(() => setStore(readStore()));
  }, []);

  const commit = useCallback((next: Store) => {
    setStore(next);
    writeStore(next);
  }, []);

  const update = useCallback(
    (recipe: (draft: Store) => void) => {
      const next = structuredClone(readStore());
      recipe(next);
      commit(next);
    },
    [commit],
  );

  const resetSection = useCallback(
    (section: Section) => {
      update((draft) => {
        draft[section] = {};
        draft.cursor[section] = 0;
      });
    },
    [update],
  );

  return { store, ready, update, resetSection };
}

export function countCorrect(bucket: Record<string, Attempt>, ids: string[]) {
  return ids.filter((id) => bucket[id]?.correct === true).length;
}
