# MedAI

Plataforma web de apoyo clínico predictivo. Incluye sitio público, acceso restringido a médicos, asistente guiado y una ficha de revisión oncológica para mama, pulmón no microcítico y estómago.

> MedAI no diagnostica ni sustituye la evaluación de un profesional. Antes de cualquier uso asistencial se requiere validación clínica, evaluación regulatoria y controles de seguridad y privacidad.

## Revisión oncológica

El portal `/dashboard` está preparado para que un oncólogo pruebe la completitud y utilidad de una ficha anonimizada. Incluye estadio, histología, biomarcadores y procedencia del caso; muestra los campos faltantes y bloquea cualquier interpretación predictiva hasta que exista un esquema de variables, validación externa, calibración y aprobación clínica. La especificación está en `docs/oncology-mvp-spec.md`.

Las referencias clínicas visibles son NCI para biomarcadores de mama y pulmón y NCI para cáncer gástrico. Deben revisarse junto con las guías locales y el comité clínico de la institución.

## Arranque local

1. Copia `.env.example` a `.env` y configura `MEDAI_DOCTOR_ACCOUNTS` y `MEDAI_SESSION_SECRET` con valores propios.
2. Para habilitar el asistente con IA, crea una clave en [Google AI Studio](https://aistudio.google.com/app/apikey) y ponla en `GEMINI_API_KEY` o `GOOGLE_API_KEY` dentro de `.env`. El modelo configurado por defecto es `gemini-3.1-flash-lite`. Si no hay clave, funciona una guía local con respuestas frecuentes. Reinicia Next.js tras cambiar `.env`.
   La cuota gratuita de Gemini puede usar las solicitudes para mejorar los productos de Google. Por eso el asistente solo recibe la pregunta escrita, no el formulario, y está limitado a dudas de uso. No introduzcas información de pacientes ni datos identificables.
3. En una consola, inicia el servicio de modelos:

```powershell
cd predictive-pipeline/backend
..\..\.venv\Scripts\python.exe -m pip install -r requirements.txt
..\..\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

4. En otra consola, inicia la web:

```powershell
npm install
npm run dev
```

Abre `http://localhost:3000`. El portal está en `/acceso` y solamente permite cuentas declaradas en `MEDAI_DOCTOR_ACCOUNTS`.

## Modelos

Por defecto la API busca los modelos en `LOCAL_MODELS_DIR`. Para usar otra ubicación, define `MEDAI_MODELS_DIR` antes de iniciar FastAPI. La API ofrece `/health`, `/models` y `/predict`; la web llama a la última mediante una ruta autenticada y no expone los archivos de modelo al navegador.

### Demostración Kaggle WDBC para mama

El dashboard incluye un laboratorio independiente que ejecuta cinco clasificadores sobre las 30 variables del conjunto público [Breast Cancer Wisconsin Diagnostic de Kaggle](https://www.kaggle.com/datasets/uciml/breast-cancer-wisconsin-data). La tarea exacta es masa mamaria benigna frente a maligna a partir de mediciones de imágenes FNA; no consume estadio ni biomarcadores y no equivale a estimar el riesgo de una persona ni a recomendar su tratamiento.

Antes de iniciar por primera vez la API, entrena los modelos y genera la evaluación reproducible:

```powershell
.venv\Scripts\python.exe predictive-pipeline\backend\train_wdbc.py
# Al actualizar Kaggle y querer descargar su versión vigente:
.venv\Scripts\python.exe predictive-pipeline\backend\train_wdbc.py --refresh
```

El script descarga el CSV oficial de Kaggle y deja los artefactos generados (ignorados por Git) en `predictive-pipeline/backend/wdbc_data` y `predictive-pipeline/backend/wdbc_models`. Usa un holdout estratificado de 20% con semilla fija. La UI ofrece una fila de ejemplo benigna y una maligna para observar cómo cambian las cinco salidas. La métrica de ese holdout no constituye validación externa ni evidencia de desempeño para producción; los detalles están en `docs/wdbc-kaggle-demo.md`.

La API requerida es `POST /wdbc/predict`; la ruta web autenticada es `POST /api/wdbc-predict`. Para la ficha clínica convencional se mantiene separada la comprobación de completitud.

## Verificación

```powershell
npm run build
npm run test:e2e
```
