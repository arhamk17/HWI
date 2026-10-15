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
                {leadershipDept.members.map((leader: DepartmentMember) => (
                  <article key={leader.id} className="apex-card" tabIndex={0}>
                    <div className="apex-card__avatar-wrap">
                      <div className="apex-card__avatar">
                        <span className="apex-card__initials">{leader.initials}</span>
                        <span className="apex-card__watermark">HWI // LEADERSHIP</span>
                      </div>
                      <div className="apex-card__avatar-glow" />
                    </div>

                    <div className="apex-card__content">
                      <div className="apex-card__badge-row">
                        <span className="apex-card__role-pill">{leader.role}</span>
                        <span className="apex-card__dept-pill">Core Governance</span>
                      </div>
                      <h3 className="apex-card__name">{leader.name}</h3>
                      {leader.bio && <p className="apex-card__bio">{leader.bio}</p>}
                    </div>
                  </article>
                ))}
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
                        {heads.map((member: DepartmentMember) => (
                          <article key={member.id} className="core-card" tabIndex={0}>
                            <div className="core-card__avatar">
                              <span className="core-card__initials">{member.initials}</span>
                              <span className="core-card__watermark">HWI</span>
                            </div>

                            <div className="core-card__info">
                              <span className="core-card__role">{member.role}</span>
                              <h4 className="core-card__name">{member.name}</h4>
                              <span className="core-card__dept-name">{dept.name}</span>
                            </div>
                          </article>
                        ))}
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
