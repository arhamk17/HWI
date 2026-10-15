import React from 'react';

interface PlaceholderProps {
  className?: string;
}

export function Tenure2025Placeholder({ className = '' }: PlaceholderProps) {
  return (
    <svg
      viewBox="0 0 600 340"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <radialGradient id="t25-radial" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#7F1D1D" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0B090E" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="t25-sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#25202D" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0E0C12" stopOpacity="1" />
        </linearGradient>
        <pattern id="t25-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="0.75" fill="rgba(255,255,255,0.18)" />
        </pattern>
      </defs>

      {/* Deep Obsidian Background */}
      <rect width="100%" height="100%" fill="#0D0B12" />
      <rect width="100%" height="100%" fill="url(#t25-radial)" />
      <rect width="100%" height="100%" fill="url(#t25-grid)" />

      {/* Ambient Horizon Glow */}
      <ellipse cx="300" cy="220" rx="240" ry="60" fill="rgba(239, 68, 68, 0.2)" filter="blur(25px)" />

      {/* Abstract Team Group Silhouette */}
      <g transform="translate(100, 110)">
        {/* Center Leader 1 */}
        <circle cx="170" cy="40" r="24" fill="url(#t25-sil)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
        <path d="M125 140 C130 85, 210 85, 215 140 Z" fill="url(#t25-sil)" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />

        {/* Center Leader 2 */}
        <circle cx="230" cy="42" r="24" fill="url(#t25-sil)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <path d="M185 140 C190 87, 270 87, 275 140 Z" fill="url(#t25-sil)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        {/* Flanking Team Silhouette Left */}
        <circle cx="105" cy="55" r="20" fill="url(#t25-sil)" opacity="0.85" />
        <path d="M70 140 C75 95, 140 95, 145 140 Z" fill="url(#t25-sil)" opacity="0.85" />

        <circle cx="50" cy="70" r="18" fill="url(#t25-sil)" opacity="0.65" />
        <path d="M20 140 C25 105, 80 105, 85 140 Z" fill="url(#t25-sil)" opacity="0.65" />

        {/* Flanking Team Silhouette Right */}
        <circle cx="295" cy="55" r="20" fill="url(#t25-sil)" opacity="0.85" />
        <path d="M255 140 C260 95, 330 95, 335 140 Z" fill="url(#t25-sil)" opacity="0.85" />

        <circle cx="350" cy="70" r="18" fill="url(#t25-sil)" opacity="0.65" />
        <path d="M315 140 C320 105, 380 105, 385 140 Z" fill="url(#t25-sil)" opacity="0.65" />
      </g>

      {/* Cybernetic HUD Overlay */}
      <line x1="40" y1="40" x2="120" y2="40" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1.5" />
      <line x1="40" y1="40" x2="40" y2="60" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1.5" />
      <text x="50" y="32" fill="#EF4444" fontSize="10" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.2em">
        RECORD // 2025–2026
      </text>

      <line x1="560" y1="40" x2="480" y2="40" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
      <line x1="560" y1="40" x2="560" y2="60" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
      <text x="445" y="32" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.2em">
        HWI•BVUDET-NM
      </text>

      {/* Bottom Gradient Fade */}
      <rect y="240" width="100%" height="100" fill="url(#bottom-fade)" />
      <defs>
        <linearGradient id="bottom-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B090E" stopOpacity="0" />
          <stop offset="100%" stopColor="#0B090E" stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Tenure2026Placeholder({ className = '' }: PlaceholderProps) {
  return (
    <svg
      viewBox="0 0 600 340"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <radialGradient id="t26-radial" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
          <stop offset="45%" stopColor="#450A0A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0B090E" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="t26-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0A0810" />
      <rect width="100%" height="100%" fill="url(#t26-radial)" />

      {/* Futuristic Ascension Grid */}
      <g stroke="rgba(239,68,68,0.12)" strokeWidth="1">
        <line x1="300" y1="60" x2="60" y2="340" />
        <line x1="300" y1="60" x2="180" y2="340" />
        <line x1="300" y1="60" x2="300" y2="340" stroke="rgba(239,68,68,0.3)" />
        <line x1="300" y1="60" x2="420" y2="340" />
        <line x1="300" y1="60" x2="540" y2="340" />

        <line x1="120" y1="180" x2="480" y2="180" />
        <line x1="90" y1="230" x2="510" y2="230" />
        <line x1="60" y1="290" x2="540" y2="290" />
      </g>

      {/* Beacon Light */}
      <circle cx="300" cy="60" r="40" fill="url(#t26-beam)" filter="blur(20px)" />
      <circle cx="300" cy="60" r="4" fill="#FFFFFF" />

      {/* Next Generation Forward Silhouette */}
      <g transform="translate(200, 100)">
        {/* Silhouette Center */}
        <circle cx="100" cy="50" r="26" fill="#1C1825" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" />
        <path d="M45 150 C55 95, 145 95, 155 150 Z" fill="#15121E" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />

        {/* Flanking Pillars */}
        <circle cx="30" cy="70" r="20" fill="#15121E" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M0 150 C5 105, 60 105, 65 150 Z" fill="#110E18" />

        <circle cx="170" cy="70" r="20" fill="#15121E" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M135 150 C140 105, 195 105, 200 150 Z" fill="#110E18" />
      </g>

      {/* HUD Info */}
      <text x="50" y="32" fill="#EF4444" fontSize="10" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.2em">
        TRANSITION // 2026–2027
      </text>
      <text x="460" y="32" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.2em">
        NEXT COHORT
      </text>

      {/* Bottom Gradient Fade */}
      <rect y="240" width="100%" height="100" fill="url(#bottom-fade)" />
    </svg>
  );
}

export function TeacherCoordinatorPlaceholder({ className = '' }: PlaceholderProps) {
  return (
    <svg
      viewBox="0 0 600 340"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <radialGradient id="tc-radial" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#1E1B4B" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0B090E" stopOpacity="1" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0C0A12" />
      <rect width="100%" height="100%" fill="url(#tc-radial)" />

      {/* Geometric Academic Halo Rings */}
      <circle cx="300" cy="130" r="90" fill="none" stroke="rgba(239,68,68,0.25)" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="300" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Educator / Coordinator Portrait Silhouette */}
      <g transform="translate(190, 80)">
        <circle cx="110" cy="50" r="34" fill="#1C1826" stroke="rgba(239,68,68,0.55)" strokeWidth="1.5" />
        <path d="M40 170 C50 100, 170 100, 180 170 Z" fill="#14111E" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      </g>

      {/* HUD Info */}
      <text x="50" y="32" fill="#EF4444" fontSize="10" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.2em">
        FACULTY COORDINATION
      </text>
      <text x="470" y="32" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.2em">
        ADVISORY
      </text>

      {/* Bottom Gradient Fade */}
      <rect y="240" width="100%" height="100" fill="url(#bottom-fade)" />
    </svg>
  );
}

export function PrincipalPlaceholder({ className = '' }: PlaceholderProps) {
  return (
    <svg
      viewBox="0 0 600 340"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <radialGradient id="pr-radial" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.32" />
          <stop offset="50%" stopColor="#311010" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0B090E" stopOpacity="1" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0C0A10" />
      <rect width="100%" height="100%" fill="url(#pr-radial)" />

      {/* Institutional Pillar Symmetry */}
      <g stroke="rgba(255,255,255,0.08)" strokeWidth="1.5">
        <line x1="140" y1="60" x2="140" y2="280" />
        <line x1="170" y1="80" x2="170" y2="280" />
        <line x1="430" y1="80" x2="430" y2="280" />
        <line x1="460" y1="60" x2="460" y2="280" />
      </g>

      {/* Insignia Arch */}
      <path d="M220 80 Q300 40 380 80" fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />

      {/* Institutional Patron Portrait Silhouette */}
      <g transform="translate(195, 75)">
        <circle cx="105" cy="52" r="36" fill="#1C1825" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" />
        <path d="M30 175 C45 105, 165 105, 180 175 Z" fill="#14111E" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </g>

      {/* HUD Info */}
      <text x="50" y="32" fill="#EF4444" fontSize="10" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.2em">
        OFFICE OF THE PRINCIPAL
      </text>
      <text x="470" y="32" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.2em">
        LEADERSHIP
      </text>

      {/* Bottom Gradient Fade */}
      <rect y="240" width="100%" height="100" fill="url(#bottom-fade)" />
    </svg>
  );
}

export function FacultyMentorsPlaceholder({ className = '' }: PlaceholderProps) {
  return (
    <svg
      viewBox="0 0 600 340"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <radialGradient id="fm-radial" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#1E1B4B" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0B090E" stopOpacity="1" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0B0912" />
      <rect width="100%" height="100%" fill="url(#fm-radial)" />

      {/* Interconnected Mentorship Nodes */}
      <g stroke="rgba(239,68,68,0.25)" strokeWidth="1">
        <line x1="160" y1="140" x2="300" y2="120" />
        <line x1="300" y1="120" x2="440" y2="140" />
        <line x1="220" y1="170" x2="380" y2="170" />
      </g>

      {/* Advisory Council Silhouette Group */}
      <g transform="translate(140, 90)">
        {/* Mentor 1 (Center) */}
        <circle cx="160" cy="45" r="26" fill="#1C1826" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" />
        <path d="M110 160 C120 100, 200 100, 210 160 Z" fill="#15121F" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

        {/* Mentor 2 (Left) */}
        <circle cx="70" cy="55" r="22" fill="#171321" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M30 160 C38 112, 105 112, 110 160 Z" fill="#120F1A" />

        {/* Mentor 3 (Right) */}
        <circle cx="250" cy="55" r="22" fill="#171321" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M210 160 C215 112, 282 112, 290 160 Z" fill="#120F1A" />
      </g>

      {/* HUD Info */}
      <text x="50" y="32" fill="#EF4444" fontSize="10" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.2em">
        FACULTY & ADVISORY
      </text>
      <text x="475" y="32" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.2em">
        MENTORS
      </text>

      {/* Bottom Gradient Fade */}
      <rect y="240" width="100%" height="100" fill="url(#bottom-fade)" />
    </svg>
  );
}
