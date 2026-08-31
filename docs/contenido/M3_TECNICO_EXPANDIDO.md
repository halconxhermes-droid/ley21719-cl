# Módulo 3: Implementación Técnica de la Ley 21.719

**Duración total:** 25 horas
**Nivel:** Aplicar - Crear
**Modalidad:** Online (Híbrido: 8h sincrónicas + 17h asincrónicas)

---

## 🎯 OBJETIVOS DEL MÓDULO

1. **OE-3.1:** Diseñar arquitecturas de sistemas que cumplen con los principios de protección de datos
2. **OE-3.2:** Implementar esquemas de cifrado y seudonimización según Art. 14 quinquies
3. **OE-3.3:** Construir flujos de consentimiento explícito
4. **OE-3.4:** Gestionar el ciclo de vida de datos
5. **OE-3.5:** Implementar transferencias internacionales conformes
6. **OE-3.6:** Auditar logs de acceso y trazabilidad
7. **OE-3.7:** Diseñar planes de respuesta a incidentes

---

## 📚 UNIDAD 3.1: ARQUITECTURA PRIVACY-BY-DESIGN (5 horas)

### Contenido Teórico (2h)

#### 3.1.1 Los 7 Principios de Cavoukian (30 min)

1. **Proactivo no Reactivo; Preventivo no Remedial**
   - Anticipar problemas antes que ocurran
   - Privacy como funcionalidad, no como parche

2. **Privacy as the Default Setting**
   - Privacidad sin acción del usuario
   - Configuración más restrictiva por defecto

3. **Privacy Embedded into Design**
   - No agregada como capa adicional
   - Integrada en la arquitectura

4. **Full Functionality — Positive-Sum, not Zero-Sum**
   - No sacrificar funcionalidad por privacidad
   - Lograr ambos objetivos simultáneamente

5. **End-to-End Security — Full Lifecycle Protection**
   - Seguridad desde la recolección hasta la eliminación
   - Protección durante todo el ciclo de vida

6. **Visibility and Transparency**
   - Documentación clara y accesible
   - Auditorías verificables

7. **Respect for User Privacy**
   - El usuario es el centro del diseño
   - Interfaces claras y controles significativos

#### 3.1.2 Patrones de Diseño (45 min)

**Patrón 1: Data Minimization**
- Recolectar solo lo necesario
- Eliminar lo que no se usa

**Patrón 2: Purpose Limitation**
- Usar datos solo para la finalidad declarada
- No reutilizar para otros fines

**Patrón 3: Storage Limitation**
- Retener solo el tiempo necesario
- Automatizar eliminación

**Patrón 4: Anonymization/Pseudonymization**
- Desvincular identidad de datos
- Hashing y tokenización

**Patrón 5: Access Control**
- Principio de mínimo privilegio
- Acceso basado en roles (RBAC)

**Patrón 6: Encryption**
- En reposo y en tránsito
- Gestión segura de claves

**Patrón 7: Audit Logging**
- Registrar todos los accesos
- Retención y análisis de logs

#### 3.1.3 Data Mapping (45 min)

**Propósito:**
- Inventario completo de datos tratados
- Base para RAT y EIPD
- Identificación de riesgos

**Herramientas de mapeo:**
- **OneTrust** (comercial)
- **Collibra** (comercial)
- **Apache Atlas** (open source)
- **DataHub** (open source)

**Elementos del mapa:**
- Fuente de datos
- Tipo de dato (personal, sensible)
- Finalidad
- Base legal
- Almacenamiento
- Destinatarios
- Transferencias
- Retención
- Medidas de seguridad

### Taller Sincrónico (2h)

**Caso Práctico: "Diseñar una Arquitectura Privacy-by-Design"**

**Escenario:** Diseñar desde cero una plataforma de telemedicina que cumplirá con la Ley 21.719.

**Tareas (en grupos):**
1. Identificar tratamientos de datos (30 min)
2. Diseñar arquitectura con privacy-by-design (45 min)
3. Identificar riesgos y mitigaciones (30 min)
4. Documentar decisiones (15 min)

**Entregable:** Diagrama de arquitectura + documento de decisiones.

### Laboratorio (1h)

**"Implementar Data Mapping Automático"**

**Stack:** Python + PostgreSQL
- Crear esquema de base de datos
- Implementar script de descubrimiento automático
- Generar reporte de mapeo

---

## 📚 UNIDAD 3.2: CICLO DE VIDA DE DATOS (5 horas)

### Contenido Teórico (2h)

#### 3.2.1 Recolección (30 min)

**Requisitos legales:**
- Base legal válida (Art. 9)
- Consentimiento específico (Art. 12)
- Información previa (Art. 13)
- Minimización (Art. 3)

**Implementación técnica:**
- Formularios validados
- No pre-marcado
- Checkboxes granulares
- Registro de consentimiento
- Timestamp + IP + User agent
- Prueba de consentimiento

**Pseudocódigo:**
```python
def collect_consent(user_id, purposes):
    """
    Recolecta consentimiento explícito por finalidad
    """
    consent = {
        "user_id": user_id,
        "purposes": {},
        "timestamp": now(),
        "ip": request.ip,
        "user_agent": request.headers["User-Agent"],
    }

    for purpose in purposes:
        # CRÍTICO: NO pre-marcado
        consent["purposes"][purpose] = {
            "granted": False,  # Usuario debe marcar activamente
            "timestamp": None,
        }

    return consent
```

#### 3.2.2 Almacenamiento (30 min)

**Requisitos:**
- Cifrado en reposo (AES-256)
- Separación de datos identificantes
- Retención limitada
- Backups seguros

**Patrón de tokenización:**

```python
# Almacenar solo el token
def store_user_data(user_id, name, email, phone):
    # Token aleatorio
    token = generate_secure_token()

    # Guardar datos sensibles en tabla separada
    sensitive_data.insert({
        "token": token,
        "name": encrypt(name),
        "email": encrypt(email),
        "phone": encrypt(phone),
    })

    # Guardar solo referencia en tabla principal
    users.insert({
        "user_id": user_id,
        "sensitive_token": token,
        "created_at": now(),
    })
```

#### 3.2.3 Procesamiento (30 min)

**Logs de auditoría:**

```python
def log_data_access(user_id, accessed_by, action, purpose):
    audit_log.insert({
        "timestamp": now(),
        "user_id": user_id,
        "accessed_by": accessed_by,
        "action": action,  # read, write, delete, export
        "purpose": purpose,
        "ip": request.ip,
        "result": "success" or "denied",
    })
```

**Reglas de procesamiento:**
- Solo para finalidad declarada
- Acceso basado en roles
- Logs de toda operación
- Revisión periódica

#### 3.2.4 Eliminación (30 min)

**Cuándo eliminar:**
- Finalizada la finalidad
- Vencido el plazo de retención
- Solicitud del titular (Art. 7)
- Datos obtenidos ilícitamente

**Cómo eliminar:**
- Hard delete de la base de datos
- Cifrado destructivo de backups
- Invalidación de tokens
- Notificación al titular
- Registro de la eliminación

```python
def delete_user_data(user_id):
    # Marcar para eliminación
    users.update(
        where={"user_id": user_id},
        set={"deletion_requested_at": now()}
    )

    # Período de gracia para recuperación (opcional)
    # 30 días después, eliminar definitivamente
    schedule_deletion(user_id, delay_days=30)
```

### Taller Sincrónico (2h)

**Caso: "Implementar Ciclo de Vida Completo"**

**Stack:** Node.js + MongoDB

**Tareas:**
1. Crear esquema con timestamps (30 min)
2. Implementar recolección de consentimiento (30 min)
3. Implementar logging de auditoría (30 min)
4. Implementar eliminación programada (30 min)

### Laboratorio (1h)

**"Auditar Ciclo de Vida"**

**Tareas:**
- Identificar un sistema existente
- Documentar cada etapa del ciclo
- Encontrar brechas de cumplimiento
- Proponer mejoras

---

## 📚 UNIDAD 3.3: CIFRADO Y SEUDONIMIZACIÓN (5 horas)

### Contenido Teórico (2h)

#### 3.3.1 Cifrado en Reposo (45 min)

**AES-256:**
- Estándar de la industria
- Clave de 256 bits
- Modo GCM recomendado

**Implementación:**

```python
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
import os

def encrypt_data(plaintext, key):
    """Cifra datos con AES-256-GCM"""
    iv = os.urandom(12)  # 96 bits para GCM
    padder = padding.PKCS7(128).padder()
    padded = padder.update(plaintext) + padder.finalize()

    cipher = Cipher(algorithms.AES(key), modes.GCM(iv))
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded) + encryptor.finalize()

    return iv + encryptor.tag + ciphertext

def decrypt_data(encrypted, key):
    """Descifra datos AES-256-GCM"""
    iv = encrypted[:12]
    tag = encrypted[12:28]
    ciphertext = encrypted[28:]

    cipher = Cipher(algorithms.AES(key), modes.GCM(iv, tag))
    decryptor = cipher.decryptor()
    padded = decryptor.update(ciphertext) + decryptor.finalize()

    unpadder = padding.PKCS7(128).unpadder()
    return unpadder.update(padded) + unpadder.finalize()
```

**Gestión de claves:**
- Usar KMS (Key Management Service)
- AWS KMS, Google Cloud KMS, Azure Key Vault
- Rotación periódica
- Nunca hardcodear claves

#### 3.3.2 Cifrado en Tránsito (30 min)

**TLS 1.3:**
- Última versión del protocolo
- Handshake rápido
- Forward secrecy
- Cifrados modernos

**Configuración recomendada:**

```nginx
# nginx.conf
ssl_protocols TLSv1.3;
ssl_ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
```

**Certificados:**
- Let's Encrypt (gratis)
- Renovación automática
- HSTS habilitado

#### 3.3.3 Seudonimización (45 min)

**Hashing con sal:**

```python
import hashlib
import os

def pseudonymize(value, salt=None):
    """Genera seudónimo irreversible"""
    if salt is None:
        salt = os.urandom(32)

    # PBKDF2 con 100,000 iteraciones
    hash_value = hashlib.pbkdf2_hmac(
        'sha256',
        value.encode('utf-8'),
        salt,
        100000
    )
    return salt + hash_value
```

**Tokenización:**

```python
import secrets

tokens = {}  # En producción: base de datos cifrada

def tokenize(value):
    """Genera token reversible"""
    token = secrets.token_urlsafe(32)
    tokens[token] = value  # Almacenar cifrado
    return token

def detokenize(token):
    """Recupera valor original"""
    return tokens.get(token)
```

**Cuándo usar cada técnica:**
- **Hashing:** Cuando NO se necesita revertir (ej: IDs internos)
- **Tokenización:** Cuando SÍ se necesita revertir (ej: pagos)
- **Cifrado:** Para datos que se usan directamente

### Laboratorio Sincrónico (2h)

**"Implementar Cifrado Completo"**

**Stack:** Python con cryptography

**Tareas:**
1. Cifrar datos sensibles en base de datos (30 min)
2. Configurar TLS 1.3 en servidor (30 min)
3. Implementar seudonimización de IDs (30 min)
4. Testing y validación (30 min)

### Laboratorio Asincrónico (1h)

**"Auditar Cifrado de un Sistema"**

**Checklist:**
- ¿Datos cifrados en reposo? (Sí/No/Por qué)
- ¿TLS 1.3 habilitado? (Sí/No/Por qué)
- ¿Claves en KMS? (Sí/No/Por qué)
- ¿Rotación de claves? (Sí/No/Por qué)
- ¿Logs de acceso a claves? (Sí/No/Por qué)

---

## 📚 UNIDAD 3.4: CONSENTIMIENTO TÉCNICO (4 horas)

### Contenido Teórico (1.5h)

#### 3.4.1 Requisitos Legales (30 min)

**Consentimiento válido (Art. 12):**
- Libre: Sin coerción
- Específico: Por finalidad
- Informado: Conoce qué acepta
- Inequívoco: Acción clara

**Prohibido:**
- Pre-marcado
- Bundling (acuerdo con todo o nada)
- Conditional service (servicio solo si acepta)
- Dark patterns

#### 3.4.2 Diseño de Formularios (45 min)

**Buenas prácticas:**

✅ Checkboxes separadas por finalidad
✅ Texto claro de qué se acepta
✅ Link a política de privacidad
✅ No pre-marcado NUNCA
✅ Opción de revocar fácilmente

**Ejemplo de formulario válido:**

```html
<form>
  <h3>Política de Privacidad</h3>
  <p><a href="/privacy">Lee nuestra política</a></p>

  <div>
    <input type="checkbox" id="marketing" name="marketing">
    <label for="marketing">
      Acepto recibir emails sobre nuevos productos y ofertas
    </label>
  </div>

  <div>
    <input type="checkbox" id="analytics" name="analytics">
    <label for="analytics">
      Acepto que se analice mi uso del sitio para mejorar el servicio
    </label>
  </div>

  <div>
    <input type="checkbox" id="thirdparty" name="thirdparty">
    <label for="thirdparty">
      Acepto compartir mis datos con socios comerciales
    </label>
  </div>

  <button type="submit">Continuar</button>
</form>
```

#### 3.4.3 Registro de Consentimiento (15 min)

**Información mínima a guardar:**

```json
{
  "user_id": "user_123",
  "timestamp": "2026-08-30T12:34:56Z",
  "ip_address": "192.0.2.1",
  "user_agent": "Mozilla/5.0...",
  "consent_version": "v2.1",
  "privacy_policy_url": "https://example.com/privacy/v2.1",
  "purposes": {
    "marketing": {
      "granted": true,
      "timestamp": "2026-08-30T12:34:56Z"
    },
    "analytics": {
      "granted": false,
      "timestamp": null
    },
    "thirdparty": {
      "granted": false,
      "timestamp": null
    }
  }
}
```

### Taller Sincrónico (1.5h)

**"Implementar Sistema de Consentimiento"**

**Stack:** React + Node.js

**Tareas:**
1. Crear componente de formulario (30 min)
2. Implementar registro de consentimiento (30 min)
3. Implementar revocación (30 min)

### Laboratorio (1h)

**"Auditar Sistema Existente"**

**Checklist:**
- ¿Checkboxes separadas? (Sí/No)
- ¿Sin pre-marcado? (Sí/No)
- ¿Registro de consentimiento? (Sí/No)
- ¿Revocación disponible? (Sí/No)

---

## 📚 UNIDAD 3.5: TRANSFERENCIAS INTERNACIONALES (3 horas)

### Contenido Teórico (1h)

#### 3.5.1 Implementación Técnica (30 min)

**Cloud Computing:**
- AWS, GCP, Azure como encargados de tratamiento
- CCT firmado con proveedor
- Configuración de región (data residency)

**APIs Internacionales:**
- ¿Los datos cruzan fronteras?
- Cifrado en tránsito obligatorio
- Logs de geolocalización

**Backup y Disaster Recovery:**
- Backups en otra región/país
- ¿Implica transferencia?
- Documentar en RAT

#### 3.5.2 CCT - Cláusulas Contractuales Tipo (30 min)

**Elementos clave:**
- Finalidad del tratamiento
- Tipo de datos
- Categorías de titulares
- Obligaciones del encargado
- Medidas de seguridad
- Notificación de brechas
- Derecho de auditoría
- Sub-encargados
- Transferencias posteriores
- Plazo de retención
- Devolución/eliminación al terminar

**Plantilla AWS DPA:**
https://aws.amazon.com/service-terms/

### Casos Prácticos (1h)

**Caso 1:** Startup con AWS
- CCT estándar de AWS
- Configurar región US-East-1
- Habilitar cifrado en reposo y tránsito

**Caso 2:** Empresa con Google Cloud
- CCT de Google
- Configurar VPC con Cloud NAT
- Logs de auditoría

**Caso 3:** API que llama a servicio externo
- ¿Es transferencia? (Sí, si salen datos)
- ¿Requiere CCT? (Sí)
- ¿Cómo documentarlo? (En RAT)

### Quiz (30 min)

**Quiz 3.5: 10 preguntas sobre transferencias técnicas**

---

## 📚 UNIDAD 3.6: AUDITORÍA Y LOGS (3 horas)

### Contenido Teórico (1.5h)

#### 3.6.1 Qué Registrar (30 min)

**Eventos críticos:**
- Creación de cuenta
- Modificación de datos
- Acceso a datos sensibles
- Exportación de datos
- Eliminación de datos
- Cambio de permisos
- Login/logout
- Intentos fallidos

**Información por evento:**
- Timestamp (ISO 8601)
- Usuario
- Acción
- Recurso afectado
- IP
- User agent
- Resultado
- Justificación (si aplica)

#### 3.6.2 Retención de Logs (30 min)

**Tiempos recomendados:**
- Logs de acceso: 1-3 años
- Logs de auditoría: 3-7 años
- Logs de seguridad: 1-5 años

**Consideraciones:**
- Regulación sectorial
- Necesidades de investigación
- Costo de almacenamiento
- Privacidad (no loggear datos sensibles innecesariamente)

#### 3.6.3 Análisis de Logs (30 min)

**Herramientas:**
- **ELK Stack** (Elasticsearch + Logstash + Kibana)
- **Splunk** (comercial)
- **Datadog** (comercial)
- **CloudWatch** (AWS)

**Métricas clave:**
- Accesos anómalos
- Intentos de intrusion
- Patrones de uso inusuales
- Tiempo entre eventos

### Laboratorio Sincrónico (1.5h)

**"Configurar Sistema de Auditoría"**

**Stack:** ELK Stack (Docker)

**Tareas:**
1. Configurar Filebeat para recolectar logs (20 min)
2. Crear índices en Elasticsearch (15 min)
3. Diseñar dashboards en Kibana (30 min)
4. Configurar alertas (25 min)

---

## 🎯 RESUMEN DE ACTIVIDADES DEL MÓDULO 3

| Actividad | Horas | Tipo |
|-----------|-------|------|
| 6 clases sincrónicas | 8h | Sincrónico |
| Lectura de manual | 6h | Asincrónico |
| 4 videos técnicos | 4h | Asincrónico |
| 3 laboratorios prácticos | 6h | Mixto |
| 6 quizzes (58 preguntas) | 1h | Asincrónico |
| **TOTAL** | **25h** | Mixto |

---

## 📊 EVALUACIÓN DEL MÓDULO 3

### Quizzes (6)
- Quiz 3.1: 10 preguntas
- Quiz 3.2: 8 preguntas
- Quiz 3.3: 12 preguntas
- Quiz 3.4: 9 preguntas
- Quiz 3.5: 10 preguntas
- Quiz 3.6: 9 preguntas
- **Total: 58 preguntas**

### Laboratorios Evaluados (3)
- Lab 1: Data Mapping Automático
- Lab 2: Cifrado Completo
- Lab 3: Sistema de Auditoría

### Ponderación
- Quizzes: 30%
- Laboratorios: 40% (críticos para este módulo)
- Participación: 30%
- **Total módulo: 25% de la nota final del curso** (mayor peso)

---

## 🛠️ RECURSOS TÉCNICOS

### Repositorio de Código
- `https://github.com/[org]/ley21719-examples`
- Ejemplos en Python, JavaScript, Go
- Licencia MIT

### Laboratorios
- Docker Compose con todas las dependencias
- Stack: PostgreSQL + MongoDB + Redis + ELK
- Scripts de configuración

### Herramientas
- OpenSSL para criptografía
- Wireshark para análisis de tráfico
- OWASP ZAP para testing de seguridad

---

*Manual expandido del Módulo 3: Implementación Técnica*
*Versión: 1.0 - Agosto 2026*
*25 horas de contenido | 58 preguntas | 3 laboratorios*
