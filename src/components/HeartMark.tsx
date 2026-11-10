import React from 'react';

export const HeartMark: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Delicate engraved heart contour */}
      <path
        d="M 16 27 C 16 27 6 20 6 12 C 6 8 9 5 12.5 5 C 14.5 5 15.5 6 16 7 C 16.5 6 17.5 5 19.5 5 C 23 5 26 8 26 12 C 26 20 16 27 16 27 Z"
        stroke="var(--brass)"
        strokeWidth="1.25"
        fill="var(--crimson)"
        fillOpacity="0.15"
      />
      {/* Continuous ECG trace through the heart */}
      <path
        d="M 4 15 L 10 15 L 12 11 L 14 19 L 16 6 L 18 22 L 20 13 L 22 15 L 28 15"
        stroke="var(--ink)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

