'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { scrollBus } from '@/lib/scrollBus';
import { teamStore } from '@/lib/teamStore';
import { globeStore } from '@/lib/globeStore';
import { indiaStore } from '@/lib/indiaStore';
import { whatWeDoStore } from '@/lib/whatWeDoStore';
import { easterEggStore } from '@/lib/easterEggStore';
import { HWI_INDIA_LOCATIONS, HWI_NETWORK_LINKS } from '@/data/indiaLocations';
import {
  ParticleSOA,
  createParticleSOA,
  initInitialStates,
  populateHwiTextState,
  populateIndiaState,
  populateWhiteSectionState,
  populateBonsaiTreeState,
  populateTeamState,
} from '@/lib/cinematicParticles';
import './GlobalBackground.css';

// =============================================
// QUALITY & PERFORMANCE CONFIGURATION
// Rich particle density with adaptive scaling
// =============================================
const QUALITY_CONFIG = {
  high: { particleCount: 3664, glow: true },
  medium: { particleCount: 2600, glow: false },
  low: { particleCount: 1400, glow: false },
};

function detectQuality(): keyof typeof QUALITY_CONFIG {
  if (typeof window === 'undefined') return 'medium';
  const w = window.innerWidth;
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  if (w < 768 || cores < 4 || /Mobi|Android/i.test(navigator.userAgent)) return 'low';
  if (w >= 1440 && cores >= 8) return 'high';
  return 'medium';
}

export function GlobalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseLayerRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const teamContainerRef = useRef<HTMLDivElement>(null);
  const teamLayersRef = useRef<(HTMLDivElement | null)[]>([]);

  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Ensure instant seamless autoplay of background video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const quality = detectQuality();
    const config = QUALITY_CONFIG[quality];
    const N = config.particleCount;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, quality === 'low' ? 1 : 1.5);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);
        recalcSectionOffsets();
        if (targetsReady) {
          populateHwiTextState(soa, width, height);
          populateIndiaState(soa);
          populateWhiteSectionState(soa, width, height);
          populateBonsaiTreeState(soa, width, height);
          populateTeamState(soa, width, height);
        }
      }, 150);
    };
    window.addEventListener('resize', onResize);

    // ========================================================
    // 1. FAST INITIALIZATION (Zero Initial Stutter)
    // Instant initial math setup in < 0.5ms — DOM paints immediately
    // ========================================================
    const soa: ParticleSOA = createParticleSOA(N);
    initInitialStates(soa, width, height);

    // Progressive target state generation deferred to idle time
    let targetsReady = false;
    const initDeferredTargets = () => {
      populateHwiTextState(soa, width, height);
      populateIndiaState(soa);
      populateWhiteSectionState(soa, width, height);
      populateBonsaiTreeState(soa, width, height);
      populateTeamState(soa, width, height);
      targetsReady = true;
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(initDeferredTargets);
    } else {
      setTimeout(initDeferredTargets, 60);
    }

    // ========================================================
    // 2. CACHED SECTION OFFSETS (Eliminates layout thrashing)
    // ========================================================
    let cachedOffsets = {
      aboutTop: 0,
      aboutHeight: 0,
      offerTop: 0,
      offerHeight: 0,
      impactTop: 0,
      impactHeight: 0,
      teamTop: 0,
      teamHeight: 0,
      docHeight: 1,
    };

    const recalcSectionOffsets = () => {
      const aboutEl = document.getElementById('about');
      const offerEl = document.getElementById('offer');
      const impactEl = document.getElementById('impact');
      const teamEl = document.getElementById('team');
      const doc = document.documentElement;
      const vh = window.innerHeight;

      cachedOffsets = {
        aboutTop: aboutEl ? aboutEl.offsetTop : vh,
        aboutHeight: aboutEl ? aboutEl.offsetHeight : vh * 2.4,
        offerTop: offerEl ? offerEl.offsetTop : vh * 3.4,
        offerHeight: offerEl ? offerEl.offsetHeight : vh * 2.5,
        impactTop: impactEl ? impactEl.offsetTop : (offerEl ? offerEl.offsetTop + offerEl.offsetHeight : vh * 5.9),
        impactHeight: impactEl ? impactEl.offsetHeight : vh * 1.5,
        teamTop: teamEl ? teamEl.offsetTop : vh * 7.4,
        teamHeight: teamEl ? teamEl.offsetHeight : vh * 3.2,
        docHeight: Math.max(1, doc.scrollHeight - vh),
      };
    };

    setTimeout(recalcSectionOffsets, 60);
    setTimeout(recalcSectionOffsets, 300);
    setTimeout(recalcSectionOffsets, 1200);

    // ========================================================
    // 3. TEAM ATMOSPHERE STORE SUBSCRIPTION (5 Clean Atmospheres)
    // ========================================================
    const unsubscribeTeam = teamStore.subscribe((activeTeam, progress) => {
      if (!teamContainerRef.current) return;
      const p = Math.max(0, Math.min(3, progress * 3));
      const activeIdx = Math.min(2, Math.floor(p));
      const fraction = p - activeIdx;

      teamLayersRef.current.forEach((layer, idx) => {
        if (!layer) return;
        if (idx === activeIdx) {
          layer.style.opacity = (1 - fraction).toFixed(3);
        } else if (idx === activeIdx + 1) {
          layer.style.opacity = fraction.toFixed(3);
        } else {
          layer.style.opacity = '0';
        }
      });
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Proximity mouse tracking (Feature 12)
    let mouseX = -9999;
    let mouseY = -9999;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Dynamic environment subscription (Feature 3)
    let currentEnvMode = 'normal';
    const unsubscribeWhatWeDo = whatWeDoStore.subscribe((mode) => {
      currentEnvMode = mode;
    });

    // Easter egg subscription (Feature 7)
    let isEasterEggActive = false;
    const unsubscribeEasterEgg = easterEggStore.subscribe((active) => {
      isEasterEggActive = active;
    });

    // Simulation states
    let time = 0;
    let rafId = 0;
    let smoothScrollY = 0;
    let currentOfferBright = 0;

    if (canvasRef.current) {
      canvasRef.current.style.opacity = '1';
    }

    // ========================================================
    // 3.5 FALLING LEAF POOL (Subtle organic red leaf detachment)
    // ========================================================
    interface FallingLeaf {
      active: boolean;
      x: number;
      y: number;
      vx: number;
      vy: number;
      rotation: number;
      rotSpeed: number;
      length: number;
      width: number;
      alpha: number;
      maxLife: number;
      age: number;
      swayPhase: number;
      swaySpeed: number;
      swayAmp: number;
      r: number;
      g: number;
      b: number;
    }

    const MAX_LEAVES = 16;
    const leafPool: FallingLeaf[] = Array.from({ length: MAX_LEAVES }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rotation: 0,
      rotSpeed: 0,
      length: 4.2,
      width: 2.0,
      alpha: 0,
      maxLife: 260,
      age: 0,
      swayPhase: 0,
      swaySpeed: 0.04,
      swayAmp: 0.9,
      r: 215,
      g: 35,
      b: 35,
    }));

    let leafSpawnCooldown = 30;

    const canopyPads = [
      { cx: -155, cy: -46, rx: 68, ry: 22 },
      { cx: 138, cy: -82, rx: 58, ry: 20 },
      { cx: -12, cy: -168, rx: 78, ry: 26 },
      { cx: -92, cy: -122, rx: 48, ry: 18 },
      { cx: 38, cy: -106, rx: 42, ry: 16 },
    ];

    // ========================================================
    // 4. UNIFIED CONTINUOUS ANIMATION LOOP
    // Single animation pipeline driven by scrollBus & Lenis
    // ========================================================
    const render = () => {
      if (!ctx) return;
      time += 0.016;

      const currentPath = pathnameRef.current;
      const targetScrollY = scrollBus.scrollY || window.scrollY || 0;
      smoothScrollY += (targetScrollY - smoothScrollY) * 0.1;
      const scrollY = smoothScrollY;
      const vh = height;
      const centerX = width / 2;
      const centerY = height / 2;

      // ------------------------------------------------------
      // A. HERO VIDEO (Smooth fadeout over first viewport)
      // ------------------------------------------------------
      if (currentPath === '/') {
        const videoFadeDist = vh * 0.9;
        const videoOpacity = Math.max(0, Math.min(1, 1 - scrollY / videoFadeDist));
        if (videoWrapRef.current) {
          videoWrapRef.current.style.opacity = videoOpacity.toFixed(3);
          videoWrapRef.current.style.transform = `translate3d(0, ${(scrollY * 0.12).toFixed(1)}px, 0)`;
        }
        if (videoRef.current) {
          if (videoOpacity <= 0.01 && !videoRef.current.paused) {
            videoRef.current.pause();
          } else if (videoOpacity > 0.01 && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }
      } else {
        if (videoWrapRef.current) videoWrapRef.current.style.opacity = '0';
        if (videoRef.current && !videoRef.current.paused) videoRef.current.pause();
      }

      // ------------------------------------------------------
      // B. CONTINUOUS SCROLL TIMELINE CALCULATIONS
      // ------------------------------------------------------
      let targetOfferBright = 0;
      let teamAlpha = 0;
      let sceneProgress = 0; // 0 = Hero, 1 = Chapter 02 (HWI), 2 = White section, 3 = Black section Bonsai Tree, 4 = Team

      const { aboutTop, aboutHeight, offerTop, offerHeight, impactTop, impactHeight, teamTop, teamHeight } = cachedOffsets;

      // Chapter 02 Runway & Monotonic Checkpoints (Monotonically strictly increasing)
      const aboutRunway = Math.max(vh * 1.0, aboutHeight - vh);
      const convStartY = aboutTop;
      const convEndY = aboutTop + aboutRunway * 0.36;
      const holdEndY = aboutTop + aboutRunway * 0.72;
      const dispEndY = offerTop;

      if (currentPath === '/') {
        // Brightness window over What We Offer section
        const offerEnter = offerTop - vh * 0.4;
        const offerStayEnd = Math.max(offerTop, impactTop - vh * 0.4);
        const offerExit = impactTop + vh * 0.1;
        if (scrollY >= offerEnter && scrollY <= offerExit) {
          if (scrollY < offerTop) {
            targetOfferBright = Math.max(0, Math.min(1, (scrollY - offerEnter) / (offerTop - offerEnter)));
          } else if (scrollY <= offerStayEnd) {
            targetOfferBright = 1.0;
          } else {
            const exitSpan = Math.max(1, offerExit - offerStayEnd);
            targetOfferBright = Math.max(0, Math.min(1, 1 - (scrollY - offerStayEnd) / exitSpan));
          }
        } else {
          targetOfferBright = 0;
        }

        // Continuous Scene Progress across document:
        if (scrollY < offerTop) {
          sceneProgress = 1.0;
        } else if (scrollY < impactTop - vh * 0.3) {
          sceneProgress = 2.0;
        } else if (scrollY < impactTop + vh * 0.1) {
          const span = Math.max(1, (impactTop + vh * 0.1) - (impactTop - vh * 0.3));
          const rel = Math.max(0, Math.min(1.0, (scrollY - (impactTop - vh * 0.3)) / span));
          sceneProgress = 2.0 + rel;
        } else if (scrollY < teamTop - vh * 0.2) {
          sceneProgress = 3.0;
        } else {
          const teamSpan = Math.max(1, teamHeight);
          const teamRel = Math.max(0, Math.min(1.0, (scrollY - (teamTop - vh * 0.2)) / teamSpan));
          sceneProgress = 3.0 + teamRel;
        }

        // Team atmosphere opacity window
        const teamEnter = teamTop - vh * 0.4;
        const teamExit = teamTop + teamHeight + vh * 0.2;
        if (scrollY >= teamEnter && scrollY <= teamExit) {
          const tRel = (scrollY - teamEnter) / (teamExit - teamEnter);
          teamAlpha = Math.sin(Math.max(0, Math.min(1, tRel)) * Math.PI);
        }
      } else if (currentPath === '/team') {
        sceneProgress = 3.5;
        teamAlpha = 1.0;
      } else if (currentPath === '/events') {
        sceneProgress = 3.0;
        teamAlpha = 0;
      } else if (currentPath === '/about') {
        sceneProgress = 0.5;
        teamAlpha = 0;
      } else {
        sceneProgress = 0.5;
        teamAlpha = 0;
      }

      currentOfferBright += (targetOfferBright - currentOfferBright) * 0.08;

      if (teamContainerRef.current) {
        teamContainerRef.current.style.opacity = teamAlpha.toFixed(3);
      }

      // ------------------------------------------------------
      // D. BASE BACKGROUND COLOR & THEME CSS VARIABLES
      // ------------------------------------------------------
      const bgR = 7 + (245 - 7) * currentOfferBright;
      const bgG = 7 + (245 - 7) * currentOfferBright;
      const bgB = 9 + (247 - 9) * currentOfferBright;

      if (baseLayerRef.current) {
        baseLayerRef.current.style.backgroundColor = `rgb(${Math.round(bgR)},${Math.round(bgG)},${Math.round(bgB)})`;
      }

      const docStyle = document.documentElement.style;
      const textLum = Math.round(255 - currentOfferBright * 238);
      const textSecLum = Math.round(203 - currentOfferBright * 128);

      docStyle.setProperty('--surface-primary', `rgb(${Math.round(bgR)},${Math.round(bgG)},${Math.round(bgB)})`);
      docStyle.setProperty('--text-primary', `rgb(${textLum},${textLum},${textLum})`);
      docStyle.setProperty('--text-secondary', `rgb(${textSecLum},${textSecLum},${textSecLum})`);
      docStyle.setProperty('--border-default', currentOfferBright > 0.3 ? `rgba(0, 0, 0, ${0.08 + currentOfferBright * 0.08})` : `rgba(239, 68, 68, 0.15)`);
      docStyle.setProperty('--navbar-text', currentOfferBright > 0.4 ? '#111111' : '#FFFFFF');
      docStyle.setProperty('--navbar-bg', currentOfferBright > 0.4 ? 'rgba(245, 245, 247, 0.85)' : 'rgba(7, 7, 9, 0.85)');

      const isWhiteBg = currentOfferBright > 0.45;

      // ------------------------------------------------------
      // E. RENDER PROCEDURAL PARTICLES
      // ------------------------------------------------------
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      // 3D Celestial Globe parameters
      const isMobile = width < 768;

      // Smooth rotation damping: 1.0 at Hero, smoothly decelerates to 0 as HWI converges
      let rotDamp = 1.0;
      if (currentPath === '/') {
        if (scrollY <= convStartY) {
          rotDamp = 1.0;
        } else if (scrollY <= convEndY) {
          const t = (scrollY - convStartY) / (convEndY - convStartY);
          const ease = t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;
          rotDamp = Math.max(0, 1 - ease);
        } else {
          rotDamp = 0.0;
        }
      }

      const rotSpeed = prefersReducedMotion ? 0 : 0.0025 * rotDamp;
      globeStore.targetRotY += rotSpeed;
      globeStore.stepInertia();

      const sphereRadius = isMobile
        ? Math.min(width * 0.35, 138)
        : Math.min(width * 0.20, height * 0.23);
      const rotY = globeStore.rotY * rotDamp;
      const rotX = globeStore.rotX * rotDamp;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const sphereCY = centerY - (isMobile ? Math.min(height * 0.16, 130) : 110);

      // Bonsai Tree parameters (Black section)
      const treeCX = centerX + Math.min(width, height) * 0.14;
      const treeCY = centerY + 15;
      const treeSway = prefersReducedMotion ? 0 : Math.sin(time * 0.95) * 2.8;
      const treeScale = 1.0 + Math.sin(time * 0.45) * 0.015;

      for (let i = 0; i < N; i++) {
        let x = 0, y = 0, opacity = 0;
        let size = soa.size[i];
        let cr = 239, cg = 68, cb = 68;

        const drift = Math.sin(time * soa.driftSpeed[i] + soa.driftPhase[i]) * 8;

        // 3D Rotated celestial coordinates
        const x1 = soa.s1x[i] * cosY - soa.s1z[i] * sinY;
        const y1 = soa.s1y[i];
        const z1 = soa.s1x[i] * sinY + soa.s1z[i] * cosY;

        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const isShell = soa.s1density[i] > 0.8;

        const sx = centerX + x2 * sphereRadius;
        const sy = sphereCY - y2 * sphereRadius;
        const sz = z2;

        const targetX = soa.sHwiX[i];
        const targetY = soa.sHwiY[i];

        // ----------------------------------------------------
        // SCENE 0 & 1: Hero (Globe) -> HWI Convergence -> Hold -> Dispersal
        // ----------------------------------------------------
        if (currentPath === '/' && scrollY < dispEndY) {
          if (scrollY <= convStartY) {
            // Hero: Refined 3D Rotating Celestial Particle Globe
            x = sx;
            y = sy;
            soa.isRect[i] = 0;

            if (isShell) {
              const isFront = z2 >= 0;
              const normZ = (z2 + 1.0) * 0.5; // 0.0 (far back) -> 1.0 (nearest front)
              const r2D = Math.sqrt(x2 * x2 + y2 * y2);
              const isRim = r2D > 0.82 && Math.abs(z2) < 0.35;

              if (isFront) {
                // Front hemisphere facing camera: luminous crimson & starlight
                const depthAlpha = 0.28 + z2 * 0.52; // 0.28 at equator -> 0.80 at pole
                opacity = isRim ? Math.min(0.88, depthAlpha + 0.15) : depthAlpha;
                size = 1.3 + normZ * 1.3; // 1.95px -> 2.6px

                if (i % 11 === 0) {
                  // Pure starlight diamond
                  cr = 255; cg = 255; cb = 255;
                } else if (i % 5 === 0) {
                  // Bright crimson highlight
                  cr = 255; cg = 75; cb = 85;
                } else {
                  // Deep radiant ruby
                  cr = 225; cg = 38; cb = 48;
                }
              } else {
                // Back hemisphere (seen through celestial volume): soft, gentle depth cueing
                const backDepth = z2 + 1.0; // 0.0 at far back pole -> 1.0 at equator
                opacity = isRim ? 0.25 : 0.05 + backDepth * 0.16;
                size = 0.8 + normZ * 0.8; // 0.8px -> 1.2px
                cr = 160; cg = 24; cb = 30;
              }
            } else {
              // Outer ambient corona & cosmic dust
              opacity = 0.04 + (Math.sin(i * 3.7 + time * 0.8) * 0.5 + 0.5) * 0.12;
              size = 0.9 + (i % 3) * 0.3;
              if (i % 7 === 0) {
                cr = 255; cg = 255; cb = 255;
              } else {
                cr = 200; cg = 32; cb = 42;
              }
            }
          } else if (scrollY <= convEndY) {
            // Stage 1: Fluid, continuous quintic convergence into HWI wordmark
            const t = (scrollY - convStartY) / (convEndY - convStartY);
            const ease = t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;

            x = sx * (1 - ease) + targetX * ease;
            y = sy * (1 - ease) + targetY * ease;

            const globeAlpha = isShell ? Math.max(0.18, ((sz + 1.2) / 2.2) * 0.85) : 0.12;
            opacity = globeAlpha * (1 - ease) + 1.0 * ease;

            const targetSize = isMobile ? 3.5 : 4.2;
            const currentGlobeSize = isShell ? (1.3 + (sz + 1.0) * 0.65) : 1.1;
            size = currentGlobeSize * (1 - ease) + targetSize * ease;

            const baseR = isShell ? (i % 11 === 0 ? 255 : (sz >= 0 ? 225 : 160)) : 200;
            const baseG = isShell ? (i % 11 === 0 ? 255 : (sz >= 0 ? 38 : 24)) : 32;
            const baseB = isShell ? (i % 11 === 0 ? 255 : (sz >= 0 ? 48 : 30)) : 42;
            cr = Math.round(baseR * (1 - ease) + soa.sHwiR[i] * ease);
            cg = Math.round(baseG * (1 - ease) + soa.sHwiG[i] * ease);
            cb = Math.round(baseB * (1 - ease) + soa.sHwiB[i] * ease);

            soa.isRect[i] = ease > 0.5 ? 1 : 0;
          } else if (scrollY <= holdEndY) {
            // Stage 2: THE HOLD — Stable, dense, readable HWI wordmark
            const breathe = prefersReducedMotion ? 0 : Math.sin(time * 1.5 + i * 0.08) * 0.4;
            x = targetX + breathe;
            y = targetY + breathe;

            opacity = 1.0;
            size = isMobile ? 3.5 : 4.2;
            cr = soa.sHwiR[i];
            cg = soa.sHwiG[i];
            cb = soa.sHwiB[i];
            soa.isRect[i] = 1;
          } else {
            // Stage 3: Smooth quintic dispersal directly into What We Offer ambient field
            const t = (scrollY - holdEndY) / (dispEndY - holdEndY);
            const ease = t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;

            let wx = centerX, wy = centerY;
            if (targetsReady) {
              wx = soa.s2x[i];
              wy = soa.s2y[i] + drift;
            }

            x = targetX * (1 - ease) + wx * ease;
            y = targetY * (1 - ease) + wy * ease;

            const whiteFieldAlpha = isWhiteBg ? 0.32 : 0.55;
            opacity = 1.0 * (1 - ease) + whiteFieldAlpha * ease;

            const hwiSize = isMobile ? 3.5 : 4.2;
            const targetSize = isWhiteBg ? 1.8 : 2.2;
            size = hwiSize * (1 - ease) + targetSize * ease;

            const targetR = isWhiteBg ? 180 : 239;
            const targetG = isWhiteBg ? 40 : 68;
            const targetB = isWhiteBg ? 40 : 68;
            cr = Math.round(soa.sHwiR[i] * (1 - ease) + targetR * ease);
            cg = Math.round(soa.sHwiG[i] * (1 - ease) + targetG * ease);
            cb = Math.round(soa.sHwiB[i] * (1 - ease) + targetB * ease);

            soa.isRect[i] = ease > 0.4 ? 0 : 1;
          }
        }
        // ----------------------------------------------------
        // SCENE 2: What We Offer (White Section Ambient Kinetic Field)
        // ----------------------------------------------------
        else if (sceneProgress < 2.0 || (currentPath === '/' && scrollY < impactTop - vh * 0.3)) {
          let wx = centerX, wy = centerY;
          if (targetsReady) {
            wx = soa.s2x[i];
            wy = soa.s2y[i] + drift;
          }
          x = wx;
          y = wy;
          opacity = isWhiteBg ? 0.32 : 0.55;
          size = isWhiteBg ? 1.8 : 2.2;
          cr = isWhiteBg ? 180 : 239;
          cg = isWhiteBg ? 40 : 68;
          cb = isWhiteBg ? 40 : 68;
          soa.isRect[i] = 0;
        }
        // ----------------------------------------------------
        // SCENE 2 -> 3: White Section -> STABLE BONSAI TREE (Black Section)
        // ----------------------------------------------------
        else if (sceneProgress <= 3.0) {
          const t = sceneProgress - 2.0; // 0.0 -> 1.0

          let wx = centerX, wy = centerY;
          let tx = treeCX, ty = treeCY;

          if (targetsReady) {
            wx = soa.s2x[i];
            wy = soa.s2y[i] + drift;
            // Tree position: framed slightly right of center with subtle living breathing & sway
            const swayEffect = soa.s3part[i] === 3 ? treeSway : treeSway * 0.35;
            tx = treeCX + (soa.s3x[i] + swayEffect) * treeScale;
            ty = treeCY + soa.s3y[i] * treeScale;
          }

          x = wx + (tx - wx) * t;
          y = wy + (ty - wy) * t;

          // Particle sizing: transitions to substantial sculptural bonsai size (up to 5.2px)
          const s2Size = soa.size[i];
          const s3Size = targetsReady ? soa.s3size[i] : 3.2;
          size = s2Size + (s3Size - s2Size) * t;

          // Stable bonsai opacity: high, crisp definition against black
          const treeAlpha = 0.88 * (soa.s3density[i] || 0.9);
          opacity = 0.45 * (1 - t) + treeAlpha * t;

          // Distinctive HWI Bonsai Materials:
          // 1. Wood (Roots 0, Trunk 1, Branches 2): White / Off-white with organic depth
          // 2. Foliage (Canopy 3): Normal HWI Red (solid, restrained, non-neon, non-glowing)
          if (soa.s3part[i] === 3) {
            // LEAVES / FOLIAGE: NORMAL HWI RED (Non-neon, solid diffuse red)
            const tone = i % 5;
            if (tone === 0) {
              cr = 225; cg = 45; cb = 45; // top highlight red
            } else if (tone === 1 || tone === 2) {
              cr = 210; cg = 34; cb = 34; // standard HWI crimson red
            } else if (tone === 3) {
              cr = 188; cg = 28; cb = 28; // deeper diffuse red
            } else {
              cr = 168; cg = 22; cb = 22; // shaded under-leaf red
            }
          } else {
            // BRANCHES / TRUNK / WOOD / ROOTS: WHITE / OFF-WHITE
            // Dense soft white particles with subtle organic depth variation
            const depthZ = soa.s3z[i];
            const zNorm = Math.max(0, Math.min(1, (depthZ + 40) / 80));

            if (soa.s3part[i] === 1) {
              // Trunk: Solid alabaster white
              const baseW = Math.round(236 + zNorm * 19);
              cr = baseW;
              cg = baseW - (i % 2 === 0 ? 3 : 0);
              cb = baseW + (i % 2 === 0 ? 0 : 3);
            } else if (soa.s3part[i] === 2) {
              // Branches: Clean soft white
              const baseW = Math.round(230 + zNorm * 25);
              cr = baseW;
              cg = baseW;
              cb = Math.min(255, baseW + 2);
            } else {
              // Roots (Nebari): Grounded off-white / silver bark
              const baseW = Math.round(220 + zNorm * 24);
              cr = baseW;
              cg = baseW - 4;
              cb = baseW + 1;
            }
          }
        }
        // ----------------------------------------------------
        // SCENE 3 -> 4: Bonsai Tree -> Team Section Ambient Lattice
        // ----------------------------------------------------
        else {
          const teamT = Math.min(1.0, sceneProgress - 3.0);
          let tx = treeCX, ty = treeCY;
          let lx = centerX, ly = centerY;

          if (targetsReady) {
            const swayEffect = soa.s3part[i] === 3 ? treeSway : treeSway * 0.35;
            tx = treeCX + (soa.s3x[i] + swayEffect) * treeScale;
            ty = treeCY + soa.s3y[i] * treeScale;
            lx = soa.s4x[i];
            ly = soa.s4y[i] + drift * 0.8;
          }

          x = tx + (lx - tx) * teamT;
          y = ty + (ly - ty) * teamT;

          const s3Size = targetsReady ? soa.s3size[i] : 3.2;
          const s4Size = soa.size[i];
          size = s3Size + (s4Size - s3Size) * teamT;

          opacity = 0.85 * (1 - teamT) + 0.32 * teamT;

          const isCanopy = soa.s3part[i] === 3;
          const startR = isCanopy ? 210 : 240;
          const startG = isCanopy ? 34 : 240;
          const startB = isCanopy ? 34 : 245;

          cr = Math.round(startR * (1 - teamT) + 248 * teamT);
          cg = Math.round(startG * (1 - teamT) + 113 * teamT);
          cb = Math.round(startB * (1 - teamT) + 113 * teamT);
        }

        // ====================================================
        // G. WHAT WE DO ENVIRONMENT VARIATIONS (Feature 3)
        // Subtle variations of the existing particle system
        // ====================================================
        if (currentEnvMode === 'grids') {
          const gStep = 45;
          x += (Math.round(x / gStep) * gStep - x) * 0.16;
          y += (Math.round(y / gStep) * gStep - y) * 0.16;
        } else if (currentEnvMode === 'connected') {
          const nAngle = (i % 8) * (Math.PI / 4);
          x += Math.cos(nAngle + time) * 5;
          y += Math.sin(nAngle + time) * 5;
        } else if (currentEnvMode === 'groups') {
          const gIdx = i % 3;
          const gTargetX = centerX + (gIdx - 1) * (width * 0.28);
          const gTargetY = centerY + Math.sin(time * 0.8 + gIdx) * 25;
          x += (gTargetX - x) * 0.06;
          y += (gTargetY - y) * 0.06;
        } else if (currentEnvMode === 'geometric') {
          const hexX = Math.cos(Math.floor(time * 0.5 + i * 0.1) * 1.047) * 12;
          const hexY = Math.sin(Math.floor(time * 0.5 + i * 0.1) * 1.047) * 12;
          x += hexX * 0.15;
          y += hexY * 0.15;
        } else if (currentEnvMode === 'orbital') {
          const oDist = Math.hypot(x - centerX, y - centerY);
          const oAngle = Math.atan2(y - centerY, x - centerX) + 0.012;
          x = centerX + Math.cos(oAngle) * oDist;
          y = centerY + Math.sin(oAngle) * oDist;
        }

        // ====================================================
        // H. HWI EASTER EGG PARTICLE CONVERGENCE (Feature 7)
        // Particles gather to form the HWI monogram
        // ====================================================
        if (isEasterEggActive) {
          const eggAngle = (i / N) * Math.PI * 2;
          const eggR = Math.min(width, height) * 0.22;
          const targetEggX = centerX + Math.cos(eggAngle) * eggR;
          const targetEggY = centerY + Math.sin(eggAngle) * eggR * 0.5;
          x += (targetEggX - x) * 0.15;
          y += (targetEggY - y) * 0.15;
          cr = 239; cg = 68; cb = 68;
          opacity = Math.min(1.0, opacity + 0.35);
        }

        // ====================================================
        // I. PARTICLE MOUSE PROXIMITY RESPONSE (Feature 12)
        // Subtle influence field (radius 85px) - gentle displacement
        // ====================================================
        if (mouseX > 0 && mouseY > 0) {
          const mdx = x - mouseX;
          const mdy = y - mouseY;
          const mdistSq = mdx * mdx + mdy * mdy;
          const mradius = 85;
          if (mdistSq < mradius * mradius && mdistSq > 1) {
            const mdist = Math.sqrt(mdistSq);
            const factor = (1 - mdist / mradius) * 10;
            x += (mdx / mdist) * factor;
            y += (mdy / mdist) * factor;
            opacity = Math.min(1.0, opacity + 0.22);
          }
        }

        if (opacity <= 0.02) continue;
        if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;

        const finalOpacity = isWhiteBg ? Math.min(0.85, opacity * 0.8) : Math.max(0.12, opacity);

        ctx.fillStyle = `rgba(${cr},${cg},${cb},${finalOpacity.toFixed(2)})`;

        if (soa.isRect[i]) {
          ctx.fillRect(x - size * 0.5, y - size * 0.5, size, size);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, size * 0.5, 0, 6.2832);
          ctx.fill();
        }
      }

      // ------------------------------------------------------
      // F. SUBTLE FALLING LEAF PARTICLES (Black section atmospheric motion)
      // 2–4 natural red leaves detach from canopy, gently sway and fall
      // ------------------------------------------------------
      if (sceneProgress >= 2.5 && sceneProgress <= 3.5) {
        const normScale = Math.max(520, Math.min(height * 0.62, 720)) / 360;

        let activeCount = 0;
        for (let l = 0; l < MAX_LEAVES; l++) {
          if (leafPool[l].active) activeCount++;
        }

        leafSpawnCooldown--;
        if (leafSpawnCooldown <= 0 && activeCount < 4) {
          leafSpawnCooldown = Math.floor(65 + Math.random() * 40);
          for (let l = 0; l < MAX_LEAVES; l++) {
            const leaf = leafPool[l];
            if (!leaf.active) {
              const pad = canopyPads[Math.floor(Math.random() * canopyPads.length)];
              const theta = Math.random() * Math.PI * 2;
              const rad = Math.sqrt(Math.random());
              const sx = treeCX + (pad.cx + Math.cos(theta) * pad.rx * rad) * normScale;
              const sy = treeCY + (pad.cy + Math.sin(theta) * pad.ry * rad * 0.8) * normScale;

              leaf.active = true;
              leaf.x = sx;
              leaf.y = sy;
              leaf.vy = 0.65 + Math.random() * 0.55;
              leaf.swayPhase = Math.random() * Math.PI * 2;
              leaf.swaySpeed = 0.03 + Math.random() * 0.025;
              leaf.swayAmp = 0.75 + Math.random() * 0.75;
              leaf.rotation = Math.random() * Math.PI * 2;
              leaf.rotSpeed = (Math.random() - 0.5) * 0.035;
              leaf.length = 3.6 + Math.random() * 1.8;
              leaf.width = 1.6 + Math.random() * 0.7;
              leaf.maxLife = 220 + Math.floor(Math.random() * 90);
              leaf.age = 0;

              const redTone = Math.floor(Math.random() * 4);
              if (redTone === 0) {
                leaf.r = 225; leaf.g = 45; leaf.b = 45;
              } else if (redTone === 1) {
                leaf.r = 210; leaf.g = 35; leaf.b = 35;
              } else if (redTone === 2) {
                leaf.r = 190; leaf.g = 28; leaf.b = 28;
              } else {
                leaf.r = 175; leaf.g = 22; leaf.b = 22;
              }
              break;
            }
          }
        }

        // Draw and simulate active leaves
        for (let l = 0; l < MAX_LEAVES; l++) {
          const leaf = leafPool[l];
          if (!leaf.active) continue;

          leaf.age++;
          if (leaf.age >= leaf.maxLife || leaf.y > height + 30) {
            leaf.active = false;
            continue;
          }

          leaf.y += leaf.vy;
          leaf.x += Math.sin(leaf.swayPhase + leaf.age * leaf.swaySpeed) * leaf.swayAmp;
          leaf.rotation += leaf.rotSpeed;

          let leafAlpha = 0.85;
          const fadeInFrames = leaf.maxLife * 0.15;
          const fadeOutStart = leaf.maxLife * 0.72;

          if (leaf.age < fadeInFrames) {
            leafAlpha = (leaf.age / fadeInFrames) * 0.85;
          } else if (leaf.age > fadeOutStart) {
            leafAlpha = ((leaf.maxLife - leaf.age) / (leaf.maxLife - fadeOutStart)) * 0.85;
          }

          if (leafAlpha <= 0.01) continue;

          ctx.save();
          ctx.translate(leaf.x, leaf.y);
          ctx.rotate(leaf.rotation);
          ctx.fillStyle = `rgba(${leaf.r},${leaf.g},${leaf.b},${leafAlpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, leaf.length, leaf.width, 0, 0, 6.2832);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      clearTimeout(resizeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      unsubscribeTeam();
      unsubscribeWhatWeDo();
      unsubscribeEasterEgg();
    };
  }, []);

  return (
    <div className="gbg" ref={containerRef} aria-hidden="true">
      {/* Layer 1: Solid Base Surface with continuous color interpolation */}
      <div className="gbg__base" ref={baseLayerRef} />

      {/* Layer 2: Hero Video Layer (Persistent, fading out smoothly on scroll) */}
      <div className="gbg__video-wrap" ref={videoWrapRef}>
        <video
          ref={videoRef}
          src="/videos/sukuna-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="gbg__video"
        />
        <div className="gbg__video-overlay" />
      </div>

      {/* Layer 3: Team-Specific Ambient Backgrounds (5 Distinct visual atmospheres) */}
      <div className="gbg__team-container" ref={teamContainerRef}>
        {[0, 1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className={`gbg__team-layer gbg__team-layer--${idx}`}
            ref={(el) => {
              teamLayersRef.current[idx] = el;
            }}
          />
        ))}
      </div>

      {/* Layer 4: Transparent Canvas Particle Engine (Mathematical, lightweight) */}
      <canvas className="gbg__canvas" ref={canvasRef} />

      {/* Layer 5: Atmospheric Vignette */}
      <div className="gbg__vignette" />
    </div>
  );
}
