import os
import re
import sys
import traceback
from pathlib import Path
import subprocess
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
LOG_FILE = OUTPUT_DIR / 'pipeline_conversion_log.txt'

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

model_exts = ['.h5', '.pt', '.pkl', '.sav', '.joblib', '.model', '.pytorch', '.onnx', '.ckpt', '.pickle', '.py', '.ipynb']
archivos = [p for p in ANALISIS_DIR.rglob('*') if p.suffix.lower() in model_exts]

# Utilidad para extraer código Python de texto

def extraer_codigo_python(texto):
    bloques = re.findall(r'```python(.*?)```', texto, re.DOTALL | re.IGNORECASE)
    if bloques:
        return bloques[0].strip()
    lineas = [l for l in texto.splitlines() if l.strip() and not l.strip().startswith('#')]
    return '\n'.join(lineas)

def ejecutar_codigo(codigo, nombre_archivo):
    script_temp = OUTPUT_DIR / f'_temp_{nombre_archivo}.py'
    with open(script_temp, 'w', encoding='utf-8') as f:
        f.write(codigo)
    try:
        resultado = subprocess.run([sys.executable, str(script_temp)], capture_output=True, text=True, timeout=300)
        exito = resultado.returncode == 0
        salida = resultado.stdout
        error = resultado.stderr
    except Exception as e:
        exito = False
        salida = ''
        error = str(e) + '\n' + traceback.format_exc()
    finally:
        try:
            os.remove(script_temp)
        except Exception:
            pass
    return exito, salida, error

def validar_pkl_generado(archivo_original):
    nombre_base = Path(archivo_original).stem
    posibles = list(OUTPUT_DIR.glob(f'{nombre_base}*.pkl'))
    return len(posibles) > 0

def generar_plantilla_copilot(archivo):
    suf = archivo.suffix.lower()
    if suf in ['.pkl', '.pickle', '.joblib']:
        return f"""# Este archivo ya es un modelo serializado de Python. Puedes cargarlo así:\nimport joblib\nmodelo = joblib.load(r'{archivo}')\n"""
    elif suf in ['.h5', '.pt', '.sav', '.model', '.pytorch', '.onnx', '.ckpt']:
        return f"""# Cargar el modelo original y guardarlo como .pkl\n# Reemplaza este bloque con el código específico para el framework usado (Keras, PyTorch, etc.)\n"""
    elif suf == '.py':
        return f"""# Ejecuta este script para entrenar el modelo y luego guárdalo como .pkl usando joblib o pickle.\n"""
    elif suf == '.ipynb':
        return f"""# Abre este notebook, ejecuta las celdas de entrenamiento y guarda el modelo como .pkl.\n"""
    else:
        return "# Tipo de archivo no reconocido."

def generar_codigo_gemini(archivo):
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
        "Si ya es .pkl, solo indícalo. Si requiere pasos previos, indícalos claramente. Dame solo el código Python necesario."
    )
    try:
        model = genai.GenerativeModel(MODEL)
        response = model.generate_content(prompt)
        respuesta = response.text if hasattr(response, 'text') and response.text else '[ERROR] Respuesta vacía de Gemini.'
    except Exception as e:
        respuesta = f"[ERROR] {e}"
        logging.error(f"Error consultando Gemini para {archivo}: {e}")
    return respuesta

def generar_codigo_gemini_con_error(archivo, error_prev=None, framework_hint=None):
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
    prompt = f"Fragmento de archivo: {fragmento_str}\n"
    if framework_hint:
        prompt += f"El archivo parece ser de {framework_hint}. "
    prompt += "¿Cómo puedo convertir este archivo a un modelo .pkl de Python listo para usar con joblib o pickle? "
    if error_prev:
        prompt += f"El siguiente error ocurrió al intentar una conversión previa: {error_prev}. Corrige el código para evitar este error. "
    prompt += "Dame solo el código Python necesario, ejecutable y robusto."
    try:
        model = genai.GenerativeModel(MODEL)
        response = model.generate_content(prompt)
        respuesta = response.text if hasattr(response, 'text') and response.text else '[ERROR] Respuesta vacía de Gemini.'
    except Exception as e:
        respuesta = f"[ERROR] {e}"
        logging.error(f"Error consultando Gemini para {archivo}: {e}")
    return respuesta

def detectar_framework(archivo):
    # Heurística simple por nombre o contenido
    nombre = archivo.name.lower()
    if any(x in nombre for x in ['keras', 'h5', 'tensorflow']):
        return 'Keras/TensorFlow'
    if any(x in nombre for x in ['torch', 'pt', 'pytorch']):
        return 'PyTorch'
    if any(x in nombre for x in ['sklearn', 'scikit', 'joblib', 'pickle', 'random_forest', 'regression']):
        return 'scikit-learn'
    if archivo.suffix.lower() == '.py':
        try:
            with open(archivo, 'r', encoding='utf-8', errors='ignore') as f:
                contenido = f.read(2000).lower()
            if 'keras' in contenido or 'tensorflow' in contenido:
                return 'Keras/TensorFlow'
            if 'torch' in contenido:
                return 'PyTorch'
            if 'sklearn' in contenido or 'scikit' in contenido:
                return 'scikit-learn'
        except Exception:
            pass
    return None

def ejecutar_script_directo(archivo, nombre_base):
    # Ejecuta el script .py directamente
    try:
        resultado = subprocess.run([sys.executable, str(archivo)], capture_output=True, text=True, timeout=300)
        exito = resultado.returncode == 0
        salida = resultado.stdout
        error = resultado.stderr
    except Exception as e:
        exito = False
        salida = ''
        error = str(e) + '\n' + traceback.format_exc()
    return exito, salida, error

def main():
    with open(LOG_FILE, 'w', encoding='utf-8') as log:
        for archivo in archivos:
            nombre_base = archivo.stem
            log.write(f'\nProcesando {archivo}...\n')
            print(f'\nProcesando {archivo}...')
            estrategias = []
            # 1. Copilot
            plantilla_copilot = generar_plantilla_copilot(archivo)
            estrategias.append(('Copilot', plantilla_copilot))
            # 2. Gemini
            codigo_gemini = generar_codigo_gemini(archivo)
            estrategias.append(('Gemini', codigo_gemini))
            exito = False
            error_prev = None
            for nombre, codigo in estrategias:
                log.write(f'  Estrategia: {nombre}\n')
                print(f'  Probando estrategia: {nombre}')
                codigo_py = extraer_codigo_python(codigo)
                if not codigo_py or len(codigo_py) < 10:
                    log.write('    [ERROR] No se encontró código Python para ejecutar.\n')
                    print('    [ERROR] No se encontró código Python para ejecutar.')
                    continue
                ex, out, err = ejecutar_codigo(codigo_py, f'{nombre_base}_{nombre}')
                log.write(f'    STDOUT:\n{out}\n')
                if ex:
                    log.write('    [OK] Código ejecutado. Validando .pkl...\n')
                    print('    [OK] Código ejecutado. Validando .pkl...')
                    if validar_pkl_generado(archivo):
                        log.write('    [SUCCESS] .pkl generado correctamente.\n')
                        print('    [SUCCESS] .pkl generado correctamente.')
                        exito = True
                        break
                    else:
                        log.write('    [ERROR] No se encontró .pkl tras la ejecución.\n')
                        print('    [ERROR] No se encontró .pkl tras la ejecución.')
                        error_prev = 'No se encontró .pkl tras la ejecución.'
                else:
                    log.write(f'    [ERROR] Fallo al ejecutar código:\n{err}\n')
                    print('    [ERROR] Fallo al ejecutar código.')
                    error_prev = err
            # Si fallan ambas estrategias, reintentar con variantes Gemini
            if not exito:
                framework = detectar_framework(archivo)
                for intento in range(2):
                    log.write(f'  [RETRY] Intento alternativo Gemini #{intento+1}\n')
                    print(f'  [RETRY] Intento alternativo Gemini #{intento+1}')
                    codigo_variante = generar_codigo_gemini_con_error(archivo, error_prev, framework)
                    codigo_py = extraer_codigo_python(codigo_variante)
                    if not codigo_py or len(codigo_py) < 10:
                        log.write('    [ERROR] No se encontró código Python para ejecutar.\n')
                        print('    [ERROR] No se encontró código Python para ejecutar.')
                        continue
                    ex, out, err = ejecutar_codigo(codigo_py, f'{nombre_base}_GeminiVar{intento+1}')
                    log.write(f'    STDOUT:\n{out}\n')
                    if ex:
                        log.write('    [OK] Código ejecutado. Validando .pkl...\n')
                        print('    [OK] Código ejecutado. Validando .pkl...')
                        if validar_pkl_generado(archivo):
                            log.write('    [SUCCESS] .pkl generado correctamente.\n')
                            print('    [SUCCESS] .pkl generado correctamente.')
                            exito = True
                            break
                        else:
                            log.write('    [ERROR] No se encontró .pkl tras la ejecución.\n')
                            print('    [ERROR] No se encontró .pkl tras la ejecución.')
                            error_prev = 'No se encontró .pkl tras la ejecución.'
                    else:
                        log.write(f'    [ERROR] Fallo al ejecutar código:\n{err}\n')
                        print('    [ERROR] Fallo al ejecutar código.')
                        error_prev = err
                    if exito:
                        break
            # Si sigue fallando y es .py, intentar ejecutar el script directamente
            if not exito and archivo.suffix.lower() == '.py':
                log.write('  [RETRY] Intentando ejecutar el script .py directamente\n')
                print('  [RETRY] Intentando ejecutar el script .py directamente')
                ex, out, err = ejecutar_script_directo(archivo, nombre_base)
                log.write(f'    STDOUT:\n{out}\n')
                if ex:
                    log.write('    [OK] Script ejecutado. Validando .pkl...\n')
                    print('    [OK] Script ejecutado. Validando .pkl...')
                    if validar_pkl_generado(archivo):
                        log.write('    [SUCCESS] .pkl generado correctamente.\n')
                        print('    [SUCCESS] .pkl generado correctamente.')
                        exito = True
                    else:
                        log.write('    [ERROR] No se encontró .pkl tras la ejecución.\n')
                        print('    [ERROR] No se encontró .pkl tras la ejecución.')
                else:
                    log.write(f'    [ERROR] Fallo al ejecutar script:\n{err}\n')
                    print('    [ERROR] Fallo al ejecutar script.')
            if not exito:
                log.write('  [FAIL] Ninguna estrategia logró la conversión.\n')
                print('  [FAIL] Ninguna estrategia logró la conversión.')
            else:
                log.write('  [OK] Conversión exitosa.\n')
                print('  [OK] Conversión exitosa.')

if __name__ == '__main__':
    main()
