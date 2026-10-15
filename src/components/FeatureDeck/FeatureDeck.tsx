'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FeatureDeck.css';

export function FeatureDeck() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  const features = [
    {
      number: '01',
      title: 'HANDS-ON LEARNING',
      description: 'Workshops on AI, Blockchain, and modern Web Dev. Build real projects, not tutorials.'
    },
    {
      number: '02',
      title: 'HACKATHON CULTURE',
      description: '24+ hour hackathons where you ship real solutions under real pressure.'
    },
    {
      number: '03',
      title: 'INDUSTRY EXPOSURE',
      description: 'Expert sessions on career paths, emerging tech, and entrepreneurial thinking.'
    },
    {
      number: '04',
      title: 'COMMUNITY NETWORK',
      description: 'Join a national network of student developers, mentors, and collaborators.'
    },
    {
      number: '05',
      title: 'PLATFORM TO RISE',
      description: 'We give a platform to those who are able but lack the chance. Upskill and rise.'
    }
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!sectionRef.current || !deckRef.current) return;

    // Pin the entire section
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=400%', // 400vh scroll range for the 5 cards
      pin: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      }
    });

    // Animate each card stacking
    cardsRef.current.forEach((card, i) => {
      if (!card || i === 0) return; // Skip first card, it's already there
      
      const previousCards = cardsRef.current.slice(0, i);
      
      gsap.fromTo(card,
        { y: '100vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${(i - 1) * 100}% top`,
            end: `top+=${i * 100}% top`,
            scrub: true,
          }
        }
      );
      
      // Compress previous cards
      previousCards.forEach((prevCard, j) => {
        if (!prevCard) return;
        
        gsap.to(prevCard, {
          scale: 1 - ((i - j) * 0.05),
          y: -((i - j) * 20),
          opacity: 1 - ((i - j) * 0.15), // Keep the glass plate mostly visible
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${(i - 1) * 100}% top`,
            end: `top+=${i * 100}% top`,
            scrub: true,
          }
        });

        // Fade out the content of the previous card to prevent text bleed
        const innerContent = prevCard.querySelector('.feature-card__content-wrap');
        if (innerContent) {
          gsap.to(innerContent, {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${(i - 1) * 100}% top`,
              end: `top+=${(i - 0.5) * 100}% top`, // Fades out before the new card fully lands
              scrub: true,
            }
          });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="feature-deck" ref={sectionRef}>
      <div className="feature-deck__container">
        <div className="feature-deck__header">
          <p className="type-eyebrow text-accent">WHY JOIN</p>
          <h2 className="type-display text-primary">WHAT WE OFFER</h2>
        </div>
        
        <div className="feature-deck__content">
          <div className="feature-deck__arm-space">
            {/* Empty space to let the global Industrial Arm show through */}
          </div>
          
          <div className="feature-deck__cards" ref={deckRef}>
            {features.map((feature, i) => (
              <div 
                key={feature.number}
                className="feature-card"
                ref={el => {
                  if (el) cardsRef.current[i] = el;
                }}
                style={{ zIndex: i + 1 }}
              >
                <div className="feature-card__content-wrap">
                  <div className="feature-card__number type-number text-accent">{feature.number}</div>
                  <h3 className="feature-card__title type-heading-1 text-primary">{feature.title}</h3>
                  <p className="feature-card__desc type-body text-secondary">{feature.description}</p>
                  <div className="feature-card__rule"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
