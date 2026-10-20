'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ArrowUpRight,
  Sparkles,
  Users,
  X,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { DEPARTMENTS, DepartmentMember } from '@/data/teamDepartments';
import { scrollBus } from '@/lib/scrollBus';
import './TeamCinematic.css';

interface TeamCinematicProps {
  onCompleteAll?: (completed: boolean) => void;
}

// ─── Inline SVG Brand Icons ──────────────────────────────────────────────────
function GithubIcon({ size = 16 }: { size?: number }) {
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

function LinkedinIcon({ size = 16 }: { size?: number }) {
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

function InstagramIcon({ size = 16 }: { size?: number }) {
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

function MailIcon({ size = 16 }: { size?: number }) {
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

// ─── Decorative Technical Cyan Barcode ───────────────────────────────────────
function CyanIdBarcode() {
  return (
    <svg
      className="team-id-card__barcode-svg"
      viewBox="0 0 240 28"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="3" height="28" fill="#06B6D4" />
      <rect x="5" y="0" width="1.5" height="28" fill="#06B6D4" opacity="0.6" />
      <rect x="9" y="0" width="4" height="28" fill="#06B6D4" />
      <rect x="15" y="0" width="2" height="28" fill="#06B6D4" opacity="0.8" />
      <rect x="19" y="0" width="1.5" height="28" fill="#06B6D4" />
      <rect x="23" y="0" width="5" height="28" fill="#06B6D4" />
      <rect x="31" y="0" width="2" height="28" fill="#06B6D4" opacity="0.7" />
      <rect x="35" y="0" width="3" height="28" fill="#06B6D4" />
      <rect x="40" y="0" width="1" height="28" fill="#06B6D4" />
      <rect x="44" y="0" width="4" height="28" fill="#06B6D4" />
      <rect x="51" y="0" width="2" height="28" fill="#06B6D4" />
      <rect x="56" y="0" width="3" height="28" fill="#06B6D4" opacity="0.6" />
      <rect x="62" y="0" width="5" height="28" fill="#06B6D4" />
      <rect x="70" y="0" width="2" height="28" fill="#06B6D4" />
      <rect x="74" y="0" width="1.5" height="28" fill="#06B6D4" />
      <rect x="78" y="0" width="4" height="28" fill="#06B6D4" opacity="0.9" />
      <rect x="85" y="0" width="2" height="28" fill="#06B6D4" />
      <rect x="89" y="0" width="3" height="28" fill="#06B6D4" />
      <rect x="94" y="0" width="1.5" height="28" fill="#06B6D4" opacity="0.5" />
      <rect x="98" y="0" width="4" height="28" fill="#06B6D4" />
      <rect x="105" y="0" width="2" height="28" fill="#06B6D4" />
      <rect x="110" y="0" width="5" height="28" fill="#06B6D4" opacity="0.8" />
      <rect x="118" y="0" width="2" height="28" fill="#06B6D4" />
      <rect x="123" y="0" width="3" height="28" fill="#06B6D4" />
      <rect x="128" y="0" width="1.5" height="28" fill="#06B6D4" />
      <rect x="132" y="0" width="4" height="28" fill="#06B6D4" />
      <rect x="138" y="0" width="2" height="28" fill="#06B6D4" opacity="0.7" />
      <rect x="142" y="0" width="3" height="28" fill="#06B6D4" />
      <rect x="147" y="0" width="5" height="28" fill="#06B6D4" />
      <rect x="155" y="0" width="1.5" height="28" fill="#06B6D4" />
      <rect x="159" y="0" width="3" height="28" fill="#06B6D4" opacity="0.9" />
      <rect x="165" y="0" width="2" height="28" fill="#06B6D4" />
      <rect x="170" y="0" width="4" height="28" fill="#06B6D4" />
      <rect x="176" y="0" width="2" height="28" fill="#06B6D4" opacity="0.6" />
      <rect x="180" y="0" width="5" height="28" fill="#06B6D4" />
      <rect x="188" y="0" width="1.5" height="28" fill="#06B6D4" />
      <rect x="192" y="0" width="3" height="28" fill="#06B6D4" opacity="0.8" />
      <rect x="198" y="0" width="2" height="28" fill="#06B6D4" />
      <rect x="202" y="0" width="4" height="28" fill="#06B6D4" />
      <rect x="208" y="0" width="1.5" height="28" fill="#06B6D4" />
      <rect x="212" y="0" width="3" height="28" fill="#06B6D4" opacity="0.7" />
      <rect x="217" y="0" width="2" height="28" fill="#06B6D4" />
      <rect x="221" y="0" width="4" height="28" fill="#06B6D4" />
      <rect x="227" y="0" width="2" height="28" fill="#06B6D4" />
      <rect x="231" y="0" width="1.5" height="28" fill="#06B6D4" opacity="0.8" />
      <rect x="235" y="0" width="5" height="28" fill="#06B6D4" />
    </svg>
  );
}

// ─── Ambient Particles ───────────────────────────────────────────────────────
function AmbientParticles() {
  return (
    <div className="team-cinematic__particles" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="team-cinematic__particle"
          style={{
            width: `${(i % 3) * 2 + 3}px`,
            height: `${(i % 3) * 2 + 3}px`,
            left: `${(i * 7 + 11) % 96}%`,
            top: `${(i * 13 + 5) % 92}%`,
            animationDelay: `${(i * 0.4).toFixed(1)}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Team Member Interactive ID Card Modal ──────────────────────────────────
interface MemberModalProps {
  member: DepartmentMember | null;
  deptName: string;
  deptId: string;
  onClose: () => void;
}

function MemberDetailModal({ member, deptName, deptId, onClose }: MemberModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (member) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [member, onClose]);

  if (!member) return null;

  const serialId = `HWI-2026-${(deptId || 'COR').slice(0, 3).toUpperCase()}-${member.id
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 6)
    .toUpperCase()}`;

  const rankLabel =
    member.rank === 'head'
      ? deptId === 'core-leadership'
        ? 'Chapter Leadership'
        : 'Department Head'
      : member.rank === 'co-head'
      ? 'Department Co-Head'
      : 'Executive Member';

  return (
    <div
      className="team-id-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} Chapter ID Card`}
    >
      <div
        className="team-id-card-dossier"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Top Glowing Cyan Accent Strip */}
        <div className="team-id-card-dossier__cyan-strip" />

        {/* Reticles / Corner Tech Crosshairs */}
        <span className="team-id-card-reticle top-left" aria-hidden="true">+</span>
        <span className="team-id-card-reticle top-right" aria-hidden="true">+</span>
        <span className="team-id-card-reticle bottom-left" aria-hidden="true">+</span>
        <span className="team-id-card-reticle bottom-right" aria-hidden="true">+</span>

        {/* Card Header Bar */}
        <div className="team-id-card-dossier__header">
          <div className="team-id-card-dossier__brand">
            <span className="team-id-card-dossier__emblem">HWI</span>
            <div className="team-id-card-dossier__brand-text">
              <span className="team-id-card-dossier__org">HACKWITHINDIA BVUDET-NM</span>
              <span className="team-id-card-dossier__suborg">OFFICIAL MEMBER ID DOSSIER</span>
            </div>
          </div>

          <div className="team-id-card-dossier__actions">
            <div className="team-id-card-dossier__status-pill">
              <span className="team-id-card-dossier__pulse-dot" />
              <span>ACTIVE</span>
            </div>
            <button
              type="button"
              className="team-id-card-dossier__close"
              onClick={onClose}
              aria-label="Close ID dossier"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Identity Main Section: Portrait + Name & Credentials */}
        <div className="team-id-card-dossier__identity">
          <div className="team-id-card-dossier__photo-frame">
            <div className="team-id-card-dossier__photo-inner">
              <div className="team-id-card-dossier__photo-fallback">
                <span className="team-id-card-dossier__initials">{member.initials}</span>
                <span className="team-id-card-dossier__watermark">HWI // 26</span>
              </div>
              {member.image && (
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-id-card-dossier__photo-img"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="team-id-card-dossier__photo-badge">
              <ShieldCheck size={11} />
              <span>VERIFIED</span>
            </div>
          </div>

          <div className="team-id-card-dossier__info-block">
            <div className="team-id-card-dossier__meta-tags">
              <span className="team-id-card-dossier__dept-tag">{deptName}</span>
              <span className="team-id-card-dossier__rank-tag">{rankLabel}</span>
            </div>

            <h3 className="team-id-card-dossier__name">{member.name}</h3>
            <p className="team-id-card-dossier__role">{member.role}</p>

            {member.academicYear && member.branch && (
              <div className="team-id-card-dossier__academic">
                <span className="team-id-card-dossier__academic-label">ACADEMIC //</span>
                <span>{member.academicYear} • {member.branch}</span>
              </div>
            )}

            <div className="team-id-card-dossier__serial-row">
              <span className="team-id-card-dossier__serial-label">ID SERIAL</span>
              <code className="team-id-card-dossier__serial-code">{serialId}</code>
            </div>
          </div>
        </div>

        {/* Bio / Statement */}
        {member.bio && (
          <div className="team-id-card-dossier__bio-section">
            <span className="team-id-card-dossier__section-label">OPERATIONAL STATEMENT</span>
            <p className="team-id-card-dossier__bio-text">{member.bio}</p>
          </div>
        )}

        {/* Technical Metadata Spec Grid */}
        <div className="team-id-card-dossier__specs-grid">
          <div className="team-id-spec-item">
            <span className="team-id-spec-item__key">TENURE</span>
            <span className="team-id-spec-item__val">2026–2027</span>
          </div>
          <div className="team-id-spec-item">
            <span className="team-id-spec-item__key">CHAPTER</span>
            <span className="team-id-spec-item__val">BVUDET-NM</span>
          </div>
          <div className="team-id-spec-item">
            <span className="team-id-spec-item__key">DESIGNATION</span>
            <span className="team-id-spec-item__val">{member.rank.toUpperCase()}</span>
          </div>
        </div>

        {/* Verified Social & Contact Network */}
        {(member.socials || member.email) && (
          <div className="team-id-card-dossier__contacts-section">
            <span className="team-id-card-dossier__section-label">AUTHENTICATED CONTACT NODES</span>
            <div className="team-id-card-dossier__links">
              {member.socials?.github && (
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-id-contact-btn"
                  aria-label={`${member.name}'s GitHub profile`}
                >
                  <GithubIcon size={14} />
                  <span>GitHub</span>
                  <ExternalLink size={11} className="team-id-contact-btn__arrow" />
                </a>
              )}
              {member.socials?.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-id-contact-btn"
                  aria-label={`${member.name}'s LinkedIn profile`}
                >
                  <LinkedinIcon size={14} />
                  <span>LinkedIn</span>
                  <ExternalLink size={11} className="team-id-contact-btn__arrow" />
                </a>
              )}
              {member.socials?.instagram && (
                <a
                  href={member.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-id-contact-btn"
                  aria-label={`${member.name}'s Instagram profile`}
                >
                  <InstagramIcon size={14} />
                  <span>Instagram</span>
                  <ExternalLink size={11} className="team-id-contact-btn__arrow" />
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="team-id-contact-btn"
                  aria-label={`Send email to ${member.name}`}
                >
                  <MailIcon size={14} />
                  <span>Direct Mail</span>
                  <ExternalLink size={11} className="team-id-contact-btn__arrow" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Bottom ID Barcode & Watermark */}
        <div className="team-id-card-dossier__footer">
          <CyanIdBarcode />
          <div className="team-id-card-dossier__footer-text">
            <span>HACKWITHINDIA • BVUDET NAVI MUMBAI</span>
            <span>VERIFIED IDENTITY PROTOCOL // DISPATCH 2026–27</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main TeamCinematic Component ────────────────────────────────────────────
export function TeamCinematic({ onCompleteAll }: TeamCinematicProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedMember, setSelectedMember] = useState<{
    member: DepartmentMember;
    deptName: string;
    deptId: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);
  const lastActiveRef = useRef(0);

  const numDepts = DEPARTMENTS.length;
  const currentDept = DEPARTMENTS[activeIdx] || DEPARTMENTS[0];

  // Helper: Smooth scroll to specific department
  const scrollToDept = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const targetRatio = index / (numDepts - 1);
      const targetY = scrollY + rect.top + targetRatio * totalScrollable;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    },
    [numDepts]
  );

  // ─── Scroll-Driven Continuous Cinematic Transition Engine ─────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateTransitions = () => {
      if (!containerRef.current || !stickyRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Normalized scroll progress: 0 at top entry, 1 at bottom exit
      const rawP = -rect.top / totalScrollable;
      const p = Math.max(0, Math.min(1, rawP));

      // Continuous team index coordinate (0.00 to (numDepts - 1))
      const teamFloat = p * (numDepts - 1);
      const nearestIdx = Math.min(numDepts - 1, Math.max(0, Math.round(teamFloat)));

      // Synchronize active department index for header pills & counter
      if (nearestIdx !== lastActiveRef.current) {
        lastActiveRef.current = nearestIdx;
        setActiveIdx(nearestIdx);
      }

      // Update miniature progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }

      // If user reaches final team threshold, signal completion if prop exists
      if (p >= 0.98 && onCompleteAll) {
        onCompleteAll(true);
      }

      // Continuous interpolation of each slide: strictly isolated to eliminate any collision/overlap
      slidesRef.current.forEach((slide, idx) => {
        if (!slide) return;
        const diff = idx - teamFloat;
        const absDiff = Math.abs(diff);

        // Strict isolation threshold: slides with absDiff > 0.50 are completely hidden
        if (absDiff > 0.50) {
          slide.style.display = 'none';
          slide.style.opacity = '0';
          slide.style.pointerEvents = 'none';
          return;
        }

        slide.style.display = 'flex';

        if (prefersReduced) {
          const isCurrent = absDiff <= 0.5;
          slide.style.opacity = isCurrent ? '1' : '0';
          slide.style.transform = 'none';
          slide.style.pointerEvents = isCurrent ? 'auto' : 'none';
          slide.style.zIndex = isCurrent ? '10' : '1';
          return;
        }

        // Dwell zone: active slide (|diff| <= 0.15) stays solid, centered, and interactive
        if (absDiff <= 0.15) {
          slide.style.opacity = '1';
          slide.style.transform = 'translate3d(0, 0, 0) scale(1)';
          slide.style.pointerEvents = 'auto';
          slide.style.zIndex = '10';
          return;
        }

        // Transition zone (0.15 < absDiff <= 0.50)
        const t = (absDiff - 0.15) / 0.35;
        const opacity = Math.max(0, 1 - t * t);
        const translateY = (diff < 0 ? -1 : 1) * (t * 90);
        const scale = 1 - t * 0.04;

        slide.style.opacity = opacity.toFixed(3);
        slide.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
        slide.style.pointerEvents = 'none';
        slide.style.zIndex = '5';
      });
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        tickingRef.current = false;
        updateTransitions();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    const unsubscribeBus = scrollBus.subscribe(handleScroll);

    // Initial positioning calculation
    updateTransitions();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      unsubscribeBus();
    };
  }, [numDepts, onCompleteAll]);

  return (
    <div
      className="team-cinematic-track"
      ref={containerRef}
      style={{ '--team-count': numDepts } as React.CSSProperties}
      id="team"
    >
      <div className="team-cinematic-sticky" ref={stickyRef}>
        <AmbientParticles />

        {/* ─── Top Header Bar: Synchronized Breadcrumbs & Secondary Nav ─────── */}
        <header className="team-scroll-header">
          <div className="team-scroll-header__left">
            <div className="team-scroll-header__kicker">
              <span className="team-scroll-header__dot" />
              <span>HWI // 2026–27 CHAPTER ROSTER</span>
            </div>
            <h1 className="team-scroll-header__title">{currentDept.name}</h1>
            <p className="team-scroll-header__tagline">{currentDept.tagline}</p>
          </div>

          <div className="team-scroll-header__right">
            <div className="team-scroll-counter">
              <span className="team-scroll-counter__current">
                {String(activeIdx + 1).padStart(2, '0')}
              </span>
              <span className="team-scroll-counter__sep">/</span>
              <span className="team-scroll-counter__total">
                {String(numDepts).padStart(2, '0')}
              </span>
            </div>
            <div className="team-scroll-progress-wrap" aria-hidden="true">
              <div className="team-scroll-progress-bar" ref={progressBarRef} />
            </div>
          </div>
        </header>

        {/* ─── Department Quick-Navigation Switcher (Compact Interactive Pills) ── */}
        <nav
          className="team-scroll-switcher"
          aria-label="Department navigation switcher"
        >
          {DEPARTMENTS.map((dept, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={dept.id}
                type="button"
                className={`team-switcher-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => scrollToDept(idx)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Jump to ${dept.name}`}
              >
                <span className="team-switcher-tab__num">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="team-switcher-tab__name">{dept.name}</span>
                {isActive && <span className="team-switcher-tab__indicator" />}
              </button>
            );
          })}
        </nav>

        {/* ─── Slide Showcase Container ────────────────────────────────────── */}
        <main className="team-scroll-showcase" aria-label="Team showcase slideshow">
          {DEPARTMENTS.map((dept, idx) => {
            const head = dept.members[0];
            const otherMembers = dept.members.slice(1);

            return (
              <div
                key={dept.id}
                className="team-scroll-slide"
                ref={(el) => {
                  slidesRef.current[idx] = el;
                }}
                data-dept-id={dept.id}
              >
                <div className="team-slide-inner">
                  {/* Left Column: Interactive Department Head ID Card */}
                  <div className="team-slide-portrait-col">
                    <button
                      type="button"
                      className="team-portrait-card team-id-card--head"
                      onClick={() =>
                        setSelectedMember({
                          member: head,
                          deptName: dept.name,
                          deptId: dept.id,
                        })
                      }
                      title={`Inspect ${head.name}'s ID credentials`}
                      aria-label={`Inspect ${head.name}'s ID credentials`}
                    >
                      {/* Cyan top strip */}
                      <div className="team-id-card__top-cyan-strip" />

                      {/* Technical ID Header bar on the card */}
                      <div className="team-id-card__top-meta">
                        <span className="team-id-card__top-code">
                          HWI // {dept.id.slice(0, 4).toUpperCase()}-01
                        </span>
                        <span className="team-id-card__top-status">
                          <span className="team-id-card__dot" />
                          ACTIVE
                        </span>
                      </div>

                      <div className="team-portrait-frame__inner">
                        <div className="team-portrait-fallback">
                          <span className="team-portrait-initials">{head.initials}</span>
                          <span className="team-portrait-watermark">HWI // BVUDET</span>
                        </div>
                        {head.image && (
                          <img
                            src={head.image}
                            alt={head.name}
                            className="team-portrait-img"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div className="team-portrait-overlay" />
                      </div>

                      {/* Bottom ID bar on the card with rank badge & click-to-inspect prompt */}
                      <div className="team-id-card__bottom-bar">
                        <div className="team-portrait-rank-badge">
                          <span>
                            {dept.id === 'core-leadership'
                              ? 'CHAPTER LEADERSHIP'
                              : 'DEPARTMENT HEAD'}
                          </span>
                        </div>
                        <span className="team-id-card__hover-cta">
                          <span>INSPECT ID</span>
                          <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Right Column: Head Bio, Roles & Interactive Member Roster */}
                  <div className="team-slide-details-col">
                    <div className="team-slide-badges">
                      <span className="team-slide-role-badge">{head.role}</span>
                      <span className="team-slide-count-badge">
                        <Users size={12} />
                        {dept.members.length} {dept.members.length === 1 ? 'MEMBER' : 'MEMBERS'}
                      </span>
                      {/* Interactive Inspect Button for Head (accessible on all screen sizes) */}
                      <button
                        type="button"
                        className="team-head-inspect-btn"
                        onClick={() =>
                          setSelectedMember({
                            member: head,
                            deptName: dept.name,
                            deptId: dept.id,
                          })
                        }
                        aria-label={`View ID Card for ${head.name}`}
                      >
                        <span className="team-head-inspect-btn__dot" />
                        <span>VIEW ID CARD</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </div>

                    <h2 className="team-slide-name">{head.name}</h2>
                    {head.bio && <p className="team-slide-bio">{head.bio}</p>}

                    {/* Socials & Contact for Head */}
                    {(head.socials || head.email) && (
                      <div className="team-slide-socials">
                        {head.socials?.github && (
                          <a
                            href={head.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-social-icon-btn"
                            aria-label={`${head.name}'s GitHub`}
                          >
                            <GithubIcon size={15} />
                          </a>
                        )}
                        {head.socials?.linkedin && (
                          <a
                            href={head.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-social-icon-btn"
                            aria-label={`${head.name}'s LinkedIn`}
                          >
                            <LinkedinIcon size={15} />
                          </a>
                        )}
                        {head.socials?.instagram && (
                          <a
                            href={head.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-social-icon-btn"
                            aria-label={`${head.name}'s Instagram`}
                          >
                            <InstagramIcon size={15} />
                          </a>
                        )}
                        {head.email && (
                          <a
                            href={`mailto:${head.email}`}
                            className="team-social-icon-btn"
                            aria-label={`Email ${head.name}`}
                          >
                            <MailIcon size={15} />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Department Members Roster (Co-Heads & Executives) with Interactive ID Cards */}
                    {otherMembers.length > 0 && (
                      <div className="team-slide-roster-section">
                        <div className="team-slide-roster-heading">
                          <span>TEAM MEMBERS IN {dept.name}</span>
                          <span className="team-roster-hint">
                            (Select to inspect ID credentials)
                          </span>
                        </div>
                        <div className="team-slide-roster-chips">
                          {otherMembers.map((m, mIdx) => (
                            <button
                              key={m.id}
                              type="button"
                              className="team-member-chip"
                              onClick={() =>
                                setSelectedMember({
                                  member: m,
                                  deptName: dept.name,
                                  deptId: dept.id,
                                })
                              }
                              title={`Inspect ${m.name}'s ID credentials`}
                              aria-label={`Inspect ${m.name}'s ID credentials`}
                            >
                              <span className="team-member-chip__accent-strip" />
                              <span className="team-member-chip__initials">
                                {m.initials}
                              </span>
                              <div className="team-member-chip__info">
                                <div className="team-member-chip__top-line">
                                  <span className="team-member-chip__name">{m.name}</span>
                                  <span className="team-member-chip__rank-badge">
                                    {m.rank === 'co-head' ? 'CO-HEAD' : 'EXEC'}
                                  </span>
                                </div>
                                <span className="team-member-chip__role">{m.role}</span>
                              </div>
                              <ArrowUpRight size={12} className="team-member-chip__arrow" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </main>

        {/* ─── Bottom Scroll Guidance Bar ──────────────────────────────────── */}
        <footer className="team-scroll-footer">
          <div className="team-scroll-cue-wrap">
            <div className="team-scroll-mouse" aria-hidden="true">
              <span className="team-scroll-mouse__wheel" />
            </div>
            <span className="team-scroll-cue__text">
              {activeIdx === numDepts - 1
                ? 'CONTINUE SCROLLING FOR CHAPTER ARCHIVE'
                : 'SCROLL DOWN TO ADVANCE TEAMS'}
            </span>
          </div>

          {/* Secondary manual jump buttons */}
          <div className="team-scroll-nav-secondary">
            {activeIdx > 0 && (
              <button
                type="button"
                className="team-secondary-arrow-btn"
                onClick={() => scrollToDept(activeIdx - 1)}
                aria-label="Previous team"
              >
                <ChevronUp size={14} />
                <span>PREV</span>
              </button>
            )}
            {activeIdx < numDepts - 1 && (
              <button
                type="button"
                className="team-secondary-arrow-btn"
                onClick={() => scrollToDept(activeIdx + 1)}
                aria-label="Next team"
              >
                <span>NEXT</span>
                <ChevronDown size={14} />
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* ─── Interactive Member ID Card Modal Dossier ─────────────────────── */}
      <MemberDetailModal
        member={selectedMember?.member || null}
        deptName={selectedMember?.deptName || ''}
        deptId={selectedMember?.deptId || ''}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
