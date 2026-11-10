import React from 'react';

interface FairnessSectionProps {
  metrics: {
    fairness: {
      men: {
        group: string;
        total: number;
        positives: number;
        negatives: number;
        tp: number;
        fn: number;
        tn: number;
        fp: number;
        sensitivity: number;
        sensitivity_ci_95: [number, number];
        specificity: number;
        specificity_ci_95: [number, number];
        accuracy: number;
        sensitivity_ratio: string;
        specificity_ratio: string;
        small_sample_warning: boolean;
      };
      women: {
        group: string;
        total: number;
        positives: number;
        negatives: number;
        tp: number;
        fn: number;
        tn: number;
        fp: number;
        sensitivity: number;
        sensitivity_ci_95: [number, number];
        specificity: number;
        specificity_ci_95: [number, number];
        accuracy: number;
        sensitivity_ratio: string;
        specificity_ratio: string;
        small_sample_warning: boolean;
      };
      sample_size_assessment: string;
    };
  };
}

export const FairnessSection: React.FC<FairnessSectionProps> = ({ metrics }) => {
  const { men, women, sample_size_assessment } = metrics.fairness;

  return (
    <section id="fairness" className="section-spacing hairline-b" style={{ backgroundColor: 'var(--bone)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '680px', marginBottom: '3rem' }}>
          <span className="eyebrow eyebrow-brass">Section 05 · Responsible AI & Governance</span>
          <h2 style={{ marginBottom: '0.75rem' }}>Demographic Fairness & Verification</h2>
          <p className="lead-text">
            Auditing model behavior across patient demographic subgroups, verifying documentation against AI hallucinations, and establishing ethical boundaries for clinical second opinions.
          </p>
        </div>

        {/* SUBGROUP METRICS & STATISTICAL AUDIT */}
        <div className="hairline-box" style={{ padding: 'clamp(1.5rem, 3vw, 2.25rem)', backgroundColor: 'var(--paper)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="eyebrow" style={{ marginBottom: '0.2rem' }}>Subgroup Disaggregation</span>
              <h3 style={{ fontSize: '1.25rem' }}>Test-Set Performance by Biological Sex</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="chip chip-warning">Cohort Bias: 68% Male</span>
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--mute)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            The Cleveland dataset was collected primarily from male cardiology referrals in 1989 (206 men vs 97 women). In the held-out test split ($N = 91$), only 11 women had diagnosed heart disease compared to 31 men. Below are exact sensitivity and specificity ratios accompanied by <strong>Wilson 95% Score Confidence Intervals</strong>.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* MEN GROUP CARD */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bone)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>Men ({men.group})</h4>
                <span className="chip chip-neutral">N = {men.total} test records</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--mute)' }}>Sensitivity (Recall)</span>
                    <strong className="tabular-nums">{(men.sensitivity * 100).toFixed(1)}% ({men.sensitivity_ratio})</strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--mute)', marginTop: '0.1rem' }}>
                    Wilson 95% CI: [{(men.sensitivity_ci_95[0] * 100).toFixed(1)}% – {(men.sensitivity_ci_95[1] * 100).toFixed(1)}%]
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--mute)' }}>Specificity (1 – FPR)</span>
                    <strong className="tabular-nums">{(men.specificity * 100).toFixed(1)}% ({men.specificity_ratio})</strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--mute)', marginTop: '0.1rem' }}>
                    Wilson 95% CI: [{(men.specificity_ci_95[0] * 100).toFixed(1)}% – {(men.specificity_ci_95[1] * 100).toFixed(1)}%]
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '0.5rem', fontSize: '0.72rem', color: 'var(--mute)' }}>
                  Breakdown: {men.tp} TP, {men.fn} FN (missed), {men.tn} TN, {men.fp} FP
                </div>
              </div>
            </div>

            {/* WOMEN GROUP CARD */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bone)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>Women ({women.group})</h4>
                <span className="chip chip-warning">N = {women.total} test records</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--mute)' }}>Sensitivity (Recall)</span>
                    <strong className="tabular-nums">{(women.sensitivity * 100).toFixed(1)}% ({women.sensitivity_ratio})</strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--mute)', marginTop: '0.1rem' }}>
                    Wilson 95% CI: [{(women.sensitivity_ci_95[0] * 100).toFixed(1)}% – {(women.sensitivity_ci_95[1] * 100).toFixed(1)}%]
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--mute)' }}>Specificity (1 – FPR)</span>
                    <strong className="tabular-nums">{(women.specificity * 100).toFixed(1)}% ({women.specificity_ratio})</strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--mute)', marginTop: '0.1rem' }}>
                    Wilson 95% CI: [{(women.specificity_ci_95[0] * 100).toFixed(1)}% – {(women.specificity_ci_95[1] * 100).toFixed(1)}%]
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '0.5rem', fontSize: '0.72rem', color: '#7A5B1D' }}>
                  <strong>Small sample warning:</strong> Only 11 positive cases in test set (fewer than 30 required for statistical power).
                </div>
              </div>
            </div>
          </div>

          {/* Statistical Equivalence Pull-Quote */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--paper)',
              borderLeft: '3px solid var(--brass)',
              borderTop: '1px solid var(--line)',
              borderRight: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
              fontSize: '0.84rem',
              color: 'var(--ink)',
              lineHeight: 1.6,
            }}
          >
            <strong>Statistical Assessment:</strong> {sample_size_assessment} Apparent sensitivity differences between men (83.9%) and women (81.8%) are within expected statistical variance and cannot support claims of demographic bias or disparity.
          </div>
        </div>

        {/* TWO EDITORIAL BLOCKS: HALLUCINATION CHECK & PRIVACY/SAFETY */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* 1. HALLUCINATION CHECK */}
          <div className="hairline-box" style={{ padding: '1.75rem', backgroundColor: 'var(--paper)' }}>
            <span className="eyebrow eyebrow-brass" style={{ marginBottom: '0.35rem' }}>
              Verification Case Study
            </span>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              AI Hallucination Audit (GPT-6 Check)
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--mute)', lineHeight: 1.6, marginBottom: '1rem' }}>
              During project preparation, the team interrogated a modern language model (GPT-6, Nov 2026 version) to define the clinical variables <em>ca</em>, <em>thal</em>, and <em>oldpeak</em>. The model hallucinated two key errors:
            </p>
            <ul style={{ fontSize: '0.8rem', color: 'var(--ink)', lineHeight: 1.6, paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li>
                It invented <strong>&ldquo;mm&rdquo;</strong> as the measurement unit for <em>oldpeak</em> (the official UCI Cleveland documentation lists no unit, representing relative dimensionless ST-segment depression).
              </li>
              <li>
                It asserted that <em>ca</em> counted vessels that were <strong>&ldquo;visualized&rdquo;</strong> (the actual clinical metric counts vessels coloured by fluoroscopic radiocontrast dye).
              </li>
            </ul>
            <p style={{ fontSize: '0.78rem', color: 'var(--mute)', lineHeight: 1.5 }}>
              The team manually audited every parameter against original 1989 repository records by Detrano et al. to guarantee clinical precision.
            </p>
          </div>

          {/* 2. PRIVACY & SAFETY BOUNDARIES */}
          <div className="hairline-box" style={{ padding: '1.75rem', backgroundColor: 'var(--paper)' }}>
            <span className="eyebrow" style={{ marginBottom: '0.35rem' }}>
              Governance & Clinical Ethics
            </span>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              Privacy, Safety & Client-Side Sandbox
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--mute)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Cardiovascular diagnosis directly impacts patient triage. A false negative (7 observed in our test set) risks delaying life-saving cardiac catheterization, while a false positive induces unnecessary stress and procedural risks.
            </p>
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--bone)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.78rem',
                marginBottom: '1rem',
              }}
            >
              <strong style={{ color: 'var(--pine)' }}>100% Client-Side Execution:</strong> All numerical linear algebra runs exclusively inside your browser's JavaScript V8 engine. No patient inputs are ever transmitted over the network or logged to external telemetry.
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--mute)', lineHeight: 1.5 }}>
              The training records from Janosi et al. are fully anonymised. Deployment of clinical ML in production requires institutional review, informed consent, and physician oversight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

