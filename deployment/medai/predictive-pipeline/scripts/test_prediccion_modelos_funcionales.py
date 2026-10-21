import joblib
import numpy as np

# Modelos funcionales
MODELOS = {
    'cancer_estomago': {
        'scaler': r'C:/Users/jairo/Documents/GitHub/MEDICO/Analisis predictivos/Cancer de estomago/Asian-GC-LNM-Prediction-main/model/scaler.pkl',
        'modelo': r'C:/Users/jairo/Documents/GitHub/MEDICO/Analisis predictivos/Cancer de estomago/Asian-GC-LNM-Prediction-main/model/model.pkl',
    },
    'stroke': {
        'modelo': r'C:/Users/jairo/Documents/GitHub/MEDICO/Analisis predictivos/Accidente cerebrovasculares stroke/Stroke-prediction-main/strokenew.pkl',
    },
    'stroke2': {
        'modelo': r'C:/Users/jairo/Documents/GitHub/MEDICO/Analisis predictivos/Accidente cerebrovasculares stroke/Stroke-prediction-main/Stroke-prediction-main/strokenew.pkl',
    }
}

def test_cancer_estomago():
    print('\n--- Prueba: Cáncer de Estómago ---')
    scaler = joblib.load(MODELOS['cancer_estomago']['scaler'])
    modelo = joblib.load(MODELOS['cancer_estomago']['modelo'])
    # Ajustar a 14 features
    X_dummy = np.zeros((1, 14))
    X_scaled = scaler.transform(X_dummy)
    pred = modelo.predict(X_scaled)
    print(f'Predicción dummy: {pred}')

def test_stroke():
    print('\n--- Prueba: Stroke (modelo 1) ---')
    modelo = joblib.load(MODELOS['stroke']['modelo'])
    # Suponiendo 5 features (ajustar si es necesario)
    X_dummy = np.zeros((1, 5))
    pred = modelo.predict(X_dummy)
    print(f'Predicción dummy: {pred}')
    print('\n--- Prueba: Stroke (modelo 2) ---')
    modelo2 = joblib.load(MODELOS['stroke2']['modelo'])
    pred2 = modelo2.predict(X_dummy)
    print(f'Predicción dummy: {pred2}')

if __name__ == "__main__":
    test_cancer_estomago()
    test_stroke()
