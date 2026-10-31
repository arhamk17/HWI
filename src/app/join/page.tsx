'use client';

import { EventTicket } from '@/components/EventTicket/EventTicket';
import { FooterChapter } from '@/components/chapters/FooterChapter';

export default function JoinPage() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      <EventTicket />
      <FooterChapter />
    </main>
  );
}
