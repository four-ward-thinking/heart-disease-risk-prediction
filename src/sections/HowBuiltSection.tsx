import React from 'react';

export const HowBuiltSection: React.FC = () => {
  return (
    <section id="how-built" className="section-spacing hairline-b" style={{ backgroundColor: 'var(--bone)' }}>
      <div className="container">
        <div style={{ maxWidth: '640px', marginBottom: '3.5rem' }}>
          <span className="eyebrow eyebrow-brass">Section 02 · Methodology</span>
          <h2 style={{ marginBottom: '0.75rem' }}>How the Pipeline Was Constructed</h2>
          <p className="lead-text">
            Three disciplined engineering stages connecting raw clinical charts from 1989 to verified in-browser inference.
          </p>
        </div>

        {/* Snaking Dotted Route with 3 Alternating Steps */}
        <div style={{ position: 'relative' }}>
          {/* Background Connecting Dotted Route (SVG) */}
          <svg
            className="snaking-route-svg"
            viewBox="0 0 1000 680"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 0,
            }}
            aria-hidden="true"
          >
            <path
              d="M 280 120 C 650 120 750 340 750 340 C 750 340 650 560 280 560"
              fill="none"
              stroke="var(--brass)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.5"
            />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 1 }}>
            {/* STEP 01: CLEAN */}
            <div
              className="hairline-box step-card"
              style={{
                maxWidth: '680px',
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                backgroundColor: 'var(--paper)',
                alignSelf: 'flex-start',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.5rem',
                    fontWeight: 300,
                    color: 'var(--brass-text)',
                    lineHeight: 1,
                  }}
                >
                  01
                </span>
                <span className="chip chip-neutral">Data Curation</span>
              </div>
              <h3 style={{ marginBottom: '0.65rem' }}>Clean, Impute & Preserve Real Outliers</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--mute)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                We loaded the 303 patient records from Cleveland. Only 6 cells across 4,242 data points were missing (4 in <em>ca</em>, 2 in <em>thal</em>). Following standard clinical reporting, these were imputed using training set modes (0 vessels and normal thallium). Zero duplicate records were present. Crucially, the serum cholesterol maximum of 564 mg/dl was preserved rather than trimmed—cardiology patients exhibit severe hypercholesterolemia, and standard scaling protects model gradients without erasing patient reality.
              </p>

              {/* Small supporting figure */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bone)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.75rem',
                }}
              >
                <div>
                  <div style={{ color: 'var(--mute)' }}>Missingness</div>
                  <strong style={{ color: 'var(--ink)' }}>6 cells (0.14%)</strong>
                </div>
                <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '1.25rem' }}>
                  <div style={{ color: 'var(--mute)' }}>Duplicates</div>
                  <strong style={{ color: 'var(--sage-text)' }}>0 found (100% unique)</strong>
                </div>
                <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '1.25rem' }}>
                  <div style={{ color: 'var(--mute)' }}>Chol Outlier</div>
                  <strong style={{ color: 'var(--ink)' }}>564 mg/dl retained</strong>
                </div>
              </div>
            </div>

            {/* STEP 02: TRAIN */}
            <div
              className="hairline-box step-card"
              style={{
                maxWidth: '680px',
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                backgroundColor: 'var(--paper)',
                alignSelf: 'flex-end',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.5rem',
                    fontWeight: 300,
                    color: 'var(--brass-text)',
                    lineHeight: 1,
                  }}
                >
                  02
                </span>
                <span className="chip chip-neutral">Stratified Training</span>
              </div>
              <h3 style={{ marginBottom: '0.65rem' }}>Fixed Stratified Split & 5-Model Benchmark</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--mute)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                To avoid optimistic bias, a strict 70/30 stratified train/test split was locked at <code>random_state=42</code> (212 training, 91 held-out test records). Five distinct model paradigms were trained using identical preprocessing: z-score standardisation on 5 continuous variables and one-hot encoding on 8 categorical variables. While tree ensembles achieved 100% training accuracy through rote memorisation, Logistic Regression delivered superior test-set discrimination (AUC 0.939).
              </p>

              {/* Small supporting figure */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bone)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.75rem',
                }}
              >
                <div>
                  <div style={{ color: 'var(--mute)' }}>Split ratio</div>
                  <strong style={{ color: 'var(--ink)' }}>212 train / 91 test</strong>
                </div>
                <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '1.25rem' }}>
                  <div style={{ color: 'var(--mute)' }}>Best Test AUC</div>
                  <strong style={{ color: 'var(--pine)' }}>0.939 (Logistic Reg.)</strong>
                </div>
                <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '1.25rem' }}>
                  <div style={{ color: 'var(--mute)' }}>Tree Overfitting</div>
                  <strong style={{ color: 'var(--crimson)' }}>1.000 vs 0.659 CA</strong>
                </div>
              </div>
            </div>

            {/* STEP 03: CHECK */}
            <div
              className="hairline-box step-card"
              style={{
                maxWidth: '680px',
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                backgroundColor: 'var(--paper)',
                alignSelf: 'flex-start',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.5rem',
                    fontWeight: 300,
                    color: 'var(--brass-text)',
                    lineHeight: 1,
                  }}
                >
                  03
                </span>
                <span className="chip chip-neutral">Audit & Verification</span>
              </div>
              <h3 style={{ marginBottom: '0.65rem' }}>Honest Metrics, Wilson CIs & Local Execution</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--mute)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                We audited the model against clinical safety constraints: calculating exact false negative rates (7 of 42 patients missed), Wilson 95% confidence intervals across sex subgroups, and flagging small-sample distortions (women make up only 32% of the dataset). All weights and thresholds were exported to static JSON, allowing this web app to execute identical dot products in browser memory without sending private health data to any server.
              </p>

              {/* Small supporting figure */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bone)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.75rem',
                }}
              >
                <div>
                  <div style={{ color: 'var(--mute)' }}>False Negatives</div>
                  <strong style={{ color: 'var(--crimson)' }}>7 of 42 missed</strong>
                </div>
                <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '1.25rem' }}>
                  <div style={{ color: 'var(--mute)' }}>Women Sample</div>
                  <strong style={{ color: 'var(--brass-text)' }}>N=11 pos (low power)</strong>
                </div>
                <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '1.25rem' }}>
                  <div style={{ color: 'var(--mute)' }}>Data Privacy</div>
                  <strong style={{ color: 'var(--sage-text)' }}>100% Client-side</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .step-card {
            align-self: stretch !important;
            max-width: 100% !important;
          }
          .snaking-route-svg {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
