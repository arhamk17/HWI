'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Maximize2, X } from 'lucide-react';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';
import './Tenure2025Experience.css';

export function Tenure2025Experience() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="tenure-page">
      {/* Ambient Radial Background Glows */}
      <div className="tenure-ambient-glow" aria-hidden="true" />
      <div className="tenure-ambient-glow-secondary" aria-hidden="true" />

      <div className="tenure-container">
        {/* Navigation Bar */}
        <div className="tenure-nav-bar">
          <Link href="/#team" className="tenure-back-btn" data-cursor="link">
            <ArrowLeft size={14} />
            <span>Back to Meet The Core</span>
          </Link>
          <span className="tenure-code-badge">TENURE ARCHIVE // 2025–26</span>
        </div>

        {/* Minimal Header */}
        <header className="tenure-hero tenure-hero--minimal">
          <h1 className="tenure-hero__title">
            HWI TENURE <span>2025–26</span>
          </h1>
        </header>

        {/* ========================================================
            THE MAIN CENTERPIECE: EXPANSIVE TEAM PHOTOGRAPH
            ======================================================== */}
        <section className="tenure-showcase-section tenure-showcase-section--minimal" aria-label="Official Cohort Photograph">
          <div className="tenure-photo-frame-wrap">
            <div
              className="tenure-photo-frame"
              onClick={() => setIsLightboxOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsLightboxOpen(true)}
              aria-label="Click to enlarge HWI Tenure 2025-26 Team photograph"
            >
              {/* Corner HUD Brackets */}
              <span className="tenure-hud-corner tenure-hud-corner--tl" />
              <span className="tenure-hud-corner tenure-hud-corner--tr" />
              <span className="tenure-hud-corner tenure-hud-corner--bl" />
              <span className="tenure-hud-corner tenure-hud-corner--br" />

              {/* The Big Team Image */}
              <img
                src="/images/events/learn_it_tour_image12.jpeg"
                alt="HWI Tenure 2025–26"
                className="tenure-main-img"
                loading="eager"
                decoding="async"
              />

              {/* Subtle hover vignette hint */}
              <div className="tenure-frame-hover-hint">
                <Maximize2 size={15} />
                <span>Click to Expand</span>
              </div>
            </div>

            {/* Below Image: Strictly Just "HWI TENURE 2025–26" */}
            <div className="tenure-minimal-caption-bar">
              <span className="tenure-live-beacon" />
              <h2 className="tenure-minimal-title">HWI TENURE 2025–26</h2>
            </div>
          </div>
        </section>

        {/* Bottom Action */}
        <div className="tenure-bottom-action">
          <KokonutButton href="/#team" variant="primary">
            Return to Meet The Core
          </KokonutButton>
        </div>
      </div>

      {/* ========================================================
          FULLSCREEN LIGHTBOX MODAL
          ======================================================== */}
      {isLightboxOpen && (
        <div
          className="tenure-lightbox-backdrop"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen HWI Tenure 2025-26 Team Image View"
        >
          <div
            className="tenure-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="tenure-lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen view"
            >
              <X size={20} />
            </button>

            <div className="tenure-lightbox-img-wrap">
              <img
                src="/images/events/learn_it_tour_image12.jpeg"
                alt="HWI Tenure 2025–26"
                className="tenure-lightbox-img"
              />
            </div>

            <div className="tenure-lightbox-caption-bar">
              <h3 className="tenure-lightbox-title">
                HWI TENURE 2025–26
              </h3>
              <span className="tenure-lightbox-badge">HIGH RESOLUTION ARCHIVE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
