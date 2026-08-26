-- Schema PostgreSQL para Ley 21.719
-- Equivalente al esquema SQLite original

CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    ordering INTEGER NOT NULL,
    description TEXT NOT NULL,
    levels_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quizzes (
    module_id TEXT PRIMARY KEY,
    questions_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS glossary (
    id TEXT PRIMARY KEY,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    category TEXT,
    legal_ref TEXT,
    related_terms_json TEXT
);

CREATE TABLE IF NOT EXISTS checklist_items (
    role TEXT NOT NULL,
    section_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    item_order INTEGER NOT NULL,
    text TEXT NOT NULL,
    legal_ref TEXT,
    guide_url TEXT,
    PRIMARY KEY (role, item_id)
);

CREATE TABLE IF NOT EXISTS checklist_progress (
    role TEXT NOT NULL,
    item_id TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (role, item_id)
);

CREATE TABLE IF NOT EXISTS glossary_search (
    id TEXT PRIMARY KEY,
    category TEXT,
    letter TEXT
);

CREATE TABLE IF NOT EXISTS final_test (
    question_id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL,
    text TEXT NOT NULL,
    options_json TEXT NOT NULL,
    correct_index INTEGER NOT NULL,
    explanation TEXT NOT NULL
);

-- ============================================================
-- TABLAS PARA SISTEMA DE CONTRASEÑAS TEMPORALES / LICENCIAS
-- ============================================================

CREATE TABLE IF NOT EXISTS passwords (
    code VARCHAR(32) PRIMARY KEY,
    user_email VARCHAR(255),
    start_date TIMESTAMP NOT NULL DEFAULT now(),
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    -- Metricas de uso
    total_sessions INTEGER NOT NULL DEFAULT 0,
    last_connection TIMESTAMP,
    courses_accessed JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    expires_notification_sent BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS password_usage (
    id SERIAL PRIMARY KEY,
    password_code VARCHAR(32) NOT NULL REFERENCES passwords(code) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    session_start TIMESTAMP NOT NULL DEFAULT now(),
    session_end TIMESTAMP,
    modules_viewed JSONB NOT NULL DEFAULT '[]'::jsonb,
    quiz_score INTEGER,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Índice para búsquedas por fecha de vencimiento
CREATE INDEX IF NOT EXISTS idx_passwords_end_date ON passwords(end_date);
-- Índice para validación rápida de contraseña activa
CREATE INDEX IF NOT EXISTS idx_passwords_status_active ON passwords(status, end_date);
