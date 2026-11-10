# Heart Disease Risk Prediction

**Team 2, Four-Ward Thinking**  
*Dept.BioTechnology · B.Tech BT-A · SRM Institute of Science and Technology, Ramapuram*

> **Educational prototype, not a clinical tool.**  
> This application is an academic demonstration developed for coursework evaluation. It is not certified, validated, or intended for medical screening, diagnosis, prognosis, or clinical decision support. Real clinical cardiology requires comprehensive evaluation by qualified healthcare practitioners.

**Live Deployment:** [https://four-ward-thinking.github.io/heart-disease-risk-prediction/](https://four-ward-thinking.github.io/heart-disease-risk-prediction/)

---

## About the Project

This project investigates binary heart disease risk classification trained on the landmark UCI Cleveland Heart Disease dataset (303 patient records, 13 clinical variables). It addresses the research question posed in the project study: *can machine learning beat a simple hand-written clinical rule with high sensitivity so that fewer high-risk patients are missed?*

The system features:
1. **A Live Risk-Assessment Tool:** Runs genuine client-side inference using an in-browser logistic regression engine written in TypeScript (`src/lib/predict.ts`), standardising clinical inputs and evaluating sigmoid probabilities with mathematical parity to scikit-learn ($< 10^{-15}$ max delta).
2. **Transparent Project Showcase:** Dynamic ROC curves, threshold adjustment slider, held-out patient case studies (A, B, C), subgroup fairness evaluation with Wilson 95% confidence intervals, and a VADER NLP study on medical news releases.

---

## Team Members & Register Numbers

| Name | Register Number | Role / Department |
| :--- | :--- | :--- |
| **Mathivadanasree B** | `RA2611009020012` | Dept.BioTechnology |
| **Seetha Shree A** | `RA2611009020041` | Dept.BioTechnology |
| **Rithikaa J** | `RA2611009020049` | Dept.BioTechnology |
| **Tharunika M.A** | `RA2611009020051` | Dept.BioTechnology |

*Course:* B.Tech Biotechnology (BT-A)  
*Department:* Dept.BioTechnology  
*Institution:* SRM Institute of Science and Technology, Ramapuram  

---

## Repository Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions workflow for automated Pages deployment
├── data/
│   ├── heart_cleveland_orange.tab  # Canonical UCI Cleveland 303-row dataset (Orange tab format)
│   └── heart_headlines.csv         # 20 American Heart Association news release headlines
├── ml/
│   ├── train.py               # Data validation, training, metrics generation & JSON export pipeline
│   ├── requirements.txt       # Python dependencies (scikit-learn, pandas, scipy, vaderSentiment)
│   └── parity.json            # 30 held-out test vectors with exact scikit-learn logits for testing
├── public/
│   ├── model.json             # Trained LR weights, intercept, scaling means/stds, and feature metadata
│   ├── metrics.json           # Model comparison table, ROC points, threshold stats, Wilson CIs
│   ├── dataset.json           # 303 patient records with stable IDs and train/test split assignments
│   ├── headlines.json         # 20 AHA headlines with VADER scores and lexicon impact tokens
│   └── favicon.svg            # Engraved heart and ECG linework SVG favicon
├── src/
│   ├── components/
│   │   ├── HeartHeroIllustration.tsx  # Engraved anatomical plate with pinned annotations
│   │   ├── HeartMark.tsx              # Heart & ECG brand mark SVG
│   │   ├── Navbar.tsx                 # Responsive header with navigation and mobile drawer
│   │   ├── NoticeStrip.tsx            # Clinical editorial disclaimer banner
│   │   └── PineHeartOrnament.tsx      # Brass linework heart ornament for feature band
│   ├── sections/
│   │   ├── HeroSection.tsx            # Editorial hero layout with headline and live data ledger
│   │   ├── AssessSection.tsx          # 13-feature risk calculator with real-time probability & waterfall
│   │   ├── HowBuiltSection.tsx        # 3-step numbered pipeline (Clean, Train, Check)
│   │   ├── PineBandSection.tsx        # Dark pine band featuring the four critical audit points
│   │   ├── ModelSection.tsx           # 5-model comparison table, SVG ROC curve & threshold slider
│   │   ├── DataSection.tsx            # Cleveland dataset explorer & data dictionary table
│   │   ├── FairnessSection.tsx        # Sex subgroup audit, Wilson 95% CIs, and small-sample alerts
│   │   ├── ResearchPulseSection.tsx   # AHA headlines NLP study, diverging dot plot & text analysis
│   │   ├── TeamSection.tsx            # Student author credentials and register numbers
│   │   └── FooterSection.tsx          # Academic citations, methodology disclosures, and colophon
│   ├── lib/
│   │   ├── predict.ts                 # Pure TypeScript logistic regression inference engine
│   │   └── predict.test.ts            # Vitest suite verifying scikit-learn mathematical parity
│   ├── styles/
│   │   ├── tokens.css                 # Custom CSS color palette and typography tokens
│   │   └── global.css                 # Global layout, accessibility, and print rules
│   ├── App.tsx                        # Main application orchestrator
│   ├── config.ts                      # Project constants, team metadata, and course information
│   └── main.tsx                       # React DOM application mount
├── index.html                         # HTML entry template with Fraunces & Montserrat fonts
├── package.json                       # Node dependencies and scripts
├── tsconfig.json                      # TypeScript strict configuration
└── vite.config.ts                     # Vite build configuration with dynamic base path support
```

---

## Local Development Setup

### Prerequisites
- Node.js (version 20 LTS recommended, minimum 18+)
- Python (version 3.10+ for model retraining)

### 1. Install Dependencies
```bash
npm ci
```

### 2. Run Parity & Verification Tests
```bash
npm test
```
The Vitest test suite executes 10 tests confirming:
- RFC 8259 compliance across all exported JSON artifacts (zero `NaN` or `Infinity`).
- Mathematical parity between TypeScript inference and scikit-learn across 30 held-out patient vectors (maximum probability discrepancy $< 10^{-15}$).
- Categorical one-hot aggregation back to the 13 clinical features.
- Missing value imputation using training set modes (`ca=0`, `thal=3`).

### 3. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates optimized static assets into `dist/`.

---

## How to Retrain the Model

To rerun data validation, re-fit the classification models, re-compute ROC thresholds and Wilson confidence intervals, and regenerate the JSON artifacts:

```bash
# 1. Install Python dependencies
pip install -r ml/requirements.txt

# 2. Execute training and export script
python ml/train.py
```

The script will:
1. Verify raw data integrity in `data/heart_cleveland_orange.tab` (303 rows, 14 columns, 164 no disease, 139 disease present, 4 missing `ca`, 2 missing `thal`).
2. Split records into a 70% training set (212 rows) and 30% held-out test set (91 rows) with stratification (`random_state=42`).
3. Train 5 baseline models: Logistic Regression, Gaussian Naive Bayes, k-Nearest Neighbors, Random Forest, and Decision Tree.
4. Calculate ROC curves, optimal cutoff thresholds, and sex-disaggregated Wilson 95% score confidence intervals.
5. Perform VADER sentiment scoring on the 20 AHA medical headlines in `data/heart_headlines.csv`.
6. Export `public/model.json`, `public/metrics.json`, `public/dataset.json`, `public/headlines.json`, and `ml/parity.json` with strict `allow_nan=False`.

---

## Citations & Data Attribution

- **Cleveland Clinic Heart Disease Dataset:**  
  Janosi, A., Steinbrunn, W., Pfisterer, M., & Detrano, R. (1989). *Heart disease* [Data set]. UCI Machine Learning Repository. [https://doi.org/10.24432/C52P4X](https://doi.org/10.24432/C52P4X)  
  *Note on Data Rights:* The underlying dataset belongs to its original clinical providers (V.A. Medical Center, Long Beach and Cleveland Clinic Foundation: Robert Detrano, M.D., Ph.D.) under the terms of the UCI Machine Learning Repository.
- **American Heart Association News Releases:**  
  American Heart Association. (2026). *News releases* [Press releases]. EurekAlert! [https://www.eurekalert.org/newsroom/AHA/home](https://www.eurekalert.org/newsroom/AHA/home)
- **Orange Data Mining:**  
  Demšar, J., Curk, T., Erjavec, A., Gorup, Č., Hočevar, T., Milutinovič, M., Možina, M., Polajnar, M., Toplak, M., Starič, A., Štajdohar, M., Umek, L., Žagar, L., Žbontar, J., Žitnik, M., & Zupan, B. (2013). Orange: Data mining toolbox in Python. *Journal of Machine Learning Research*, 14(1), 2349–2353. [https://orangedatamining.com](https://orangedatamining.com)

---

## License

This software and web application code are released under the [MIT License](LICENSE).  
The medical dataset remains under the open research terms of the UCI Machine Learning Repository.
