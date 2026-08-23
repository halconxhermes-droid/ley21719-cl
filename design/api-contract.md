# API Contract — Ley 21.719 Web Educativa

Contrato REST para comunicación Frontend ↔ Backend. Todas las respuestas en JSON. Base path: `/api/v1`.

---

## 1. Módulos y Contenido

### GET `/api/modules`

**Lista de módulos educativos ordenados**

#### Response 200
```json
{
  "modules": [
    {
      "id": "modulo-1",
      "title": "Principios y alcance",
      "slug": "principios-alcance",
      "order": 1,
      "estimatedMinutes": { "summary": 3, "friendly": 15, "legal": 25 },
      "description": "Principios rectores, ámbito de aplicación y definiciones clave"
    }
  ],
  "total": 8
}
```

---

### GET `/api/modules/{id}`

**Contenido completo de un módulo por ID (3 niveles)**

#### Response 200
```json
{
  "module": {
    "id": "modulo-1",
    "title": "Principios y alcance",
    "slug": "principios-alcance",
    "order": 1,
    "levels": {
      "summary": {
        "title": "Resumen ejecutivo",
        "estimatedMinutes": 3,
        "bullets": [
          "La ley establece 8 principios rectores...",
          "Aplica a todo tratamiento de datos en Chile..."
        ],
        "keyTerms": ["dato personal", "tratamiento", "titular"]
      },
      "friendly": {
        "title": "Explicación amigable",
        "estimatedMinutes": 15,
        "sections": [
          {
            "heading": "¿Qué son los principios rectores?",
            "content": "Los principios son las reglas de juego...",
            "scenarios": [
              {
                "title": "¿Qué pasa si una empresa ignora el principio de finalidad?",
                "content": "Se expone a sanciones..."
              }
            ],
            "keyFacts": [
              { "icon": "pin", "text": "Art. 4 define 8 principios obligatorios" }
            ]
          }
        ],
        "glossaryTerms": ["dato personal", "tratamiento", "titular", "responsable"]
      },
      "legal": {
        "title": "Texto legal completo",
        "articles": [
          {
            "number": "Artículo 4",
            "title": "Principios rectores",
            "text": "El tratamiento de datos personales se ajustará a los siguientes principios..."
          }
        ]
      }
    }
  }
}
```

---

## 2. Quizzes

### GET `/api/quizzes/{module_id}`

**Preguntas del quiz de un módulo (SIN respuestas correctas expuestas)**

#### Response 200
```json
{
  "quiz": {
    "moduleId": "modulo-1",
    "questions": [
      {
        "id": "q1",
        "text": "¿Cuál de los siguientes NO es un principio rector?",
        "options": [
          { "id": 0, "text": "Licitud y lealtad" },
          { "id": 1, "text": "Finalidad" },
          { "id": 2, "text": "Rentabilidad del tratamiento" },
          { "id": 3, "text": "Proporcionalidad" }
        ],
        "explanation": "La rentabilidad no es un principio. Los 8 principios están en Art. 4."
      }
    ],
    "totalQuestions": 5
  }
}
```

---

### POST `/api/quizzes/{module_id}/submit`

**Enviar respuestas y obtener resultado con feedback**

#### Request
```json
{
  "answers": [2, 0, 1, 3, 1]
}
```

#### Response 200
```json
{
  "result": {
    "score": 4,
    "total": 5,
    "passed": true,
    "correctIndices": [0, 1, 3, 4],
    "explanations": [
      { "questionId": "q1", "correctIndex": 0, "explanation": "La rentabilidad no es principio..." },
      { "questionId": "q2", "correctIndex": 1, "explanation": "..." },
      { "questionId": "q3", "correctIndex": 1, "explanation": "..." },
      { "questionId": "q4", "correctIndex": 3, "explanation": "..." },
      { "questionId": "q5", "correctIndex": 1, "explanation": "..." }
    ]
  }
}
```

---

## 3. Checklist por Rol

### GET `/api/checklist/{rol}`

**Obtener checklist personalizado para un rol**

Roles válidos: `empresas`, `ciudadanos`, `desarrolladores`, `instituciones-publicas`

#### Response 200
```json
{
  "checklist": {
    "role": "empresas",
    "sections": [
      {
        "id": "gobernanza",
        "title": "Gobernanza y políticas",
        "order": 1,
        "items": [
          {
            "id": "item-1",
            "text": "Política de privacidad publicada y accesible",
            "legalRef": "Art. 19 Ley 21.719",
            "guideUrl": "/guia/politica-privacidad",
            "completed": true
          }
        ]
      }
    ],
    "progress": { "completed": 7, "total": 12, "percentage": 58 }
  }
}
```

---

### POST `/api/checklist/{rol}`

**Guardar/actualizar progreso del checklist**

#### Request
```json
{
  "items": [
    { "id": "item-1", "completed": true },
    { "id": "item-2", "completed": false }
  ]
}
```

#### Response 200
```json
{
  "checklist": {
    "role": "empresas",
    "progress": { "completed": 8, "total": 12, "percentage": 67 }
  }
}
```

---

## 4. Glosario

### GET `/api/glossary`

**Lista completa de términos o búsqueda**

#### Query Params
| Param | Tipo | Descripción |
|-------|------|-------------|
| `q` | string | Búsqueda libre (término o definición) |
| `category` | string | Filtrar por categoría (ej: "tecnica", "juridica") |
| `letter` | string | Filtrar por inicial (A-Z) |

#### Response 200
```json
{
  "terms": [
    {
      "id": "anonimizacion",
      "term": "Anonimización",
      "definition": "Proceso mediante el cual los datos personales dejan de estar asociados a un titular identificado o identificable, de forma irreversible.",
      "category": "tecnica",
      "legalRef": "Art. 2 letra a)",
      "relatedTerms": ["seudonimizacion", "dato-personal", "tratamiento"]
    }
  ],
  "total": 47
}
```

---

### GET `/api/glossary/{termId}`

**Definición detallada de un término**

#### Response 200
```json
{
  "term": {
    "id": "anonimizacion",
    "term": "Anonimización",
    "definition": "Proceso mediante el cual...",
    "category": "tecnica",
    "legalRef": "Art. 2 letra a)",
    "relatedTerms": [
      { "id": "seudonimizacion", "term": "Seudonimización" },
      { "id": "dato-personal", "term": "Dato personal" }
    ]
  }
}
```

---

## 5. Test Final

### GET `/api/final-test`

**Preguntas del test final (10 preguntas, SIN respuestas correctas)**

#### Response 200
```json
{
  "test": {
    "questions": [
      {
        "id": "ft-1",
        "moduleId": "modulo-3",
        "text": "¿Cuál es el plazo máximo para notificar una brecha de seguridad a la autoridad?",
        "options": [
          { "id": 0, "text": "24 horas" },
          { "id": 1, "text": "72 horas" },
          { "id": 2, "text": "5 días hábiles" },
          { "id": 3, "text": "30 días corridos" }
        ]
      }
    ],
    "totalQuestions": 10,
    "passThreshold": 70
  }
}
```

---

### POST `/api/final-test/submit`

**Enviar test final**

#### Request
```json
{ "answers": [1, 0, 2, 3, 1, 0, 2, 1, 3, 0] }
```

#### Response 200
```json
{
  "result": {
    "score": 8,
    "total": 10,
    "percentage": 80,
    "passed": true,
    "detailByModule": [
      { "moduleId": "modulo-1", "correct": 2, "total": 2, "percentage": 100 },
      { "moduleId": "modulo-3", "correct": 1, "total": 2, "percentage": 50 }
    ],
    "certificateEligible": true
  }
}
```

---

## 6. Códigos de Error Estándar

| Código HTTP | Código Error | Descripción |
|-------------|--------------|-------------|
| 400 | `VALIDATION_ERROR` | Payload inválido (campos faltantes, tipos incorrectos) |
| 404 | `NOT_FOUND` | Recurso no existe (módulo, quiz, término) |
| 409 | `CONFLICT` | Estado inconsistente (ej. quiz ya enviado) |
| 422 | `UNPROCESSABLE_ENTITY` | Reglas de negocio violadas |
| 500 | `INTERNAL_ERROR` | Error interno del servidor |

### Formato de Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo 'answers' es requerido y debe ser array de enteros",
    "details": { "field": "answers", "expected": "int[]" }
  }
}
```

---

## 7. Versionado y Compatibilidad

- Versión actual: `v1` en path (`/api/v1/...`)
- Cambios *breaking* requieren nueva versión (`/api/v2/`)
- Cambios *non-breaking* (campos nuevos opcionales) se añaden en v1

---

## 8. Autenticación (Futuro)

Actualmente abierto (público). Para progreso persistente por usuario:
- `Authorization: Bearer <jwt>` → user-scoped checklist/progreso
- Endpoints `POST /checklist`, `POST /quizzes/*/submit` requerirán auth cuando exista cuentas