# Fase 5: Revisión Legal - Industria Retail

## Caso: Supermercados del Sur SpA

**Empresa:** Supermercados del Sur SpA, cadena de retail con 145 tiendas en Chile, 2 millones de clientes fidelizados, $580.000 millones CLP anuales en ventas.

**Auditoría encontró:**
1. RAT desactualizado (de 2023, no incluye programas de fidelización ni reconocimiento facial)
2. Consentimiento genérico para programa de fidelización sin granularidad por finalidad
3. Breach de 450.000 perfiles de clientes en plataforma de fidelización por exploit SQL
4. Ausencia de DPO (Art. 50)
5. Datos de clientes sin encriptación en base de datos legacy
6. Sin EIPD para programa de reconocimiento facial VIP

---

## 1. Resumen Ejecutivo

La auditoría del sistema de fidelización y programas de marketing de Supermercados del Sur identificó 6 incumplimientos mayores a la Ley 21.719, con riesgo de sanción acumulada de 1.650 UTM (~$110 millones CLP). La empresa puede reducir la multa a ~720 UTM (~$48 millones) si aplica las 4 atenuantes del Art. 49 y corrige en 90 días.

---

## 2. Checklist de Cumplimiento por Artículo

| Artículo | Obligación | Estado | Hallazgo |
|----------|-----------|--------|----------|
| **Art. 14** | RAT actualizado | ❌ Incumple | RAT de 2023, sin programas de fidelización ni reconocimiento facial |
| **Art. 14 quinquies** | Medidas de seguridad | ❌ Incumple | Base legacy sin cifrar |
| **Art. 14 sexies** | Notificación breach 72h | ❌ Incumple | Breach no notificado |
| **Art. 15 ter** | EIPD para reconocimiento facial | ❌ Incumple | Sin EIPD para VIP+ |
| **Art. 16** | Consentimiento explícito | ❌ Incumple | Consentimiento genérico, no granular |
| **Art. 50** | Designar DPO | ❌ Incumple | Sin DPO designado |

**Puntaje:** 0/6 obligaciones cumplidas. Riesgo: **CRÍTICO**.

---

## 3. Cálculo de Multas Base (Art. 35)

| Infracción | Artículo | Tipo | Multa base (UTM) |
|------------|----------|------|------------------|
| RAT desactualizado | Art. 14 / Art. 35 | Leve | 50 UTM |
| Datos sin cifrar (base legacy) | Art. 14 quinquies / Art. 35 | Grave | 300 UTM |
| Breach sin notificar 72h | Art. 14 sexies / Art. 35 | Grave | 1.000 UTM |
| Sin DPO | Art. 50 / Art. 35 | Grave | 200 UTM |
| Consentimiento viciado | Art. 16 / Art. 35 | Grave | 100 UTM |
| **TOTAL BASE** | | | **1.650 UTM** (~$110 millones CLP) |

---

## 4. Atenuantes Aplicables (Art. 49)

| Atenuante | Reducción | Aplicabilidad |
|-----------|-----------|--------------|
| Primera infracción | -20% (330 UTM) | ✅ Sí |
| Colaboración espontánea | -15% (247 UTM) | ✅ Sí (si notifica ahora) |
| Implementación rápida | -25% (412 UTM) | ✅ Sí (corrige en 90 días) |
| Sector retail con consideración | -10% (165 UTM) | ⚠️ Parcial |

**Multa final estimada:** 1.650 - 330 - 247 - 412 = **~661 UTM** (~$44M CLP)
**Con atenuante sector:** 661 - 165 = **~496 UTM** (~$33M CLP)

---

## 5. Acciones Correctivas por Plazo

### Urgentes (0-30 días)
- [ ] Notificar breach a APDP y 450.000 afectados (Art. 14 sexies)
- [ ] Suspender programa VIP+ de reconocimiento facial
- [ ] Designar DPO interim (Art. 50)
- [ ] Cifrar base legacy con AES-256
- [ ] Actualizar RAT con todos los tratamientos de fidelización

### Mediano plazo (30-90 días)
- [ ] Obtener consentimiento granular retroactivo de 2M clientes
- [ ] Completar EIPD para reconocimiento facial (Art. 15 ter)
- [ ] Publicar política de privacidad retail
- [ ] Capacitar 4.500 empleados en protección de datos
- [ ] Implementar portal ARCO para clientes (Art. 7-11)

### Largo plazo (90+ días)
- [ ] Migrar base legacy a sistema con cifrado nativo
- [ ] Obtener certificación Sello APDP-SERNAC
- [ ] Auditoría anual de seguridad
- [ ] Due diligence de proveedores de marketing

---

## 6. Sanciones Potenciales si No se Corrigen

| Escenario | Multa | Plazo |
|-----------|-------|-------|
| No corrige en 90 días | Multa base 1.650 UTM se duplica | Inmediato |
| Reincidencia con breach mayor | Hasta 20.000 UTM | 12 meses |
| Daño a menores de edad (cookies) | Responsabilidad agravada | Indefinido |

---

## 7. Recomendaciones

1. **Priorizar notificación** — Cada día sin notificar aumenta la multa.
2. **Documentar todo** — Cada medida correctiva documentada = atenuante en APDP.
3. **Revisar cookies** — La ley de cookies de SERNAC complementa la Ley 21.719.
4. **Due diligence de CRM** — Todo proveedor con acceso a datos debe tener DPA firmado.

---

*Fuente: BCN LeyChile idNorma=1209272, Diario Oficial Ley 21.719 (13-12-2024), SERNAC*
*Vigencia plena: 1 de diciembre de 2026*
*Última actualización: Septiembre 2026*
