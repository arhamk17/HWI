'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';
import { ArrowRight, ArrowLeft, ArrowUpRight, LayoutGrid, Layers, Users, Sparkles } from 'lucide-react';
import { DEPARTMENTS, DepartmentMember } from '@/data/teamDepartments';
import { getLeadershipPalette } from '@/components/TeamsSection/TeamsSection';
import './TeamCinematic.css';

type PhaseType = 'head-intro' | 'showcase' | 'complete';
type ViewDisplayMode = 'carousel' | 'grid';

interface TeamCinematicProps {
  onCompleteAll?: (completed: boolean) => void;
}

// ─── Inline SVG Brand Icons (dependency-free) ─────────────────────────────
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

// ─── Particles (brand-derived, lightweight) ──────────────────────────────
function Particles({ theme }: { theme: 'dark' | 'light' }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const particles = containerRef.current.querySelectorAll('.team-cinematic__particle');
    if (animRef.current) animRef.current.pause();

    animRef.current = anime({
      targets: particles,
      translateX: () => anime.random(-70, 70),
      translateY: () => anime.random(-50, 50),
      opacity: [
        { value: () => Math.random() * 0.45 + 0.1, duration: 1800 },
        { value: 0, duration: 2200 },
      ],
      scale: () => Math.random() * 0.5 + 0.5,
      duration: () => anime.random(4000, 7000),
      delay: () => anime.random(0, 2500),
      loop: true,
      easing: 'easeInOutSine',
    });

    return () => {
      if (animRef.current) animRef.current.pause();
    };
  }, [theme]);

  return (
    <div className="team-cinematic__particles" ref={containerRef} aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="team-cinematic__particle"
          style={{
            width: `${(i % 3) * 2 + 3}px`,
            height: `${(i % 3) * 2 + 3}px`,
            left: `${(i * 7 + 13) % 96}%`,
            top: `${(i * 11 + 7) % 94}%`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main TeamCinematic Component ────────────────────────────────────────
export function TeamCinematic({ onCompleteAll }: TeamCinematicProps) {
  const [deptIndex, setDeptIndex] = useState(0);
  const [phase, setPhase] = useState<PhaseType>('head-intro');
  const [activeMemberIdx, setActiveMemberIdx] = useState(1); // 1-indexed for membersAfterHead
  const [displayMode, setDisplayMode] = useState<ViewDisplayMode>('carousel');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isAnimating, setIsAnimating] = useState(false);
  const [allDone, setAllDone] = useState(false);

  // Touch handling
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  // Animation DOM refs
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headIntroCardRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const activeDetailsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<anime.AnimeTimelineInstance | null>(null);

  const dept = DEPARTMENTS[deptIndex];
  const head = dept.members[0];
  const membersAfterHead = dept.members.slice(1);
  const activeMember = membersAfterHead[activeMemberIdx - 1] || membersAfterHead[0];
  const totalMembers = membersAfterHead.length;
  const isLastDept = deptIndex === DEPARTMENTS.length - 1;

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Reset scroll on mount and phase transitions
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [deptIndex, phase]);

  // ─── Synchronize root / navbar CSS variables with theme ───────
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--navbar-bg', 'rgba(250, 247, 242, 0.92)');
      root.style.setProperty('--navbar-text', '#1A1116');
      root.style.setProperty('--border-default', 'rgba(180, 60, 60, 0.18)');
    } else {
      root.style.removeProperty('--navbar-bg');
      root.style.removeProperty('--navbar-text');
      root.style.removeProperty('--border-default');
    }

    return () => {
      root.style.removeProperty('--navbar-bg');
      root.style.removeProperty('--navbar-text');
      root.style.removeProperty('--border-default');
    };
  }, [theme]);

  // ─── Direct Department Jump ───────────────────────────────────
  const jumpToDept = useCallback(
    (newIdx: number) => {
      if (isAnimating || newIdx === deptIndex) return;
      setIsAnimating(true);
      setTheme('dark');
      setDisplayMode('carousel');

      setTimeout(() => {
        setDeptIndex(newIdx);
        setPhase('head-intro');
        setActiveMemberIdx(1);
        setIsAnimating(false);
      }, prefersReduced ? 30 : 350);
    },
    [deptIndex, isAnimating, prefersReduced]
  );

  // ─── Next Department Transition ───────────────────────────────
  const goNextDept = useCallback(() => {
    if (isAnimating) return;

    if (isLastDept) {
      setAllDone(true);
      onCompleteAll?.(true);
      return;
    }

    setIsAnimating(true);
    setTheme('dark');
    setDisplayMode('carousel');

    setTimeout(() => {
      setDeptIndex((prev) => prev + 1);
      setPhase('head-intro');
      setActiveMemberIdx(1);
      setIsAnimating(false);
    }, prefersReduced ? 50 : 550);
  }, [isAnimating, isLastDept, prefersReduced, onCompleteAll]);

  // ─── "MEET THE TEAM": Head intro → Showcase (Dark → Light) ────
  const handleMeetTheTeam = useCallback(() => {
    if (isAnimating) return;

    // For single-member departments (if any), proceed directly to next
    if (totalMembers === 0) {
      goNextDept();
      return;
    }

    setIsAnimating(true);

    if (timelineRef.current) timelineRef.current.pause();
    const dur = prefersReduced ? 50 : 650;

    // Transition theme
    setTheme('light');

    const tl = anime.timeline({
      easing: 'easeInOutCubic',
      complete: () => {
        setPhase('showcase');
        setActiveMemberIdx(1);
        setIsAnimating(false);
      },
    });

    timelineRef.current = tl;

    // Animate head card exiting intro position
    if (headIntroCardRef.current) {
      tl.add(
        {
          targets: headIntroCardRef.current,
          scale: [1, 0.75],
          opacity: [1, 0],
          translateX: [0, -40],
          duration: dur,
        },
        0
      );
    }
  }, [isAnimating, totalMembers, goNextDept, prefersReduced]);

  // ─── Sequential Member Navigation ─────────────────────────────
  const goToMember = useCallback(
    (newIdx: number) => {
      if (isAnimating || newIdx < 1) return;

      if (newIdx > totalMembers) {
        setPhase('complete');
        return;
      }

      setIsAnimating(true);
      if (timelineRef.current) timelineRef.current.pause();

      const dur = prefersReduced ? 50 : 450;
      const direction = newIdx > activeMemberIdx ? 1 : -1;

      const tl = anime.timeline({
        easing: 'easeOutCubic',
        complete: () => {
          setActiveMemberIdx(newIdx);
          setIsAnimating(false);
        },
      });

      timelineRef.current = tl;

      // Animate current active card out
      if (activeCardRef.current) {
        tl.add(
          {
            targets: activeCardRef.current,
            translateX: [0, direction * -100],
            opacity: [1, 0],
            duration: dur * 0.6,
          },
          0
        );
      }
    },
    [isAnimating, activeMemberIdx, totalMembers, prefersReduced]
  );

  const goNext = useCallback(() => {
    if (activeMemberIdx >= totalMembers) {
      setPhase('complete');
    } else {
      goToMember(activeMemberIdx + 1);
    }
  }, [activeMemberIdx, totalMembers, goToMember]);

  const goPrev = useCallback(() => {
    if (activeMemberIdx > 1) {
      goToMember(activeMemberIdx - 1);
    }
  }, [activeMemberIdx, goToMember]);

  // ─── Return to Head Intro ─────────────────────────────────────
  const backToHead = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTheme('dark');
    setDisplayMode('carousel');

    setTimeout(() => {
      setPhase('head-intro');
      setActiveMemberIdx(1);
      setIsAnimating(false);
    }, prefersReduced ? 50 : 500);
  }, [isAnimating, prefersReduced]);

  // ─── Active Member Entrance Animation ─────────────────────────
  useEffect(() => {
    if (phase !== 'showcase' || !activeCardRef.current || displayMode === 'grid') return;
    const dur = prefersReduced ? 50 : 520;

    anime({
      targets: activeCardRef.current,
      translateX: [90, 0],
      opacity: [0, 1],
      duration: dur,
      easing: 'easeOutCubic',
    });

    if (activeDetailsRef.current) {
      anime({
        targets: activeDetailsRef.current.children,
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(60, { start: 100 }),
        duration: dur,
        easing: 'easeOutCubic',
      });
    }
  }, [activeMemberIdx, phase, displayMode, prefersReduced]);

  // ─── Keyboard Navigation ──────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (phase === 'head-intro') {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleMeetTheTeam();
        } else if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft') && deptIndex > 0) {
          e.preventDefault();
          jumpToDept(deptIndex - 1);
        }
      } else if (phase === 'showcase' && displayMode === 'carousel') {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          goNext();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          goPrev();
        } else if (e.key === 'Escape') {
          backToHead();
        }
      } else if (phase === 'complete') {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          goNextDept();
        } else if (e.key === 'Escape' || e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          backToHead();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, displayMode, handleMeetTheTeam, goNext, goPrev, backToHead, goNextDept, jumpToDept, deptIndex]);

  // ─── Laptop Trackpad / Wheel Roll Up & Down Controller ────────
  useEffect(() => {
    if (displayMode === 'grid') return;
    const stage = stageRef.current;
    if (!stage) return;

    let isWheelCooling = false;
    let wheelCooldownTimer: NodeJS.Timeout | null = null;
    let touchStartY = 0;
    let hasTouchMoved = false;

    // 1. LAPTOP TRACKPAD / MOUSE WHEEL ROLL GESTURE
    const handleWheel = (e: WheelEvent) => {
      // Allow normal scroll inside explicit scrollable sub-containers
      const target = e.target as HTMLElement;
      if (target?.closest('.head-intro-layout__team-preview-chips, .showcase-grid-view, .final-depts-summary')) {
        return;
      }

      // Prevent whole page jumping while rolling inside cinematic section
      e.preventDefault();

      if (isWheelCooling) return;

      const delta = e.deltaY;
      const threshold = 22; // responsive trackpad roll sensitivity

      if (Math.abs(delta) >= threshold) {
        if (delta > 0) {
          // ROLL DOWN (Advance forward)
          if (phase === 'head-intro') {
            handleMeetTheTeam();
          } else if (phase === 'showcase') {
            goNext();
          } else if (phase === 'complete') {
            goNextDept();
          }
        } else {
          // ROLL UP (Move backward)
          if (phase === 'showcase') {
            if (activeMemberIdx > 1) {
              goPrev();
            } else {
              backToHead();
            }
          } else if (phase === 'head-intro') {
            if (deptIndex > 0) {
              jumpToDept(deptIndex - 1);
            }
          } else if (phase === 'complete') {
            backToHead();
          }
        }

        // Throttle momentum scroll so 1 roll action = 1 deliberate slide transition
        isWheelCooling = true;
        if (wheelCooldownTimer) clearTimeout(wheelCooldownTimer);
        wheelCooldownTimer = setTimeout(() => {
          isWheelCooling = false;
        }, 520);
      }
    };

    // 2. MOBILE / TOUCH VERTICAL ROLL GESTURE
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      hasTouchMoved = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchStartY;
      if (Math.abs(dy) > 20) {
        hasTouchMoved = true;
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!hasTouchMoved) return;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const threshold = 40;

      if (dy < -threshold) {
        // Roll / Swipe Upwards (Advance forward)
        if (phase === 'head-intro') {
          handleMeetTheTeam();
        } else if (phase === 'showcase') {
          goNext();
        } else if (phase === 'complete') {
          goNextDept();
        }
      } else if (dy > threshold) {
        // Roll / Swipe Downwards (Move backward)
        if (phase === 'showcase') {
          if (activeMemberIdx > 1) {
            goPrev();
          } else {
            backToHead();
          }
        } else if (phase === 'head-intro') {
          if (deptIndex > 0) jumpToDept(deptIndex - 1);
        } else if (phase === 'complete') {
          backToHead();
        }
      }
      hasTouchMoved = false;
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    stage.addEventListener('touchstart', handleTouchStart, { passive: true });
    stage.addEventListener('touchmove', handleTouchMove, { passive: false });
    stage.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      stage.removeEventListener('wheel', handleWheel);
      stage.removeEventListener('touchstart', handleTouchStart);
      stage.removeEventListener('touchmove', handleTouchMove);
      stage.removeEventListener('touchend', handleTouchEnd);
      if (wheelCooldownTimer) clearTimeout(wheelCooldownTimer);
    };
  }, [phase, displayMode, handleMeetTheTeam, goNext, goPrev, backToHead, goNextDept, jumpToDept, deptIndex, activeMemberIdx]);

  // ─── Helper: Portrait Rendering with Fallback ─────────────────
  const renderPortraitCard = (
    member: DepartmentMember,
    size: 'hero' | 'active' | 'compact',
    showMeetCta = false
  ) => {
    const isLeadership = member.rank === 'head' || member.rank === 'co-head';
    const palette = isLeadership ? getLeadershipPalette(member, dept.id) : null;

    return (
      <div
        className={`team-portrait-card team-portrait-card--${size} ${isLeadership ? 'team-portrait-card--lead' : ''}`}
        tabIndex={0}
        aria-label={`${member.name}, ${member.role}`}
        style={
          isLeadership && palette
            ? ({
                ['--lead-primary' as string]: palette.primary,
                ['--lead-secondary' as string]: palette.secondary,
                ['--lead-gradient' as string]: palette.gradient,
              } as React.CSSProperties)
            : undefined
        }
      >
        {isLeadership && palette && (
          <div className="leadership-aura-container" aria-hidden="true">
            <div
              className="leadership-aura-glow"
              style={{ background: palette.gradient }}
            />
          </div>
        )}

        <div className="team-portrait-card__inner">
          <div className="team-portrait-card__fallback">
            <span className="team-portrait-card__initials">{member.initials}</span>
            <span className="team-portrait-card__watermark">HWI // BVUDET</span>
          </div>
          {member.image && (
            <img
              src={member.image}
              alt={member.name}
              className="team-portrait-card__img"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          )}
          <div className="team-portrait-card__overlay" />
        </div>

        {/* Editorial Action anchored at bottom-left edge */}
        {showMeetCta && (
          <button
            id="team-meet-cta"
            className="team-portrait-card__meet-cta"
            onClick={(e) => {
              e.stopPropagation();
              handleMeetTheTeam();
            }}
            aria-label={
              totalMembers > 0
                ? `Meet all ${totalMembers + 1} members of ${dept.name}`
                : isLastDept
                ? 'View complete roster'
                : 'Meet next team'
            }
          >
            <span>
              {totalMembers > 0
                ? `MEET THE TEAM (${totalMembers + 1})`
                : isLastDept
                ? "THAT'S EVERYONE"
                : 'NEXT TEAM'}
            </span>
            <ArrowUpRight className="team-portrait-card__meet-icon" size={14} />
          </button>
        )}
      </div>
    );
  };

  // ─── Phase: ALL DEPARTMENTS COMPLETED ─────────────────────────
  if (allDone) {
    return (
      <div className="team-cinematic team-cinematic--final" data-theme={theme} ref={rootRef}>
        <Particles theme={theme} />
        <div className="team-cinematic__final-roster">
          <span className="team-cinematic__eyebrow">COMPLETE 2026–27 DIRECTORY</span>
          <h2 className="team-cinematic__final-title">
            THAT&apos;S THE<br />TEAM.
          </h2>
          <p className="team-cinematic__final-desc">
            Every leader, head, and executive member across all 9 departments — the community powering
            HackWithIndia BVUDET-NM.
          </p>

          <div className="final-depts-summary">
            {DEPARTMENTS.map((d) => (
              <div key={d.id} className="final-dept-card">
                <h4 className="final-dept-card__title">{d.name}</h4>
                <div className="final-dept-card__members">
                  {d.members.map((m) => (
                    <div key={m.id} className="final-member-row">
                      <span className="final-member-row__name">{m.name}</span>
                      <span className="final-member-row__role">
                        {m.role}
                        {m.academicYear ? ` (${m.academicYear} ${m.branch})` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="team-cinematic__final-actions">
            <button
              className="team-cinematic__btn-editorial"
              onClick={() => {
                setAllDone(false);
                onCompleteAll?.(false);
                setDeptIndex(0);
                setPhase('head-intro');
                setTheme('dark');
                setActiveMemberIdx(1);
              }}
              aria-label="Start over from first department"
            >
              <ArrowLeft size={16} />
              <span>REPLAY SHOWCASE</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="team-cinematic" data-theme={theme} ref={rootRef}>
      <Particles theme={theme} />

      {/* ── Top Header Bar (Unified Editorial Breadcrumb & Dept Jump Switcher) ── */}
      <header className="dept-header">
        <div className="dept-header__left">
          <span className="dept-header__eyebrow">HWI // 2026–27 INTERACTIVE SHOWCASE</span>
          <h1 className="dept-header__title">{dept.name}</h1>
          <p className="dept-header__tagline">{dept.tagline}</p>
        </div>

        {/* Quick Department Navigation Switcher */}
        <nav className="dept-header__switcher" aria-label="Department Switcher">
          {DEPARTMENTS.map((d, idx) => (
            <button
              key={d.id}
              className={`dept-switcher-pill ${idx === deptIndex ? 'dept-switcher-pill--active' : ''}`}
              onClick={() => jumpToDept(idx)}
              title={`${d.name} (${d.members.length} members)`}
              aria-label={`Jump to ${d.name}`}
            >
              <span className="dept-switcher-pill__num">{String(idx + 1).padStart(2, '0')}</span>
              <span className="dept-switcher-pill__name">{d.name.split(' ')[0]}</span>
            </button>
          ))}
        </nav>

        <div className="dept-header__counter" aria-label={`Department ${deptIndex + 1} of ${DEPARTMENTS.length}`}>
          <span className="dept-header__counter-current">
            {String(deptIndex + 1).padStart(2, '0')}
          </span>
          <span className="dept-header__counter-slash">/</span>
          <span className="dept-header__counter-total">
            {String(DEPARTMENTS.length).padStart(2, '0')}
          </span>
        </div>
      </header>

      {/* ── Stage Area ── */}
      <main className="dept-stage" ref={stageRef}>
        {/* ────────────────────────────────────────────────────────────
            PHASE 1: HEAD INTRO (Dark cinematic state, Head featured)
            ──────────────────────────────────────────────────────────── */}
        {phase === 'head-intro' && (
          <div className="head-intro-layout" ref={headIntroCardRef}>
            <div className="head-intro-layout__portrait-wrap">
              {renderPortraitCard(head, 'hero', true)}
            </div>

            <div className="head-intro-layout__content">
              <div className="head-intro-layout__badge-row">
                <span className="head-intro-layout__role-badge">{head.role}</span>
                <span className="head-intro-layout__count-badge">
                  {dept.members.length} {dept.members.length === 1 ? 'MEMBER' : 'MEMBERS IN TEAM'}
                </span>
              </div>

              <h2 className="head-intro-layout__name">{head.name}</h2>
              {head.bio && <p className="head-intro-layout__bio">{head.bio}</p>}

              {/* Preview of team members in this department */}
              {membersAfterHead.length > 0 && (
                <div className="head-intro-layout__team-preview">
                  <span className="head-intro-layout__team-preview-title">
                    TEAM MEMBERS IN {dept.name}:
                  </span>
                  <div className="head-intro-layout__team-preview-chips">
                    {membersAfterHead.map((m) => (
                      <span
                        key={m.id}
                        className="team-preview-chip"
                        title={`${m.name} — ${m.role} ${m.academicYear ? `(${m.academicYear} ${m.branch})` : ''}`}
                      >
                        <span className="team-preview-chip__initials">{m.initials}</span>
                        <span className="team-preview-chip__name">{m.name}</span>
                        {m.academicYear && (
                          <span className="team-preview-chip__academic">
                            {m.academicYear} {m.branch}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(head.socials || head.email) && (
                <div className="head-intro-layout__socials">
                  {head.socials?.github && (
                    <a
                      href={head.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="head-intro-layout__social-link"
                      aria-label={`${head.name}'s GitHub`}
                    >
                      <GithubIcon size={16} />
                    </a>
                  )}
                  {head.socials?.linkedin && (
                    <a
                      href={head.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="head-intro-layout__social-link"
                      aria-label={`${head.name}'s LinkedIn`}
                    >
                      <LinkedinIcon size={16} />
                    </a>
                  )}
                  {head.socials?.instagram && (
                    <a
                      href={head.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="head-intro-layout__social-link"
                      aria-label={`${head.name}'s Instagram`}
                    >
                      <InstagramIcon size={16} />
                    </a>
                  )}
                  {head.email && (
                    <a
                      href={`mailto:${head.email}`}
                      className="head-intro-layout__social-link"
                      aria-label={`Email ${head.name}`}
                      title={head.email}
                    >
                      <MailIcon size={16} />
                    </a>
                  )}
                </div>
              )}

              <div className="head-intro-layout__cue">
                <button
                  type="button"
                  id="head-roll-cue-btn"
                  className="head-intro-roll-control"
                  onClick={handleMeetTheTeam}
                  data-cursor="link"
                  data-cursor-label="ROLL"
                  aria-label={
                    totalMembers > 0
                      ? `Roll down on laptop trackpad or click to reveal all ${totalMembers + 1} members`
                      : 'Roll down or click to continue to next team'
                  }
                >
                  <div className="roll-indicator-track" aria-hidden="true">
                    <div className="roll-mouse-frame">
                      <span className="roll-mouse-dot" />
                    </div>
                    <span className="roll-arrow-animated">↓</span>
                  </div>

                  <div className="roll-control-label-wrap">
                    <span className="roll-control-action">ROLL DOWN</span>
                    <span className="roll-control-divider">//</span>
                    <span className="roll-control-text">
                      {totalMembers > 0 ? (
                        <>
                          <span className="roll-control-or">OR CLICK</span>{' '}
                          <strong className="roll-control-highlight">
                            MEET THE TEAM ({totalMembers + 1})
                          </strong>
                          <ArrowUpRight size={13} className="roll-control-arrow" />
                        </>
                      ) : (
                        <>
                          <span className="roll-control-or">OR CLICK</span>{' '}
                          <strong className="roll-control-highlight">
                            {isLastDept ? "THAT'S EVERYONE" : 'NEXT TEAM'}
                          </strong>
                          <ArrowUpRight size={13} className="roll-control-arrow" />
                        </>
                      )}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
            PHASE 2: SHOWCASE (Warm light state, Head + Members)
            ──────────────────────────────────────────────────────────── */}
        {phase === 'showcase' && activeMember && (
          <div className="showcase-layout">
            {displayMode === 'carousel' ? (
              <div className="showcase-layout__body">
                {/* Left Column: Persistent Compact Head Anchor */}
                <aside
                  className="showcase-layout__anchor"
                  aria-label="Department Head"
                  onClick={backToHead}
                  title="Click to view department head in intro focus"
                >
                  <div className="showcase-layout__anchor-header">
                    <span className="showcase-layout__anchor-tag">
                      {dept.id === 'core-leadership' ? 'CHAPTER PRESIDENT' : 'DEPT. HEAD'}
                    </span>
                  </div>
                  {renderPortraitCard(head, 'compact', false)}
                  <div className="showcase-layout__anchor-info">
                    <span className="showcase-layout__anchor-name">{head.name}</span>
                    <span className="showcase-layout__anchor-role">{head.role}</span>
                  </div>
                </aside>

                {/* Middle Column: Dominant Active Member Card */}
                <section className="showcase-layout__stage">
                  <div className="showcase-active-card" ref={activeCardRef}>
                    <div className="showcase-active-card__portrait">
                      {renderPortraitCard(activeMember, 'active', false)}
                    </div>

                    <div className="showcase-active-card__details" ref={activeDetailsRef}>
                      <div className="showcase-active-card__badges">
                        <span className={`showcase-active-card__role ${activeMember.rank === 'co-head' ? 'showcase-role--cohead' : ''}`}>
                          {activeMember.role}
                        </span>

                        {activeMember.rank === 'executive' && (
                          <span className="showcase-tier-badge">Executive Member</span>
                        )}

                        {activeMember.academicYear && activeMember.branch && (
                          <span className="showcase-academic-pill">
                            {activeMember.academicYear} • {activeMember.branch}
                          </span>
                        )}
                      </div>

                      <h2 className="showcase-active-card__name">{activeMember.name}</h2>
                      <span className="showcase-active-card__dept-name">{dept.name}</span>

                      {activeMember.bio && (
                        <p className="showcase-active-card__bio">{activeMember.bio}</p>
                      )}

                      {(activeMember.socials || activeMember.email) && (
                        <div className="showcase-active-card__socials">
                          {activeMember.socials?.github && (
                            <a
                              href={activeMember.socials.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="showcase-active-card__social-link"
                              aria-label={`${activeMember.name}'s GitHub`}
                            >
                              <GithubIcon size={16} />
                            </a>
                          )}
                          {activeMember.socials?.linkedin && (
                            <a
                              href={activeMember.socials.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="showcase-active-card__social-link"
                              aria-label={`${activeMember.name}'s LinkedIn`}
                            >
                              <LinkedinIcon size={16} />
                            </a>
                          )}
                          {activeMember.socials?.instagram && (
                            <a
                              href={activeMember.socials.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="showcase-active-card__social-link"
                              aria-label={`${activeMember.name}'s Instagram`}
                            >
                              <InstagramIcon size={16} />
                            </a>
                          )}
                          {activeMember.email && (
                            <a
                              href={`mailto:${activeMember.email}`}
                              className="showcase-active-card__social-link"
                              aria-label={`Email ${activeMember.name}`}
                              title={activeMember.email}
                            >
                              <MailIcon size={16} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Right Column: Introduced Members Rail */}
                {totalMembers > 1 && (
                  <aside className="showcase-layout__rail" aria-label="Department Roster Rail">
                    <span className="showcase-layout__rail-label">ROSTER ({totalMembers})</span>
                    <div className="showcase-layout__rail-items">
                      {membersAfterHead.map((m, idx) => {
                        const itemIdx = idx + 1;
                        const isItemActive = itemIdx === activeMemberIdx;

                        return (
                          <button
                            key={m.id}
                            className={`showcase-rail-item ${
                              isItemActive ? 'showcase-rail-item--active' : ''
                            }`}
                            onClick={() => goToMember(itemIdx)}
                            title={`${m.name} — ${m.role} ${m.academicYear ? `(${m.academicYear} ${m.branch})` : ''}`}
                            aria-label={`View ${m.name}`}
                          >
                            <span className="showcase-rail-item__initials">{m.initials}</span>
                            {m.image && (
                              <img
                                src={m.image}
                                alt={m.name}
                                className="showcase-rail-item__img"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            )}
                            <span className="showcase-rail-item__preview-name">
                              {m.name.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </aside>
                )}
              </div>
            ) : (
              /* ── Full Team Grid View ── */
              <div className="showcase-grid-view">
                <div className="showcase-grid-view__head-featured">
                  <span className="showcase-grid-view__head-tag">DEPARTMENT HEAD</span>
                  <div className="showcase-grid-view__head-card">
                    {renderPortraitCard(head, 'compact', false)}
                    <div className="showcase-grid-view__head-info">
                      <span className="showcase-grid-view__head-role">{head.role}</span>
                      <h3 className="showcase-grid-view__head-name">{head.name}</h3>
                      {head.bio && <p className="showcase-grid-view__head-bio">{head.bio}</p>}
                      {(head.socials || head.email) && (
                        <div className="showcase-grid-view__head-socials" onClick={(e) => e.stopPropagation()}>
                          {head.socials?.github && (
                            <a
                              href={head.socials.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="showcase-grid-card__social-link"
                              aria-label={`${head.name}'s GitHub`}
                            >
                              <GithubIcon size={14} />
                            </a>
                          )}
                          {head.socials?.linkedin && (
                            <a
                              href={head.socials.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="showcase-grid-card__social-link"
                              aria-label={`${head.name}'s LinkedIn`}
                            >
                              <LinkedinIcon size={14} />
                            </a>
                          )}
                          {head.socials?.instagram && (
                            <a
                              href={head.socials.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="showcase-grid-card__social-link"
                              aria-label={`${head.name}'s Instagram`}
                            >
                              <InstagramIcon size={14} />
                            </a>
                          )}
                          {head.email && (
                            <a
                              href={`mailto:${head.email}`}
                              className="showcase-grid-card__social-link"
                              aria-label={`Email ${head.name}`}
                              title={head.email}
                            >
                              <MailIcon size={14} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="showcase-grid-view__members-section">
                  <span className="showcase-grid-view__members-title">
                    TEAM MEMBERS ({membersAfterHead.length})
                  </span>
                  <div className="showcase-grid-view__members-grid">
                    {membersAfterHead.map((m, idx) => (
                      <div
                        key={m.id}
                        className="showcase-grid-card"
                        onClick={() => {
                          setActiveMemberIdx(idx + 1);
                          setDisplayMode('carousel');
                        }}
                      >
                        <div className="showcase-grid-card__avatar">
                          <span className="showcase-grid-card__initials">{m.initials}</span>
                          {m.image && (
                            <img
                              src={m.image}
                              alt={m.name}
                              className="showcase-grid-card__img"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                        <div className="showcase-grid-card__details">
                          <span className="showcase-grid-card__role">{m.role}</span>
                          <h4 className="showcase-grid-card__name">{m.name}</h4>
                          {m.academicYear && (
                            <span className="showcase-grid-card__academic">
                              {m.academicYear} • {m.branch}
                            </span>
                          )}
                          {(m.socials || m.email) && (
                            <div className="showcase-grid-card__socials" onClick={(e) => e.stopPropagation()}>
                              {m.socials?.github && (
                                <a
                                  href={m.socials.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="showcase-grid-card__social-link"
                                  aria-label={`${m.name}'s GitHub`}
                                >
                                  <GithubIcon size={12} />
                                </a>
                              )}
                              {m.socials?.linkedin && (
                                <a
                                  href={m.socials.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="showcase-grid-card__social-link"
                                  aria-label={`${m.name}'s LinkedIn`}
                                >
                                  <LinkedinIcon size={12} />
                                </a>
                              )}
                              {m.socials?.instagram && (
                                <a
                                  href={m.socials.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="showcase-grid-card__social-link"
                                  aria-label={`${m.name}'s Instagram`}
                                >
                                  <InstagramIcon size={12} />
                                </a>
                              )}
                              {m.email && (
                                <a
                                  href={`mailto:${m.email}`}
                                  className="showcase-grid-card__social-link"
                                  aria-label={`Email ${m.name}`}
                                  title={m.email}
                                >
                                  <MailIcon size={12} />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <footer className="showcase-controls">
              <div className="showcase-controls__nav">
                <button
                  id="team-nav-prev"
                  className="showcase-controls__arrow-btn"
                  onClick={goPrev}
                  disabled={activeMemberIdx <= 1 || isAnimating || displayMode === 'grid'}
                  aria-label="Previous member"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="showcase-controls__progress">
                  <span className="showcase-controls__curr">
                    {String(activeMemberIdx).padStart(2, '0')}
                  </span>
                  <span className="showcase-controls__sep">/</span>
                  <span className="showcase-controls__tot">
                    {String(totalMembers).padStart(2, '0')}
                  </span>
                </div>

                <button
                  id="team-nav-next"
                  className="showcase-controls__arrow-btn"
                  onClick={goNext}
                  disabled={isAnimating || displayMode === 'grid'}
                  aria-label="Next member"
                >
                  <ArrowRight size={18} />
                </button>

                <span className="showcase-controls__member-label">
                  {activeMember.name}
                </span>

                <span className="showcase-controls__roll-hint" aria-hidden="true">
                  <span className="roll-hint-icon">↕</span>
                  ROLL UP / DOWN TO SLIDE
                </span>
              </div>

              <div className="showcase-controls__actions">
                {/* Toggle between sequential carousel and full team grid */}
                <button
                  className="showcase-controls__toggle-btn"
                  onClick={() => setDisplayMode((prev) => (prev === 'carousel' ? 'grid' : 'carousel'))}
                  aria-label="Toggle team view mode"
                >
                  {displayMode === 'carousel' ? <LayoutGrid size={14} /> : <Layers size={14} />}
                  <span>{displayMode === 'carousel' ? 'TEAM GRID' : 'CAROUSEL'}</span>
                </button>

                <button
                  id="team-back-to-head"
                  className="showcase-controls__back-btn"
                  onClick={backToHead}
                  aria-label="Back to department head view"
                >
                  <ArrowLeft size={14} />
                  <span>BACK TO HEAD</span>
                </button>

                <button
                  className="showcase-controls__next-dept-btn"
                  onClick={goNextDept}
                  aria-label="Next department"
                >
                  <span>{isLastDept ? "FINISH ROSTER" : "NEXT TEAM"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </footer>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
            PHASE 3: DEPARTMENT COMPLETE
            ──────────────────────────────────────────────────────────── */}
        {phase === 'complete' && (
          <div className="dept-complete-layout">
            <span className="dept-complete-layout__eyebrow">DEPARTMENT COMPLETE</span>
            <h2 className="dept-complete-layout__title">{dept.name}</h2>
            <p className="dept-complete-layout__desc">
              All {dept.members.length} leaders and members explored for {dept.name}.
            </p>

            <div className="dept-complete-layout__actions">
              <button
                className="team-cinematic__btn-secondary"
                onClick={backToHead}
                aria-label="Review this department again"
              >
                <ArrowLeft size={15} />
                <span>REVIEW TEAM</span>
              </button>

              <button
                id="team-next-dept"
                className="team-cinematic__btn-primary"
                onClick={goNextDept}
                aria-label={isLastDept ? "View final roster summary" : "Meet the next team"}
              >
                <span>{isLastDept ? "THAT'S EVERYONE" : 'MEET THE NEXT TEAM'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
