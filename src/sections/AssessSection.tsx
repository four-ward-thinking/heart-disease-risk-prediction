import React, { useState, useEffect, useMemo, useId } from 'react';
import { ModelSpec, PatientInput, predictPatient, PredictionResult } from '../lib/predict';

interface AssessSectionProps {
  model: ModelSpec;
  metrics: {
    caveat_line: string;
    test_patients: Array<{
      true_label: number;
      prob: number;
      sex: number;
    }>;
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
    model_prob: number;
  }>;
}

// Default baseline patient: typical healthy reference
const DEFAULT_PATIENT: PatientInput = {
  age: 54,
  sex: 1,
  cp: 3,
  trestbps: 130,
  chol: 240,
  fbs: 0,
  restecg: 0,
  thalach: 150,
  exang: 0,
  oldpeak: 0.8,
  slope: 1,
  ca: 0,
  thal: 3,
};

export const AssessSection: React.FC<AssessSectionProps> = ({ model, metrics, dataset }) => {
  const [patient, setPatient] = useState<PatientInput>(DEFAULT_PATIENT);
  const [decisionThreshold, setDecisionThreshold] = useState<number>(0.50);
  const [loadedSample, setLoadedSample] = useState<{
    name: string;
    id: number;
    actualDiagnosis: number;
  } | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<boolean>(false);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  // Accessible IDs for inputs
  const ageId = useId();
  const sexId = useId();
  const cpId = useId();
  const trestbpsId = useId();
  const cholId = useId();
  const fbsId = useId();
  const restecgId = useId();
  const thalachId = useId();
  const exangId = useId();
  const oldpeakId = useId();
  const slopeId = useId();
  const caId = useId();
  const thalId = useId();
  const thresholdId = useId();

  // Debounced prediction calculation (150ms)
  const [debouncedPatient, setDebouncedPatient] = useState<PatientInput>(patient);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPatient(patient);
    }, 150);
    return () => clearTimeout(timer);
  }, [patient]);

  const prediction: PredictionResult = useMemo(() => {
    return predictPatient(debouncedPatient, model);
  }, [debouncedPatient, model]);

  // Compute test-set trade-offs dynamically at the chosen decision threshold
  const testSetStatsAtThreshold = useMemo(() => {
    const testPatients = metrics.test_patients;
    let tp = 0;
    let fn = 0;
    let tn = 0;
    let fp = 0;

    for (const p of testPatients) {
      const pred = p.prob >= decisionThreshold ? 1 : 0;
      if (p.true_label === 1 && pred === 1) tp++;
      else if (p.true_label === 1 && pred === 0) fn++;
      else if (p.true_label === 0 && pred === 0) tn++;
      else if (p.true_label === 0 && pred === 1) fp++;
    }

    const pos = tp + fn;
    const neg = tn + fp;
    const sensitivity = pos > 0 ? tp / pos : 0;
    const specificity = neg > 0 ? tn / neg : 0;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;

    return {
      tp,
      fn,
      tn,
      fp,
      sensitivity,
      specificity,
      precision,
      missedCount: fn,
    };
  }, [decisionThreshold, metrics.test_patients]);

  // Held-out test split samples (Verified IDs from dataset.json test split)
  const loadSample = (sampleType: 'A' | 'B' | 'C') => {
    if (sampleType === 'A') {
      // Test ID 244: Clear low risk, actual diagnosis 0
      const row = dataset.find((d) => d.id === 244);
      if (row) {
        setPatient({
          age: row.age,
          sex: row.sex,
          cp: row.cp,
          trestbps: row.trestbps,
          chol: row.chol,
          fbs: row.fbs,
          restecg: row.restecg,
          thalach: row.thalach,
          exang: row.exang,
          oldpeak: row.oldpeak,
          slope: row.slope,
          ca: row.ca,
          thal: row.thal,
        });
        setLoadedSample({ name: 'Sample A (Low risk)', id: 244, actualDiagnosis: 0 });
      }
    } else if (sampleType === 'B') {
      // Test ID 175: Clear high risk, actual diagnosis 1
      const row = dataset.find((d) => d.id === 175);
      if (row) {
        setPatient({
          age: row.age,
          sex: row.sex,
          cp: row.cp,
          trestbps: row.trestbps,
          chol: row.chol,
          fbs: row.fbs,
          restecg: row.restecg,
          thalach: row.thalach,
          exang: row.exang,
          oldpeak: row.oldpeak,
          slope: row.slope,
          ca: row.ca,
          thal: row.thal,
        });
        setLoadedSample({ name: 'Sample B (High risk)', id: 175, actualDiagnosis: 1 });
      }
    } else if (sampleType === 'C') {
      // Test ID 287: Borderline / near 0.5 (48.9%), actual diagnosis 0
      const row = dataset.find((d) => d.id === 287);
      if (row) {
        setPatient({
          age: row.age,
          sex: row.sex,
          cp: row.cp,
          trestbps: row.trestbps,
          chol: row.chol,
          fbs: row.fbs,
          restecg: row.restecg,
          thalach: row.thalach,
          exang: row.exang,
          oldpeak: row.oldpeak,
          slope: row.slope,
          ca: row.ca,
          thal: row.thal,
        });
        setLoadedSample({ name: 'Sample C (Borderline)', id: 287, actualDiagnosis: 0 });
      }
    }
  };

  const handleReset = () => {
    setPatient(DEFAULT_PATIENT);
    setLoadedSample(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Determine risk category relative to decision threshold
  const prob = prediction.probability;
  const isHighRisk = prob >= decisionThreshold;
  const isBorderline = Math.abs(prob - decisionThreshold) <= 0.10;

  let riskCategoryText = 'Lower risk';
  let riskBadgeClass = 'chip-low';
  let actionText = 'Lower risk: routine follow-up recommended based on this model profile.';

  if (isBorderline) {
    riskCategoryText = 'Borderline risk';
    riskBadgeClass = 'chip-warning';
    actionText = 'Borderline zone: close clinical scrutiny and secondary test verification advised.';
  } else if (isHighRisk) {
    riskCategoryText = 'Higher risk';
    riskBadgeClass = 'chip-high';
    actionText = 'Higher risk: would be referred for detailed clinical diagnostic tests.';
  }

  // Distribution reference values for tiny strip plots
  const stripPlotsData = useMemo(() => {
    const disease0 = dataset.filter((d) => d.diagnosis === 0);
    const disease1 = dataset.filter((d) => d.diagnosis === 1);

    const calcMean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      age: {
        min: 29,
        max: 77,
        mean0: calcMean(disease0.map((d) => d.age)),
        mean1: calcMean(disease1.map((d) => d.age)),
        current: patient.age,
      },
      thalach: {
        min: 71,
        max: 202,
        mean0: calcMean(disease0.map((d) => d.thalach)),
        mean1: calcMean(disease1.map((d) => d.thalach)),
        current: patient.thalach,
      },
      chol: {
        min: 126,
        max: 564,
        mean0: calcMean(disease0.map((d) => d.chol)),
        mean1: calcMean(disease1.map((d) => d.chol)),
        current: patient.chol,
      },
    };
  }, [dataset, patient.age, patient.thalach, patient.chol]);

  return (
    <section id="assess" className="section-spacing hairline-b" style={{ backgroundColor: 'var(--bone)' }}>
      <div className="container print-page">
        {/* Section Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="eyebrow eyebrow-brass">Section 01 · Working Assessment Tool</span>
          <h2 style={{ marginBottom: '0.75rem' }}>Risk-Assessment Inference Engine</h2>
          <p className="lead-text">
            Enter the 13 clinical measurements to evaluate risk against the scikit-learn model. Results update live without network round-trips.
          </p>

          {/* Sample Patients Bar */}
          <div
            className="no-print"
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.65rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Load held-out test records:
            </span>
            <button type="button" className="btn btn-outline btn-small" onClick={() => loadSample('A')}>
              Sample A (Low risk · ID 244)
            </button>
            <button type="button" className="btn btn-outline btn-small" onClick={() => loadSample('B')}>
              Sample B (High risk · ID 175)
            </button>
            <button type="button" className="btn btn-outline btn-small" onClick={() => loadSample('C')}>
              Sample C (Borderline · ID 287)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={handleReset}
              style={{ marginLeft: 'auto', color: 'var(--mute)' }}
            >
              Reset inputs
            </button>
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={handlePrint}
              style={{ color: 'var(--pine)', borderColor: 'var(--pine)' }}
            >
              Print / save summary
            </button>
          </div>

          {/* Sample Patient Agreement Banner */}
          {loadedSample && (
            <div
              className="no-print hairline-box"
              style={{
                marginTop: '0.65rem',
                padding: '0.6rem 1rem',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'var(--paper)',
                borderLeft: `3px solid ${loadedSample.actualDiagnosis === 1 ? 'var(--crimson)' : 'var(--sage)'}`,
              }}
            >
              <span style={{ fontWeight: 600 }}>{loadedSample.name}:</span>
              <span>
                Dataset record says:{' '}
                <strong>
                  {loadedSample.actualDiagnosis === 1 ? 'Disease Present (diagnosis=1)' : 'Disease Absent (diagnosis=0)'}
                </strong>{' '}
                · <em>Held-out test record #{loadedSample.id}</em>
              </span>
            </div>
          )}
        </div>

        {/* Two-Column Clinical Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(1.5rem, 3.5vw, 2.75rem)',
            alignItems: 'start',
          }}
        >
          {/* LEFT COLUMN: THE INPUT FORM (~58% on desktop) */}
          <div style={{ gridColumn: 'span 12' }} className="assess-left">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="hairline-box"
              style={{
                padding: 'clamp(1.25rem, 3vw, 2.25rem)',
                backgroundColor: 'var(--paper)',
              }}
              aria-label="Clinical patient measurements form"
            >
              {/* FIELDSET 1: PATIENT DEMOGRAPHICS */}
              <fieldset style={{ border: 'none', marginBottom: '2rem' }}>
                <legend
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    color: 'var(--ink)',
                    marginBottom: '1rem',
                    paddingBottom: '0.4rem',
                    borderBottom: '1px solid var(--line)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>1. Patient</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--mute)' }}>Demographics</span>
                </legend>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  {/* Age */}
                  <div>
                    <label htmlFor={ageId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Patient age <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(age)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                      <input
                        id={ageId}
                        type="number"
                        min="29"
                        max="77"
                        value={patient.age}
                        onChange={(e) => setPatient({ ...patient, age: Number(e.target.value) })}
                        style={{
                          width: '72px',
                          padding: '0.4rem 0.5rem',
                          border: '1px solid var(--line)',
                          borderRadius: 'var(--radius-xs)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.9rem',
                        }}
                      />
                      <input
                        type="range"
                        min="29"
                        max="77"
                        value={patient.age}
                        onChange={(e) => setPatient({ ...patient, age: Number(e.target.value) })}
                        style={{ flex: 1, accentColor: 'var(--pine)' }}
                        aria-label="Age slider"
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Range: 29–77 years
                    </span>
                  </div>

                  {/* Sex */}
                  <div>
                    <label htmlFor={sexId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Biological sex <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(sex)</span>
                    </label>
                    <div
                      id={sexId}
                      role="radiogroup"
                      aria-label="Biological sex"
                      style={{
                        display: 'flex',
                        gap: '0.25rem',
                        marginTop: '0.35rem',
                        backgroundColor: 'var(--bone)',
                        padding: '3px',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={patient.sex === 1}
                        onClick={() => setPatient({ ...patient, sex: 1 })}
                        style={{
                          flex: 1,
                          padding: '0.45rem 0.5rem',
                          border: 'none',
                          borderRadius: 'var(--radius-xs)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor: patient.sex === 1 ? 'var(--paper)' : 'transparent',
                          color: patient.sex === 1 ? 'var(--ink)' : 'var(--mute)',
                          boxShadow: patient.sex === 1 ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                        }}
                      >
                        Male (1)
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={patient.sex === 0}
                        onClick={() => setPatient({ ...patient, sex: 0 })}
                        style={{
                          flex: 1,
                          padding: '0.45rem 0.5rem',
                          border: 'none',
                          borderRadius: 'var(--radius-xs)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor: patient.sex === 0 ? 'var(--paper)' : 'transparent',
                          color: patient.sex === 0 ? 'var(--ink)' : 'var(--mute)',
                          boxShadow: patient.sex === 0 ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                        }}
                      >
                        Female (0)
                      </button>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Binary indicator in UCI cohort
                    </span>
                  </div>
                </div>
              </fieldset>

              {/* FIELDSET 2: SYMPTOMS & EXERCISE */}
              <fieldset style={{ border: 'none', marginBottom: '2rem' }}>
                <legend
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    color: 'var(--ink)',
                    marginBottom: '1rem',
                    paddingBottom: '0.4rem',
                    borderBottom: '1px solid var(--line)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>2. Symptoms & Exercise Stress</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--mute)' }}>Treadmill & Chest Pain</span>
                </legend>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  {/* Chest pain type */}
                  <div style={{ gridColumn: 'span 1' }}>
                    <label htmlFor={cpId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Chest pain type <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(cp)</span>
                    </label>
                    <select
                      id={cpId}
                      value={patient.cp}
                      onChange={(e) => setPatient({ ...patient, cp: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        marginTop: '0.35rem',
                        padding: '0.5rem',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--paper)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value={1}>1 — Typical angina</option>
                      <option value={2}>2 — Atypical angina</option>
                      <option value={3}>3 — Non-anginal pain</option>
                      <option value={4}>4 — No chest pain (asymptomatic)</option>
                    </select>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Manifestation of angina during evaluation
                    </span>
                  </div>

                  {/* Exercise-induced angina */}
                  <div>
                    <label htmlFor={exangId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Exercise-induced angina <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(exang)</span>
                    </label>
                    <select
                      id={exangId}
                      value={patient.exang}
                      onChange={(e) => setPatient({ ...patient, exang: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        marginTop: '0.35rem',
                        padding: '0.5rem',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--paper)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value={0}>No (0)</option>
                      <option value={1}>Yes (1)</option>
                    </select>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Angina brought on by physical stress
                    </span>
                  </div>

                  {/* thalach: max heart rate */}
                  <div>
                    <label htmlFor={thalachId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Maximum heart rate achieved <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(thalach)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                      <input
                        id={thalachId}
                        type="number"
                        min="71"
                        max="202"
                        value={patient.thalach}
                        onChange={(e) => setPatient({ ...patient, thalach: Number(e.target.value) })}
                        style={{
                          width: '72px',
                          padding: '0.4rem 0.5rem',
                          border: '1px solid var(--line)',
                          borderRadius: 'var(--radius-xs)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.9rem',
                        }}
                      />
                      <input
                        type="range"
                        min="71"
                        max="202"
                        value={patient.thalach}
                        onChange={(e) => setPatient({ ...patient, thalach: Number(e.target.value) })}
                        style={{ flex: 1, accentColor: 'var(--pine)' }}
                        aria-label="Max heart rate slider"
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Unit: bpm · Dataset range: 71–202 bpm
                    </span>
                  </div>

                  {/* oldpeak: ST depression */}
                  <div>
                    <label htmlFor={oldpeakId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      ST depression <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(oldpeak)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                      <input
                        id={oldpeakId}
                        type="number"
                        step="0.1"
                        min="0"
                        max="6.2"
                        value={patient.oldpeak}
                        onChange={(e) => setPatient({ ...patient, oldpeak: Number(e.target.value) })}
                        style={{
                          width: '72px',
                          padding: '0.4rem 0.5rem',
                          border: '1px solid var(--line)',
                          borderRadius: 'var(--radius-xs)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.9rem',
                        }}
                      />
                      <input
                        type="range"
                        step="0.1"
                        min="0"
                        max="6.2"
                        value={patient.oldpeak}
                        onChange={(e) => setPatient({ ...patient, oldpeak: Number(e.target.value) })}
                        style={{ flex: 1, accentColor: 'var(--pine)' }}
                        aria-label="ST depression slider"
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Range: 0–6.2 (exercise relative to rest)
                    </span>
                  </div>

                  {/* slope: peak exercise ST */}
                  <div>
                    <label htmlFor={slopeId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Slope of peak exercise ST <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(slope)</span>
                    </label>
                    <select
                      id={slopeId}
                      value={patient.slope}
                      onChange={(e) => setPatient({ ...patient, slope: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        marginTop: '0.35rem',
                        padding: '0.5rem',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--paper)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value={1}>1 — Upsloping</option>
                      <option value={2}>2 — Flat</option>
                      <option value={3}>3 — Downsloping</option>
                    </select>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Shape of ST segment at peak exertion
                    </span>
                  </div>
                </div>
              </fieldset>

              {/* FIELDSET 3: RESTING TESTS */}
              <fieldset style={{ border: 'none', marginBottom: '2rem' }}>
                <legend
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    color: 'var(--ink)',
                    marginBottom: '1rem',
                    paddingBottom: '0.4rem',
                    borderBottom: '1px solid var(--line)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>3. Resting Tests</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--mute)' }}>Pressure, Lipids & Tracing</span>
                </legend>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  {/* trestbps: resting blood pressure */}
                  <div>
                    <label htmlFor={trestbpsId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Resting blood pressure <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(trestbps)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                      <input
                        id={trestbpsId}
                        type="number"
                        min="94"
                        max="200"
                        value={patient.trestbps}
                        onChange={(e) => setPatient({ ...patient, trestbps: Number(e.target.value) })}
                        style={{
                          width: '72px',
                          padding: '0.4rem 0.5rem',
                          border: '1px solid var(--line)',
                          borderRadius: 'var(--radius-xs)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.9rem',
                        }}
                      />
                      <input
                        type="range"
                        min="94"
                        max="200"
                        value={patient.trestbps}
                        onChange={(e) => setPatient({ ...patient, trestbps: Number(e.target.value) })}
                        style={{ flex: 1, accentColor: 'var(--pine)' }}
                        aria-label="Resting BP slider"
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Unit: mm Hg · Dataset range: 94–200 mm Hg
                    </span>
                  </div>

                  {/* chol: serum cholesterol */}
                  <div>
                    <label htmlFor={cholId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Serum cholesterol <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(chol)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                      <input
                        id={cholId}
                        type="number"
                        min="126"
                        max="564"
                        value={patient.chol}
                        onChange={(e) => setPatient({ ...patient, chol: Number(e.target.value) })}
                        style={{
                          width: '72px',
                          padding: '0.4rem 0.5rem',
                          border: '1px solid var(--line)',
                          borderRadius: 'var(--radius-xs)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.9rem',
                        }}
                      />
                      <input
                        type="range"
                        min="126"
                        max="564"
                        value={patient.chol}
                        onChange={(e) => setPatient({ ...patient, chol: Number(e.target.value) })}
                        style={{ flex: 1, accentColor: 'var(--pine)' }}
                        aria-label="Cholesterol slider"
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Unit: mg/dl · Range: 126–564 mg/dl
                    </span>
                  </div>

                  {/* fbs: fasting blood sugar */}
                  <div>
                    <label htmlFor={fbsId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Fasting blood sugar &gt; 120 mg/dl <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(fbs)</span>
                    </label>
                    <select
                      id={fbsId}
                      value={patient.fbs}
                      onChange={(e) => setPatient({ ...patient, fbs: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        marginTop: '0.35rem',
                        padding: '0.5rem',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--paper)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value={0}>No (≤ 120 mg/dl, code 0)</option>
                      <option value={1}>Yes (&gt; 120 mg/dl, code 1)</option>
                    </select>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Indicator for impaired fasting glucose
                    </span>
                  </div>

                  {/* restecg: resting electrocardiographic */}
                  <div>
                    <label htmlFor={restecgId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Resting ECG <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(restecg)</span>
                    </label>
                    <select
                      id={restecgId}
                      value={patient.restecg}
                      onChange={(e) => setPatient({ ...patient, restecg: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        marginTop: '0.35rem',
                        padding: '0.5rem',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--paper)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value={0}>0 — Normal resting ECG</option>
                      <option value={1}>1 — ST-T wave abnormality</option>
                      <option value={2}>2 — Left ventricular hypertrophy</option>
                    </select>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Baseline ECG prior to exercise test
                    </span>
                  </div>
                </div>
              </fieldset>

              {/* FIELDSET 4: VESSELS & BLOOD DISORDER */}
              <fieldset style={{ border: 'none' }}>
                <legend
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    color: 'var(--ink)',
                    marginBottom: '1rem',
                    paddingBottom: '0.4rem',
                    borderBottom: '1px solid var(--line)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>4. Vessels & Myocardial Scintigraphy</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--mute)' }}>Fluoroscopy & Thallium</span>
                </legend>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  {/* ca: major vessels coloured */}
                  <div>
                    <label htmlFor={caId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Major vessels coloured <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(ca)</span>
                    </label>
                    <select
                      id={caId}
                      value={patient.ca === null ? 'not_sure' : patient.ca}
                      onChange={(e) =>
                        setPatient({
                          ...patient,
                          ca: e.target.value === 'not_sure' ? null : Number(e.target.value),
                        })
                      }
                      style={{
                        width: '100%',
                        marginTop: '0.35rem',
                        padding: '0.5rem',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--paper)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value={0}>0 — No vessels coloured</option>
                      <option value={1}>1 — One vessel coloured</option>
                      <option value={2}>2 — Two vessels coloured</option>
                      <option value={3}>3 — Three vessels coloured</option>
                      <option value="not_sure">Not sure (estimate from training mode)</option>
                    </select>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Fluoroscopy major vessels (0–3)
                    </span>
                  </div>

                  {/* thal: Thallium stress test result (Point 9) */}
                  <div>
                    <label htmlFor={thalId} style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                      Thallium stress test result <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(thal)</span>
                    </label>
                    <select
                      id={thalId}
                      value={patient.thal === null ? 'not_sure' : patient.thal}
                      onChange={(e) =>
                        setPatient({
                          ...patient,
                          thal: e.target.value === 'not_sure' ? null : Number(e.target.value),
                        })
                      }
                      style={{
                        width: '100%',
                        marginTop: '0.35rem',
                        padding: '0.5rem',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--paper)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value={3}>3 — Normal</option>
                      <option value={6}>6 — Fixed defect</option>
                      <option value={7}>7 — Reversible defect</option>
                      <option value="not_sure">Not sure (estimate from training mode)</option>
                    </select>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mute)', display: 'block', marginTop: '0.25rem' }}>
                      Nuclear scintigraphy defect classification
                    </span>
                  </div>
                </div>
              </fieldset>

              {/* Outside Training Range Calm Alert */}
              {prediction.isOutsideTrainingRange && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--brass-faint)',
                    border: '1px solid var(--brass)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.8rem',
                    color: '#654B1A',
                  }}
                  role="alert"
                >
                  <strong>Notice:</strong> One or more values fall outside the training ranges observed in the Cleveland dataset. The model has generated an extrapolation estimate with lower confidence.
                </div>
              )}
            </form>
          </div>

          {/* RIGHT COLUMN: STICKY RESULT PANEL (~42% on desktop) */}
          <div style={{ gridColumn: 'span 12' }} className="assess-right">
            <aside
              className="hairline-box sticky-result-panel"
              style={{
                position: 'sticky',
                top: 'calc(var(--header-height) + 1.5rem)',
                padding: 'clamp(1.25rem, 2.5vw, 2rem)',
                backgroundColor: 'var(--paper)',
                boxShadow: 'var(--shadow-result)',
              }}
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Top Result Banner */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="eyebrow" style={{ marginBottom: 0 }}>Model Risk Estimate</span>
                <span className={`chip ${riskBadgeClass}`}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'currentColor',
                    }}
                    aria-hidden="true"
                  />
                  {riskCategoryText}
                </span>
              </div>

              {/* Big Fraunces Percentage */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(3.5rem, 6vw, 4.75rem)',
                    fontWeight: 300,
                    lineHeight: 1,
                    color: isHighRisk ? 'var(--crimson)' : 'var(--pine)',
                  }}
                >
                  {Math.round(prob * 100)}%
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--mute)', marginBottom: '1.25rem' }}>
                estimated probability of heart disease in this model
              </div>

              {/* Horizontal Probability Gauge */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    position: 'relative',
                    height: '10px',
                    backgroundColor: 'var(--bone)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'visible',
                  }}
                >
                  {/* Lower risk zone (sage) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${Math.max(0, (decisionThreshold - 0.1) * 100)}%`,
                      backgroundColor: 'var(--sage-faint)',
                    }}
                  />
                  {/* Borderline zone (brass) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${Math.max(0, (decisionThreshold - 0.1) * 100)}%`,
                      top: 0,
                      bottom: 0,
                      width: '20%',
                      backgroundColor: 'var(--brass-faint)',
                    }}
                  />
                  {/* Higher risk zone (crimson) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${Math.min(100, (decisionThreshold + 0.1) * 100)}%`,
                      top: 0,
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'var(--crimson-faint)',
                    }}
                  />

                  {/* Marked Decision Threshold Tick */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${decisionThreshold * 100}%`,
                      top: '-4px',
                      bottom: '-4px',
                      width: '2px',
                      backgroundColor: 'var(--ink)',
                      zIndex: 3,
                    }}
                    title={`Decision threshold: ${decisionThreshold.toFixed(2)}`}
                  />

                  {/* Patient Position Marker */}
                  <div
                    role="img"
                    aria-label={`Patient risk position: ${Math.round(prob * 100)}%`}
                    style={{
                      position: 'absolute',
                      left: `clamp(4px, ${prob * 100}%, calc(100% - 4px))`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: isHighRisk ? 'var(--crimson)' : 'var(--pine)',
                      border: '2px solid var(--paper)',
                      boxShadow: '0 0 0 1px var(--ink)',
                      zIndex: 4,
                      transition: 'left 0.2s ease',
                    }}
                  />
                </div>

                {/* Gauge Labels */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.68rem',
                    color: 'var(--mute)',
                    marginTop: '0.4rem',
                  }}
                >
                  <span>0% (Lower)</span>
                  <span>Threshold {Math.round(decisionThreshold * 100)}%</span>
                  <span>100% (Higher)</span>
                </div>
              </div>

              {/* Action Line & Caveat */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bone)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.35rem' }}>
                  {actionText}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mute)', lineHeight: 1.5 }}>
                  {metrics.caveat_line}
                </div>
              </div>

              {/* Imputation note when "Not sure" used */}
              {prediction.imputedCount > 0 && (
                <div
                  style={{
                    marginBottom: '1.25rem',
                    fontSize: '0.75rem',
                    color: 'var(--brass)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span aria-hidden="true">ℹ</span>
                  <span>
                    {prediction.imputedCount} value{prediction.imputedCount === 1 ? '' : 's'} estimated from the training data modes ({prediction.imputedFields.join(', ')}).
                  </span>
                </div>
              )}

              {/* WHAT MOVED THIS RESULT: DIVERGING HORIZONTAL BARS */}
              <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
                <span className="eyebrow" style={{ marginBottom: '0.35rem' }}>
                  What moved this result
                </span>
                <p style={{ fontSize: '0.74rem', color: 'var(--mute)', marginBottom: '0.85rem' }}>
                  Top clinical factors contributing to log-odds of disease (aggregated from logistic regression weights × patient values):
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {prediction.topContributions.map((c) => {
                    // Maximum abs contribution in top 6 for relative scale
                    const maxContrib = Math.max(...prediction.topContributions.map((item) => item.absContribution), 0.8);
                    const barWidthPct = Math.min(100, Math.max(8, (c.absContribution / maxContrib) * 100));

                    return (
                      <div key={c.featureKey} style={{ fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.label}</span>
                          <span style={{ color: 'var(--mute)' }}>{c.patientValueDescription}</span>
                        </div>
                        {/* Diverging Bar Track */}
                        <div
                          style={{
                            height: '6px',
                            backgroundColor: 'var(--bone)',
                            borderRadius: '1px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: `${barWidthPct}%`,
                              height: '100%',
                              backgroundColor: c.direction === 'up' ? 'var(--crimson)' : 'var(--sage)',
                              transition: 'width 0.2s ease',
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '0.68rem', color: c.direction === 'up' ? 'var(--crimson-text)' : 'var(--sage-text)', fontWeight: 500, marginTop: '0.15rem' }}>
                          {c.direction === 'up' ? '↑ Pushes risk higher' : '↓ Protective (lowers risk)'} ({c.rawContribution > 0 ? '+' : ''}{c.rawContribution.toFixed(2)} log-odds)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WHERE THIS PATIENT SITS: TINY STRIP PLOTS */}
              <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
                <span className="eyebrow" style={{ marginBottom: '0.35rem' }}>
                  Where this patient sits
                </span>
                <p style={{ fontSize: '0.74rem', color: 'var(--mute)', marginBottom: '0.75rem' }}>
                  Relative to Cleveland cohort averages for disease (crimson) vs no-disease (sage):
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* 1. Age strip plot */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600 }}>Age ({patient.age} yrs)</span>
                      <span style={{ color: 'var(--mute)' }}>Cohort: 29–77</span>
                    </div>
                    <div style={{ position: 'relative', height: '8px', backgroundColor: 'var(--bone)', borderRadius: '2px', border: '1px solid var(--line)' }}>
                      {/* Disease Mean tick (crimson) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: `${((stripPlotsData.age.mean1 - 29) / (77 - 29)) * 100}%`,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          backgroundColor: 'var(--crimson)',
                        }}
                        title={`Disease group mean: ${stripPlotsData.age.mean1.toFixed(1)} yrs`}
                      />
                      {/* No-Disease Mean tick (sage) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: `${((stripPlotsData.age.mean0 - 29) / (77 - 29)) * 100}%`,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          backgroundColor: 'var(--sage)',
                        }}
                        title={`Healthy group mean: ${stripPlotsData.age.mean0.toFixed(1)} yrs`}
                      />
                      {/* Current Patient Marker */}
                      <div
                        style={{
                          position: 'absolute',
                          left: `${((patient.age - 29) / (77 - 29)) * 100}%`,
                          top: '-3px',
                          width: '6px',
                          height: '12px',
                          backgroundColor: 'var(--ink)',
                          borderRadius: '1px',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* 2. Max Heart Rate strip plot */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600 }}>Max Heart Rate ({patient.thalach} bpm)</span>
                      <span style={{ color: 'var(--mute)' }}>Cohort: 71–202</span>
                    </div>
                    <div style={{ position: 'relative', height: '8px', backgroundColor: 'var(--bone)', borderRadius: '2px', border: '1px solid var(--line)' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: `${((stripPlotsData.thalach.mean1 - 71) / (202 - 71)) * 100}%`,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          backgroundColor: 'var(--crimson)',
                        }}
                        title={`Disease group mean: ${stripPlotsData.thalach.mean1.toFixed(1)} bpm`}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: `${((stripPlotsData.thalach.mean0 - 71) / (202 - 71)) * 100}%`,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          backgroundColor: 'var(--sage)',
                        }}
                        title={`Healthy group mean: ${stripPlotsData.thalach.mean0.toFixed(1)} bpm`}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: `${((patient.thalach - 71) / (202 - 71)) * 100}%`,
                          top: '-3px',
                          width: '6px',
                          height: '12px',
                          backgroundColor: 'var(--ink)',
                          borderRadius: '1px',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* 3. Cholesterol strip plot */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600 }}>Cholesterol ({patient.chol} mg/dl)</span>
                      <span style={{ color: 'var(--mute)' }}>Cohort: 126–564</span>
                    </div>
                    <div style={{ position: 'relative', height: '8px', backgroundColor: 'var(--bone)', borderRadius: '2px', border: '1px solid var(--line)' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: `${((stripPlotsData.chol.mean1 - 126) / (564 - 126)) * 100}%`,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          backgroundColor: 'var(--crimson)',
                        }}
                        title={`Disease group mean: ${stripPlotsData.chol.mean1.toFixed(1)} mg/dl`}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: `${((stripPlotsData.chol.mean0 - 126) / (564 - 126)) * 100}%`,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          backgroundColor: 'var(--sage)',
                        }}
                        title={`Healthy group mean: ${stripPlotsData.chol.mean0.toFixed(1)} mg/dl`}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: `${((patient.chol - 126) / (564 - 126)) * 100}%`,
                          top: '-3px',
                          width: '6px',
                          height: '12px',
                          backgroundColor: 'var(--ink)',
                          borderRadius: '1px',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ADVANCED DECISION-THRESHOLD SLIDER (COLLAPSED ACCORDION) */}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--line)' }}>
                <button
                  type="button"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  aria-expanded={advancedOpen}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                  }}
                >
                  <span>Advanced: Calibrate decision threshold</span>
                  <span style={{ color: 'var(--brass)', transform: advancedOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}>
                    ▼
                  </span>
                </button>

                {advancedOpen && (
                  <div style={{ marginTop: '0.85rem', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <label htmlFor={thresholdId} style={{ color: 'var(--mute)' }}>Threshold: {(decisionThreshold * 100).toFixed(0)}%</label>
                      <span className="tabular-nums" style={{ fontWeight: 600 }}>{decisionThreshold.toFixed(2)}</span>
                    </div>
                    <input
                      id={thresholdId}
                      type="range"
                      min="0.10"
                      max="0.90"
                      step="0.05"
                      value={decisionThreshold}
                      onChange={(e) => setDecisionThreshold(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--pine)', marginBottom: '0.75rem' }}
                      aria-label="Decision threshold calibration slider"
                    />

                    <div
                      style={{
                        padding: '0.65rem',
                        backgroundColor: 'var(--bone)',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-xs)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.5rem',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--mute)' }}>Sensitivity</div>
                        <div className="tabular-nums" style={{ fontWeight: 600, color: 'var(--ink)' }}>
                          {(testSetStatsAtThreshold.sensitivity * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--mute)' }}>Specificity</div>
                        <div className="tabular-nums" style={{ fontWeight: 600, color: 'var(--ink)' }}>
                          {(testSetStatsAtThreshold.specificity * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--mute)' }}>Missed (FN)</div>
                        <div className="tabular-nums" style={{ fontWeight: 600, color: 'var(--crimson)' }}>
                          {testSetStatsAtThreshold.missedCount} of 42
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* MOBILE COLLAPSED BOTTOM BAR (Appears on screens < 860px) */}
        <div className="mobile-bottom-bar no-print">
          <div
            onClick={() => setMobileExpanded(!mobileExpanded)}
            style={{
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  lineHeight: 1,
                  color: isHighRisk ? 'var(--crimson)' : 'var(--pine)',
                }}
              >
                {Math.round(prob * 100)}%
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{riskCategoryText}</span>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-small"
              style={{ fontSize: '0.72rem' }}
            >
              {mobileExpanded ? 'Collapse' : 'View result details'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .assess-left {
            grid-column: span 7 !important;
          }
          .assess-right {
            grid-column: span 5 !important;
          }
          .mobile-bottom-bar {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .mobile-bottom-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: var(--paper);
            border-top: 1px solid var(--line);
            box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
            z-index: 90;
          }
        }
      `}</style>
    </section>
  );
};
