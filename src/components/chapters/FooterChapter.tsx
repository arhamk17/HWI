'use client';

import Link from 'next/link';
import { ScrollFurtherTrigger } from '@/components/ScrollFurther/ScrollFurtherTrigger';

export function FooterChapter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" style={{
      position: 'relative',
      zIndex: 2,
      width: '100%',
      borderTop: '1px solid var(--border-default)',
      padding: 'var(--space-64) 0 0',
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-48)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', marginBottom: 'var(--space-8)' }}>
              <img
                src="/hwi-bvudet-logo.png"
                alt="HackWithIndia BVUDET-NM Chapter logo"
                style={{ width: '52px', height: '52px', objectFit: 'contain', borderRadius: '50%' }}
                loading="lazy"
                decoding="async"
              />
              <h3 className="type-heading-2 text-primary">HACK WITH INDIA</h3>
            </div>
            <p className="type-body-small text-tertiary">BVUDET-NM Chapter</p>
            <p className="type-body-small text-tertiary" style={{ marginTop: 'var(--space-8)' }}>A chapter of HackWithIndia</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-24)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-24)', flexWrap: 'wrap' }}>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="type-label text-secondary hover-accent">DISCORD</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="type-label text-secondary hover-accent">X</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="type-label text-secondary hover-accent">GITHUB</a>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-24)', flexWrap: 'wrap' }}>
              {[
                { label: 'HOME', href: '/' },
                { label: 'ABOUT', href: '/about' },
                { label: 'EVENTS', href: '/events' },
                { label: 'TEAMS', href: '/team' },
                { label: 'JOIN', href: '/join' },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="type-label text-tertiary hover-accent">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: '1px', background: 'var(--border-default)', margin: 'var(--space-48) 0 var(--space-24)' }} />

        <div style={{ paddingBottom: 'var(--space-32)' }}>
          <p className="type-body-small text-tertiary">
            © {currentYear} Hack With India. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Scroll Further to Next Chapter Gesture Portal ── */}
      <ScrollFurtherTrigger />
    </footer>
  );
}
