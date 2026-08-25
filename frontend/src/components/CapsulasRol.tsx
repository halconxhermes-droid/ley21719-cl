import { capsulasForRol, SERIE40_PLAYLIST_ID } from "../lib/serie40";

/**
 * Cápsulas de la serie 40 (canal @FantasyTalesUniverse), embebidas según el rol.
 * Videos ocultos en YouTube: solo visibles embebidos aquí.
 */
export default function CapsulasRol({ moduleId }: { moduleId: string }) {
  const capsulas = capsulasForRol(moduleId);
  if (!capsulas.length) return null;

  return (
    <section aria-label="Cápsulas en video del curso" className="mt-10">
      <details className="group">
        <summary className="cursor-pointer list-none rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors">
          ▶ Ver las {capsulas.length} cápsulas en video de este módulo
          <span className="ml-2 text-sm font-normal text-emerald-600">
            (serie completa · 10 seg c/u)
          </span>
        </summary>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capsulas.map((c) => (
            <figure key={c.videoId} className="m-0">
              <div
                className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900 shadow-sm"
                style={{ aspectRatio: "16 / 9" }}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${c.videoId}`}
                  title={`${String(c.num).padStart(2, "0")} · ${c.titulo}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
              <figcaption className="mt-2 text-xs font-medium text-slate-600">
                {String(c.num).padStart(2, "0")} · {c.titulo}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Serie completa:{" "}
          <a
            href={`https://www.youtube.com/playlist?list=${SERIE40_PLAYLIST_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-600"
          >
            playlist · 40 cápsulas Ley 21.719
          </a>
        </p>
      </details>
    </section>
  );
}
