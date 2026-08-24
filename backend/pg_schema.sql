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
