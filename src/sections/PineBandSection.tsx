import React from 'react';
import { PineHeartOrnament } from '../components/PineHeartOrnament';

export const PineBandSection: React.FC = () => {
  return (
    <section
      id="band"
      style={{
        backgroundColor: 'var(--pine)',
        color: 'var(--bone)',
        paddingTop: 'clamp(3.5rem, 6vw, 5.5rem)',
        paddingBottom: 'clamp(3.5rem, 6vw, 5.5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
          <span
            className="eyebrow"
            style={{ color: 'var(--brass-on-pine)', letterSpacing: '0.16em', marginBottom: '0.5rem' }}
          >
            Four Pillars
          </span>
          <h2 style={{ color: 'var(--bone)', fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}>
            Four things we checked
          </h2>
          <p style={{ color: '#BACEC7', fontSize: '0.9rem', marginTop: '0.75rem' }}>
            A rigorous student assessment requires inspecting data hygiene, algorithmic trade-offs, demographic representativeness, and operational boundaries.
          </p>
        </div>

        {/* Desktop 5-Column Grid with Central Ornament */}
        <div className="pine-grid">
          {/* LEFT COLUMN 1: DATA */}
          <div className="pine-card">
            <span className="pine-card-eyebrow">Pillar I · Curation</span>
            <div className="pine-card-stat">6 missing values</div>
            <div className="pine-card-badge">0.14% of cells</div>
            <p className="pine-card-desc">
              Four in fluoroscopy vessels and two in thallium defect. Outliers like 564 mg/dl cholesterol were preserved to honor genuine patient physiology.
            </p>
            <a href="#data" className="pine-card-link">
              Read data audit <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* LEFT COLUMN 2: MODEL */}
          <div className="pine-card">
            <span className="pine-card-eyebrow">Pillar II · Benchmark</span>
            <div className="pine-card-stat">0.939 Test AUC</div>
            <div className="pine-card-badge">Logistic Regression</div>
            <p className="pine-card-desc">
              Five models compared under a 70/30 stratified split. Regularised logistic regression prevented the severe memorisation that plagued random forests.
            </p>
            <a href="#model" className="pine-card-link">
              Read model evaluation <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* CENTER: ENGRAVED BRASS HEART ORNAMENT */}
          <div className="pine-center-ornament">
            <PineHeartOrnament size={140} />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '0.75rem',
                color: 'var(--brass)',
                marginTop: '0.5rem',
                display: 'block',
              }}
            >
              Audited Core
            </span>
          </div>

          {/* RIGHT COLUMN 3: FAIRNESS */}
          <div className="pine-card">
            <span className="pine-card-eyebrow">Pillar III · Equity</span>
            <div className="pine-card-stat">68% male cohort</div>
            <div className="pine-card-badge">9/11 vs 26/31</div>
            <p className="pine-card-desc">
              Sensitivity across sexes shows no statistically meaningful gap once wide Wilson confidence intervals are accounted for on small female samples.
            </p>
            <a href="#fairness" className="pine-card-link">
              Read fairness report <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* RIGHT COLUMN 4: PRIVACY */}
          <div className="pine-card">
            <span className="pine-card-eyebrow">Pillar IV · Trust</span>
            <div className="pine-card-stat">0 network bytes</div>
            <div className="pine-card-badge">100% In-Browser</div>
            <p className="pine-card-desc">
              All dot-product math executes in local browser memory. Zero patient health numbers leave your machine, preventing accidental re-identification.
            </p>
            <a href="#fairness" className="pine-card-link">
              Read privacy review <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .pine-grid {
          display: grid;
          grid-template-columns: 1fr 1fr auto 1fr 1fr;
          gap: 1.5rem;
          align-items: center;
        }
        .pine-card {
          border: 1px solid var(--brass);
          background-color: transparent;
          border-radius: var(--radius-xs);
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .pine-card-eyebrow {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--brass-on-pine);
          font-weight: 600;
          margin-bottom: 0.4rem;
        }
        .pine-card-stat {
          font-family: var(--font-serif);
          font-size: 1.7rem;
          color: var(--bone);
          line-height: 1.15;
          margin-bottom: 0.25rem;
        }
        .pine-card-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 600;
          color: #B5D2CA;
          margin-bottom: 0.75rem;
        }
        .pine-card-desc {
          font-size: 0.8rem;
          color: #D3E0DC;
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex: 1;
        }
        .pine-card-link {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--brass-on-pine);
          border-bottom: 1px solid rgba(229, 195, 132, 0.4);
          padding-bottom: 2px;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          width: fit-content;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .pine-card-link:hover {
          color: var(--bone);
          border-bottom-color: var(--bone);
        }
        .pine-center-ornament {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 0.5rem;
        }

        @media (max-width: 1100px) {
          .pine-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
          .pine-center-ornament {
            grid-column: span 2;
            order: -1;
            margin-bottom: 1.5rem;
          }
        }

        @media (max-width: 600px) {
          .pine-grid {
            grid-template-columns: 1fr;
          }
          .pine-center-ornament {
            grid-column: span 1;
          }
        }
      `}</style>
    </section>
  );
};
