"use client";

import { Deck } from "@/components/Deck";
import { fullCards } from "@/lib/questions";

export default function FullPage() {
  return (
    <Deck
      section="full"
      cards={fullCards}
      heading="完整大题"
      blurb="三道都做。考试估分只取其中最高的两道，每道 10 分。"
    />
  );
}