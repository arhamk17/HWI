'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Crown,
} from 'lucide-react';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';
import {
  FACULTY_COORDINATORS,
  STUDENT_MENTORS,
  FacultyMentorMember,
} from '@/data/facultyMentors';
import './FacultyMentorsExperience.css';

export function FacultyMentorsExperience() {
  const [activeTab, setActiveTab] = useState<'all' | 'coordinators' | 'mentors'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#coordinators' || hash === '#coordinator') {
        setActiveTab('coordinators');
        setTimeout(() => {
          const el = document.getElementById('coordinator');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === '#mentors' || hash === '#mentor') {
        setActiveTab('mentors');
        setTimeout(() => {
          const el = document.getElementById('mentors');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const showCoordinators = activeTab === 'all' || activeTab === 'coordinators';
  const showMentors = activeTab === 'all' || activeTab === 'mentors';

  return (
    <div className="fm-page">
      <div className="fm-ambient-glow" aria-hidden="true" />
      <div className="fm-ambient-glow-secondary" aria-hidden="true" />

      <div className="fm-container">
        {/* Navigation Bar */}
        <div className="fm-nav-bar">
          <Link href="/#team" className="fm-back-btn" data-cursor="link">
            <ArrowLeft size={14} />
            <span>Back to Meet The Core</span>
          </Link>
          <span className="fm-code-badge">CHAPTER COUNCIL // 2026–27</span>
        </div>

        {/* Hero */}
        <header className="fm-hero">
          <div className="fm-hero__header">
            <div className="fm-hero__eyebrow">
              <Sparkles size={14} />
              <span>ACADEMIC LEADERSHIP & STUDENT MENTORSHIP</span>
            </div>
            <h1 className="fm-hero__title">
              FACULTY & <span>MENTORS</span>
            </h1>
            <p className="fm-hero__desc">
              The faculty coordinator guiding institutional governance and the founding chapter
              presidents now mentoring the next generation at HackWithIndia BVUDET-NM.
            </p>

            {/* Stats */}
            <div className="fm-stats-bar">
              <div className="fm-stat-card">
                <GraduationCap size={20} color="var(--accent)" />
                <div>
                  <div className="fm-stat-num">01</div>
                  <div className="fm-stat-label">Faculty Coordinator</div>
                </div>
              </div>
              <div className="fm-stat-card">
                <Crown size={20} color="var(--accent)" />
                <div>
                  <div className="fm-stat-num">02</div>
                  <div className="fm-stat-label">Chapter Mentors (2025–26)</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Filter Navigation */}
        <div className="fm-tabs-bar">
          <button
            type="button"
            className={`fm-tab ${activeTab === 'all' ? 'fm-tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>All Council</span>
            <span className="fm-tab__count">03</span>
          </button>
          <button
            type="button"
            className={`fm-tab ${activeTab === 'coordinators' ? 'fm-tab--active' : ''}`}
            onClick={() => setActiveTab('coordinators')}
          >
            <GraduationCap size={13} />
            <span>Faculty Coordinator</span>
            <span className="fm-tab__count">01</span>
          </button>
          <button
            type="button"
            className={`fm-tab ${activeTab === 'mentors' ? 'fm-tab--active' : ''}`}
            onClick={() => setActiveTab('mentors')}
          >
            <Crown size={13} />
            <span>Chapter Mentors</span>
            <span className="fm-tab__count">02</span>
          </button>
        </div>

        {/* Section 1: Faculty Coordinator */}
        {showCoordinators && (
          <section className="fm-section" id="coordinator">
            <div className="fm-section__title-bar">
              <div className="fm-section__title-group">
                <span className="fm-section__eyebrow">ACADEMIC FOUNDATION</span>
                <h2 className="fm-section__heading">FACULTY COORDINATOR</h2>
              </div>
            </div>
            <div className="fm-grid">
              {FACULTY_COORDINATORS.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Chapter Mentors */}
        {showMentors && (
          <section className="fm-section" id="mentors">
            <div className="fm-section__title-bar">
              <div className="fm-section__title-group">
                <span className="fm-section__eyebrow">FOUNDING TENURE 2025–26</span>
                <h2 className="fm-section__heading">CHAPTER MENTORS</h2>
              </div>
            </div>
            <div className="fm-grid">
              {STUDENT_MENTORS.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <div className="fm-cta-banner">
          <div className="fm-cta-content">
            <h3 className="fm-cta-title">EXPLORE STUDENT CHAPTER LEADERSHIP</h3>
            <p className="fm-cta-desc">
              Discover the student executive leads, department heads, and core developers powering all 9 verticals for 2026–27.
            </p>
          </div>
          <div className="fm-cta-actions">
            <KokonutButton href="/team" variant="primary">
              View Teams Section
            </KokonutButton>
            <KokonutButton href="/#team" variant="outline">
              Meet The Core
            </KokonutButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: FacultyMentorMember }) {
  return (
    <article className="fm-card" data-cursor="team" data-cursor-label="VIEW">
      {/* ── Photo Container: No text overlaid ── */}
      <div className="fm-card__photo-container">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="fm-card__photo"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <CleanPhotoPlaceholder />
        )}
      </div>

      {/* ── Information Section: Clean and focused on Name ── */}
      <div className="fm-card__info">
        <h3 className="fm-card__name">{member.name}</h3>
        <p className="fm-card__role">{member.role}</p>
      </div>
    </article>
  );
}

/**
 * Clean silhouette placeholder matching HWI's dark aesthetic.
 * Strictly NO text written over the image placeholder.
 */
function CleanPhotoPlaceholder() {
  return (
    <div className="fm-card__placeholder">
      <svg
        viewBox="0 0 400 480"
        className="fm-card__placeholder-svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="clean-ph-glow" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#300707" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0B090E" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="clean-ph-sil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#25202D" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0E0C12" stopOpacity="1" />
          </linearGradient>
          <pattern id="clean-ph-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.6" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill="#0C0A10" />
        <rect width="100%" height="100%" fill="url(#clean-ph-glow)" />
        <rect width="100%" height="100%" fill="url(#clean-ph-grid)" />

        {/* Ambient horizon glow */}
        <ellipse cx="200" cy="320" rx="160" ry="70" fill="rgba(239,68,68,0.12)" />

        {/* Clean silhouette - NO TEXT */}
        <g transform="translate(100, 100)">
          {/* Head */}
          <circle cx="100" cy="65" r="50" fill="url(#clean-ph-sil)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
          {/* Shoulders */}
          <path d="M20 260 C30 170, 170 170, 180 260 Z" fill="url(#clean-ph-sil)" stroke="rgba(239,68,68,0.25)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}
