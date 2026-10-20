'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';
import { MULTILINGUAL_SCRIPTS, FINAL_BRAND_TITLE } from './multilingualData';
import { introStore, IntroPhase } from '@/lib/introStore';
import './TypographicIntro.css';

interface TypographicIntroProps {
  onComplete?: () => void;
}

export function TypographicIntro({ onComplete }: TypographicIntroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [phase, setPhase] = useState<IntroPhase>('multilingual-loader');
  const [dispScale, setDispScale] = useState(0);

  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleFinish = useCallback(() => {
    clearTimers();
    setIsDone(true);
    introStore.setComplete();
    if (onComplete) onComplete();
  }, [clearTimers, onComplete]);

    // ─── Phase 2 & 3: Reference-Matched Canvas Fluid Animation ───────────────
  const startFluidSequence = useCallback(() => {
    setPhase('fluid-transition');
    introStore.setPhase('fluid-transition');

    const canvas = canvasRef.current;
    if (!canvas) {
      handleFinish();
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      handleFinish();
      return;
    }

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const maxScreenDist = Math.hypot(width, height);

    // Multi-lobed viscous organic fluid simulation parameters
    const lobes = [
      { ox: 0, oy: 0, rMult: 1.15, phase: 0, speed: 2.2 },
      { ox: -0.24 * width, oy: -15, rMult: 0.88, phase: 1.2, speed: 2.5 },
      { ox: 0.24 * width, oy: 20, rMult: 0.85, phase: 2.4, speed: 2.1 },
      { ox: -0.12 * width, oy: 35, rMult: 0.95, phase: 3.5, speed: 2.7 },
      { ox: 0.12 * width, oy: -30, rMult: 0.92, phase: 4.8, speed: 2.3 },
      { ox: -0.40 * width, oy: 10, rMult: 0.75, phase: 0.8, speed: 2.9 },
      { ox: 0.40 * width, oy: -10, rMult: 0.72, phase: 5.2, speed: 2.4 },
    ];

    const surgeDuration = 440; // ms: organic liquid growth & text deformation
    const recedeDuration = 520; // ms: liquid blanket recedes & reveals hero
    let startTime: number | null = null;
    let subPhase: 'surge' | 'recede' = 'surge';
    let subStartTime: number | null = null;

    const render = (now: number) => {
      if (!startTime) {
        startTime = now;
        subStartTime = now;
      }

      if (subPhase === 'surge') {
        const elapsed = now - (subStartTime || now);
        const p = Math.min(elapsed / surgeDuration, 1);
        // Smooth cubic-out surge growth
        const easedP = 1 - Math.pow(1 - p, 2.5);

        // Ramp SVG displacement scale synchronously with fluid surge
        setDispScale(easedP * 65);

        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const t = (now - startTime) * 0.0035;

        // Base radius expands until it completely covers the entire screen
        const baseR = 50 + easedP * (maxScreenDist * 0.78);

        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
        ctx.shadowBlur = 20;

        // Draw multiple overlapping organic viscous lobes
        lobes.forEach((lobe, lIdx) => {
          const lcx = cx + lobe.ox * (1 - easedP * 0.5);
          const lcy = cy + lobe.oy * (1 - easedP * 0.5);
          const lr = baseR * lobe.rMult;
          const points = 28;
          const vertices: { x: number; y: number }[] = [];

          for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            let r = lr;
            // Harmonic sinusoidal fluid perimeter noise
            r += (18 + easedP * 25) * Math.sin(3 * angle + t * lobe.speed + lobe.phase);
            r += (12 + easedP * 18) * Math.cos(5 * angle - t * 2.1 + lobe.phase);
            r += (8 + easedP * 12) * Math.sin(7 * angle + t * 3.4 + lIdx);
            vertices.push({
              x: lcx + r * Math.cos(angle),
              y: lcy + r * Math.sin(angle),
            });
          }

          ctx.beginPath();
          const midX = (vertices[0].x + vertices[points - 1].x) / 2;
          const midY = (vertices[0].y + vertices[points - 1].y) / 2;
          ctx.moveTo(midX, midY);
          for (let i = 0; i < points; i++) {
            const next = vertices[(i + 1) % points];
            ctx.quadraticCurveTo(
              vertices[i].x,
              vertices[i].y,
              (vertices[i].x + next.x) / 2,
              (vertices[i].y + next.y) / 2
            );
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });

        // Viscous droplets reaching across typography during surge
        if (p < 0.85) {
          for (let k = 0; k < 6; k++) {
            const dropAngle = (k / 6) * Math.PI * 2 + t;
            const dropDist = baseR * 0.85 + 40 * Math.sin(t * 2 + k);
            const dx = cx + Math.cos(dropAngle) * dropDist;
            const dy = cy + Math.sin(dropAngle) * dropDist * 0.6;
            const dr = (8 + 5 * Math.sin(t * 3 + k)) * (1 - p);
            if (dr > 1.5) {
              ctx.beginPath();
              ctx.arc(dx, dy, dr, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
          }
        }

        ctx.restore();

        // Check if surge reached full 100% viewport coverage
        if (p >= 1) {
          // ====================================================
          // Phase 2 Covered State Hand-Off -> Phase 3
          // Viewport is 100% solid black.
          // Prepare hero underneath & transition to receding liquid blanket
          // ====================================================
          subPhase = 'recede';
          subStartTime = now;
          setPhase('hero-revealed');
          introStore.setPhase('hero-revealed');

          // Switch container background to transparent; canvas holds the solid black blanket
          if (containerRef.current) {
            containerRef.current.style.setProperty('background', 'transparent', 'important');
          }
          if (stageRef.current) {
            stageRef.current.style.display = 'none';
          }
        }

        animFrameRef.current = requestAnimationFrame(render);
      } else {
        // ====================================================
        // Phase 3: Receding Organic Liquid Blanket & Progressive Hero Reveal
        // Liquid blanket sweeps downward, revealing hero headline & video progressively
        // ====================================================
        const elapsed = now - (subStartTime || now);
        const p = Math.min(elapsed / recedeDuration, 1);
        const easedP = Math.pow(p, 1.25);

        ctx.clearRect(0, 0, width, height);

        const t = (now - startTime) * 0.0035;

        // Wave front Y position sweeps downward from above top to below bottom
        // Y goes from -120 down to (height + 250)
        const waveY = easedP * (height + 370) - 120;

        // 1. Organic fluid meniscus boundary points
        const segments = 42;
        const pts: { x: number; y: number }[] = [];
        for (let i = 0; i <= segments; i++) {
          const px = (i / segments) * width;
          const waveHarmonic =
            36 * Math.sin((px / width) * Math.PI * 3.5 + t * 2.8) +
            20 * Math.sin((px / width) * Math.PI * 7.0 - t * 3.4) +
            12 * Math.cos((px / width) * Math.PI * 11.0 + t * 4.2);
          pts.push({ x: px, y: waveY + waveHarmonic });
        }

        // 2. Fill obsidian liquid blanket from wave boundary down to bottom of screen
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(width, height);
        ctx.lineTo(width, pts[segments].y);

        for (let i = segments; i >= 0; i--) {
          const curr = pts[i];
          const prev = pts[Math.max(0, i - 1)];
          const midX = (curr.x + prev.x) / 2;
          const midY = (curr.y + prev.y) / 2;
          ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
        }

        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // 3. Stroke ONLY the fluid meniscus along the separating liquid edge
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.9)';
        ctx.shadowBlur = 22;

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 0; i < segments; i++) {
          const next = pts[i + 1];
          const midX = (pts[i].x + next.x) / 2;
          const midY = (pts[i].y + next.y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
        }
        ctx.stroke();

        // Trailing viscous droplets pulling off from the receding wave
        for (let k = 0; k < 7; k++) {
          const dropX = (0.12 + k * 0.13) * width + 22 * Math.sin(t * 1.8 + k * 2);
          const dropY = waveY - 45 - 35 * Math.sin(t * 2.4 + k);
          const dropR = 7 + 5 * Math.sin(t * 1.5 + k);
          if (dropY > -30 && dropY < height + 60) {
            ctx.beginPath();
            ctx.arc(dropX, dropY, Math.max(2, dropR), 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }

        ctx.restore();

        if (p >= 1) {
          // Liquid completely cleared off the screen
          window.removeEventListener('resize', onResize);
          handleFinish();
          return;
        }

        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);
  }, [handleFinish]);

  useEffect(() => {
    // If intro has already completed (e.g. client route navigation), never replay
    if (introStore.isComplete) {
      setIsDone(true);
      return;
    }

    // Accessible reduced motion: skip rapid sequence, show clean brief branding then finish
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const reducedTimer = setTimeout(() => {
        handleFinish();
      }, 350);
      return () => clearTimeout(reducedTimer);
    }

    if (!containerRef.current) return;
    const container = containerRef.current;
    const slideEls = Array.from(container.querySelectorAll<HTMLElement>('.intro__slide'));
    const finalEl = container.querySelector<HTMLElement>('.intro__final');

    if (!slideEls.length || !finalEl) {
      handleFinish();
      return;
    }

    // Set initial animation states
    anime.set(slideEls, { opacity: 0, translateY: 22 });
    anime.set(finalEl, { opacity: 0, translateY: 24, scale: 0.96 });

    const tl = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        // Timeline completed: final title display hold finished -> trigger Phase 2 Fluid Distortion
        startFluidSequence();
      },
    });

    // Phase 1: Sequence through Indian writing systems (~210ms cadence per script)
    slideEls.forEach((slide, idx) => {
      tl.add(
        {
          targets: slide,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 115,
          easing: 'easeOutCubic',
        },
        idx === 0 ? 0 : '-=35'
      ).add(
        {
          targets: slide,
          opacity: [1, 0],
          translateY: [0, -20],
          duration: 90,
          easing: 'easeInCubic',
        },
        '+=70'
      );
    });

    // Grand Finale — Final bold English title enters with prominence
    tl.add(
      {
        targets: finalEl,
        opacity: [0, 1],
        translateY: [24, 0],
        scale: [0.96, 1.0],
        duration: 260,
        easing: 'easeOutExpo',
      },
      '+=30'
    )
      // Hold final title prominently before launching the fluid-distortion reveal
      .add({
        duration: 360,
      });

    // Robust safety fallback timer (never leave page stuck)
    safetyTimerRef.current = setTimeout(handleFinish, 7500);

    return () => {
      clearTimers();
      tl.pause();
    };
  }, [clearTimers, handleFinish, startFluidSequence]);

  if (isDone) return null;

  const isDistorted = phase === 'fluid-transition' && dispScale > 0.5;

  return (
    <section
      className="intro"
      ref={containerRef}
      aria-label="Loading sequence"
    >
      <h1 className="sr-only">Hack With India</h1>

      {/* Embedded SVG filter definitions for fluid displacement mapping */}
      <svg className="intro-fluid-svg-defs" aria-hidden="true">
        <filter
          id="hwi-intro-fluid-filter"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.045"
            numOctaves="3"
            seed="77"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={dispScale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>
      </svg>

      {/* Phase 2 & 3: Reference-matched Organic Fluid Canvas */}
      <canvas ref={canvasRef} className="intro-fluid-canvas" aria-hidden="true" />

      <div className="intro__stage" ref={stageRef} aria-hidden="true">
        {/* Multilingual typography slides — sole focus on the phrase, zero labels/badges */}
        <div className="intro__slides-container">
          {MULTILINGUAL_SCRIPTS.map((script, idx) => (
            <div key={script.id} className={`intro__slide intro__slide--${idx}`}>
              <div
                className="intro__phrase"
                dir={script.dir || 'ltr'}
                style={{
                  fontFamily: script.fontFamily || undefined,
                  letterSpacing: script.letterSpacing || undefined,
                }}
              >
                {script.text}
              </div>
            </div>
          ))}
        </div>

        {/* Final English Brand Title (Receives Fluid Distortion in Phase 2) */}
        <div
          className="intro__final"
          style={{
            filter: isDistorted ? 'url(#hwi-intro-fluid-filter)' : 'none',
          }}
        >
          <div className="intro__final-title">
            {FINAL_BRAND_TITLE.text}
          </div>
        </div>
      </div>
    </section>
  );
}
