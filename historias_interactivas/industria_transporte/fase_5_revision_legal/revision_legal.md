# Fase 5: Revisión Legal - Industria Transporte

## Caso: TransRuta SpA

**Empresa:** TransRuta SpA, transporte interregional con 180 buses, 320 conductores, 3.500 pasajeros diarios (200.000 mensuales), $18.000 millones CLP ingresos anuales.

**Auditoría encontró:**
1. RAT desactualizado (2021) sin sistema de tracking
2. Tracking GPS sin consentimiento individual
3. Sistema de huella biométrica para abordar sin EIPD
4. Breach de 80.000 perfiles (GPS + datos pago) por ataque SQL injection
5. Sin DPO (Art. 50)
6. Datos sin cifrado en tránsito

---

## 1. Resumen Ejecutivo

6 incumplimientos identificados. Multa base: 1.750 UTM (~$117M CLP). Aplicando atenuantes: ~721 UTM (~$48M CLP).

## 2. Checklist Cumplimiento

| Artículo | Obligación | Estado |
|----------|-----------|--------|
| Art. 14 | RAT | ❌ |
| Art. 14 quinquies | Seguridad cifrado | ❌ |
| Art. 14 sexies | Breach 72h | ❌ |
| Art. 15 ter | EIPD IA ruteo | ❌ |
| Art. 16 | Consentimiento tracking | ❌ |
| Art. 50 | DPO | ❌ |

## 3. Multas

| Infracción | UTM |
|------------|-----|
| RAT desactualizado | 50 |
| Tracking sin consentimiento | 300 |
| Breach sin notificar | 1.000 |
| Sin DPO | 200 |
| Sin EIPD ruteo IA | 200 |
| **TOTAL** | **1.750** |

## 4. Atenuantes (Art. 49)

- Primera infracción: -20% (-350 UTM)
- Colaboración: -15% (-262 UTM)
- Implementación rápida: -25% (-437 UTM)
- Sector transporte: -10% (-175 UTM)
- **Multa final: ~721 UTM** (~$48M CLP)

## 5. Acciones Correctivas

### Urgentes (0-30 días)
- [ ] Notificar APDP y 80.000 pasajeros
- [ ] Suspender tracking GPS continuo
- [ ] Suspender sistema de huella
- [ ] Designar DPO interim
- [ ] Cifrar base de datos de tracking

### Mediano plazo (30-90 días)
- [ ] Actualizar RAT (45 tratamientos)
- [ ] Consentimiento granular por cada pasajero
- [ ] EIPD para IA de ruteo
- [ ] Portal ARCO para pasajeros

### Largo plazo (90+ días)
- [ ] Sello APDP-MTT
- [ ] Auditoría externa anual
- [ ] Política de retención 30 días tracking

---

*Fuente: BCN LeyChile idNorma=1209272, MTT, Dirección del Trabajo*
*Vigencia plena: 1 de diciembre de 2026*
