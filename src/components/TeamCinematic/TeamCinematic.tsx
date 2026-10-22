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
import {
  DEPARTMENTS,
  Department,
  DepartmentMember,
  DepartmentTheme,
  getDepartmentTheme,
} from '@/data/teamDepartments';
import { scrollBus } from '@/lib/scrollBus';
import { teamStore } from '@/lib/teamStore';
import { CometCard, CometCardViewIndicator } from '@/components/ui/comet-card';
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

// ─── Department Dynamic ID Barcode Graphic ──────────────────────────────────
function DepartmentIdBarcode({
  startColor,
  endColor,
  uniqueId,
}: {
  startColor: string;
  endColor: string;
  uniqueId: string;
}) {
  const gradId = `barcode-grad-${uniqueId}`;
  return (
    <svg
      className="team-card__barcode-svg"
      viewBox="0 0 220 22"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="2" height="22" fill={`url(#${gradId})`} />
      <rect x="4" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.6" />
      <rect x="7" y="0" width="3" height="22" fill={`url(#${gradId})`} />
      <rect x="12" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="16" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.5" />
      <rect x="19" y="0" width="2.5" height="22" fill={`url(#${gradId})`} />
      <rect x="24" y="0" width="1" height="22" fill={`url(#${gradId})`} />
      <rect x="27" y="0" width="3" height="22" fill={`url(#${gradId})`} />
      <rect x="32" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.7" />
      <rect x="35" y="0" width="2" height="22" fill={`url(#${gradId})`} />
      <rect x="39" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="43" y="0" width="3" height="22" fill={`url(#${gradId})`} />
      <rect x="48" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.5" />
      <rect x="51" y="0" width="2.5" height="22" fill={`url(#${gradId})`} />
      <rect x="56" y="0" width="1" height="22" fill={`url(#${gradId})`} />
      <rect x="59" y="0" width="2" height="22" fill={`url(#${gradId})`} />
      <rect x="63" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="67" y="0" width="3" height="22" fill={`url(#${gradId})`} />
      <rect x="72" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.6" />
      <rect x="75" y="0" width="2" height="22" fill={`url(#${gradId})`} />
      <rect x="79" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="83" y="0" width="2.5" height="22" fill={`url(#${gradId})`} />
      <rect x="88" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.7" />
      <rect x="91" y="0" width="3" height="22" fill={`url(#${gradId})`} />
      <rect x="96" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="100" y="0" width="2" height="22" fill={`url(#${gradId})`} />
      <rect x="104" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.5" />
      <rect x="107" y="0" width="3" height="22" fill={`url(#${gradId})`} />
      <rect x="112" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="116" y="0" width="2" height="22" fill={`url(#${gradId})`} />
      <rect x="120" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.7" />
      <rect x="123" y="0" width="2.5" height="22" fill={`url(#${gradId})`} />
      <rect x="128" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="132" y="0" width="3" height="22" fill={`url(#${gradId})`} />
      <rect x="137" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.6" />
      <rect x="140" y="0" width="2" height="22" fill={`url(#${gradId})`} />
      <rect x="144" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="148" y="0" width="2.5" height="22" fill={`url(#${gradId})`} />
      <rect x="153" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.5" />
      <rect x="156" y="0" width="3" height="22" fill={`url(#${gradId})`} />
      <rect x="161" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="165" y="0" width="2" height="22" fill={`url(#${gradId})`} />
      <rect x="169" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.7" />
      <rect x="172" y="0" width="2.5" height="22" fill={`url(#${gradId})`} />
      <rect x="177" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="181" y="0" width="3" height="22" fill={`url(#${gradId})`} />
      <rect x="186" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.6" />
      <rect x="189" y="0" width="2" height="22" fill={`url(#${gradId})`} />
      <rect x="193" y="0" width="1.5" height="22" fill={`url(#${gradId})`} />
      <rect x="197" y="0" width="3" height="22" fill={`url(#${gradId})`} />
      <rect x="202" y="0" width="1" height="22" fill={`url(#${gradId})`} opacity="0.5" />
      <rect x="205" y="0" width="2.5" height="22" fill={`url(#${gradId})`} />
      <rect x="210" y="0" width="1" height="22" fill={`url(#${gradId})`} />
      <rect x="213" y="0" width="2" height="22" fill={`url(#${gradId})`} />
      <rect x="217" y="0" width="3" height="22" fill={`url(#${gradId})`} />
    </svg>
  );
}

// ─── Physical ID Card Component ──────────────────────────────────────────────
interface PhysicalIdCardProps {
  member: DepartmentMember;
  dept: Department;
  theme: DepartmentTheme;
  index: number;
  total: number;
  diff: number;
  prefersReduced: boolean;
  onSelect: () => void;
}

function PhysicalIdCard({
  member,
  dept,
  theme,
  index,
  total,
  diff,
  prefersReduced,
  onSelect,
}: PhysicalIdCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const serialId =
    member.credentialId ||
    `HWI-2026-${(dept.id || 'COR').slice(0, 3).toUpperCase()}-${member.id
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

  // Compute restrained, subtle physical stacking style
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

    // Active Card (diff near 0): prominent, clean, foreground focus
    if (Math.abs(diff) <= 0.2) {
      return {
        transform: 'translate3d(0px, 0px, 0px) scale(1)',
        opacity: 1,
        zIndex: 25,
        pointerEvents: 'auto',
        visibility: 'visible',
      };
    }

    // Exited Card (diff < -0.2): slides up subtly and fades smoothly without wild rotation
    if (diff < -0.2) {
      const t = Math.min(1, (-diff - 0.2) / 0.8);
      const x = -28 * t;
      const y = -48 * t;
      const rot = -1.2 * t;
      const scale = 1 - 0.02 * t;
      const opacity = Math.max(0, 1 - t * 1.6);
      return {
        transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
        opacity: Number(opacity.toFixed(3)),
        zIndex: Math.max(1, 30 - Math.round(t * 10)),
        pointerEvents: 'none',
        visibility: opacity <= 0.01 ? 'hidden' : 'visible',
      };
    }

    // Stacked Upcoming Cards (diff > 0.2): restrained, tidy stack behind
    const stackPos = diff;
    const x = Math.min(32, 10 * stackPos);
    const y = Math.min(22, 7 * stackPos);
    const scale = Math.max(0.92, 1 - 0.025 * stackPos);
    const rot = stackPos % 2 === 0 ? -0.75 : 0.75;
    const opacity = Math.max(0, 0.95 - stackPos * 0.18);

    return {
      transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
      opacity: Number(opacity.toFixed(3)),
      zIndex: Math.max(1, 20 - Math.round(stackPos * 2)),
      pointerEvents: 'auto',
      visibility: opacity <= 0.01 ? 'hidden' : 'visible',
    };
  }, [diff, prefersReduced]);

  const isActive = Math.abs(diff) <= 0.5;

  return (
    <div
      className={`team-deck-card-slot ${isActive ? 'is-active' : 'is-stacked'}`}
      style={cardStyle}
    >
      <CometCard
        className={`team-physical-card ${isActive ? 'is-active' : 'is-stacked'}`}
        deptId={dept.id}
        deptTheme={theme}
        isActive={isActive}
        disabled={!isActive}
        prefersReducedMotion={prefersReduced}
        onSelect={onSelect}
        ariaLabel={`${member.name} — ${member.role}`}
        maxTilt={4.5}
        elevation={8}
        showSheen={true}
      >
        {/* Top Lanyard Punch Slot */}
        <div className="team-card__lanyard-slot" aria-hidden="true" />

        {/* Security Accent Line with Department Gradient */}
        <div className="team-card__accent-strip" />

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
            <span className="team-card__status-dot" />
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

          {/* Floating Circular VIEW Indicator */}
          <CometCardViewIndicator text="VIEW" />
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
            <DepartmentIdBarcode
              startColor={theme.start}
              endColor={theme.end}
              uniqueId={dept.id}
            />
          </div>
          <div className="team-card__serial-row">
            <span className="team-card__serial-label">CREDENTIAL ID</span>
            <code className="team-card__serial-code">{serialId}</code>
          </div>
        </div>
      </CometCard>
    </div>
  );
}

// ─── Main TeamCinematic Redesign Component ───────────────────────────────────
export function TeamCinematic({ onCompleteAll }: TeamCinematicProps) {
  const [activeDeptIdx, setActiveDeptIdx] = useState(0);
  const [activeMemberIdx, setActiveMemberIdx] = useState(0);
  const [memberFloat, setMemberFloat] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const deptNavRef = useRef<HTMLElement>(null);
  const tickingRef = useRef(false);

  // Calculate cumulative scroll segments across all 9 departments
  const scrollSegments = useMemo(() => {
    // Each member receives ~65vh, plus ~35vh transition headroom per department
    const segments = DEPARTMENTS.map((dept) => {
      const memberCount = dept.members.length;
      const vh = Math.max(2, memberCount) * 65 + 35;
      return { id: dept.id, memberCount, vh };
    });

    const totalVh = segments.reduce((sum, s) => sum + s.vh, 0);

    let cumulativeP = 0;
    const mapped = segments.map((s, idx) => {
      const startP = cumulativeP;
      const portion = s.vh / totalVh;
      const endP = idx === segments.length - 1 ? 1.0 : startP + portion;
      cumulativeP = endP;
      return {
        ...s,
        index: idx,
        startP,
        endP,
        rangeP: endP - startP,
      };
    });

    return { mapped, totalVh };
  }, []);

  const currentDept = DEPARTMENTS[activeDeptIdx] || DEPARTMENTS[0];
  const currentTheme = useMemo(
    () => currentDept.theme || getDepartmentTheme(currentDept.id),
    [currentDept]
  );
  const members = currentDept.members;
  const currentMember = members[activeMemberIdx] || members[0];

  // Smooth scroll to a specific member or department across global progress
  const scrollToMemberGlobal = useCallback(
    (deptIdx: number, memberIdx: number) => {
      if (!containerRef.current) return;
      const seg = scrollSegments.mapped[deptIdx];
      if (!seg) return;

      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = scrollY + rect.top;

      const localFraction = seg.memberCount > 1 ? memberIdx / (seg.memberCount - 1) : 0;
      const targetP = seg.startP + localFraction * seg.rangeP;
      const targetY = containerTop + targetP * totalScrollable;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    },
    [scrollSegments]
  );

  // Switch department cleanly by scrolling directly to its segment start
  const selectDepartment = useCallback(
    (deptIdx: number) => {
      if (!containerRef.current) return;
      const seg = scrollSegments.mapped[deptIdx];
      if (!seg) return;

      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = scrollY + rect.top;

      const targetP = seg.startP + 0.001;
      const targetY = containerTop + targetP * totalScrollable;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    },
    [scrollSegments]
  );

  // Step to previous / next member with accessible buttons
  const handlePrevMember = useCallback(() => {
    if (activeMemberIdx > 0) {
      scrollToMemberGlobal(activeDeptIdx, activeMemberIdx - 1);
    } else if (activeDeptIdx > 0) {
      const prevDept = activeDeptIdx - 1;
      const lastMemberIdx = DEPARTMENTS[prevDept].members.length - 1;
      scrollToMemberGlobal(prevDept, lastMemberIdx);
    }
  }, [activeMemberIdx, activeDeptIdx, scrollToMemberGlobal]);

  const handleNextMember = useCallback(() => {
    const currentDeptMembers = DEPARTMENTS[activeDeptIdx].members;
    if (activeMemberIdx < currentDeptMembers.length - 1) {
      scrollToMemberGlobal(activeDeptIdx, activeMemberIdx + 1);
    } else if (activeDeptIdx < DEPARTMENTS.length - 1) {
      scrollToMemberGlobal(activeDeptIdx + 1, 0);
    }
  }, [activeMemberIdx, activeDeptIdx, scrollToMemberGlobal]);

  // ─── Single Authoritative Continuous Scroll-Linked Engine ─────────────────
  useEffect(() => {
    const updateScrollProgress = () => {
      if (!containerRef.current || !stickyRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Normalized progress (0 to 1) through the pinned sequence
      const rawP = -rect.top / totalScrollable;
      const p = Math.max(0, Math.min(1, rawP));

      // 1. Identify which department is active based on global progress
      let resolvedDeptIdx = scrollSegments.mapped.findIndex(
        (seg) => p >= seg.startP && p < seg.endP
      );
      if (resolvedDeptIdx === -1) {
        resolvedDeptIdx = p >= 1 ? DEPARTMENTS.length - 1 : 0;
      }

      const seg = scrollSegments.mapped[resolvedDeptIdx];
      const localP =
        seg.rangeP > 0 ? Math.max(0, Math.min(1, (p - seg.startP) / seg.rangeP)) : 0;
      const memberCount = seg.memberCount;

      // 2. Continuous float coordinate within the active department's card deck
      const curFloat = memberCount > 1 ? localP * (memberCount - 1) : 0;
      const nearestIdx = Math.min(memberCount - 1, Math.max(0, Math.round(curFloat)));

      setActiveDeptIdx(resolvedDeptIdx);
      setMemberFloat(curFloat);
      setActiveMemberIdx(nearestIdx);

      // Synchronize with global background particles
      teamStore.update(resolvedDeptIdx, localP);

      if (p >= 0.99 && onCompleteAll) {
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
  }, [scrollSegments, onCompleteAll]);

  // Keep active department pill smoothly centered in horizontal nav
  useEffect(() => {
    if (!deptNavRef.current) return;
    const activeBtn = deptNavRef.current.querySelector<HTMLElement>('.team-dept-pill.is-active');
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeDeptIdx]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      )
        return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 200) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          handleNextMember();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
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

  const trackTotalHeight = scrollSegments.totalVh + 100;

  return (
    <section
      className="team-showcase-track"
      ref={containerRef}
      style={
        {
          height: `${trackTotalHeight}vh`,
          '--dept-accent-start': currentTheme.start,
          '--dept-accent-end': currentTheme.end,
          '--dept-glow': currentTheme.glow,
          '--dept-gradient': currentTheme.gradient,
        } as React.CSSProperties
      }
      id="team"
      aria-label="HackWithIndia Team Showcase"
    >
      <div className="team-showcase-sticky" ref={stickyRef}>
        {/* ─── Top Header: Compact Department Selector Bar ────────────────── */}
        <header className="team-showcase-header">
          <div className="team-header-identity">
            <div className="team-header-kicker">
              <span className="team-header-dot" />
              <span>HWI 2026–27 // CHAPTER ROSTER</span>
            </div>
            <span className="team-header-divider" aria-hidden="true" />
            <span className="team-header-tagline">{currentDept.tagline}</span>
          </div>

          {/* Understated Department Selection Pills */}
          <nav
            className="team-dept-nav"
            ref={deptNavRef}
            role="tablist"
            aria-label="Select Team Department"
          >
            {DEPARTMENTS.map((dept, dIdx) => {
              const isActive = dIdx === activeDeptIdx;
              const deptTheme = dept.theme || getDepartmentTheme(dept.id);
              return (
                <button
                  key={dept.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`team-dept-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => selectDepartment(dIdx)}
                  style={
                    isActive
                      ? ({
                          '--pill-accent-start': deptTheme.start,
                          '--pill-accent-end': deptTheme.end,
                          '--pill-glow': deptTheme.glow,
                        } as React.CSSProperties)
                      : undefined
                  }
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
              <h1 className="team-info__name">
                {currentMember.name}
              </h1>

              {/* Role Title */}
              <div className="team-info__role-wrap">
                <span className="team-info__role-pill">{currentMember.role}</span>
                {currentMember.academicYear && currentMember.branch && (
                  <span className="team-info__academic-pill">
                    {currentMember.academicYear} • {currentMember.branch}
                  </span>
                )}
              </div>

              {/* Concise Description / Responsibilities */}
              <p className="team-info__bio">
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
                    key={`${currentDept.id}-${m.id}`}
                    member={m}
                    dept={currentDept}
                    theme={currentTheme}
                    index={idx}
                    total={members.length}
                    diff={diff}
                    prefersReduced={prefersReduced}
                    onSelect={() => scrollToMemberGlobal(activeDeptIdx, idx)}
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
              {activeMemberIdx === members.length - 1 &&
              activeDeptIdx === DEPARTMENTS.length - 1
                ? 'CONTINUE SCROLLING FOR CHAPTER FOOTER'
                : 'SCROLL TO ADVANCE MEMBER CREDENTIALS & DEPARTMENTS'}
            </span>
          </div>

          {/* Secondary Department Quick Indicator */}
          <div className="team-footer__dept-jump">
            <span className="team-footer__dept-label">
              DEPARTMENT {String(activeDeptIdx + 1).padStart(2, '0')}/09:
            </span>
            <span className="team-footer__dept-name">{currentDept.name}</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
