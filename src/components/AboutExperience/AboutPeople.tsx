'use client';

import React from 'react';
import Image from 'next/image';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

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
            06 // CHAPTER LEADERSHIP & ROSTER
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
          <CardContainer
            containerClassName="about-people__leader-container about-reveal"
            maxTilt={4}
            lift={5}
            glowColor="rgba(0, 240, 255, 0.25)"
          >
            <CardBody className="about-people__leader-card">
              <div className="about-hud-corner about-hud-corner--tl" />
              <div className="about-hud-corner about-hud-corner--tr" />
              <div className="about-hud-corner about-hud-corner--bl" />
              <div className="about-hud-corner about-hud-corner--br" />

              <CardItem translateZ={26} className="about-people__avatar-frame">
                <Image
                  src="/images/team/president.png"
                  alt="Krishnakant Sharma, President of HackWithIndia BVUDET-NM"
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover' }}
                />
              </CardItem>
              <div className="about-people__leader-info">
                <CardItem translateZ={14} className="about-people__leader-badge">
                  CHAPTER PRESIDENT
                </CardItem>
                <CardItem translateZ={22} as="h3" className="about-people__leader-name">
                  Krishnakant Sharma
                </CardItem>
                <CardItem translateZ={16} className="about-people__leader-id">
                  CREDENTIAL ID: <span style={{ color: '#00F0FF' }}>HWI-PRESIDENT-KK</span>
                </CardItem>
                <CardItem translateZ={12} as="p" className="about-people__leader-bio">
                  Spearheads chapter vision, national partnerships, and overall community growth at BVUDET-NM.
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>

          {/* Vice-President Card */}
          <CardContainer
            containerClassName="about-people__leader-container about-reveal about-delay-1"
            maxTilt={4}
            lift={5}
            glowColor="rgba(255, 0, 122, 0.25)"
          >
            <CardBody className="about-people__leader-card">
              <div className="about-hud-corner about-hud-corner--tl" />
              <div className="about-hud-corner about-hud-corner--tr" />
              <div className="about-hud-corner about-hud-corner--bl" />
              <div className="about-hud-corner about-hud-corner--br" />

              <CardItem translateZ={26} className="about-people__avatar-frame">
                <Image
                  src="/images/team/vice-president.png"
                  alt="Vanshika Chandra, Vice-President of HackWithIndia BVUDET-NM"
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover' }}
                />
              </CardItem>
              <div className="about-people__leader-info">
                <CardItem translateZ={14} className="about-people__leader-badge" style={{ color: '#FF007A' }}>
                  CHAPTER VICE-PRESIDENT
                </CardItem>
                <CardItem translateZ={22} as="h3" className="about-people__leader-name">
                  Vanshika Chandra
                </CardItem>
                <CardItem translateZ={16} className="about-people__leader-id">
                  CREDENTIAL ID: <span style={{ color: '#00F0FF' }}>HWI-VICEPRES-VANISHKA</span>
                </CardItem>
                <CardItem translateZ={12} as="p" className="about-people__leader-bio">
                  Oversees internal chapter execution, student initiatives, and strategic ecosystem alliances.
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="about-people__dept-count">{dept.count}</span>
              </div>
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
