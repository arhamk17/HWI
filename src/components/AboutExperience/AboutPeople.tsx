'use client';

import React from 'react';
import Image from 'next/image';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';

interface DepartmentOverview {
  name: string;
  count: string;
  themeColor: string;
}

const DEPARTMENTS_OVERVIEW: DepartmentOverview[] = [
  { name: 'Technical Team', count: '7 Builders', themeColor: '#E50914' },
  { name: 'Design Team', count: '5 Creatives', themeColor: '#A855F7' },
  { name: 'PR & Marketing', count: '4 Leads', themeColor: '#F97316' },
  { name: 'Social Media', count: '4 Strategists', themeColor: '#06B6D4' },
  { name: 'Photography & Editing', count: '4 Visualists', themeColor: '#EC4899' },
  { name: 'Event Logistics', count: '5 Coordinators', themeColor: '#22C55E' },
  { name: 'Documentation', count: '3 Archivists', themeColor: '#3B82F6' },
  { name: 'Sponsorship & Partnerships', count: '4 Liaisons', themeColor: '#F59E0B' },
  { name: 'Chapter Leadership', count: '2 Executives', themeColor: '#00F0FF' },
];

export function AboutPeople() {
  return (
    <section className="about-section" id="people">
      <div className="about-container">
        <div className="about-manifesto__header about-reveal">
          <div className="about-section-eyebrow">
            05 // STUDENT GOVERNANCE
          </div>
          <h2 className="about-manifesto__title">
            THE PEOPLE BEHIND HWI
          </h2>
          <p className="type-body text-secondary" style={{ marginTop: '16px' }}>
            A verified 41-member student roster across 9 specialized operational departments powering every hackathon, lab session, and ecosystem partnership.
          </p>
        </div>

        {/* Leadership Spotlight: President & Vice-President */}
        <div className="about-people__leadership-grid">
          {/* President Card */}
          <div className="about-people__leader-card about-reveal">
            <div className="about-people__avatar-frame">
              <Image
                src="/images/team/president.png"
                alt="Krishnakant Sharma, President of HackWithIndia BVUDET-NM"
                fill
                sizes="120px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="about-people__leader-info">
              <div className="about-people__leader-badge">
                CHAPTER PRESIDENT // EXECUTIVE
              </div>
              <h3 className="about-people__leader-name">
                Krishnakant Sharma
              </h3>
              <div className="about-people__leader-id">
                CREDENTIAL ID: HWI-PRESIDENT-KK
              </div>
              <p className="about-people__leader-bio">
                Spearheads chapter vision, national partnerships, and overall community growth at BVUDET-NM.
              </p>
            </div>
          </div>

          {/* Vice-President Card */}
          <div className="about-people__leader-card about-reveal about-delay-1">
            <div className="about-people__avatar-frame">
              <Image
                src="/images/team/vice-president.png"
                alt="Vanshika Chandra, Vice-President of HackWithIndia BVUDET-NM"
                fill
                sizes="120px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="about-people__leader-info">
              <div className="about-people__leader-badge" style={{ color: '#FF007A' }}>
                CHAPTER VICE-PRESIDENT // OPERATIONS
              </div>
              <h3 className="about-people__leader-name">
                Vanshika Chandra
              </h3>
              <div className="about-people__leader-id">
                CREDENTIAL ID: HWI-VICEPRES-VANISHKA
              </div>
              <p className="about-people__leader-bio">
                Oversees internal chapter execution, student initiatives, and strategic ecosystem alliances.
              </p>
            </div>
          </div>
        </div>

        {/* 9 Department Overview Grid */}
        <div className="about-people__departments-grid about-reveal about-delay-2">
          {DEPARTMENTS_OVERVIEW.map((dept) => (
            <div key={dept.name} className="about-people__dept-chip">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: dept.themeColor,
                    boxShadow: `0 0 8px ${dept.themeColor}`,
                  }}
                />
                <span className="about-people__dept-name">{dept.name}</span>
              </div>
              <span className="about-people__dept-count">{dept.count}</span>
            </div>
          ))}
        </div>

        {/* Link to Full Teams Experience */}
        <div className="about-reveal about-delay-3" style={{ textAlign: 'center' }}>
          <KokonutButton href="/team" variant="outline">
            Explore Full 41-Member Credential Directory
          </KokonutButton>
        </div>
      </div>
    </section>
  );
}
