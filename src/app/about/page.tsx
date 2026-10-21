'use client';

import { AboutExperience } from '@/components/AboutExperience/AboutExperience';
import { FooterChapter } from '@/components/chapters/FooterChapter';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      <AboutExperience />
      <FooterChapter />
    </main>
  );
}
