import React from 'react';
import { Translations } from '../i18n/translations';

export type AvatarId =
  | 'avatar-1'
  | 'avatar-2'
  | 'avatar-3'
  | 'avatar-4'
  | 'avatar-5'
  | 'avatar-6'
  | 'avatar-7'
  | 'avatar-8'
  | 'avatar-9'
  | 'avatar-10';

export interface AvatarOption {
  id: AvatarId;
  nameKey: keyof Translations;
  descKey: keyof Translations;
  themeColor: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'avatar-1',
    nameKey: 'avatar1Name',
    descKey: 'avatar1Desc',
    themeColor: 'from-indigo-950 to-purple-900',
  },
  {
    id: 'avatar-2',
    nameKey: 'avatar2Name',
    descKey: 'avatar2Desc',
    themeColor: 'from-emerald-950 to-green-800',
  },
  {
    id: 'avatar-3',
    nameKey: 'avatar3Name',
    descKey: 'avatar3Desc',
    themeColor: 'from-red-800 to-orange-600',
  },
  {
    id: 'avatar-4',
    nameKey: 'avatar4Name',
    descKey: 'avatar4Desc',
    themeColor: 'from-amber-800 to-yellow-600',
  },
  {
    id: 'avatar-5',
    nameKey: 'avatar5Name',
    descKey: 'avatar5Desc',
    themeColor: 'from-blue-900 to-blue-600',
  },
  {
    id: 'avatar-6',
    nameKey: 'avatar6Name',
    descKey: 'avatar6Desc',
    themeColor: 'from-pink-900 to-rose-600',
  },
  {
    id: 'avatar-7',
    nameKey: 'avatar7Name',
    descKey: 'avatar7Desc',
    themeColor: 'from-teal-900 to-cyan-700',
  },
  {
    id: 'avatar-8',
    nameKey: 'avatar8Name',
    descKey: 'avatar8Desc',
    themeColor: 'from-purple-950 to-fuchsia-900',
  },
  {
    id: 'avatar-9',
    nameKey: 'avatar9Name',
    descKey: 'avatar9Desc',
    themeColor: 'from-lime-900 to-emerald-700',
  },
  {
    id: 'avatar-10',
    nameKey: 'avatar10Name',
    descKey: 'avatar10Desc',
    themeColor: 'from-slate-900 to-indigo-900',
  },
];

interface AvatarProps {
  avatarId?: string | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  avatarId,
  className = '',
  size,
  title,
}) => {
  const normalizedId: AvatarId =
    avatarId && AVATAR_OPTIONS.some((a) => a.id === avatarId)
      ? (avatarId as AvatarId)
      : 'avatar-1';

  let sizeClasses = 'w-10 h-10';
  if (size === 'xs') sizeClasses = 'w-5 h-5';
  else if (size === 'sm') sizeClasses = 'w-7 h-7';
  else if (size === 'md') sizeClasses = 'w-10 h-10';
  else if (size === 'lg') sizeClasses = 'w-16 h-16';
  else if (size === 'xl') sizeClasses = 'w-24 h-24';

  const appliedClass = className || sizeClasses;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-2xs select-none ${appliedClass}`}
      title={title || normalizedId}
      aria-label={title || normalizedId}
    >
      {renderDiverseHumanAvatarSvg(normalizedId)}
    </div>
  );
};

function renderDiverseHumanAvatarSvg(id: AvatarId) {
  switch (id) {
    // 1. Cyber Astronaut (Nebula Violet bg, Spacesuit with Mission Patch & Helmet Collar)
    case 'avatar-1':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="av1-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
            <linearGradient id="av1-suit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#av1-bg)" />
          {/* Distant space stars */}
          <circle cx="24" cy="24" r="1.2" fill="#FDE047" />
          <circle cx="78" cy="22" r="1" fill="#FFFFFF" />
          <circle cx="82" cy="42" r="1.4" fill="#38BDF8" />
          <circle cx="18" cy="62" r="1" fill="#FFFFFF" />
          <polygon points="72,16 73,19 76,20 73,21 72,24 71,21 68,20 71,19" fill="#FDE047" />
          {/* Shoulders & White Astronaut Suit with Cobalt Accents */}
          <path d="M18 100 C18 74 32 68 50 68 C68 68 82 74 82 100 Z" fill="url(#av1-suit)" />
          {/* Cobalt Blue Shoulder Pads */}
          <path d="M18 100 C18 80 24 73 34 72 L32 90 Z" fill="#2563EB" />
          <path d="M82 100 C82 80 76 73 66 72 L68 90 Z" fill="#2563EB" />
          {/* Mission Security Patch */}
          <ellipse cx="50" cy="84" rx="7" ry="5" fill="#1E3A8A" stroke="#FBBF24" strokeWidth="1" />
          <polygon points="50,81 51.5,84 55,84.5 52,86.5 53,89.5 50,87.5 47,89.5 48,86.5 45,84.5 48.5,84" fill="#FBBF24" />
          {/* Helmet Neck Ring Base */}
          <ellipse cx="50" cy="66" rx="19" ry="6" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Neck */}
          <rect x="44" y="58" width="12" height="10" rx="2" fill="#C67D3B" />
          {/* Face */}
          <path d="M33 46 C33 33 40 27 50 27 C60 27 67 33 67 46 C67 58 59 66 50 66 C41 66 33 58 33 46 Z" fill="#C67D3B" />
          {/* Hair framing face */}
          <path d="M30 42 C30 25 38 19 50 19 C62 19 70 25 70 42 C67 33 59 27 50 27 C41 27 33 33 30 42 Z" fill="#18181B" />
          {/* Curved Astronaut Helmet Glass Arc */}
          <path d="M26 50 C24 28 76 28 74 50" fill="none" stroke="#67E8F9" strokeWidth="2" strokeDasharray="30 8" opacity="0.8" />
          {/* Eyes */}
          <circle cx="43" cy="46" r="2.2" fill="#18181B" />
          <circle cx="57" cy="46" r="2.2" fill="#18181B" />
          <circle cx="44" cy="45" r="0.8" fill="#FFFFFF" />
          <circle cx="58" cy="45" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M38 39 Q43 37 47 39" fill="none" stroke="#18181B" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M53 39 Q57 37 62 39" fill="none" stroke="#18181B" strokeWidth="1.6" strokeLinecap="round" />
          {/* Smile */}
          <path d="M45 56 Q50 61 55 56" fill="none" stroke="#831843" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // 2. Ethical Hacker (Black & Neon Green Hoodie, Terminal Visor >_)
    case 'avatar-2':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="av2-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#022C22" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
            <linearGradient id="av2-matrix" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#av2-bg)" />
          {/* Faint matrix digital grid lines in background */}
          <line x1="20" y1="15" x2="20" y2="85" stroke="#10B981" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.3" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="#10B981" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.25" />
          <line x1="80" y1="15" x2="80" y2="85" stroke="#10B981" strokeWidth="0.6" strokeDasharray="3 5" opacity="0.3" />
          {/* Shoulders & Hacker Hoodie */}
          <path d="M18 100 C18 75 32 68 50 68 C68 68 82 75 82 100 Z" fill="#09090B" />
          {/* Neon Green Zipper / Cyber Seam */}
          <line x1="50" y1="76" x2="50" y2="100" stroke="#10B981" strokeWidth="2.5" />
          {/* Hacker Terminal Chest Badge */}
          <rect x="33" y="82" width="10" height="7" rx="1.5" fill="#18181B" stroke="#10B981" strokeWidth="1" />
          <text x="38" y="87.5" fill="#4ADE80" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">&gt;_</text>
          {/* Neck */}
          <rect x="44" y="60" width="12" height="12" rx="2" fill="#E29D62" />
          {/* Human Face */}
          <path d="M34 46 C34 33 40 28 50 28 C60 28 66 33 66 46 C66 58 59 66 50 66 C41 66 34 58 34 46 Z" fill="#F8D7B8" />
          {/* Hacker Hood draping around head */}
          <path d="M26 48 C26 24 35 17 50 17 C65 17 74 24 74 48 C74 58 70 68 66 70 C64 64 66 48 66 42 C66 30 60 23 50 23 C40 23 34 30 34 42 C34 48 36 64 34 70 C30 68 26 58 26 48 Z" fill="#18181B" stroke="#10B981" strokeWidth="1" />
          {/* Glowing Cyber Terminal Eyewear / Visor */}
          <rect x="36" y="41" width="28" height="9" rx="2.5" fill="#022C22" stroke="#22C55E" strokeWidth="1.6" />
          <text x="44" y="47.5" fill="#4ADE80" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">&gt;_</text>
          <circle cx="58" cy="45.5" r="1.5" fill="#22C55E" />
          {/* Friendly smirk */}
          <path d="M47 57 Q51 60 55 57" fill="none" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    // 3. Sam - VR Cyber Gamer (Fiery Coral bg, Neon VR Headset & Electric Cyan Jacket)
    case 'avatar-3':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="av3-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#991B1B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#av3-bg)" />
          {/* Curly hair outline background */}
          <circle cx="32" cy="28" r="9" fill="#1C1917" />
          <circle cx="42" cy="20" r="9" fill="#1C1917" />
          <circle cx="58" cy="20" r="9" fill="#1C1917" />
          <circle cx="68" cy="28" r="9" fill="#1C1917" />
          {/* Shoulders & Electric Cyan Streetwear Jacket */}
          <path d="M18 100 C18 75 32 68 50 68 C68 68 82 75 82 100 Z" fill="#0891B2" />
          {/* Bright Yellow Jacket Collar & Zipper */}
          <path d="M42 68 L50 82 L58 68 Z" fill="#FDE047" />
          <line x1="50" y1="82" x2="50" y2="100" stroke="#FDE047" strokeWidth="2" />
          {/* Neck */}
          <rect x="44" y="60" width="12" height="12" rx="2" fill="#7C483A" />
          {/* Ears */}
          <circle cx="31" cy="50" r="4.5" fill="#7C483A" />
          <circle cx="69" cy="50" r="4.5" fill="#7C483A" />
          {/* Head & Face */}
          <path d="M33 46 C33 33 40 28 50 28 C60 28 67 33 67 46 C67 58 59 66 50 66 C41 66 33 58 33 46 Z" fill="#8D5B4C" />
          {/* Neon VR Goggles */}
          <rect x="33" y="38" width="34" height="13" rx="3.5" fill="#0F172A" stroke="#22D3EE" strokeWidth="2" />
          {/* VR Visor Display Accent */}
          <line x1="38" y1="44.5" x2="62" y2="44.5" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="42" cy="44.5" r="1" fill="#FEF08A" />
          <circle cx="58" cy="44.5" r="1" fill="#FEF08A" />
          {/* Headset Straps */}
          <line x1="26" y1="44" x2="33" y2="44" stroke="#475569" strokeWidth="3" />
          <line x1="67" y1="44" x2="74" y2="44" stroke="#475569" strokeWidth="3" />
          {/* Cheerful Broad Smile */}
          <path d="M43 56 Q50 63 57 56" fill="#FFFFFF" stroke="#451A03" strokeWidth="1.5" />
        </svg>
      );

    // 4. Maya - Cyber Detective (Warm Amber bg, Camel Trench Coat & Detective Fedora Hat)
    case 'avatar-4':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="av4-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#av4-bg)" />
          {/* Detective Fedora Hat Crown */}
          <path d="M34 32 C34 18 42 14 50 14 C58 14 66 18 66 32 Z" fill="#451A03" />
          {/* Turquoise Ribbon on Hat */}
          <rect x="34" y="27" width="32" height="4.5" fill="#0D9488" />
          {/* Fedora Brim */}
          <ellipse cx="50" cy="32" rx="26" ry="6" fill="#58240C" stroke="#78350F" strokeWidth="1" />
          {/* Shoulders & Camel Tan Trench Coat */}
          <path d="M18 100 C18 75 32 68 50 68 C68 68 82 75 82 100 Z" fill="#B45309" />
          {/* Trench Coat Lapels */}
          <polygon points="40,68 50,86 46,100 36,76" fill="#78350F" />
          <polygon points="60,68 50,86 54,100 64,76" fill="#78350F" />
          {/* Magnifying Glass Brooch */}
          <circle cx="34" cy="82" r="3.2" fill="none" stroke="#22D3EE" strokeWidth="1.3" />
          <line x1="36.5" y1="84.5" x2="39" y2="87" stroke="#22D3EE" strokeWidth="1.6" strokeLinecap="round" />
          {/* Neck */}
          <rect x="44" y="58" width="12" height="13" rx="2" fill="#E59C68" />
          {/* Ears */}
          <circle cx="31" cy="49" r="4" fill="#E59C68" />
          <circle cx="69" cy="49" r="4" fill="#E59C68" />
          {/* Head & Face */}
          <path d="M33 46 C33 33 40 27 50 27 C60 27 67 33 67 46 C67 58 59 66 50 66 C41 66 33 58 33 46 Z" fill="#F1B886" />
          {/* Hair strands */}
          <path d="M32 40 C34 48 35 56 33 66 C31 56 30 48 32 40 Z" fill="#1C1917" />
          <path d="M68 40 C66 48 65 56 67 66 C69 56 70 48 68 40 Z" fill="#1C1917" />
          {/* Eyes */}
          <circle cx="43" cy="46" r="2.2" fill="#1C1917" />
          <circle cx="57" cy="46" r="2.2" fill="#1C1917" />
          <circle cx="44" cy="45" r="0.8" fill="#FFFFFF" />
          <circle cx="58" cy="45" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M38 39 Q43 36 47 39" fill="none" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M53 39 Q57 36 62 39" fill="none" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
          {/* Determined warm smile */}
          <path d="M45 56 Q50 61 55 56" fill="none" stroke="#991B1B" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    // 5. Leo - Armor Sentinel (Royal Cobalt bg, Titanium Armor with Glowing Energy Circuits)
    case 'avatar-5':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="av5-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="av5-armor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#av5-bg)" />
          {/* Shoulders & High-Tech Cyber Armor */}
          <path d="M18 100 C18 75 32 68 50 68 C68 68 82 75 82 100 Z" fill="url(#av5-armor)" />
          {/* Metallic Shoulder Plates */}
          <path d="M18 90 L32 75 L36 95 Z" fill="#64748B" stroke="#00F0FF" strokeWidth="0.8" />
          <path d="M82 90 L68 75 L64 95 Z" fill="#64748B" stroke="#00F0FF" strokeWidth="0.8" />
          {/* Glowing Shield Energy Core on Chest */}
          <polygon points="50,75 58,80 58,90 50,95 42,90 42,80" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="50" cy="85" r="3.5" fill="#00F0FF" />
          {/* Neck */}
          <rect x="44" y="60" width="12" height="12" rx="2" fill="#F6C8A4" />
          {/* Ears */}
          <circle cx="31" cy="50" r="4.5" fill="#F6C8A4" />
          <circle cx="69" cy="50" r="4.5" fill="#F6C8A4" />
          {/* Head & Face */}
          <path d="M33 46 C33 33 40 27 50 27 C60 27 67 33 67 46 C67 58 59 66 50 66 C41 66 33 58 33 46 Z" fill="#FFDFC4" />
          {/* Eyes */}
          <circle cx="43" cy="46" r="2.2" fill="#1E293B" />
          <circle cx="57" cy="46" r="2.2" fill="#1E293B" />
          <circle cx="43.8" cy="45.2" r="0.7" fill="#FFFFFF" />
          <circle cx="57.8" cy="45.2" r="0.7" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M38 39 Q42 37 47 39" fill="none" stroke="#451A03" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M53 39 Q58 37 62 39" fill="none" stroke="#451A03" strokeWidth="1.6" strokeLinecap="round" />
          {/* Friendly broad smile */}
          <path d="M45 56 Q50 61 55 56" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          {/* Voluminous wavy brown hair */}
          <path d="M31 40 C28 28 36 19 50 19 C64 19 72 26 70 38 C67 30 60 25 50 25 C40 25 34 31 31 40 Z" fill="#573A27" />
        </svg>
      );

    // 6. Zara - AI Scientist (Fuchsia Magenta bg, White High-Tech Lab Coat & Cat-Eye Glasses)
    case 'avatar-6':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="av6-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#831843" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#av6-bg)" />
          {/* Hair back bob */}
          <path d="M27 40 C27 65 31 75 31 80 L69 80 C69 75 73 65 73 40 C73 23 63 18 50 18 C37 18 27 23 27 40 Z" fill="#09090B" />
          {/* Shoulders & Pristine White Lab Coat over Violet Shirt */}
          <path d="M18 100 C18 75 32 68 50 68 C68 68 82 75 82 100 Z" fill="#FFFFFF" />
          {/* Inner Violet Sweater */}
          <polygon points="50,68 44,84 56,84" fill="#4C1D95" />
          {/* Neural Synapse/Node Brooch */}
          <circle cx="34" cy="80" r="1.8" fill="#F43F5E" />
          <circle cx="39" cy="82" r="1.8" fill="#38BDF8" />
          <circle cx="36" cy="86" r="1.8" fill="#FDE047" />
          <line x1="34" y1="80" x2="39" y2="82" stroke="#64748B" strokeWidth="0.8" />
          <line x1="39" y1="82" x2="36" y2="86" stroke="#64748B" strokeWidth="0.8" />
          {/* Neck */}
          <rect x="44" y="60" width="12" height="12" rx="2" fill="#EAA97D" />
          {/* Ears */}
          <circle cx="31" cy="52" r="4" fill="#EAA97D" />
          <circle cx="69" cy="52" r="4" fill="#EAA97D" />
          {/* Face */}
          <path d="M33 46 C33 33 40 27 50 27 C60 27 67 33 67 46 C67 58 59 66 50 66 C41 66 33 58 33 46 Z" fill="#FCD5B5" />
          {/* Modern Cat-Eye Glasses */}
          <path d="M34 40 L45 42 L43 49 L35 47 Z" fill="none" stroke="#7E22CE" strokeWidth="1.6" />
          <path d="M66 40 L55 42 L57 49 L65 47 Z" fill="none" stroke="#7E22CE" strokeWidth="1.6" />
          <line x1="45" y1="43" x2="55" y2="43" stroke="#7E22CE" strokeWidth="1.6" />
          {/* Eyes */}
          <circle cx="40" cy="46" r="1.8" fill="#09090B" />
          <circle cx="60" cy="46" r="1.8" fill="#09090B" />
          {/* Smile with subtle magenta tone */}
          <path d="M45 57 Q50 61 55 57" fill="none" stroke="#BE185D" strokeWidth="2.2" strokeLinecap="round" />
          {/* Straight Cut Bob Bangs */}
          <path d="M30 42 C30 28 38 20 50 20 C62 20 70 28 70 42 C67 36 60 33 50 33 C40 33 33 36 30 42 Z" fill="#18181B" />
        </svg>
      );

    // 7. Kai - Drone Pilot (Ocean Teal bg, High-Vis Orange Flight Jacket & Aviator Headset)
    case 'avatar-7':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="av7-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#134E4A" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#av7-bg)" />
          {/* Shoulders & High-Vis Aviation Orange Flight Jacket */}
          <path d="M18 100 C18 75 32 68 50 68 C68 68 82 75 82 100 Z" fill="#EA580C" />
          {/* Graphite Grey Collar & Zipper */}
          <path d="M42 68 L50 82 L58 68 Z" fill="#1E293B" />
          <line x1="50" y1="82" x2="50" y2="100" stroke="#1E293B" strokeWidth="2.5" />
          {/* Aviator Wings Pin on Chest */}
          <polygon points="32,84 37,82 42,84 37,86" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.8" />
          {/* Neck */}
          <rect x="44" y="60" width="12" height="12" rx="2" fill="#F7CBB2" />
          {/* Ears */}
          <circle cx="31" cy="50" r="4.5" fill="#F7CBB2" />
          <circle cx="69" cy="50" r="4.5" fill="#F7CBB2" />
          {/* Aviator Comms Headset */}
          <path d="M26 48 C24 26 76 26 74 48" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="25" y="44" width="6" height="13" rx="3" fill="#1E293B" />
          <rect x="69" y="44" width="6" height="13" rx="3" fill="#1E293B" />
          {/* Headset Mic Boom */}
          <path d="M28 53 Q34 62 43 61" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="43" cy="61" r="2" fill="#00F0FF" />
          {/* Head & Face */}
          <path d="M33 46 C33 33 40 27 50 27 C60 27 67 33 67 46 C67 58 59 66 50 66 C41 66 33 58 33 46 Z" fill="#FDE6D2" />
          {/* Eyes */}
          <circle cx="43" cy="46" r="2.2" fill="#18181B" />
          <circle cx="57" cy="46" r="2.2" fill="#18181B" />
          <circle cx="43.8" cy="45.2" r="0.8" fill="#FFFFFF" />
          <circle cx="57.8" cy="45.2" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M38 40 Q43 37 47 40" fill="none" stroke="#262626" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M53 40 Q57 37 62 40" fill="none" stroke="#262626" strokeWidth="1.6" strokeLinecap="round" />
          {/* Friendly Smile */}
          <path d="M45 56 Q50 60 55 56" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          {/* Modern Undercut Fade & Top Fringe */}
          <path d="M32 40 C31 34 34 26 42 22 C50 18 64 20 68 30 C64 26 56 25 48 26 C40 27 34 33 32 40 Z" fill="#262626" />
        </svg>
      );

    // 8. Anya - Vault Cryptographer (Regal Bordeaux bg, Golden-Yellow Knit Sweater with Safe-Dial Brooch)
    case 'avatar-8':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="av8-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4A044E" />
              <stop offset="100%" stopColor="#701A75" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#av8-bg)" />
          {/* Topknot Bun */}
          <circle cx="50" cy="18" r="10" fill="#78350F" />
          <circle cx="50" cy="22" r="4" fill="#B45309" />
          {/* Shoulders & Golden-Yellow Knit Sweater */}
          <path d="M18 100 C18 75 32 68 50 68 C68 68 82 75 82 100 Z" fill="#D97706" />
          <path d="M43 68 Q50 78 57 68" fill="#FDE68A" />
          {/* Safe-Dial Brooch on Chest */}
          <circle cx="35" cy="82" r="4.5" fill="#1C1917" stroke="#FDE047" strokeWidth="1.2" />
          <circle cx="35" cy="82" r="2" fill="#FDE047" />
          <line x1="35" y1="78" x2="35" y2="80" stroke="#FDE047" strokeWidth="1" />
          {/* Neck */}
          <rect x="44" y="60" width="12" height="12" rx="2" fill="#F5C2A4" />
          {/* Ears */}
          <circle cx="31" cy="52" r="4.5" fill="#F5C2A4" />
          <circle cx="69" cy="52" r="4.5" fill="#F5C2A4" />
          {/* Head & Face */}
          <path d="M33 46 C33 33 40 27 50 27 C60 27 67 33 67 46 C67 58 59 66 50 66 C41 66 33 58 33 46 Z" fill="#FFE2CD" />
          {/* Eyes */}
          <circle cx="43" cy="46" r="2.2" fill="#1C1917" />
          <circle cx="57" cy="46" r="2.2" fill="#1C1917" />
          {/* Rosy Cheeks */}
          <circle cx="38" cy="52" r="3" fill="#FDA4AF" opacity="0.6" />
          <circle cx="62" cy="52" r="3" fill="#FDA4AF" opacity="0.6" />
          {/* Eyebrows */}
          <path d="M38 39 Q43 37 47 39" fill="none" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M53 39 Q57 37 62 39" fill="none" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />
          {/* Warm open smile */}
          <path d="M45 56 Q50 61 55 56" fill="none" stroke="#9F1239" strokeWidth="2.2" strokeLinecap="round" />
          {/* Hair framing face */}
          <path d="M31 38 C33 28 40 24 50 24 C60 24 67 28 69 38 C66 31 59 28 50 28 C41 28 34 31 31 38 Z" fill="#78350F" />
        </svg>
      );

    // 9. Jordan - Field Scout (Sunny Lime-Olive bg, Navy/Sky Blue Windbreaker with Reflective Stripes)
    case 'avatar-9':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="av9-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3F6212" />
              <stop offset="100%" stopColor="#65A30D" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#av9-bg)" />
          {/* Hair back fade */}
          <path d="M30 46 C30 28 38 23 50 23 C62 23 70 28 70 46 Z" fill="#0C0A09" />
          {/* Shoulders & Tactical Navy & Sky-Blue Windbreaker */}
          <path d="M18 100 C18 75 32 68 50 68 C68 68 82 75 82 100 Z" fill="#1E3A8A" />
          {/* Sky-Blue Upper Yoke */}
          <path d="M24 75 C32 70 50 70 68 70 C76 70 80 75 80 82 L20 82 Z" fill="#38BDF8" />
          {/* Silver Reflective Safety Stripe */}
          <rect x="20" y="81" width="60" height="2.5" fill="#F8FAFC" />
          {/* Walkie-Talkie / Comms Mic Clip */}
          <rect x="30" y="74" width="6" height="10" rx="1.5" fill="#0F172A" />
          <circle cx="33" cy="77" r="1" fill="#4ADE80" />
          {/* Neck */}
          <rect x="44" y="60" width="12" height="12" rx="2" fill="#442817" />
          {/* Ears */}
          <circle cx="31" cy="50" r="4.5" fill="#442817" />
          <circle cx="69" cy="50" r="4.5" fill="#442817" />
          {/* Head & Face */}
          <path d="M33 46 C33 33 40 27 50 27 C60 27 67 33 67 46 C67 58 59 66 50 66 C41 66 33 58 33 46 Z" fill="#5C3A21" />
          {/* Hair line */}
          <path d="M33 38 C37 31 43 30 50 30 C57 30 63 31 67 38 C65 32 58 27 50 27 C42 27 35 32 33 38 Z" fill="#0C0A09" />
          {/* Eyes */}
          <circle cx="43" cy="46" r="2.3" fill="#0C0A09" />
          <circle cx="57" cy="46" r="2.3" fill="#0C0A09" />
          <circle cx="43.8" cy="45.2" r="0.8" fill="#FFFFFF" />
          <circle cx="57.8" cy="45.2" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M38 39 Q43 36 47 39" fill="none" stroke="#0C0A09" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M53 39 Q57 36 62 39" fill="none" stroke="#0C0A09" strokeWidth="1.8" strokeLinecap="round" />
          {/* Wide bright smile */}
          <path d="M43 56 Q50 63 57 56" fill="#FFFFFF" stroke="#291407" strokeWidth="1.4" />
        </svg>
      );

    // 10. Rohan - Security Officer (Midnight Slate bg, Formal Navy Blazer, Gold Epaulettes & Crimson Tie)
    case 'avatar-10':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="av10-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#1C2541" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#av10-bg)" />
          {/* Shoulders & Formal Dark Navy Uniform Blazer */}
          <path d="M18 100 C18 75 32 68 50 68 C68 68 82 75 82 100 Z" fill="#0F172A" />
          {/* Gold Shoulder Epaulettes */}
          <rect x="20" y="74" width="10" height="3.5" rx="1" fill="#FBBF24" />
          <rect x="70" y="74" width="10" height="3.5" rx="1" fill="#FBBF24" />
          {/* White Shirt Collar */}
          <polygon points="50,68 43,84 57,84" fill="#FFFFFF" />
          {/* Crimson Red Tie */}
          <polygon points="50,72 47,88 50,94 53,88" fill="#DC2626" />
          {/* Gold 5-point Security Star Badge on Chest */}
          <polygon points="35,84 36.5,87 40,87.5 37.5,89.5 38.5,93 35,91 31.5,93 32.5,89.5 30,87.5 33.5,87" fill="#FDE047" />
          {/* Neck */}
          <rect x="44" y="60" width="12" height="12" rx="2" fill="#B57343" />
          {/* Ears */}
          <circle cx="31" cy="50" r="4.5" fill="#B57343" />
          <circle cx="69" cy="50" r="4.5" fill="#B57343" />
          {/* Head & Face */}
          <path d="M33 46 C33 33 40 27 50 27 C60 27 67 33 67 46 C67 58 59 66 50 66 C41 66 33 58 33 46 Z" fill="#C98858" />
          {/* Eyes */}
          <circle cx="43" cy="46" r="2.2" fill="#0F172A" />
          <circle cx="57" cy="46" r="2.2" fill="#0F172A" />
          <circle cx="43.8" cy="45.2" r="0.7" fill="#FFFFFF" />
          <circle cx="57.8" cy="45.2" r="0.7" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M38 39 Q42 37 47 39" fill="none" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M53 39 Q58 37 62 39" fill="none" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" />
          {/* Approachable Warm Smile */}
          <path d="M45 56 Q50 60 55 56" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          {/* Classic Side-Part Hair */}
          <path d="M31 40 C30 28 38 20 48 20 C58 20 68 25 68 38 C64 30 57 26 48 26 C39 26 34 32 31 40 Z" fill="#171717" />
        </svg>
      );

    default:
      return null;
  }
}
