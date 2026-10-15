'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { FooterChapter } from '@/components/chapters/FooterChapter';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';
import { KokonutBadge } from '@/components/KokonutUI/KokonutBadge';

export default function AboutPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      anime({
        targets: headerRef.current.children,
        opacity: [0, 1],
        translateY: [28, 0],
        delay: anime.stagger(120),
        duration: 800,
        easing: 'easeOutCubic',
      });
    }

    const items = document.querySelectorAll('.about-reveal-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [24, 0],
              duration: 700,
              easing: 'easeOutCubic',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }} ref={containerRef}>
      {/* 1. Header Section */}
      <section
        className="chapter"
        style={{
          minHeight: '60vh',
          alignItems: 'flex-end',
          paddingBottom: 'var(--space-64)',
          paddingTop: '16vh',
        }}
      >
        <div className="container" ref={headerRef}>
          <div style={{ marginBottom: 'var(--space-16)' }}>
            <KokonutBadge variant="accent">OFFICIAL STUDENT CHAPTER</KokonutBadge>
          </div>

          <h1 className="type-display" style={{ maxWidth: '950px' }}>
            ABOUT HACK WITH INDIA
          </h1>
          <p
            className="type-eyebrow text-accent"
            style={{ marginTop: 'var(--space-16)', letterSpacing: '0.25em' }}
          >
            BHARATI VIDYAPEETH DEEMED UNIVERSITY • BVUDET-NM
          </p>
          <p
            className="type-body text-secondary"
            style={{ maxWidth: '680px', marginTop: 'var(--space-24)' }}
          >
            Innovate. Create. Elevate. We are a premier student developer community connecting talents, unlocking skills, and giving a platform to those who are able but lack the chance.
          </p>
        </div>
      </section>

      {/* 2. Purpose & Origin Section */}
      <section style={{ padding: 'var(--space-96) 0', borderTop: '1px solid var(--border-default)' }}>
        <div className="container">
          <div
            className="about-reveal-item"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-64)',
              alignItems: 'start',
              opacity: 0,
              transform: 'translateY(24px)',
            }}
          >
            <div>
              <p className="type-label text-accent" style={{ marginBottom: 'var(--space-12)' }}>
                OUR PURPOSE
              </p>
              <h2 className="type-heading-1 text-primary" style={{ maxWidth: '480px' }}>
                BRIDGING THE CHASM BETWEEN THEORY AND SHIPPING.
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
              <p className="type-body text-secondary">
                At Bharati Vidyapeeth Department of Engineering and Technology, Navi Mumbai, we recognized that engineering education is incomplete without hands-on creation. As an official chapter of HackWithIndia, our mandate is to cultivate a relentless building culture where ideas transform into production code.
              </p>
              <p className="type-body text-secondary">
                We believe that talent is ubiquitous, but opportunity and community are not. We provide students with mentorship, computing resources, hackathon platforms, and an ambitious peer group that pushes each member to excel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars (Using Existing Website Copy) */}
      <section style={{ padding: 'var(--space-96) 0', background: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--border-default)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-64)' }}>
            <p className="type-label text-accent" style={{ marginBottom: 'var(--space-8)' }}>FOUR FOUNDATIONAL PILLARS</p>
            <h2 className="type-heading-1 text-primary">HOW WE OPERATE</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-32)',
            }}
          >
            {[
              {
                num: '01',
                title: 'HANDS-ON LEARNING',
                desc: 'Workshops on AI, Blockchain, and modern Web Dev. We build real, production-ready projects, not passive tutorials.',
              },
              {
                num: '02',
                title: 'HACKATHON CULTURE',
                desc: '24+ hour hackathons where students architect, debug, and ship real solutions under high-pressure real-world constraints.',
              },
              {
                num: '03',
                title: 'INDUSTRY EXPOSURE',
                desc: 'Expert sessions on career trajectories, emerging architectural patterns, and entrepreneurial thinking with tech founders.',
              },
              {
                num: '04',
                title: 'COMMUNITY NETWORK',
                desc: 'Connecting our campus into the nationwide HackWithIndia ecosystem of student builders, mentors, and industry collaborators.',
              },
            ].map((pillar) => (
              <div
                key={pillar.num}
                className="about-reveal-item"
                style={{
                  padding: 'var(--space-32)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-16)',
                  opacity: 0,
                  transform: 'translateY(24px)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    color: '#ef4444',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                  }}
                >
                  {pillar.num}
                </span>
                <h3 className="type-heading-2 text-primary">{pillar.title}</h3>
                <p className="type-body-small text-secondary">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Numbers & Impact */}
      <section style={{ padding: 'var(--space-96) 0', borderTop: '1px solid var(--border-default)' }}>
        <div className="container">
          <div
            className="about-reveal-item"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-48)',
              opacity: 0,
              transform: 'translateY(24px)',
            }}
          >
            {[
              { num: '200+', label: 'ACTIVE DEVELOPERS', desc: 'Passionate student coders, designers, and systems builders.' },
              { num: '6+', label: 'FLAGSHIP EVENTS', desc: 'From HackWithMumbai to nationwide developer tours.' },
              { num: '24h', label: 'LONGEST HACKATHON', desc: 'Nonstop high-velocity engineering and deployment.' },
              { num: '50+', label: 'PROJECTS SHIPPED', desc: 'Real tools, dApps, AI prototypes, and full-stack platforms.' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-12)',
                  borderTop: '1px solid var(--border-default)',
                  paddingTop: 'var(--space-24)',
                }}
              >
                <span className="type-number text-primary" style={{ fontSize: '3rem' }}>
                  {stat.num}
                </span>
                <span className="type-heading-2 text-accent" style={{ fontSize: '1rem' }}>
                  {stat.label}
                </span>
                <p className="type-body-small text-tertiary">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Institutional Governance & Vision */}
      <section style={{ padding: 'var(--space-96) 0 var(--space-section)', borderTop: '1px solid var(--border-default)' }}>
        <div className="container">
          <div
            className="about-reveal-item"
            style={{
              maxWidth: '850px',
              margin: '0 auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-32)',
              opacity: 0,
              transform: 'translateY(24px)',
            }}
          >
            <KokonutBadge variant="secondary">COMMUNITY & COLLABORATION</KokonutBadge>
            <h2 className="type-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              BUILD THE FUTURE WITH US.
            </h2>
            <p className="type-body text-secondary" style={{ maxWidth: '620px' }}>
              Whether you are an aspiring first-year coder looking for your first hackathon team, or an advanced systems engineer ready to mentor, HackWithIndia BVUDET-NM has a place for you.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-16)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <KokonutButton href="/join" variant="primary">
                Join the Chapter
              </KokonutButton>
              <KokonutButton href="/events" variant="outline">
                Explore Events
              </KokonutButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterChapter />
    </main>
  );
}
