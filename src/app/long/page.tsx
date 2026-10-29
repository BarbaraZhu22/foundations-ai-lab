"use client";

import { Deck } from "@/components/Deck";
import { longCards } from "@/lib/questions";

export default function LongPage() {
  return (
    <Deck
      section="long"
      cards={longCards}
      heading="分步大题"
      blurb="按小问往下走。这部分用来练手，不放进 70 分的考试估分。"
    />
  );
}
