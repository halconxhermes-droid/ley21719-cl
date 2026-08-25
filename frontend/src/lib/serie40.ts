/**
 * Registro de URLs de la serie 40 cápsulas (canal @FantasyTalesUniverse).
 * El usuario sube manualmente; aquí se anota cada videoId confirmado.
 * Fuente de títulos: media/serie40/_planilla_verificada.json
 */

export const SERIE40_PLAYLIST: { num: number; titulo: string; videoId: string | null }[] = [
  { num: 1,  titulo: "¿Qué es la Ley 21.719?",              videoId: "D2licsH7DQ8" },
  { num: 2,  titulo: "Fechas clave de vigencia",            videoId: "jRLE-Y6fqi8" },
  { num: 3,  titulo: "¿A quiénes aplica?",                  videoId: null },
  { num: 4,  titulo: "Extraterritorialidad",                videoId: null },
  { num: 5,  titulo: "La Agencia APDP",                     videoId: null },
  { num: 6,  titulo: "Facultades de la Agencia",            videoId: null },
  { num: 7,  titulo: "Medidas conservativas",               videoId: null },
  { num: 8,  titulo: "Licitud y finalidad",                 videoId: null },
  { num: 9,  titulo: "Minimización de datos",               videoId: null },
  { num: 10, titulo: "Calidad y seguridad",                 videoId: null },
  { num: 11, titulo: "Responsabilidad proactiva",           videoId: null },
  { num: 12, titulo: "Derechos ARSOP",                      videoId: null },
  { num: 13, titulo: "Acceso y rectificación",              videoId: null },
  { num: 14, titulo: "Supresión y oposición",               videoId: null },
  { num: 15, titulo: "Portabilidad",                        videoId: null },
  { num: 16, titulo: "Bloqueo temporal",                    videoId: null },
  { num: 17, titulo: "Plazos de respuesta",                 videoId: null },
  { num: 18, titulo: "Adiós al consentimiento tácito",      videoId: null },
  { num: 19, titulo: "Prohibición de cláusulas ocultas",    videoId: null },
  { num: 20, titulo: "Revocación del permiso",              videoId: null },
  { num: 21, titulo: "Datos sensibles",                     videoId: null },
  { num: 22, titulo: "Tratamiento de datos sensibles",      videoId: null },
  { num: 23, titulo: "Protección de menores NNA",           videoId: null },
  { num: 24, titulo: "Consentimiento parental",             videoId: null },
  { num: 25, titulo: "Privacidad desde el diseño",          videoId: null },
  { num: 26, titulo: "Registro RAT",                        videoId: null },
  { num: 27, titulo: "Evaluación de impacto DPIA",          videoId: null },
  { num: 28, titulo: "Notificación de brechas",             videoId: null },
  { num: 29, titulo: "IA y decisiones automatizadas",       videoId: null },
  { num: 30, titulo: "El DPO",                              videoId: null },
  { num: 31, titulo: "Banners de cookies",                  videoId: null },
  { num: 32, titulo: "Modelo de Prevención MPI",            videoId: null },
  { num: 33, titulo: "Infracciones leves",                  videoId: null },
  { num: 34, titulo: "Infracciones graves",                 videoId: null },
  { num: 35, titulo: "Infracciones gravísimas",             videoId: null },
  { num: 36, titulo: "Reincidencia 2-4%",                   videoId: null },
  { num: 37, titulo: "Recargo 50%",                         videoId: null },
  { num: 38, titulo: "Diagnóstico días 1-30",               videoId: null },
  { num: 39, titulo: "Políticas días 31-60",                videoId: null },
  { num: 40, titulo: "Cultura días 61-90",                  videoId: null },
];

export function serie40Completados(): number {
  return SERIE40_PLAYLIST.filter((v) => v.videoId !== null).length;
}
