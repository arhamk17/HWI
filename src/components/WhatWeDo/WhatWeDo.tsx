'use client';

import { useState } from 'react';
import { WHAT_WE_DO_CATEGORIES, WhatWeDoCategory } from '@/data/whatWeDo';
import { whatWeDoStore } from '@/lib/whatWeDoStore';
import './WhatWeDo.css';

export function WhatWeDo() {
  const [activeCategory, setActiveCategory] = useState<WhatWeDoCategory>(WHAT_WE_DO_CATEGORIES[0]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleMouseEnter = (cat: WhatWeDoCategory) => {
    setHoveredId(cat.id);
    whatWeDoStore.setEnvironment(cat.particleMode, cat.id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    whatWeDoStore.setEnvironment(activeCategory.particleMode, activeCategory.id);
  };

  const handleSelect = (cat: WhatWeDoCategory) => {
    setActiveCategory(cat);
    whatWeDoStore.setEnvironment(cat.particleMode, cat.id);
  };

  return (
    <section className="wwd" id="what-we-do">
      <div className="container">
        {/* Section Header */}
        <div className="wwd__header">
          <div className="wwd__kicker-group">
            <span className="wwd__pulse-dot" />
            <p className="type-eyebrow text-accent">DISCOVER HWI CAPABILITIES</p>
          </div>
          <h2 className="type-display text-primary">WHAT WE DO</h2>
          <p className="type-body text-secondary" style={{ maxWidth: '600px', marginTop: '16px' }}>
            Hover over categories to adapt the kinetic background. Select any initiative to explore concrete deliverables and outcomes.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="wwd__layout">
          {/* Left Column: Interactive Categories */}
          <div className="wwd__nav-list" role="tablist">
            {WHAT_WE_DO_CATEGORIES.map((cat) => {
              const isActive = activeCategory.id === cat.id;
              const isHovered = hoveredId === cat.id;
              const isSubdued = hoveredId !== null ? !isHovered : !isActive;

              return (
                <div
                  key={cat.id}
                  className={`wwd__nav-item ${isActive ? 'wwd__nav-item--active' : ''} ${isSubdued ? 'wwd__nav-item--subdued' : ''}`}
                  onMouseEnter={() => handleMouseEnter(cat)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleSelect(cat)}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(cat);
                    }
                  }}
                  data-cursor="link"
                  data-cursor-label={`VIEW ${cat.title}`}
                >
                  <span className="wwd__indicator-bar" />
                  <div className="wwd__nav-left">
                    <span className="wwd__number">{cat.number}</span>
                    <span className="wwd__title">{cat.title}</span>
                  </div>
                  <span className="wwd__arrow">→</span>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Deliverables Panel */}
          <div className="wwd__detail-panel" key={activeCategory.id}>
            <p className="wwd__detail-tagline">{activeCategory.number} // {activeCategory.tagline}</p>
            <h3 className="wwd__detail-title">{activeCategory.title}</h3>
            <p className="wwd__detail-desc">{activeCategory.description}</p>

            <div className="wwd__deliverables-header">
              <span>CORE ARCHITECTURAL INITIATIVES</span>
            </div>

            <div className="wwd__deliverables-grid">
              {activeCategory.deliverables.map((del) => (
                <div key={del.tag} className="wwd__deliverable-item">
                  <span className="wwd__deliverable-tag">{del.tag}</span>
                  <span className="wwd__deliverable-detail">{del.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
