'use client';

import React from 'react';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

interface ManifestoItem {
  id: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  focus: string;
  color: string;
  glow: string;
}

const MANIFESTO_ITEMS: ManifestoItem[] = [
  {
    id: 'shipping',
    num: '01',
    tag: 'CORE PILLAR',
    title: 'SHIPPING OVER SPECULATION',
    desc: 'Working software beats theoretical whiteboard diagrams every time. We measure engineering velocity in functioning applications, deployed smart contracts, and real user validation.',
    focus: 'Focus: Production deployment and working prototypes',
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.35)',
  },
  {
    id: 'collaboration',
    num: '02',
    tag: 'FOUNDATIONAL PRINCIPLE',
    title: 'RADICAL COLLABORATION',
    desc: 'The lone hacker is a myth. High-impact software requires cross-functional synergy between systems architects, UI designers, and team leads shipping under tight constraints.',
    focus: 'Focus: Multidisciplinary teams building end-to-end',
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.35)',
  },
  {
    id: 'open-source',
    num: '03',
    tag: 'COMMUNITY VALUE',
    title: 'BUILD IN THE OPEN',
    desc: 'Open source is our foundation. From our internal tooling and curriculum to hackathon starter kits, resources built by the chapter are contributed directly back to the student developer community.',
    focus: 'Focus: Public repositories, open tooling, and shared kits',
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.35)',
  },
  {
    id: 'sprinting',
    num: '04',
    tag: 'CULTURE & FOCUS',
    title: 'RELENTLESS SPRINTING',
    desc: 'Hackathons are engineering crucibles, not casual mixers. Focused pressure, tight deadlines, and dedicated effort forge developers who know how to ship without excuses.',
    focus: 'Focus: 24-to-36-hour nonstop buildathon execution',
    color: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.35)',
  },
];

export function AboutManifesto() {
  return (
    <section className="about-section" id="manifesto">
      <div className="about-container">
        <div className="about-manifesto__header about-reveal">
          <div className="about-section-eyebrow">
            02 // CORE PRINCIPLES
          </div>
          <h2 className="about-manifesto__title">
            THE HWI MANIFESTO
          </h2>
          <p className="type-body text-secondary" style={{ marginTop: '16px' }}>
            Four uncompromising principles that govern our chapter&apos;s hackathons, technical bootcamps, and developer community.
          </p>
        </div>

        <div className="about-manifesto__grid about-reveal">
          {MANIFESTO_ITEMS.map((item) => (
            <CardContainer
              key={item.id}
              maxTilt={4}
              lift={5}
              glowColor={item.glow}
              containerClassName="about-manifesto__card-container"
            >
              <CardBody
                className="about-manifesto__card"
                style={
                  {
                    '--card-accent': item.color,
                    '--card-border-glow': item.glow,
                    '--card-ambient-glow': item.glow,
                  } as React.CSSProperties
                }
                tabIndex={0}
                role="region"
                aria-label={`${item.title} - ${item.tag}`}
              >
                <div>
                  <CardItem translateZ={16} className="about-manifesto__card-header">
                    <span className="about-manifesto__num">{item.num}</span>
                    <span className="about-manifesto__tag">{item.tag}</span>
                  </CardItem>

                  <CardItem translateZ={24} as="h3" className="about-manifesto__card-title">
                    {item.title}
                  </CardItem>

                  <CardItem translateZ={12} as="p" className="about-manifesto__card-desc">
                    {item.desc}
                  </CardItem>
                </div>

                <CardItem translateZ={18} className="about-manifesto__focus-note">
                  <span className="about-manifesto__focus-dot" style={{ backgroundColor: item.color }} />
                  <span>{item.focus}</span>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
