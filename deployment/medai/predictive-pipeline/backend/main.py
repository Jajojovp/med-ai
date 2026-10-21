"""Servicio local de inferencia para los modelos MedAI.

Los modelos nunca se exponen al navegador: el frontend llama a este servicio a
través de su ruta autenticada /api/predict.
"""
from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import numpy as np
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

MODELS_DIR = Path(os.getenv("MEDAI_MODELS_DIR", r"C:\Users\jairo\Documents\GitHub\Med-ai\LOCAL_MODELS_DIR"))
API_KEY = os.getenv("PREDICTION_API_KEY", "")
PREFIXES = {"diabetes": "diabetes_", "stroke": "stroke_", "heart": "enfermedades_cardiacas_"}
app = FastAPI(title="MedAI Prediction API", version="0.1.0")

class PredictionRequest(BaseModel):
    disease: str = Field(pattern="^(diabetes|stroke|heart)$")
    values: dict[str, float]

class WdbcRequest(BaseModel):
    disease: str = Field(pattern="^breast_wdbc$")
    values: dict[str, float]

def verify_key(key: str | None) -> None:
    if API_KEY and key != API_KEY:
        raise HTTPException(status_code=401, detail="Clave de servicio inválida.")

def probability(model: Any, vector: np.ndarray) -> float:
    if hasattr(model, "predict_proba"):
        return float(model.predict_proba(vector)[0][-1])
    prediction = float(model.predict(vector)[0])
    return max(0.0, min(1.0, prediction))

def level(probability_value: float) -> str:
    return "Bajo" if probability_value < .30 else "Intermedio" if probability_value < .70 else "Elevado"

@app.get("/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "models_directory": str(MODELS_DIR), "models_found": len(list(MODELS_DIR.glob("*.pkl"))) if MODELS_DIR.exists() else 0}

@app.get("/models")
def models(x_api_key: str | None = Header(default=None)) -> dict[str, list[str]]:
    verify_key(x_api_key)
    return {disease: [file.name for file in MODELS_DIR.glob(f"{prefix}*.pkl")] for disease, prefix in PREFIXES.items()}

@app.post("/predict")
def predict(request: PredictionRequest, x_api_key: str | None = Header(default=None)) -> dict[str, Any]:
    verify_key(x_api_key)
    if not MODELS_DIR.exists():
        raise HTTPException(status_code=503, detail="Directorio de modelos no encontrado. Configure MEDAI_MODELS_DIR.")
    vector = np.array([list(request.values.values())], dtype=float)
    scores, skipped = [], []
    for file in MODELS_DIR.glob(f"{PREFIXES[request.disease]}*.pkl"):
        try:
            model = joblib.load(file)
            expected = getattr(model, "n_features_in_", vector.shape[1])
            if expected != vector.shape[1]:
                skipped.append(f"{file.name}: requiere {expected} variables, se recibieron {vector.shape[1]}")
                continue
            scores.append({"model": file.stem, "probability": probability(model, vector)})
        except Exception as exc:
            skipped.append(f"{file.name}: no se pudo evaluar ({type(exc).__name__})")
    if not scores:
        raise HTTPException(status_code=422, detail={"error": "Ningún modelo pudo procesar las variables recibidas.", "details": skipped})
    average = sum(item["probability"] for item in scores) / len(scores)
    return {"disease": request.disease, "scores": scores, "average_probability": average, "risk_level": level(average), "skipped_models": skipped}

WDBC_DIR = Path(__file__).resolve().parent / "wdbc_models"
WDBC_FEATURES = [
    f"{name}_{suffix}" for suffix in ("mean", "se", "worst")
    for name in ("radius", "texture", "perimeter", "area", "smoothness", "compactness", "concavity", "concave points", "symmetry", "fractal_dimension")
]
WDBC_MODELS = {"logistic_regression", "random_forest", "gradient_boosting", "svc_rbf", "extra_trees"}

@lru_cache(maxsize=5)
def load_wdbc_model(name: str) -> Any:
    if name not in WDBC_MODELS:
        raise ValueError("Unknown WDBC model")
    return joblib.load(WDBC_DIR / f"{name}.joblib")

@app.get("/wdbc/health")
def wdbc_health() -> dict[str, Any]:
    return {"status": "ok", "models_ready": all((WDBC_DIR / f"{name}.joblib").is_file() for name in WDBC_MODELS)}

@app.post("/wdbc/predict")
def predict_wdbc(request: WdbcRequest, x_api_key: str | None = Header(default=None)) -> dict[str, Any]:
    verify_key(x_api_key)
    if set(request.values) != set(WDBC_FEATURES):
        raise HTTPException(status_code=422, detail={"error": "Se requieren exactamente las 30 variables WDBC.", "expected_features": len(WDBC_FEATURES)})
    if any(not np.isfinite(value) for value in request.values.values()):
        raise HTTPException(status_code=422, detail="Todas las variables deben ser números finitos.")
    if not all((WDBC_DIR / f"{name}.joblib").is_file() for name in WDBC_MODELS):
        raise HTTPException(status_code=503, detail="Los modelos de demostración WDBC no están preparados. Ejecute train_wdbc.py.")
    vector = np.array([[request.values[name] for name in WDBC_FEATURES]], dtype=float)
    scores = []
    for name in sorted(WDBC_MODELS):
        model = load_wdbc_model(name)
        probability_malignant = float(model.predict_proba(vector)[0][list(model.classes_).index("M")])
        scores.append({"model": name, "prediction": "malignant" if probability_malignant >= 0.5 else "benign", "malignant_probability": probability_malignant})
    return {"disease": "breast_wdbc", "task": "FNA breast mass benign-vs-malignant classification", "scores": scores, "disclaimer": "Retrospective public-dataset demonstration only. Not a clinical risk estimate, diagnosis, prognosis or treatment recommendation."}
