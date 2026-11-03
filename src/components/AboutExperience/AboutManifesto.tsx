'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Rocket, Users, Code2, Flame } from 'lucide-react';

interface ManifestoItem {
  id: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  focus: string;
  color: string;
  glow: string;
  icon: React.ReactNode;
}

const MANIFESTO_ITEMS: ManifestoItem[] = [
  {
    id: 'shipping',
    num: '01',
    tag: 'CORE PILLAR',
    title: 'SHIPPING OVER SPECULATION',
    desc: 'Working software beats theoretical whiteboard diagrams every time. We measure engineering velocity in functioning applications, deployed smart contracts, and real user validation.',
    focus: 'Focus: Production deployment and working prototypes',
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.35)',
    icon: <Rocket className="w-4 h-4" />,
  },
  {
    id: 'collaboration',
    num: '02',
    tag: 'FOUNDATIONAL PRINCIPLE',
    title: 'RADICAL COLLABORATION',
    desc: 'The lone hacker is a myth. High-impact software requires cross-functional synergy between systems architects, UI designers, and team leads shipping under tight constraints.',
    focus: 'Focus: Multidisciplinary teams building end-to-end',
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.35)',
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: 'open-source',
    num: '03',
    tag: 'COMMUNITY VALUE',
    title: 'BUILD IN THE OPEN',
    desc: 'Open source is our foundation. From our internal tooling and curriculum to hackathon starter kits, resources built by the chapter are contributed directly back to the student developer community.',
    focus: 'Focus: Public repositories, open tooling, and shared kits',
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.35)',
    icon: <Code2 className="w-4 h-4" />,
  },
  {
    id: 'sprinting',
    num: '04',
    tag: 'CULTURE & FOCUS',
    title: 'RELENTLESS SPRINTING',
    desc: 'Hackathons are engineering crucibles, not casual mixers. Focused pressure, tight deadlines, and dedicated effort forge developers who know how to ship without excuses.',
    focus: 'Focus: 24-to-36-hour nonstop buildathon execution',
    color: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.35)',
    icon: <Flame className="w-4 h-4" />,
  },
];

interface StackedPrincipleCardProps {
  item: ManifestoItem;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}

function StackedPrincipleCard({
  item,
  index,
  isActive,
  onActivate,
}: StackedPrincipleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0, tiltX: 0, tiltY: 0 });
  const rafRef = useRef<number | null>(null);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    if (typeof window !== 'undefined') {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) return;
    }

    setIsMoving(true);
    if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    moveTimeoutRef.current = setTimeout(() => {
      setIsMoving(false);
    }, 120);

    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setMouseOffset({
        x: relX * 10,
        y: relY * 6,
        tiltX: -relY * 4.5,
        tiltY: relX * 4.5,
      });
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    setIsHovered(false);
    setIsMoving(false);
    setMouseOffset({ x: 0, y: 0, tiltX: 0, tiltY: 0 });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, []);

  // When hovered or active: lift upward (-24px), dynamic 1deg rotation, softened skew (-2deg), and cursor tracking.
  // When resting: returns to base stacked transform defined by CSS (.about-manifesto__card--[index]).
  const activeTransform = isHovered || isActive
    ? `perspective(1000px) skewY(-2deg) rotate(1deg) rotateX(${mouseOffset.tiltX.toFixed(2)}deg) rotateY(${mouseOffset.tiltY.toFixed(2)}deg) translate3d(${mouseOffset.x.toFixed(1)}px, ${(-24 + mouseOffset.y).toFixed(1)}px, 20px) scale(1.035)`
    : undefined;

  return (
    <div
      ref={cardRef}
      className={`about-manifesto__card about-manifesto__card--${index} ${isMoving ? 'is-moving' : ''} ${isActive ? 'is-active' : ''}`}
      style={
        {
          '--card-accent': item.color,
          '--card-border-glow': item.glow,
          '--card-ambient-glow': item.glow,
          transform: activeTransform,
        } as React.CSSProperties
      }
      onMouseEnter={handlePointerEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onClick={onActivate}
      tabIndex={0}
      role="region"
      aria-label={`${item.title} - ${item.tag}`}
    >
      <div className="about-manifesto__card-content">
        <div>
          <div className="about-manifesto__card-header">
            <div className="about-manifesto__header-left">
              <span className="about-manifesto__num">{item.num}</span>
              <span className="about-manifesto__tag">{item.tag}</span>
            </div>
            <span
              className="about-manifesto__icon-badge"
              style={{
                backgroundColor: `${item.color}18`,
                borderColor: `${item.color}40`,
                color: item.color,
              }}
            >
              {item.icon}
            </span>
          </div>

          <h3 className="about-manifesto__card-title">
            {item.title}
          </h3>

          <p className="about-manifesto__card-desc">
            {item.desc}
          </p>
        </div>

        <div className="about-manifesto__focus-note">
          <span>{item.focus}</span>
        </div>
      </div>
    </div>
  );
}

export function AboutManifesto() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="about-section" id="manifesto">
      <div className="about-container">
        <div className="about-manifesto__header about-reveal">
          <div className="about-section-eyebrow">
            02 // CORE PRINCIPLES
          </div>
          <h2 className="about-manifesto__title">
            THE HWI MANIFESTO
          </h2>
          <p className="type-body text-secondary" style={{ marginTop: '16px' }}>
            Four uncompromising principles that govern our chapter&apos;s hackathons, technical bootcamps, and developer community.
          </p>
        </div>

        <div className="about-manifesto__grid about-reveal">
          {MANIFESTO_ITEMS.map((item, index) => (
            <div key={item.id} className="about-manifesto__card-container">
              <StackedPrincipleCard
                item={item}
                index={index}
                isActive={activeIndex === index}
                onActivate={() => setActiveIndex(activeIndex === index ? null : index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
