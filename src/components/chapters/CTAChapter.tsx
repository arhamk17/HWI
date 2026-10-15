'use client';

export function CTAChapter() {
  return (
    <section className="chapter" id="join" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-24)', maxWidth: '700px' }}>
        <p className="type-eyebrow text-accent" style={{ letterSpacing: '0.3em' }}>JOIN US</p>
        <h2 className="type-intro">READY TO<br/>BUILD?</h2>
        <p className="type-body text-secondary" style={{ maxWidth: '450px' }}>
          Join HackWithIndia at BVUDET Navi Mumbai. Be part of the movement.
        </p>
        <a href="https://forms.google.com" target="_blank" rel="noopener noreferrer" className="btn btn--primary" style={{ marginTop: 'var(--space-32)' }}>
          JOIN THE CHAPTER
        </a>
      </div>
    </section>
  );
}
