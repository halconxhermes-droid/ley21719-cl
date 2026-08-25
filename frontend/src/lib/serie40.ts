/**
 * Serie 40 cápsulas — canal @FantasyTalesUniverse (playlist PLMcVju-R6P88).
 * IDs extraídos y validados contra YouTube oembed (2026-08-25). 40/40 OK.
 * Títulos canónicos según docs/videos_flow_guion_40.md.
 */

export interface Serie40Entry {
  num: number;
  titulo: string;
  videoId: string;
}

export const SERIE40_PLAYLIST_ID = "PLMcVju-R6P88";

export const SERIE40_PLAYLIST: Serie40Entry[] = [
  { num: 1 , titulo: "¿Qué es la Ley 21.719?", videoId: "D2licsH7DQ8" },
  { num: 2 , titulo: "Fechas clave de vigencia", videoId: "jRLE-Y6fqi8" },
  { num: 3 , titulo: "¿A quiénes aplica?", videoId: "HJeJvyzOBPk" },
  { num: 4 , titulo: "Extraterritorialidad", videoId: "TKbJ431D8ZY" },
  { num: 5 , titulo: "La Agencia APDP", videoId: "JrS82d5eNhQ" },
  { num: 6 , titulo: "Facultades de la Agencia", videoId: "Vz4gFfLFscA" },
  { num: 7 , titulo: "Medidas conservativas", videoId: "Nqupolevtz0" },
  { num: 8 , titulo: "Licitud y finalidad", videoId: "nyfeT2TtaTk" },
  { num: 9 , titulo: "Minimización de datos", videoId: "4x8faVLjg1o" },
  { num: 10, titulo: "Calidad y seguridad", videoId: "ZLRYb0uyABE" },
  { num: 11, titulo: "Responsabilidad proactiva", videoId: "fQR7SZyvw9k" },
  { num: 12, titulo: "Derechos ARSOP", videoId: "EPu_Jz3zk2s" },
  { num: 13, titulo: "Acceso y rectificación", videoId: "GCiiPkxOtzA" },
  { num: 14, titulo: "Supresión y oposición", videoId: "4knS3mNsnDo" },
  { num: 15, titulo: "Portabilidad", videoId: "m3g7aSE-Ajw" },
  { num: 16, titulo: "Bloqueo temporal", videoId: "BkBw4pMdzGg" },
  { num: 17, titulo: "Plazos de respuesta", videoId: "uvDePRHTJLk" },
  { num: 18, titulo: "Adiós al consentimiento tácito", videoId: "EsISUBBOrz4" },
  { num: 19, titulo: "Prohibición de cláusulas ocultas", videoId: "c_o81r0fQCc" },
  { num: 20, titulo: "Revocación del permiso", videoId: "b7Omp8CZpAs" },
  { num: 21, titulo: "Datos sensibles", videoId: "0ri__C_O2oA" },
  { num: 22, titulo: "Tratamiento de datos sensibles", videoId: "UuSHtFKRx9I" },
  { num: 23, titulo: "Protección de menores NNA", videoId: "AZc7oHDIcK8" },
  { num: 24, titulo: "Consentimiento parental", videoId: "Pk1dCNvkfVY" },
  { num: 25, titulo: "Privacidad desde el diseño", videoId: "XmXTN1LsM1g" },
  { num: 26, titulo: "Registro RAT", videoId: "ffOEUyaLAJY" },
  { num: 27, titulo: "Evaluación de impacto DPIA", videoId: "9Op47CK4-VU" },
  { num: 28, titulo: "Notificación de brechas", videoId: "E_-yifvsZNQ" },
  { num: 29, titulo: "IA y decisiones automatizadas", videoId: "QOUQNeGygeI" },
  { num: 30, titulo: "El DPO", videoId: "s7HI7jGdbtM" },
  { num: 31, titulo: "Banners de cookies", videoId: "LAhuE6ORZLU" },
  { num: 32, titulo: "Modelo de Prevención MPI", videoId: "2R54gwUJmBQ" },
  { num: 33, titulo: "Infracciones leves", videoId: "VfolhkY0WS8" },
  { num: 34, titulo: "Infracciones graves", videoId: "UIiyUYJAX2k" },
  { num: 35, titulo: "Infracciones gravísimas", videoId: "K3rJfNSEcaI" },
  { num: 36, titulo: "Reincidencia 2-4%", videoId: "fQmIj8crscE" },
  { num: 37, titulo: "Recargo 50%", videoId: "-Q_X5Hum554" },
  { num: 38, titulo: "Diagnóstico días 1-30", videoId: "gNPaDTuIBlM" },
  { num: 39, titulo: "Políticas días 31-60", videoId: "g3laamnxwVs" },
  { num: 40, titulo: "Cultura días 61-90", videoId: "gMbjp_duv_Y" },
];

export function serie40PorNumero(num: number): Serie40Entry | undefined {
  return SERIE40_PLAYLIST.find((v) => v.num === num);
}
