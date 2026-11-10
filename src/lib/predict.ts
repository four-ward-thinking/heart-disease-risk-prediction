/**
 * predict.ts
 * Exact TypeScript logistic regression inference engine matching scikit-learn.
 *
 * Implements: Standardize -> One-hot encode -> Dot product + intercept -> Sigmoid
 * Aggregates one-hot categories back to the 13 original clinical features for explanations.
 */

export interface ModelSpec {
  model_type: string;
  random_state: number;
  solver: string;
  intercept: number;
  num_cols: string[];
  cat_cols: string[];
  cat_domains: Record<string, number[]>;
  feature_labels: Record<string, string>;
  encoded_feature_names: string[];
  coefficients: Record<string, number>;
  impute_modes: Record<string, number>;
  num_means: Record<string, number>;
  num_stds: Record<string, number>;
  feature_ranges: Record<string, { min: number; max: number; mean: number; std: number }>;
  feature_importance_13: Array<{
    feature: string;
    label: string;
    type: 'numeric' | 'categorical';
    weight: number;
    importance: number;
    interpretation: string;
    category_coefficients?: Record<string, number>;
  }>;
}

export interface PatientInput {
  age: number;
  sex: number; // 0 = female, 1 = male
  cp: number; // 1, 2, 3, 4
  trestbps: number; // 94 - 200
  chol: number; // 126 - 564
  fbs: number; // 0 or 1
  restecg: number; // 0, 1, 2
  thalach: number; // 71 - 202
  exang: number; // 0 or 1
  oldpeak: number; // 0.0 - 6.2
  slope: number; // 1, 2, 3
  ca: number | null; // 0, 1, 2, 3 or null ("Not sure")
  thal: number | null; // 3, 6, 7 or null ("Not sure")
}

export interface FeatureContribution {
  featureKey: string;
  label: string;
  clinicalDetail: string;
  patientValueDescription: string;
  rawContribution: number;
  direction: 'up' | 'down';
  absContribution: number;
}

export interface PredictionResult {
  probability: number;
  logit: number;
  imputedCount: number;
  imputedFields: string[];
  isOutsideTrainingRange: boolean;
  outsideRangeWarnings: string[];
  topContributions: FeatureContribution[]; // Top 6 of 13 original features
  all13Contributions: FeatureContribution[]; // All 13 original clinical features
}

export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export function predictPatient(
  patient: PatientInput,
  model: ModelSpec
): PredictionResult {
  let imputedCount = 0;
  const imputedFields: string[] = [];

  // Handle ca imputation (mode: 0)
  let caVal: number;
  if (patient.ca === null || patient.ca === undefined || isNaN(patient.ca)) {
    caVal = model.impute_modes['ca'] ?? 0;
    imputedCount++;
    imputedFields.push('ca (major vessels)');
  } else {
    caVal = patient.ca;
  }

  // Handle thal imputation (mode: 3)
  let thalVal: number;
  if (patient.thal === null || patient.thal === undefined || isNaN(patient.thal)) {
    thalVal = model.impute_modes['thal'] ?? 3;
    imputedCount++;
    imputedFields.push('thal (thallium stress test result)');
  } else {
    thalVal = patient.thal;
  }

  // Check out of range warnings
  const outsideRangeWarnings: string[] = [];
  const rangeChecks: Array<{ key: keyof PatientInput; label: string }> = [
    { key: 'age', label: 'Age' },
    { key: 'trestbps', label: 'Resting Blood Pressure' },
    { key: 'chol', label: 'Serum Cholesterol' },
    { key: 'thalach', label: 'Maximum Heart Rate' },
    { key: 'oldpeak', label: 'ST Depression (oldpeak)' },
  ];

  for (const check of rangeChecks) {
    const val = patient[check.key] as number;
    const r = model.feature_ranges[check.key];
    if (r && (val < r.min || val > r.max)) {
      outsideRangeWarnings.push(
        `${check.label} (${val}) is outside the training range (${r.min}–${r.max})`
      );
    }
  }

  const isOutsideTrainingRange = outsideRangeWarnings.length > 0;

  // Track the 13 clinical contributions (aggregating one-hot categories to selected level)
  const contributions: FeatureContribution[] = [];

  // Start with intercept
  let logit = model.intercept;

  // 1. Age (numeric)
  const ageZ = (patient.age - model.num_means['age']) / model.num_stds['age'];
  const ageContrib = (model.coefficients['age'] ?? 0) * ageZ;
  logit += ageContrib;
  contributions.push({
    featureKey: 'age',
    label: 'Age',
    clinicalDetail: 'Patient chronological age',
    patientValueDescription: `${patient.age} yrs`,
    rawContribution: ageContrib,
    direction: ageContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(ageContrib),
  });

  // 2. Resting BP (numeric)
  const bpZ = (patient.trestbps - model.num_means['trestbps']) / model.num_stds['trestbps'];
  const bpContrib = (model.coefficients['trestbps'] ?? 0) * bpZ;
  logit += bpContrib;
  contributions.push({
    featureKey: 'trestbps',
    label: 'Resting Blood Pressure',
    clinicalDetail: 'In hospital admission',
    patientValueDescription: `${patient.trestbps} mm Hg`,
    rawContribution: bpContrib,
    direction: bpContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(bpContrib),
  });

  // 3. Cholesterol (numeric)
  const cholZ = (patient.chol - model.num_means['chol']) / model.num_stds['chol'];
  const cholContrib = (model.coefficients['chol'] ?? 0) * cholZ;
  logit += cholContrib;
  contributions.push({
    featureKey: 'chol',
    label: 'Serum Cholesterol',
    clinicalDetail: 'Total serum cholesterol',
    patientValueDescription: `${patient.chol} mg/dl`,
    rawContribution: cholContrib,
    direction: cholContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(cholContrib),
  });

  // 4. Max Heart Rate (numeric)
  const thalachZ = (patient.thalach - model.num_means['thalach']) / model.num_stds['thalach'];
  const thalachContrib = (model.coefficients['thalach'] ?? 0) * thalachZ;
  logit += thalachContrib;
  contributions.push({
    featureKey: 'thalach',
    label: 'Maximum Heart Rate Achieved',
    clinicalDetail: 'Higher HR during stress test is protective',
    patientValueDescription: `${patient.thalach} bpm`,
    rawContribution: thalachContrib,
    direction: thalachContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(thalachContrib),
  });

  // 5. ST depression oldpeak (numeric)
  const oldpeakZ = (patient.oldpeak - model.num_means['oldpeak']) / model.num_stds['oldpeak'];
  const oldpeakContrib = (model.coefficients['oldpeak'] ?? 0) * oldpeakZ;
  logit += oldpeakContrib;
  contributions.push({
    featureKey: 'oldpeak',
    label: 'ST Depression (oldpeak)',
    clinicalDetail: 'Exercise-induced relative to rest',
    patientValueDescription: `${patient.oldpeak}`,
    rawContribution: oldpeakContrib,
    direction: oldpeakContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(oldpeakContrib),
  });

  // 6. Sex (categorical: 0 = female, 1 = male)
  const sexKey = `sex_${patient.sex}`;
  const sexContrib = model.coefficients[sexKey] ?? 0;
  logit += sexContrib;
  contributions.push({
    featureKey: 'sex',
    label: 'Sex',
    clinicalDetail: patient.sex === 1 ? 'Male patient profile' : 'Female patient profile',
    patientValueDescription: patient.sex === 1 ? 'Male' : 'Female',
    rawContribution: sexContrib,
    direction: sexContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(sexContrib),
  });

  // 7. Chest pain type (categorical: 1, 2, 3, 4)
  const cpKey = `cp_${patient.cp}`;
  const cpContrib = model.coefficients[cpKey] ?? 0;
  logit += cpContrib;
  const cpDescriptions: Record<number, string> = {
    1: 'Typical angina',
    2: 'Atypical angina',
    3: 'Non-anginal pain',
    4: 'Asymptomatic (no chest pain)',
  };
  contributions.push({
    featureKey: 'cp',
    label: 'Chest Pain Type',
    clinicalDetail: 'Reported pain manifestation',
    patientValueDescription: cpDescriptions[patient.cp] ?? `Type ${patient.cp}`,
    rawContribution: cpContrib,
    direction: cpContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(cpContrib),
  });

  // 8. Fasting blood sugar (categorical: 0, 1)
  const fbsKey = `fbs_${patient.fbs}`;
  const fbsContrib = model.coefficients[fbsKey] ?? 0;
  logit += fbsContrib;
  contributions.push({
    featureKey: 'fbs',
    label: 'Fasting Blood Sugar',
    clinicalDetail: 'Threshold 120 mg/dl',
    patientValueDescription: patient.fbs === 1 ? '> 120 mg/dl' : '≤ 120 mg/dl',
    rawContribution: fbsContrib,
    direction: fbsContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(fbsContrib),
  });

  // 9. Resting ECG (categorical: 0, 1, 2)
  const restecgKey = `restecg_${patient.restecg}`;
  const restecgContrib = model.coefficients[restecgKey] ?? 0;
  logit += restecgContrib;
  const restecgDescriptions: Record<number, string> = {
    0: 'Normal resting trace',
    1: 'ST-T wave abnormality',
    2: 'Left ventricular hypertrophy',
  };
  contributions.push({
    featureKey: 'restecg',
    label: 'Resting ECG',
    clinicalDetail: 'Baseline electrical tracing',
    patientValueDescription: restecgDescriptions[patient.restecg] ?? `Code ${patient.restecg}`,
    rawContribution: restecgContrib,
    direction: restecgContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(restecgContrib),
  });

  // 10. Exercise-induced angina (categorical: 0, 1)
  const exangKey = `exang_${patient.exang}`;
  const exangContrib = model.coefficients[exangKey] ?? 0;
  logit += exangContrib;
  contributions.push({
    featureKey: 'exang',
    label: 'Exercise-Induced Angina',
    clinicalDetail: 'Chest pain brought on by exercise',
    patientValueDescription: patient.exang === 1 ? 'Yes' : 'No',
    rawContribution: exangContrib,
    direction: exangContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(exangContrib),
  });

  // 11. Slope of peak ST segment (categorical: 1, 2, 3)
  const slopeKey = `slope_${patient.slope}`;
  const slopeContrib = model.coefficients[slopeKey] ?? 0;
  logit += slopeContrib;
  const slopeDescriptions: Record<number, string> = {
    1: 'Upsloping ST segment',
    2: 'Flat ST segment',
    3: 'Downsloping ST segment',
  };
  contributions.push({
    featureKey: 'slope',
    label: 'Peak Exercise ST Slope',
    clinicalDetail: 'Electrocardiographic curve shape',
    patientValueDescription: slopeDescriptions[patient.slope] ?? `Code ${patient.slope}`,
    rawContribution: slopeContrib,
    direction: slopeContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(slopeContrib),
  });

  // 12. Major vessels coloured (ca: 0, 1, 2, 3)
  const caKey = `ca_${caVal}`;
  const caContrib = model.coefficients[caKey] ?? 0;
  logit += caContrib;
  contributions.push({
    featureKey: 'ca',
    label: 'Major Vessels (Fluoroscopy)',
    clinicalDetail: 'Vessels with visible blockage',
    patientValueDescription:
      patient.ca === null
        ? `${caVal} vessels (estimated from training mode)`
        : `${caVal} vessel${caVal === 1 ? '' : 's'} coloured`,
    rawContribution: caContrib,
    direction: caContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(caContrib),
  });

  // 13. Thallium stress test result (thal: 3, 6, 7) - Point 9
  const thalKey = `thal_${thalVal}`;
  const thalContrib = model.coefficients[thalKey] ?? 0;
  logit += thalContrib;
  const thalDescriptions: Record<number, string> = {
    3: 'Normal',
    6: 'Fixed defect',
    7: 'Reversible defect',
  };
  contributions.push({
    featureKey: 'thal',
    label: 'Thallium stress test result',
    clinicalDetail: 'Myocardial perfusion scintigraphy',
    patientValueDescription:
      patient.thal === null
        ? `${thalDescriptions[thalVal] ?? thalVal} (estimated from training mode)`
        : thalDescriptions[thalVal] ?? `Code ${thalVal}`,
    rawContribution: thalContrib,
    direction: thalContrib >= 0 ? 'up' : 'down',
    absContribution: Math.abs(thalContrib),
  });

  // Exactly 13 original clinical features
  if (contributions.length !== 13) {
    console.warn(`Expected 13 feature contributions, got ${contributions.length}`);
  }

  // Sort contributions by magnitude descending
  const sortedContributions = [...contributions].sort(
    (a, b) => b.absContribution - a.absContribution
  );
  const topContributions = sortedContributions.slice(0, 6);

  const probability = sigmoid(logit);

  return {
    probability,
    logit,
    imputedCount,
    imputedFields,
    isOutsideTrainingRange,
    outsideRangeWarnings,
    topContributions,
    all13Contributions: sortedContributions,
  };
}
