import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { predictPatient, ModelSpec, PatientInput } from './predict';

interface ParityRow {
  id: number;
  split: string;
  raw_features: Record<string, number>;
  expected_logit: number;
  expected_prob: number;
  true_diagnosis: number;
}

describe('JSON Integrity and Validation', () => {
  const publicDir = path.resolve(__dirname, '../../public');
  const files: string[] = fs.readdirSync(publicDir).filter((f: string) => f.endsWith('.json'));

  it('verifies public directory has the required JSON files', () => {
    expect(files).toContain('model.json');
    expect(files).toContain('metrics.json');
    expect(files).toContain('dataset.json');
    expect(files).toContain('headlines.json');
  });

  files.forEach((file: string) => {
    it(`JSON.parse succeeds on public/${file} without Infinity, NaN or formatting errors`, () => {
      const filePath = path.join(publicDir, file);
      const rawText = fs.readFileSync(filePath, 'utf8');

      // Check raw string does not contain unquoted Infinity or NaN
      expect(rawText).not.toMatch(/:\s*Infinity\b/);
      expect(rawText).not.toMatch(/:\s*-Infinity\b/);
      expect(rawText).not.toMatch(/:\s*NaN\b/);

      // JSON.parse must succeed
      let parsed: unknown;
      expect(() => {
        parsed = JSON.parse(rawText);
      }).not.toThrow();
      expect(parsed).toBeDefined();
    });
  });

  it('verifies dataset.json has exactly 303 rows with valid id and split', () => {
    const data = JSON.parse(fs.readFileSync(path.join(publicDir, 'dataset.json'), 'utf8'));
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(303);

    const trainRows = data.filter((d: { split: string }) => d.split === 'train');
    const testRows = data.filter((d: { split: string }) => d.split === 'test');

    expect(trainRows.length).toBe(212);
    expect(testRows.length).toBe(91);

    // Verify all rows have id
    data.forEach((d: { id: number; split: string }, idx: number) => {
      expect(d.id).toBe(idx);
      expect(['train', 'test']).toContain(d.split);
    });
  });

  it('verifies metrics.json contains exact Orange deck figures and valid caveat line', () => {
    const metrics = JSON.parse(fs.readFileSync(path.join(publicDir, 'metrics.json'), 'utf8'));

    // Caveat line check
    expect(metrics.caveat_line).toBe('In testing, this model missed 7 of 42 patients who had disease (about 1 in 6).');

    // Orange models check
    const orange = metrics.orange_models;
    expect(orange['Logistic Regression']).toEqual({
      ca: 0.833,
      auc: 0.883,
      f1: 0.805,
      precision: 0.861,
      recall: 0.756
    });
    expect(orange['Naive Bayes']).toEqual({
      ca: 0.822,
      auc: 0.881,
      f1: 0.800,
      precision: 0.821,
      recall: 0.780
    });
    expect(orange['kNN (scaled)']).toEqual({
      ca: 0.822,
      auc: 0.834,
      f1: 0.795,
      precision: 0.838,
      recall: 0.756
    });
    expect(orange['Random Forest']).toEqual({
      ca: 0.778,
      auc: 0.867,
      f1: 0.744,
      precision: 0.784,
      recall: 0.707
    });
    expect(orange['Decision Tree']).toEqual({
      ca: 0.778,
      auc: 0.803,
      f1: 0.744,
      precision: 0.784,
      recall: 0.707
    });
    expect(orange['Hand-written Rule']).toEqual({
      ca: 0.789,
      auc: null,
      f1: 0.776,
      precision: 0.750,
      recall: 0.805
    });

    // Orange Confusion Matrix check
    expect(metrics.orange_lr_confusion_matrix).toEqual({
      tp: 31,
      fn: 10,
      fp: 5,
      tn: 44,
      total: 90
    });

    // Fairness Wilson CIs
    expect(metrics.fairness.women.sensitivity_ci_95).toBeDefined();
    expect(metrics.fairness.men.sensitivity_ci_95).toBeDefined();
    expect(metrics.fairness.women.small_sample_warning).toBe(true);
  });
});

describe('Logistic Regression TypeScript Parity Test', () => {
  const modelPath = path.resolve(__dirname, '../../public/model.json');
  const parityPath = path.resolve(__dirname, '../../ml/parity.json');

  const model: ModelSpec = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const parityRows: ParityRow[] = JSON.parse(fs.readFileSync(parityPath, 'utf8'));

  it(`matches scikit-learn predict_proba to within 1e-6 across all ${parityRows.length} test rows`, () => {
    expect(parityRows.length).toBeGreaterThanOrEqual(20);

    let maxDiffProb = 0;
    let maxDiffLogit = 0;

    for (let i = 0; i < parityRows.length; i++) {
      const row = parityRows[i];
      const patientInput: PatientInput = {
        age: row.raw_features.age,
        sex: row.raw_features.sex,
        cp: row.raw_features.cp,
        trestbps: row.raw_features.trestbps,
        chol: row.raw_features.chol,
        fbs: row.raw_features.fbs,
        restecg: row.raw_features.restecg,
        thalach: row.raw_features.thalach,
        exang: row.raw_features.exang,
        oldpeak: row.raw_features.oldpeak,
        slope: row.raw_features.slope,
        ca: row.raw_features.ca,
        thal: row.raw_features.thal,
      };

      const result = predictPatient(patientInput, model);

      const diffLogit = Math.abs(result.logit - row.expected_logit);
      const diffProb = Math.abs(result.probability - row.expected_prob);

      if (diffLogit > maxDiffLogit) maxDiffLogit = diffLogit;
      if (diffProb > maxDiffProb) maxDiffProb = diffProb;

      // Parity check: within 1e-6
      expect(
        diffProb,
        `Row ${i} probability difference ${diffProb} exceeded 1e-6. TS: ${result.probability}, SK: ${row.expected_prob}`
      ).toBeLessThan(1e-6);

      expect(
        diffLogit,
        `Row ${i} logit difference ${diffLogit} exceeded 1e-5. TS: ${result.logit}, SK: ${row.expected_logit}`
      ).toBeLessThan(1e-5);
    }

    console.log(
      `Parity verified for ${parityRows.length} rows. Max prob delta: ${maxDiffProb.toExponential(4)}, Max logit delta: ${maxDiffLogit.toExponential(4)}`
    );
  });

  it('aggregates contributions to exactly 13 original clinical features (not 28 dummy columns)', () => {
    const patient: PatientInput = {
      age: 55,
      sex: 1,
      cp: 2,
      trestbps: 130,
      chol: 240,
      fbs: 0,
      restecg: 0,
      thalach: 150,
      exang: 0,
      oldpeak: 1.0,
      slope: 1,
      ca: 0,
      thal: 3,
    };

    const res = predictPatient(patient, model);
    expect(res.all13Contributions.length).toBe(13);
    expect(res.topContributions.length).toBe(6);

    const featureKeys = res.all13Contributions.map(c => c.featureKey);
    const expected13 = [
      'age', 'trestbps', 'chol', 'thalach', 'oldpeak',
      'sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'ca', 'thal'
    ];
    expect(featureKeys.sort()).toEqual(expected13.sort());
  });

  it('correctly handles "Not sure" imputation for ca and thal and labels thal properly', () => {
    const patientWithMissing: PatientInput = {
      age: 55,
      sex: 1,
      cp: 2,
      trestbps: 130,
      chol: 240,
      fbs: 0,
      restecg: 0,
      thalach: 150,
      exang: 0,
      oldpeak: 1.0,
      slope: 1,
      ca: null,
      thal: null,
    };

    const res = predictPatient(patientWithMissing, model);
    expect(res.imputedCount).toBe(2);
    expect(res.imputedFields).toContain('ca (major vessels)');
    expect(res.imputedFields).toContain('thal (thallium stress test result)');
    expect(res.probability).toBeGreaterThan(0);
    expect(res.probability).toBeLessThan(1);

    const thalContrib = res.all13Contributions.find(c => c.featureKey === 'thal');
    expect(thalContrib?.label).toBe('Thallium stress test result');
  });
});
