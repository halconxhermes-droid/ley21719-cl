import { videosForModule } from "../lib/videos";

/**
 * Videos YouTube unlisted del curso, embebidos según el tema del módulo.
 * Solo se muestran embebidos en esta web (nunca enlaces al canal).
 */
export default function ModuleVideos({ moduleId }: { moduleId: string }) {
  const videos = videosForModule(moduleId);
  if (!videos.length) return null;

  return (
    <section aria-label="Videos explicativos del módulo" className="mt-8">
      <h3 className="mb-1 text-xl font-semibold text-slate-900">
        Videos del curso
      </h3>
      <p className="mb-4 text-sm text-slate-600">
        Explicaciones en video de este módulo (curso completo de la Ley 21.719).
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {videos.map((v) => (
          <figure key={v.videoId} className="m-0">
            <div className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900 shadow-sm" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.videoId}`}
                title={v.titulo}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <figcaption className="mt-2 text-sm font-medium text-slate-700">
              {v.titulo}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
