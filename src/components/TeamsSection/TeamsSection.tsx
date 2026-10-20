'use client';

import { useState, useId } from 'react';
import {
  DEPARTMENTS,
  DepartmentMember,
  CORE_LEADERS,
  EXECUTIVE_MEMBERS,
} from '@/data/teamDepartments';
import { KokonutBadge } from '@/components/KokonutUI/KokonutBadge';
import { Users, Award, Shield, Film, ChevronRight } from 'lucide-react';
import './TeamsSection.css';

// ─── Inline SVG Brand Icons ─────────────────────────────
function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// ─── Leadership Aura Palettes (Exact match to reference video) ────────
export interface LeadershipPalette {
  primary: string;
  secondary: string;
  gradient: string;
}

export function getLeadershipPalette(member: DepartmentMember, deptId?: string): LeadershipPalette {
  const roleLower = member.role.toLowerCase();

  // President (Crimson / Hot Red to Warm Sunset Orange)
  if (roleLower.includes('president') && !roleLower.includes('vice')) {
    return {
      primary: '#FF1E56',
      secondary: '#FF6B00',
      gradient: 'linear-gradient(135deg, #FF1E56 0%, #FF6B00 100%)',
    };
  }

  // Vice-President (Electric Cyan to Neon Mint / Emerald Green)
  if (roleLower.includes('vice') || roleLower.includes('vice-president')) {
    return {
      primary: '#00D2FF',
      secondary: '#10B981',
      gradient: 'linear-gradient(135deg, #00D2FF 0%, #10B981 100%)',
    };
  }

  const dId = (deptId || member.department || '').toLowerCase();

  // Technical Lead (Vivid Magenta / Violet to Electric Blue)
  if (dId.includes('tech') || roleLower.includes('tech')) {
    return {
      primary: '#D946EF',
      secondary: '#2563EB',
      gradient: 'linear-gradient(135deg, #D946EF 0%, #2563EB 100%)',
    };
  }

  // Social Media Lead (Hot Pink to Bright Purple)
  if (dId.includes('social') || roleLower.includes('social')) {
    return {
      primary: '#EC4899',
      secondary: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    };
  }

  // Design Lead (Electric Rose / Fuchsia to Golden Amber)
  if (dId.includes('design') || roleLower.includes('design')) {
    return {
      primary: '#F43F5E',
      secondary: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F43F5E 0%, #F59E0B 100%)',
    };
  }

  // Photography / Video Editing Lead (Electric Azure to Deep Indigo)
  if (dId.includes('photo') || dId.includes('edit') || roleLower.includes('edit')) {
    return {
      primary: '#00C0FF',
      secondary: '#4F46E5',
      gradient: 'linear-gradient(135deg, #00C0FF 0%, #4F46E5 100%)',
    };
  }

  // PR & Marketing Lead (Ruby Rose to Violet)
  if (dId.includes('pr') || dId.includes('market') || roleLower.includes('pr')) {
    return {
      primary: '#E11D48',
      secondary: '#9333EA',
      gradient: 'linear-gradient(135deg, #E11D48 0%, #9333EA 100%)',
    };
  }

  // Event & Logistics Lead (Flame Orange to Sunset Amber)
  if (dId.includes('event') || dId.includes('logistic') || roleLower.includes('event')) {
    return {
      primary: '#FF5722',
      secondary: '#F59E0B',
      gradient: 'linear-gradient(135deg, #FF5722 0%, #F59E0B 100%)',
    };
  }

  // Documentation Lead (Emerald Green to Cyan)
  if (dId.includes('doc') || roleLower.includes('doc')) {
    return {
      primary: '#10B981',
      secondary: '#06B6D4',
      gradient: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
    };
  }

  // Sponsorship & Partnerships Lead (Gold to Ruby Crimson)
  if (dId.includes('sponsor') || dId.includes('partner')) {
    return {
      primary: '#F59E0B',
      secondary: '#E11D48',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #E11D48 100%)',
    };
  }

  return {
    primary: '#F59E0B',
    secondary: '#FF1E56',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FF1E56 100%)',
  };
}

function MemberSocialLinks({ member }: { member: DepartmentMember }) {
  if (!member.socials) return null;
  return (
    <div className="teams-card-socials" onClick={(e) => e.stopPropagation()}>
      {member.socials.github && (
        <a
          href={member.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="teams-card-social-link"
          aria-label={`${member.name}'s GitHub`}
        >
          <GithubIcon size={12} />
        </a>
      )}
      {member.socials.linkedin && (
        <a
          href={member.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="teams-card-social-link"
          aria-label={`${member.name}'s LinkedIn`}
        >
          <LinkedinIcon size={12} />
        </a>
      )}
      {member.socials.instagram && (
        <a
          href={member.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="teams-card-social-link"
          aria-label={`${member.name}'s Instagram`}
        >
          <InstagramIcon size={12} />
        </a>
      )}
    </div>
  );
}

interface TeamsSectionProps {
  onOpenCinematic?: () => void;
}

export function TeamsSection({ onOpenCinematic }: TeamsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'core' | 'exec'>('all');
  const baseId = useId();

  const totalCore = CORE_LEADERS.length;
  const totalExec = EXECUTIVE_MEMBERS.length;
  const leadershipDept = DEPARTMENTS[0];
  const otherDepts = DEPARTMENTS.slice(1);

  return (
    <div className="teams-view" id="teams-directory">
      <div className="teams-view__glow teams-view__glow--top" aria-hidden="true" />
      <div className="teams-view__glow teams-view__glow--mid" aria-hidden="true" />

      <div className="container teams-view__container">
        <header className="teams-hero">
          <div className="teams-hero__badge-row">
            <KokonutBadge variant="accent" dot>
              HWI // BVUDET-NM CHAPTER
            </KokonutBadge>
            <span className="teams-hero__tenure">TENURE 2026–27</span>
          </div>

          <h1 className="teams-hero__title">
            THE PEOPLE<br />
            <span className="text-accent">BEHIND HWI</span>
          </h1>

          <p className="teams-hero__tagline">
            Meet the 2026–27 Chapter Core Team and all departmental Executive Members driving developer culture,
            open-source initiatives, design systems, and 24-hour hackathons.
          </p>

          <div className="teams-stats">
            <div className="teams-stat">
              <span className="teams-stat__num">{String(totalCore).padStart(2, '0')}</span>
              <span className="teams-stat__label">Core Leadership</span>
            </div>
            <div className="teams-stat__divider" />
            <div className="teams-stat">
              <span className="teams-stat__num">{String(totalExec).padStart(2, '0')}</span>
              <span className="teams-stat__label">Executive Members</span>
            </div>
            <div className="teams-stat__divider" />
            <div className="teams-stat">
              <span className="teams-stat__num">09</span>
              <span className="teams-stat__label">Departments</span>
            </div>
            <div className="teams-stat__divider" />
            <div className="teams-stat">
              <span className="teams-stat__num">100%</span>
              <span className="teams-stat__label">Student-Driven</span>
            </div>
          </div>

          <div className="teams-nav-bar">
            <div className="teams-filter-pills" role="tablist" aria-label="Team Level Filter">
              <button
                role="tab"
                aria-selected={activeFilter === 'all'}
                className={`teams-filter-pill ${activeFilter === 'all' ? 'teams-filter-pill--active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                <Users size={14} />
                <span>All Members ({totalCore + totalExec})</span>
              </button>

              <button
                role="tab"
                aria-selected={activeFilter === 'core'}
                className={`teams-filter-pill ${activeFilter === 'core' ? 'teams-filter-pill--active' : ''}`}
                onClick={() => setActiveFilter('core')}
              >
                <Shield size={14} />
                <span>Core Team ({totalCore})</span>
              </button>

              <button
                role="tab"
                aria-selected={activeFilter === 'exec'}
                className={`teams-filter-pill ${activeFilter === 'exec' ? 'teams-filter-pill--active' : ''}`}
                onClick={() => setActiveFilter('exec')}
              >
                <Award size={14} />
                <span>Executive Members ({totalExec})</span>
              </button>
            </div>

            {onOpenCinematic && (
              <button
                className="teams-cinematic-trigger"
                onClick={onOpenCinematic}
                aria-label="Switch to Cinematic Showcase mode"
              >
                <Film size={14} />
                <span>Interactive Showcase</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </header>

        {/* Level A: Core Team */}
        {(activeFilter === 'all' || activeFilter === 'core') && (
          <section className="team-level" id="core-team" aria-labelledby={`${baseId}-core-heading`}>
            <div className="team-level__header">
              <span className="team-level__tag">LEVEL A // LEADERSHIP</span>
              <h2 id={`${baseId}-core-heading`} className="team-level__title">
                Chapter Core Team 2026–27
              </h2>
              <p className="team-level__desc">
                Leading chapter operations, community growth, technical curriculum, visual identities,
                and nationwide hackathon ecosystems.
              </p>
            </div>

            <div className="apex-leadership">
              <div className="apex-leadership__bar">
                <span className="apex-leadership__label">CHAPTER LEADERSHIP</span>
                <span className="apex-leadership__line" />
              </div>

              <div className="apex-leadership__grid">
                {leadershipDept.members.map((leader: DepartmentMember) => {
                  const palette = getLeadershipPalette(leader, 'core-leadership');
                  return (
                    <article
                      key={leader.id}
                      className="apex-card apex-card--lead"
                      tabIndex={0}
                      style={{
                        ['--lead-primary' as string]: palette.primary,
                        ['--lead-secondary' as string]: palette.secondary,
                        ['--lead-gradient' as string]: palette.gradient,
                      }}
                    >
                      <div className="leadership-aura-container" aria-hidden="true">
                        <div
                          className="leadership-aura-glow"
                          style={{ background: palette.gradient }}
                        />
                      </div>

                      <div className="apex-card__avatar-wrap">
                        <div className="apex-card__avatar">
                          {leader.image ? (
                            <img
                              src={leader.image}
                              alt={leader.name}
                              className="apex-card__img"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <span className="apex-card__initials">{leader.initials}</span>
                          <span className="apex-card__watermark">HWI // LEADERSHIP</span>
                        </div>
                        <div
                          className="apex-card__avatar-glow"
                          style={{
                            background: `radial-gradient(circle, ${palette.primary}44 0%, transparent 70%)`
                          }}
                        />
                      </div>

                      <div className="apex-card__content">
                        <div className="apex-card__badge-row">
                          <span
                            className="apex-card__role-pill"
                            style={{ background: palette.gradient }}
                          >
                            {leader.role}
                          </span>
                          <span className="apex-card__dept-pill">Core Governance</span>
                        </div>
                        <h3 className="apex-card__name">{leader.name}</h3>
                        {leader.bio && <p className="apex-card__bio">{leader.bio}</p>}
                        <MemberSocialLinks member={leader} />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="core-depts">
              <div className="core-depts__bar">
                <span className="core-depts__label">DEPARTMENT HEADS & CO-HEADS</span>
                <span className="core-depts__line" />
              </div>

              <div className="core-depts__grid">
                {otherDepts.map((dept) => {
                  const heads = dept.members.filter((m) => m.rank === 'head' || m.rank === 'co-head');
                  return (
                    <div key={dept.id} className="core-dept-group">
                      <div className="core-dept-group__header">
                        <h3 className="core-dept-group__title">{dept.name}</h3>
                        <p className="core-dept-group__tagline">{dept.tagline}</p>
                      </div>

                      <div className="core-dept-group__cards">
                        {heads.map((member: DepartmentMember) => {
                          const palette = getLeadershipPalette(member, dept.id);
                          return (
                            <article
                              key={member.id}
                              className="core-card core-card--lead"
                              tabIndex={0}
                              style={{
                                ['--lead-primary' as string]: palette.primary,
                                ['--lead-secondary' as string]: palette.secondary,
                                ['--lead-gradient' as string]: palette.gradient,
                              }}
                            >
                              <div className="leadership-aura-container leadership-aura-container--compact" aria-hidden="true">
                                <div
                                  className="leadership-aura-glow"
                                  style={{ background: palette.gradient }}
                                />
                              </div>

                              <div className="core-card__avatar">
                                {member.image ? (
                                  <img
                                    src={member.image}
                                    alt={member.name}
                                    className="core-card__img"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : null}
                                <span className="core-card__initials">{member.initials}</span>
                                <span className="core-card__watermark">HWI</span>
                              </div>

                              <div className="core-card__info">
                                <span
                                  className="core-card__role"
                                  style={{ color: palette.primary }}
                                >
                                  {member.role}
                                </span>
                                <h4 className="core-card__name">{member.name}</h4>
                                <span className="core-card__dept-name">{dept.name}</span>
                                <MemberSocialLinks member={member} />
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Level B: Executive Members */}
        {(activeFilter === 'all' || activeFilter === 'exec') && (
          <section className="team-level team-level--exec" id="executive-members" aria-labelledby={`${baseId}-exec-heading`}>
            <div className="team-level__header">
              <span className="team-level__tag team-level__tag--exec">LEVEL B // EXECUTION</span>
              <h2 id={`${baseId}-exec-heading`} className="team-level__title">
                Executive Members
              </h2>
              <p className="team-level__desc">
                Organized by department, driving codebases, visual identities, video editing, photography,
                logistics planning, and partnerships across campus.
              </p>
            </div>

            <div className="exec-depts">
              {otherDepts.map((dept, deptIdx) => {
                const execs = dept.members.filter((m) => m.rank === 'executive' || (m.role === 'Head of Documentation' && dept.id === 'documentation'));
                if (execs.length === 0) return null;

                return (
                  <div key={dept.id} className="exec-dept-block">
                    <header className="exec-dept-block__header">
                      <div className="exec-dept-block__title-wrap">
                        <span className="exec-dept-block__idx">
                          {String(deptIdx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="exec-dept-block__title">{dept.name}</h3>
                      </div>

                      <div className="exec-dept-block__meta">
                        {dept.tagline && (
                          <p className="exec-dept-block__tagline">{dept.tagline}</p>
                        )}
                        <span className="exec-dept-block__count">
                          {execs.length} {execs.length === 1 ? 'MEMBER' : 'MEMBERS'}
                        </span>
                      </div>
                    </header>

                    <div className="exec-grid">
                      {execs.map((member: DepartmentMember) => (
                        <article key={member.id} className="exec-card" tabIndex={0}>
                          <div className="exec-card__top">
                            <div className="exec-card__avatar">
                              <span className="exec-card__initials">{member.initials}</span>
                            </div>

                            {member.academicYear && (
                              <div className="exec-card__academic-tag">
                                <span className="exec-card__year">{member.academicYear}</span>
                                <span className="exec-card__bullet">•</span>
                                <span className="exec-card__branch">{member.branch}</span>
                              </div>
                            )}
                          </div>

                          <div className="exec-card__info">
                            <h4 className="exec-card__name">{member.name}</h4>
                            <span className={`exec-card__role ${member.role === 'Head of Documentation' ? 'exec-card__role--special' : ''}`}>
                              {member.role}
                            </span>
                            <MemberSocialLinks member={member} />
                          </div>

                          <div className="exec-card__footer">
                            <span className="exec-card__dept-label">{dept.name}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
