'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  ArrowUpRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
} from 'lucide-react';
import { DEPARTMENTS, Department, DepartmentMember } from '@/data/teamDepartments';
import { scrollBus } from '@/lib/scrollBus';
import { teamStore } from '@/lib/teamStore';
import './TeamCinematic.css';

interface TeamCinematicProps {
  onCompleteAll?: (completed: boolean) => void;
}

// ─── Inline SVG Brand Icons ──────────────────────────────────────────────────
function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function MailIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

// ─── Technical Cyan Barcode Graphic ──────────────────────────────────────────
function CyanIdBarcode() {
  return (
    <svg
      className="team-card__barcode-svg"
      viewBox="0 0 220 22"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="2" height="22" fill="#06B6D4" />
      <rect x="4" y="0" width="1" height="22" fill="#06B6D4" opacity="0.6" />
      <rect x="7" y="0" width="3" height="22" fill="#06B6D4" />
      <rect x="12" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="16" y="0" width="1" height="22" fill="#06B6D4" opacity="0.5" />
      <rect x="19" y="0" width="2.5" height="22" fill="#06B6D4" />
      <rect x="24" y="0" width="1" height="22" fill="#06B6D4" />
      <rect x="27" y="0" width="3" height="22" fill="#06B6D4" />
      <rect x="32" y="0" width="1" height="22" fill="#06B6D4" opacity="0.7" />
      <rect x="35" y="0" width="2" height="22" fill="#06B6D4" />
      <rect x="39" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="43" y="0" width="3" height="22" fill="#06B6D4" />
      <rect x="48" y="0" width="1" height="22" fill="#06B6D4" opacity="0.5" />
      <rect x="51" y="0" width="2.5" height="22" fill="#06B6D4" />
      <rect x="56" y="0" width="1" height="22" fill="#06B6D4" />
      <rect x="59" y="0" width="2" height="22" fill="#06B6D4" />
      <rect x="63" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="67" y="0" width="3" height="22" fill="#06B6D4" />
      <rect x="72" y="0" width="1" height="22" fill="#06B6D4" opacity="0.6" />
      <rect x="75" y="0" width="2" height="22" fill="#06B6D4" />
      <rect x="79" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="83" y="0" width="2.5" height="22" fill="#06B6D4" />
      <rect x="88" y="0" width="1" height="22" fill="#06B6D4" opacity="0.7" />
      <rect x="91" y="0" width="3" height="22" fill="#06B6D4" />
      <rect x="96" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="100" y="0" width="2" height="22" fill="#06B6D4" />
      <rect x="104" y="0" width="1" height="22" fill="#06B6D4" opacity="0.5" />
      <rect x="107" y="0" width="3" height="22" fill="#06B6D4" />
      <rect x="112" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="116" y="0" width="2" height="22" fill="#06B6D4" />
      <rect x="120" y="0" width="1" height="22" fill="#06B6D4" opacity="0.7" />
      <rect x="123" y="0" width="2.5" height="22" fill="#06B6D4" />
      <rect x="128" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="132" y="0" width="3" height="22" fill="#06B6D4" />
      <rect x="137" y="0" width="1" height="22" fill="#06B6D4" opacity="0.6" />
      <rect x="140" y="0" width="2" height="22" fill="#06B6D4" />
      <rect x="144" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="148" y="0" width="2.5" height="22" fill="#06B6D4" />
      <rect x="153" y="0" width="1" height="22" fill="#06B6D4" opacity="0.5" />
      <rect x="156" y="0" width="3" height="22" fill="#06B6D4" />
      <rect x="161" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="165" y="0" width="2" height="22" fill="#06B6D4" />
      <rect x="169" y="0" width="1" height="22" fill="#06B6D4" opacity="0.7" />
      <rect x="172" y="0" width="2.5" height="22" fill="#06B6D4" />
      <rect x="177" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="181" y="0" width="3" height="22" fill="#06B6D4" />
      <rect x="186" y="0" width="1" height="22" fill="#06B6D4" opacity="0.6" />
      <rect x="189" y="0" width="2" height="22" fill="#06B6D4" />
      <rect x="193" y="0" width="1.5" height="22" fill="#06B6D4" />
      <rect x="197" y="0" width="3" height="22" fill="#06B6D4" />
      <rect x="202" y="0" width="1" height="22" fill="#06B6D4" opacity="0.5" />
      <rect x="205" y="0" width="2.5" height="22" fill="#06B6D4" />
      <rect x="210" y="0" width="1" height="22" fill="#06B6D4" />
      <rect x="213" y="0" width="2" height="22" fill="#06B6D4" />
      <rect x="217" y="0" width="3" height="22" fill="#06B6D4" />
    </svg>
  );
}

// ─── Physical ID Card Component ──────────────────────────────────────────────
interface PhysicalIdCardProps {
  member: DepartmentMember;
  dept: Department;
  index: number;
  total: number;
  diff: number;
  prefersReduced: boolean;
  onSelect: () => void;
}

function PhysicalIdCard({
  member,
  dept,
  index,
  total,
  diff,
  prefersReduced,
  onSelect,
}: PhysicalIdCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const serialId = `HWI-2026-${(dept.id || 'COR').slice(0, 3).toUpperCase()}-${member.id
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 6)
    .toUpperCase()}`;

  const rankLabel =
    member.rank === 'head'
      ? dept.id === 'core-leadership'
        ? 'CHAPTER LEADERSHIP'
        : 'DEPARTMENT HEAD'
      : member.rank === 'co-head'
      ? 'DEPARTMENT CO-HEAD'
      : 'EXECUTIVE MEMBER';

  // Compute physical 3D stacking style
  const cardStyle = useMemo<React.CSSProperties>(() => {
    if (prefersReduced) {
      const isCurrent = Math.abs(diff) < 0.5;
      return {
        opacity: isCurrent ? 1 : 0,
        transform: 'none',
        zIndex: isCurrent ? 25 : 1,
        pointerEvents: isCurrent ? 'auto' : 'none',
        visibility: isCurrent ? 'visible' : 'hidden',
      };
    }

    // Active Card (diff near 0): prominent, centered, foreground focus
    if (Math.abs(diff) <= 0.2) {
      const tilt = (index % 2 === 0 ? 0.8 : -0.8) * (1 - Math.abs(diff) * 2);
      return {
        transform: `translate3d(0px, 0px, 0px) rotate(${tilt.toFixed(2)}deg) scale(1)`,
        opacity: 1,
        zIndex: 25,
        pointerEvents: 'auto',
        visibility: 'visible',
      };
    }

    // Exited Card (diff < -0.2): slides up and peels away smoothly to the left
    if (diff < -0.2) {
      const t = Math.min(1, (-diff - 0.2) / 0.8);
      const x = -55 * t;
      const y = -125 * t;
      const rot = -6 * t;
      const scale = 1 - 0.05 * t;
      const opacity = Math.max(0, 1 - t * 1.5);
      return {
        transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
        opacity: Number(opacity.toFixed(3)),
        zIndex: Math.max(1, 30 - Math.round(t * 10)),
        pointerEvents: 'none',
        visibility: opacity <= 0.01 ? 'hidden' : 'visible',
      };
    }

    // Stacked Upcoming Cards (diff > 0.2): stacked behind with depth & realistic perspective
    const stackPos = diff;
    const x = Math.min(56, 22 * stackPos);
    const y = Math.min(38, 15 * stackPos);
    const scale = Math.max(0.82, 1 - 0.06 * stackPos);
    const rot = stackPos % 2 === 0 ? -2.5 : 3.2;
    const opacity = Math.max(0, 0.9 - stackPos * 0.2);

    return {
      transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
      opacity: Number(opacity.toFixed(3)),
      zIndex: Math.max(1, 20 - Math.round(stackPos * 2)),
      pointerEvents: 'auto',
      visibility: opacity <= 0.01 ? 'hidden' : 'visible',
    };
  }, [diff, index, prefersReduced]);

  const isActive = Math.abs(diff) <= 0.5;

  return (
    <article
      className={`team-physical-card ${isActive ? 'is-active' : 'is-stacked'}`}
      style={cardStyle}
      onClick={onSelect}
      aria-label={`${member.name} — ${member.role}`}
    >
      {/* Top Lanyard Punch Slot */}
      <div className="team-card__lanyard-slot" aria-hidden="true" />

      {/* Cyan Security Accent Line */}
      <div className="team-card__cyan-strip" />

      {/* Corner Technical Registration Crosshairs */}
      <span className="team-card__reticle top-left" aria-hidden="true">+</span>
      <span className="team-card__reticle top-right" aria-hidden="true">+</span>
      <span className="team-card__reticle bottom-left" aria-hidden="true">+</span>
      <span className="team-card__reticle bottom-right" aria-hidden="true">+</span>

      {/* Card Header: Brand & Security Watermark */}
      <div className="team-card__header">
        <div className="team-card__brand">
          <span className="team-card__emblem">HWI</span>
          <div className="team-card__brand-text">
            <span className="team-card__org">HACKWITHINDIA</span>
            <span className="team-card__suborg">OFFICIAL CHAPTER CREDENTIAL</span>
          </div>
        </div>

        <div className="team-card__status-beacon">
          <span className="team-card__pulse-dot" />
          <span>VERIFIED</span>
        </div>
      </div>

      {/* Photo Frame Container */}
      <div className="team-card__photo-container">
        <div className="team-card__photo-frame">
          {member.image && !imgFailed ? (
            <img
              src={member.image}
              alt={member.name}
              className="team-card__photo-img"
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="team-card__photo-fallback">
              <span className="team-card__initials">{member.initials}</span>
              <span className="team-card__watermark">HWI // 26</span>
            </div>
          )}
        </div>

        <div className="team-card__verified-badge">
          <ShieldCheck size={11} />
          <span>OFFICIAL</span>
        </div>
      </div>

      {/* Card Body: Name, Role & Department */}
      <div className="team-card__body">
        <div className="team-card__meta-tags">
          <span className="team-card__dept-tag">{dept.name}</span>
          <span className="team-card__rank-tag">{rankLabel}</span>
        </div>

        <h3 className="team-card__name">{member.name}</h3>
        <p className="team-card__role">{member.role}</p>

        {member.academicYear && member.branch && (
          <div className="team-card__academic">
            <span>{member.academicYear} • {member.branch}</span>
          </div>
        )}
      </div>

      {/* Bottom Technical Barcode & Serial */}
      <div className="team-card__footer">
        <div className="team-card__barcode-wrap">
          <CyanIdBarcode />
        </div>
        <div className="team-card__serial-row">
          <span className="team-card__serial-label">CREDENTIAL ID</span>
          <code className="team-card__serial-code">{serialId}</code>
        </div>
      </div>
    </article>
  );
}

// ─── Main TeamCinematic Redesign Component ───────────────────────────────────
export function TeamCinematic({ onCompleteAll }: TeamCinematicProps) {
  const [activeDeptIdx, setActiveDeptIdx] = useState(0);
  const [activeMemberIdx, setActiveMemberIdx] = useState(0);
  const [memberFloat, setMemberFloat] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);

  const currentDept = DEPARTMENTS[activeDeptIdx] || DEPARTMENTS[0];
  const members = currentDept.members;
  const currentMember = members[activeMemberIdx] || members[0];

  // Dynamic scroll height based on department member count
  const trackHeightVh = Math.max(160, members.length * 75 + 40);

  // Smooth scroll to a specific member index within the department
  const scrollToMember = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(members.length - 1, index));
      setActiveMemberIdx(clamped);
      setMemberFloat(clamped);
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const targetRatio = members.length > 1 ? clamped / (members.length - 1) : 0;
      const targetY = scrollY + rect.top + targetRatio * totalScrollable;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    },
    [members.length]
  );

  // Switch department cleanly
  const selectDepartment = useCallback(
    (deptIdx: number) => {
      if (deptIdx === activeDeptIdx) return;
      setActiveDeptIdx(deptIdx);
      setActiveMemberIdx(0);
      setMemberFloat(0);

      // Smooth scroll back to top of container if currently scrolled down
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        if (rect.top < -50) {
          window.scrollTo({ top: scrollY + rect.top, behavior: 'smooth' });
        }
      }
    },
    [activeDeptIdx]
  );

  // Step to previous / next member with accessible buttons
  const handlePrevMember = useCallback(() => {
    if (activeMemberIdx > 0) {
      scrollToMember(activeMemberIdx - 1);
    } else if (activeDeptIdx > 0) {
      // Step to previous department's last member
      const prevDeptIdx = activeDeptIdx - 1;
      selectDepartment(prevDeptIdx);
    }
  }, [activeMemberIdx, activeDeptIdx, scrollToMember, selectDepartment]);

  const handleNextMember = useCallback(() => {
    if (activeMemberIdx < members.length - 1) {
      scrollToMember(activeMemberIdx + 1);
    } else if (activeDeptIdx < DEPARTMENTS.length - 1) {
      // Step to next department
      selectDepartment(activeDeptIdx + 1);
    }
  }, [activeMemberIdx, members.length, activeDeptIdx, scrollToMember, selectDepartment]);

  // ─── Continuous Scroll-Linked Animation Engine ───────────────────────────
  useEffect(() => {
    const updateScrollProgress = () => {
      if (!containerRef.current || !stickyRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Normalized progress (0 to 1) through the pinned section
      const rawP = -rect.top / totalScrollable;
      const p = Math.max(0, Math.min(1, rawP));

      // Continuous float coordinate across members
      const count = members.length;
      const curFloat = count > 1 ? p * (count - 1) : 0;
      setMemberFloat(curFloat);

      const nearestIdx = Math.min(count - 1, Math.max(0, Math.round(curFloat)));
      setActiveMemberIdx(nearestIdx);

      // Synchronize with global background particles
      teamStore.update(activeDeptIdx, p);

      if (p >= 0.98 && onCompleteAll) {
        onCompleteAll(true);
      }
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        tickingRef.current = false;
        updateScrollProgress();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    const unsubscribeBus = scrollBus.subscribe(handleScroll);

    // Initial calculation
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      unsubscribeBus();
    };
  }, [members.length, activeDeptIdx, onCompleteAll]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
        // If container is currently visible in viewport
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 200) {
          handleNextMember();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 200) {
          handlePrevMember();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextMember, handlePrevMember]);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rankLabel =
    currentMember.rank === 'head'
      ? currentDept.id === 'core-leadership'
        ? 'Chapter Leadership'
        : 'Department Head'
      : currentMember.rank === 'co-head'
      ? 'Department Co-Head'
      : 'Executive Member';

  return (
    <section
      className="team-showcase-track"
      ref={containerRef}
      style={{ height: `${trackHeightVh}vh` }}
      id="team"
      aria-label="HackWithIndia Team Showcase"
    >
      <div className="team-showcase-sticky" ref={stickyRef}>
        {/* ─── Top Header: Sleek Department Selector Bar ─────────────────── */}
        <header className="team-showcase-header">
          <div className="team-header-identity">
            <div className="team-header-kicker">
              <span className="team-header-dot" />
              <span>HWI 2026–27 // CHAPTER ROSTER</span>
            </div>
            <span className="team-header-divider" aria-hidden="true" />
            <span className="team-header-tagline">{currentDept.tagline}</span>
          </div>

          {/* Minimalist Department Selection Pills */}
          <nav className="team-dept-nav" role="tablist" aria-label="Select Team Department">
            {DEPARTMENTS.map((dept, dIdx) => {
              const isActive = dIdx === activeDeptIdx;
              return (
                <button
                  key={dept.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`team-dept-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => selectDepartment(dIdx)}
                  title={dept.name}
                >
                  <span className="team-dept-pill__dot" />
                  <span className="team-dept-pill__name">{dept.name}</span>
                  <span className="team-dept-pill__count">{dept.members.length}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* ─── Main 2-Column Showcase Stage ───────────────────────────────── */}
        <div className="team-showcase-stage">
          {/* ── Left Side: Member Information Panel ── */}
          <div className="team-showcase__left">
            <div className="team-info-wrap">
              {/* Department & Rank Kicker */}
              <div className="team-info__header-row">
                <span className="team-info__dept-tag">
                  <span className="team-info__dot" />
                  {currentDept.name}
                </span>
                <span className="team-info__rank-tag">{rankLabel}</span>
              </div>

              {/* Large Display Heading: Full Name */}
              <h1 className="team-info__name" key={`name-${currentMember.id}`}>
                {currentMember.name}
              </h1>

              {/* Role Title */}
              <div className="team-info__role-wrap" key={`role-${currentMember.id}`}>
                <span className="team-info__role-pill">{currentMember.role}</span>
                {currentMember.academicYear && currentMember.branch && (
                  <span className="team-info__academic-pill">
                    {currentMember.academicYear} • {currentMember.branch}
                  </span>
                )}
              </div>

              {/* Concise Description / Responsibilities */}
              <p className="team-info__bio" key={`bio-${currentMember.id}`}>
                {currentMember.bio ||
                  `Active contributor in ${currentDept.name} for the HackWithIndia BVUDET-NM student chapter.`}
              </p>

              {/* Relevant Social & Contact Links */}
              {(currentMember.socials || currentMember.email) && (
                <div className="team-info__socials-row">
                  {currentMember.socials?.github && (
                    <a
                      href={currentMember.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-social-btn"
                      aria-label={`${currentMember.name}'s GitHub`}
                    >
                      <GithubIcon size={14} />
                      <span>GitHub</span>
                      <ArrowUpRight size={12} className="team-social-btn__arrow" />
                    </a>
                  )}
                  {currentMember.socials?.linkedin && (
                    <a
                      href={currentMember.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-social-btn"
                      aria-label={`${currentMember.name}'s LinkedIn`}
                    >
                      <LinkedinIcon size={14} />
                      <span>LinkedIn</span>
                      <ArrowUpRight size={12} className="team-social-btn__arrow" />
                    </a>
                  )}
                  {currentMember.socials?.instagram && (
                    <a
                      href={currentMember.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-social-btn"
                      aria-label={`${currentMember.name}'s Instagram`}
                    >
                      <InstagramIcon size={14} />
                      <span>Instagram</span>
                      <ArrowUpRight size={12} className="team-social-btn__arrow" />
                    </a>
                  )}
                  {currentMember.email && (
                    <a
                      href={`mailto:${currentMember.email}`}
                      className="team-social-btn"
                      aria-label={`Send email to ${currentMember.name}`}
                    >
                      <MailIcon size={14} />
                      <span>Email</span>
                      <ArrowUpRight size={12} className="team-social-btn__arrow" />
                    </a>
                  )}
                </div>
              )}

              {/* Member Navigation & Counter Controls */}
              <div className="team-info__nav-controls">
                <div className="team-info__counter">
                  <span className="counter-current">
                    {String(activeMemberIdx + 1).padStart(2, '0')}
                  </span>
                  <span className="counter-sep">/</span>
                  <span className="counter-total">
                    {String(members.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="team-info__nav-buttons">
                  <button
                    type="button"
                    className="team-nav-arrow-btn"
                    onClick={handlePrevMember}
                    disabled={activeMemberIdx === 0 && activeDeptIdx === 0}
                    aria-label="Previous member"
                  >
                    <ChevronLeft size={16} />
                    <span>PREV</span>
                  </button>
                  <button
                    type="button"
                    className="team-nav-arrow-btn"
                    onClick={handleNextMember}
                    disabled={
                      activeMemberIdx === members.length - 1 &&
                      activeDeptIdx === DEPARTMENTS.length - 1
                    }
                    aria-label="Next member"
                  >
                    <span>NEXT</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Side: Physical ID-Card Stacked Deck ── */}
          <div className="team-showcase__right">
            <div className="team-deck-container" aria-label="Physical ID Card Deck">
              {members.map((m, idx) => {
                const diff = idx - memberFloat;
                return (
                  <PhysicalIdCard
                    key={m.id}
                    member={m}
                    dept={currentDept}
                    index={idx}
                    total={members.length}
                    diff={diff}
                    prefersReduced={prefersReduced}
                    onSelect={() => scrollToMember(idx)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Bottom Footer Bar: Scroll Progress & Department Jumps ─────── */}
        <footer className="team-showcase-footer">
          <div className="team-footer__cue">
            <div className="team-footer__mouse" aria-hidden="true">
              <span className="team-footer__wheel" />
            </div>
            <span className="team-footer__cue-text">
              {activeMemberIdx === members.length - 1 && activeDeptIdx === DEPARTMENTS.length - 1
                ? 'CONTINUE SCROLLING FOR CHAPTER FOOTER'
                : 'SCROLL TO ADVANCE MEMBER CREDENTIALS'}
            </span>
          </div>

          {/* Secondary Department Quick Navigator */}
          <div className="team-footer__dept-jump">
            <span className="team-footer__dept-label">DEPARTMENT:</span>
            <span className="team-footer__dept-name">{currentDept.name}</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
