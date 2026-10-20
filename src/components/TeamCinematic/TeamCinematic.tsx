'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ArrowUpRight,
  Sparkles,
  Users,
  X,
  ChevronDown,
  ChevronUp,
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

// ─── Team Member Detail Modal ────────────────────────────────────────────────
interface MemberModalProps {
  member: DepartmentMember | null;
  deptName: string;
  onClose: () => void;
}

function MemberDetailModal({ member, deptName, onClose }: MemberModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (member) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [member, onClose]);

  if (!member) return null;

  return (
    <div
      className="team-member-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} details`}
    >
      <div className="team-member-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="team-member-modal__close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="team-member-modal__header">
          <div className="team-member-modal__avatar">
            <span className="team-member-modal__initials">{member.initials}</span>
          </div>
          <div className="team-member-modal__title-wrap">
            <div className="team-member-modal__badge-row">
              <span className="team-member-modal__role">{member.role}</span>
              <span className="team-member-modal__dept">{deptName}</span>
            </div>
            <h3 className="team-member-modal__name">{member.name}</h3>
            {member.academicYear && member.branch && (
              <span className="team-member-modal__academic">
                {member.academicYear} • {member.branch}
              </span>
            )}
          </div>
        </div>

        {member.bio && (
          <p className="team-member-modal__bio">{member.bio}</p>
        )}

        {(member.socials || member.email) && (
          <div className="team-member-modal__socials">
            {member.socials?.github && (
              <a
                href={member.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="team-member-modal__social-link"
                aria-label={`${member.name}'s GitHub`}
              >
                <GithubIcon size={16} />
                <span>GitHub</span>
              </a>
            )}
            {member.socials?.linkedin && (
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="team-member-modal__social-link"
                aria-label={`${member.name}'s LinkedIn`}
              >
                <LinkedinIcon size={16} />
                <span>LinkedIn</span>
              </a>
            )}
            {member.socials?.instagram && (
              <a
                href={member.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="team-member-modal__social-link"
                aria-label={`${member.name}'s Instagram`}
              >
                <InstagramIcon size={16} />
                <span>Instagram</span>
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="team-member-modal__social-link"
                aria-label={`Email ${member.name}`}
              >
                <MailIcon size={16} />
                <span>Email</span>
              </a>
            )}
          </div>
        )}
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
        // diff = idx - teamFloat
        // When scrolling down: active slide passes (diff becomes negative, exiting upwards)
        // Next slide approaches from below (diff is positive, entering upwards)
        const diff = idx - teamFloat;
        const absDiff = Math.abs(diff);

        // Strict isolation threshold: slides with absDiff > 0.50 are completely hidden
        // Mathematical guarantee: exactly ONE slide is visible at any given scroll coordinate
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
        // t progresses from 0 (leaving dwell) to 1 (at midpoint 0.50)
        const t = (absDiff - 0.15) / 0.35;
        // Clean quadratic ease-out fade: fast initial fade prevents any visible collision
        const opacity = Math.max(0, 1 - t * t);
        // Vertical translation: 0 to 90px in direction of motion
        // If diff < 0: slide was passed, exits upwards (-90px)
        // If diff > 0: slide is upcoming, enters from below (+90px)
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

          {/* Secondary Quick Jump Navigation Pills */}
          <nav className="team-scroll-switcher" aria-label="Department Roster Navigation">
            {DEPARTMENTS.map((d, idx) => (
              <button
                key={d.id}
                type="button"
                className={`team-switcher-pill ${idx === activeIdx ? 'team-switcher-pill--active' : ''}`}
                onClick={() => scrollToDept(idx)}
                aria-label={`Scroll to ${d.name}`}
                aria-current={idx === activeIdx ? 'true' : undefined}
              >
                <span className="team-switcher-pill__num">0{idx + 1}</span>
                <span className="team-switcher-pill__name">{d.name.split(' ')[0]}</span>
              </button>
            ))}
          </nav>

          {/* Counter & Mini Progress Indicator */}
          <div className="team-scroll-header__counter" aria-label={`Team ${activeIdx + 1} of ${numDepts}`}>
            <span className="team-counter-current">0{activeIdx + 1}</span>
            <span className="team-counter-slash">/</span>
            <span className="team-counter-total">0{numDepts}</span>
          </div>

          {/* Top Edge Progress Line */}
          <div className="team-scroll-progress-line">
            <div className="team-scroll-progress-line__fill" ref={progressBarRef} />
          </div>
        </header>

        {/* ─── Stage Area: Continuously Transitioning Department Slides ─────── */}
        <main className="team-scroll-stage">
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
                  {/* Left Column: Department Head Portrait Card */}
                  <div className="team-slide-portrait-col">
                    <div className="team-portrait-frame">
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

                      {/* Rank tag label */}
                      <div className="team-portrait-rank-badge">
                        <span>{dept.id === 'core-leadership' ? 'CHAPTER LEADERSHIP' : 'DEPARTMENT HEAD'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Head Bio, Roles & Interactive Member Roster */}
                  <div className="team-slide-details-col">
                    <div className="team-slide-badges">
                      <span className="team-slide-role-badge">{head.role}</span>
                      <span className="team-slide-count-badge">
                        <Users size={12} />
                        {dept.members.length} {dept.members.length === 1 ? 'MEMBER' : 'MEMBERS'}
                      </span>
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

                    {/* Department Members Roster (Co-Heads & Executives) */}
                    {otherMembers.length > 0 && (
                      <div className="team-slide-roster-section">
                        <div className="team-slide-roster-heading">
                          <span>TEAM MEMBERS IN {dept.name}</span>
                          <span className="team-roster-hint">(Click to inspect credentials)</span>
                        </div>
                        <div className="team-slide-roster-chips">
                          {otherMembers.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              className="team-member-chip"
                              onClick={() => setSelectedMember({ member: m, deptName: dept.name })}
                              title={`View ${m.name}`}
                            >
                              <span className="team-member-chip__initials">{m.initials}</span>
                              <div className="team-member-chip__info">
                                <span className="team-member-chip__name">{m.name}</span>
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

        {/* ─── Bottom Scroll Guidance Bar (Replaces "Next Team" Button) ─────── */}
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

          {/* Secondary manual jump buttons (subtle & non-blocking) */}
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

      {/* ─── Member Detail Modal ─────────────────────────────────────────── */}
      <MemberDetailModal
        member={selectedMember?.member || null}
        deptName={selectedMember?.deptName || ''}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
