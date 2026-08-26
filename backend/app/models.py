"""Pydantic schemas for the Ley 21.719 educational API.

All response/request models follow the approved API contract in
design/api-contract.md (base path /api/v1).
"""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Shared / error models
# ---------------------------------------------------------------------------
class ErrorDetail(BaseModel):
    field: Optional[str] = None
    expected: Optional[str] = None


class ErrorResponse(BaseModel):
    error: ErrorBody


class ErrorBody(BaseModel):
    code: str
    message: str
    details: Optional[ErrorDetail] = None


# ---------------------------------------------------------------------------
# Modules
# ---------------------------------------------------------------------------
class EstimatedMinutes(BaseModel):
    summary: int
    friendly: int
    legal: int


class ModuleSummary(BaseModel):
    id: str
    title: str
    slug: str
    order: int
    estimatedMinutes: EstimatedMinutes
    description: str


class ModulesResponse(BaseModel):
    modules: List[ModuleSummary]
    total: int


class KeyFact(BaseModel):
    icon: Optional[str] = None
    text: str


class Scenario(BaseModel):
    title: str
    content: str


class FriendlySection(BaseModel):
    heading: str
    content: str
    scenarios: List[Scenario] = Field(default_factory=list)
    keyFacts: List[KeyFact] = Field(default_factory=list)


class FriendlyLevel(BaseModel):
    title: str
    estimatedMinutes: int
    sections: List[FriendlySection] = Field(default_factory=list)
    glossaryTerms: List[str] = Field(default_factory=list)


class Article(BaseModel):
    number: str
    title: str
    text: str


class LegalLevel(BaseModel):
    title: str
    articles: List[Article] = Field(default_factory=list)


class SummaryLevel(BaseModel):
    title: str
    estimatedMinutes: int
    bullets: List[str] = Field(default_factory=list)
    keyTerms: List[str] = Field(default_factory=list)


class ModuleLevels(BaseModel):
    summary: SummaryLevel
    friendly: FriendlyLevel
    legal: LegalLevel


class ModuleDetail(BaseModel):
    id: str
    title: str
    slug: str
    order: int
    levels: ModuleLevels


class ModuleResponse(BaseModel):
    module: ModuleDetail


# ---------------------------------------------------------------------------
# Quizzes
# ---------------------------------------------------------------------------
class QuizOption(BaseModel):
    id: int
    text: str


class QuizQuestion(BaseModel):
    id: str
    text: str
    options: List[QuizOption]
    explanation: str


class QuizResponse(BaseModel):
    quiz: QuizBody


class QuizBody(BaseModel):
    moduleId: str
    questions: List[QuizQuestion]
    totalQuestions: int


class QuizSubmitRequest(BaseModel):
    answers: List[int] = Field(
        ..., description="Array of selected option indices, one per question."
    )


class QuizExplanation(BaseModel):
    questionId: str
    correctIndex: int
    explanation: str


class QuizSubmitResult(BaseModel):
    score: int
    total: int
    passed: bool
    correctIndices: List[int]
    explanations: List[QuizExplanation]


class QuizSubmitResponse(BaseModel):
    result: QuizSubmitResult


# ---------------------------------------------------------------------------
# Checklist
# ---------------------------------------------------------------------------
class ChecklistItem(BaseModel):
    id: str
    text: str
    legalRef: Optional[str] = None
    guideUrl: Optional[str] = None
    completed: bool = False


class ChecklistSection(BaseModel):
    id: str
    title: str
    order: int
    items: List[ChecklistItem] = Field(default_factory=list)


class ChecklistProgress(BaseModel):
    completed: int
    total: int
    percentage: int


class ChecklistResponse(BaseModel):
    checklist: ChecklistBody


class ChecklistBody(BaseModel):
    role: str
    sections: List[ChecklistSection] = Field(default_factory=list)
    progress: ChecklistProgress


class ChecklistSubmitItem(BaseModel):
    id: str
    completed: bool


class ChecklistSubmitRequest(BaseModel):
    items: List[ChecklistSubmitItem]


class ChecklistSubmitResponse(BaseModel):
    checklist: ChecklistSubmitBody


class ChecklistSubmitBody(BaseModel):
    role: str
    progress: ChecklistProgress


# ---------------------------------------------------------------------------
# Glossary
# ---------------------------------------------------------------------------
class GlossaryTerm(BaseModel):
    id: str
    term: str
    definition: str
    category: Optional[str] = None
    legalRef: Optional[str] = None
    relatedTerms: List[str] = Field(default_factory=list)


class GlossaryResponse(BaseModel):
    terms: List[GlossaryTerm]
    total: int


class GlossaryTermRelated(BaseModel):
    id: str
    term: str


class GlossaryTermDetail(BaseModel):
    id: str
    term: str
    definition: str
    category: Optional[str] = None
    legalRef: Optional[str] = None
    relatedTerms: List[GlossaryTermRelated] = Field(default_factory=list)


class GlossaryTermResponse(BaseModel):
    term: GlossaryTermDetail


# ---------------------------------------------------------------------------
# Final test
# ---------------------------------------------------------------------------
class FinalTestQuestion(BaseModel):
    id: str
    moduleId: str
    text: str
    options: List[QuizOption]


class FinalTestResponse(BaseModel):
    test: FinalTestBody


class FinalTestBody(BaseModel):
    questions: List[FinalTestQuestion]
    totalQuestions: int
    passThreshold: int


class FinalTestSubmitRequest(BaseModel):
    answers: List[int] = Field(
        ..., description="Array of selected option indices, one per question."
    )


class ModuleBreakdown(BaseModel):
    moduleId: str
    correct: int
    total: int
    percentage: int


class FinalTestSubmitResult(BaseModel):
    score: int
    total: int
    percentage: int
    passed: bool
    detailByModule: List[ModuleBreakdown]
    certificateEligible: bool


class FinalTestSubmitResponse(BaseModel):
    result: FinalTestSubmitResult


# ======================================================================
# SISTEMA DE CONTRASEÑAS TEMPORALES / LICENCIAS
# ======================================================================

class PasswordCode(BaseModel):
    """Código de la contraseña (ej. 'ABC-1234', 'LEY-2024-001')."""
    code: str


class PasswordCreate(BaseModel):
    """Parámetros para crear una nueva contraseña."""
    code: str
    user_email: Optional[str] = None
    end_date: Optional[str] = None  # YYYY-MM-DD o ISO timestamp


class PasswordResponse(BaseModel):
    """Respuesta completa de una contraseña."""
    code: str
    user_email: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: str  # 'active', 'expired'
    total_sessions: int = 0
    last_connection: Optional[str] = None
    courses_accessed: List[str] = Field(default_factory=list)
    created_at: Optional[str] = None
    expires_notification_sent: bool = False


class PasswordUsage(BaseModel):
    """Registro de uso individual de una contraseña."""
    id: int
    password_code: str
    user_email: str
    session_start: Optional[str] = None
    session_end: Optional[str] = None
    modules_viewed: List[str] = Field(default_factory=list)
    quiz_score: Optional[int] = None
    completed: bool = False
    created_at: Optional[str] = None


class PasswordUsageCreate(BaseModel):
    """Parámetros para registrar uso de contraseña."""
    password_code: str
    user_email: str
    module_id: str
    quiz_score: Optional[int] = None


class ActivePasswordsNearExpiry(BaseModel):
    """Lista de contraseñas activas que vencen pronto."""
    code: str
    user_email: Optional[str] = None
    end_date: Optional[str] = None
    status: str


class ModuleCompletion(BaseModel):
    """Progreso de módulos por usuario con contraseña."""
    module_id: str
    completed: bool = False
    last_visited: Optional[str] = None
    quiz_score: Optional[int] = None
