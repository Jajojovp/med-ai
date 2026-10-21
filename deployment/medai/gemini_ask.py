import os
import sys
import subprocess
import logging
from dotenv import load_dotenv, find_dotenv

# Carga .env para acceso a Gemini CLI
load_dotenv(find_dotenv())

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Intenta encontrar el ejecutable de Gemini CLI
GEMINI_EXEC = os.environ.get('GEMINI_CLI_PATH', 'gemini')  # Permite definir ruta en .env

def gemini_cli_disponible():
    try:
        result = subprocess.run([GEMINI_EXEC, '--help'], capture_output=True, text=True)
        return result.returncode == 0 or 'usage' in result.stdout.lower()
    except Exception as e:
        logging.error(f"No se encontró Gemini CLI: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python gemini_ask.py 'pregunta' 'ruta_al_archivo'", file=sys.stderr)
        sys.exit(1)
    pregunta = sys.argv[1]
    archivo = sys.argv[2]
    if not gemini_cli_disponible():
        print("[ERROR] Gemini CLI no está disponible. Define GEMINI_CLI_PATH en tu .env si es necesario.", file=sys.stderr)
        sys.exit(2)
    try:
        result = subprocess.run([
            GEMINI_EXEC, 'ask', '--file', archivo, pregunta
        ], capture_output=True, text=True)
        print(result.stdout)
        with open(f"{os.path.splitext(os.path.basename(archivo))[0]}_gemini_response.txt", 'w', encoding='utf-8') as f:
            f.write(result.stdout)
        if result.stderr:
            logging.error(result.stderr)
    except Exception as e:
        logging.error(f"Error ejecutando Gemini CLI: {e}")
        sys.exit(3)

