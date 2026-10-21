import os
import re
import sys
import traceback
from pathlib import Path
import subprocess

MODELOS_PKL_DIR = Path('../../MEDICO/modelos_pkl/')
LOG_FILE = MODELOS_PKL_DIR / 'conversion_log.txt'

# Regex para extraer bloques de código Python de los archivos de instrucciones
def extraer_codigo_python(texto):
    # Busca bloques markdown
    bloques = re.findall(r'```python(.*?)```', texto, re.DOTALL | re.IGNORECASE)
    if bloques:
        return bloques[0].strip()
    # Si no hay bloque markdown, intenta extraer líneas de código directo
    lineas = [l for l in texto.splitlines() if l.strip() and not l.strip().startswith('#')]
    return '\n'.join(lineas)

def ejecutar_codigo(codigo, nombre_archivo):
    script_temp = MODELOS_PKL_DIR / f'_temp_{nombre_archivo}.py'
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

def main():
    archivos = list(MODELOS_PKL_DIR.glob('*_to_pkl_gemini.txt')) + list(MODELOS_PKL_DIR.glob('*_to_pkl_copilot.txt'))
    with open(LOG_FILE, 'w', encoding='utf-8') as log:
        for archivo in archivos:
            log.write(f'Procesando {archivo.name}\n')
            print(f'Procesando {archivo.name}...')
            with open(archivo, 'r', encoding='utf-8') as f:
                texto = f.read()
            codigo = extraer_codigo_python(texto)
            if not codigo or len(codigo) < 10:
                log.write('  [ERROR] No se encontró código Python para ejecutar.\n')
                print('  [ERROR] No se encontró código Python para ejecutar.')
                continue
            exito, salida, error = ejecutar_codigo(codigo, archivo.stem)
            if exito:
                log.write('  [OK] Conversión ejecutada correctamente.\n')
                print('  [OK] Conversión ejecutada correctamente.')
            else:
                log.write(f'  [ERROR] Fallo al ejecutar conversión:\n{error}\n')
                print('  [ERROR] Fallo al ejecutar conversión. Ver log.')
            if salida:
                log.write(f'  [SALIDA]\n{salida}\n')
    print(f'Proceso completado. Revisa el log en {LOG_FILE}')

if __name__ == '__main__':
    main()
