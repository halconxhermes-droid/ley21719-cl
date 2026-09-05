# Fase 5: Revisión Legal - Industria Tecnología

## Caso: Nexo Fintech SpA

**Empresa:** Nexo Fintech, startup chilena de inversión automatizada con 50.000 usuarios, $5.000 millones CLP en activos gestionados, motor de perfilado algorítmico lanzado en 2025.

**Auditoría encontró:**
1. RAT de 2022 sin actualizar para motor de perfilado (2025)
2. EIPD del motor de IA no completada antes del lanzamiento
3. Bucket S3 con datos sin cifrar (breach de 30.000 usuarios)
4. Sin DPO (Art. 50)
5. Logs de auditoría insuficientes
6. Sin consentimiento granular para perfilado

---

## 1. Resumen Ejecutivo

Nexo Fintech presenta 6 incumplimientos. Multa base: 1.550 UTM (~$104M CLP). Atenuantes: ~632 UTM (~$42M CLP).

## 2. Checklist

| Artículo | Estado |
|----------|--------|
| Art. 14 (RAT) | ❌ |
| Art. 14 quinquies (Seguridad) | ❌ |
| Art. 14 sexies (Brecha) | ❌ |
| Art. 15 ter (EIPD) | ❌ |
| Art. 16 (Consentimiento) | ❌ |
| Art. 50 (DPO) | ❌ |

## 3. Multas

| Infracción | UTM |
|------------|-----|
| RAT desactualizado | 50 |
| Sin EIPD IA | 200 |
| Bucket S3 sin cifrar | 300 |
| Breach sin notificar | 1.000 |
| Sin DPO | 200 |
| Consentimiento viciado | 100 |
| **TOTAL** | **1.550** |

## 4. Atenuantes (Art. 49)

- Primera: -20% (-310)
- Colaboración: -15% (-232)
- Implementación rápida: -25% (-387)
- **Multa final: ~621 UTM** (~$42M CLP)

## 5. Acciones Correctivas

### Urgentes (0-30 días)
- [ ] Notificar APDP y 30.000 usuarios
- [ ] Cifrar bucket S3
- [ ] Suspender motor de perfilado
- [ ] Designar DPO interim

### Mediano plazo (30-90 días)
- [ ] Completar EIPD del motor de IA
- [ ] Actualizar RAT con 47 tratamientos
- [ ] Consentimiento granular retroactivo
- [ ] Implementar logs de auditoría completos

### Largo plazo (90+ días)
- [ ] Certificación Sello APDP-SEC
- [ ] Auditoría anual externa
- [ ] Programa de privacy-by-design

---

*Fuente: BCN LeyChile idNorma=1209272, Diario Oficial*
