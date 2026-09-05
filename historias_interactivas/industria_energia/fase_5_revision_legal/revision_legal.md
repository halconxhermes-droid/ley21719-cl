# Fase 5: Revisión Legal - Industria Energía

## Caso: EnerSur SpA - Distribuidora Eléctrica

**Empresa:** EnerSur SpA, distribuidora eléctrica zona centro-sur, 1.200.000 clientes, 600.000 con smart meters instalados en 2024.

**Auditoría encontró:**
1. Registro de actividades de tratamiento (RAT) desactualizado desde 2023
2. Consentimiento genérico en instalación de smart meters sin granularidad
3. Breach de 80.000 clientes por consultor junior subcontratado
4. Ausencia de Delegado de Protección de Datos (DPO)
5. Datos de consumo sin encriptación end-to-end
6. Sin Evaluación de Impacto (EIPD) para el despliegue masivo

---

## 1. Resumen Ejecutivo

La auditoría del sistema de medidores inteligentes de EnerSur identificó 6 incumplimientos mayores a la Ley 21.719, con riesgo de sanción acumulada de 1.650 UTM (~$110 millones CLP). La empresa puede reducir la multa a ~720 UTM (~$48 millones) si aplica las 4 atenuantes del Art. 49 y corrige en 90 días.

---

## 2. Checklist de Cumplimiento por Artículo

| Artículo | Obligación | Estado | Hallazgo |
|----------|-----------|--------|----------|
| **Art. 14** | Registro de Actividades de Tratamiento (RAT) | ❌ Incumple | RAT de 2023, sin smart meters |
| **Art. 14 quinquies** | Medidas de seguridad (encriptación) | ❌ Incumple | Smart meter data en claro |
| **Art. 14 sexies** | Notificación de brechas 72h | ❌ Incumple | Breach no notificado |
| **Art. 15 ter** | Evaluación de Impacto (EIPD) | ❌ Incumple | Sin EIPD para despliegue masivo |
| **Art. 16** | Consentimiento explícito para datos sensibles | ❌ Incumple | Consentimiento genérico, no granular |
| **Art. 50** | Designar DPO | ❌ Incumple | Sin DPO designado |

**Puntaje:** 0/6 obligaciones cumplidas. Riesgo: **CRÍTICO**.

---

## 3. Cálculo de Multas Base (Art. 35)

### Infracciones encontradas

| Infracción | Artículo | Tipo | Multa base (UTM) |
|------------|----------|------|------------------|
| Falta de RAT actualizado | Art. 14 / Art. 35 | Leve | 50 UTM |
| Datos sin encriptar | Art. 14 quinquies / Art. 35 | Grave | 300 UTM |
| No notificar breach 72h | Art. 14 sexies / Art. 35 | Grave | 1.000 UTM |
| Falta de DPO | Art. 50 / Art. 35 | Grave | 200 UTM |
| Consentimiento viciado | Art. 16 / Art. 35 | Grave | 100 UTM |
| **TOTAL BASE** | | | **1.650 UTM** (~$110 millones CLP) |

**Referencia UTM:** ~$67.000 CLP (valor 2026). Cálculo: 1.650 × 67.000 = $110.550.000 CLP.

---

## 4. Atenuantes Aplicables (Art. 49)

| Atenuante | % reducción | Base | Ahorro | Aplicable |
|-----------|------------|------|--------|-----------|
| Primera infracción | -20% | 1.650 UTM | -330 UTM | ✅ Sí |
| Colaboración espontánea | -15% | 1.650 UTM | -247 UTM | ✅ Sí (si notifica ahora) |
| Implementación rápida de medidas | -25% | 1.650 UTM | -412 UTM | ✅ Sí (corrige en 90 días) |
| Sector crítico con consideración | -10% | 1.650 UTM | -165 UTM | ⚠️ Parcial |

**Multa final estimada:** 1.650 - 330 - 247 - 412 = **~661 UTM** (~$44 millones CLP)

Si agrega atenuante sector: 661 - 165 = **~496 UTM** (~$33 millones CLP)

> **Rango final:** 496–720 UTM ($33M–$48M CLP) según atenuantes reconocidas por APDP.

---

## 5. Acciones Correctivas por Plazo

### 🚨 0-30 días (Urgentes)

- [ ] Notificar breach a APDP y a los 80.000 titulares afectados (Art. 14 sexies, 72h desde hoy)
- [ ] Suspender el uso comercial de datos de consumo hasta tener consentimiento granular
- [ ] Designar DPO interino (Art. 50) — perfil: abogado + ingeniero con diplomado en protección de datos
- [ ] Iniciar cifrado de datos en reposo y tránsito (AES-256)
- [ ] Actualizar RAT con todos los tratamientos de smart meters

### ⏱️ 30-90 días (Mediano plazo)

- [ ] Obtener consentimiento granular retroactivo de los 600.000 hogares con smart meters
- [ ] Completar Evaluación de Impacto (EIPD) para el despliegue de smart meters (Art. 15 ter)
- [ ] Publicar política de privacidad accesible (Art. 14 ter)
- [ ] Capacitar a todo el personal en manejo de datos personales (mínimo 4h)
- [ ] Auditoría de seguridad de la plataforma de telemetría

### 📅 90+ días (Largo plazo)

- [ ] Implementar portal de derechos ARCO para clientes (Art. 7-11)
- [ ] Certificación Sello APDP-SEC para el sistema de smart meters
- [ ] Plan de continuidad y recuperación ante brechas (playbook)
- [ ] Revisión anual de RAT y EIPD
- [ ] Evaluación de proveedores subcontratados (due diligence)

---

## 6. Sanciones Potenciales si No se Corrigen

| Escenario | Multa | Plazo |
|-----------|-------|-------|
| No corrige en 90 días | Multa base 1.650 UTM se duplica en reincidencia | Inmediato |
| Reincidencia con breach mayor | Hasta 20.000 UTM (gravísima) | 12 meses |
| Daño a titulares sin reparación | Responsabilidad civil + multa | Indefinido |
| Pérdida de concesión eléctrica | SEC puede revocar concesión | 24 meses |

**Riesgo reputacional:** Publicación de la sanción en el sitio web de la APDP (Art. 35, inciso final).

---

## 7. Recomendaciones

1. **Priorizar la notificación** — Cada día sin notificar aumenta la multa en 10 UTM/día (Art. 35, multa diaria).
2. **Documentar todo** — Guardar evidencia de cada medida correctiva para presentar a la APDP como atenuante.
3. **Contratar asesor externo** — Un estudio jurídico con experiencia en Ley 21.719 puede negociar atenuantes y reducir la multa.
4. **Comunicar a los clientes** — Transparencia proactiva reduce demandas civiles y mejora reputación.
5. **Revisar contratos con subcontratistas** — Incluir cláusulas de protección de datos y responsabilidad solidaria (Art. 12, inciso 3°).

---

*Fuente: BCN LeyChile idNorma=1209272, Diario Oficial Ley 21.719 (13-12-2024)*
*Vigencia plena: 1 de diciembre de 2026*
*Última actualización: Septiembre 2026*
