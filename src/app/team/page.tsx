'use client';

import { TeamCinematic } from '@/components/TeamCinematic/TeamCinematic';
import { FooterChapter } from '@/components/chapters/FooterChapter';

export default function TeamPage() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      <TeamCinematic />
      <FooterChapter />
    </main>
  );
}
