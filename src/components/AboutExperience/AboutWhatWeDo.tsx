'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface WhatCard {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  image: string;
  tags: string[];
  color: string;
  glow: string;
  linkText: string;
  href: string;
}

const WHAT_CARDS: WhatCard[] = [
  {
    id: 'hackathons',
    eyebrow: 'VECTOR 01 // CRUCIBLE OF SPRINTING',
    title: '24H–36H HIGH-VELOCITY HACKATHONS',
    desc: 'High-intensity, continuous engineering marathons where student teams architect, debug, and ship production prototypes under strict deadlines with live industry judging and venture awards.',
    image: '/images/events/rocketride_hackers.jpg',
    tags: ['HACKWITHMUMBAI 1.0 & 2.0', 'BUILDTHEFUTURE 36H', 'ROCKETRIDE'],
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.25)',
    linkText: 'EXPLORE HACKATHONS',
    href: '/events',
  },
  {
    id: 'bootcamps',
    eyebrow: 'VECTOR 02 // LAB ACCELERATION',
    title: 'TECHNICAL LAB BOOTCAMPS & WORKSHOPS',
    desc: 'Hands-on architectural masterclasses held in campus computing labs, training developers in smart contract security, machine learning pipelines, and distributed systems design.',
    image: '/images/events/rocketride_mentorship_lab.jpg',
    tags: ['ZERO2WEB3 EVM LAB', 'DEVNOVATE LEARN IT', 'SYSTEMS BOOTCAMP'],
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.25)',
    linkText: 'VIEW LAB SESSIONS',
    href: '/events',
  },
  {
    id: 'delegations',
    eyebrow: 'VECTOR 03 // GLOBAL ECOSYSTEM',
    title: 'GLOBAL DELEGATIONS & TECH SUMMITS',
    desc: 'Direct partnerships connecting our Navi Mumbai campus with international tech leaders, venture founders, and Silicon Valley engineers for keynotes, live code audits, and global career pathways.',
    image: '/images/events/rocketride_keynote.jpg',
    tags: ['SF DELEGATION', 'RYAN & ROD CHRISTENSEN', 'FOUNDER KEYNOTES'],
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.25)',
    linkText: 'DISCOVER DELEGATIONS',
    href: '/events',
  },
  {
    id: 'commons',
    eyebrow: 'VECTOR 04 // COLLECTIVE POWER',
    title: 'PAN-MAHARASHTRA BUILDER COMMONS',
    desc: 'An interconnected network of over 1,400 student builders, collegiate campus leads, and alumni across western India collaborating on open-source repositories and cross-college hackathon squads.',
    image: '/images/events/learn_it_tour_image12.jpeg',
    tags: ['1,400+ BUILDERS', 'CAMPUS LEADS MESH', 'OPEN SOURCE COMMONS'],
    color: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.25)',
    linkText: 'JOIN BUILDER COMMONS',
    href: '/join',
  },
];

export function AboutWhatWeDo() {
  return (
    <section className="about-section" id="what-we-do">
      <div className="about-container">
        <div className="about-manifesto__header about-reveal">
          <div className="about-section-eyebrow">
            04 // CORE INITIATIVES
          </div>
          <h2 className="about-manifesto__title">
            WHAT HWI DOES
          </h2>
          <p className="type-body text-secondary" style={{ marginTop: '16px' }}>
            Four operational vectors delivering real engineering opportunities, high-stakes events, and global industry access.
          </p>
        </div>

        <div className="about-what__grid">
          {WHAT_CARDS.map((card, index) => (
            <div
              key={card.id}
              className={`about-what__card about-reveal about-delay-${index + 1}`}
              style={
                {
                  '--what-color': card.color,
                  '--what-glow': card.glow,
                } as React.CSSProperties
              }
            >
              <div className="about-what__media-wrapper">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className="about-what__card-content">
                <span className="about-what__card-eyebrow">
                  {card.eyebrow}
                </span>

                <h3 className="about-what__card-title">
                  {card.title}
                </h3>

                <p className="about-what__card-desc">
                  {card.desc}
                </p>

                <div className="about-what__card-tags">
                  {card.tags.map((tag) => (
                    <span key={tag} className="about-what__tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div>
                  <Link
                    href={card.href}
                    className="type-label"
                    style={{
                      color: card.color,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      letterSpacing: '0.12em',
                      fontWeight: 600,
                    }}
                  >
                    <span>{card.linkText} →</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
