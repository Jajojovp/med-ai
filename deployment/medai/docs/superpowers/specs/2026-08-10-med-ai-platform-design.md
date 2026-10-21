# Design Doc — Med-ai Platform

**Fecha**: 2026-08-10
**Estado**: Aprobado por el usuario (brainstorming completo)
**Autor**: Executive Orchestrator (orquestación del diseño)

---

## 1. Visión del producto

Plataforma SaaS de salud donde los usuarios:

1. Ven qué se puede hacer (catálogo de enfermedades con demos de modelos entrenados).
2. Chatean con un asistente guiado que les indica qué datos y qué modelos usar según la enfermedad.
3. Cargan datos de exámenes médicos (formularios guiados y/o imágenes, según la enfermedad).
4. Reciben por email un **informe completo**: resultado de cada modelo, probabilidad, explicación del *porqué* tiene o no la enfermedad, y recomendaciones basadas en estudios y análisis médicos recientes.
5. Acceden a su historial de informes en un dashboard.

**Propósito social**: reducir los tiempos de espera de diagnóstico (que pueden durar años o costar la vida) entregando una primera evaluación accesible, con acceso gratuito/discriminado por condición socioeconómica y para misiones humanitarias.

---

## 2. Decisiones de producto (brainstorming — 2026-08-10)

| # | Decisión | Opción elegida |
|---|----------|----------------|
| 1 | Posicionamiento | **C — Híbrido por etapas**: lanzar como herramienta informativa con disclaimers, evolucionar a screening con los modelos mejor calificados (Kaggle) previa validación clínica |
| 2 | Datos de entrada | **C — Mixto**: formularios guiados para unas enfermedades, carga de imágenes para otras, ambos cuando aplique |
| 3 | Mapeo de enfermedades | **No mapeado aún** → arquitectura metadata-driven flexible que soporte todas las combinaciones (tabular/imagen/mixto) |
| 4 | Usuarios | **B — Cuenta con registro** (email/contraseña o Google) con historial de informes y datos de interés (CRM/lead) |
| 5 | Monetización | **Freemium + suscripción $50/mes** con cupo de análisis mensual; período de prueba gratuito; **planes sociales** (convenios, descuentos socioeconómicos, caridad/misiones) |
| 6 | Privacidad/regulatorio | **GDPR + HIPAA** como marco desde el inicio, con **principio de anonimato**: los datos clínicos pedidos y almacenados son anónimos (sin nombre, DNI, dirección, ni datos identificables del paciente) |
| 7 | Informe | **C — Ambos**: PDF descargable (entregable serio, llevable al médico) + dashboard interactivo + email con resumen |
| 8 | Chat | **C — Híbrido**: árbol de reglas determinista controla estructura (qué enfermedad/formulario/modelo); LLM (Gemini) solo redacta respuestas amigables |

---

## 3. Arquitectura (aprobada: Opción 1 — Monorepo modular)

```
Med-ai/
├── web/                    → Next.js 14 (frontend)
│   ├── pages/              → Landing, catálogo, /chat/[disease], /dashboard, /auth, /planes
│   ├── components/         → ChatWidget, DiseaseCatalog, DynamicForm, ResultCards,
│   │   │                     ReportViewer, SubscriptionGate
│   ├── contexts/           → LanguageContext (es/en/fr), AuthContext
│   └── services/           → API client, auth client
├── api/                    → FastAPI (servicio de inferencia — REHACE backend/main.py)
│   ├── main.py             → endpoints: /health, /models, /predict/{disease}
│   ├── loaders/            → carga de .pkl tabulares + clasificadores de imagen (CNN)
│   ├── schemas/            → modelos Pydantic (validación estricta de entrada)
│   └── services/           → lógica de predicción, scoring multi-modelo
├── catalog/                → ⭐ Corazón metadata-driven (fuente de verdad)
│   ├── diseases/*.json     → 12 enfermedades: campos, tipo (tabular/imagen/mixto),
│   │                          modelos usados, umbrales, idiomas (es/en/fr)
│   └── models/registry.json→ registro de .pkl disponibles + dependencias
├── shared/                 → Tipos TypeScript + esquemas Pydantic (fuente única)
├── services/               → auth, suscripciones, generador PDF, email
│   └── report/             → informe: resultados → explicación → recomendaciones (RAG)
└── db/                     → PostgreSQL: users, subscriptions, analyses (anónimos), reports
```

### Principios rectores

- **Catálogo como fuente de verdad**: cada enfermedad es un JSON que declara inputs, modelos e interpretación. Agregar enfermedad = agregar JSON, sin tocar código.
- **Separación cuenta ↔ datos clínicos**: `users` (email) nunca se cruza con `analyses` (datos anónimos). Cada análisis tiene un ID interno sin vínculo reversible. Principio de anonimato.
- **Límites claros**: `web` nunca carga `.pkl`; `api` nunca renderiza UI; `catalog` no depende de nadie.
- **Regla de oro del chat**: Gemini **nunca decide** qué modelo usar ni interpreta resultados — solo redacta. Las decisiones críticas son del motor de reglas.

### Fases de implementación

| Fase | Alcance | Subsistemas |
|------|---------|-------------|
| **F0 — Saneamiento** | Rotar API key filtrada, eliminar huérfanos/duplicados, reforzar .gitignore, commit limpio | — |
| **F1 — Fundación** | Monorepo, schema catálogo + 12 enfermedades (metadata), auth/registro, web base, DB | A, C(parcial) |
| **F2 — Inferencia** | FastAPI real, loaders, /predict/{disease}, validación, 36 .pkl | D |
| **F3 — Chat híbrido** | Árbol de reglas + Gemini (redacción), formularios dinámicos | B |
| **F4 — Informes** | Generador PDF + dashboard + email (resumen + enlace) | E |
| **F5 — Monetización** | Suscripción $50/mes, cupo mensual, planes sociales/caridad | F(negocio) |
| **F6 — Recomendaciones** | RAG con estudios recientes (PubMed/medRxiv) por enfermedad | F(contenido) |

---

## 4. Flujo de datos (viaje completo del usuario)

### 4.1 Registro
Usuario → `/auth` (email+contraseña o Google) → AuthContext → JWT/session → tabla `users {id, email, plan, idioma, fecha_registro}`. El idioma del informe se hereda del perfil (es/en/fr).

### 4.2 Exploración del catálogo
Landing → catálogo → `web/pages/diseases` → `catalog/diseases/{slug}.json` → renderiza tarjeta de enfermedad (qué es, qué datos pide, demo). UI generada dinámicamente desde el catálogo.

### 4.3 Chat guiado (híbrido)
1. **Motor de reglas (determinista)**: valida enfermedad, campos del JSON, modelo a usar → estructura la conversación.
2. **Gemini (redacción)**: recibe contexto estructurado y redacta respuesta amigable ("Muy bien, para evaluar tu riesgo de diabetes necesito estos 8 valores...").
3. Desambiguación de síntomas → reglas sugieren enfermedad → Gemini confirma.
- Una llamada a Gemini por turno, con límite de tokens y rate limiting.

### 4.4 Entrada de datos (mixto)
```
JSON {input_type: "tabular" | "image" | "mixed"}
Tabular → DynamicForm autogenerado (campos, unidades, validación, rangos)
Image   → componente drag & drop → validación formato/tamaño
Mixed   → ambos
```

### 4.5 Predicción
```
web/services → POST api:8000/predict/{disease}
→ FastAPI main.py → valida payload (Pydantic shared) → loaders cargan .pkl
→ imagen: clasificador CNN (carga en caliente primera vez)
→ scoring multi-modelo (cada enfermedad puede tener N modelos)
→ respuesta: {disease, scores: [{model, probability, risk_level}], timestamp}
```
Modelos cargados en memoria al arranque (o lazy con caché), timeout y manejo de errores por modelo.

### 4.6 Guardado anónimo + informe
1. `analyses {analysis_id, disease, inputs_anonimos, scores, created_at}` — sin vínculo al user_id; tabla intermedia solo para historial del dashboard.
2. Generador de informe:
   - Resultados: tabla por modelo (probabilidad, nivel de riesgo)
   - Explicación: por qué ese resultado (peso de inputs, interpretabilidad)
   - Recomendaciones: RAG → estudios recientes (PubMed/medRxiv) de la enfermedad
3. PDF server-side (plantilla profesional, idioma del usuario) → storage.
4. Email (Resend/SendGrid): "Tu informe está listo" → resumen + enlace al dashboard.

### 4.7 Dashboard + suscripción
```
/dashboard → lista de análisis → informe interactivo + descarga PDF

FREE      → cupo de prueba (ej: 3 análisis) → paywall → planes
$50/mes   → cupo mensual (ej: 20 análisis) → contador reset mensual
Plan social → acreditación (profesional en misión / comunidad) → descuento o gratis
```
Límite verificado **antes** de ejecutar la predicción.

### 4.8 Manejo de errores

| Caso | Comportamiento |
|------|----------------|
| Input inválido (fuera de rango) | Pydantic/zod rechaza con mensaje claro |
| Modelo no cargado / .pkl corrupto | 503 + alerta al equipo (observabilidad) |
| Límite de análisis agotado | Paywall elegante → planes |
| Gemini falla | Fallback a plantillas estáticas (chat sigue funcionando) |
| Email falla | Reintento con cola (3 intentos); informe siempre en dashboard |
| Servicio api caído | web muestra estado degradado |

---

## 5. Testing y QA

| Capa | Tipo de prueba | Qué valida |
|------|---------------|------------|
| Catálogo | Unit (JSON schema) | Cada diseases/*.json cumple schema; modelos referenciados existen en registry |
| API inferencia | Unit + Integration (pytest) | Pydantic rechaza inválidos; /predict devuelve scores correctos |
| Modelos | Model regression tests | .pkl devuelven mismo resultado que en entrenamiento (drift) |
| Chat | Unit (reglas) + Integration (Gemini mock) | Reglas sugieren formulario correcto; Gemini solo redacta |
| Web | Component + E2E (Playwright) | Registro → catálogo → chat → formulario → resultado → dashboard → PDF |
| Pagos | Integration (sandbox) | Suscripción, cupo, planes sociales, límite |
| Seguridad | Security review | Anonimato real (auditoría análisis↔users), secretos solo .env, GDPR/HIPAA |
| Rendimiento | Load test básico | Latencia de predicción; carga de modelos en memoria |

**Gates**: cada fase termina con auditoría de `validation-audit-engineer` antes de pasar a la siguiente.

---

## 6. Fases de arranque en detalle

### F0 — Saneamiento previo (crítico)
- Rotar API key hardcodeada en 6 archivos (key filtrada − rotada y eliminada el 2026-08-10).
- Eliminar huérfanos: `index.html`, `pages/` legacy, `ejemplo.py`, duplicados de inventario (6 copias), placeholders vacíos, artefactos de corridas.
- Reforzar `.gitignore`: `.next/`, `LOCAL_MODELS_DIR/`, `.env`, `.venv/`, logs.
- Commit inicial limpio.
- Agentes: `security-engineer`, `full-stack-engineer`, `qa-engineer`.

### F1 — Fundación del monorepo
1. Schema del catálogo (`shared/schemas`): campos, tipos de input, rangos, unidades, modelos, idiomas.
2. 12 `diseases/*.json` iniciales (datos de la web actual: diabetes, stroke, cánceres, epilepsia...).
3. Auth: registro/login (email+contraseña + Google), JWT, `users` en PostgreSQL.
4. Web base: landing + catálogo dinámico (es/en/fr con LanguageContext existente).
5. DB: migraciones (users, analyses, subscriptions).
- Agentes: `software-architect`, `full-stack-engineer`, `database-administrator`, `security-engineer`, `qa-engineer`.

**Criterio de éxito F1**: un usuario se registra, ve el catálogo de 12 enfermedades en 3 idiomas generado 100% desde el catálogo, y puede ver la demo informativa de cualquier enfermedad.

---

## 7. Riesgos y notas

- **Regulatorio**: el matiz de seudonimización (email del usuario vinculado a sus análisis) exige separación lógica estricta cuenta↔datos clínicos y políticas de retención.
- **Validación clínica**: antes de evolucionar de informativo a screening (F5+), los modelos deben validarse clínicamente (métricas sobre datasets reales, documentación de umbrales).
- **RAG médico**: las recomendaciones citan estudios recientes; se requiere control de calidad de fuentes y fecha de vigencia.
- **Costos Gemini**: el chat híbrido limita llamadas a 1 por turno con rate limiting para controlar costos.

---

## 8. Pendientes / próximo paso

- [ ] Revisión del spec por el usuario.
- [ ] Invocar `writing-plans` para el plan de implementación (empezando por F0/F1).
- [ ] Definir los 12 slugs de enfermedades del catálogo inicial.
- [ ] Inventariar los 36 `.pkl` y su framework/dependencias para el registry.
