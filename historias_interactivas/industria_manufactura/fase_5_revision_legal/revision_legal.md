# Fase 5: Revisión Legal - Industria Manufactura

## Caso: MetalSur Industrial SpA

**Empresa:** MetalSur Industrial SpA, planta metalmecánica en Maipú, 350 trabajadores, sistema de acceso biométrico implementado en 2023.

**Auditoría encontró:**
1. Sistema biométrico (huella + reconocimiento facial) sin RAT documentado
2. Datos biométricos sin consentimiento individual escrito
3. Falta de DPO
4. Sistema de control de acceso sin cifrado en reposo
5. Datos de turnos sin anonimización en estudios de productividad
6. Sin EIPD para sistema biométrico

---

## 1. Resumen Ejecutivo

MetalSur Industrial presenta 6 incumplimientos a la Ley 21.719 en su sistema biométrico de control de acceso. Multa base: 1.650 UTM (~$110M CLP). Aplicando atenuantes Art. 49: ~496 UTM (~$33M CLP).

---

## 2. Checklist de Cumplimiento

| Artículo | Obligación | Estado |
|----------|-----------|--------|
| Art. 14 | RAT | ❌ |
| Art. 14 quinquies | Seguridad biométrica | ❌ |
| Art. 14 sexies | Notificación breach | ❌ |
| Art. 15 ter | EIPD biométrico | ❌ |
| Art. 16 | Consentimiento biométrico | ❌ |
| Art. 50 | DPO | ❌ |

---

## 3. Cálculo de Multas

| Infracción | UTM |
|------------|-----|
| RAT inexistente | 50 |
| Biométrico sin cifrar | 300 |
| Breach biométrico (350 trabajadores) | 1.000 |
| Sin DPO | 200 |
| Consentimiento viciado | 100 |
| **TOTAL** | **1.650** |

---

## 4. Atenuantes (Art. 49)

- Primera infracción: -20%
- Colaboración espontánea: -15%
- Implementación rápida: -25%
- **Multa final estimada: ~496 UTM** (~$33M CLP)

---

## 5. Acciones Correctivas

### Urgentes (0-30 días)
- [ ] Suspender sistema biométrico y migrar a tarjeta magnética + PIN
- [ ] Solicitar consentimiento escrito individual de cada trabajador
- [ ] Designar DPO interim
- [ ] Cifrar base de datos biométricos existentes

### Mediano plazo (30-90 días)
- [ ] EIPD del sistema biométrico
- [ ] Política de privacidad para trabajadores
- [ ] Capacitación a 350 trabajadores
- [ ] Actualizar RAT con sistema de turnos

### Largo plazo (90+ días)
- [ ] Auditoría anual de cumplimiento
- [ ] Certificación Sello APDP-MINTRAB

---

## 6. Recomendaciones

1. **Negociar con sindicato** — El consentimiento biométrico debe ser voluntario, nunca condición de empleo.
2. **Alternativas no biométricas** — Tarjeta + PIN o RFID son legalmente más simples.
3. **Anonimizar estudios** — Los datos de turnos para productividad deben ser agregados, no individuales.

---

*Fuente: BCN LeyChile idNorma=1209272, Ley 21.719, Dirección del Trabajo*
*Vigencia plena: 1 de diciembre de 2026*
