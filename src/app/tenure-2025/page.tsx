import type { Metadata } from 'next';
import { Tenure2025Experience } from '@/components/Tenure2025/Tenure2025Experience';
import { FooterChapter } from '@/components/chapters/FooterChapter';

export const metadata: Metadata = {
  title: 'HWI Tenure 2025–26 | HackWithIndia BVUDET-NM',
  description:
    'The inaugural cohort and founding chapter committee of HackWithIndia BVUDET-NM. Pioneering our collegiate hackathon movement and developer ecosystem.',
};

export default function Tenure2025Page() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      <Tenure2025Experience />
      <FooterChapter />
    </main>
  );
}

