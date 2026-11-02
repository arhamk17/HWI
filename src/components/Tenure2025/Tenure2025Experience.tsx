'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Maximize2,
  X,
  Crown,
  Users,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';
import {
  TENURE_2025_LEADERSHIP,
  TENURE_2025_HEADS,
  Tenure2025Member,
} from '@/data/tenure2025';
import './Tenure2025Experience.css';

export function Tenure2025Experience() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="tenure-page">
      {/* Ambient Radial Background Glows */}
      <div className="tenure-ambient-glow" aria-hidden="true" />
      <div className="tenure-ambient-glow-secondary" aria-hidden="true" />

      <div className="tenure-container">
        {/* Navigation Bar */}
        <div className="tenure-nav-bar">
          <Link href="/#team" className="tenure-back-btn" data-cursor="link">
            <ArrowLeft size={14} />
            <span>Back to Meet The Core</span>
          </Link>
          <span className="tenure-code-badge">TENURE ARCHIVE // 2025–26</span>
        </div>

        {/* Hero Header */}
        <header className="tenure-hero">
          <div className="tenure-hero__eyebrow">
            <Sparkles size={14} />
            <span>INAUGURAL CHAPTER LEADERSHIP</span>
          </div>
          <h1 className="tenure-hero__title">
            HWI TENURE <span>2025–26</span>
          </h1>
          <p className="tenure-hero__desc">
            The founding chapter council and department heads who pioneered HackWithIndia
            at Bharati Vidyapeeth, Navi Mumbai. Meet the builders who architected our first
            hackathons and established our developer community.
          </p>

          {/* Quick Stats Pill Row */}
          <div className="tenure-stats-row">
            <div className="tenure-stat-pill">
              <span className="tenure-stat-num">02</span>
              <span className="tenure-stat-label">Executive Leads</span>
            </div>
            <div className="tenure-stat-pill">
              <span className="tenure-stat-num">{TENURE_2025_HEADS.length.toString().padStart(2, '0')}</span>
              <span className="tenure-stat-label">Department Heads</span>
            </div>
            <div className="tenure-stat-pill">
              <span className="tenure-stat-num">01</span>
              <span className="tenure-stat-label">Founding Cohort</span>
            </div>
          </div>
        </header>

        {/* ========================================================
            SECTION 1: EXECUTIVE COUNCIL (PRESIDENT & VICE PRESIDENT)
            ======================================================== */}
        <section className="tenure-section" id="executive-leadership">
          <div className="tenure-section__title-bar">
            <div className="tenure-section__title-group">
              <span className="tenure-section__eyebrow">
                <Crown size={12} className="inline-icon" /> EXECUTIVE COUNCIL
              </span>
              <h2 className="tenure-section__heading">PRESIDENT & VICE PRESIDENT</h2>
            </div>
            <span className="tenure-section__tag">TENURE 2025–26</span>
          </div>

          <div className="tenure-exec-grid">
            {TENURE_2025_LEADERSHIP.map((member) => (
              <LeadershipCard key={member.id} member={member} isExecutive />
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 2: DEPARTMENT HEADS
            ======================================================== */}
        <section className="tenure-section" id="department-heads">
          <div className="tenure-section__title-bar">
            <div className="tenure-section__title-group">
              <span className="tenure-section__eyebrow">
                <Users size={12} className="inline-icon" /> ORGANIZATIONAL PILLARS
              </span>
              <h2 className="tenure-section__heading">DEPARTMENT HEADS</h2>
            </div>
            <span className="tenure-section__tag">FOUNDING HEADS</span>
          </div>

          <div className="tenure-heads-grid">
            {TENURE_2025_HEADS.map((member) => (
              <LeadershipCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 3: FULL COHORT GROUP PHOTOGRAPH
            ======================================================== */}
        <section className="tenure-section" id="cohort-photograph" aria-label="Official Cohort Photograph">
          <div className="tenure-section__title-bar">
            <div className="tenure-section__title-group">
              <span className="tenure-section__eyebrow">HISTORICAL ARCHIVE</span>
              <h2 className="tenure-section__heading">OFFICIAL COHORT PHOTOGRAPH</h2>
            </div>
            <span className="tenure-section__tag">FULL TEAM</span>
          </div>

          <div className="tenure-photo-frame-wrap">
            <div
              className="tenure-photo-frame"
              onClick={() => setIsLightboxOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsLightboxOpen(true)}
              aria-label="Click to enlarge HWI Tenure 2025-26 Team photograph"
            >
              {/* Corner HUD Brackets */}
              <span className="tenure-hud-corner tenure-hud-corner--tl" />
              <span className="tenure-hud-corner tenure-hud-corner--tr" />
              <span className="tenure-hud-corner tenure-hud-corner--bl" />
              <span className="tenure-hud-corner tenure-hud-corner--br" />

              {/* The Big Team Image */}
              <img
                src="/images/events/learn_it_tour_image12.jpeg"
                alt="HWI Tenure 2025–26 Full Delegation"
                className="tenure-main-img"
                loading="eager"
                decoding="async"
              />

              {/* Subtle hover hint */}
              <div className="tenure-frame-hover-hint">
                <Maximize2 size={15} />
                <span>Click to Expand High-Res</span>
              </div>
            </div>

            {/* Caption Bar Below Image */}
            <div className="tenure-minimal-caption-bar">
              <span className="tenure-live-beacon" />
              <h3 className="tenure-minimal-title">HWI INAUGURAL DELEGATION // 2025–26</h3>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="tenure-bottom-action">
          <KokonutButton href="/#team" variant="primary">
            Return to Meet The Core
          </KokonutButton>
          <KokonutButton href="/team" variant="outline">
            View Current 2026–27 Directory
          </KokonutButton>
        </div>
      </div>

      {/* ========================================================
          FULLSCREEN LIGHTBOX MODAL
          ======================================================== */}
      {isLightboxOpen && (
        <div
          className="tenure-lightbox-backdrop"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen HWI Tenure 2025-26 Team Image View"
        >
          <div
            className="tenure-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="tenure-lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen view"
            >
              <X size={20} />
            </button>

            <div className="tenure-lightbox-img-wrap">
              <img
                src="/images/events/learn_it_tour_image12.jpeg"
                alt="HWI Tenure 2025–26 Delegation"
                className="tenure-lightbox-img"
              />
            </div>

            <div className="tenure-lightbox-caption-bar">
              <h3 className="tenure-lightbox-title">
                HWI TENURE 2025–26 // OFFICIAL COHORT PHOTOGRAPH
              </h3>
              <span className="tenure-lightbox-badge">HIGH RESOLUTION ARCHIVE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Elegant member card for Presidents and Department Heads.
 * Sized appropriately (never too small), clean portrait aspect ratio with high contrast typography.
 */
function LeadershipCard({
  member,
  isExecutive = false,
}: {
  member: Tenure2025Member;
  isExecutive?: boolean;
}) {
  const hasCustomName = Boolean(member.name && member.name.trim().length > 0);
  const displayName = hasCustomName ? member.name : member.role;

  return (
    <article
      className={`tenure-card ${isExecutive ? 'tenure-card--executive' : 'tenure-card--head'}`}
      data-cursor="team"
      data-cursor-label="VIEW"
    >
      {/* Photo Frame Container */}
      <div className="tenure-card__photo-wrap">
        {member.image ? (
          <img
            src={member.image}
            alt={displayName}
            className="tenure-card__photo"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <TenurePhotoPlaceholder initials={member.initials} role={member.role} />
        )}

        {/* Gradient Overlay for subtle depth */}
        <div className="tenure-card__photo-gradient" />

        {/* Corner Cybernetic Brackets */}
        <span className="tenure-card__bracket tenure-card__bracket--tl" />
        <span className="tenure-card__bracket tenure-card__bracket--tr" />
        <span className="tenure-card__bracket tenure-card__bracket--bl" />
        <span className="tenure-card__bracket tenure-card__bracket--br" />

        {/* Executive / Role Badge on Top Right */}
        <div className="tenure-card__badge-tag">
          <span className="tenure-card__badge-dot" />
          <span>{member.badge}</span>
        </div>
      </div>

      {/* Details Container Below Photo */}
      <div className="tenure-card__content">
        <div className="tenure-card__text-group">
          {member.department && (
            <span className="tenure-card__department">{member.department}</span>
          )}
          <h3 className="tenure-card__name">{displayName}</h3>
          {hasCustomName && (
            <p className="tenure-card__role">{member.role}</p>
          )}
        </div>

        {/* Footer info & Social Links */}
        <div className="tenure-card__footer">
          <span className="tenure-card__term">COHORT 2025–26</span>
          {member.socials?.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="tenure-card__social-link"
              aria-label={`${member.name} on LinkedIn`}
              onClick={(e) => e.stopPropagation()}
            >
              <span>LinkedIn</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Elegant dark silhouette placeholder when head photo is pending.
 * Features red geometric radar grid, glowing accents, and stylized monogram.
 */
function TenurePhotoPlaceholder({
  initials,
  role,
}: {
  initials: string;
  role: string;
}) {
  return (
    <div className="tenure-card__placeholder" aria-label={`Pending portrait for ${role}`}>
      <svg
        viewBox="0 0 400 500"
        className="tenure-card__placeholder-svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`rad-${initials}`} cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.32" />
            <stop offset="45%" stopColor="#7F1D1D" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0B090E" stopOpacity="1" />
          </radialGradient>
          <pattern id={`grid-${initials}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.75" fill="rgba(255,255,255,0.12)" />
          </pattern>
        </defs>

        {/* Background & Radar */}
        <rect width="100%" height="100%" fill="#0C0A10" />
        <rect width="100%" height="100%" fill={`url(#rad-${initials})`} />
        <rect width="100%" height="100%" fill={`url(#grid-${initials})`} />

        {/* Ambient Ring */}
        <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(239,68,68,0.22)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Stylized Silhouette Head & Shoulders */}
        <circle cx="200" cy="170" r="42" fill="#18141F" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
        <path
          d="M125 310 C135 240, 265 240, 275 310 Z"
          fill="#18141F"
          stroke="rgba(239,68,68,0.3)"
          strokeWidth="1.5"
        />

        {/* Monogram Badge */}
        <circle cx="200" cy="170" r="28" fill="rgba(10, 9, 14, 0.85)" />
        <text
          x="200"
          y="178"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="monospace"
          fontSize="20"
          fontWeight="700"
          letterSpacing="2"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}
