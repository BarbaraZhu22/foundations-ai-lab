"use client";

import { Deck } from "@/components/Deck";
import { fillCards } from "@/lib/questions";

export default function FillPage() {
  return (
    <Deck
      section="fill"
      cards={fillCards}
      heading="填空"
      blurb="数字题。检查之后才计分，看答案会锁住这道题。"
    />
  );
}
