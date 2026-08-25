/**
 * Registro de URLs de la serie 40 cápsulas (canal @FantasyTalesUniverse).
 * Fuente: hoja de cálculo del usuario + planilla visual verificada.
 */

export interface Serie40Entry {
  num: number;
  titulo: string;
  videoId: string | null;
}

export const SERIE40_PLAYLIST_ID = "PLMcVju-R6P88";

export const SERIE40_PLAYLIST: Serie40Entry[] = [
  { num: 1,  titulo: "¿Qué es la Ley 21.719?",              videoId: "D2licsH7DQ8" },
  { num: 2,  titulo: "Fechas clave de vigencia",            videoId: "JRlE_d7cg8" },
  { num: 3,  titulo: "¿A quiénes aplica?",                  videoId: "HJely9r1wN" },
  { num: 4,  titulo: "Extraterritorialidad",                videoId: "tbkdZ8Z0ZY" },
  { num: 5,  titulo: "La Agencia APDP",                     videoId: "tJKgS5dehN" },
  { num: 6,  titulo: "Facultades de la Agencia",            videoId: "NVzFRpFcZA" },
  { num: 7,  titulo: "Medidas conservativas",               videoId: "NqupIoTvzA" },
  { num: 8,  titulo: "Licitud y finalidad",                 videoId: "NtyFe971aK" },
  { num: 9,  titulo: "Minimización de datos",               videoId: "3va450Zg1o" },
  { num: 10, titulo: "Calidad y seguridad",                 videoId: "ZLBYuAB8e" },
  { num: 11, titulo: "Responsabilidad proactiva",           videoId: "GFQ7xszYw9" },
  { num: 12, titulo: "Derechos ARSOP",                      videoId: "EPu_Jjsq2g" },
  { num: 13, titulo: "Acceso y rectificación",              videoId: "GC1XpkOtz3" },
  { num: 14, titulo: "Supresión y oposición",               videoId: "A4kn33SmDa" },
  { num: 15, titulo: "Portabilidad",                        videoId: "n6m3a78xJE" },
  { num: 16, titulo: "Bloqueo temporal",                    videoId: "Bk8wPmdzgMg" },
  { num: 17, titulo: "Plazos de respuesta",                 videoId: "uWvD3p4Htk" },
  { num: 18, titulo: "Adiós al consentimiento tácito",      videoId: "ESI8UBG0z4" },
  { num: 19, titulo: "Prohibición de cláusulas ocultas",    videoId: "c_o8t1OFQ0c" },
  { num: 20, titulo: "Revocación del permiso",              videoId: "b70mp8C2pAs" },
  { num: 21, titulo: "Datos sensibles",                     videoId: "0ri_o0coOA" },
  { num: 22, titulo: "Tratamiento de datos sensibles",      videoId: "uN5H1F4Rk1" },
  { num: 23, titulo: "Protección de menores NNA",           videoId: "AZo7OkOiZp" },
  { num: 24, titulo: "Consentimiento parental",             videoId: "PKd1CNvkFY" },
  { num: 25, titulo: "Privacidad desde el diseño",          videoId: "XmXT11NsM1g" },
  { num: 26, titulo: "Registro RAT",                        videoId: "rOFEuYA9aB" },
  { num: 27, titulo: "Evaluación de impacto DPIA",          videoId: "9Op74CK-VU" },
  { num: 28, titulo: "Notificación de brechas",             videoId: "E-yFvzsqqn" },
  { num: 29, titulo: "IA y decisiones automatizadas",       videoId: "OQUGNEyggel" },
  { num: 30, titulo: "El DPO",                              videoId: "shT11G8tba" },
  { num: 31, titulo: "Banners de cookies",                  videoId: "AhaUe60RBQ" },
  { num: 32, titulo: "Modelo de Prevención MPI",            videoId: "2R5p4wUgLuz" },
  { num: 33, titulo: "Infracciones leves",                  videoId: "f9olkH0ws8" },
  { num: 34, titulo: "Infracciones graves",                 videoId: "Uni1UYJAkx" },
  { num: 35, titulo: "Infracciones gravísimas",             videoId: "Kk3fN5EcLl" },
  { num: 36, titulo: "Reincidencia 2-4%",                   videoId: "FmqJj8rcsE" },
  { num: 37, titulo: "Recargo 50%",                         videoId: "_Q_X5Hn554" },
  { num: 38, titulo: "Diagnóstico días 1-30",               videoId: "gNPaDTuBIM" },
  { num: 39, titulo: "Políticas días 31-60",                videoId: "B13aaahNsv" },
  { num: 40, titulo: "Cultura días 61-90",                  videoId: "gBjMp_duv_Y" },
];

/** Videos con ID confirmado */
export function serie40Completados(): number {
  return SERIE40_PLAYLIST.filter((v) => v.videoId !== null).length;
}

/** Busca video por número */
export function serie40PorNumero(num: number): Serie40Entry | undefined {
  return SERIE40_PLAYLIST.find((v) => v.num === num);
}

