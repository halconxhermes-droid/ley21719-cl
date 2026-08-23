import { useEffect, useState } from "react";
import { getGlossary, getGlossaryTerm } from "../lib/api";
import type { GlossaryTermSummary, GlossaryTerm } from "../lib/api";
import { Loading, ErrorPanel } from "../components/Feedback";
import Modal from "../components/Modal";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * VISTA 5: Glosario A–Z con buscador y modal de definición.
 * Búsqueda delegada al backend (?q= / ?letter=) con debounce.
 */
export default function GlosarioView() {
  const [searchQ, setSearchQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [letterFilter, setLetterFilter] = useState<string | null>(null);
  const [terms, setTerms] = useState<GlossaryTermSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openTermId, setOpenTermId] = useState<string | null>(null);
  const [termDetail, setTermDetail] = useState<GlossaryTerm | null>(null);
  const [lastFocused, setLastFocused] = useState<HTMLElement | null>(null);

  // Debounce de búsqueda
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQ(searchQ), 250);
    return () => window.clearTimeout(id);
  }, [searchQ]);

  useEffect(() => {
    let alive = true;
    setError(null);
    getGlossary({ q: debouncedQ || undefined, letter: letterFilter ?? undefined })
      .then((res) => {
        if (alive) setTerms(res.terms);
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });
    return () => { alive = false; };
  }, [debouncedQ, letterFilter]);

  const openTerm = async (termId: string) => {
    setLastFocused(document.activeElement as HTMLElement | null);
    setOpenTermId(termId);
    try {
      const res = await getGlossaryTerm(termId);
      setTermDetail(res.term);
    } catch {
      setTermDetail(null);
    }
  };

  const closeTerm = () => {
    setOpenTermId(null);
    setTermDetail(null);
    lastFocused?.focus();
  };

  return (
    <section aria-labelledby="glosario-title">
      <h2 id="glosario-title" className="mb-1 text-2xl font-semibold">
        Glosario de la Ley 21.719
      </h2>
      <p className="text-slate-600">Haz clic en un término para ver su definición completa.</p>

      {/* Buscador */}
      <div className="relative my-6">
        <label htmlFor="glosario-search-input" className="visually-hidden">
          Buscar término en el glosario
        </label>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          id="glosario-search-input"
          placeholder="Buscar término…"
          autoComplete="off"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          className="w-full rounded-md border border-slate-300 py-3 pl-11 pr-4 text-base focus:border-primary-500 focus:outline-none"
        />
      </div>

      {/* Filtro A–Z */}
      <div role="group" aria-label="Filtrar por letra inicial" className="mb-6 flex flex-wrap gap-2">
        {ALPHABET.map((L) => {
          const active = letterFilter === L;
          return (
            <button
              key={L}
              type="button"
              aria-pressed={active}
              onClick={() => setLetterFilter(active ? null : L)}
              className={`cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors ${
                active
                  ? "border-primary-700 bg-primary-700 text-white"
                  : "border-slate-300 bg-white hover:border-primary-500 hover:text-primary-700"
              }`}
            >
              {L}
            </button>
          );
        })}
      </div>

      {!terms && !error && <Loading label="Cargando glosario…" />}
      {error && <ErrorPanel message={error} onRetry={() => setSearchQ("")} />}

      {terms && (
        <>
          <p id="glosario-count" role="status" className="text-sm font-medium text-slate-700">
            Mostrando {terms.length} término{terms.length === 1 ? "" : "s"}
          </p>

          {terms.length === 0 ? (
            <p id="glosario-empty" className="py-6 text-center text-slate-500">
              No se encontraron términos.
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {terms.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-primary-500"
                >
                  <span className="font-medium text-slate-800">{t.term}</span>
                  <button
                    type="button"
                    onClick={() => openTerm(t.id)}
                    data-testid={`glosario-ver-${t.id}`}
                    className="cursor-pointer border-none bg-transparent px-2 py-1 text-sm font-medium text-primary-700 hover:bg-primary-50"
                  >
                    Ver definición →
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Modal de definición */}
      {openTermId && (
        <Modal title={termDetail?.term ?? "Término"} onClose={closeTerm}>
          {termDetail === null ? (
            <Loading label="Cargando definición…" />
          ) : (
            <>
              <p className="whitespace-pre-line">{termDetail.definition}</p>
              {termDetail.legalRef ? (
                <p className="mt-3 text-sm text-slate-500">
                  Referencia legal: {termDetail.legalRef}
                </p>
              ) : null}
              {Array.isArray(termDetail.relatedTerms) && termDetail.relatedTerms.length ? (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <h4 className="mb-2 text-sm font-semibold">Términos relacionados</h4>
                  <div className="flex flex-wrap gap-2">
                    {(termDetail.relatedTerms as Array<{ id: string; term: string }>).map(
                      (r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => openTerm(r.id)}
                          className="cursor-pointer rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-800 hover:bg-primary-100"
                        >
                          {r.term}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </Modal>
      )}
    </section>
  );
}
