"use client";

import { Deck } from "@/components/Deck";
import { choiceCards } from "@/lib/questions";

export default function ChoicePage() {
  return (
    <Deck
      section="choice"
      cards={choiceCards}
      heading="选择"
      blurb="每题 2 分，对应样卷里偏概念的短题。"
    />
  );
}
