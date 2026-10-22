'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Milestone {
  id: string;
  date: string;
  title: string;
  badge: string;
  participants: string;
  projects: string;
  duration: string;
  venue: string;
  image: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 'hackwithmumbai-1',
    date: 'FEB 2025',
    title: 'HACKWITHMUMBAI 1.0',
    badge: 'FLAGSHIP 24H SPRINT',
    participants: '340+ BUILDERS',
    projects: '45 REAL APPS',
    duration: '24 HOURS CONTINUOUS',
    venue: 'BVUDET Auditorium & Computer Center',
    image: '/images/hwMUM1.jpeg',
    description: 'The breakthrough flagship hackathon that established HWI BVUDET-NM as a premier engineering chapter. 340+ developers packed the campus for a nonstop 24-hour deployment marathon.',
  },
  {
    id: 'build-it-tour',
    date: 'APR 2025',
    title: 'BUILD IT TOUR 2025',
    badge: 'STATEWIDE SPRINT',
    participants: '180+ BUILDERS',
    projects: '28 PROTOTYPES',
    duration: 'MULTI-CITY WORKSHOPS',
    venue: 'Campus Tech Hubs',
    image: '/images/events/hack_with_mumbai_1_image6.jpeg',
    description: 'A dedicated engineering roadshow bringing modern developer toolkits, API integrations, and hackathon strategies directly to student laboratories across the region.',
  },
  {
    id: 'learn-it-tour',
    date: 'JUL 2025',
    title: 'HACKWITHINDIA - BVUDET LEARN IT TOUR',
    badge: 'COMMUNITY TECH TOUR',
    participants: '220 BUILDERS',
    projects: '3 KEYNOTES & SESSIONS',
    duration: '5 HOURS',
    venue: 'BVUDET-NM Auditorium',
    image: '/images/events/learn_it_tour_image4.png',
    description: 'Organized in collaboration with Devnovate, uniting 220 students from across Maharashtra for practical sessions on open source, developer career growth, and startup engineering.',
  },
  {
    id: 'buildthefuture',
    date: 'AUG 2025',
    title: 'BUILDTHEFUTURE SPRINT',
    badge: '36H MARATHON',
    participants: '420+ PARTICIPANTS',
    projects: '58 SYSTEMS',
    duration: '36 HOURS (CHAPTER RECORD)',
    venue: 'BVUDET Innovation Labs',
    image: '/images/events/hack_with_mumbai_2_image16.jpeg',
    description: 'The longest continuous hackathon sprint in chapter history. 420+ builders tackled complex problems in machine learning, distributed infrastructure, and autonomous agent systems.',
  },
  {
    id: 'zero2web3',
    date: 'OCT 2025',
    title: 'ZERO2WEB3 BUILDATHON',
    badge: 'BLOCKCHAIN & PROTOCOLS',
    participants: '160+ BUILDERS',
    projects: '22 SMART CONTRACTS',
    duration: '18 HOURS INTENSIVE',
    venue: 'Central Computing Lab, BVUDET',
    image: '/images/events/web3_report_image5.jpeg',
    description: 'A deep-dive technical protocol buildathon focused on EVM mechanics, smart contract auditing, and decentralized state architecture in high-velocity lab conditions.',
  },
  {
    id: 'rocketride',
    date: 'JAN 2026',
    title: 'ROCKETRIDE BUILDATHON',
    badge: 'INTERNATIONAL DELEGATION',
    participants: '47 TEAMS (183 BUILDERS)',
    projects: '42 PLATFORMS',
    duration: '30 HOURS SPRINT',
    venue: 'BVUDET Main Auditorium',
    image: '/images/events/rocketride_auditorium.jpg',
    description: 'International keynote sessions by Ryan Christensen and Rod Christensen from RocketRide, San Francisco, connecting 183 student builders across 47 teams with global tech mentorship.',
  },
  {
    id: 'hackwithmumbai-2',
    date: 'MAR 2026',
    title: 'HACKWITHMUMBAI 2.0',
    badge: 'INTERCOLLEGIATE SUMMIT',
    participants: '480+ PARTICIPANTS',
    projects: '65 SUBMISSIONS',
    duration: '24 HOURS SPRINT',
    venue: 'Pan-Campus Facilities',
    image: '/images/events/rocketride_hackers.jpg',
    description: 'The monumental second edition of HackWithMumbai, scaling to 480+ participants representing colleges across western India with tier-1 venture prizes and industry mentorship.',
  },
];

/**
 * Normalizes any date string to strictly Month and Year (e.g., "JUL 2025", "FEB 2025").
 * Removes any leading day numbers or range indicators.
 */
function formatJourneyDate(dateString: string): string {
  // Strip leading day numbers/ranges like "16 ", "7–8 ", "21 "
  const cleaned = dateString.replace(/^\d+[\s–-]*[A-Za-z]*/, (match) => {
    return match.replace(/^\d+[\s–-]*/, '');
  }).trim();

  // If already "MMM YYYY", return uppercase
  return cleaned.toUpperCase();
}

export function AboutJourney() {
  const [selectedId, setSelectedId] = useState<string>('hackwithmumbai-1');

  const selected = MILESTONES.find((m) => m.id === selectedId) || MILESTONES[0];

  return (
    <section className="about-section" id="journey">
      <div className="about-container">
        <div className="about-manifesto__header about-reveal">
          <div className="about-section-eyebrow">
            03 // CHAPTER MILESTONES
          </div>
          <h2 className="about-manifesto__title">
            THE HWI JOURNEY
          </h2>
          <p className="type-body text-secondary" style={{ marginTop: '16px' }}>
            Seven verified milestone editions charting our evolution from campus workshops to intercollegiate hackathon summits.
          </p>
        </div>

        <div className="about-journey__grid">
          {/* Milestone Selector List */}
          <div className="about-journey__list about-reveal">
            {MILESTONES.map((milestone) => {
              const isSelected = milestone.id === selected.id;
              const formattedDate = formatJourneyDate(milestone.date);
              return (
                <div
                  key={milestone.id}
                  className={`about-journey__item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedId(milestone.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedId(milestone.id);
                    }
                  }}
                  aria-pressed={isSelected}
                >
                  <span className="about-journey__item-date">
                    {formattedDate}
                  </span>
                  <span className="about-journey__item-title">
                    {milestone.title}
                  </span>
                  <span className="about-journey__item-metric">
                    {milestone.participants}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sticky Milestone Dossier Preview */}
          <div className="about-reveal about-delay-2">
            <div className="about-journey__dossier">
              {/* Corner HUD markers */}
              <div className="about-hud-corner about-hud-corner--tl" />
              <div className="about-hud-corner about-hud-corner--tr" />
              <div className="about-hud-corner about-hud-corner--bl" />
              <div className="about-hud-corner about-hud-corner--br" />

              <div className="about-journey__dossier-media">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className="about-journey__dossier-body">
                <div className="about-journey__dossier-badge">
                  {selected.badge}
                </div>
                
                <h3 className="about-journey__dossier-title">
                  {selected.title}
                </h3>
                
                <p className="about-journey__dossier-desc">
                  {selected.description}
                </p>

                <div className="about-journey__dossier-stats">
                  <div>
                    <div className="about-journey__dossier-stat-num">
                      {selected.participants}
                    </div>
                    <div className="about-journey__dossier-stat-label">
                      Scale & Attendance
                    </div>
                  </div>
                  <div>
                    <div className="about-journey__dossier-stat-num">
                      {selected.duration}
                    </div>
                    <div className="about-journey__dossier-stat-label">
                      Sprint Duration
                    </div>
                  </div>
                  <div>
                    <div className="about-journey__dossier-stat-num">
                      {selected.projects}
                    </div>
                    <div className="about-journey__dossier-stat-label">
                      Output / Delivery
                    </div>
                  </div>
                  <div>
                    <div className="about-journey__dossier-stat-num">
                      {selected.venue}
                    </div>
                    <div className="about-journey__dossier-stat-label">
                      Host Facility
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <Link
                    href="/events"
                    className="type-label"
                    style={{
                      color: '#00F0FF',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      letterSpacing: '0.12em',
                      fontWeight: 600,
                    }}
                  >
                    <span>EXPLORE ALL EDITIONS IN CHRONICLE →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
