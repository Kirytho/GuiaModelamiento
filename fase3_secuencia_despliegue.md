# FASE 3: DIAGRAMA DE SECUENCIA Y DESPLIEGUE - MEDIACONNECT

## 1. DIAGRAMA DE SECUENCIA

### 1.1 Proceso de Pago y Reserva (RF1 + RF4)

```
Paciente          API Gateway    Patient Service    Billing Module    Pasarela Pago    Paciente
    │                  │                │                │                │                │
    │ 1. Buscar Médico  │                │                │                │                │
    │─────────────────▶│                │                │                │                │
    │                  │                │                │                │                │
    │ 2. Filtrar Disp.  │                │                │                │                │
    │─────────────────▶│─────────────────▶│                │                │                │
    │                  │                │                │                │                │
    │ 3. GET /medicos  │                │                │                │                │
    │                  │─────────────────▶│                │                │                │
    │                  │                │ 4. ValidarDisp │                │                │
    │                  │                │────────────────▶│                │                │
    │                  │                │                │                │                │
    │ 5. Ver Cita       │                │                │               │                │
    │─────────────────▶│─────────────────▶│               │               │                │
    │                  │ 6. GET /citas   │               │               │                │
    │                  │─────────────────▶│              │               │                │
    │                  │                │ 7. ValidarDisp│               │                │
    │                  │                │────────────────▶│              │                │
    │                  │                │                │ 8. Verificar  │                │
    │                  │                │                │──────────────▶│               │
    │                  │                │                │ 9. Ok        │               │
    │                  │                │                │◀─────────────│               │
    │                  │                │ 10. Respuesta │               │               │
    │                  │◀────────────────│               │               │               │
    │                  │                │               │               │               │
    │ 11. Confirmar Res│                │               │               │               │
    │────────────────▶│─────────────────▶│              │               │               │
    │                  │ 12. POST /citas │               │               │               │
    │                  │─────────────────▶│              │               │               │
    │                  │                │ 13. Guardar   │               │               │
    │                  │                │────────────────▶│              │               │
    │                  │                │                │ 14. Crear Pago│              │
    │                  │                │                │──────────────▶│              │
    │                  │                │                │               │               │
    │                  │                │                │ 15. POST /trans │             │
    │                  │                │                │                │──────────────▶│
    │                  │                │                │                │ 16. Procesar│
    │                  │                │                │                │◀─────────────│
    │                  │                │                │ 17. Respuesta│               │
    │                  │                │◀────────────────│              │               │
    │ 18. Comprobante  │                │                │               │               │
    │─────────────────▶│────────────────────────────────▶│             │               │
    │                  │ 19. GET /pagos/{id}                    │             │
    │                  │────────────────────────────────────────▶│           │
    │                  │                │ 20. GetDetalle   │             │
    │                  │                │─────────────────▶│            │
    │                  │                │                │ 21. Gen PDF│            │
    │                  │                │                │────────────▶│            │
    │                  │                │                │ 22. Comp   │◀───────────│
    │                  │                │ 23. Comp   │                │            │
    │                  │◀────────────────│                 │             │
    │ 24. Email/SMS    │                │                 │             │
    │─────────────────▶│─────────────────▶│                 │             │
    │                  │ 25. NOTIFY     │                 │             │
    │                  │─────────────────▶│                │             │
    │ 26. Confirmación │                │                 │             │
    │◀─────────────────│◀────────────────│                 │             │
```

**Mensajes clave:**
- `POST /citas` - Creación de cita
- `POST /pago` - Inicialización de pago  
- `POST /transaccion` - Procesamiento con pasarela
- `GET /pagos/{id}` - Obtención de detalle de pago
- `NOTIFY` - Notificación al paciente

**Responsables:**
- Paciente: Búsqueda, filtro, confirmación, pago
- Patient Service: Gestión de citas
- Billing Module: Procesamiento de pagos
- Pasarela de Pago: Transacción financiera

---

### 1.2 Registro de Historial Clínico (RF2)

```
Médico      API Gateway    Medical Service    Clinical History    Patient
    │             │                │                │                │
    │ 1. Login    │                │                │                │
    │───────────▶│                │                │                │
    │             │ 2. POST /auth  │                │                │
    │             │────────────────▶              │                │
    │             │                │ 3. Validar JWT │                │
    │             │                │──────────────▶│                │
    │             │                 │ 4. Claims     │                │
    │             │                 │◀──────────────│                │
    │             │ 5. Auth OK      │                │                │
    │             │◀────────────────│               │                │
    │             │                │               │                │
    │ 6. Buscar Paciente │         │                │                │
    │──────────────────────▶       │                │                │
    │             │ 7. GET /pacientes/search?q=dni │        │                │
    │             │────────────────────────▶      │        │                │
    │             │                │ 8. Buscar     │        │                │
    │             │                │────────────────▶│       │                │
    │             │                │                │ 9. Encontrar │          │
    │             │                │                │◀─────────────│          │
    │             │                │ 10. Historial │             │          │
    │             │                │◀────────────────│             │          │
    │             │ 11. Response │                │             │          │
    │◀────────────│               │               │             │          │
    │             │               │               │             │          │
    │ 12. Ver Historial │         │               │             │          │
    │────────────────────▶      │               │             │          │
    │             │ 13. GET /historial/{id}     │             │          │
    │             │────────────────────▶       │             │          │
    │             │               │ 14. Load     │             │          │
    │             │               │────────────────▶│           │          │
    │             │                │                │ 15. Response │        │
    │             │               │                │◀───────────────│        │
    │             │ 16. Response│                │             │        │
    │◀────────────│                                           │              │
    │             │               │               │              │              │
    │ 17. Registrar Diagnóstico │                            │              │
    │─────────────────────▶       │                            │              │
    │             │ 18. POST /historial/{id}/diagnosticos │    │              │
    │             │────────────────────────────▶            │    │              │
    │             │               │ 19. Guardar Diag.      │    │              │
    │             │               │─────────────────────────▶│     │              │
    │             │               │                │ 20. Response│     │              │
    │             │               │◀─────────────────────────│     │              │
    │             │ 21. Response│                              │     │              │
    │◀────────────│                                         │          │              │
    │             │               │               │              │              │
    │ 22. Emitir Receta │                                        │          │              │
    │────────────────────▶          │                        │          │              │
    │             │ 23. POST /historial/{id}/recetas   │        │              │
    │             │────────────────────────▶             │        │              │
    │             │               │ 24. Guardar Receta  │        │              │
    │             │               │────────────────────▶│        │              │
    │             │               │                │ 25. Response│    │              │
    │             │               │◀──────────────────│        │              │
    │             │ 26. Response│                           │        │              │
    │◀────────────│                                         │        │              │
    │             │               │               │              │              │
    │ 27. Notificar Paciente │                                │        │              │
    │─────────────────────▶        │                         │        │              │
    │             │ 28. NOTIFY /notifications            │        │              │
    │             │────────────────────────▶             │        │              │
```

**Mensajes clave:**
- `POST /auth` - Autenticación médico
- `GET /pacientes/search?q=dni` - Búsqueda paciente
- `GET /historial/{id}` - Consulta historial
- `POST /historial/{id}/diagnosticos` - Registro diagnóstico
- `POST /historial/{id}/recetas` - Emisión receta

**Responsables:**
- Médico: Login, búsqueda paciente, diagnóstico, receta
- Medical Service: Gestión historial clínico
- Clinical History Service: Persistencia de datos médicos
- Paciente: Recepción de receta

---

### 1.3 Inicio de Videoconferencia (RF3)

```
Paciente       Médico      API Gateway    Teleconsult Module    Signaling Server    Media Router
    │              │              │                │                │                │
    │ 1. Solicitar VC│              │                │                │                │
    │─────────────────▶             │                │                │                │
    │              │ 2. POST /videoconferencias/solicitar │        │                │
    │              │              │────────────────▶│                │                │
    │              │              │ 3. Verificar cita │             │                │
    │              │              │──────────────▶   │             │                │
    │              │              │                │ 4. Validar  │                │
    │              │              │                │─────────────▶│                │
    │              │              │                │ 5. OK        │                │
    │              │              │                │◀─────────────│                │
    │              │              │ 6. Response con datos VC│    │                │
    │              │◀────────────────│                │              │                │
    │ 7. Recibir VC│              │                │                │                │
    │◀──────────────────────────────│                │                │                │
    │              │              │                │                │                │
    │ 8. Conectar  │              │                │                │                │
    │─────────────▶│              │                │                │                │
    │              │ 9. GET /videoconferencias/{id}/sala │       │                │
    │              │              │────────────────▶│                │                │
    │              │              │                │ 10. Crear Sala│              │
    │              │              │                │──────────────▶│              │
    │              │              │                │                │ 11. Generar ID│
    │              │              │                │                │──────────────▶│
    │              │              │                │                │ 12. Token    │
    │              │              │                │                │◀──────────────│
    │              │              │                │ 13. Response │              │
    │              │◀────────────────│                │              │                │
    │ 14. Iniciar  │              │                │                │                │
    │◀─────────────│              │                │                │                │
    │              │ 15. GET /videoconferencias/{id}/token  │      │                │
    │              │              │────────────────▶│                │                │
    │              │              │                │ 16. WS Connect│              │
    │              │              │                │──────────────▶│              │
    │              │              │                │                │ 17. WS Handshake│
    │              │              │                │                │◀──────────────│
    │              │              │                │                │ 18. Connected │
    │              │◀─────────────│                │                │                │
    │ 19. Iniciar VC│              │                │                │                │
    │◀─────────────│              │                │                │                │
    │              │ 20. POST /videoconferencias/{id}/iniciar │     │                │
    │              │              │────────────────▶│                │                │
    │              │              │                │ 21. Start Media│              │
    │              │              │                │──────────────▶│              │
    │              │              │                │                │ 22. Media OK  │
    │              │              │                │                │◀──────────────│
    │              │              │                │ 23. Response  │              │
    │              │◀────────────────│                               │                │
    │ 24. VC Ready │              │                │                │                │
    │◀─────────────│              │                │                │                │
```

**Mensajes clave:**
- `POST /videoconferencias/solicitar` - Solicitud de videoconferencia
- `GET /videoconferencias/{id}/sala` - Obtención de sala
- `GET /videoconferencias/{id}/token` - Token de conexión WS
- `POST /videoconferencias/{id}/iniciar` - Iniciar consulta
- `WS Connect` - Conexión WebSocket signaling
- `Start Media` - Iniciar flujo de medios

**Responsables:**
- Paciente: Solicitud y conexión
- Médico: Sala y control
- Teleconsult Module: Señalización y media routing
- Signaling Server: WebSocket para control
- Media Router: STUN/TURN para media

---

## 2. DIAGRAMA DE DESPLIEGUE

### 2.1 Topología de Infraestructura

```
                    ╔═══════════════════════════════════════════════════════════════╗
                    ║                    INTERNET PÚBLICO (TLS 1.3)                   ║
                    ╚═══════════════╤═══════════════════════════════════════════════╝
                                    │
                                    ▼
                    ╔═══════════════════════════════════════════════════════════════╗
                    ║                    EDGE LAYER - CDN                            ║
                    ║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ ║
                    ║  │  Cloudflare CDN │  │ CloudFront CDN  │  │    Akamai CDN   │ ║
                    ║  │    POP Global   │  │   POP Global    │  │    POP Global   │ ║
                    ║  └─────────────────┘  └─────────────────┘  └─────────────────┘ ║
                    ╚═══════════════════════╤═════════════════════════════════════╝
                                        │
                                        ▼
                    ╔═══════════════════════════════════════════════════════════════╗
                    ║                    LOAD BALANCER (TLS 1.3)                       ║
                    ║  ┌──────────────────────────────────────────────────────────┐   ║
                    ║  │              NGINX/ALB (Port 443)                       │   ║
                    ║  │  - Health Check: /health (30s)                         │   ║
                    ║  │  - Round Robin + Sticky Sessions (JWT)                │   ║
                    ║  │  - Certificado SSL: Let's Encrypt / ACM                 │   ║
                    ║  │  - Rate Limiting: 1000 req/min por IP                   │   ║
                    ║  └──────────────────────────────────────────────────────────┘   ║
                    ╚═══════════════════════╤═════════════════════════════════════╝
                                ┌─────────────┴─────────────┐
                                │                           │
                                ▼                           ▼
        ╔════════════════════════════════════════╗   ╔════════════════════════════════════════╗
        ║     WEB APPLICATION SERVERS          ║   ║     WEB APPLICATION SERVERS            ║
        ║  ┌───────────────────────────────┐     ║   ║  ┌───────────────────────────────┐     ║
        ║  │       Server 1 (Node.js)      │     ║   ║  │       Server 2 (Node.js)      │     ║
        ║  │  ┌───────────────────────┐    │     ║   ║  │  ┌───────────────────────┐    │     ║
        ║  │  │   Web App Frontend    │    │     ║   ║  │  │   Web App Frontend    │    │     ║
        ║  │  │   (React 18)          │    │     ║   ║  │  │   (React 18)          │    │     ║
        ║  │  └───────────────────────┘    │     ║   ║  │  └───────────────────────┘    │     ║
        ║  │  ┌───────────────────────┐    │     ║   ║  │  ┌───────────────────────┐    │     ║
        ║  │  │   API Gateway (NGINX) │    │     ║   ║  │  │   API Gateway (NGINX) │    │     ║
        ║  │  └───────────────────────┘    │     ║   ║  │  └───────────────────────┘    │     ║
        ║  │  ┌───────────────────────┐    │     ║   ║  │  ┌───────────────────────┐    │     ║
        ║  │  │   Microservice        │    │     ║   ║  │  │   Microservice        │    │     ║
        ║  │  │   Containers (Docker) │    │     ║   ║  │  │   Containers (Docker) │    │     ║
        ║  │  └───────────────────────┘    │     ║   ║  │  └───────────────────────┘    │     ║
        ║  │     Active/Standby            │     ║   ║  │     Active/Standby           │     ║
        ║  └───────────────────────────────┘     ║   ║  └───────────────────────────────┘     ║
        ╚════════════════════════════════════════╝   ╚════════════════════════════════════════╝
                                │                           │
                                └─────────────┬─────────────┘
                                              │
                                              ▼
                    ╔═══════════════════════════════════════════════════════════════╗
                    ║                   DATABASE LAYER (VPC Private)                 ║
                    ║                                                               ║
                    ║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ ║
                    ║  │  PostgreSQL 15  │  │     Redis 7     │  │    MinIO/S3     │ ║
                    ║  │    Primary      │  │    Cache        │  │   Storage       │ ║
                    ║  │  db.t3.large    │  │  redis.t3.micro │  │   (GP3 500GB)   │ ║
                    ║  │  100GB SSD      │  │  ACL + AOF      │  │   SSE-S3 Enc    │ ║
                    ║  └─────────────────┘  └─────────────────┘  └─────────────────┘ ║
                    ║         │                                                          ║
                    ║  ┌─────────────────┐  ◄── Read Replica (Async)                      ║
                    ║  │  PostgreSQL     │                                                 ║
                    ║  │    Replica      │                                                 ║
                    ║  └─────────────────┘                                                 ║
                    ╚═══════════════════════════════════════════════════════════════════╝
                                      │
                   ┌──────────────────┼──────────────────┐
                   ▼                  ▼                  ▼
    ╔═══════════════════════╗  ╔═══════════════════════╗  ╔═══════════════════════╗
    ║   EXTERNAL PAYMENT    ║  ║   HCN API (Health)    ║  ║   ANALYTICS (ML)      ║
    ║   ╔═══════════════╗   ║  ║   ╔═══════════════╗   ║  ║   ╔═══════════════╗   ║
    ║   ║   Stripe API  ║   ║  ║   ║    HCN API    ║   ║  ║   │  Data Lake    │   ║
    ║   ║  (PCI-DSS)    ║   ║  ║   │ (Opcional)    │   ║  ║   │   (BigQuery)  │   ║
    ║   ╚═══════════════╝   ║  ║   ╚═══════════════╝   ║  ║   ╚═══════════════╝   ║
    ╚═══════════════════════╝  ╚═══════════════════════╝  ╚═══════════════════════╝
                                      │
                                      ▼
                    ╔═══════════════════════════════════════════════════════════════╗
                    ║              MONITORING & LOGGING (VPC)                      ║
                    ║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ ║
                    ║  │   Prometheus    │  │    Grafana      │  │    ELK Stack    │ ║
                    ║  │   (Metrics)     │  │  (Dashboards)   │  │ (Logs)          │ ║
                    ║  └─────────────────┘  └─────────────────┘  └─────────────────┘ ║
                    ║         │                                                          ║
                    ║  ┌─────────────────┐                                                ║
                    ║  │ AlertManager    │                                                ║
                    ║  │ (Slack/Email)    │                                                ║
                    ║  └─────────────────┘                                                ║
                    ╚═══════════════════════════════════════════════════════════════╝
```

---

### 2.2 Especificaciones Técnicas de Infraestructura

#### Servidores Web (Nginx Cluster)
- **Tipo**: EC2 t3.medium (2 vCPU, 4GB RAM) - AWS / e2-medium - GCP
- **Balanceo**: Round-robin + Sticky Sessions (JWT)
- **HTTPS**: TLS 1.3, Perfect Forward Secrecy, certificados automáticos Let's Encrypt
- **Rate Limiting**: 1000 requests/min por IP
- **Autoscaling**: Rango 2-5 instancias según carga

#### Base de Datos Primaria (PostgreSQL)
- **Tipo**: RDS PostgreSQL 15 (db.t3.large)
- **Almacenamiento**: GP3, 100GB SSD
- **Backups**: Automatizados diarios, 30 días de retención
- **Replicación**: Replica async para lecturas
- **Encriptación**: AES-256 en reposo y tránsito

#### Base de Datos Secundaria (Redis)
- **Tipo**: ElastiCache Redis (redis.t3.micro)
- **Uso**: Sessions, cache de disponibilidad, rate limiting
- **Persistencia**: RDB + AOF
- **Cluster**: Modo cluster para alta disponibilidad

#### Almacenamiento de Archivos (MinIO/S3)
- **Bucket**: mediconnect-files
- **Política**: Private con presigned URLs
- **Tipos**: Recetas PDF, documentos médicos, logs
- **Encriptación**: SSE-S3

#### Pasarela de Pago
- **Proveedor**: Stripe API
- **Modo**: Webhooks para confirmaciones en tiempo real
- **Monedas**: ARS, USD, EUR (configurable por región)
- **Seguridad**: PCI-DSS Level 1, 3D Secure

---

### 2.3 Alta Disponibilidad (99.9%)

```
                    ┌───────────────────────────────────────┐
                    │         MULTI-AZ DEPLOYMENT              │
                    ├───────────────────────────────────────┤
                    │  Zona de Disponibilidad A  │  Zona B   │
                    │  ┌─────────────────┐   │  ┌─────────┐  │
                    │  │ Load Balancer   │   │  │ LB      │  │
                    │  │ (Primary)       │   │  │ (Backup)│  │
                    │  └────────┬────────┘   │  └────┬────┘  │
                    │           │            │       │       │
                    │  ┌────────▼────────┐   │  ┌────▼────┐  │
                    │  │ Web Servers     │   │  │ Web     │  │
                    │  │ 2 activos       │   │  │ Servers │  │
                    │  └─────────────────┘   │  └─────────┘  │
                    │           │            │       │       │
                    │           ▼            │       ▼       │
                    │  ┌─────────────────┐   │  ┌─────────┐  │
                    │  │ DB Primary      │   │  │ DB      │  │
                    │  │ (Master)        │   │  │ Replica │  │
                    │  │ AZ A            │   │  │ AZ B    │  │
                    │  └─────────────────┘   │  └─────────┘  │
                    └───────────────────────────────────────┘
                    
                    SLA: 99.9% = 8.77 horas caída/año máximo
                    RTO: < 5 minutos (Recovery Time Objective)
                    RPO: < 1 minuto (Recovery Point Objective)
```

#### Políticas de Alta Disponibilidad:
- **Multi-AZ**: Despliegue en mínimo 2 zonas de disponibilidad
- **Health Checks**: Endpoint `/health` cada 30 segundos
- **Auto Scaling**: Reglas basadas en CPU y response time
- **Failover Automático**: Nodo secundario toma el relevo
- **Database Sync**: Replica en tiempo real (async)
- **DNS Failover**: Route 53 con health checks

---

### 2.4 Conexiones y Seguridad

```
                    Capa de Conexión Segura (HTTPS/TLS 1.3)
                    
    Paciente ──HTTPS/TLS 1.3──► DNS (app.mediconnect.health)
                                     │
                                     ▼
                    ┌─────────────────────────────────────┐
                    │         CDN (Cloudflare)            │
                    │  - Cache de contenido estático    │
                    │  - 0 TTL para contenido dinámico  │
                    │  - DDoS Protection                │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │         Load Balancer               │
                    │  - Termina TLS 1.3 (PFS)          │
                    │  - Certificado SSL (ACME)           │
                    │  - Rate Limiting                  │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │    Web Application Servers        │
                    │  - Docker containers              │
                    │  - Nginx + Node.js 18 + Express   │
                    │  - JWT Authentication           │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                           VPN/IPSec (VPC Peering)
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │        Database Tier (Private)      │
                    │  - PostgreSQL Master (Write)      │
                    │  - PostgreSQL Replica (Read)      │
                    │  - Redis Cluster                  │
                    │  - MinIO/S3 Storage               │
                    └─────────────────────────────────────┘
```

---

### 2.5 Ubicaciones de Componentes y Redes

| Componente | VPC Subnet | Zona Disponibilidad | IP Privada | Puerto |
|------------|-----------|---------------------|------------|--------|
| Load Balancer | Public Subnet | AZ-A, AZ-B | 10.0.1.10, 10.0.2.10 | 443 |
| Web Server 1 | Private Subnet | AZ-A | 10.0.10.20 | 3000 |
| Web Server 2 | Private Subnet | AZ-A | 10.0.10.21 | 3000 |
| Web Server N | Private Subnet | AZ-B | 10.0.20.20 | 3000 |
| PostgreSQL Primary | DB Subnet | AZ-A | 10.0.100.10 | 5432 |
| PostgreSQL Replica | DB Subnet | AZ-B | 10.0.100.11 | 5432 |
| Redis Master | Cache Subnet | AZ-A | 10.0.50.10 | 6379 |
| Redis Slave | Cache Subnet | AZ-B | 10.0.50.11 | 6379 |
| MinIO Node 1 | Storage Subnet | AZ-A | 10.0.60.10 | 9000 |
| MinIO Node 2 | Storage Subnet | AZ-B | 10.0.60.11 | 9000 |

**Network ACLS:**
- SG-Frontend: Puertos 80/443 desde Internet
- SG-App: Puertos 3000-3001 solo desde SG-LoadBalancer
- SG-DB: Puerto 5432 solo desde SG-App
- SG-Cache: Puerto 6379 solo desde SG-App
- SG-Storage: Puerto 9000 solo desde SG-App

---

## 3. RESUMEN TÉCNICO

### Diagramas de Secuencia Generados:
1. **RF1 + RF4**: Proceso completo de búsqueda, reserva y pago de consulta
2. **RF2**: Registro y consulta de historial clínico con diagnósticos y recetas
3. **RF3**: Establecimiento de videoconferencia médica con signaling WebSocket

### Diagrama de Despliegue Generado:
- **Topología**: 3 capas (Edge, Application, Database)
- **Load Balancer**: NGINX con TLS 1.3 terminación
- **Web Servers**: 2+ nodos activos con autoscaling
- **DB Cluster**: PostgreSQL con replica async + Redis + S3
- **Alta Disponibilidad**: 99.9% SLA con Multi-AZ
- **Conexiones**: HTTPS/TLS 1.3, DNS, CDN, WAF

---

## REQUISITOS CUMPIDOS:
S1

## PENDIENTES:

---

FIN-3fa5b