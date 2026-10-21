'use client';

import React from 'react';
import Image from 'next/image';

export function AboutIdentity() {
  return (
    <section className="about-section" id="who-we-are">
      <div className="about-container">
        <div className="about-identity__grid">
          {/* Left Text Block */}
          <div className="about-reveal">
            <div className="about-section-eyebrow">
              01 // CHAPTER GENESIS & MANDATE
            </div>
            
            <h2 className="about-identity__heading">
              BRIDGING THE CHASM BETWEEN ACADEMIC THEORY AND PRODUCTION CODE.
            </h2>
            
            <div className="about-identity__prose">
              <p>
                At Bharati Vidyapeeth Department of Engineering and Technology, Navi Mumbai, we recognized that engineering education is incomplete without hands-on creation. As an official chapter of HackWithIndia, our mandate is to cultivate a relentless building culture where raw ideas transform into production code.
              </p>
              <p>
                We believe that technical talent is ubiquitous across Maharashtra, but access to high-stakes hackathon platforms, industry mentorship, and an ambitious peer group is not. We provide students with computing resources, technical bootcamps, and the crucible to test their architectural limits.
              </p>
            </div>

            <div className="about-identity__badges">
              <span className="about-identity__badge-pill">BVUDET-NM CHAPTER CHARTER</span>
              <span className="about-identity__badge-pill">AUTONOMOUS STUDENT-RUN</span>
              <span className="about-identity__badge-pill">PAN-MAHARASHTRA NETWORK</span>
            </div>
          </div>

          {/* Right Real Photographic Composition */}
          <div className="about-reveal about-delay-1">
            <div className="about-identity__frame">
              {/* Corner HUD accents */}
              <div className="about-hud-corner about-hud-corner--tl" />
              <div className="about-hud-corner about-hud-corner--tr" />
              <div className="about-hud-corner about-hud-corner--bl" />
              <div className="about-hud-corner about-hud-corner--br" />

              <div className="about-identity__img-wrapper">
                <Image
                  src="/images/hwMUM1.jpeg"
                  alt="HackWithMumbai 1.0 auditorium packed with student builders at BVUDET Navi Mumbai"
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className="about-identity__hud-bar">
                <span>FIG 01 // HACKWITHMUMBAI 1.0 AUDITORIUM</span>
                <span style={{ color: '#EF4444' }}>340+ BUILDERS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
