import type { Metadata } from 'next';
import { FacultyMentorsExperience } from '@/components/FacultyMentors/FacultyMentorsExperience';
import { FooterChapter } from '@/components/chapters/FooterChapter';

export const metadata: Metadata = {
  title: 'Faculty & Mentors | HackWithIndia BVUDET-NM',
  description:
    'Meet the teacher coordinators and global industry mentors guiding HackWithIndia BVUDET-NM.',
};

export default function FacultyMentorsPage() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      <FacultyMentorsExperience />
      <FooterChapter />
    </main>
  );
}

