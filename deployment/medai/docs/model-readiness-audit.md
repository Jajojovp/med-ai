# Oncology model readiness audit

Audit date: 2026-10-21. Scope: model artifacts in `LOCAL_MODELS_DIR`, their source material under `C:/Users/jairo/Documents/GitHub/medico 2/Analisis predictivos`, and the MedAI oncology review form.

## Finding

The current form captures cancer stage, histology, biomarkers, and provenance. Its submit handler only checks required fields; it does not call an inference service. The local oncology `.pkl` files are incompatible with the form and are not ready to return clinically meaningful patient probabilities.

The deployed artifact inventory contains 5 breast models, 3 lung models, and 4 gastric models, not five for each disease. All inspected models expose numeric classes `0` and `1`; that alone does not establish the positive outcome or its clinical interpretation. Feature counts differ between gastric artifacts (15 or 25), and source scripts indicate materially different prediction targets and input types.

## Per-disease evidence

| Disease | Local artifacts | Discovered input/task | Readiness |
| --- | ---: | --- | --- |
| Breast | 5 | The local form asks for stage and ER/PR/HER2 etc. Separate source documents describe WDBC models using 30 image-derived nucleus measurements, and a METABRIC survival package using hundreds of clinical/genomic fields. | No common input schema; local form cannot be passed directly. Need exact artifact-to-source mapping, labels, preprocessing and outcome definition. |
| NSCLC/lung | 3 | Source code lists up to 23 demographic/exposure/symptom fields; project documentation says some artifacts were trained on synthetic data. Other source folders contain imaging/neural models. | Heterogeneous tasks and schemas; source metrics are not independently substantiated. |
| Gastric | 4 | Source scripts include synthetic EHR risk scores and synthetic lymph-node-metastasis labels; other model folders concern MSI/MSS, imaging or risk. | Non-interchangeable endpoints; generated labels cannot establish clinical performance. |

The source documentation itself states that breast and lung models may be trained on synthetic demonstration data. Gastric scripts explicitly use random feature generation and rule-derived labels. A source CSV also records failed tests for dimensional mismatches and test-code formatting errors. These findings prohibit treating raw `predict_proba` values as patient risk or treatment guidance.

## To unlock a responsible inference demo

For each exact artifact, record and verify: source dataset and license; cohort and inclusion criteria; named ordered feature schema and units; preprocessing/scaler and missing-value behavior; outcome label mapping and prediction horizon; training/validation/test split; external validation; sensitivity, specificity, AUROC, calibration and uncertainty; model/library version and checksum; and a clinician-reviewed intended use. Then choose an endpoint (e.g. WDBC cytology classification, METABRIC survival, or gastric nodal involvement) and build a separate, explicitly labeled research/demo workflow around its real input data. Do not merge different endpoints into one score.

## User-facing behavior

“Check form” should report completeness and clearly state that no model ran. The app can still be useful in a clinician review: link evidence briefs, current trial searches, and supportive-care resources to official sources, without generating individualized treatment instructions from an unvalidated score.
