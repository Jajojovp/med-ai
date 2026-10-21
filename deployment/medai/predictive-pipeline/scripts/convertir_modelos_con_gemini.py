import google.generativeai as genai
import os
from pathlib import Path
from dotenv import load_dotenv, find_dotenv
import logging

# Cargar variables de entorno
load_dotenv(find_dotenv())
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY no está definida. Cópiala en .env (nunca en código).")
MODEL = "models/gemini-1.5-flash"
genai.configure(api_key=API_KEY)

ANALISIS_DIR = Path('../../MEDICO/Analisis predictivos/')
OUTPUT_DIR = Path('../../MEDICO/modelos_pkl/')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

model_exts = ['.h5', '.pt', '.pkl', '.sav', '.joblib', '.model', '.pytorch', '.onnx', '.ckpt', '.pkl', '.pickle', '.ipynb', '.py']
archivos = [p for p in ANALISIS_DIR.rglob('*') if p.suffix.lower() in model_exts]

for archivo in archivos:
    print(f"Consultando Gemini para: {archivo.name}")
    # Leer fragmento binario o de texto según tipo
    try:
        if archivo.suffix.lower() in ['.pkl', '.pickle', '.joblib', '.h5', '.pt', '.sav', '.model', '.pytorch', '.onnx', '.ckpt']:
            with open(archivo, 'rb') as f:
                fragmento = f.read(20)
            fragmento_str = str(fragmento)
        else:
            with open(archivo, 'r', encoding='utf-8', errors='ignore') as f:
                fragmento_str = ''.join([next(f) for _ in range(10)])
    except Exception as e:
        fragmento_str = f"[ERROR] No se pudo leer el archivo: {e}"
    prompt = (
        f"Fragmento de archivo: {fragmento_str}\n"
        "¿Cómo puedo convertir este archivo a un modelo .pkl de Python listo para usar con joblib o pickle? "
        "Si ya es .pkl, solo indícalo. Si requiere pasos previos, indícalos claramente."
    )
    try:
        model = genai.GenerativeModel(MODEL)
        response = model.generate_content(prompt)
        respuesta = response.text if hasattr(response, 'text') and response.text else '[ERROR] Respuesta vacía de Gemini.'
    except Exception as e:
        respuesta = f"[ERROR] {e}"
        logging.error(f"Error consultando Gemini para {archivo}: {e}")
    print(respuesta)
    with open(OUTPUT_DIR / f"{archivo.stem}_to_pkl_gemini.txt", 'w', encoding='utf-8') as f:
        f.write(respuesta)

print("Flujo asistido Copilot+Gemini completado. Revisa los archivos *_to_pkl_gemini.txt para instrucciones y código de conversión.")
