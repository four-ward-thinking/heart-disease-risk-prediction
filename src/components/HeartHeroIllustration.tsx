import React from 'react';

interface HeartHeroIllustrationProps {
  className?: string;
}

export const HeartHeroIllustration: React.FC<HeartHeroIllustrationProps> = ({ className }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
      }}
      className={className}
    >
      {/* Background ECG trace passing behind the heart and running off the right edge */}
      <svg
        viewBox="0 0 700 300"
        style={{
          position: 'absolute',
          top: '38%',
          left: '-10%',
          width: '120%',
          height: '140px',
          zIndex: 1,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
        aria-hidden="true"
      >
        <path
          d="M -50 70 L 100 70 L 115 70 L 125 55 L 135 85 L 145 25 L 160 120 L 175 60 L 185 75 L 195 70 L 320 70 L 335 70 L 345 58 L 355 82 L 365 30 L 380 115 L 395 62 L 405 76 L 415 70 L 530 70 L 545 70 L 555 52 L 565 88 L 575 20 L 590 125 L 605 60 L 615 78 L 625 70 L 760 70"
          fill="none"
          stroke="var(--brass)"
          strokeWidth="1.25"
          strokeDasharray="4 2"
          opacity="0.45"
        />
      </svg>

      {/* Hand-built Anatomical Engraved Plate */}
      <svg
        viewBox="0 0 500 520"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: 'auto',
          filter: 'drop-shadow(0 8px 24px rgba(20, 32, 30, 0.06))',
        }}
        role="img"
        aria-label="Engraved anatomical plate of the human heart with pinned clinical annotations"
      >
        <defs>
          {/* Subtle paper-tone and crimson washes */}
          <linearGradient id="aortaWash" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C99F60" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9C753A" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="ventricleWash" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A3302B" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#A3302B" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#F4F0E7" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="atriumWash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5E8174" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F4F0E7" stopOpacity="0.15" />
          </linearGradient>

          {/* Hatching patterns for engraving plate depth */}
          <pattern id="hatchH" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#14201E" strokeWidth="0.65" opacity="0.3" />
          </pattern>
          <pattern id="hatchDense" width="4" height="4" patternTransform="rotate(-30 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#14201E" strokeWidth="0.5" opacity="0.22" />
          </pattern>
        </defs>

        {/* Outer Plate Framing Rule */}
        <rect
          x="12"
          y="12"
          width="476"
          height="496"
          fill="var(--paper)"
          stroke="var(--line)"
          strokeWidth="1"
          rx="2"
        />
        <rect
          x="18"
          y="18"
          width="464"
          height="484"
          fill="none"
          stroke="var(--line)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />

        {/* Plate Header Typographic Ornament */}
        <text
          x="30"
          y="38"
          fontFamily="var(--font-sans)"
          fontSize="9"
          letterSpacing="0.16em"
          fill="var(--brass)"
          fontWeight="600"
        >
          PLATE IV · ANATOMIA CARDIOVASCULARIS
        </text>
        <text
          x="470"
          y="38"
          textAnchor="end"
          fontFamily="var(--font-serif)"
          fontStyle="italic"
          fontSize="10"
          fill="var(--mute)"
        >
          Cleveland Series
        </text>

        {/* --- ANATOMICAL HEART STRUCTURE --- */}
        <g transform="translate(15, 10)">
          {/* Superior Vena Cava (Right) */}
          <path
            d="M 180 100 C 180 75 190 60 205 55 C 220 55 225 70 225 95 C 225 110 215 125 210 135 Z"
            fill="url(#atriumWash)"
            stroke="var(--ink)"
            strokeWidth="1.2"
          />
          {/* Vena Cava hatchings */}
          <path
            d="M 188 65 L 188 110 M 195 60 L 195 120 M 202 58 L 202 125 M 212 62 L 212 120"
            stroke="var(--ink)"
            strokeWidth="0.6"
            opacity="0.35"
          />

          {/* Ascending Aorta & Arch */}
          <path
            d="M 215 130 C 220 85 240 60 275 60 C 315 60 335 90 325 145 C 320 165 305 185 295 195 C 275 180 250 170 225 165 Z"
            fill="url(#aortaWash)"
            stroke="var(--ink)"
            strokeWidth="1.4"
          />
          {/* Brachiocephalic / Carotid branches */}
          <path
            d="M 255 62 L 252 35 C 252 30 262 30 262 35 L 265 62"
            fill="#EADBC0"
            stroke="var(--ink)"
            strokeWidth="1.2"
          />
          <path
            d="M 275 60 L 275 32 C 275 28 285 28 285 32 L 285 61"
            fill="#EADBC0"
            stroke="var(--ink)"
            strokeWidth="1.2"
          />
          <path
            d="M 298 68 L 304 40 C 304 36 314 38 312 43 L 308 72"
            fill="#EADBC0"
            stroke="var(--ink)"
            strokeWidth="1.2"
          />

          {/* Aorta Engraved Striae */}
          <path
            d="M 235 90 C 250 78 285 78 305 105 M 240 105 C 255 92 288 92 310 120 M 245 120 C 260 108 290 108 308 135"
            stroke="var(--brass)"
            strokeWidth="0.75"
            fill="none"
            opacity="0.65"
          />

          {/* Pulmonary Artery / Trunk */}
          <path
            d="M 260 140 C 270 125 300 125 325 145 C 345 160 340 190 320 200 C 290 190 265 175 260 140 Z"
            fill="#D5DFDC"
            stroke="var(--ink)"
            strokeWidth="1.2"
          />

          {/* Right Atrium */}
          <path
            d="M 160 160 C 145 175 140 215 155 250 C 170 280 195 290 210 295 C 205 270 205 230 205 190 C 205 170 185 155 160 160 Z"
            fill="url(#atriumWash)"
            stroke="var(--ink)"
            strokeWidth="1.3"
          />

          {/* Left Auricle / Atrium */}
          <path
            d="M 330 185 C 350 190 365 210 365 235 C 365 255 350 270 340 275 C 330 250 325 220 325 195 Z"
            fill="url(#atriumWash)"
            stroke="var(--ink)"
            strokeWidth="1.2"
          />

          {/* Main Ventricular Mass (Left and Right Ventricles) */}
          <path
            d="M 195 285 C 185 320 195 365 225 405 C 255 440 290 460 300 465 C 308 460 335 425 355 375 C 375 325 370 275 340 265 C 310 255 240 255 195 285 Z"
            fill="url(#ventricleWash)"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />

          {/* Shading fill pattern on posterior ventricle */}
          <path
            d="M 285 265 C 320 265 355 305 350 365 C 340 415 315 450 300 465 C 295 450 285 410 280 360 C 275 315 280 280 285 265 Z"
            fill="url(#hatchH)"
            opacity="0.3"
          />

          {/* Anterior Interventricular Sulcus & Coronary Arteries (Crimson linework) */}
          <path
            d="M 270 260 C 265 300 270 345 280 395 C 285 420 295 450 300 465"
            stroke="var(--crimson)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Arterial fine branches */}
          <path
            d="M 268 290 Q 250 310 235 320 M 271 325 Q 255 345 242 360 M 276 365 Q 260 385 250 405 M 274 310 Q 295 325 315 330 M 278 350 Q 300 370 320 380 M 283 395 Q 305 415 318 425"
            stroke="var(--crimson)"
            strokeWidth="1.2"
            fill="none"
            opacity="0.85"
            strokeLinecap="round"
          />

          {/* Left Circumflex Branch */}
          <path
            d="M 275 258 C 305 262 335 272 352 290"
            stroke="var(--crimson)"
            strokeWidth="1.4"
            fill="none"
            opacity="0.8"
          />

          {/* Right Coronary Artery */}
          <path
            d="M 220 255 C 205 265 190 280 185 305"
            stroke="var(--crimson)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.8"
          />

          {/* Muscular Etching Lines (Engraving hatching) */}
          <g stroke="var(--ink)" strokeWidth="0.6" opacity="0.4" fill="none">
            <path d="M 205 310 Q 220 330 240 345 M 210 330 Q 228 350 248 365 M 218 355 Q 235 375 258 390 M 228 380 Q 248 400 270 415 M 245 405 Q 265 425 285 440" />
            <path d="M 335 295 Q 320 325 305 345 M 342 320 Q 325 350 308 375 M 338 350 Q 322 380 305 405 M 325 385 Q 312 415 298 435" />
          </g>

          {/* Cardiac Apex */}
          <circle cx="300" cy="465" r="2.5" fill="var(--ink)" />
        </g>

        {/* --- THREE HAIRLINE-BOXED ANNOTATION PLATES PINNED TO THE HEART --- */}

        {/* 1. Top-Left: "ca: major vessels" */}
        <g transform="translate(32, 105)">
          {/* Leader line to coronary artery root */}
          <path
            d="M 125 18 L 195 18 L 220 155"
            fill="none"
            stroke="var(--brass)"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <circle cx="220" cy="155" r="3" fill="var(--brass)" stroke="var(--ink)" strokeWidth="0.75" />
          {/* Label Card */}
          <rect
            x="0"
            y="0"
            width="132"
            height="36"
            fill="var(--paper)"
            stroke="var(--line)"
            strokeWidth="1"
            rx="2"
          />
          <rect x="0" y="0" width="3" height="36" fill="var(--brass)" rx="1" />
          <text x="10" y="15" fontFamily="var(--font-sans)" fontSize="10.5" fontWeight="600" fill="var(--ink)">
            ca: major vessels
          </text>
          <text x="10" y="28" fontFamily="var(--font-sans)" fontSize="9" fill="var(--mute)">
            fluoroscopy · 0 to 3
          </text>
        </g>

        {/* 2. Top-Right: "thalach: max heart rate" */}
        <g transform="translate(315, 140)">
          {/* Leader line to sinoatrial / conduction base */}
          <path
            d="M 0 18 L -35 18 L -65 60"
            fill="none"
            stroke="var(--brass)"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <circle cx="-65" cy="60" r="3" fill="var(--brass)" stroke="var(--ink)" strokeWidth="0.75" />
          {/* Label Card */}
          <rect
            x="0"
            y="0"
            width="145"
            height="36"
            fill="var(--paper)"
            stroke="var(--line)"
            strokeWidth="1"
            rx="2"
          />
          <rect x="142" y="0" width="3" height="36" fill="var(--brass)" rx="1" />
          <text x="10" y="15" fontFamily="var(--font-sans)" fontSize="10.5" fontWeight="600" fill="var(--ink)">
            thalach: max HR
          </text>
          <text x="10" y="28" fontFamily="var(--font-sans)" fontSize="9" fill="var(--mute)">
            peak exercise · 71–202 bpm
          </text>
        </g>

        {/* 3. Bottom-Left: "oldpeak: ST depression" */}
        <g transform="translate(45, 375)">
          {/* Leader line to left ventricular myocardium */}
          <path
            d="M 140 18 L 190 18 L 245 10"
            fill="none"
            stroke="var(--brass)"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <circle cx="245" cy="10" r="3" fill="var(--brass)" stroke="var(--ink)" strokeWidth="0.75" />
          {/* Label Card */}
          <rect
            x="0"
            y="0"
            width="142"
            height="36"
            fill="var(--paper)"
            stroke="var(--line)"
            strokeWidth="1"
            rx="2"
          />
          <rect x="0" y="0" width="3" height="36" fill="var(--crimson)" rx="1" />
          <text x="10" y="15" fontFamily="var(--font-sans)" fontSize="10.5" fontWeight="600" fill="var(--ink)">
            oldpeak: ST depression
          </text>
          <text x="10" y="28" fontFamily="var(--font-sans)" fontSize="9" fill="var(--mute)">
            exercise induced · 0–6.2
          </text>
        </g>

        {/* Bottom Plate Caption */}
        <text
          x="250"
          y="492"
          textAnchor="middle"
          fontFamily="var(--font-serif)"
          fontStyle="italic"
          fontSize="11"
          fill="var(--mute)"
        >
          Fig. 1. Cor humanum: anterior view with key clinical predictive loci.
        </text>
      </svg>
    </div>
  );
};

