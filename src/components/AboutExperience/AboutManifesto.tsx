'use client';

import React, { useState } from 'react';

interface ManifestoItem {
  id: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  terminalLog: string;
  color: string;
  glow: string;
}

const MANIFESTO_ITEMS: ManifestoItem[] = [
  {
    id: 'shipping',
    num: '01',
    tag: 'TENET // VELOCITY',
    title: 'SHIPPING OVER SPECULATION',
    desc: 'Code deployed to production beats theoretical whiteboard diagrams every time. We measure engineering velocity in functioning binaries, deployed smart contracts, and real user validation.',
    terminalLog: '$ git push origin main && deploy --env=prod --verified',
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.25)',
  },
  {
    id: 'collaboration',
    num: '02',
    tag: 'TENET // SYNERGY',
    title: 'RADICAL COLLABORATION',
    desc: 'The lone hacker is a myth. High-impact software requires cross-functional synergy between systems architects, UI artists, and infrastructure leads shipping under 36-hour constraints.',
    terminalLog: '$ p2p-sync --cluster=bvudet-nm --peers=41 --status=mesh',
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.25)',
  },
  {
    id: 'open-source',
    num: '03',
    tag: 'TENET // COMMONS',
    title: 'BUILD IN THE OPEN',
    desc: 'Open source is our foundation. From our internal tooling and curriculum to hackathon starter kits, everything we architect is contributed directly back to the student developer commons.',
    terminalLog: '$ gh repo fork hackwithindia/commons --upstream=public',
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.25)',
  },
  {
    id: 'sprinting',
    num: '04',
    tag: 'TENET // CRUCIBLE',
    title: 'RELENTLESS SPRINTING',
    desc: 'Hackathons are engineering crucibles, not casual mixers. Pressure, tight deadlines, and sleepless dedication burn away self-doubt, forging developers who execute without excuses.',
    terminalLog: '$ timer --duration=36h --burn-rate=continuous --target=demo',
    color: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.25)',
  },
];

export function AboutManifesto() {
  const [activeId, setActiveId] = useState<string>('shipping');

  return (
    <section className="about-section" id="manifesto">
      <div className="about-container">
        <div className="about-manifesto__header about-reveal">
          <div className="about-section-eyebrow">
            02 // THE ARCHITECTURAL CORE
          </div>
          <h2 className="about-manifesto__title">
            THE HWI MANIFESTO
          </h2>
          <p className="type-body text-secondary" style={{ marginTop: '16px' }}>
            Four uncompromising principles that govern our chapter&apos;s hackathons, technical bootcamps, and developer community.
          </p>
        </div>

        <div className="about-manifesto__grid">
          {MANIFESTO_ITEMS.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <div
                key={item.id}
                className={`about-manifesto__card about-reveal about-delay-${index + 1} ${isActive ? 'is-active' : ''}`}
                style={
                  {
                    '--card-accent': item.color,
                    '--card-border-glow': item.glow,
                    '--card-ambient-glow': item.glow,
                  } as React.CSSProperties
                }
                onClick={() => setActiveId(item.id)}
                onMouseEnter={() => setActiveId(item.id)}
              >
                <div>
                  <div className="about-manifesto__card-header">
                    <span className="about-manifesto__num">{item.num}</span>
                    <span className="about-manifesto__tag">{item.tag}</span>
                  </div>

                  <h3 className="about-manifesto__card-title">
                    {item.title}
                  </h3>

                  <p className="about-manifesto__card-desc">
                    {item.desc}
                  </p>
                </div>

                <div className="about-manifesto__code-snippet">
                  {item.terminalLog}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
