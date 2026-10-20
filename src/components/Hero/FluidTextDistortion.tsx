'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './FluidTextDistortion.css';

interface FluidTextDistortionProps {
  className?: string;
}

interface SatelliteDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetLag: number;
  angleOffset: number;
}

export function FluidTextDistortion({ className = '' }: FluidTextDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction tracking state
  const isPointerInsideRef = useRef(false);
  const hasEverMovedRef = useRef(false);

  // Physics simulation references (stored in refs for zero-overhead 60fps RAF loop)
  const posRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    angle: 0,
  });

  const filterScaleRef = useRef(0);
  const opacityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [filterActive, setFilterActive] = useState(false);
  const [filterScale, setFilterScale] = useState(0);

  // Array of trailing fluid tendrils / droplets
  const dropletsRef = useRef<SatelliteDroplet[]>([
    { x: 0, y: 0, vx: 0, vy: 0, radius: 18, targetLag: 0.28, angleOffset: -0.4 },
    { x: 0, y: 0, vx: 0, vy: 0, radius: 14, targetLag: 0.20, angleOffset: 0.5 },
    { x: 0, y: 0, vx: 0, vy: 0, radius: 11, targetLag: 0.14, angleOffset: -0.7 },
    { x: 0, y: 0, vx: 0, vy: 0, radius: 8,  targetLag: 0.09, angleOffset: 0.8 },
  ]);

  // Clean-up loop on unmount
  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Synchronize canvas size to container dimensions with DPR support
    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      // Add generous 60px padding on all sides so fluid tendrils do not clip
      const padding = 60;
      width = rect.width + padding * 2;
      height = rect.height + padding * 2;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.left = `-${padding}px`;
      canvas.style.top = `-${padding}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // ── Simulation and Render Loop ───────────────────────────────────────────
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min(32, timestamp - lastTimeRef.current);
      lastTimeRef.current = timestamp;
      const t = timestamp * 0.001;

      const p = posRef.current;
      const isInside = isPointerInsideRef.current;

      // Smooth trailing follower physics
      const followFactor = 0.22;
      p.x += (p.targetX - p.x) * followFactor;
      p.y += (p.targetY - p.y) * followFactor;

      // Velocity decay and speed calculation
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const instantSpeed = Math.sqrt(dx * dx + dy * dy);
      p.speed += (instantSpeed - p.speed) * 0.18;

      if (p.speed > 0.5) {
        p.angle = Math.atan2(dy, dx);
      }

      // Smooth opacity ramp: fades in on hover, gently dissipates on exit
      const targetOpacity = isInside ? 1 : 0;
      opacityRef.current += (targetOpacity - opacityRef.current) * (isInside ? 0.2 : 0.08);

      // Dynamic SVG displacement scale based on speed & presence
      const targetScale = isInside ? Math.min(32, 8 + p.speed * 0.8) : 0;
      filterScaleRef.current += (targetScale - filterScaleRef.current) * 0.15;

      if (filterScaleRef.current > 0.5 && !filterActive) {
        setFilterActive(true);
      } else if (filterScaleRef.current <= 0.5 && filterActive) {
        setFilterActive(false);
      }
      setFilterScale(filterScaleRef.current);

      // Render fluid frame on canvas
      ctx.clearRect(0, 0, width, height);

      const alpha = opacityRef.current;

      if (alpha > 0.01 && hasEverMovedRef.current) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

        // Offset coordinates into the padded canvas space (padding = 60)
        const cx = p.x + 60;
        const cy = p.y + 60;
        const baseRadius = Math.max(28, Math.min(75, 48 + p.speed * 0.9));

        // ── 1. Update Trailing Droplets & Tendrils ────────────────────────────
        const droplets = dropletsRef.current;
        droplets.forEach((drop, idx) => {
          // Droplets lag behind the pointer, stretching outward along opposite velocity angle
          const lagSpeed = drop.targetLag;
          const pullAngle = p.angle + Math.PI + drop.angleOffset;
          const stretchDist = Math.min(65, p.speed * (1.6 + idx * 0.5));

          const targetDropX = cx + Math.cos(pullAngle) * stretchDist;
          const targetDropY = cy + Math.sin(pullAngle) * stretchDist;

          drop.x += (targetDropX - drop.x) * lagSpeed;
          drop.y += (targetDropY - drop.y) * lagSpeed;
        });

        // ── 2. Construct Main Organic Fluid Polygon ──────────────────────────
        const numPoints = 28;
        const vertices: { x: number; y: number }[] = [];

        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          let r = baseRadius;

          // Velocity elongation along direction of movement
          const elongation = Math.min(p.speed * 0.65, baseRadius * 0.55);
          r += elongation * Math.cos(2 * (angle - p.angle));

          // Multi-harmonic organic ripples (amoeboid surface tension waves)
          r += 10 * Math.sin(2 * angle + t * 2.8);
          r += 7 * Math.sin(3 * angle - t * 2.2);
          r += 4 * Math.cos(5 * angle + t * 3.6);

          vertices.push({
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle),
          });
        }

        // Draw smooth closed Bézier curve through harmonic vertices
        ctx.beginPath();
        const firstMidX = (vertices[0].x + vertices[numPoints - 1].x) / 2;
        const firstMidY = (vertices[0].y + vertices[numPoints - 1].y) / 2;
        ctx.moveTo(firstMidX, firstMidY);

        for (let i = 0; i < numPoints; i++) {
          const next = vertices[(i + 1) % numPoints];
          const midX = (vertices[i].x + next.x) / 2;
          const midY = (vertices[i].y + next.y) / 2;
          ctx.quadraticCurveTo(vertices[i].x, vertices[i].y, midX, midY);
        }
        ctx.closePath();

        // ── 3. Fill with Viscous Obsidian Ink Core ───────────────────────────
        const inkGrad = ctx.createRadialGradient(cx - 15, cy - 15, 8, cx, cy, baseRadius + 30);
        inkGrad.addColorStop(0, 'rgba(22, 16, 26, 0.98)');
        inkGrad.addColorStop(0.65, 'rgba(12, 9, 16, 0.96)');
        inkGrad.addColorStop(1, 'rgba(7, 5, 10, 0.98)');
        ctx.fillStyle = inkGrad;

        // Glowing HWI red meniscus perimeter
        ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
        ctx.shadowBlur = 22;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.8;

        ctx.fill();
        ctx.stroke();

        // Inner razor-sharp specular reflection rim
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 120, 120, 0.35)';
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // ── 4. Render Trailing Satellite Droplets & Ink Splashes ─────────────
        droplets.forEach((drop) => {
          const dropR = Math.max(4, drop.radius * (1 - p.speed * 0.015));

          ctx.beginPath();
          ctx.arc(drop.x, drop.y, dropR, 0, Math.PI * 2);
          ctx.shadowColor = 'rgba(239, 68, 68, 0.75)';
          ctx.shadowBlur = 14;
          ctx.fillStyle = 'rgba(10, 7, 13, 0.96)';
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Connective fluid tendril bridge to main body when close
          const distToCenter = Math.hypot(drop.x - cx, drop.y - cy);
          if (distToCenter < baseRadius + dropR + 32) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(drop.x, drop.y);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
            ctx.lineWidth = Math.max(1.5, 6 - distToCenter * 0.06);
            ctx.stroke();
          }
        });

        // ── 5. Fluid Specular Surface Sheen ──────────────────────────────────
        ctx.beginPath();
        ctx.arc(cx - baseRadius * 0.3, cy - baseRadius * 0.3, baseRadius * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fill();

        ctx.restore();
      }

      // Continue loop if still hovering or fading out
      if (isInside || opacityRef.current > 0.005) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        stopLoop();
      }
    };

    // Helper to start the loop on demand
    const startLoopIfNeeded = () => {
      if (!rafRef.current) {
        lastTimeRef.current = 0;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    // ── Pointer Event Handlers ───────────────────────────────────────────────
    const handlePointerEnter = (e: PointerEvent) => {
      isPointerInsideRef.current = true;
      hasEverMovedRef.current = true;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      posRef.current.targetX = x;
      posRef.current.targetY = y;
      posRef.current.x = x;
      posRef.current.y = y;

      // Initialize droplets around pointer
      dropletsRef.current.forEach((d) => {
        d.x = x + 60;
        d.y = y + 60;
      });

      startLoopIfNeeded();
    };

    const handlePointerMove = (e: PointerEvent) => {
      isPointerInsideRef.current = true;
      hasEverMovedRef.current = true;
      const rect = container.getBoundingClientRect();
      posRef.current.targetX = e.clientX - rect.left;
      posRef.current.targetY = e.clientY - rect.top;
      startLoopIfNeeded();
    };

    const handlePointerLeave = () => {
      isPointerInsideRef.current = false;
      startLoopIfNeeded();
    };

    // Touch fallback: brief interactive ripple without interrupting scroll
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        isPointerInsideRef.current = true;
        hasEverMovedRef.current = true;
        posRef.current.targetX = x;
        posRef.current.targetY = y;
        posRef.current.x = x;
        posRef.current.y = y;
        posRef.current.speed = 12;

        dropletsRef.current.forEach((d) => {
          d.x = x + 60;
          d.y = y + 60;
        });

        startLoopIfNeeded();

        // Automatically dissipate after 550ms
        setTimeout(() => {
          isPointerInsideRef.current = false;
          startLoopIfNeeded();
        }, 550);
      }
    };

    container.addEventListener('pointerenter', handlePointerEnter);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      stopLoop();
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('touchstart', handleTouchStart);
    };
  }, [stopLoop, filterActive]);

  return (
    <div className={`fluid-text-container ${className}`} ref={containerRef}>
      {/* Primary Semantic Typography with Cursor-Driven Fluid Warping */}
      <h1
        className="fluid-text-title type-intro"
        style={{
          filter: filterActive ? 'url(#hwi-cursor-fluid-filter)' : 'none',
          textShadow: '0 4px 28px rgba(0, 0, 0, 0.85), 0 1px 3px rgba(0, 0, 0, 0.95)',
        }}
        data-cursor="text"
      >
        HACK WITH<br />INDIA
      </h1>

      {/* Viscous Ink Fluid Canvas Overlay */}
      <canvas ref={canvasRef} className="fluid-text-canvas" aria-hidden="true" />

      {/* Embedded SVG Filter for Organic Fluid Warping */}
      <svg className="fluid-text-svg-defs" aria-hidden="true">
        <defs>
          <filter
            id="hwi-cursor-fluid-filter"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.016 0.038"
              numOctaves="3"
              seed="55"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={filterScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
