'use client';

import Image from 'next/image';
import { User, Globe, Camera } from 'lucide-react';
import './TeamMember.css';

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  instagram?: string;
}

export interface TeamMemberProps {
  name: string;
  role: string;
  photoUrl: string;
  socials?: SocialLinks;
  isLeadership?: boolean;
}

export function TeamMember({ name, role, photoUrl, socials, isLeadership = false }: TeamMemberProps) {
  return (
    <div className={`team-member ${isLeadership ? 'team-member--leadership' : ''}`}>
      <div className="team-member__photo-container">
        {photoUrl ? (
          <Image 
            src={photoUrl} 
            alt={name} 
            fill 
            className="team-member__photo"
            sizes={isLeadership ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"}
          />
        ) : (
          <div className="team-member__photo-placeholder" />
        )}
      </div>
      
      <div className="team-member__info">
        <h3 className="type-heading-2 text-primary">{name}</h3>
        <p className="type-eyebrow text-accent">{role}</p>
        
        {socials && (
          <div className="team-member__socials">
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s LinkedIn`}>
                <User size={18} />
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s GitHub`}>
                <Globe size={18} />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s Instagram`}>
                <Camera size={18} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
