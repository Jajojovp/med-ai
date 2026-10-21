import os
import subprocess
from pathlib import Path
import json

# Directorio raíz de análisis predictivos
ROOT = Path('../../MEDICO/Analisis predictivos/')
# Archivo para registrar archivos en cuarentena
QUARANTINE_FILE = ROOT / 'quarantine_zip.json'

# Buscar todos los archivos zip en subdirectorios
zips = list(ROOT.rglob('*.zip'))

# Cargar/quitar archivos en cuarentena
if QUARANTINE_FILE.exists():
    with open(QUARANTINE_FILE, 'r', encoding='utf-8') as f:
        quarantine = json.load(f)
else:
    quarantine = {}

for zip_path in zips:
    zip_str = str(zip_path.resolve())
    if quarantine.get(zip_str, 0) >= 2:
        print(f"[CUARENTENA] Saltando {zip_path}")
        continue
    out_dir = zip_path.with_suffix('')
    try:
        print(f"Extrayendo {zip_path} ...")
        subprocess.run([
            'powershell', '-Command',
            f"Expand-Archive -Force '{zip_path}' '{out_dir}'"
        ], check=True)
        print(f"[OK] {zip_path}")
        quarantine.pop(zip_str, None)  # Si fue exitoso, quitar de cuarentena
    except Exception as e:
        print(f"[ERROR] {zip_path}: {e}")
        quarantine[zip_str] = quarantine.get(zip_str, 0) + 1
        if quarantine[zip_str] >= 2:
            print(f"[CUARENTENA] {zip_path} marcado tras 2 errores.")
    # Guardar estado de cuarentena tras cada intento
    with open(QUARANTINE_FILE, 'w', encoding='utf-8') as f:
        json.dump(quarantine, f, indent=2)

print("Extracción masiva finalizada. Archivos problemáticos en cuarentena si corresponde.")
