# Predictive Pipeline: Proyecto de Integración de Modelos Predictivos

Este proyecto automatiza la integración de modelos predictivos desde recursos médicos, siguiendo un flujo resiliente con apoyo de Gemini CLI y Copilot.

## Estructura
- `scripts/`: Scripts de inventario, conversión y automatización.
- `resultado_inventario.txt`: Resultado del inventario de modelos y zips.
- `.vscode/tasks.json`: Tareas para ejecutar cada fase desde VS Code.
- `backend/`: (Próximamente) API predictiva con FastAPI.
- `frontend/`: (Próximamente) Servicios y formularios para consumir la API.

## Flujo de trabajo
1. **Inventario**: Ejecuta la tarea `Inventariar modelos predictivos` para listar y validar los recursos.
2. **Consulta a Gemini**: Si hay fallos, ejecuta la tarea `Consultar fallos con Gemini` para recibir orientación.
3. **Conversión y estandarización**: Scripts para convertir modelos a `.pkl` y documentar inputs/outputs.
4. **Backend predictivo**: API para servir los modelos y recibir datos clínicos.
5. **Integración frontend**: Formularios y visualización de resultados.

## Ejecución rápida
- Abre la paleta de comandos (Ctrl+Shift+P) y ejecuta `Tareas: Ejecutar tarea`.
- Selecciona `Inventariar modelos predictivos`.
- Si hay errores, ejecuta `Consultar fallos con Gemini`.

## Requisitos
- Python 3.x
- Gemini CLI instalado y autenticado

## Extensión y automatización del pipeline

### Agregar o actualizar modelos
1. Coloca los nuevos scripts o datasets en `MEDICO/Analisis predictivos/`.
2. Ejecuta el pipeline completo:
   ```bash
   python predictive-pipeline/run_pipeline.py
   ```
3. Si hay errores con ZIPs, consulta a Gemini usando la tarea de VS Code.
4. Los modelos `.pkl` y metadatos se actualizarán automáticamente.
5. El backend y frontend detectarán los nuevos modelos y campos.

### Extender frontend/backend
- Para nuevas enfermedades, solo asegúrate de que el nombre del modelo y los campos estén en `modelos_metadata.json`.
- Usa el componente `DiseasePredictForm` pasando el nombre y los campos requeridos.
- El backend crea endpoints automáticamente por cada modelo.

### Ejemplo de integración rápida
```tsx
<DiseasePredictForm disease="nueva_enfermedad" inputFields={["campo1", "campo2", ...]} />
```

---

Este flujo permite avanzar de forma autónoma y resiliente, consultando a Gemini cuando sea necesario y documentando cada paso.
