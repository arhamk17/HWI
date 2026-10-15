'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './EventEntry.css';

export interface EventProps {
  title: string;
  date: string;
  description: string;
  status: 'past' | 'upcoming';
  imageUrl?: string;
  link?: string;
}

export function EventEntry({ title, date, description, status, imageUrl, link }: EventProps) {
  const entryRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!entryRef.current || !contentRef.current) return;

    gsap.fromTo(contentRef.current.children, 
      { opacity: 0, y: 24 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: entryRef.current,
          start: 'top 85%',
          once: true,
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="event-entry" ref={entryRef}>
      <div className="event-entry__rule"></div>
      <div className="event-entry__date type-mono text-tertiary">
        {date}
      </div>
      
      <div className="event-entry__content" ref={contentRef}>
        <div className="event-entry__header">
          <h3 className="type-heading-1 text-primary">{title}</h3>
          <span className={`event-entry__badge event-entry__badge--${status} type-label`}>
            {status}
          </span>
        </div>
        
        <p className="event-entry__desc type-body text-secondary">
          {description}
        </p>
        
        {imageUrl && (
          <div className="event-entry__image-wrapper">
            <Image 
              src={imageUrl} 
              alt={title} 
              fill 
              className="event-entry__image" 
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}
      </div>
    </div>
  );
}
