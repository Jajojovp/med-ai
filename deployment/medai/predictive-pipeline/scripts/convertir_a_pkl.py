import os
import zipfile
import logging

# Usar constantes en mayúsculas para mejorar la legibilidad
ANALISIS_DIR = "../../MEDICO/Analisis predictivos/"
RESULT_FILE = "resultado_inventario.txt"

# Usar logging para un mejor manejo de errores y registro
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def procesar_archivo(file_path):
    """Procesa un archivo individual, manejando excepciones específicas."""
    try:
        if file_path.endswith(".zip"):
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                test_result = zip_ref.testzip()
                if test_result:
                    logging.error(f"ZIP dañado: {file_path}, error: {test_result}")
                    return f"ZIP FALLIDO: {file_path}, Error: {test_result}"  #Información más detallada
                else:
                    return f"ZIP OK: {file_path}"
        else:
            return f"ARCHIVO: {file_path}"
    except zipfile.BadZipFile as e:
        logging.error(f"Archivo ZIP corrupto: {file_path}, error: {e}")
        return f"ZIP FALLIDO: {file_path}, Error: {e}"
    except Exception as e:
        logging.exception(f"Error procesando el archivo {file_path}: {e}") # Registra el traceback completo
        return f"ERROR: {file_path}, Error: {e}"

if __name__ == "__main__":  # Mejor práctica para evitar ejecución accidental al importar
    resultados = []
    for root, _, files in os.walk(ANALISIS_DIR): # dirs no se usa, por lo que se puede omitir
        for file in files:
            file_path = os.path.join(root, file)
            resultados.append(procesar_archivo(file_path))


    with open(RESULT_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(resultados) + '\n')

    logging.info(f"Inventario completado. Resultado en {RESULT_FILE}")

