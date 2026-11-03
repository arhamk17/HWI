'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Users, Clock, MapPin, Layers } from 'lucide-react';

interface Milestone {
  id: string;
  date: string;
  title: string;
  shortTitle: string;
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
    id: 'learn-it-tour',
    date: 'JUL 2025',
    title: 'HACKWITHINDIA - BVUDET LEARN IT TOUR',
    shortTitle: 'LEARN IT TOUR',
    badge: 'COMMUNITY TECH TOUR',
    participants: '220 BUILDERS',
    projects: '3 KEYNOTES & SESSIONS',
    duration: '5 HOURS',
    venue: 'BVUDET Auditorium, Navi Mumbai',
    image: '/images/events/learn_it_tour_image12.jpeg',
    description: 'Conducted in collaboration with Devnovate, the Learn IT Tour united 220 students from across Maharashtra for practical sessions on open-source ecosystems, tech career growth, and startup engineering.',
  },
  {
    id: 'hackwithmumbai-1',
    date: 'SEP 2025',
    title: 'HACKWITHMUMBAI 1.0',
    shortTitle: 'HACKWITHMUMBAI 1.0',
    badge: 'FLAGSHIP 24H SPRINT',
    participants: '140+ BUILDERS',
    projects: '35 REAL APPS',
    duration: '24 HOURS CONTINUOUS',
    venue: 'BVUDET Campus, Navi Mumbai',
    image: '/images/hwMUM1.jpeg',
    description: 'The foundational collegiate hackathon establishing HWI BVUDET-NM as a premier engineering chapter. 140+ student developers built real-world apps across civic tech, tooling, and system automation.',
  },
  {
    id: 'build-it-tour',
    date: 'SEP 2025',
    title: 'BUILD IT TOUR 2.0 (MICROSOFT)',
    shortTitle: 'BUILD IT TOUR 2.0',
    badge: 'MICROSOFT EDITION 2025',
    participants: '120+ BUILDERS',
    projects: 'ARCHITECTURE SESSIONS',
    duration: 'FULL DAY INTENSIVE',
    venue: 'Microsoft Office, Mumbai',
    image: '/images/events/built_it_tour_image5.jpeg',
    description: 'Held at the Microsoft Headquarters in Mumbai under faculty coordination, giving 120 aspiring engineers exposure to enterprise cloud architecture, emerging system paradigms, and tech careers.',
  },
  {
    id: 'hackwithmumbai-2',
    date: 'FEB 2026',
    title: 'HACKWITHMUMBAI 2.0',
    shortTitle: 'HACKWITHMUMBAI 2.0',
    badge: 'NATIONAL 30H HACKATHON',
    participants: '280 BUILDERS (80 TEAMS)',
    projects: '80 FINALIST PROTOTYPES',
    duration: '30 HOURS NONSTOP',
    venue: 'BVUDET Main Arena, Navi Mumbai',
    image: '/images/events/hack_with_mumbai_2_image16.jpeg',
    description: 'The monumental second edition scaling across western India with 280 finalists across 80 teams representing 5 states, innovating nonstop for 30 hours with venture jury evaluation.',
  },
  {
    id: 'zero2web3',
    date: 'MAR 2026',
    title: 'ZERO2WEB3 WORKSHOP & BUILDATHON',
    shortTitle: 'ZERO2WEB3 BUILD-A-THON',
    badge: 'BLOCKCHAIN & EVM LAB',
    participants: '110 BUILDERS',
    projects: 'SOLIDITY SMART CONTRACTS',
    duration: '18 HOURS INTENSIVE',
    venue: 'Central Computing Lab, BVUDET',
    image: '/images/events/web3_report_image5.jpeg',
    description: 'A deep-dive technical protocol buildathon focused on EVM mechanics, smart contract auditing, and decentralized state architecture conducted live in the CC Lab.',
  },
  {
    id: 'rocketride',
    date: 'AUG 2026',
    title: 'ROCKETRIDE BUILDATHON',
    shortTitle: 'ROCKETRIDE BUILDATHON',
    badge: 'INTERNATIONAL DELEGATION',
    participants: '183 BUILDERS (47 TEAMS)',
    projects: '42 PLATFORMS · ₹1,00,000+',
    duration: '30 HOURS SPRINT',
    venue: 'BVUDET Main Auditorium & CC Lab',
    image: '/images/events/rocketride_winner_1st.jpg',
    description: 'International keynote and hands-on code reviews by Ryan & Rod Christensen from RocketRide San Francisco, connecting 183 student builders across 47 teams with Silicon Valley mentorship.',
  },
  {
    id: 'ctf-zero-internet',
    date: 'OCT 2026',
    title: 'ZERO INTERNET CTF',
    shortTitle: 'ZERO INTERNET CTF',
    badge: 'AIR-GAPPED CYBERSECURITY',
    participants: '160+ OPERATIVES (40 TEAMS)',
    projects: '7 EXPLOITATION TRACKS',
    duration: '8 HOURS AIR-GAPPED',
    venue: 'Advanced Networks & Cyber Lab',
    image: '/images/events/ctf/ctf_image7.jpg',
    description: 'An elite, offline, zero-connectivity cybersecurity competition testing offensive security, cryptographic exploitation, and binary defense under strict air-gapped constraints.',
  },
];

export function AboutJourney() {
  const [selectedId, setSelectedId] = useState<string>('learn-it-tour');

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
                    {milestone.date}
                  </span>
                  <span className="about-journey__item-title">
                    {milestone.shortTitle}
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
              <div className="about-journey__dossier-media">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                  quality={85}
                />
                <div className="about-journey__dossier-media-overlay" />
                <div className="about-hud-corner about-hud-corner--tl" />
                <div className="about-hud-corner about-hud-corner--tr" />
                <div className="about-hud-corner about-hud-corner--bl" />
                <div className="about-hud-corner about-hud-corner--br" />
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
                  <div className="about-journey__stat-cell">
                    <div className="about-journey__stat-icon-wrap">
                      <Users size={14} className="about-journey__stat-icon" />
                      <span className="about-journey__dossier-stat-label">Scale</span>
                    </div>
                    <div className="about-journey__dossier-stat-num">
                      {selected.participants}
                    </div>
                  </div>

                  <div className="about-journey__stat-cell">
                    <div className="about-journey__stat-icon-wrap">
                      <Clock size={14} className="about-journey__stat-icon" />
                      <span className="about-journey__dossier-stat-label">Duration</span>
                    </div>
                    <div className="about-journey__dossier-stat-num">
                      {selected.duration}
                    </div>
                  </div>

                  <div className="about-journey__stat-cell">
                    <div className="about-journey__stat-icon-wrap">
                      <Layers size={14} className="about-journey__stat-icon" />
                      <span className="about-journey__dossier-stat-label">Output</span>
                    </div>
                    <div className="about-journey__dossier-stat-num">
                      {selected.projects}
                    </div>
                  </div>

                  <div className="about-journey__stat-cell">
                    <div className="about-journey__stat-icon-wrap">
                      <MapPin size={14} className="about-journey__stat-icon" />
                      <span className="about-journey__dossier-stat-label">Venue</span>
                    </div>
                    <div className="about-journey__dossier-stat-num">
                      {selected.venue}
                    </div>
                  </div>
                </div>

                <div className="about-journey__dossier-footer">
                  <Link
                    href="/events"
                    className="about-journey__explore-link"
                  >
                    <span>EXPLORE ALL EDITIONS IN EVENTS</span>
                    <ArrowUpRight size={14} />
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
