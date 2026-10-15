'use client';

import { useState, useRef } from 'react';
import { TeamMemberData } from '@/data/team';
import './InteractiveTeamCard.css';

interface InteractiveTeamCardProps {
  member: TeamMemberData;
  isDimmed: boolean;
  onFaceHover: (id: string | null) => void;
  onOpenModal: (member: TeamMemberData) => void;
}

export function InteractiveTeamCard({
  member,
  isDimmed,
  onFaceHover,
  onOpenModal,
}: InteractiveTeamCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mobileTapped, setMobileTapped] = useState(false);
  const [popupPos, setPopupPos] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);

  const calculatePopupPosition = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const style: React.CSSProperties = {};

    // Mobile fallback: position right below card
    if (vw < 768) {
      style.top = 'calc(100% + 8px)';
      style.left = '0';
      style.right = '0';
      style.width = '100%';
      setPopupPos(style);
      return;
    }

    const popupW = 280;

    // Horizontal collision detection (Part 15):
    // If card is on right half or would overflow right edge -> show to LEFT of card
    if (rect.right + popupW + 24 > vw) {
      style.right = 'calc(100% + 14px)';
      style.left = 'auto';
    } else {
      // Show to RIGHT of card
      style.left = 'calc(100% + 14px)';
      style.right = 'auto';
    }

    // Vertical collision detection:
    if (rect.top + 240 > vh) {
      style.bottom = '0';
      style.top = 'auto';
    } else {
      style.top = '0';
      style.bottom = 'auto';
    }

    setPopupPos(style);
  };

  const handleMouseEnter = () => {
    calculatePopupPosition();
    setIsHovered(true);
    onFaceHover(member.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onFaceHover(null);
  };

  const handleClick = () => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch && !mobileTapped) {
      calculatePopupPosition();
      setMobileTapped(true);
      setIsHovered(true);
      onFaceHover(member.id);
      return;
    }
    onOpenModal(member);
  };

  const firstName = member.name.split(' ')[0].toUpperCase();

  return (
    <div
      ref={cardRef}
      className={`team-card-wrapper ${isDimmed ? 'team-card-wrapper--dimmed' : ''}`}
      data-cursor="team"
      data-cursor-label={`VIEW ${firstName}`}
    >
      <div
        className="team-card-inner"
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-label={`View profile for ${member.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenModal(member);
          }
        }}
      >
        {/* Face / Photo Container */}
        <div
          className={`team-face-container team-member-face ${isHovered ? 'team-face-container--active' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          data-team-face="true"
        >
          {member.image ? (
            <img src={member.image} alt={member.name} className="team-face-img" />
          ) : (
            <span className="team-face-initials">{member.initials}</span>
          )}

          <div className="team-face-spotlight" />
          <div className="team-face-vignette" />
        </div>

        {/* Regular Base Info */}
        <div className="team-card-info">
          <h4 className="team-card-name">{member.name}</h4>
          <span className="team-card-role">{member.role}</span>
        </div>

        {/* INTELLIGENT FACE HOVER POPUP DETAIL CARD (Part 14, 15) */}
        {isHovered && (
          <div className="team-popup-card" style={popupPos}>
            <div className="team-popup-header">
              <div className="team-popup-name">{member.name}</div>
              <div className="team-popup-role">{member.role}</div>
            </div>
            <div className="team-popup-dept">{member.department}</div>
            <p className="team-popup-bio">{member.bio}</p>
            <div className="team-popup-footer">
              <span className="team-popup-hint">→ VIEW PROFILE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Modal component for full profile
export function TeamProfileModal({
  member,
  onClose,
}: {
  member: TeamMemberData | null;
  onClose: () => void;
}) {
  if (!member) return null;

  return (
    <div className="team-modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="team-modal" onClick={(e) => e.stopPropagation()}>
        <button className="team-modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="team-modal-content">
          <div className="team-modal-top">
            <div className="team-modal-avatar">
              {member.image ? (
                <img src={member.image} alt={member.name} />
              ) : (
                <span>{member.initials}</span>
              )}
            </div>
            <div className="team-modal-heading">
              <h3>{member.name}</h3>
              <p className="team-modal-role">{member.role} // {member.department}</p>
            </div>
          </div>

          <p className="team-modal-bio">{member.bio}</p>

          {member.achievements && member.achievements.length > 0 && (
            <div>
              <div className="team-modal-achievements-title">CONTRIBUTIONS & HIGHLIGHTS</div>
              <ul className="team-modal-achievements">
                {member.achievements.map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>
          )}

          {member.socials && (
            <div className="team-modal-socials">
              {member.socials.github && (
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-modal-social-btn"
                >
                  GitHub ↗
                </a>
              )}
              {member.socials.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-modal-social-btn"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
