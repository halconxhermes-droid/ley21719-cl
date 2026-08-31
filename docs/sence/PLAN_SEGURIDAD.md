# Plan de Seguridad y Respuesta a Incidentes

**Plataforma:** ley21719-cl
**Versión:** 1.0
**Fecha:** 31 de agosto de 2026
**Cumplimiento:** Ley 21.719, OWASP Top 10, ISO 27001

---

## 🔒 POLÍTICA DE SEGURIDAD

### 1. Principios Fundamentales

1. **Security by Design:** Seguridad desde el diseño
2. **Defense in Depth:** Múltiples capas de seguridad
3. **Least Privilege:** Mínimo privilegio necesario
4. **Zero Trust:** Verificación continua
5. **Encryption Everywhere:** Cifrado en reposo y tránsito
6. **Audit Trail:** Trazabilidad completa

### 2. Clasificación de Datos

| Nivel | Tipo de Dato | Medidas |
|-------|--------------|---------|
| **Crítico** | RUN, datos de salud, contraseñas | Cifrado AES-256 + 2FA |
| **Sensible** | Email, teléfono, dirección | Cifrado + acceso limitado |
| **Interno** | Progreso del curso, notas | Cifrado + logs |
| **Público** | Contenido del curso, marketing | Sin restricción |

### 3. Medidas de Seguridad Implementadas

#### 3.1 Autenticación

```typescript
// Configuración de seguridad de passwords
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 min
};

// Hashing con bcrypt
const hashPassword = async (password: string) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};
```

#### 3.2 Autorización (RBAC)

| Rol | Permisos |
|-----|----------|
| **Estudiante** | Ver contenido, tomar quizzes, ver sus notas |
| **Instructor** | Crear quizzes, calificar, ver estudiantes |
| **Admin** | Gestión completa, certificados, configuración |
| **DPO** | Acceso a datos personales, auditoría |
| **Sistema** | Logs, backups, monitoring |

#### 3.3 Cifrado

**En tránsito:**
- TLS 1.3 obligatorio
- HSTS habilitado
- Certificados Let's Encrypt (renovación automática)

**En reposo:**
- AES-256-GCM para datos
- bcrypt para passwords
- SHA-256 para tokens
- Claves en AWS KMS / Vault

#### 3.4 Infraestructura

```yaml
# Docker Compose para producción
services:
  frontend:
    image: ley21719-frontend:latest
    environment:
      - VITE_API_URL=https://api.ley21719-cl.com
    networks:
      - frontend_net
    depends_on:
      - backend

  backend:
    image: ley21719-backend:latest
    environment:
      - DATABASE_URL=postgresql://...
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    networks:
      - frontend_net
      - backend_net
    secrets:
      - jwt_secret
      - encryption_key

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend_net
    secrets:
      - postgres_password
```

---

## 🛡️ OWASP TOP 10 - MITIGACIONES

### A01:2021 - Broken Access Control

**Mitigaciones implementadas:**
- ✅ Principio de mínimo privilegio
- ✅ RBAC (Role-Based Access Control)
- ✅ Validación de permisos en cada request
- ✅ Tokens JWT con expiración corta (15 min)
- ✅ Refresh tokens con rotación

```typescript
// Middleware de autorización
const requireRole = (roles: string[]) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    next();
  };
};
```

### A02:2021 - Cryptographic Failures

**Mitigaciones:**
- ✅ TLS 1.3 obligatorio
- ✅ Cifrado AES-256-GCM en reposo
- ✅ bcrypt con salt rounds >= 12
- ✅ No almacenamiento de datos sensibles en logs
- ✅ HTTPS only (HSTS)
- ✅ Certificate pinning en mobile

### A03:2021 - Injection (SQL, XSS, Command)

**Mitigaciones:**
- ✅ ORM con prepared statements (SQLAlchemy)
- ✅ Validación de input con Pydantic
- ✅ Sanitización de HTML (DOMPurify)
- ✅ Content Security Policy (CSP)
- ✅ Escaping de output automático (React)

```python
# Validación con Pydantic
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=100)
    
    @validator('password')
    def validate_password(cls, v):
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$', v):
            raise ValueError('Password must contain uppercase, lowercase, number and special char')
        return v
```

### A04:2021 - Insecure Design

**Mitigaciones:**
- ✅ Threat modeling en diseño
- ✅ Code review obligatorio
- ✅ Tests de seguridad automatizados
- ✅ Principio de mínimo privilegio
- ✅ Defense in depth

### A05:2021 - Security Misconfiguration

**Mitigaciones:**
- ✅ Hardening de servidores
- ✅ Actualizaciones automáticas de seguridad
- ✅ Configuración por defecto segura
- ✅ Headers de seguridad HTTP
- ✅ Sin servicios innecesarios

```nginx
# Headers de seguridad
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### A06:2021 - Vulnerable Components

**Mitigaciones:**
- ✅ Dependabot habilitado
- ✅ npm audit + pip audit en CI/CD
- ✅ Actualizaciones semanales
- ✅ Inventario de componentes (SBOM)
- ✅ Versiones mínimas soportadas

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
  - package-ecosystem: "pip"
    directory: "/backend"
    schedule:
      interval: "weekly"
```

### A07:2021 - Authentication Failures

**Mitigaciones:**
- ✅ 2FA disponible (TOTP)
- ✅ Rate limiting (5 intentos)
- ✅ Bloqueo de cuenta (15 min)
- ✅ Session timeout (24h)
- ✅ Password hashing con bcrypt
- ✅ JWT con expiración corta

### A08:2021 - Software & Data Integrity

**Mitigaciones:**
- ✅ Code signing
- ✅ CI/CD con checks automatizados
- ✅ Verificación de integridad de dependencias
- ✅ Backups inmutables
- ✅ Audit logging completo

### A09:2021 - Security Logging Failures

**Mitigaciones:**
- ✅ Logging centralizado (ELK Stack)
- ✅ Monitoreo en tiempo real
- ✅ Alertas automáticas
- ✅ Retención de logs (3 años)
- ✅ Audit trail completo

```typescript
// Audit log
const auditLog = {
  timestamp: new Date().toISOString(),
  userId: req.user?.id,
  action: 'DATA_ACCESS',
  resource: 'user_profile',
  resourceId: targetUserId,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  result: 'success',
  metadata: {
    fields_accessed: ['email', 'name'],
    purpose: 'support_request',
  },
};
```

### A10:2021 - Server-Side Request Forgery (SSRF)

**Mitigaciones:**
- ✅ Whitelist de dominios permitidos
- ✅ Validación de URLs
- ✅ Network segmentation
- ✅ DNS pinning

---

## 🚨 PLAN DE RESPUESTA A INCIDENTES

### Fases del Plan (NIST Framework)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  1.DETECTAR  │ →  │ 2.CONTENER  │ →  │ 3.ERRADICAR  │ →  │ 4.RECUPERAR  │ →  │ 5.APRENDER   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### 1. Detección (Detectar)

**Fuentes de detección:**
- Monitoreo automatizado (24/7)
- Reportes de usuarios
- Auditorías de seguridad
- Inteligencia de amenazas
- Logs de aplicación

**Señales de alerta:**
- Intentos de login fallidos masivos
- Tráfico anómalo desde una IP
- Cambios no autorizados en código
- Alertas de dependencias vulnerables
- Comportamiento anómalo de usuarios

**Tiempo objetivo de detección:** < 1 hora

### 2. Contención (Contener)

**Objetivo:** Evitar que el daño se propague

**Acciones inmediatas (0-2 horas):**
- Aislar sistemas afectados
- Bloquear IPs sospechosas
- Deshabilitar cuentas comprometidas
- Mantener evidencia (logs, memoria)
- Notificar al equipo de seguridad

**Acciones a corto plazo (2-24 horas):**
- Parchear vulnerabilidad
- Cambiar credenciales
- Implementar workaround temporal
- Monitoreo intensivo

### 3. Erradicación (Erradicar)

**Objetivo:** Eliminar la causa raíz

**Acciones:**
- Identificar vector de ataque
- Remover malware si existe
- Cerrar cuentas de atacantes
- Actualizar sistemas vulnerables
- Verificar que no haya persistencia

### 4. Recuperación (Recuperar)

**Objetivo:** Restaurar el servicio normal

**Acciones:**
- Restaurar desde backups verificados
- Validar integridad de datos
- Reiniciar servicios en orden
- Monitoreo post-incidente (30 días)
- Comunicación a usuarios

**Tiempo objetivo de recuperación (RTO):** 4 horas
**Objetivo de punto de recuperación (RPO):** 1 hora

### 5. Aprendizaje (Aprender)

**Objetivo:** Prevenir futuros incidentes

**Acciones:**
- Análisis post-mortem (dentro de 5 días)
- Documentación del incidente
- Actualización de procedimientos
- Capacitación al equipo
- Mejora de controles

---

## 📋 TIPOS DE INCIDENTES Y RESPUESTA

### 1. Brecha de Seguridad (Data Breach)

**Definición:** Acceso no autorizado a datos personales

**Detección:**
- Logs de acceso anómalos
- Alertas de DLP (Data Loss Prevention)
- Reportes de usuarios
- Monitoreo de red

**Respuesta inmediata (Art. 14 sexies):**
1. **0-1 hora:** Aislar sistema afectado
2. **1-2 horas:** Evaluar alcance y datos comprometidos
3. **2-24 horas:** Notificar a Agencia "sin dilaciones indebidas"
4. **24-72 horas:** Notificar a titulares afectados
5. **1-2 semanas:** Investigación completa

**Plantilla de notificación a Agencia:**
```markdown
# Notificación de Brecha de Seguridad
**Fecha:** [Fecha]
**Empresa:** [Nombre]
**RUN:** [RUT]

## 1. Naturaleza de la brecha
[Descripción técnica]

## 2. Categorías de datos afectados
- [ ] Datos personales
- [ ] Datos sensibles
- [X] Datos financieros
- [X] Credenciales

## 3. Número aproximado de titulares
- Total: [N]
- Con datos sensibles: [N]

## 4. Consecuencias probables
[Análisis de impacto]

## 5. Medidas adoptadas
[Acciones tomadas]

## 6. DPO
[Nombre y contacto]
```

### 2. Acceso No Autorizado a Cuenta

**Respuesta:**
1. Deshabilitar cuenta
2. Forzar reset de contraseña
3. Revisar logs de actividad
4. Notificar al usuario
5. Investigar vector de ataque

### 3. Ransomware

**Respuesta:**
1. Aislar sistemas infectados inmediatamente
2. NO pagar rescate
3. Activar plan de recuperación
4. Restaurar desde backups
5. Notificar a Agencia y usuarios
6. Denunciar a PDI

### 4. DDoS (Denial of Service)

**Respuesta:**
1. Activar CDN (Cloudflare)
2. Escalar infraestructura
3. Bloquear IPs atacantes
4. Monitorear tráfico
5. Considerar rate limiting agresivo

### 5. Data Exfiltration

**Respuesta:**
1. Aislar sistema afectado
2. Identificar datos exfiltrados
3. Notificar a Agencia (si son datos personales)
4. Presentar denuncia penal
5. Auditoría forense completa

---

## 📞 CONTACTOS DE EMERGENCIA

### Equipo Interno

| Rol | Nombre | Email | Teléfono |
|-----|--------|-------|----------|
| **CISO** | [Nombre] | ciso@... | +56 9 XXXX XXXX |
| **DPO** | [Nombre] | dpo@... | +56 9 XXXX XXXX |
| **Tech Lead** | [Nombre] | tech@... | +56 9 XXXX XXXX |
| **Legal** | [Nombre] | legal@... | +56 9 XXXX XXXX |

### Externos

| Entidad | Contacto |
|---------|----------|
| **Agencia de Protección de Datos** | [Web: datapersonales.gob.cl] |
| **CSIRT de Gobierno** | csirt.gob.cl |
| **PDI - Brigada del Cibercrimen** | [Teléfono] |
| **Carabineros - OS-9** | [Teléfono] |

---

## 🧪 EJERCICIOS Y TESTING

### Frecuencia de Pruebas

- **Tabletop exercises:** Trimestral
- **Simulacros de phishing:** Mensual
- **Tests de penetración:** Anual
- **Auditorías de código:** Continuo (CI/CD)
- **Backup restoration:** Mensual

### Plan de Simulacro Anual

| Mes | Tipo de Ejercicio |
|-----|-------------------|
| Enero | Backup restoration |
| Abril | Phishing simulado |
| Julio | Tabletop: breach de datos |
| Octubre | Pen test externo |
| Diciembre | DR (Disaster Recovery) |

---

## 📊 MÉTRICAS DE SEGURIDAD

### KPIs Monitoreados

| Métrica | Objetivo | Frecuencia |
|---------|----------|------------|
| Tiempo de detección (MTTD) | < 1 hora | Continuo |
| Tiempo de contención (MTTC) | < 2 horas | Por incidente |
| Tiempo de resolución (MTTR) | < 24 horas | Por incidente |
| Uptime | 99.9% | Mensual |
| Vulnerabilidades críticas | 0 | Continuo |
| Cobertura de backups | 100% | Diario |
| Tests de penetración | 1/año | Anual |
| Capacitación al equipo | 100% | Anual |

### Monitoreo Continuo

- **SIEM:** Wazuh o Elastic SIEM
- **IDS/IPS:** Suricata
- **WAF:** Cloudflare
- **Monitoreo de aplicación:** Sentry
- **Monitoreo de infraestructura:** Datadog

---

## 📋 PROCEDIMIENTOS OPERACIONALES

### Procedimiento de Backup

```bash
#!/bin/bash
# Backup diario automatizado
DATE=$(date +%Y%m%d)
BACKUP_DIR="/var/backups/ley21719"
RETENTION_DAYS=30

# Backup de base de datos
pg_dump ley21719_prod | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup de archivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/ley21719/uploads/

# Subir a S3 cifrado
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://ley21719-backups/ --sse AES256

# Limpiar backups antiguos
find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -delete

# Verificar integridad
gzip -t $BACKUP_DIR/db_$DATE.sql.gz && echo "Backup OK" || echo "BACKUP FAILED"
```

### Procedimiento de Restauración

1. Identificar backup más reciente válido
2. Verificar integridad (gzip -t, sha256sum)
3. Detener aplicación
4. Restaurar base de datos
5. Restaurar archivos
6. Verificar funcionalidad
7. Reiniciar aplicación
8. Monitorear logs

### Procedimiento de Actualizaciones

1. Revisar vulnerabilidades (npm audit, pip audit)
2. Probar en staging
3. Programar ventana de mantenimiento
4. Notificar usuarios (24h antes)
5. Aplicar actualización
6. Verificar funcionamiento
7. Documentar en changelog

---

## ✅ CHECKLIST DE CUMPLIMIENTO

### Ley 21.719
- [x] HTTPS obligatorio
- [x] Cifrado de datos personales
- [x] Notificación de brechas (procedimiento)
- [x] DPO designado
- [x] Política de privacidad

### OWASP Top 10
- [x] A01: Access Control (RBAC + JWT)
- [x] A02: Cryptographic Failures (AES-256 + TLS 1.3)
- [x] A03: Injection (ORM + Pydantic)
- [x] A04: Insecure Design (Threat modeling)
- [x] A05: Security Misconfiguration (Hardening)
- [x] A06: Vulnerable Components (Dependabot)
- [x] A07: Auth Failures (2FA + Rate limiting)
- [x] A08: Data Integrity (CI/CD + Signatures)
- [x] A09: Logging Failures (ELK Stack)
- [x] A10: SSRF (Whitelist + Network segmentation)

### ISO 27001 (Controles seleccionados)
- [x] A.5: Políticas de seguridad
- [x] A.6: Organización de seguridad
- [x] A.8: Gestión de activos
- [x] A.9: Control de acceso
- [x] A.10: Criptografía
- [x] A.12: Seguridad de operaciones
- [x] A.13: Seguridad de comunicaciones
- [x] A.16: Gestión de incidentes
- [x] A.17: Continuidad de negocio

---

*Plan de Seguridad completo*
*Cumple con Ley 21.719, OWASP Top 10, ISO 27001*
*Versión 1.0 - 31 de agosto de 2026*
*Próxima revisión: 1 de febrero de 2027*
