import React from 'react';
import { HeartHeroIllustration } from '../components/HeartHeroIllustration';

interface HeroSectionProps {
  metrics: {
    live_models: {
      'Logistic Regression': {
        auc: number;
        test_ca: number;
      };
    };
    insights: {
      class_balance: {
        prevalence_pct: number;
      };
    };
  } | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ metrics }) => {
  const auc = metrics?.live_models['Logistic Regression']?.auc ?? 0.939;
  const prevalence = metrics?.insights?.class_balance?.prevalence_pct ?? 45.9;

  return (
    <section id="hero" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4.5rem)', paddingBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
      <div className="container">
        {/* Asymmetric 7/5 Split Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(1.5rem, 4vw, 3.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column (7 cols on desktop) */}
          <div className="hero-left">
            <span className="eyebrow eyebrow-brass">Cleveland Heart Disease · Mini-Project 3</span>
            <h1
              style={{
                marginBottom: '1.25rem',
                color: 'var(--ink)',
              }}
            >
              Thirteen routine measurements. One honest second opinion.
            </h1>
            <p className="lead-text" style={{ marginBottom: '2rem' }}>
              A student educational prototype trained on 303 patients from the UCI Cleveland cardiology cohort. It assesses binary heart disease risk using calibrated logistic regression with explicit error boundaries and verifiable coefficients.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
              <a href="#assess" className="btn btn-primary">
                Start an assessment
              </a>
              <a href="#how-built" className="text-link" style={{ fontSize: '0.88rem' }}>
                How it was built
                <span aria-hidden="true" style={{ fontSize: '1.1em' }}>→</span>
              </a>
            </div>
          </div>

          {/* Right Column (5 cols on desktop) - Anatomical Engraved Plate */}
          <div className="hero-right">
            <HeartHeroIllustration />
          </div>
        </div>

        {/* Thin Ledger Row of Live Numbers */}
        <div
          style={{
            marginTop: 'clamp(3rem, 6vw, 5rem)',
            paddingTop: '1.5rem',
            paddingBottom: '1.5rem',
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* 1. Patients */}
          <div className="ledger-cell" style={{ borderRight: '1px solid var(--line)', paddingRight: '1rem' }}>
            <span className="eyebrow" style={{ marginBottom: '0.2rem' }}>Cohort size</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--ink)' }}>
                303
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--mute)' }}>patients</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--mute)' }}>Cleveland clinical records</div>
          </div>

          {/* 2. Measurements */}
          <div className="ledger-cell" style={{ borderRight: '1px solid var(--line)', paddingRight: '1rem' }}>
            <span className="eyebrow" style={{ marginBottom: '0.2rem' }}>Input vector</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--ink)' }}>
                13
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--mute)' }}>clinical tests</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--mute)' }}>Vessels, ST segment, enzymes</div>
          </div>

          {/* 3. Disease Prevalence */}
          <div className="ledger-cell" style={{ borderRight: '1px solid var(--line)', paddingRight: '1rem' }}>
            <span className="eyebrow" style={{ marginBottom: '0.2rem' }}>Prevalence</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--ink)' }}>
                {Math.round(prevalence)}%
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--mute)' }}>positive</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--mute)' }}>139 positive / 164 negative</div>
          </div>

          {/* 4. Model AUC */}
          <div className="ledger-cell">
            <span className="eyebrow eyebrow-brass" style={{ marginBottom: '0.2rem' }}>Model discrimination</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--pine)' }}>
                {auc.toFixed(3)}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--mute)' }}>AUC</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--mute)' }}>Test set ROC (N=91)</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .hero-left {
            grid-column: span 7 !important;
          }
          .hero-right {
            grid-column: span 5 !important;
          }
        }
        @media (max-width: 600px) {
          .ledger-cell {
            border-right: none !important;
            border-bottom: 1px solid var(--line);
            padding-bottom: 1rem;
          }
          .ledger-cell:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
};

