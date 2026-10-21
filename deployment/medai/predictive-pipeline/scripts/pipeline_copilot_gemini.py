import os
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv, find_dotenv
import logging

# Configuración
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

model_exts = ['.h5', '.pt', '.pkl', '.sav', '.joblib', '.model', '.pytorch', '.onnx', '.ckpt', '.pickle']
script_exts = ['.py', '.ipynb']
archivos = [p for p in ANALISIS_DIR.rglob('*') if p.suffix.lower() in model_exts + script_exts]

for archivo in archivos:
    print(f"[Copilot] Generando plantilla de conversión para: {archivo.name}")
    # Plantilla base Copilot
    if archivo.suffix.lower() in ['.pkl', '.pickle', '.joblib']:
        plantilla = f"""# Este archivo ya es un modelo serializado de Python. Puedes cargarlo así:\nimport joblib\nmodelo = joblib.load(r'{archivo}')\n"""
    elif archivo.suffix.lower() in ['.h5', '.pt', '.sav', '.model', '.pytorch', '.onnx', '.ckpt']:
        plantilla = f"""# Cargar el modelo original y guardarlo como .pkl\n# Reemplaza este bloque con el código específico para el framework usado (Keras, PyTorch, etc.)\n"""
    elif archivo.suffix.lower() == '.py':
        plantilla = f"""# Ejecuta este script para entrenar el modelo y luego guárdalo como .pkl usando joblib o pickle.\n"""
    elif archivo.suffix.lower() == '.ipynb':
        plantilla = f"""# Abre este notebook, ejecuta las celdas de entrenamiento y guarda el modelo como .pkl.\n"""
    else:
        plantilla = "# Tipo de archivo no reconocido."
    # Guardar plantilla Copilot
    with open(OUTPUT_DIR / f"{archivo.stem}_to_pkl_copilot.txt", 'w', encoding='utf-8') as f:
        f.write(plantilla)
    # Gemini solo valida/mejora casos seleccionados (ejemplo: solo .py y .ipynb)
    if archivo.suffix.lower() in ['.py', '.ipynb']:
        try:
            with open(archivo, 'r', encoding='utf-8', errors='ignore') as f:
                fragmento = ''.join([next(f) for _ in range(10)])
        except Exception as e:
            fragmento = f"[ERROR] No se pudo leer el archivo: {e}"
        prompt = (
            f"Fragmento de archivo: {fragmento}\n"
            "¿Cómo mejorarías o validarías el siguiente flujo para convertir el modelo generado a .pkl listo para joblib o pickle? Dame solo el código mejorado."
        )
        try:
            model = genai.GenerativeModel(MODEL)
            response = model.generate_content(prompt)
            respuesta = response.text if hasattr(response, 'text') and response.text else '[ERROR] Respuesta vacía de Gemini.'
        except Exception as e:
            respuesta = f"[ERROR] {e}"
            logging.error(f"Error consultando Gemini para {archivo}: {e}")
        with open(OUTPUT_DIR / f"{archivo.stem}_to_pkl_gemini.txt", 'w', encoding='utf-8') as f:
            f.write(respuesta)
        print(f"[Gemini] Validación/Mejora generada para: {archivo.name}")

print("Pipeline mixto Copilot+Gemini completado. Revisa los archivos *_to_pkl_copilot.txt y *_to_pkl_gemini.txt.")
