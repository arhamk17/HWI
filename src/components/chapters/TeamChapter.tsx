'use client';

import { useEffect, useRef } from 'react';
import { scrollBus } from '@/lib/scrollBus';
import { teamStore } from '@/lib/teamStore';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';
import { KokonutBadge } from '@/components/KokonutUI/KokonutBadge';
import {
  Tenure2025Placeholder,
  Tenure2026Placeholder,
  TeacherCoordinatorPlaceholder,
  FacultyMentorsPlaceholder,
} from './TeamPlaceholders';
import './TeamChapter.css';

// ========================================================
// DATA MODEL - Easily replaceable with real photos later
// To replace a placeholder with a real photo in the future,
// simply specify: image: '/path/to/photograph.jpg'
// ========================================================
export interface LeadershipCardData {
  id: string;
  number: string;
  title: string;
  year?: string;
  description: string;
  badge: string;
  tag: string;
  image?: string; // Optional real image path
  PlaceholderComponent: React.ComponentType<{ className?: string }>;
}

const LEADERSHIP_CARDS: LeadershipCardData[] = [
  {
    id: 'tenure-2025',
    number: '01',
    title: 'HWI TENURE',
    year: '2025–26',
    description: 'Leadership & Core Team',
    badge: 'ANNUAL TENURE',
    tag: 'FOUNDING CHAPTER',
    image: '', // Insert image path here when available
    PlaceholderComponent: Tenure2025Placeholder,
  },
  {
    id: 'tenure-2026',
    number: '02',
    title: 'HWI TENURE',
    year: '2026–27',
    description: 'Incoming Chapter Vision',
    badge: 'NEXT GENERATION',
    tag: 'FORWARD VISION',
    image: '', // Insert image path here when available
    PlaceholderComponent: Tenure2026Placeholder,
  },
  {
    id: 'teacher-coordinator',
    number: '03',
    title: 'TEACHER COORDINATOR',
    description: 'Faculty Coordination & Chapter Mentorship',
    badge: 'ACADEMIC ADVISOR',
    tag: 'CHAPTER MENTOR',
    image: '', // Insert image path here when available
    PlaceholderComponent: TeacherCoordinatorPlaceholder,
  },
  {
    id: 'faculty-mentors',
    number: '04',
    title: 'FACULTY & MENTORS',
    description: 'Faculty & Mentorship • Advisory Council',
    badge: 'ADVISORY BOARD',
    tag: 'INDUSTRY ADVISORS',
    image: '', // Insert image path here when available
    PlaceholderComponent: FacultyMentorsPlaceholder,
  },
];

export function TeamChapter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const indicatorDotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const unsubscribe = scrollBus.subscribe(() => {
      if (!containerRef.current || !stickyRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const rawP = -rect.top / totalScrollable;
      const p = Math.max(0, Math.min(1, rawP));

      // 4 cards -> 3 intervals
      const cardProgress = p * (LEADERSHIP_CARDS.length - 1);
      const activeIdx = Math.min(LEADERSHIP_CARDS.length - 1, Math.max(0, Math.round(cardProgress)));

      // Notify global background team store for synchronized background crossfades
      teamStore.update(activeIdx, p);

      // Update counter
      if (counterRef.current) {
        counterRef.current.textContent = `0${activeIdx + 1} / 0${LEADERSHIP_CARDS.length}`;
      }

      // Update indicator dots
      indicatorDotsRef.current.forEach((dot, idx) => {
        if (!dot) return;
        if (idx === activeIdx) {
          dot.classList.add('team-showcase__indicator-dot--active');
        } else {
          dot.classList.remove('team-showcase__indicator-dot--active');
        }
      });

      // Transform cards with Lenis fanning & stacking interaction
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        const diff = idx - cardProgress;

        if (Math.abs(diff) < 0.05) {
          card.classList.add('team-card--active');
        } else {
          card.classList.remove('team-card--active');
        }

        let translateX = 0;
        let scale = 1.0;
        let opacity = 1.0;
        let zIndex = 10;

        if (diff < 0) {
          // Card has passed: stack smoothly to the left
          translateX = Math.max(-105, diff * 65);
          scale = Math.max(0.88, 1 + diff * 0.05);
          opacity = Math.max(0.15, 1 + diff * 0.35);
          zIndex = 10 + Math.round(diff * 2);
        } else if (diff > 0) {
          // Card is upcoming: slide in from right
          translateX = Math.min(115, diff * 80);
          scale = Math.max(0.9, 1 - diff * 0.05);
          opacity = Math.max(0, 1 - (diff - 0.2) * 1.4);
          zIndex = 10 - Math.round(diff * 2);
        } else {
          // Centered active card
          translateX = 0;
          scale = 1.0;
          opacity = 1.0;
          zIndex = 15;
        }

        card.style.transform = `translate3d(${translateX.toFixed(2)}%, 0, 0) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = zIndex.toString();
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section className="team-showcase" ref={containerRef} id="team">
      <div className="team-showcase__sticky" ref={stickyRef}>
        <div className="container" style={{ width: '100%' }}>
          {/* Header */}
          <div className="team-showcase__header">
            <div className="team-showcase__title-group">
              <p className="type-eyebrow text-accent">LEADERSHIP & MENTORSHIP</p>
              <h2 className="type-display text-primary">MEET THE CORE</h2>
            </div>
            <span className="team-showcase__counter" ref={counterRef}>
              01 / 04
            </span>
          </div>
        </div>

        {/* Card Track */}
        <div className="team-showcase__track-wrap">
          <div className="team-showcase__track">
            {LEADERSHIP_CARDS.map((card, idx) => {
              const Placeholder = card.PlaceholderComponent;

              return (
                <div
                  key={card.id}
                  className="team-card"
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                  data-cursor="team"
                  data-cursor-label="VIEW"
                >
                  {/* Image Hero Section of Card */}
                  <div className="team-card__image-wrap team-member-face">
                    {card.image ? (
                      <img src={card.image} alt={card.title} className="team-card__image" />
                    ) : (
                      <Placeholder className="team-card__image" />
                    )}

                    {/* Gradient Overlay */}
                    <div className="team-card__image-overlay" />

                    {/* Number and Badge Header Overlay */}
                    <div className="team-card__badges-overlay">
                      <span className="team-card__number">{card.number}</span>
                      <KokonutBadge variant="accent" dot>
                        {card.badge}
                      </KokonutBadge>
                    </div>
                  </div>

                  {/* Content Details Section of Card */}
                  <div className="team-card__content">
                    <div className="team-card__title-row">
                      <h3 className="team-card__title">{card.title}</h3>
                      {card.year && <span className="team-card__year">{card.year}</span>}
                      <p className="team-card__desc">{card.description}</p>
                    </div>

                    <div className="team-card__bottom">
                      <span className="team-card__tag">{card.tag}</span>
                      <span className="team-card__tag">HWI CHAPTER</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer in sticky */}
        <div className="container" style={{ width: '100%' }}>
          <div className="team-showcase__footer">
            <div className="team-showcase__indicator-bar">
              {LEADERSHIP_CARDS.map((_, i) => (
                <div
                  key={i}
                  className={`team-showcase__indicator-dot ${i === 0 ? 'team-showcase__indicator-dot--active' : ''}`}
                  ref={(el) => {
                    indicatorDotsRef.current[i] = el;
                  }}
                />
              ))}
            </div>

            <KokonutButton href="/team" variant="primary">
              View Chapter Directory
            </KokonutButton>
          </div>
        </div>
      </div>
    </section>
  );
}
