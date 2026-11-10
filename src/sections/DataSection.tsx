import React, { useState, useMemo, useId } from 'react';
import { ModelSpec } from '../lib/predict';

interface DataSectionProps {
  model: ModelSpec;
  metrics: {
    insights: {
      thalach_by_diagnosis: {
        mean_no_disease: number;
        mean_disease: number;
        t_statistic: number;
        p_value: number;
      };
      disease_rate_by_sex: {
        men_total: number;
        men_disease: number;
        men_prevalence_pct: number;
        women_total: number;
        women_disease: number;
        women_prevalence_pct: number;
      };
      class_balance: {
        no_disease: number;
        disease: number;
        prevalence_pct: number;
      };
      cholesterol_outlier: {
        max: number;
        patient_age: number;
        patient_sex: number;
        note: string;
      };
    };
  };
  dataset: Array<{
    id: number;
    split: string;
    age: number;
    sex: number;
    cp: number;
    trestbps: number;
    chol: number;
    fbs: number;
    restecg: number;
    thalach: number;
    exang: number;
    oldpeak: number;
    slope: number;
    ca: number | null;
    thal: number | null;
    diagnosis: number;
  }>;
}

export const DataSection: React.FC<DataSectionProps> = ({ model, metrics, dataset }) => {
  const [selectedFeature, setSelectedFeature] = useState<string>('thalach');
  const featureSelectId = useId();

  const insights = metrics.insights;

  // Features list for dropdown
  const featureOptions = [
    { key: 'thalach', label: 'Maximum Heart Rate (thalach)' },
    { key: 'age', label: 'Age' },
    { key: 'chol', label: 'Serum Cholesterol (chol)' },
    { key: 'trestbps', label: 'Resting Blood Pressure (trestbps)' },
    { key: 'oldpeak', label: 'ST Depression (oldpeak)' },
    { key: 'cp', label: 'Chest Pain Type (cp)' },
    { key: 'sex', label: 'Sex' },
    { key: 'ca', label: 'Major Vessels (ca)' },
    { key: 'thal', label: 'Thallium Stress Test Result (thal)' },
    { key: 'exang', label: 'Exercise Angina (exang)' },
    { key: 'slope', label: 'ST Slope (slope)' },
    { key: 'fbs', label: 'Fasting Blood Sugar (fbs)' },
    { key: 'restecg', label: 'Resting ECG (restecg)' },
  ];

  // Compute distribution bins for selected feature split by diagnosis
  const distributionData = useMemo(() => {
    const isNumeric = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak'].includes(selectedFeature);

    const getVal = (d: any, key: string): number => {
      const v = d[key];
      if (v === null || v === undefined) {
        return key === 'ca' ? (model.impute_modes['ca'] ?? 0) : (model.impute_modes['thal'] ?? 3);
      }
      return Number(v);
    };

    if (isNumeric) {
      const values = dataset.map((d) => getVal(d, selectedFeature));
      const min = Math.min(...values);
      const max = Math.max(...values);
      const binCount = 8;
      const binWidth = (max - min) / binCount;

      const bins = Array.from({ length: binCount }, (_, i) => {
        const binStart = min + i * binWidth;
        const binEnd = binStart + binWidth;
        const healthyInBin = dataset.filter((d) => {
          if (d.diagnosis !== 0) return false;
          const val = getVal(d, selectedFeature);
          return i === binCount - 1 ? val >= binStart && val <= binEnd : val >= binStart && val < binEnd;
        }).length;

        const diseaseInBin = dataset.filter((d) => {
          if (d.diagnosis !== 1) return false;
          const val = getVal(d, selectedFeature);
          return i === binCount - 1 ? val >= binStart && val <= binEnd : val >= binStart && val < binEnd;
        }).length;

        return {
          label: `${binStart.toFixed(0)}–${binEnd.toFixed(0)}`,
          healthy: healthyInBin,
          disease: diseaseInBin,
        };
      });

      return { isNumeric: true, bins };
    } else {
      // Categorical feature
      const domain = model.cat_domains[selectedFeature] || [0, 1];
      const bins = domain.map((val) => {
        const healthyCount = dataset.filter((d) => d.diagnosis === 0 && getVal(d, selectedFeature) === val).length;
        const diseaseCount = dataset.filter((d) => d.diagnosis === 1 && getVal(d, selectedFeature) === val).length;

        return {
          label: `Code ${val}`,
          healthy: healthyCount,
          disease: diseaseCount,
        };
      });

      return { isNumeric: false, bins };
    }
  }, [selectedFeature, dataset, model.cat_domains, model.impute_modes]);

  // Download cleaned CSV
  const handleDownloadCsv = () => {
    const headers = [
      'id',
      'split',
      'age',
      'sex',
      'cp',
      'trestbps',
      'chol',
      'fbs',
      'restecg',
      'thalach',
      'exang',
      'oldpeak',
      'slope',
      'ca',
      'thal',
      'diagnosis',
    ];

    const csvRows = [headers.join(',')];
    for (const d of dataset) {
      csvRows.push(
        [
          d.id,
          d.split,
          d.age,
          d.sex,
          d.cp,
          d.trestbps,
          d.chol,
          d.fbs,
          d.restecg,
          d.thalach,
          d.exang,
          d.oldpeak,
          d.slope,
          d.ca ?? model.impute_modes['ca'],
          d.thal ?? model.impute_modes['thal'],
          d.diagnosis,
        ].join(',')
      );
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'heart_cleveland_curated.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Data dictionary
  const dataDictionary = [
    { name: 'age', type: 'numeric', desc: 'Patient age in years', range: '29–77 yrs' },
    { name: 'sex', type: 'categorical', desc: 'Biological sex (1 = male, 0 = female)', range: '0, 1' },
    { name: 'cp', type: 'categorical', desc: 'Chest pain type (1=typical, 2=atypical, 3=non-anginal, 4=asymptomatic)', range: '1, 2, 3, 4' },
    { name: 'trestbps', type: 'numeric', desc: 'Resting blood pressure on hospital admission', range: '94–200 mm Hg' },
    { name: 'chol', type: 'numeric', desc: 'Serum cholesterol level', range: '126–564 mg/dl' },
    { name: 'fbs', type: 'categorical', desc: 'Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)', range: '0, 1' },
    { name: 'restecg', type: 'categorical', desc: 'Resting ECG results (0=normal, 1=ST-T abnormality, 2=LV hypertrophy)', range: '0, 1, 2' },
    { name: 'thalach', type: 'numeric', desc: 'Maximum heart rate achieved during exercise stress test', range: '71–202 bpm' },
    { name: 'exang', type: 'categorical', desc: 'Exercise-induced angina (1 = yes, 0 = no)', range: '0, 1' },
    { name: 'oldpeak', type: 'numeric', desc: 'ST depression induced by exercise relative to rest', range: '0.0–6.2' },
    { name: 'slope', type: 'categorical', desc: 'Slope of peak exercise ST segment (1=upsloping, 2=flat, 3=downsloping)', range: '1, 2, 3' },
    { name: 'ca', type: 'categorical', desc: 'Major vessels coloured by fluoroscopy', range: '0, 1, 2, 3' },
    { name: 'thal', type: 'categorical', desc: 'Thallium stress test result (3=normal, 6=fixed defect, 7=reversible)', range: '3, 6, 7' },
    { name: 'diagnosis', type: 'target', desc: 'Presence of heart disease (0 = absent, 1 = present)', range: '0, 1' },
  ];

  return (
    <section id="data" className="section-spacing hairline-b" style={{ backgroundColor: 'var(--bone)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
          <span className="eyebrow eyebrow-brass">Section 04 · Data Explorer</span>
          <h2 style={{ marginBottom: '0.75rem' }}>The Cleveland Cardiology Cohort</h2>
          <p className="lead-text">
            Explore 303 curated patient records from Janosi et al. (1989). Inspect continuous distributions, class balance, and feature correlations directly.
          </p>
        </div>

        {/* Preset Key Insights Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '2rem',
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Key insights:
          </span>
          <button
            type="button"
            className="btn btn-outline btn-small"
            onClick={() => setSelectedFeature('thalach')}
            style={{
              backgroundColor: selectedFeature === 'thalach' ? 'var(--paper)' : 'transparent',
              borderColor: selectedFeature === 'thalach' ? 'var(--brass)' : 'var(--line)',
            }}
          >
            Max Heart Rate by Diagnosis (p &lt; 0.001)
          </button>
          <button
            type="button"
            className="btn btn-outline btn-small"
            onClick={() => setSelectedFeature('sex')}
            style={{
              backgroundColor: selectedFeature === 'sex' ? 'var(--paper)' : 'transparent',
              borderColor: selectedFeature === 'sex' ? 'var(--brass)' : 'var(--line)',
            }}
          >
            Disease Rate by Sex (55% Men vs 26% Women)
          </button>
          <button
            type="button"
            className="btn btn-outline btn-small"
            onClick={() => setSelectedFeature('cp')}
            style={{
              backgroundColor: selectedFeature === 'cp' ? 'var(--paper)' : 'transparent',
              borderColor: selectedFeature === 'cp' ? 'var(--brass)' : 'var(--line)',
            }}
          >
            Chest Pain Type Breakdown
          </button>
        </div>

        {/* Feature Explorer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            alignItems: 'start',
            marginBottom: '3rem',
          }}
        >
          {/* LEFT: INTERACTIVE HISTOGRAM & DISTRIBUTION (7 cols) */}
          <div style={{ gridColumn: 'span 12' }} className="data-left">
            <div className="hairline-box" style={{ padding: '1.5rem', backgroundColor: 'var(--paper)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <span className="eyebrow" style={{ marginBottom: '0.2rem' }}>Feature Distribution</span>
                  <h3 style={{ fontSize: '1.15rem' }}>Split by Disease Status</h3>
                </div>

                {/* Feature Selector Dropdown */}
                <div style={{ minWidth: '220px' }}>
                  <label htmlFor={featureSelectId} className="sr-only">Select Clinical Feature</label>
                  <select
                    id={featureSelectId}
                    value={selectedFeature}
                    onChange={(e) => setSelectedFeature(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--bone)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                  >
                    {featureOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--sage)', display: 'inline-block' }} />
                  <span>No Disease (diagnosis=0)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--crimson)', display: 'inline-block' }} />
                  <span>Disease Present (diagnosis=1)</span>
                </div>
              </div>

              {/* Hand-built SVG Distribution Chart */}
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <svg viewBox="0 0 540 260" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  {/* Find max count across bins */}
                  {(() => {
                    const maxCount = Math.max(
                      ...distributionData.bins.map((b) => Math.max(b.healthy, b.disease)),
                      25
                    );
                    const chartHeight = 180;
                    const chartWidth = 460;
                    const chartOriginX = 45;
                    const chartOriginY = 205;
                    const binWidth = chartWidth / distributionData.bins.length;

                    return (
                      <g>
                        {/* Horizontal Gridlines */}
                        {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
                          const y = chartOriginY - ratio * chartHeight;
                          const val = Math.round(ratio * maxCount);
                          return (
                            <g key={ratio}>
                              <line
                                x1={chartOriginX}
                                y1={y}
                                x2={chartOriginX + chartWidth}
                                y2={y}
                                stroke="var(--line)"
                                strokeWidth="0.75"
                                strokeDasharray={ratio === 0 ? 'none' : '2 2'}
                              />
                              <text
                                x={chartOriginX - 8}
                                y={y + 3}
                                textAnchor="end"
                                fontSize="9"
                                fill="var(--mute)"
                                fontFamily="var(--font-sans)"
                              >
                                {val}
                              </text>
                            </g>
                          );
                        })}

                        {/* Bars */}
                        {distributionData.bins.map((b, i) => {
                          const xCenter = chartOriginX + i * binWidth + binWidth / 2;
                          const barW = Math.min(22, (binWidth - 8) / 2);

                          const hHealthy = (b.healthy / maxCount) * chartHeight;
                          const hDisease = (b.disease / maxCount) * chartHeight;

                          return (
                            <g key={i}>
                              {/* Healthy Bar (Sage) */}
                              <rect
                                x={xCenter - barW - 1}
                                y={chartOriginY - hHealthy}
                                width={barW}
                                height={hHealthy}
                                fill="var(--sage)"
                                opacity="0.9"
                                rx="1"
                              >
                                <title>{`No disease: ${b.healthy}`}</title>
                              </rect>

                              {/* Disease Bar (Crimson) */}
                              <rect
                                x={xCenter + 1}
                                y={chartOriginY - hDisease}
                                width={barW}
                                height={hDisease}
                                fill="var(--crimson)"
                                opacity="0.9"
                                rx="1"
                              >
                                <title>{`Disease present: ${b.disease}`}</title>
                              </rect>

                              {/* Bin X-Axis Label */}
                              <text
                                x={xCenter}
                                y={chartOriginY + 18}
                                textAnchor="middle"
                                fontSize="9"
                                fill="var(--ink)"
                                fontFamily="var(--font-sans)"
                              >
                                {b.label}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Feature Insight Note */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bone)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.78rem',
                  color: 'var(--ink)',
                }}
              >
                {selectedFeature === 'thalach' && (
                  <div>
                    <strong>Welch Two-Sample t-test:</strong> Mean max heart rate is{' '}
                    <strong>{insights.thalach_by_diagnosis.mean_no_disease} bpm</strong> in healthy patients vs{' '}
                    <strong>{insights.thalach_by_diagnosis.mean_disease} bpm</strong> in heart disease patients (
                    <em>t</em> = {insights.thalach_by_diagnosis.t_statistic}, <em>p</em> ={' '}
                    {insights.thalach_by_diagnosis.p_value.toExponential(2)}). Higher peak exercise heart rate is strongly protective.
                  </div>
                )}
                {selectedFeature === 'sex' && (
                  <div>
                    <strong>Prevalence by Sex:</strong> Heart disease is present in{' '}
                    <strong>{insights.disease_rate_by_sex.men_prevalence_pct}%</strong> of men ({insights.disease_rate_by_sex.men_disease} of {insights.disease_rate_by_sex.men_total}) versus{' '}
                    <strong>{insights.disease_rate_by_sex.women_prevalence_pct}%</strong> of women ({insights.disease_rate_by_sex.women_disease} of {insights.disease_rate_by_sex.women_total}).
                  </div>
                )}
                {selectedFeature !== 'thalach' && selectedFeature !== 'sex' && (
                  <div>
                    <strong>Clinical Note:</strong> Showing distribution across all 303 patients. In Logistic Regression, continuous features are standardised with zero-mean unit-variance, preventing high-scale metrics from dominating the gradient.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: AGGREGATED 13-FEATURE IMPORTANCE (5 cols) - Point 5 */}
          <div style={{ gridColumn: 'span 12' }} className="data-right">
            <div className="hairline-box" style={{ padding: '1.5rem', backgroundColor: 'var(--paper)' }}>
              <div style={{ marginBottom: '1rem' }}>
                <span className="eyebrow" style={{ marginBottom: '0.2rem' }}>Logistic Weights</span>
                <h3 style={{ fontSize: '1.15rem' }}>13 Clinical Feature Importances</h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--mute)' }}>
                  Aggregated back to the 13 clinical tests (maximum category coefficient magnitude for categoricals; standardized weight for continuous):
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {model.feature_importance_13.map((f, i) => {
                  const maxImportance = model.feature_importance_13[0].importance;
                  const barWidthPct = Math.min(100, Math.max(6, (f.importance / maxImportance) * 100));

                  return (
                    <div key={f.feature} style={{ fontSize: '0.74rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                          {i + 1}. {f.label}
                        </span>
                        <span className="tabular-nums" style={{ color: 'var(--mute)' }}>
                          |w| = {f.importance.toFixed(2)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '5px',
                          backgroundColor: 'var(--bone)',
                          borderRadius: '1px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${barWidthPct}%`,
                            height: '100%',
                            backgroundColor: i < 3 ? 'var(--pine)' : 'var(--brass)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Outlier Inspection Callout */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bone)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.74rem',
                }}
              >
                <strong>Cholesterol Outlier ({insights.cholesterol_outlier.max} mg/dl):</strong> Patient #153 (67-year-old female). Kept in dataset because standardisation prevents extreme values from distorting logistic loss without throwing out genuine medical data.
              </div>
            </div>
          </div>
        </div>

        {/* COMPACT DATA DICTIONARY TABLE */}
        <div className="hairline-box" style={{ padding: '1.5rem', backgroundColor: 'var(--paper)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span className="eyebrow" style={{ marginBottom: '0.2rem' }}>Dataset Schema</span>
              <h3 style={{ fontSize: '1.15rem' }}>Data Dictionary (13 Predictors + Binary Target)</h3>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={handleDownloadCsv}
              style={{ color: 'var(--pine)', borderColor: 'var(--pine)' }}
            >
              Download Curated CSV (303 rows)
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--mute)' }}>
                  <th style={{ padding: '0.45rem 0.5rem 0.45rem 0', fontWeight: 600 }}>Variable</th>
                  <th style={{ padding: '0.45rem 0.5rem', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '0.45rem 0.5rem', fontWeight: 600 }}>Clinical Description</th>
                  <th style={{ padding: '0.45rem 0 0.45rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Observed Domain</th>
                </tr>
              </thead>
              <tbody>
                {dataDictionary.map((col) => (
                  <tr key={col.name} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.5rem 0.5rem 0.5rem 0', fontFamily: 'monospace', fontWeight: 600, color: 'var(--ink)' }}>
                      {col.name}
                    </td>
                    <td style={{ padding: '0.5rem', color: col.type === 'target' ? 'var(--crimson)' : 'var(--mute)' }}>
                      {col.type}
                    </td>
                    <td style={{ padding: '0.5rem', color: 'var(--ink)' }}>{col.desc}</td>
                    <td className="tabular-nums" style={{ padding: '0.5rem 0 0.5rem 0.5rem', textAlign: 'right', color: 'var(--mute)' }}>
                      {col.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .data-left {
            grid-column: span 7 !important;
          }
          .data-right {
            grid-column: span 5 !important;
          }
        }
      `}</style>
    </section>
  );
};
