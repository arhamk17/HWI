'use client';

import { EventsExperience } from '@/components/EventsExperience/EventsExperience';
import { FooterChapter } from '@/components/chapters/FooterChapter';

export default function EventsPage() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      {/* Flagship Expandable Gallery & Editorial Story */}
      <EventsExperience />

      <FooterChapter />
    </main>
  );
}

