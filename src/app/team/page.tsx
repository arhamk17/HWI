'use client';

import { useState } from 'react';
import { TeamCinematic } from '@/components/TeamCinematic/TeamCinematic';
import { FooterChapter } from '@/components/chapters/FooterChapter';

export default function TeamPage() {
  const [showFooter, setShowFooter] = useState(false);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      <TeamCinematic onCompleteAll={(completed) => setShowFooter(completed)} />
      {showFooter && <FooterChapter />}
    </main>
  );
}
