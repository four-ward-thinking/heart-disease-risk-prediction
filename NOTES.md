# NOTES.md — Clinical & Machine Learning Metric Traceability Ledger

**Project:** Heart Disease Risk Prediction  
**Team 2, Four-Ward Thinking** · *B.Tech BT-A · SRM Institute of Science and Technology, Ramapuram*

This ledger documents every metric, proportion, statistical test, confidence interval, and data constant rendered across the web application, mapping each directly to the script, source file, line number, and exported JSON token that produces it. Zero metrics are hard-coded in the UI.

---

## 1. Dataset Scale & Hygiene Figures

| Metric on Site | Value | Generating Source Script | Line No. | Exported JSON Path | Rendered In Component |
| :--- | :---: | :--- | :---: | :--- | :--- |
| Cohort Size | `303` | `ml/train.py` | 46 | `dataset.json` (array length) | `HeroSection.tsx`, `DataSection.tsx` |
| Clinical Predictors | `13` | `ml/train.py` | 59 | `model.json:num_cols` + `cat_cols` | `HeroSection.tsx`, `AssessSection.tsx` |
| Healthy Patients ($y=0$) | `164` (54.13%) | `ml/train.py` | 51 | `metrics.json:insights.class_balance.no_disease` | `HeroSection.tsx`, `DataSection.tsx` |
| Diseased Patients ($y=1$) | `139` (45.87%) | `ml/train.py` | 51 | `metrics.json:insights.class_balance.disease` | `HeroSection.tsx`, `DataSection.tsx` |
| Missing Cells | `6` (0.14%) | `ml/train.py` | 55–58 | `metrics.json:insights.missingness` | `HowBuiltSection.tsx`, `PineBandSection.tsx` |
| Missing `ca` Values | `4` (mode = 0) | `ml/train.py` | 56, 95 | `model.json:impute_modes.ca` | `AssessSection.tsx`, `DataSection.tsx` |
| Missing `thal` Values | `2` (mode = 3) | `ml/train.py` | 57, 95 | `model.json:impute_modes.thal` | `AssessSection.tsx`, `DataSection.tsx` |
| Duplicate Rows | `0` (100% unique)| `ml/train.py` | 53 | Cleaned DataFrame check | `HowBuiltSection.tsx` |
| Chol Maximum Outlier | `564 mg/dl` | `ml/train.py` | 67 | `metrics.json:insights.cholesterol_outlier.max` | `DataSection.tsx`, `PineBandSection.tsx` |
| Train / Test Split | `212` / `91` | `ml/train.py` | 86 | `dataset.json:split` ('train' vs 'test') | `HowBuiltSection.tsx`, `ModelSection.tsx` |

---

## 2. Live Model Benchmark Table (scikit-learn, Test $N=91$)

Computed by `ml/train.py` (lines 165–205) and dynamically loaded via `metrics.json:live_models`:

| Model | Test AUC | Test CA | Train CA | F1 Score | Precision | Recall (Sens.) | Rendered In Component |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Logistic Regression (Pick)** | `0.939` | `0.857` | `0.854` | `0.843` | `0.854` | `0.833` | `HeroSection.tsx`, `ModelSection.tsx` |
| **Random Forest** | `0.923` | `0.824` | `1.000` | `0.822` | `0.771` | `0.881` | `ModelSection.tsx` |
| **kNN (scaled)** | `0.907` | `0.824` | `0.887` | `0.800` | `0.842` | `0.762` | `ModelSection.tsx` |
| **Naive Bayes** | `0.846` | `0.692` | `0.774` | `0.731` | `0.613` | `0.905` | `ModelSection.tsx` |
| **Decision Tree** | `0.656` | `0.659` | `1.000` | `0.627` | `0.634` | `0.619` | `ModelSection.tsx` |

*Dumbbell Overfitting Gaps:*
- Decision Tree: $100.0\% - 65.9\% = 34.1\%$ gap (`ModelSection.tsx`)
- Random Forest: $100.0\% - 82.4\% = 17.6\%$ gap (`ModelSection.tsx`)

---

## 3. As Reported in Team 2's Orange Deck (Static Comparison)

Exported to `metrics.json:orange_models` (lines 320–335) from team presentation deck:

| Model | Orange CA | Orange AUC | Orange F1 | Orange Precision | Orange Recall |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Logistic Regression | `0.833` | `0.883` | `0.805` | `0.861` | `0.756` |
| Naive Bayes | `0.822` | `0.881` | `0.800` | `0.821` | `0.780` |
| kNN (scaled) | `0.822` | `0.834` | `0.795` | `0.838` | `0.756` |
| Random Forest | `0.778` | `0.867` | `0.744` | `0.784` | `0.707` |
| Decision Tree | `0.778` | `0.803` | `0.744` | `0.784` | `0.707` |
| Hand-written Rule | `0.789` | — | `0.776` | `0.750` | `0.805` |

- **Orange LR Confusion Matrix ($N=90$):** TP `31`, FN `10`, FP `5`, TN `44` (`ml/train.py:338`, `metrics.json:orange_lr_confusion_matrix`).
- **Split Note:** *"The deck used a 70/30 stratified Data Sampler split (213 train / 90 test) with Orange defaults. The numbers differ because of a different random split, encoding and regularisation defaults."* (`metrics.json:orange_split_note`).

---

## 4. Live Confusion Matrix & Safety Caveat (Threshold 0.50)

Computed by `ml/train.py` (lines 212–230) on held-out test set ($N=91$):

| Cell | Count | Percentage | Definition |
| :--- | :---: | :---: | :--- |
| **True Positive (TP)** | `35` | 38.5% | Correctly identified disease |
| **False Negative (FN)** | `7` | 7.7% | Missed disease (delayed triage) |
| **False Positive (FP)** | `6` | 6.6% | False alarm (healthy tagged disease) |
| **True Negative (TN)** | `43` | 47.3% | Correctly identified healthy |

- **Exact Caveat Line:** *"In testing, this model missed 7 of 42 patients who had disease (about 1 in 6)."* (`ml/train.py:228`, `metrics.json:caveat_line`, rendered in `AssessSection.tsx`).

---

## 5. Demographic Fairness & Wilson 95% Confidence Intervals

Computed by `ml/train.py` (lines 235–275) and exported to `metrics.json:fairness`:

| Group | Total | Positives | Sensitivity (Recall) | Wilson 95% CI (Sensitivity) | Specificity | Wilson 95% CI (Specificity) | Small Sample Warning ($<30$ pos) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Men (`sex=1`)** | `60` | `31` | `83.9%` (26 of 31) | **[67.4%, 92.9%]** | `79.3%` (23 of 29) | **[61.6%, 90.2%]** | `False` (31 positives) |
| **Women (`sex=0`)** | `31` | `11` | `81.8%` (9 of 11) | **[52.3%, 94.9%]** | `100.0%` (20 of 20) | **[83.9%, 100.0%]** | `True` (11 positives) |

- **Sample Size Assessment:** *"9/11 (81.8%) vs 26/31 (83.9%) is not a meaningful difference given the wide overlapping 95% Wilson confidence intervals [52.3%–94.9%] vs [67.4%–92.9%] and small sample size."* (`metrics.json:fairness.sample_size_assessment`, rendered in `FairnessSection.tsx`).
- **Cohort Sex Imbalance:** 68% Men (206/303) vs 32% Women (97/303).
- **Disease Prevalence by Sex:** Men 55.3% (114/206) vs Women 25.8% (25/97) (`ml/train.py:290–298`, `metrics.json:insights.disease_rate_by_sex`).

---

## 6. Welch's Two-Sample t-Test on Maximum Heart Rate

Computed by `ml/train.py` (lines 280–288) via `scipy.stats.ttest_ind(..., equal_var=False)`:

- **Mean Healthy (`diagnosis=0`):** `158.38 bpm`
- **Mean Diseased (`diagnosis=1`):** `139.34 bpm`
- **t-Statistic:** `7.37`
- **p-Value:** `1.09e-11` ($p < 0.001$) (`metrics.json:insights.thalach_by_diagnosis`, rendered in `DataSection.tsx`).

---

## 7. Research Pulse (Text Sentiment Analysis on 20 AHA Headlines)

Computed by `ml/train.py` (lines 330–380) and exported to `public/headlines.json`:

| Analysis Stage | Positives ($\ge 0.05$) | Negatives ($\le -0.05$) | Neutrals | Mean Compound | Sample Headline Score |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Raw VADER (This site's run)** | `12` | `7` | `1` | `+0.0725` | *"GLP-1 meds linked..."* = `+0.2263` |
| **Orange Deck Benchmark** | `6` | `10` | `4` | `-0.18` | *"GLP-1 meds linked..."* = `-0.51` |

- **Lexicon Ground Truth:** VADER lexicon value for `'heart'` is `+3.20` (`ml/debug_sentiment.py:6`).
- **Explanation:** Orange applies clinical stop-word filtering and case folding before scoring. Raw VADER treats the word *heart* with positive social-media affinity ($+3.20$), resulting in false positive sentiment on clinical headlines.

---

## 8. Held-Out Test Set Sample Patients

Extracted exclusively from held-out test split (`split == "test"`) in `dataset.json`:

1. **Sample A (Low Risk · Test Record #244):**
   - Profile: 60-year-old female (`sex=0`), non-anginal chest pain (`cp=3`), BP 120 mm Hg, Chol 178 mg/dl, Max HR 96 bpm, ST depression 0.0, 0 coloured vessels, normal thallium.
   - Model Prediction: **1.6% (0.0161)** probability $\rightarrow$ Lower risk.
   - Actual Ground Truth: `diagnosis = 0` (Disease Absent). Matches model.

2. **Sample B (High Risk · Test Record #175):**
   - Profile: 57-year-old male (`sex=1`), asymptomatic chest pain (`cp=4`), BP 152 mm Hg, Chol 274 mg/dl, Max HR 88 bpm, ST depression 1.2, 1 coloured vessel, reversible thallium defect.
   - Model Prediction: **99.1% (0.9911)** probability $\rightarrow$ Higher risk.
   - Actual Ground Truth: `diagnosis = 1` (Disease Present). Matches model.

3. **Sample C (Borderline · Test Record #287):**
   - Profile: 58-year-old male (`sex=1`), atypical angina (`cp=2`), BP 125 mm Hg, Chol 220 mg/dl, Max HR 144 bpm, ST depression 0.4, 0 coloured vessels (imputed from mode), reversible thallium defect.
   - Model Prediction: **48.9% (0.4894)** probability $\rightarrow$ Borderline risk.
   - Actual Ground Truth: `diagnosis = 0` (Disease Absent). Near the 50% threshold boundary.

---

## 9. Team Author Roster

Configured in `src/config.ts` (lines 20–45):

1. **Mathivadanasree B:** `RA2611009020012` (Monogram `MB`)
2. **Seetha Shree A:** `RA2611009020041` (Monogram `SA`)
3. **Rithikaa J:** `RA2611009020049` (Monogram `RJ`)
4. **Tharunika M.A:** `RA2611009020051` (Monogram `TM`)
- **Institution:** *Team 2, Four-Ward Thinking · B.Tech BT-A · SRM Institute of Science and Technology, Ramapuram*
- **Optional Placeholders:** `facultyGuide` and `presentationDate` (rendered only if populated).

