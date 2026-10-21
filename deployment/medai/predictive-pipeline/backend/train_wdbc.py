"""Train reproducible educational classifiers on Kaggle's public WDBC CSV.

This is a retrospective benchmark demonstration, not clinical validation.
"""
from __future__ import annotations

import csv
import argparse
import hashlib
import json
import urllib.request
import zipfile
from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import ExtraTreesClassifier, GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, balanced_accuracy_score, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "wdbc_data"
MODEL_DIR = ROOT / "wdbc_models"
URL = "https://www.kaggle.com/api/v1/datasets/download/uciml/breast-cancer-wisconsin-data"
FEATURES = [f"{name}_{suffix}" for suffix in ("mean", "se", "worst") for name in ("radius", "texture", "perimeter", "area", "smoothness", "compactness", "concavity", "concave points", "symmetry", "fractal_dimension")]

def load_data(refresh: bool = False) -> tuple[np.ndarray, np.ndarray, str]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    csv_path = DATA_DIR / "data.csv"
    if refresh or not csv_path.exists():
        archive_path = DATA_DIR / "kaggle-wdbc.zip"
        urllib.request.urlretrieve(URL, archive_path)
        with zipfile.ZipFile(archive_path) as archive:
            member = next((item for item in archive.namelist() if item.endswith("data.csv")), None)
            if not member:
                raise RuntimeError("Kaggle archive did not contain data.csv")
            csv_path.write_bytes(archive.read(member))
        archive_path.unlink(missing_ok=True)
    digest = hashlib.sha256(csv_path.read_bytes()).hexdigest()
    with csv_path.open(newline="", encoding="utf-8-sig") as stream:
        rows = list(csv.DictReader(stream))
    if not rows or not set(FEATURES).issubset(rows[0]):
        raise RuntimeError("CSV does not match the documented Kaggle WDBC schema")
    x = np.asarray([[float(row[key]) for key in FEATURES] for row in rows], dtype=float)
    y = np.asarray([row["diagnosis"].strip() for row in rows])
    if set(y) != {"B", "M"}:
        raise RuntimeError("Unexpected diagnosis labels; expected B/M")
    return x, y, digest

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--refresh", action="store_true", help="download the current Kaggle dataset version before training")
    args = parser.parse_args()
    x, y, digest = load_data(refresh=args.refresh)
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=.2, random_state=42, stratify=y)
    models = {
        "logistic_regression": make_pipeline(StandardScaler(), LogisticRegression(max_iter=3000, class_weight="balanced", random_state=42)),
        "random_forest": RandomForestClassifier(n_estimators=500, class_weight="balanced", random_state=42, n_jobs=-1),
        "gradient_boosting": GradientBoostingClassifier(n_estimators=150, learning_rate=.05, max_depth=2, random_state=42),
        "svc_rbf": make_pipeline(StandardScaler(), SVC(C=1.0, kernel="rbf", probability=True, class_weight="balanced", random_state=42)),
        "extra_trees": ExtraTreesClassifier(n_estimators=500, class_weight="balanced", random_state=42, n_jobs=-1),
    }
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    for name, model in models.items():
        model.fit(x_train, y_train)
        joblib.dump(model, MODEL_DIR / f"{name}.joblib")
        positive_index = list(model.classes_).index("M")
        pred = model.predict(x_test)
        prob = model.predict_proba(x_test)[:, positive_index]
        tn, fp, fn, tp = confusion_matrix(y_test, pred, labels=["B", "M"]).ravel()
        results.append({"model": name, "accuracy": accuracy_score(y_test, pred), "balanced_accuracy": balanced_accuracy_score(y_test, pred), "roc_auc": roc_auc_score(y_test == "M", prob), "sensitivity": tp / (tp + fn), "specificity": tn / (tn + fp)})
    (MODEL_DIR / "evaluation.json").write_text(json.dumps({"source": "Kaggle uciml/breast-cancer-wisconsin-data", "source_url": URL, "sha256": digest, "n": len(y), "class_counts": {label: int(np.sum(y == label)) for label in ("B", "M")}, "features": FEATURES, "target": {"B": "benign", "M": "malignant"}, "split": "stratified 80/20, random_state=42", "test_n": len(y_test), "warning": "Single public dataset holdout only; not external validation or evidence of clinical performance.", "results": results}, indent=2), encoding="utf-8")
    print((MODEL_DIR / "evaluation.json").read_text(encoding="utf-8"))

if __name__ == "__main__":
    main()
