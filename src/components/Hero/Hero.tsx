'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import './Hero.css';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    gsap.fromTo(contentRef.current, 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

  return (
    <section className="hero" ref={containerRef}>

      <div className="hero__container">
        <div className="hero__content" ref={contentRef}>
          <h1 className="type-display hero__title">
            HACK WITH INDIA<br/>
            <span className="hero__subtitle">BVUDET-NM CHAPTER</span>
          </h1>
          <h2 className="type-heading-1 hero__tagline">
            Innovate. Create. Elevate.
          </h2>
          <p className="type-body hero__descriptor">
            The student developer community at Bharati Vidyapeeth, Navi Mumbai
          </p>
        </div>
        
        <div className="hero__cta-group">
          <Link href="/register" className="btn btn--primary">
            Join the Chapter
          </Link>
          <Link href="/events" className="btn btn--secondary">
            Our Events
          </Link>
        </div>
      </div>
    </section>
  );
}
