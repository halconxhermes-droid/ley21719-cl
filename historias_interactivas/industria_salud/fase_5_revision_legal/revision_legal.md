# Fase 5: Revisión Legal - Industria Salud

## Validación de Cumplimiento con la Ley 21.719

### Artículos Clave para el Sector Salud

| Artículo | Requisito | Estado Verificación | Comentario |
|----------|-----------|--------------------|------------|
| **Art. 16** | Regla general para datos sensibles | ✅ Cumplido | El tratamiento de datos personales sensibles requiere consentimiento en forma expresa |
| **Art. 16 bis** | Datos de salud y perfil biológico | ✅ Cumplido | Tratamiento solo para fines previstos por leyes especiales en materia sanitaria |
| **Art. 16 ter** | Datos biométricos | ⚠️ Revisar | Necesita validación específica para casos de identificación médica |
| **Art. 14 quinquies** | Medidas de seguridad | ✅ Cumplido | Encriptación obligatoria, control de accesos por rol, audit log inmutable |
| **Art. 14 sexies** | Notificación de brechas | ✅ Cumplido | Plazo máximo 72 horas para notificar a la APDP y titulares afectados |
| **Art. 15 ter** | Evaluación de impacto | ✅ Cumplido | EIPD requerida para tratamientos de alto riesgo (datos masivos, IA, perfiles) |
| **Art. 50** | Delegado de Protección de Datos | ⚠️ Pendiente | Revisar si es obligatorio según tamaño y tipo de institución |
| **Art. 5** | Derecho de acceso | ✅ Cumplido | Todo titular puede solicitar confirmación y acceso a sus datos |
| **Art. 7** | Derecho a supresión | ✅ Cumplido | Derecho a solicitar eliminación de datos de salud |
| **Art. 8** | Derecho a oposición | ✅ Cumplido | Oponerse al tratamiento para fines de marketing |
| **Art. 9** | Derecho a portabilidad | ✅ Cumplido | Recibir datos en formato electrónico estructurado |

### Checklist de Cumplimiento para Clínicas y Hospitales

#### 1. Registro de Actividades (Art. 14) ✅
- [x] Lista de 8 tratamientos típicos documentados
- [x] Datos específicos por categoría registrados
- [x] Finalidades legítimas identificadas
- [x] Concesionarios/encargados identificados
- [x] Plazos de conservación establecidos
- [x] Medidas de seguridad listadas

#### 2. Política de Privacidad (Art. 14 ter) ✅
- [x] Pública y accesible en sitio web
- [x] Identidad del responsable clara
- [x] Finalidades del tratamiento especificadas
- [x] Derechos del titular enumerados
- [x] Medios de contacto disponibles
- [x] Actualizada periódicamente

#### 3. Consentimiento Informado ✅
- [x] Formularios con consentimiento explícito (Art. 16)
- [x] Sin casillas pre-marcadas
- [x] Información en lenguaje claro
- [x] Identificación del tratamiento específico
- [x] Posibilidad de retirar consentimiento
- [x] Registro de consentimientos otorgados

#### 4. Medidas de Seguridad (Art. 14 quinquies) ✅
- [x] Encriptación AES-256 en reposo
- [x] Encriptación TLS 1.3 en tránsito
- [x] Control de accesos por rol (principio de menor privilegio)
- [x] Audit log inmutable (quién, cuándo, qué consultó)
- [x] Autenticación multifactor (2FA) para accesos remotos
- [x] Políticas de contraseñas fuertes
- [x] Copias de seguridad periódicas fuera Sitio
- [x] Antivirus/antimalware actualizado

#### 5. Notificación de Brechas (Art. 14 sexies) ✅
- [x] Protocolo definido para brechas de seguridad
- [x] Plazo de 72 horas documentado
- [x] Contenido mínimo: datos comprometidos, consecuencias, medidas
- [x] Formato de notificación a titulares definido
- [x] Formato de notificación a APDP definido
- [x] Ejercicios de simulación realizados

#### 6. Evaluación de Impacto (Art. 15 ter) ✅
- [x] Identificación de tratamientos de alto riesgo
- [x] Evaluación de probabilidad y gravedad
- [x] Medidas de mitigación documentadas
- [x] Revisión periódica del EIPD
- [x] Aprobación formal antes de iniciar tratamiento

#### 7. Delegado de Protección de Datos (Art. 50) ⚠️
- [ ] Designado para instituciones > 5,000 pacientes
- [ ] Tiene independencia y autonomía
- [ ] Actúa como enlace con la APDP
- [ ] Tiene suficientes recursos para el rol
- [ ] Formación en protección de datos completada

### Cálculo de Sanciones Potenciales (Art. 35)

| Tipo Infracción | Rango UTM | Rango CLP | Aplicabilidad Sector Salud |
|----------------|-----------|-----------|--------------------------|
| **Leve** | 1-100 UTM | $6.7M - $67M | Incumplimientos menores de formularios |
| **Grave** | 101-1.000 UTM | $67M - $670M | Datos sensibles sin base legal, falta de DPO |
| **Gravisima** | 1.001-5.000 UTM | $67M - $335M | Brechas no notificadas, venta de datos sensibles |

### Ejemplo de Cálculo Real

**Escenario:** Clínica sufre brecha de 500 pacientes, datos no encriptados, no notificada en 72 horas.

**Base:**
- Falta de encriptación: 300 UTM (Art. 14 quinquies)
- No notificación brecha: 1.000 UTM (Art. 14 sexies)
- Falta de DPO (si aplica): 200 UTM (Art. 35)

**Subtotal:** 1.500 UTM

**Atenuantes (Art. 49):**
- Primera infracción: -20% = -300 UTM
- Colaboración durante fiscalización: -15% = -225 UTM
- Implementación rápida medidas correctivas: -25% = -375 UTM

**Total con atenuantes:** 1.500 - 900 = **600 UTM** (~$40 millones CLP)

### Certificación de Cumplimiento

**Recomendado para:**
- Sello de calidad para prestadores de salud
- Diferenciador competitivo ante Isapres y FONASA
- Requisito para certificación SENCE
- Reconocimiento ante pacientes exigentes

**Componentes:**
- Informe de auditoría externa
- Informe de cumplimiento Art. 14, 14 quinquies, 14 sexies
- Plan de mejora continua
- Certificado de fecha expedido por entidad válida

---
*Revisión legal generada para: Historia Salud - Fase 5*
*Fecha: Septiembre 2026*
*Autoridad: Agencia de Protección de Datos Personales*
*Vigencia: Ley 21.719 publicada 13-12-2024, vigencia plena 01-12-2026*