# F0+F1 — Saneamiento y Fundación Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sanear el repositorio Med-ai (sin secretos, sin huérfanos, sin duplicados) y construir la fundación del monorepo modular: catálogo metadata-driven de 12 enfermedades + autenticación + web base que renderiza el catálogo desde JSON.

**Architecture:** Monorepo modular sobre la app Next.js 14 existente: `web/` (frontend), `catalog/` (metadatos de enfermedades como fuente de verdad), `shared/` (schemas compartidos TS/JSON), `api/` (FastAPI — F2, no se toca en este plan), `db/` (PostgreSQL), `services/` (fases posteriores). El catálogo genera la UI dinámicamente: agregar enfermedad = agregar JSON. Los datos clínicos son anónimos por diseño (sin nombre, DNI ni datos identificables del paciente).

**Tech Stack:** Next.js 14 (pages router), React 18, TypeScript 5.8, PostgreSQL 16 (Docker), bcryptjs, jose (JWT), Vitest (unit tests), Playwright (E2E), Ajv (validación JSON Schema).

## Global Constraints

- **Anonimato de datos clínicos**: ninguna estructura de datos recolecta nombre, DNI, dirección o datos identificables. Los datos clínicos son anónimos por diseño.
- **Sin secretos en código**: las claves API solo viven en `.env` (ignorado por git). Prohibido hardcodear claves en cualquier archivo fuente.
- **Catálogo como fuente única**: la UI de enfermedades NO se hardcodea; se genera desde `catalog/diseases/*.json`.
- **TDD obligatorio**: cada tarea escribe el test primero, lo ve fallar, implementa, ve pasar, commitea.
- **Idiomas**: es/en/fr. Las strings de UI y del catálogo existen en los 3 idiomas.
- **Node >= 18.17** (requerido por Next 14). Comandos PowerShell 5.1 (Windows).
- **Frecuencia de commits**: un commit por tarea completada, mensajes `feat:`/`chore:`/`refactor:` en minúsculas.

---

## File Structure

```
docs/superpowers/plans/2026-08-10-f0-f1-fundacion.md    ← este plan
.gitignore                                               ← reforzado (Task 1)
.env.example                                             ← nuevo (Task 1)
(archivos huérfanos eliminados)                          ← Task 2
package.json, src/…, tsconfig.json (raíz)                ← Task 2 elimina legacy; Task 6 migra web/
web/                                                     ← app Next.js (Task 4)
  package.json, tsconfig.json, next.config.js, next-env.d.ts
  src/pages/_app.tsx                                     ← nuevo (Task 4)
  src/pages/_document.tsx                                ← nuevo (Task 4)
  src/pages/index.tsx, Landing.tsx, Blog.tsx, Contact.tsx, Tips.tsx
  src/pages/es|en|fr/diseases/*.tsx                      ← (migrados)
  src/pages/api/auth/register.ts                         ← nuevo (Task 8)
  src/pages/api/auth/login.ts                            ← nuevo (Task 8)
  src/pages/api/auth/me.ts                               ← nuevo (Task 8)
  src/pages/api/catalog/index.ts                         ← nuevo (Task 6)
  src/pages/api/catalog/[slug].ts                        ← nuevo (Task 6)
  src/components/Header.tsx, Footer.tsx, etc.            ← (migrados)
  src/contexts/LanguageContext.tsx                       ← (migrado)
  src/contexts/AuthContext.tsx                           ← nuevo (Task 9)
  src/lib/catalog.ts                                     ← nuevo (Task 6)
  src/lib/auth.ts                                        ← nuevo (Task 8)
  src/lib/db.ts                                          ← nuevo (Task 7)
shared/
  catalog.schema.json                                    ← JSON Schema (Task 3)
  catalog.types.ts                                       ← tipos TS (Task 3)
  catalog.validator.ts                                   ← Ajv validator (Task 3)
  __tests__/catalog.validator.test.ts                    ← Task 3
catalog/
  diseases/diabetes.json + 11 más                        ← Task 4
  models/registry.json                                   ← Task 4
  validation/validate.spec.ts                            ← Task 4
db/
  docker-compose.yml                                     ← Task 5
  init/001_users.sql                                     ← Task 5
```

---

### Task 1: Reforzar `.gitignore` (secretos y artefactos fuera de git)

**Files:**
- Modify: `.gitignore` (raíz)
- Create: `.env.example`

**Interfaces:**
- Consumes: nada.
- Produces: `.gitignore` que excluye `.env`, `.next/`, `LOCAL_MODELS_DIR/`, `.venv/`, logs, artefactos de corridas y `node_modules/`.

- [ ] **Step 1: Añadir reglas Node/Next y artefactos del proyecto**

Añade al final del `.gitignore` actual:

```gitignore
# Node / Next.js
node_modules/
.next/
out/

# Datos y modelos locales (pesados — fuera de git)
LOCAL_MODELS_DIR/
modelos_metadata.json
resultado_inventario.txt
gemini_models.txt
gemini_response.txt
gemini_analysis.log
reporte_gemini_copilot.txt

# Entornos (el .env ya existe; añadir variantes y plantilla)
.env.*
!.env.example

# Ledger de progreso de ejecución (scratch, no versionable)
.superpowers/
```

- [ ] **Step 2: Verificar que git ignora los archivos sensibles**

Run: `git check-ignore -v .env .next LOCAL_MODELS_DIR`
Expected: cada ruta imprime una línea con la regla que la ignora.

- [ ] **Step 3: Crear `.env.example` (plantilla sin secretos)**

```env
# Copia este archivo a .env y completa los valores. NUNCA commitees .env
DATABASE_URL=postgres://medai:medai@localhost:5432/medai
JWT_SECRET=change-me-a-32-char-random-secret
NEXT_PUBLIC_API_URL=http://localhost:8000
GEMINI_API_KEY=
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore .env.example
git commit -m "chore: reforzar .gitignore y plantilla de entorno sin secretos"
```

---

### Task 2: Eliminar huérfanos, duplicados y secretos hardcodeados

**Files:**
- Delete: `index.html`, `pages/` (17 archivos legacy), `ejemplo.py`, `gemini_test_simple.py`, `gemini_test_manual_archivo.py`, `gemini_response.txt`, `reporte_gemini_copilot.txt`, `gemini_analysis.log`, `gemini_models.txt`, `resultado_inventario.txt`, `modelos_metadata.json`, `.qodo/`
- Modify: `gemini_python.py`, `predictive-pipeline/scripts/convertir_modelos_con_gemini.py`, `predictive-pipeline/scripts/pipeline_copilot_gemini.py`, `predictive-pipeline/scripts/pipeline_conversion_iterativo.py` (quitar API key hardcodeada)
- Keep (migrar a web/ en Task 6): `src/`, `package.json`, `tsconfig.json`, `next.config.js`, `next-env.d.ts`, `predictive-pipeline/` (se revisa en F2)

**Interfaces:**
- Consumes: nada.
- Produces: repo sin la API key hardcodeada (`AIza...` filtrada) ni archivos duplicados/huérfanos.

- [ ] **Step 1: Eliminar archivos huérfanos y duplicados**

NOTA: estos archivos están UNTRACKED (el repo solo tiene `.gitignore`, `README.md` y docs commiteados), por lo que se eliminan con `Remove-Item` (no `git rm`, que fallaría):

```powershell
Remove-Item -Recurse -Force pages, index.html, ejemplo.py, gemini_test_simple.py, gemini_test_manual_archivo.py, gemini_response.txt, reporte_gemini_copilot.txt, gemini_analysis.log, gemini_models.txt, resultado_inventario.txt, modelos_metadata.json, .qodo
```

Verificar: `Test-Path pages` → `False` para cada ruta.

- [ ] **Step 2: Imprimir los archivos que aún contienen la API key**

Run: `Select-String -Path gemini_python.py,predictive-pipeline\scripts\*.py -Pattern "AIza[0-9A-Za-z_-]{30,}"`
Expected: lista de archivos con la key (los 4 del Modify).

- [ ] **Step 3: Quitar el fallback hardcodeado en cada archivo**

En cada archivo listado, reemplaza:

```python
API_KEY = os.getenv("GEMINI_API_KEY") or "<REDACTED_AIza...>"
```

por:

```python
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY no está definida. Cópiala en .env (nunca en código).")
```

- [ ] **Step 4: Verificar que la key ya no existe en el repo**

Run: `Select-String -Path *.py,predictive-pipeline\scripts\*.py -Pattern "AIza[0-9A-Za-z_-]{30,}"`
Expected: sin resultados (vacío).

- [ ] **Step 5: Baseline — commit del código existente limpio**

Como el repo solo tenía `.gitignore` + `README.md` commiteados, tras eliminar los huérfanos se hace el **primer commit del código real** (spec F0: "Commit inicial limpio"):

```bash
git add -A
git commit -m "chore: baseline del repositorio tras limpieza de huérfanos y secretos"
```

Verificar: `git status` limpio y `git log --oneline` muestra el baseline.

---

### Task 3: Schema del catálogo (JSON Schema + tipos TS + validador Ajv)

**Files:**
- Create: `shared/catalog.schema.json`
- Create: `shared/catalog.types.ts`
- Create: `shared/catalog.validator.ts`
- Create: `shared/__tests__/catalog.validator.test.ts`
- Create: `shared/package.json` (workspace compartido)
- Create: `shared/tsconfig.json`

**Interfaces:**
- Consumes: nada.
- Produces: `validateCatalog(json): ValidationResult` (función exportada) que valida un objeto de enfermedad contra el schema. Tipos `Disease`, `FormField`, `ModelRef`, `LocalizedString`. Tasks 4 y 6 consumen estos tipos y el validador.

- [ ] **Step 1: Crear `shared/package.json` y `shared/tsconfig.json`**

```json
{
  "name": "@med-ai/shared",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "ajv": "^8.12.0",
    "ajv-formats": "^2.1.1",
    "typescript": "^5.8.3",
    "vitest": "^2.0.0"
  }
}
```

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vitest/globals"]
  },
  "include": ["**/*.ts"]
}
```

- [ ] **Step 2: Escribir el test que falla (`shared/__tests__/catalog.validator.test.ts`)**

```typescript
import { describe, it, expect } from 'vitest';
import { validateCatalog } from '../catalog.validator';

const validDisease = {
  id: 'diabetes',
  slug: 'diabetes',
  name: { es: 'Diabetes', en: 'Diabetes', fr: 'Diabète' },
  description: {
    es: 'Enfermedad metabólica crónica',
    en: 'Chronic metabolic disease',
    fr: 'Maladie métabolique chronique',
  },
  inputType: 'tabular',
  fields: [
    {
      key: 'glucose',
      label: { es: 'Glucosa en ayunas', en: 'Fasting glucose', fr: 'Glycémie à jeun' },
      unit: 'mg/dL',
      type: 'number',
      min: 40,
      max: 400,
      required: true,
    },
  ],
  models: ['diabetes-logistic-v1'],
  riskThresholds: { low: 0.3, medium: 0.6 },
  demoAvailable: true,
};

describe('validateCatalog', () => {
  it('acepta una enfermedad válida', () => {
    const result = validateCatalog(validDisease);
    expect(result.valid).toBe(true);
  });

  it('rechaza una enfermedad sin campos obligatorios', () => {
    const bad = { ...validDisease, name: { es: 'Solo español' } };
    const result = validateCatalog(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rechaza un tipo de input no permitido', () => {
    const bad = { ...validDisease, inputType: 'sql' };
    const result = validateCatalog(bad);
    expect(result.valid).toBe(false);
  });

  it('rechaza un campo sin unidad ni tipo', () => {
    const bad = {
      ...validDisease,
      fields: [{ key: 'x', label: { es: 'X', en: 'X', fr: 'X' } }],
    };
    const result = validateCatalog(bad);
    expect(result.valid).toBe(false);
  });
});
```

- [ ] **Step 3: Ejecutar el test y verificar que falla**

Run: `npm test` (en `shared/`)
Expected: FAIL — `Cannot find module '../catalog.validator'`

- [ ] **Step 4: Crear `shared/catalog.schema.json` (JSON Schema)**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://med-ai.dev/schemas/catalog/disease.schema.json",
  "title": "Disease",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "slug", "name", "description", "inputType", "fields", "models", "riskThresholds", "demoAvailable"],
  "properties": {
    "id": { "type": "string", "minLength": 1 },
    "slug": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "name": { "$ref": "#/definitions/localizedString" },
    "description": { "$ref": "#/definitions/localizedString" },
    "inputType": { "enum": ["tabular", "image", "mixed"] },
    "fields": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/definitions/formField" }
    },
    "models": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string" }
    },
    "riskThresholds": {
      "type": "object",
      "required": ["low", "medium"],
      "properties": {
        "low": { "type": "number", "minimum": 0, "maximum": 1 },
        "medium": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    },
    "demoAvailable": { "type": "boolean" }
  },
  "definitions": {
    "localizedString": {
      "type": "object",
      "required": ["es", "en", "fr"],
      "properties": {
        "es": { "type": "string", "minLength": 1 },
        "en": { "type": "string", "minLength": 1 },
        "fr": { "type": "string", "minLength": 1 }
      },
      "additionalProperties": false
    },
    "formField": {
      "type": "object",
      "additionalProperties": false,
      "required": ["key", "label", "type"],
      "properties": {
        "key": { "type": "string", "pattern": "^[a-z_]+$" },
        "label": { "$ref": "#/definitions/localizedString" },
        "unit": { "type": "string" },
        "type": { "enum": ["number", "select", "boolean"] },
        "min": { "type": "number" },
        "max": { "type": "number" },
        "required": { "type": "boolean", "default": false },
        "options": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["value", "label"],
            "properties": {
              "value": { "type": "string" },
              "label": { "$ref": "#/definitions/localizedString" }
            }
          }
        }
      },
      "allOf": [
        {
          "if": { "properties": { "type": { "const": "number" } } },
          "then": { "required": ["unit"] }
        },
        {
          "if": { "properties": { "type": { "const": "select" } } },
          "then": { "required": ["options"] }
        }
      ]
    }
  }
}
```

- [ ] **Step 5: Crear `shared/catalog.types.ts`**

```typescript
export interface LocalizedString {
  es: string;
  en: string;
  fr: string;
}

export type InputType = 'tabular' | 'image' | 'mixed';

export type FieldType = 'number' | 'select' | 'boolean';

export interface SelectOption {
  value: string;
  label: LocalizedString;
}

export interface FormField {
  key: string;
  label: LocalizedString;
  unit?: string;
  type: FieldType;
  min?: number;
  max?: number;
  required?: boolean;
  options?: SelectOption[];
}

export interface Disease {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  inputType: InputType;
  fields: FormField[];
  models: string[];
  riskThresholds: { low: number; medium: number };
  demoAvailable: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

- [ ] **Step 6: Crear `shared/catalog.validator.ts`**

```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { Disease, ValidationResult } from './catalog.types';
import schema from './catalog.schema.json';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validateDisease = ajv.compile(schema);

export function validateCatalog(input: unknown): ValidationResult {
  const valid = validateDisease(input) as boolean;
  if (valid) {
    return { valid: true, errors: [] };
  }
  return {
    valid: false,
    errors: (validateDisease.errors ?? []).map(
      (e) => `${e.instancePath || '/'}: ${e.message ?? 'error de schema'}`
    ),
  };
}

export function isDisease(input: unknown): input is Disease {
  return validateCatalog(input).valid;
}
```

Nota: para importar JSON con `resolveJsonModule`, añade `"resolveJsonModule": true` al `tsconfig.json` de `shared/`.

- [ ] **Step 7: Ejecutar tests y verificar que pasan**

Run: `npm test` (en `shared/`)
Expected: PASS (4 tests)

- [ ] **Step 8: Commit**

```bash
git add shared/
git commit -m "feat: schema y validador del catálogo de enfermedades (shared)"
```

---

### Task 4: Catálogo metadata-driven — 12 enfermedades + registry + test

**Files:**
- Create: `catalog/diseases/diabetes.json` (y 11 más: stroke, heart-disease, breast-cancer, lung-cancer, liver-cancer, prostate-cancer, stomach-cancer, pancreatic-cancer, leukemia, epilepsy, chronic-kidney-disease)
- Create: `catalog/models/registry.json`
- Create: `catalog/validation/validate.spec.ts`
- Create: `catalog/package.json`

**Interfaces:**
- Consumes: `validateCatalog` y tipo `Disease` de Task 3 (import desde `../shared/catalog.validator`).
- Producen: los 12 `Disease` JSON validados + `registry.json`. Task 6 lee el catálogo vía API route.

- [ ] **Step 1: Crear `catalog/package.json`**

```json
{
  "name": "@med-ai/catalog",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "validate": "vitest run"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Crear `catalog/diseases/diabetes.json` (modelo a seguir)**

```json
{
  "id": "diabetes",
  "slug": "diabetes",
  "name": { "es": "Diabetes", "en": "Diabetes", "fr": "Diabète" },
  "description": {
    "es": "Enfermedad metabólica crónica caracterizada por niveles elevados de glucosa en sangre.",
    "en": "Chronic metabolic disease characterized by elevated blood glucose levels.",
    "fr": "Maladie métabolique chronique caractérisée par une glycémie élevée."
  },
  "inputType": "tabular",
  "fields": [
    { "key": "age", "label": { "es": "Edad", "en": "Age", "fr": "Âge" }, "unit": "años", "type": "number", "min": 18, "max": 100, "required": true },
    { "key": "bmi", "label": { "es": "Índice de masa corporal", "en": "Body mass index", "fr": "Indice de masse corporelle" }, "unit": "kg/m²", "type": "number", "min": 12, "max": 60, "required": true },
    { "key": "glucose", "label": { "es": "Glucosa en ayunas", "en": "Fasting glucose", "fr": "Glycémie à jeun" }, "unit": "mg/dL", "type": "number", "min": 40, "max": 400, "required": true },
    { "key": "blood_pressure", "label": { "es": "Presión arterial sistólica", "en": "Systolic blood pressure", "fr": "Pression artérielle systolique" }, "unit": "mmHg", "type": "number", "min": 60, "max": 250, "required": true },
    { "key": "insulin", "label": { "es": "Insulina", "en": "Insulin", "fr": "Insuline" }, "unit": "µU/mL", "type": "number", "min": 0, "max": 900, "required": true },
    { "key": "skin_thickness", "label": { "es": "Grosor del pliegue cutáneo", "en": "Skin fold thickness", "fr": "Épaisseur du pli cutané" }, "unit": "mm", "type": "number", "min": 0, "max": 100, "required": false },
    { "key": "diabetes_pedigree", "label": { "es": "Función de pedigrí diabético", "en": "Diabetes pedigree function", "fr": "Fonction de pedigree diabétique" }, "unit": "", "type": "number", "min": 0, "max": 3, "required": false }
  ],
  "models": ["diabetes-logistic-v1", "diabetes-rf-v1"],
  "riskThresholds": { "low": 0.3, "medium": 0.6 },
  "demoAvailable": true
}
```

- [ ] **Step 3: Crear los 11 archivos restantes usando el mismo patrón**

Para cada enfermedad usa los `slug`s ya existentes en la web (verificado en `src/pages/*/diseases/`): `stroke`, `heart-disease`, `breast-cancer`, `lung-cancer`, `liver-cancer`, `prostate-cancer`, `stomach-cancer`, `pancreatic-cancer`, `leukemia`, `epilepsy`, `chronic-kidney-disease`. Cada uno:

- `name`, `description` en es/en/fr (reutiliza los títulos del contenido ya traducido en `src/pages/*/diseases/*.tsx`).
- `inputType`: "tabular" para todos por ahora (los de imagen se actualizan en F2/F3).
- `fields`: 4–8 campos clínicos razonables y conocidos para la enfermedad (edad + 3–7 biomarcadores típicos con rangos plausibles).
- `models`: refiere los ids que registrarás en Step 4.
- `riskThresholds`: `{ low: 0.3, medium: 0.6 }` por defecto.
- `demoAvailable: true`.

- [ ] **Step 4: Crear `catalog/models/registry.json`**

```json
{
  "models": [
    { "id": "diabetes-logistic-v1", "disease": "diabetes", "framework": "sklearn", "file": "LOCAL_MODELS_DIR/diabetes_logistic.pkl", "status": "available" },
    { "id": "diabetes-rf-v1", "disease": "diabetes", "framework": "sklearn", "file": "LOCAL_MODELS_DIR/diabetes_rf.pkl", "status": "available" }
  ]
}
```

Nota: en F2 se completa el inventario real de los 36 `.pkl`. Aquí basta con al menos 1 modelo por enfermedad referenciado para que el catálogo sea válido.

- [ ] **Step 5: Escribir el test que valida todo el catálogo (`catalog/validation/validate.spec.ts`)**

```typescript
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateCatalog } from '../../shared/catalog.validator';

const diseasesDir = join(__dirname, '..', 'diseases');
const registryPath = join(__dirname, '..', 'models', 'registry.json');

describe('Catálogo de enfermedades', () => {
  const files = readdirSync(diseasesDir).filter((f) => f.endsWith('.json'));
  const diseases = files.map((f) => JSON.parse(readFileSync(join(diseasesDir, f), 'utf-8')));

  it('tiene exactamente 12 enfermedades', () => {
    expect(files.length).toBe(12);
  });

  it('cada enfermedad es válida contra el schema', () => {
    for (const d of diseases) {
      const result = validateCatalog(d);
      expect(result.valid, `${d.id}: ${result.errors.join('; ')}`).toBe(true);
    }
  });

  it('no hay slugs duplicados', () => {
    const slugs = diseases.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('cada modelo referenciado existe en el registry', () => {
    const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
    const modelIds = new Set(registry.models.map((m: { id: string }) => m.id));
    for (const d of diseases) {
      for (const modelId of d.models) {
        expect(modelIds.has(modelId), `${d.id} referencia ${modelId} que no está en registry`).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 6: Ejecutar tests y verificar que pasan**

Run: `npm test` (en `catalog/`)
Expected: PASS (4 tests)

- [ ] **Step 7: Commit**

```bash
git add catalog/
git commit -m "feat: catálogo metadata-driven de 12 enfermedades + registry"
```

---

### Task 5: PostgreSQL — docker-compose + tabla users

**Files:**
- Create: `db/docker-compose.yml`
- Create: `db/init/001_users.sql`

**Interfaces:**
- Consumes: nada.
- Produce: PostgreSQL 16 en Docker con tabla `users`. La capa de conexión `web/src/lib/db.ts` se crea en Task 6 (después de la migración a `web/`); Task 7 la consume.

- [ ] **Step 1: Crear `db/docker-compose.yml`**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: medai-db
    environment:
      POSTGRES_USER: medai
      POSTGRES_PASSWORD: medai
      POSTGRES_DB: medai
    ports:
      - "5432:5432"
    volumes:
      - medai_pgdata:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d
volumes:
  medai_pgdata:
```

- [ ] **Step 2: Crear `db/init/001_users.sql`**

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  language TEXT NOT NULL DEFAULT 'es',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Los datos clínicos (analyses) se almacenan de forma ANÓNIMA y separada en F2.
-- Esta tabla solo contiene credenciales de cuenta. Ningún dato clínico aquí.
```

- [ ] **Step 3: Levantar PostgreSQL**

Run: `docker compose up -d` (en `db/`)
Expected: contenedor `medai-db` corriendo.

Verificar: `docker exec medai-db psql -U medai -c "\dt"`
Expected: tabla `users` listada.

- [ ] **Step 4: Commit**

```bash
git add db/
git commit -m "feat: PostgreSQL en docker + tabla users (sin datos clínicos)"
```

---

### Task 6: Migrar la app Next.js a `web/` + API routes del catálogo

**Files:**
- Move: `src/*` → `web/src/*`, `package.json` → `web/package.json`, `tsconfig.json` → `web/tsconfig.json`, `next.config.js` → `web/next.config.js`, `next-env.d.ts` → `web/next-env.d.ts`
- Create: `web/src/pages/_app.tsx`, `web/src/pages/_document.tsx`
- Create: `web/src/pages/api/catalog/index.ts`, `web/src/pages/api/catalog/[slug].ts`
- Create: `web/src/lib/catalog.ts`
- Create: `web/src/lib/db.ts` (capa de conexión a PostgreSQL de Task 5)
- Create: `web/src/pages/diseases.tsx` (catálogo dinámico)

**Interfaces:**
- Consumes: catálogo JSON de Task 4 (`catalog/diseases/*.json`), tipos `Disease` de Task 3, y PostgreSQL de Task 5.
- Produce: `GET /api/catalog` → lista de enfermedades (sin fields internos, solo resumen); `GET /api/catalog/[slug]` → enfermedad completa. Página `/diseases` renderiza el catálogo en el idioma activo. Exporta `query<T>(sql, params): Promise<T[]>` desde `web/src/lib/db.ts` (Task 7 lo consume). Task 8 (AuthContext) y Task 9 (landing) consumen esta página.

- [ ] **Step 1: Mover la app a `web/`**

```bash
mkdir web
git mv src web/src
git mv package.json web/package.json
git mv tsconfig.json web/tsconfig.json
git mv next.config.js web/next.config.js
git mv next-env.d.ts web/next-env.d.ts
```

- [ ] **Step 2: Añadir dependencias de DB y auth a `web/package.json`**

Añade a `dependencies`:

```json
"pg": "^8.11.0",
"bcryptjs": "^2.4.3",
"jose": "^5.2.0"
```

Y a `devDependencies`:

```json
"@types/pg": "^8.10.0",
"vitest": "^2.0.0"
```

- [ ] **Step 3: Crear `web/src/lib/db.ts` (capa de conexión)**

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://medai:medai@localhost:5432/medai',
});

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await pool.query(sql, params);
  return result.rows as T[];
}
```

- [ ] **Step 4: Crear `web/src/pages/_app.tsx`**

```tsx
import React from 'react';
import type { AppProps } from 'next/app';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
```

- [ ] **Step 5: Crear `web/src/pages/_document.tsx`**

```tsx
import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

- [ ] **Step 6: Crear `web/src/lib/catalog.ts` (lectura de catálogo desde el filesystem)**

```typescript
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Disease } from '../../../shared/catalog.types';

const diseasesDir = join(process.cwd(), '..', 'catalog', 'diseases');

export function getAllDiseases(): Disease[] {
  if (!existsSync(diseasesDir)) return [];
  return readdirSync(diseasesDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(diseasesDir, f), 'utf-8')) as Disease);
}

export function getDiseaseBySlug(slug: string): Disease | undefined {
  return getAllDiseases().find((d) => d.slug === slug);
}

export function toSummary(d: Disease) {
  return {
    slug: d.slug,
    name: d.name,
    description: d.description,
    inputType: d.inputType,
    demoAvailable: d.demoAvailable,
  };
}
```

- [ ] **Step 7: Crear `web/src/pages/api/catalog/index.ts`**

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllDiseases, toSummary } from '../../../lib/catalog';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const diseases = getAllDiseases().map(toSummary);
  res.status(200).json({ diseases });
}
```

- [ ] **Step 8: Crear `web/src/pages/api/catalog/[slug].ts`**

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDiseaseBySlug } from '../../../lib/catalog';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const disease = getDiseaseBySlug(String(slug));
  if (!disease) {
    res.status(404).json({ error: 'disease not found' });
    return;
  }
  res.status(200).json(disease);
}
```

- [ ] **Step 9: Crear `web/src/pages/diseases.tsx` (catálogo dinámico)**

```tsx
import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllDiseases, toSummary } from '../lib/catalog';
import type { Disease } from '../../../shared/catalog.types';

export async function getStaticProps() {
  const diseases = getAllDiseases().map(toSummary);
  return { props: { diseases } };
}

interface Props {
  diseases: ReturnType<typeof toSummary>[];
}

const DiseasesPage: React.FC<Props> = ({ diseases }) => {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={false} />
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">
          {language === 'es' ? 'Catálogo de enfermedades' : language === 'en' ? 'Disease catalog' : 'Catalogue des maladies'}
        </h1>
        <p className="mb-8 text-gray-600">
          {language === 'es'
            ? 'Explora los modelos de predicción disponibles.'
            : language === 'en'
              ? 'Explore the available prediction models.'
              : 'Explorez les modèles de prédiction disponibles.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((d: ReturnType<typeof toSummary>) => (
            <Link key={d.slug} href={`/diseases/${d.slug}`} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
              <h2 className="text-xl font-semibold mb-2">{d.name[language]}</h2>
              <p className="text-gray-600 text-sm mb-3">{d.description[language]}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                {d.inputType}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DiseasesPage;
```

- [ ] **Step 10: Crear `web/src/pages/diseases/[slug].tsx` (demo informativa de enfermedad)**

```tsx
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';
import { getDiseaseBySlug } from '../../lib/catalog';
import type { Disease } from '../../../../shared/catalog.types';

export async function getStaticPaths() {
  const { getAllDiseases } = await import('../../lib/catalog');
  const paths = getAllDiseases().map((d: Disease) => ({ params: { slug: d.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const disease = getDiseaseBySlug(params.slug);
  if (!disease) return { notFound: true };
  return { props: { disease } };
}

interface Props {
  disease: Disease;
}

const DiseaseDetailPage: React.FC<Props> = ({ disease }) => {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={false} />
      <main className="flex-1 max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">{disease.name[language]}</h1>
        <p className="text-lg text-gray-600 mb-8">{disease.description[language]}</p>

        <h2 className="text-xl font-semibold mb-3">
          {language === 'es' ? 'Datos requeridos' : language === 'en' ? 'Required data' : 'Données requises'}
        </h2>
        <ul className="list-disc pl-6 mb-8 space-y-1">
          {disease.fields.map((f) => (
            <li key={f.key}>
              {f.label[language]} {f.unit ? `(${f.unit})` : ''}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-3">
          {language === 'es' ? 'Modelos disponibles' : language === 'en' ? 'Available models' : 'Modèles disponibles'}
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          {disease.models.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-gray-500">
          {language === 'es'
            ? 'Demo informativa. La predicción estará disponible en próximas versiones.'
            : language === 'en'
              ? 'Informational demo. Prediction will be available in upcoming versions.'
              : 'Démo informative. La prédiction sera disponible dans les prochaines versions.'}
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default DiseaseDetailPage;
```

- [ ] **Step 11: Instalar dependencias en `web/`**

Run: `npm install` (en `web/`)
Expected: instalación completada sin errores.

- [ ] **Step 12: Compilar la app**

Run: `npm run build` (en `web/`)
Expected: build exitoso. Si hay errores de tipos en los componentes migrados, corrígelos de forma mínima (ajustar props/tipos) hasta que compile.

- [ ] **Step 13: Probar las API routes localmente**

Run: `npm run dev` (en `web/`, en otra terminal) y luego:
Run: `Invoke-RestMethod http://localhost:3000/api/catalog | ConvertTo-Json -Depth 5`
Expected: JSON con los 12 diseases resumidos.

Run: `Invoke-RestMethod http://localhost:3000/api/catalog/diabetes | ConvertTo-Json -Depth 6`
Expected: JSON completo de diabetes.

- [ ] **Step 14: Commit**

```bash
git add web/
git commit -m "refactor: migrar app a web/ + API routes y páginas dinámicas de catálogo"
```

---

### Task 7: Auth API — registro, login y sesión JWT

**Files:**
- Create: `web/src/lib/auth.ts`
- Create: `web/src/pages/api/auth/register.ts`
- Create: `web/src/pages/api/auth/login.ts`
- Create: `web/src/pages/api/auth/me.ts`
- Create: `web/src/pages/register.tsx`
- Create: `web/src/pages/login.tsx`

**Interfaces:**
- Consumes: `query()` de Task 6 (`web/src/lib/db.ts`).
- Produce: `POST /api/auth/register` → `{ user: { id, email, plan, language } }`; `POST /api/auth/login` → `{ user, token }` (JWT firmado con `jose`, cookie `medai_token` httpOnly); `GET /api/auth/me` → `{ user } | 401`. Páginas `/register` y `/login`. Task 8 (AuthContext) consume el endpoint `me` y la cookie.

- [ ] **Step 1: Escribir el test del hash y token (`web/src/lib/auth.test.ts`)**

```typescript
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, createToken, verifyToken } from './auth';

describe('auth utils', () => {
  it('hashPassword produce un hash verificable', async () => {
    const hash = await hashPassword('secreto-123');
    expect(hash).not.toBe('secreto-123');
    expect(await verifyPassword('secreto-123', hash)).toBe(true);
    expect(await verifyPassword('otra', hash)).toBe(false);
  });

  it('createToken/verifyToken redondean el payload', async () => {
    const token = await createToken({ id: 'u1', email: 'a@b.c' });
    const payload = await verifyToken(token);
    expect(payload?.email).toBe('a@b.c');
    expect(payload?.id).toBe('u1');
  });

  it('verifyToken rechaza tokens inválidos', async () => {
    expect(await verifyToken('no-es-un-token')).toBeNull();
  });
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/lib/auth.test.ts` (en `web/`)
Expected: FAIL — `Cannot find module './auth'`

- [ ] **Step 3: Crear `web/src/lib/auth.ts`**

```typescript
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-only-secret-change-me';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export interface TokenPayload {
  id: string;
  email: string;
}

export async function createToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return { id: String(payload.id), email: String(payload.email) };
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `npx vitest run src/lib/auth.test.ts` (en `web/`)
Expected: PASS (3 tests)

- [ ] **Step 5: Crear `web/src/pages/api/auth/register.ts`**

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';
import { hashPassword, createToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  const { email, password, language = 'es' } = req.body ?? {};
  if (!email || !password || password.length < 8) {
    res.status(400).json({ error: 'email y contraseña (mín. 8 caracteres) son requeridos' });
    return;
  }
  const normalized = String(email).toLowerCase().trim();
  const passwordHash = await hashPassword(String(password));
  try {
    const rows = await query(
      `INSERT INTO users (email, password_hash, language) VALUES ($1, $2, $3) RETURNING id, email, plan, language`,
      [normalized, passwordHash, language]
    );
    const user = rows[0];
    const token = await createToken({ id: String(user.id), email: String(user.email) });
    res.setHeader('Set-Cookie', `medai_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`);
    res.status(201).json({ user });
  } catch {
    res.status(409).json({ error: 'el email ya está registrado' });
  }
}
```

- [ ] **Step 6: Crear `web/src/pages/api/auth/login.ts`**

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';
import { verifyPassword, createToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ error: 'email y contraseña son requeridos' });
    return;
  }
  const rows = await query(
    `SELECT id, email, password_hash, plan, language FROM users WHERE email = $1`,
    [String(email).toLowerCase().trim()]
  );
  const user = rows[0] as { id: string; email: string; password_hash: string; plan: string; language: string } | undefined;
  if (!user || !(await verifyPassword(String(password), user.password_hash))) {
    res.status(401).json({ error: 'credenciales inválidas' });
    return;
  }
  const token = await createToken({ id: user.id, email: user.email });
  res.setHeader('Set-Cookie', `medai_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`);
  res.status(200).json({ user: { id: user.id, email: user.email, plan: user.plan, language: user.language } });
}
```

- [ ] **Step 7: Crear `web/src/pages/api/auth/me.ts`**

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = (req.cookies.medai_token ?? '').toString();
  const payload = token ? await verifyToken(token) : null;
  if (!payload) {
    res.status(401).json({ error: 'no autenticado' });
    return;
  }
  const rows = await query(`SELECT id, email, plan, language FROM users WHERE id = $1`, [payload.id]);
  if (rows.length === 0) {
    res.status(401).json({ error: 'no autenticado' });
    return;
  }
  res.status(200).json({ user: rows[0] });
}
```

- [ ] **Step 8: Crear `web/src/pages/register.tsx`**

```tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const RegisterPage: React.FC = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const t = {
    es: { title: 'Crear cuenta', email: 'Email', password: 'Contraseña', submit: 'Registrarse', error: 'No se pudo registrar' },
    en: { title: 'Create account', email: 'Email', password: 'Password', submit: 'Sign up', error: 'Could not register' },
    fr: { title: 'Créer un compte', email: 'Email', password: 'Mot de passe', submit: "S'inscrire", error: "Échec de l'inscription" },
  }[language];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, language }),
    });
    if (res.ok) {
      router.push('/diseases');
    } else {
      setError(t.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={false} />
      <main className="flex-1 max-w-md mx-auto py-12 px-4 w-full">
        <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full border rounded px-3 py-2" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700">
            {t.submit}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          <Link href="/login">{language === 'es' ? '¿Ya tienes cuenta? Inicia sesión' : language === 'en' ? 'Already have an account? Log in' : 'Déjà un compte ? Connectez-vous'}</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
```

- [ ] **Step 9: Crear `web/src/pages/login.tsx`** (mismo patrón que register, con POST a `/api/auth/login` y el mismo `t` con las traducciones de login)

```tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const t = {
    es: { title: 'Iniciar sesión', submit: 'Entrar', error: 'Credenciales inválidas' },
    en: { title: 'Log in', submit: 'Sign in', error: 'Invalid credentials' },
    fr: { title: 'Connexion', submit: 'Se connecter', error: 'Identifiants invalides' },
  }[language];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push('/diseases');
    } else {
      setError(t.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={false} />
      <main className="flex-1 max-w-md mx-auto py-12 px-4 w-full">
        <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700">
            {t.submit}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          <Link href="/register">{language === 'es' ? '¿No tienes cuenta? Regístrate' : language === 'en' ? "Don't have an account? Sign up" : "Pas de compte ? Inscrivez-vous"}</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
```

- [ ] **Step 10: Ejecutar los tests de auth**

Run: `npx vitest run src/lib/auth.test.ts` (en `web/`)
Expected: PASS

- [ ] **Step 11: Probar el registro manualmente (con la DB levantada)**

Run: `npm run dev` (en `web/`) y luego:

```powershell
$body = @{ email = "test@med-ai.dev"; password = "password-123"; language = "es" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/register -ContentType "application/json" -Body $body
```

Expected: `{ user: { id, email: "test@med-ai.dev", plan: "free", language: "es" } }`

- [ ] **Step 12: Commit**

```bash
git add web/src/lib/auth.ts web/src/lib/auth.test.ts web/src/pages/api/auth web/src/pages/register.tsx web/src/pages/login.tsx
git commit -m "feat: registro, login y sesión JWT con cookie httpOnly"
```

---

### Task 8: AuthContext — sesión en el frontend

**Files:**
- Create: `web/src/contexts/AuthContext.tsx`
- Modify: `web/src/pages/_app.tsx`
- Modify: `web/src/components/Header.tsx` (usar `useAuth` en lugar de la prop `isLoggedIn` hardcodeada)

**Interfaces:**
- Consumes: `GET /api/auth/me` de Task 7.
- Produce: `AuthProvider` y hook `useAuth(): { user, loading, refresh }`. Task 9 (landing) lo usa.

- [ ] **Step 1: Crear `web/src/contexts/AuthContext.tsx`**

```tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  plan: string;
  language: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return <AuthContext.Provider value={{ user, loading, refresh }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
```

- [ ] **Step 2: Actualizar `web/src/pages/_app.tsx` para envolver con AuthProvider**

```tsx
import React from 'react';
import type { AppProps } from 'next/app';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </LanguageProvider>
  );
}
```

- [ ] **Step 3: Actualizar `web/src/components/Header.tsx`**

Lee el archivo actual y modifícalo para que use `useAuth()` en lugar de la prop `isLoggedIn`. Patrón mínimo:

```tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  return (
    <header className="bg-white shadow">
      <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">MedAI</Link>
        <div className="flex items-center gap-4">
          <Link href="/diseases" className="text-sm">{language === 'es' ? 'Enfermedades' : language === 'en' ? 'Diseases' : 'Maladies'}</Link>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
          {user ? (
            <span className="text-sm text-gray-600">{user.email}</span>
          ) : (
            <>
              <Link href="/login" className="text-sm">{language === 'es' ? 'Entrar' : language === 'en' ? 'Log in' : 'Connexion'}</Link>
              <Link href="/register" className="text-sm bg-blue-600 text-white rounded px-3 py-1.5">
                {language === 'es' ? 'Registrarse' : language === 'en' ? 'Sign up' : "S'inscrire"}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
```

Ajusta los demás usos de `Header` en las páginas migradas (quitar la prop `isLoggedIn`).

- [ ] **Step 4: Compilar**

Run: `npm run build` (en `web/`)
Expected: build exitoso.

- [ ] **Step 5: Commit**

```bash
git add web/src/contexts/AuthContext.tsx web/src/pages/_app.tsx web/src/components/Header.tsx web/src/pages
git commit -m "feat: AuthContext y Header con sesión real"
```

---

### Task 9: Landing con sesión + acceso al catálogo

**Files:**
- Modify: `web/src/pages/index.tsx`

**Interfaces:**
- Consumes: `useAuth()` de Task 8.
- Produce: landing que muestra "Registrarse / Entrar" si no hay sesión y "Ver catálogo" si la hay.

- [ ] **Step 1: Reescribir `web/src/pages/index.tsx`**

```tsx
import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();
  const { language } = useLanguage();

  const t = {
    es: {
      title: 'Bienvenido a MedAI Insight Agent',
      subtitle: 'Plataforma de asistencia médica con IA, análisis predictivo y contenido educativo en salud.',
      cta: user ? 'Ver catálogo de enfermedades' : 'Crear cuenta',
      desc: 'Explora enfermedades, conoce los modelos de predicción y prepárate para recibir informes personalizados.',
    },
    en: {
      title: 'Welcome to MedAI Insight Agent',
      subtitle: 'AI-assisted health platform with predictive analytics and health education content.',
      cta: user ? 'View disease catalog' : 'Create account',
      desc: 'Explore diseases, learn about prediction models, and get ready to receive personalized reports.',
    },
    fr: {
      title: 'Bienvenue sur MedAI Insight Agent',
      subtitle: 'Plateforme de santé assistée par IA, analyses prédictives et contenus éducatifs.',
      cta: user ? 'Voir le catalogue des maladies' : 'Créer un compte',
      desc: 'Explorez les maladies, découvrez les modèles de prédiction et préparez-vous à recevoir des rapports personnalisés.',
    },
  }[language];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg mb-8">{t.subtitle}</p>
        <div className="bg-white rounded shadow p-6 mb-8">
          <p className="mb-4">{t.desc}</p>
          {!loading && (
            <Link href={user ? '/diseases' : '/register'} className="inline-block bg-blue-600 text-white rounded px-6 py-3 font-medium hover:bg-blue-700">
              {t.cta}
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
```

- [ ] **Step 2: Compilar**

Run: `npm run build` (en `web/`)
Expected: build exitoso.

- [ ] **Step 3: Verificación manual del criterio de éxito F1**

Con `npm run dev` y la DB levantada:
1. Abrir `http://localhost:3000` → landing con CTA "Crear cuenta".
2. Registrar un usuario → redirige a `/diseases`.
3. Ver el catálogo de 12 enfermedades en español.
4. Cambiar idioma a en/fr → el catálogo se traduce.
5. Abrir `/diseases/diabetes` → demo informativa con campos y modelos.

- [ ] **Step 4: Commit**

```bash
git add web/src/pages/index.tsx
git commit -m "feat: landing con sesión y acceso al catálogo"
```

---

### Task 10: E2E Playwright — flujo completo F1

**Files:**
- Create: `web/playwright.config.ts`
- Create: `web/e2e/f1-flow.spec.ts`
- Modify: `web/package.json` (script `test:e2e`)

**Interfaces:**
- Consumes: app corriendo (`npm run dev` o build+start), DB levantada.
- Produce: test E2E que cubre: registro → catálogo → demo de enfermedad → cambio de idioma.

- [ ] **Step 1: Añadir dependencias de Playwright a `web/`**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Crear `web/playwright.config.ts`**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
```

- [ ] **Step 3: Crear `web/e2e/f1-flow.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

const uniqueEmail = `e2e-${Date.now()}@med-ai.dev`;

test('flujo F1: registro → catálogo → demo → idioma', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /MedAI/ })).toBeVisible();

  // Registro
  await page.getByRole('link', { name: /Crear cuenta|Create account|Créer un compte/ }).first().click();
  await page.getByLabel(/Email/).fill(uniqueEmail);
  await page.getByLabel(/Contraseña|Password|Mot de passe/).fill('password-123');
  await page.getByRole('button', { name: /Registrarse|Sign up|S'inscrire/ }).click();

  // Catálogo (12 enfermedades)
  await expect(page).toHaveURL(/\/diseases/);
  const cards = page.locator('main a.bg-white');
  await expect(cards).toHaveCount(12);

  // Demo de una enfermedad
  await cards.first().click();
  await expect(page.getByRole('heading', { name: /Datos requeridos|Required data|Données requises/ })).toBeVisible();
});
```

- [ ] **Step 4: Ejecutar el E2E**

Run: `npm run test:e2e` (en `web/`, con el script añadido en package.json: `"test:e2e": "playwright test"`)
Expected: PASS (1 test, flujo completo).

- [ ] **Step 5: Commit**

```bash
git add web/playwright.config.ts web/e2e web/package.json
git commit -m "test: E2E del flujo F1 (registro, catálogo, demo, idioma)"
```

---

## Criterio de aceptación F1 (verificación final)

- [ ] `git log --oneline` muestra los commits de Tasks 1–10.
- [ ] `npm run build` en `web/` compila sin errores.
- [ ] `npx vitest run` en `shared/` y `catalog/` pasan (8 tests).
- [ ] `npx vitest run src/lib/auth.test.ts` en `web/` pasa (3 tests).
- [ ] `npm run test:e2e` en `web/` pasa (1 test).
- [ ] Un usuario real se registra, ve el catálogo de 12 enfermedades en 3 idiomas generado 100% desde `catalog/diseases/*.json`, y abre la demo informativa de cualquier enfermedad.
- [ ] `git grep -r "AIza[0-9A-Za-z_-]{30,}"` no devuelve resultados (key eliminada).
- [ ] No existen archivos huérfanos (index.html, pages/ legacy, ejemplo.py, logs de corridas).

## Siguiente fase (fuera de este plan)

- F2 — Inferencia: FastAPI real en `api/`, loaders de `.pkl`, `POST /predict/{disease}` (usa el registry de Task 4).
- F3 — Chat híbrido: motor de reglas + Gemini.
- F4 — Informes PDF + email.
- F5 — Suscripción $50/mes + planes sociales.
- F6 — RAG de recomendaciones con estudios recientes.
