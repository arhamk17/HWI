'use client';

import React from 'react';
import Image from 'next/image';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export function AboutIdentity() {
  return (
    <section className="about-section about-panel-section" id="who-we-are">
      <div className="about-container">
        {/* Framed Interface Panel */}
        <div className="about-panel-frame">
          <div className="about-panel-header">
            <div className="about-panel-header__left">
              <span className="about-panel-indicator" />
              <span className="about-panel-tag">BHARATI VIDYAPEETH UNIVERSITY</span>
              <span className="about-panel-slash">•</span>
              <span className="about-panel-coord">DEPARTMENT OF ENGINEERING & TECHNOLOGY, NAVI MUMBAI</span>
            </div>
            <div className="about-panel-header__right">
              <span className="about-panel-status">CHAPTER GENESIS & PURPOSE</span>
            </div>
          </div>

          <div className="about-identity__grid">
            {/* Left Text Block */}
            <div className="about-reveal">
              <div className="about-section-eyebrow">
                01 // GENESIS & MANDATE
              </div>
              
              <h2 className="about-identity__heading">
                BRIDGING THE CHASM BETWEEN ACADEMIC THEORY AND PRODUCTION CODE.
              </h2>
              
              <div className="about-identity__prose">
                <p>
                  At Bharati Vidyapeeth Department of Engineering and Technology, Navi Mumbai, we recognized that engineering curricula frequently stop at textbook simulations. As an official chapter of HackWithIndia, our mandate is to cultivate an uncompromising building culture where raw student ideas transform into production software.
                </p>
                <p>
                  We believe that technical talent is ubiquitous across Maharashtra, but access to high-stakes hackathons, elite mentorship, and computing infrastructure is not. We provide students with computing resources, technical bootcamps, and the arena to test their engineering velocity.
                </p>
              </div>

              <div className="about-identity__badges">
                <span className="about-identity__badge-pill">BVUDET-NM CHAPTER</span>
                <span className="about-identity__badge-pill" style={{ borderColor: 'rgba(0, 240, 255, 0.3)', color: '#00F0FF' }}>
                  STUDENT-LED INITIATIVE
                </span>
                <span className="about-identity__badge-pill">STATEWIDE COMMUNITY</span>
              </div>
            </div>

            {/* Right Real Photographic Composition */}
            <div className="about-reveal about-delay-1">
              <CardContainer
                maxTilt={3.5}
                lift={4}
                glowColor="rgba(239, 68, 68, 0.2)"
              >
                <CardBody className="about-identity__frame">
                  {/* Corner HUD accents */}
                  <div className="about-hud-corner about-hud-corner--tl" />
                  <div className="about-hud-corner about-hud-corner--tr" />
                  <div className="about-hud-corner about-hud-corner--bl" />
                  <div className="about-hud-corner about-hud-corner--br" />

                  <CardItem translateZ={16} className="about-identity__img-wrapper">
                    <Image
                      src="/images/hwMUM1.jpeg"
                      alt="HackWithMumbai 1.0 auditorium packed with student builders at BVUDET Navi Mumbai"
                      fill
                      sizes="(max-width: 1024px) 100vw, 550px"
                      style={{ objectFit: 'cover' }}
                    />
                  </CardItem>

                  <CardItem translateZ={24} className="about-identity__hud-bar">
                    <span>HACKWITHMUMBAI 1.0 • AUDITORIUM</span>
                    <span style={{ color: '#EF4444' }}>340+ BUILDERS IN SPRINT</span>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
