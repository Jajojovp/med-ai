import joblib
import os
from pathlib import Path

def test_modelo(path):
    try:
        print(f'Probando carga de: {path}')
        modelo = joblib.load(path)
        print(f'  [OK] Modelo cargado: {type(modelo)}')
        # Si es sklearn, intenta predecir dummy
        if hasattr(modelo, "predict"):
            import numpy as np
            try:
                dummy = np.zeros((1, modelo.n_features_in_)) if hasattr(modelo, 'n_features_in_') else np.zeros((1, 5))
                pred = modelo.predict(dummy)
                print(f'  [OK] Predicción dummy: {pred}')
            except Exception as e:
                print(f'  [WARN] No se pudo predecir dummy: {e}')
        else:
            print('  [INFO] El objeto cargado no tiene método predict.')
    except Exception as e:
        print(f'  [ERROR] No se pudo cargar el modelo: {e}')

if __name__ == "__main__":
    # Ruta absoluta ajustada manualmente
    base_dirs = [
        Path(r'C:/Users/jairo/Documents/GitHub/MEDICO/Analisis predictivos/DIABETES'),
        Path(r'C:/Users/jairo/Documents/GitHub/MEDICO/Analisis predictivos/Cancer de estomago/Asian-GC-LNM-Prediction-main/model'),
        Path(r'C:/Users/jairo/Documents/GitHub/MEDICO/Analisis predictivos/Accidente cerebrovasculares stroke/Stroke-prediction-main'),
        Path(r'C:/Users/jairo/Documents/GitHub/MEDICO/Analisis predictivos/Accidente cerebrovasculares stroke/Stroke-prediction-main/Stroke-prediction-main'),
    ]
    pkl_files = []
    for base in base_dirs:
        pkl_files.extend(base.rglob('*.pkl'))
    if not pkl_files:
        print('No se encontraron archivos .pkl en las rutas especificadas.')
    for pkl_path in pkl_files:
        test_modelo(str(pkl_path))
