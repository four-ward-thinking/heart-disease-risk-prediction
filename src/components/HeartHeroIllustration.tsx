import React from 'react';

interface HeartHeroIllustrationProps {
  className?: string;
}

export const HeartHeroIllustration: React.FC<HeartHeroIllustrationProps> = ({ className }) => {
  return (
    <div
      className={`hero-heart-wrapper ${className || ''}`}
      style={{
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      <style>{`
        @keyframes heroEcgDraw {
          0% {
            stroke-dashoffset: 1400;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .hero-ecg-line {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: heroEcgDraw 2.4s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-ecg-line {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }
        }

        @media (max-width: 639px) {
          .hero-callouts-desktop {
            display: none !important;
          }
          .hero-legend-mobile {
            display: flex !important;
          }
        }

        @media (min-width: 640px) {
          .hero-callouts-desktop {
            display: inline;
          }
          .hero-legend-mobile {
            display: none !important;
          }
        }
      `}</style>

      {/* Inline SVG Heart with viewBox 0 0 760 470 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 760 470"
        role="img"
        aria-labelledby="hero-heart-title hero-heart-desc"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          overflow: 'visible',
        }}
      >
        <title id="hero-heart-title">Anterior view of the human heart</title>
        <desc id="hero-heart-desc">Anterior view of the heart with ca, thalach and oldpeak labelled</desc>

        <defs>
          <pattern id="hero-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--ink)" strokeOpacity="0.16" strokeWidth="0.7" />
          </pattern>
          <clipPath id="hero-body">
            <path
              id="heroBodyPath"
              d="M168 150 C124 146 96 182 98 226 C100 276 128 312 160 352 C192 392 230 426 268 428 C318 428 356 360 368 286 C376 240 370 190 336 160 C310 138 274 152 244 146 C220 142 198 152 168 150 Z"
            />
          </clipPath>
        </defs>

        {/* 1. ECG line passing behind the heart with draw-on-load animation */}
        <g fill="none">
          <path
            className="hero-ecg-line"
            d="M -60 155 L 70 155 L 82 155 L 90 147 L 98 155 L 105 162 L 115 110 L 128 182 L 142 144 L 152 155 L 290 155 L 305 155 L 315 145 L 325 155 L 332 164 L 342 108 L 355 180 L 368 144 L 378 155 L 515 155 L 610 155 L 622 155 L 630 147 L 638 155 L 645 162 L 655 110 L 668 182 L 682 144 L 692 155 L 820 155"
            stroke="var(--brass)"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
          />
        </g>

        {/* 2. Anatomical Heart (one continuous connected organ) */}
        <g transform="translate(150 0)">
          <g fill="none" stroke="var(--ink)" strokeLinecap="round" strokeLinejoin="round">
            {/* great vessels (behind the body) */}
            <g>
              {/* superior vena cava */}
              <path d="M140 160 L140 62" strokeWidth="30" stroke="var(--ink)" />
              <path d="M140 160 L140 62" stroke="#C9D3CC" strokeWidth="27" />
              {/* aortic arch */}
              <path d="M262 156 C262 92 270 60 306 60 C342 60 352 100 350 166" strokeWidth="34" stroke="var(--ink)" />
              <path d="M262 156 C262 92 270 60 306 60 C342 60 352 100 350 166" stroke="#E7C9BF" strokeWidth="31" />
              {/* pulmonary trunk */}
              <path d="M214 160 C206 124 198 108 186 96" strokeWidth="30" stroke="var(--ink)" />
              <path d="M214 160 C206 124 198 108 186 96" stroke="#D6DDE3" strokeWidth="27" />
              <path d="M186 98 C180 90 174 86 168 86" strokeWidth="22" stroke="var(--ink)" />
              <path d="M186 98 C180 90 174 86 168 86" stroke="#D6DDE3" strokeWidth="19" />
            </g>

            {/* heart body */}
            <path
              d="M168 150 C124 146 96 182 98 226 C100 276 128 312 160 352 C192 392 230 426 268 428 C318 428 356 360 368 286 C376 240 370 190 336 160 C310 138 274 152 244 146 C220 142 198 152 168 150 Z"
              fill="#EBD3C8"
              strokeWidth="2.2"
              stroke="var(--ink)"
            />

            <g clipPath="url(#hero-body)">
              {/* right atrium + auricle wash */}
              <path d="M90 140 C130 140 176 150 190 176 C170 230 150 262 118 286 C96 270 84 230 90 140Z" fill="#E2D2B8" stroke="none" />
              {/* left auricle wash */}
              <path d="M300 140 C350 150 384 200 372 270 C340 250 312 214 300 140Z" fill="#E2D2B8" stroke="none" />
              {/* left ventricle warm wash */}
              <path d="M210 180 C260 170 330 200 372 250 L372 440 L220 440 C214 360 206 260 210 180Z" fill="#D9A79B" fillOpacity="0.55" stroke="none" />
              <rect x="80" y="130" width="320" height="320" fill="url(#hero-hatch)" stroke="none" />
              {/* coronary sulcus (atrioventricular groove) */}
              <path d="M118 286 C160 262 200 232 232 196 C268 176 312 188 372 250" strokeWidth="1.4" strokeOpacity="0.55" stroke="var(--ink)" />
              {/* interventricular groove */}
              <path d="M214 160 C216 230 236 330 268 428" strokeWidth="1.4" strokeOpacity="0.55" stroke="var(--ink)" />
              {/* anterior border shading */}
              <path d="M118 262 C140 330 190 400 262 424" strokeWidth="1.1" strokeOpacity="0.35" stroke="var(--ink)" />
              <path d="M338 214 C352 290 316 396 268 424" strokeWidth="1.1" strokeOpacity="0.35" stroke="var(--ink)" />
            </g>

            {/* coronary arteries in crimson */}
            <g stroke="var(--crimson)" strokeWidth="3.2">
              <path d="M214 164 C220 232 240 330 268 420" />
              <path d="M232 214 C262 230 298 262 326 310" strokeWidth="2.2" />
              <path d="M226 252 C250 262 272 288 290 330" strokeWidth="2" />
              <path d="M118 290 C158 268 196 240 228 202 C196 196 160 214 150 244" strokeWidth="2.4" />
              <path d="M244 308 C264 322 282 350 294 384" strokeWidth="1.8" />
            </g>

            {/* outline over everything */}
            <path
              d="M168 150 C124 146 96 182 98 226 C100 276 128 312 160 352 C192 392 230 426 268 428 C318 428 356 360 368 286 C376 240 370 190 336 160 C310 138 274 152 244 146 C220 142 198 152 168 150 Z"
              strokeWidth="2.2"
              stroke="var(--ink)"
              fill="none"
            />
            {/* aorta root highlight */}
            <path d="M250 150 C256 160 270 158 276 148" strokeWidth="1.4" stroke="var(--ink)" fill="none" />
          </g>
        </g>

        {/* 3. Leader lines, anchor dots, and Montserrat text callouts */}
        <g className="hero-callouts-desktop">
          {/* Leader lines */}
          <g stroke="var(--brass)" strokeWidth="1" fill="none">
            <path d="M24 246 L300 246" />
            <path d="M476 60 L556 60" />
            <path d="M440 352 L470 400 L556 400" />
          </g>

          {/* Anchor dots */}
          <g fill="var(--brass)">
            <circle cx="300" cy="246" r="3.6" />
            <circle cx="476" cy="60" r="3.6" />
            <circle cx="440" cy="352" r="3.6" />
          </g>

          {/* Labels in Montserrat */}
          <g fontFamily="var(--font-sans), Montserrat, system-ui, sans-serif">
            {/* Left label: ca */}
            <text x="24" y="224" fontSize="14" fontWeight="600" fill="var(--ink)">
              ca: major vessels
            </text>
            <text x="24" y="242" fontSize="11" fill="var(--mute)">
              fluoroscopy, 0 to 3
            </text>

            {/* Right upper label: thalach */}
            <text x="562" y="56" fontSize="14" fontWeight="600" fill="var(--ink)">
              thalach: max HR
            </text>
            <text x="562" y="74" fontSize="11" fill="var(--mute)">
              peak exercise, 71–202 bpm
            </text>

            {/* Right lower label: oldpeak */}
            <text x="562" y="396" fontSize="14" fontWeight="600" fill="var(--ink)">
              oldpeak: ST depression
            </text>
            <text x="562" y="414" fontSize="11" fill="var(--mute)">
              exercise-induced, 0–6.2
            </text>
          </g>
        </g>
      </svg>

      {/* 4. Mobile legend displayed under the heart on screens < 640px */}
      <div
        className="hero-legend-mobile"
        style={{
          marginTop: '1.25rem',
          padding: '0.85rem 1.1rem',
          backgroundColor: 'var(--paper)',
          border: '1px solid var(--line)',
          borderRadius: '4px',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--brass)',
              flexShrink: 0,
              marginTop: '5px',
            }}
            aria-hidden="true"
          />
          <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
            <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>ca: major vessels</strong>
            <span style={{ color: 'var(--mute)', marginLeft: '0.4rem' }}>— fluoroscopy, 0 to 3</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--brass)',
              flexShrink: 0,
              marginTop: '5px',
            }}
            aria-hidden="true"
          />
          <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
            <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>thalach: max HR</strong>
            <span style={{ color: 'var(--mute)', marginLeft: '0.4rem' }}>— peak exercise, 71–202 bpm</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--brass)',
              flexShrink: 0,
              marginTop: '5px',
            }}
            aria-hidden="true"
          />
          <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
            <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>oldpeak: ST depression</strong>
            <span style={{ color: 'var(--mute)', marginLeft: '0.4rem' }}>— exercise-induced, 0–6.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
