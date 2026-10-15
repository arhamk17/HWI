'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Ecosystem.css';

export function Ecosystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current) return;

    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      
      const isEven = i % 2 === 0;
      const xOffset = isEven ? -50 : 50;

      gsap.fromTo(item, 
        { opacity: 0, x: xOffset },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            once: true,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const pillars = [
    {
      keyword: 'WORKSHOPS',
      description: 'Hands-on mastery of AI, Blockchain, and modern Web Dev. We believe in learning by doing, not just watching.',
    },
    {
      keyword: 'HACKATHONS',
      description: 'Intense 24+ hour sprints where you push your limits, innovate without boundaries, and compete with the best.',
    },
    {
      keyword: 'MEETUPS',
      description: 'Connect with industry experts, alumni, and fellow student developers. Build your network before you graduate.',
    },
    {
      keyword: 'PROJECTS',
      description: 'Collaborate on real-world applications. We open-source our chapter initiatives so everyone can contribute and learn.',
    }
  ];

  return (
    <section className="ecosystem" ref={containerRef}>
      <div className="ecosystem__container">
        <div className="ecosystem__header">
          <h2 className="type-eyebrow text-tertiary">Explore the Ecosystem</h2>
          <p className="type-heading-2 text-primary">A nexus of innovation, collaboration, and growth.</p>
        </div>
        
        <div className="ecosystem__list">
          {pillars.map((pillar, index) => (
            <div 
              key={pillar.keyword}
              className={`ecosystem__item ${index % 2 !== 0 ? 'ecosystem__item--reverse' : ''}`}
              ref={el => {
                if (el) itemsRef.current[index] = el;
              }}
            >
              <h3 className="type-display ecosystem__keyword">{pillar.keyword}</h3>
              <p className="type-body text-secondary ecosystem__desc">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
