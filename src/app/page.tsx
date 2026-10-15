import { TypographicIntro } from '@/components/TypographicIntro/TypographicIntro';
import { HeroChapter } from '@/components/chapters/HeroChapter';
import { StoryChapter } from '@/components/chapters/StoryChapter';
import { WhatWeOffer } from '@/components/WhatWeOffer/WhatWeOffer';
import { WhatWeDo } from '@/components/WhatWeDo/WhatWeDo';
import { ImpactChapter } from '@/components/chapters/ImpactChapter';
import { TeamChapter } from '@/components/chapters/TeamChapter';
import { FooterChapter } from '@/components/chapters/FooterChapter';

export default function Home() {
  return (
    <main>
      <TypographicIntro />

      {/* ===== CONTINUOUS VISUAL EXPERIENCE ===== */}

      {/* Chapter 01 — HERO */}
      <HeroChapter />

      {/* Chapter 02 — ABOUT / STORY (Interactive Globe) */}
      <StoryChapter />

      {/* Chapter 03 — WHAT WE OFFER (Signature Transformation: White Video & Scroll-driven points) */}
      <WhatWeOffer />

      {/* Chapter 03.5 — WHAT WE DO (Interactive Categories & Environment Switcher) */}
      <WhatWeDo />

      {/* Chapter 04 — IMPACT / ACHIEVEMENTS (Animated Statistics & Japanese Bonsai Tree) */}
      <ImpactChapter />

      {/* Chapter 05 — TEAM (Leadership Showcase) */}
      <TeamChapter />

      {/* FOOTER */}
      <FooterChapter />
    </main>
  );
}
