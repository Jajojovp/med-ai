# Kaggle WDBC demonstration

## Precisely defined task

This demonstration classifies a breast mass as benign (`B`) or malignant (`M`) using 30 numeric measurements extracted from fine needle aspirate (FNA) images. It uses Kaggle's `uciml/breast-cancer-wisconsin-data` CSV (569 rows; 357 benign and 212 malignant). It is not a screening, recurrence, prognosis, treatment-response, or treatment-selection model. Stage and biomarkers in the clinical review form are not inputs to this benchmark.

Source: [Kaggle dataset and download](https://www.kaggle.com/datasets/uciml/breast-cancer-wisconsin-data). Source CSV SHA-256: `1425d9affa78ba8e53afc81d0ef8a19069ee10c4b21fe89b3cf514071b12ee33`.

## Reproduction

From the repository root on Windows:

```powershell
.venv\Scripts\python.exe predictive-pipeline\backend\train_wdbc.py
```

The script downloads the CSV when absent, verifies the schema and target classes, uses a stratified 80/20 split with random seed 42, trains five separately named classifiers on the 80% partition, and writes model files and `evaluation.json` under the ignored `predictive-pipeline/backend/wdbc_models` folder. The reported estimate is a single held-out split of 114 records.

| Model | Accuracy | Balanced accuracy | ROC AUC | Sensitivity | Specificity |
|---|---:|---:|---:|---:|---:|
| Logistic regression | 97.4% | 96.9% | 99.5% | 95.2% | 98.6% |
| Random forest | 97.4% | 96.4% | 99.7% | 92.9% | 100.0% |
| Gradient boosting | 96.5% | 95.2% | 99.4% | 90.5% | 100.0% |
| RBF SVC | 98.2% | 98.1% | 99.5% | 97.6% | 98.6% |
| Extra trees | 97.4% | 96.4% | 99.8% | 92.9% | 100.0% |

These numbers describe only that local split. The small, repeatedly studied public dataset, shared acquisition context, and lack of external validation mean these figures do not establish calibration, generalization, clinical utility, or production readiness. Predicted class scores are model probability outputs, not calibrated probabilities of disease for an individual.

The API requires all 30 features by exact name, rejects missing and non-finite values, and uses a fixed feature order independent of JSON key order. The UI includes one original example from each class to make class changes easy to inspect. Do not enter identifiable patient data.

## Clinical boundary

No clinical recommendation follows from this benchmark. Do not infer a patient diagnosis, care pathway, staging, prognosis, or treatment from these outputs. A clinical study would need an intended-use specification, independent external cohort, calibration and subgroup analysis, prospective workflow evaluation, privacy/security review, and clinical and regulatory approval appropriate to its jurisdiction.
