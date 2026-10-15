'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ChapterStory.css';

export function ChapterStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current) return;

    // Eyebrow and Headline animation
    gsap.fromTo(titleRef.current, 
      { opacity: 0, y: 32 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        }
      }
    );

    // Body text animation
    gsap.fromTo(textRef.current, 
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 0.5, 
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        }
      }
    );

    // Stats animation if we have them
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            once: true,
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="story" ref={containerRef}>
      <div className="story__container">
        <div className="story__content">
          <h2 className="story__title type-display" ref={titleRef}>
            Connecting talents, unlocking skills, and giving a platform to those who are able but lack the chance.
          </h2>
          
          <div className="story__body" ref={textRef}>
            <p className="type-body text-secondary">
              We are a premier student developer community at Bharati Vidyapeeth, Navi Mumbai. As an official chapter of HackWithIndia, we are dedicated to fostering a culture of innovation, hands-on building, and continuous learning. We don't just write code; we solve problems, build ecosystems, and empower the next generation of technologists.
            </p>
          </div>
          
          <div className="story__stats" ref={statsRef}>
            <div className="stat">
              <span className="stat__number type-heading-1 text-primary">200+</span>
              <span className="stat__label type-eyebrow text-tertiary">Active Members</span>
            </div>
            <div className="stat">
              <span className="stat__number type-heading-1 text-primary">6+</span>
              <span className="stat__label type-eyebrow text-tertiary">Major Events</span>
            </div>
            <div className="stat">
              <span className="stat__number type-heading-1 text-primary">24h</span>
              <span className="stat__label type-eyebrow text-tertiary">Hackathons</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
