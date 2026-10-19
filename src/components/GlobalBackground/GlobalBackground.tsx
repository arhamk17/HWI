'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { scrollBus } from '@/lib/scrollBus';
import { teamStore } from '@/lib/teamStore';
import { globeStore } from '@/lib/globeStore';
import { indiaStore } from '@/lib/indiaStore';
import { whatWeDoStore } from '@/lib/whatWeDoStore';
import { easterEggStore } from '@/lib/easterEggStore';
import {
  ParticleSOA,
  createParticleSOA,
  initInitialStates,
  populateHWIState,
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
  high: { particleCount: 2000, glow: true },
  medium: { particleCount: 1300, glow: false },
  low: { particleCount: 700, glow: false },
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
  const hwiLayerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const teamContainerRef = useRef<HTMLDivElement>(null);
  const teamLayersRef = useRef<(HTMLDivElement | null)[]>([]);

  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Ensure instant seamless autoplay of Sukuna background video on mount
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
          populateHWIState(soa);
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
      populateHWIState(soa);
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
      const p = Math.max(0, Math.min(4, progress * 4));
      const activeIdx = Math.min(3, Math.floor(p));
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
      let sceneProgress = 0; // 0 = Hero, 1 = Celestial Globe / HWI, 2 = White section, 3 = Black section Bonsai Tree, 4 = Team
      let hwiMorph = 0; // 0 = 3D Globe, 1 = HWI lettering fully formed
      let sectionParticleAlpha = 1.0; // Scoped particle visibility: 0 in Hero

      if (currentPath === '/') {
        const { aboutTop, aboutHeight, offerTop, offerHeight, impactTop, impactHeight, teamTop, teamHeight } = cachedOffsets;

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

        // Chapter 02 (StoryChapter) runway for smooth Globe -> HWI direct transformation
        const aboutScrollRunway = Math.max(vh * 0.8, aboutHeight - vh);
        const aboutExit = aboutTop + aboutScrollRunway;

        // Continuous Scene Progress across document:
        if (scrollY < vh * 0.75) {
          // Hero -> Zero particles in Hero
          sceneProgress = Math.max(0, scrollY / (vh * 0.75)); // 0.0 -> 1.0
          hwiMorph = 0.0;
        } else if (scrollY < aboutTop) {
          // Approaching About section: 100% Celestial Globe in gentle rotation
          sceneProgress = 1.0;
          hwiMorph = 0.0;
        } else if (scrollY <= aboutExit) {
          // Inside Chapter 02: ONE continuous particle buffer morphs directly from Globe to HWI!
          sceneProgress = 1.0;
          hwiMorph = Math.max(0, Math.min(1.0, (scrollY - aboutTop) / aboutScrollRunway));
        } else if (scrollY < offerTop + vh * 0.1) {
          // Transition into White Section: HWI particles disperse into White section ambient field
          const span = Math.max(1, (offerTop + vh * 0.1) - aboutExit);
          const rel = Math.max(0, Math.min(1.0, (scrollY - aboutExit) / span));
          sceneProgress = 1.0 + rel * 1.0; // 1.0 -> 2.0
          hwiMorph = 1.0;
        } else if (scrollY < impactTop - vh * 0.3) {
          // What We Offer (White Section): Ambient kinetic field
          sceneProgress = 2.0;
          hwiMorph = 0.0;
        } else if (scrollY < impactTop + vh * 0.1) {
          // Transition into Black Section: Morph directly into the Blossom / Bonsai Tree
          const span = Math.max(1, (impactTop + vh * 0.1) - (impactTop - vh * 0.3));
          const rel = Math.max(0, Math.min(1.0, (scrollY - (impactTop - vh * 0.3)) / span));
          sceneProgress = 2.0 + rel * 1.0; // 2.0 -> 3.0
          hwiMorph = 0.0;
        } else if (scrollY < teamTop - vh * 0.2) {
          // Impact Section (BLACK SECTION): 100% STABLE FULLY FORMED BONSAI TREE!
          sceneProgress = 3.0;
          hwiMorph = 0.0;
        } else {
          // Transition into Team Section
          const teamSpan = Math.max(1, teamHeight);
          const teamRel = Math.max(0, Math.min(1.0, (scrollY - (teamTop - vh * 0.2)) / teamSpan));
          sceneProgress = 3.0 + teamRel * 1.0; // 3.0 -> 4.0
          hwiMorph = 0.0;
        }

        // Section Scoping for Particle Alpha:
        // Disable distracting particles in Hero section to preserve clean video background & typography
        if (scrollY < aboutTop * 0.85) {
          // Hero section: completely remove floating particles
          sectionParticleAlpha = 0.0;
        } else if (scrollY < aboutTop) {
          // Approaching About section: smoothly introduce the 3D celestial globe
          sectionParticleAlpha = Math.min(1.0, (scrollY - aboutTop * 0.85) / (aboutTop * 0.15));
        } else {
          // Full particle presence across all other sections
          sectionParticleAlpha = 1.0;
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
        hwiMorph = 0.0;
        sectionParticleAlpha = 1.0;
      } else if (currentPath === '/events') {
        sceneProgress = 3.0; // Show the elegant bonsai in background for events as well!
        teamAlpha = 0;
        hwiMorph = 0.0;
        sectionParticleAlpha = 1.0;
      } else if (currentPath === '/about') {
        sceneProgress = 0.5;
        teamAlpha = 0;
        hwiMorph = 0.0;
        sectionParticleAlpha = 0.0;
      } else {
        sceneProgress = 0.5;
        teamAlpha = 0;
        hwiMorph = 0.0;
        sectionParticleAlpha = 1.0;
      }

      // Synchronize morph progress with subscribers (active ONLY on home page '/')
      indiaStore.setMorphProgress(currentPath === '/' ? hwiMorph : 0);

      currentOfferBright += (targetOfferBright - currentOfferBright) * 0.08;

      if (teamContainerRef.current) {
        teamContainerRef.current.style.opacity = teamAlpha.toFixed(3);
      }

      // ------------------------------------------------------
      // C. PERMANENT HWI WATERMARK (ALWAYS VISIBLE AT ALL TIMES)
      // Never 0 opacity. Reacts subtly to brightness and scroll.
      // ------------------------------------------------------
      if (hwiLayerRef.current) {
        let hwiOpacity = 0.12 - currentOfferBright * 0.045;
        // When particles assemble into HWI lettering, seamlessly fade the static SVG watermark
        // so the particles themselves compose and define the HWI lettering without duplicate layers
        if (currentPath === '/' && sceneProgress <= 1.3 && hwiMorph > 0.25) {
          const fadeP = Math.min(1.0, (hwiMorph - 0.25) / 0.55);
          hwiOpacity *= (1.0 - fadeP * 0.88);
        }
        const hwiParallax = (scrollY * 0.02) % 60 - 30;
        const hwiBreath = 1.0 + Math.sin(time * 0.35) * 0.01;

        hwiLayerRef.current.style.opacity = Math.max(0.015, hwiOpacity).toFixed(3);
        hwiLayerRef.current.style.transform = `translate3d(0, ${hwiParallax.toFixed(1)}px, 0) scale(${hwiBreath.toFixed(3)})`;
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
      const textTerLum = Math.round(148 - currentOfferBright * 60);

      docStyle.setProperty('--surface-primary', `rgb(${Math.round(bgR)},${Math.round(bgG)},${Math.round(bgB)})`);
      docStyle.setProperty('--text-primary', `rgb(${textLum},${textLum},${textLum})`);
      docStyle.setProperty('--text-secondary', `rgb(${textSecLum},${textSecLum},${textSecLum})`);
      docStyle.setProperty('--text-tertiary', `rgb(${textTerLum},${textTerLum},${textTerLum})`);
      docStyle.setProperty('--border-default', currentOfferBright > 0.3 ? `rgba(0, 0, 0, ${0.08 + currentOfferBright * 0.08})` : `rgba(239, 68, 68, 0.15)`);
      docStyle.setProperty('--navbar-text', currentOfferBright > 0.4 ? '#111111' : '#FFFFFF');
      docStyle.setProperty('--navbar-bg', currentOfferBright > 0.4 ? 'rgba(245, 245, 247, 0.85)' : 'rgba(7, 7, 9, 0.85)');
      docStyle.setProperty('--navbar-pill-bg', currentOfferBright > 0.4 ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)');
      docStyle.setProperty('--navbar-pill-border', currentOfferBright > 0.4 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.08)');

      // Adaptive HWI watermark SVG colors
      if (currentOfferBright > 0.05) {
        const dotA = (0.7 * (1 - currentOfferBright) + 0.4 * currentOfferBright).toFixed(2);
        const strokeA = (0.25 * (1 - currentOfferBright) + 0.22 * currentOfferBright).toFixed(2);
        const colVal = currentOfferBright > 0.4 ? '15, 23, 42' : '255, 255, 255';
        docStyle.setProperty('--hwi-dot-fill', `rgba(${colVal}, ${dotA})`);
        docStyle.setProperty('--hwi-stroke', `rgba(${colVal}, ${strokeA})`);
        docStyle.setProperty('--hwi-shadow', currentOfferBright > 0.4 ? 'rgba(0,0,0,0.06)' : 'rgba(239, 68, 68, 0.12)');
      } else {
        docStyle.setProperty('--hwi-dot-fill', 'rgba(255, 255, 255, 0.7)');
        docStyle.setProperty('--hwi-stroke', 'rgba(255, 255, 255, 0.25)');
        docStyle.setProperty('--hwi-shadow', 'rgba(239, 68, 68, 0.12)');
      }

      const isWhiteBg = currentOfferBright > 0.45;

      // ------------------------------------------------------
      // E. RENDER PROCEDURAL PARTICLES
      // ------------------------------------------------------
      ctx.clearRect(0, 0, width, height);

      // Scoped particle rendering: completely skip in Hero and About Phase 1 narrative
      if (sectionParticleAlpha <= 0.001) {
        rafId = requestAnimationFrame(render);
        return;
      }

      ctx.globalCompositeOperation = 'source-over';

      // 3D Celestial Globe / Ambient Constellation
      const p = currentPath === '/' ? hwiMorph : 0;
      const rotDamp = 1 - Math.min(1, p * 1.6);
      const rotSpeed = prefersReducedMotion ? 0 : 0.0025 * rotDamp;
      globeStore.targetRotY += rotSpeed;
      globeStore.stepInertia();

      const sphereRadius = Math.min(width, height) * 0.28;
      const rotY = globeStore.rotY * rotDamp;
      const rotX = globeStore.rotX * rotDamp;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const sphereCY = centerY + 10;

      // HWI background lettering screen dimensions (matches .gbg__hwi-svg)
      let svgW = Math.min(width * 0.88, 1150);
      let svgH = svgW * (340 / 900);
      if (svgH > height * 0.56) {
        svgH = height * 0.56;
        svgW = svgH * (900 / 340);
      }
      const hwiParallax = (scrollY * 0.02) % 60 - 30;
      const hwiHalfW = svgW * 0.5;
      const hwiHalfH = svgH * 0.5;

      // Bonsai Tree parameters (Black section)
      // Sits slightly right of center to frame foreground content perfectly
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

        const sx = centerX + x2 * sphereRadius;
        const sy = sphereCY - y2 * sphereRadius;
        const sz = z2;

        const hx = centerX + soa.sHwiX[i] * hwiHalfW;
        const hy = centerY + hwiParallax + soa.sHwiY[i] * hwiHalfH;

        // ----------------------------------------------------
        // SCENE 0 -> 1: Hero Cosmic Dust -> 3D Celestial Globe -> Direct HWI Morph
        // ----------------------------------------------------
        if (sceneProgress <= 1.0) {
          const t = Math.max(0, Math.min(1, sceneProgress));

          if (t < 1.0) {
            // Hero Dust -> 3D Celestial Globe (active only when sectionParticleAlpha > 0)
            const p0x = soa.s0x[i];
            const p0y = soa.s0y[i] + drift;

            x = p0x + (sx - p0x) * t;
            y = p0y + (sy - p0y) * t;

            const sphereAlpha = (sz + 1.2) / 2.2 * soa.s1density[i];
            const heroAlpha = 0.45;
            opacity = heroAlpha + (sphereAlpha - heroAlpha) * t;

            cr = Math.round(210 + t * 29);
            cg = Math.round(215 - t * 147);
            cb = Math.round(225 - t * 157);
          } else {
            // At sceneProgress = 1.0 (Chapter 02):
            if (p === 0) {
              x = sx;
              y = sy;
              opacity = (sz + 1.2) / 2.2 * soa.s1density[i];
              cr = 239;
              cg = 68;
              cb = 68;
            } else {
              const easedP = p * p * (3 - 2 * p); // smooth easeInOut cubic

              // Globe flattening and compression
              const zFlatten = Math.max(0, 1 - Math.min(1, p / 0.35) * 0.95);
              const yFlatten = 1 - Math.min(1, p / 0.35) * 0.12;

              // Curving arc during transit
              const arcFactor = Math.sin(p * Math.PI);
              const arcX = arcFactor * (soa.stagger[i] - 0.25) * 45;
              const arcY = arcFactor * (soa.sHwiDensity[i] - 0.5) * 35;

              const curGlobeX = centerX + x2 * sphereRadius;
              const curGlobeY = sphereCY - y2 * sphereRadius * yFlatten;

              // Direct interpolation from Globe to HWI lettering
              x = curGlobeX * (1 - easedP) + hx * easedP + arcX;
              y = curGlobeY * (1 - easedP) + hy * easedP + arcY;

              const isHwiContour = soa.sHwiIsBorder[i] === 1;
              const hwiAlpha = isHwiContour
                ? 0.92 + Math.sin(time * 2.2 + i) * 0.08
                : 0.38 * soa.sHwiDensity[i];
              const hwiSize = isHwiContour ? 2.4 : 1.6;
              const hwiR = isHwiContour ? (i % 3 === 0 ? 255 : 239) : 235;
              const hwiG = isHwiContour ? (i % 3 === 0 ? 255 : 68) : 225;
              const hwiB = isHwiContour ? (i % 3 === 0 ? 255 : 68) : 230;

              const sphereAlpha = (sz * zFlatten + 1.2) / 2.2 * soa.s1density[i];
              opacity = sphereAlpha * (1 - easedP) + hwiAlpha * easedP;
              size = soa.size[i] * (1 - easedP) + hwiSize * easedP;
              cr = Math.round(239 * (1 - easedP) + hwiR * easedP);
              cg = Math.round(68 * (1 - easedP) + hwiG * easedP);
              cb = Math.round(68 * (1 - easedP) + hwiB * easedP);
            }
          }
        }
        // ----------------------------------------------------
        // SCENE 1 -> 2: HWI Lettering -> White Section Ambient Field
        // ----------------------------------------------------
        else if (sceneProgress < 2.0) {
          const t = sceneProgress - 1.0; // 0.0 -> 1.0
          let wx = centerX, wy = centerY;
          if (targetsReady) {
            wx = soa.s2x[i];
            wy = soa.s2y[i] + drift;
          }

          // Disperse smoothly from HWI lettering into white section kinetic field
          x = hx + (wx - hx) * t;
          y = hy + (wy - hy) * t;

          const isHwiContour = soa.sHwiIsBorder[i] === 1;
          const hwiStartAlpha = isHwiContour ? 0.92 : 0.38 * soa.sHwiDensity[i];
          const whiteFieldAlpha = isWhiteBg ? 0.32 : 0.55;
          opacity = hwiStartAlpha * (1 - t) + whiteFieldAlpha * t;

          const targetSize = isWhiteBg ? 1.8 : 2.2;
          const hwiStartSize = isHwiContour ? 2.4 : 1.6;
          size = hwiStartSize * (1 - t) + targetSize * t;

          cr = isWhiteBg ? 180 : 239;
          cg = isWhiteBg ? 40 : 68;
          cb = isWhiteBg ? 40 : 68;
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

        opacity *= sectionParticleAlpha;
        if (opacity <= 0.02) continue;
        if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;

        const finalOpacity = isWhiteBg ? Math.min(0.85, opacity * 0.8) : Math.min(1.0, opacity);

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

      {/* Layer 2.5: PERMANENT HWI WATERMARK (ALWAYS VISIBLE across entire site) */}
      <div className="gbg__hwi-layer" ref={hwiLayerRef}>
        <svg
          viewBox="0 0 900 340"
          className="gbg__hwi-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hwi-dots" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.35" fill="var(--hwi-dot-fill, rgba(255,255,255,0.7))" />
            </pattern>
            <mask id="hwi-text-mask">
              <text
                x="50%"
                y="70%"
                textAnchor="middle"
                fontSize="280"
                fontWeight="900"
                fontFamily="var(--font-satoshi), sans-serif"
                fill="white"
                letterSpacing="-0.04em"
              >
                HWI
              </text>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#hwi-dots)" mask="url(#hwi-text-mask)" />
          <text
            x="50%"
            y="70%"
            textAnchor="middle"
            fontSize="280"
            fontWeight="900"
            fontFamily="var(--font-satoshi), sans-serif"
            fill="none"
            stroke="var(--hwi-stroke, rgba(255,255,255,0.25))"
            strokeWidth="1.5"
            letterSpacing="-0.04em"
          >
            HWI
          </text>
        </svg>
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
