'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { HWI_INDIA_LOCATIONS, IndiaLocation } from '@/data/indiaLocations';
import { indiaStore } from '@/lib/indiaStore';
import { cursorStore } from '@/lib/cursorStore';
import './IndiaMapOverlay.css';

// Sequential reveal thresholds for the 5 locations as India finishes forming (0.78 -> 0.96)
// Order: MUMBAI -> PUNE -> BENGALURU -> DELHI NCR -> HYDERABAD
const NODE_REVEAL_THRESHOLDS: Record<string, number> = {
  mumbai: 0.78,
  pune: 0.82,
  bengaluru: 0.86,
  delhi: 0.90,
  hyderabad: 0.94,
};

export function IndiaMapOverlay() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(240);
  const [morphProgress, setMorphProgress] = useState(0);
  const [activeLoc, setActiveLoc] = useState<IndiaLocation | null>(null);
  const [hoveredLoc, setHoveredLoc] = useState<IndiaLocation | null>(null);
  const [isFormed, setIsFormed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Resize listener to sync node scale with GlobalBackground
  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 768;
      setIsMobile(mobile);
      // Matches the exact canvas scaling in GlobalBackground
      const calculatedScale = Math.min(w, h) * (mobile ? 0.38 : 0.34);
      setScale(calculatedScale);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Subscribe to indiaStore morph progress
  useEffect(() => {
    const unsub = indiaStore.subscribe(() => {
      setActiveLoc(indiaStore.activeLocation);
      setHoveredLoc(indiaStore.hoveredLocation);
      setMorphProgress(indiaStore.morphProgress);
      setIsFormed(indiaStore.morphProgress >= 0.78);
    });
    return () => unsub();
  }, []);

  const handleSelect = useCallback((loc: IndiaLocation) => {
    if (activeLoc?.id === loc.id) {
      indiaStore.selectLocation(null);
    } else {
      indiaStore.selectLocation(loc);
    }
  }, [activeLoc]);

  const handleHover = useCallback((loc: IndiaLocation | null) => {
    indiaStore.hoverLocation(loc);
    if (loc) {
      cursorStore.setVariant('link', loc.name);
    } else {
      cursorStore.reset();
    }
  }, []);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    indiaStore.selectLocation(null);
  }, []);

  const displayedLoc = activeLoc || hoveredLoc;
  const headerOpacity = morphProgress < 0.35 ? 0 : Math.min(1.0, (morphProgress - 0.35) / 0.25);

  return (
    <div
      className={`india-stage ${isFormed ? 'india-stage--active' : ''}`}
      id="india-map-stage"
      ref={stageRef}
      aria-label="Interactive HWI India Network Map"
    >
      {/* Non-boxed Stage Narrative Header (Fades in as India emerges) */}
      <div
        className="india-header"
        style={{
          opacity: headerOpacity,
          transform: `translateY(${Math.max(0, (1 - headerOpacity) * 16)}px)`,
          pointerEvents: headerOpacity > 0.4 ? 'auto' : 'none',
        }}
      >
        <div className="india-header__eyebrow">
          <span className="india-header__pulse" />
          <span>HWI ALLIANCE // CHAPTER 02</span>
        </div>
        <h3 className="india-header__title">Pan-India Developer Ecosystem</h3>
        <p className="india-header__subtitle">
          From our flagship student chapter in Mumbai to builders across the nation.
        </p>
      </div>

      {/* Coordinate Canvas Surface Anchor */}
      <div className="india-surface">
        {/* Geographic Location Nodes (Sequentially revealed after India silhouette settles) */}
        {HWI_INDIA_LOCATIONS.map((loc) => {
          const threshold = NODE_REVEAL_THRESHOLDS[loc.id] ?? 0.80;
          const isRevealed = morphProgress >= threshold;
          const nodeT = isRevealed ? Math.min(1.0, (morphProgress - threshold) / 0.04) : 0;
          const nodeScale = 0.6 + 0.4 * nodeT;
          const nodeOpacity = nodeT;
          const isInteractive = nodeT > 0.5;

          const isSelected = activeLoc?.id === loc.id;
          const isHovered = hoveredLoc?.id === loc.id;
          const isCurrent = isSelected || isHovered;

          // Intelligently calculate tooltip / panel placement relative to node
          const isWest = loc.normX < 0;
          const isSouth = loc.normY > 0.3;

          return (
            <div
              key={loc.id}
              className={`india-node ${isCurrent ? 'india-node--current' : ''} ${isSelected ? 'india-node--selected' : ''} ${loc.isFlagship ? 'india-node--flagship' : ''}`}
              style={{
                left: `calc(50% + ${loc.normX * scale}px)`,
                top: `calc(50% + ${loc.normY * scale}px)`,
                opacity: nodeOpacity,
                transform: `translate(-50%, -50%) scale(${nodeScale})`,
                pointerEvents: isInteractive ? 'auto' : 'none',
              }}
              onClick={() => handleSelect(loc)}
              onMouseEnter={() => handleHover(loc)}
              onMouseLeave={() => handleHover(null)}
              onFocus={() => handleHover(loc)}
              onBlur={() => handleHover(null)}
              tabIndex={isInteractive ? 0 : -1}
              role="button"
              aria-label={`HWI Hub: ${loc.name}. ${loc.eventsCount} events, ${loc.participantsCount} participants.`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(loc);
                }
              }}
            >
              {/* Node Beacon (Restrained pulse + expanding ring) */}
              <div className="india-node__beacon">
                <span className="india-node__ring" />
                <span className="india-node__ring-outer" />
                <span className="india-node__core" />
              </div>

              {/* City Name Label */}
              <span className={`india-node__label ${isWest ? 'india-node__label--west' : 'india-node__label--east'}`}>
                {loc.name}
              </span>

              {/* Quick Hover Preview (Desktop only when not selected) */}
              {!activeLoc && isHovered && !isMobile && isInteractive && (
                <div
                  className={`india-tooltip ${isWest ? 'india-tooltip--right' : 'india-tooltip--left'} ${isSouth ? 'india-tooltip--up' : 'india-tooltip--down'}`}
                >
                  <div className="india-tooltip__city">{loc.name}</div>
                  <div className="india-tooltip__subtitle">{loc.subtitle}</div>
                  <div className="india-tooltip__stats">
                    <span>{loc.eventsCount} EVENTS</span>
                    <span>•</span>
                    <span>{loc.participantsCount} BUILDERS</span>
                  </div>
                  <div className="india-tooltip__hint">Click for details →</div>
                </div>
              )}
            </div>
          );
        })}

        {/* Detailed Expanded Floating Card (On Click or Mobile Tap) */}
        {activeLoc && (
          <div
            className="india-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={`${activeLoc.name} Hub Details`}
          >
            <div className="india-panel__header">
              <div>
                {activeLoc.isFlagship && <span className="india-panel__flagship">★ FLAGSHIP CHAPTER</span>}
                <h4 className="india-panel__title">{activeLoc.name}</h4>
                <p className="india-panel__subtitle">{activeLoc.subtitle}</p>
              </div>
              <button
                className="india-panel__close"
                onClick={handleClose}
                aria-label="Close location information"
              >
                ✕
              </button>
            </div>

            <div className="india-panel__divider" />

            <div className="india-panel__stats">
              <div className="india-panel__stat-box">
                <span className="india-panel__stat-val">{activeLoc.eventsCount}</span>
                <span className="india-panel__stat-lbl">EVENTS</span>
              </div>
              <div className="india-panel__stat-box">
                <span className="india-panel__stat-val">{activeLoc.participantsCount}</span>
                <span className="india-panel__stat-lbl">PARTICIPANTS</span>
              </div>
              <div className="india-panel__stat-box">
                <span className="india-panel__stat-val">ACTIVE</span>
                <span className="india-panel__stat-lbl">NETWORK</span>
              </div>
            </div>

            <div className="india-panel__latest">
              <span className="india-panel__latest-tag">LATEST EVENT</span>
              <p className="india-panel__latest-name">{activeLoc.latestEvent}</p>
            </div>

            <p className="india-panel__desc">{activeLoc.description}</p>

            <Link
              href="/events"
              className="india-panel__cta"
              data-cursor="link"
              data-cursor-label="EVENTS"
            >
              EXPLORE EVENTS →
            </Link>
          </div>
        )}
      </div>

      {/* Semantic Geographic Quick-Select Hub Pills */}
      <div className="india-pillbar" role="tablist" aria-label="Select HWI Hub">
        {HWI_INDIA_LOCATIONS.map((loc) => {
          const isActive = displayedLoc?.id === loc.id;
          return (
            <button
              key={loc.id}
              className={`india-pill ${isActive ? 'india-pill--active' : ''}`}
              onClick={() => handleSelect(loc)}
              onMouseEnter={() => handleHover(loc)}
              onMouseLeave={() => handleHover(null)}
              role="tab"
              aria-selected={isActive}
              data-cursor="link"
              data-cursor-label={loc.name}
            >
              <span className="india-pill__dot" />
              <span>{loc.name}</span>
              {loc.isFlagship && <span className="india-pill__star">★</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
