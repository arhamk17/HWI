'use client';

import React, { useEffect, useRef } from 'react';
import './AboutCubeGrid.css';

/**
 * Deterministic pseudo-random value for a grid coordinate.
 * Returns a float between 0 and 1.
 */
function hashCoord(c: number, r: number): number {
  const h = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

interface AccentInfo {
  type: 'red' | 'cyan';
  phase: number;
}

/**
 * Returns whether a cube at (col, row) has a subtle crimson or cyan accent.
 * Density: ~4% red, ~2% cyan, remaining ~94% are refined monochrome technical lines.
 */
function getAccent(col: number, row: number): AccentInfo | null {
  const h = hashCoord(col, row);
  if (h < 0.04) {
    return { type: 'red', phase: (h * 100) % (Math.PI * 2) };
  } else if (h > 0.98) {
    return { type: 'cyan', phase: (h * 100) % (Math.PI * 2) };
  }
  return null;
}

export function AboutCubeGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number | null = null;
    let width = 0;
    let height = 0;

    // Cube isometric geometry dimensions
    // S is side length; W is full width; H is total height
    const S = 38;
    const W = S * Math.sqrt(3); // ~65.8px
    const dy = S * 1.5; // 57px
    const dx = W; // 65.8px

    // Mouse tracking for soft pointer proximity glow
    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      active: false,
    };

    // Scroll tracking for subtle depth parallax
    let scrollY = 0;
    let targetScrollY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY || window.pageYOffset || 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function drawCube(
      cx: number,
      cy: number,
      accent: AccentInfo | null,
      t: number,
      pointerGlow: number,
      waveIllumination: number
    ) {
      if (!ctx) return;
      const x0 = cx;
      const y0 = cy;

      // Isometric hexagon vertices
      const pTop = { x: cx, y: cy - S };
      const pTopRight = { x: cx + W * 0.5, y: cy - S * 0.5 };
      const pBottomRight = { x: cx + W * 0.5, y: cy + S * 0.5 };
      const pBottom = { x: cx, y: cy + S };
      const pBottomLeft = { x: cx - W * 0.5, y: cy + S * 0.5 };
      const pTopLeft = { x: cx - W * 0.5, y: cy - S * 0.5 };

      // Base line styling: visible, crisp, restrained
      const baseAlpha = 0.075 + waveIllumination * 0.035;
      let strokeColor = `rgba(255, 255, 255, ${baseAlpha})`;
      let lineWidth = 0.7;
      let topFill = `rgba(255, 255, 255, ${0.012 + waveIllumination * 0.015})`;
      let leftFill = 'rgba(0, 0, 0, 0.22)';
      let rightFill = 'rgba(0, 0, 0, 0.40)';

      // Accent highlights (restrained crimson or cyan with slow breathing pulse)
      if (accent) {
        const pulse = Math.sin(t * 0.75 + accent.phase) * 0.5 + 0.5;
        if (accent.type === 'red') {
          strokeColor = `rgba(239, 68, 68, ${0.22 + pulse * 0.25})`;
          topFill = `rgba(239, 68, 68, ${0.05 + pulse * 0.07})`;
          lineWidth = 0.9;
        } else if (accent.type === 'cyan') {
          strokeColor = `rgba(0, 240, 255, ${0.18 + pulse * 0.22})`;
          topFill = `rgba(0, 240, 255, ${0.04 + pulse * 0.06})`;
          lineWidth = 0.9;
        }
      }

      // Localized pointer proximity illumination
      if (pointerGlow > 0.01) {
        strokeColor = `rgba(239, 68, 68, ${0.1 + pointerGlow * 0.38})`;
        topFill = `rgba(239, 68, 68, ${0.03 + pointerGlow * 0.1})`;
        lineWidth = 0.8 + pointerGlow * 0.5;
      }

      ctx.lineWidth = lineWidth;

      // 1. Top Face
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(pTopRight.x, pTopRight.y);
      ctx.lineTo(x0, y0);
      ctx.lineTo(pTopLeft.x, pTopLeft.y);
      ctx.closePath();
      ctx.fillStyle = topFill;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.stroke();

      // 2. Left Face
      ctx.beginPath();
      ctx.moveTo(pTopLeft.x, pTopLeft.y);
      ctx.lineTo(x0, y0);
      ctx.lineTo(pBottom.x, pBottom.y);
      ctx.lineTo(pBottomLeft.x, pBottomLeft.y);
      ctx.closePath();
      ctx.fillStyle = leftFill;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.stroke();

      // 3. Right Face
      ctx.beginPath();
      ctx.moveTo(pTopRight.x, pTopRight.y);
      ctx.lineTo(x0, y0);
      ctx.lineTo(pBottom.x, pBottom.y);
      ctx.lineTo(pBottomRight.x, pBottomRight.y);
      ctx.closePath();
      ctx.fillStyle = rightFill;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }

    function renderFrame(time: number, isReducedMotion = false) {
      if (!ctx) return;

      // Smooth pointer & scroll interpolation
      if (!isReducedMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
        scrollY += (targetScrollY - scrollY) * 0.08;
      } else {
        mouse.x = -2000;
        mouse.y = -2000;
        scrollY = 0;
      }

      ctx.clearRect(0, 0, width, height);

      // Deep cinematic base: black to charcoal
      const bgGrad = ctx.createRadialGradient(
        width * 0.4,
        height * 0.35,
        80,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#06060a');
      bgGrad.addColorStop(0.55, '#040407');
      bgGrad.addColorStop(1, '#020204');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle parallax offset: shifts pattern slowly with scroll (wrapped by row height)
      const parallaxY = (scrollY * 0.12) % (dy * 2);
      const cols = Math.ceil(width / dx) + 2;
      const rows = Math.ceil(height / dy) + 4;
      const t = time * 0.001;

      // Render isometric cube grid
      for (let r = -2; r <= rows; r++) {
        const xOffset = Math.abs(r) % 2 === 0 ? 0 : dx * 0.5;
        for (let c = -1; c <= cols; c++) {
          const cx = c * dx + xOffset;
          const cy = r * dy - parallaxY;

          // Pointer proximity falloff
          const dist = Math.hypot(cx - mouse.x, cy - mouse.y);
          let pointerGlow = 0;
          if (mouse.active && dist < 200) {
            const ratio = 1 - dist / 200;
            pointerGlow = ratio * ratio;
          }

          // Slow ambient wave illumination traveling diagonally
          let waveIllum = 0;
          if (!isReducedMotion) {
            const wave = Math.sin(cx * 0.0025 + cy * 0.0025 - t * 0.4);
            waveIllum = Math.max(0, wave);
          }

          // Deterministic accent based on continuous world index
          const worldRow = r + Math.floor((scrollY * 0.12) / dy);
          const accent = getAccent(c, worldRow);

          drawCube(cx, cy, accent, t, pointerGlow, waveIllum);
        }
      }

      // Soft vignette for edge falloff and content legibility
      const vig = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.45,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      vig.addColorStop(0, 'rgba(4, 4, 7, 0)');
      vig.addColorStop(0.7, 'rgba(4, 4, 7, 0.25)');
      vig.addColorStop(1, 'rgba(2, 2, 4, 0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
    }

    if (mediaQuery.matches) {
      renderFrame(0, true);
    } else {
      const loop = (timestamp: number) => {
        renderFrame(timestamp, false);
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        if (animId) cancelAnimationFrame(animId);
        animId = null;
        renderFrame(0, true);
      } else {
        const loop = (timestamp: number) => {
          renderFrame(timestamp, false);
          animId = requestAnimationFrame(loop);
        };
        animId = requestAnimationFrame(loop);
      }
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <div className="about-cube-grid-container" aria-hidden="true">
      <canvas ref={canvasRef} className="about-cube-grid-canvas" />
    </div>
  );
}
