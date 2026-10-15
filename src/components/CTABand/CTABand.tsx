'use client';

import Link from 'next/link';
import './CTABand.css';

export function CTABand() {
  return (
    <section className="cta-band">
      <div className="cta-band__container">
        <h2 className="type-display text-primary cta-band__title">READY TO BUILD?</h2>
        
        <p className="type-body text-secondary cta-band__desc">
          Join HackWithIndia at BVUDET Navi Mumbai.
        </p>
        
        <Link href="/register" className="btn btn--primary cta-band__btn">
          JOIN THE CHAPTER
        </Link>
      </div>
    </section>
  );
}
