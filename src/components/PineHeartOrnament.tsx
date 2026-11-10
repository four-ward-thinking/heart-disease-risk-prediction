import React from 'react';

export const PineHeartOrnament: React.FC<{ size?: number; className?: string }> = ({
  size = 140,
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer concentric brass rings */}
      <circle cx="80" cy="80" r="74" stroke="var(--brass)" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="80" cy="80" r="66" stroke="var(--brass)" strokeWidth="0.5" opacity="0.4" />
      <circle cx="80" cy="80" r="54" stroke="var(--brass)" strokeWidth="1" opacity="0.8" />

      {/* Engraved heart in brass linework */}
      <path
        d="M 80 118 C 80 118 45 92 45 66 C 45 52 54 44 65 44 C 72 44 76 47 80 52 C 84 47 88 44 95 44 C 106 44 115 52 115 66 C 115 92 80 118 80 118 Z"
        stroke="var(--brass)"
        strokeWidth="1.25"
        fill="rgba(181, 139, 76, 0.08)"
      />

      {/* Internal engraved hatchings */}
      <path
        d="M 68 56 Q 74 65 80 75 M 62 68 Q 72 78 80 88 M 92 56 Q 86 65 80 75 M 98 68 Q 88 78 80 88"
        stroke="var(--brass)"
        strokeWidth="0.65"
        opacity="0.6"
      />

      {/* Subtle Aorta arch & vessels */}
      <path
        d="M 72 44 C 72 32 77 26 84 26 C 90 26 94 30 94 44"
        stroke="var(--brass)"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.7"
      />
      <line x1="80" y1="26" x2="80" y2="20" stroke="var(--brass)" strokeWidth="0.8" opacity="0.7" />
      <line x1="87" y1="26" x2="89" y2="20" stroke="var(--brass)" strokeWidth="0.8" opacity="0.7" />

      {/* Centered crosshair tick marks */}
      <line x1="80" y1="4" x2="80" y2="12" stroke="var(--brass)" strokeWidth="1" />
      <line x1="80" y1="148" x2="80" y2="156" stroke="var(--brass)" strokeWidth="1" />
      <line x1="4" y1="80" x2="12" y2="80" stroke="var(--brass)" strokeWidth="1" />
      <line x1="148" y1="80" x2="156" y2="80" stroke="var(--brass)" strokeWidth="1" />
    </svg>
  );
};

