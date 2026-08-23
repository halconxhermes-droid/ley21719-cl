/**
 * Mapeo de los 10 videos YouTube unlisted del curso (docs/youtube-videos.json).
 * Los videos son UNLISTED: solo se muestran embebidos en esta web.
 */

export interface VideoEntry {
  archivo: string;
  videoId: string;
  titulo: string;
  /** tema según docs/youtube-videos.json */
  tema: string;
  /** ids de módulos (backend) donde se muestra embebido, según media/manifest.json */
  modules: string[];
}

export const PLAYLIST_ID = "PLe_vi6plvNRU";

export const VIDEOS: VideoEntry[] = [
  {
    archivo: "01-reloj-control-asistencia.mp4",
    videoId: "mrlj9vSB0EM",
    titulo: "¿Es ilegal el reloj de control de asistencia?",
    tema: "biometria-laboral",
    modules: ["empresa", "desarrollador"],
  },
  {
    archivo: "02-algoritmo-rechaza-credito.mp4",
    videoId: "GM4ayufDF7s",
    titulo: "¿Qué pasa si un algoritmo rechaza tu crédito?",
    tema: "decisiones-automatizadas",
    modules: ["ciudadano", "empresa"],
  },
  {
    archivo: "03-salud-fichas-eipd.mp4",
    videoId: "z4TGvt1jtlo",
    titulo: "Nuevas Leyes de Datos en Salud (21.719 + 21.663)",
    tema: "salud",
    modules: ["institucion"],
  },
  {
    archivo: "04-sector-publico-art20.mp4",
    videoId: "wULqitj6Khc",
    titulo: "Sector público: Art. 20, consentimiento y responsabilidad personal",
    tema: "sector-publico",
    modules: ["institucion"],
  },
  {
    archivo: "05-fin-ley-19628-arsop-apdp.mp4",
    videoId: "lNQVy8HoKKs",
    titulo: "Privacidad en Chile: adiós 19.628, ARSOP y APDP",
    tema: "introduccion",
    modules: ["empresa", "ciudadano", "desarrollador", "institucion"],
  },
  {
    archivo: "06-cuenta-atras-dpas-transferencias-shadow-ai.mp4",
    videoId: "SLmCjv1MUBI",
    titulo: "Cuenta atrás: nuevo estándar, DPAs, transferencias y Shadow AI",
    tema: "transferencias",
    modules: ["empresa", "desarrollador"],
  },
  {
    archivo: "07-logistica-gps-flotas-mdm-brechas.mp4",
    videoId: "5MZTuMFQVXk",
    titulo: "Logística última milla: GPS, flotas y MDM",
    tema: "logistica",
    modules: ["empresa"],
  },
  {
    archivo: "08-guia-empresas-6-pasos.mp4",
    videoId: "pA276XjRG7s",
    titulo: "Adaptación de plataformas web: checklist 5 puntos críticos",
    tema: "empresas",
    modules: ["empresa", "desarrollador"],
  },
  {
    archivo: "09-datos-estudiantes-colegios.mp4",
    videoId: "-gk_XW3Fu_c",
    titulo: "¿Están seguros los datos de los estudiantes? (colegios)",
    tema: "educacion",
    modules: ["institucion", "ciudadano"],
  },
  {
    archivo: "10-ecommerce-marketing-sernac.mp4",
    videoId: "bXuJhhaMmRA",
    titulo: "Navegando la Ley: diseño web, marketing y e-commerce",
    tema: "ecommerce",
    modules: ["empresa", "ciudadano"],
  },
];

/** Videos embebidos para un módulo dado. */
export function videosForModule(moduleId: string): VideoEntry[] {
  return VIDEOS.filter((v) => v.modules.includes(moduleId));
}

export function embedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
