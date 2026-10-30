# FASE 2: DIAGRAMAS DE CLASES Y COMPONENTES - MEDIACONNECT

## 1. DIAGRAMA DE CLASES DEL DOMINIO

### Clases Principales del Dominio

```
┌─────────────────────────────────────────────────────────────────┐
│                              PACIENTE                            │
├─────────────────────────────────────────────────────────────────┤
│ - pacienteId: UUID                                              │
│ - nombre: String                                                │
│ - apellido: String                                              │
│ - email: String                                                 │
│ - telefono: String                                              │
│ - dni: String                                                   │
│ - fechaNacimiento: DateTime                                     │
│ - genero: Enum [MASCULINO, FEMENINO, OTRO]                      │
│ - direccion: Direccion                                          │
│ - creadoEn: DateTime                                            │
│ - actualizadoEn: DateTime                                       │
├─────────────────────────────────────────────────────────────────┤
│ + registrar(): void                                             │
│ + actualizarPerfiles(): void                                    │
│ + obtenerHistorial(): HistorialClinico                          │
│ + reservarCita(cita: Cita): Cita                               │
│ + pagarConsulta(pago: Pago): Pago                              │
└─────────────────────────────────────────────────────────────────┘
                                 │ 1
                                 │
                                 │ tiene muchos
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         HISTORIAL CLÍNICO                      │
├─────────────────────────────────────────────────────────────────┤
│ - historialId: UUID                                           │
│ - pacienteId: UUID                                            │
│ - medicoId: UUID                                              │
│ - fechaCreacion: DateTime                                       │
│ - ultimaActualizacion: DateTime                               │
│ - estaActivo: Boolean                                         │
│ - diagnosticos: List<Diagnostico>                             │
│ - recetas: List<Receta>                                       │
│ - notas: List<String>                                         │
├─────────────────────────────────────────────────────────────────┤
│ + agregarDiagnostico(d: Diagnostico): void                    │
│ + agregarReceta(r: Receta): void                              │
│ + buscarPorfecha(f: Date): List<Nota>                          │
│ + obtenerUltimasConsultas(n: Integer): List<Consulta>       │
└─────────────────────────────────────────────────────────────────┘
                                 ▲
                                 │
                                 │ contiene
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                           DIAGNÓSTICO                           │
├─────────────────────────────────────────────────────────────────┤
│ - diagnosticoId: UUID                                         │
│ - historialId: UUID                                           │
│ - codigoCIE10: String                                         │
│ - descripcion: String                                         │
│ - tipo: Enum [PRIMARY, SECONDARY, CONFIRMATORY]               │
│ - fechaRegistro: DateTime                                     │
│ - observaciones: String                                       │
│ - urgencia: Enum [BAJA, MEDIA, ALTA]                          │
├─────────────────────────────────────────────────────────────────┤
│ + validarCodigoCIE10(): Boolean                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                            RECETA                               │
├─────────────────────────────────────────────────────────────────┤
│ - recetaId: UUID                                              │
│ - historialId: UUID                                           │
│ - medicoId: UUID                                              │
│ - pacienteId: UUID                                            │
│ - fechaEmision: DateTime                                      │
│ - fechaVencimiento: DateTime                                    │
│ - estado: Enum [ACTIVA, CUMPLIDA, VENCIDA]                    │
│ - medicamentos: List<MedicamentoRecetado>                     │
│ - observaciones: String                                       │
├─────────────────────────────────────────────────────────────────┤
│ + agregarMedicamento(m: Medicamento): void                    │
│ + generarCodigoQR(): String                                   │
│ + validarEstado(): Boolean                                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ contiene
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MEDICAMENTO RECETADO                        │
├─────────────────────────────────────────────────────────────────┤
│ - medicamentoId: UUID                                         │
│ - nombre: String                                              │
│ - dosis: String                                               │
│ - frecuencia: String                                          │
│ - duracion: Integer (días)                                    │
│ - viaAdministracion: Enum [ORAL, INYECTABLE, TOPICO, INHALADO] │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                            MÉDICO                               │
├─────────────────────────────────────────────────────────────────┤
│ - medicoId: UUID                                              │
│ - usuarioId: UUID                                             │
│ - numeroMatricula: String                                     │
│ - especialidadId: UUID                                        │
│ - headshotUrl: String                                         │
│ - tarifaConsulta: Decimal                                     │
│ - disponibilidad: List<Horario>                               │
│ - citas: List<Cita>                                           │
├─────────────────────────────────────────────────────────────────┤
│ + registrarDiagnostico(): Diagnostico                        │
│ + emitirReceta(): Receta                                     │
│ + iniciarVideoconferencia(): Sala                            │
│ + actualizarDisponibilidad(): void                            │
└─────────────────────────────────────────────────────────────────┘
                                 ▲
                                 │
                                 │ es experto en
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                         ESPECIALIDAD                           │
├─────────────────────────────────────────────────────────────────┤
│ - especialidadId: UUID                                        │
│ - nombre: String                                              │
│ - codigo: String (ej: CARDIO, PED, DERMA)                     │
│ - descripcion: String                                         │
│ - medicos: List<Medico>                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                             CITA                                │
├─────────────────────────────────────────────────────────────────┤
│ - citaId: UUID                                                │
│ - pacienteId: UUID                                            │
│ - medicoId: UUID                                              │
│ - fechaHora: DateTime                                         │
│ - estado: Enum [PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA]  │
│ - tipo: Enum [PRESENCIAL, TELECONSULTA]                       │
│ - pagoId: UUID (opcional)                                     │
│ - codigoConfirmacion: String                                  │
│ - notas: String                                               │
├─────────────────────────────────────────────────────────────────┤
│ + confirmar(): void                                             │
│ + cancelar(): void                                            │
│ + completar(): void                                           │
│ + generarEnlaceVideoconferencia(): String                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ genera
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                             PAGO                                │
├─────────────────────────────────────────────────────────────────┤
│ - pagoId: UUID                                                │
│ - citaId: UUID                                                │
│ - pacienteId: UUID                                            │
│ - medicoId: UUID                                              │
│ - monto: Decimal                                              │
│ - moneda: String (ARS, USD, EUR)                              │
│ - metodo: Enum [TARJETA, MERCADO_PAGO, BILLETERA]              │
│ - estado: Enum [PENDIENTE, COMPROBADO, RECHAZADO, DEVUELTO]    │
│ - numeroTransaccion: String                                   │
│ - fechaProceso: DateTime                                      │
│ - comprobanteUrl: String                                      │
├─────────────────────────────────────────────────────────────────┤
│ + procesar(): Pago                                              │
│ + emitirComprobante(): Comprobante                             │
│ + reembolsar(): Pago                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      USUARIO (Clase Base)                        │
├─────────────────────────────────────────────────────────────────┤
│ - usuarioId: UUID                                             │
│ - email: String                                               │
│ - passwordHash: String                                          │
│ - rol: Enum [PACIENTE, MEDICO, ADMIN]                         │
│ - estaActivo: Boolean                                         │
│ - ultimoIngreso: DateTime                                     │
│ - intentosLogin: Integer                                      │
├─────────────────────────────────────────────────────────────────┤
│ + autenticar(email, password): Token                          │
│ + recuperarContrasena(): void                                 │
│ + cambiarContrasena(): void                                   │
└─────────────────────────────────────────────────────────────────┘
                                      ▲
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
    ┌─────────┴─────────┐ ┌─────────┴─────────┐ ┌─────────┴─────────┐
    │     PACIENTE      │ │      MÉDICO       │ │     ADMIN         │
    │ hereda de Usuario │ │ hereda de Usuario │ │ hereda de Usuario │
    └───────────────────┘ └───────────────────┘ └───────────────────┘
```

### Relaciones entre Clases

| Clase Origen | Tipo Relación | Clase Destino | Cardinalidad | Comentario |
|-------------|---------------|---------------|--------------|------------|
| Paciente | 1..* | HistorialClinico | 1 a N | Un paciente tiene uno o más historiales |
| Medico | 1..* | Cita | 1 a N | Un médico atiende varias citas |
| Paciente | 1..* | Cita | 1 a N | Un paciente tiene varias citas |
| Cita | 1 | Pago | 1 a 1 | Cada cita puede tener un pago |
| Medico | 1..* | Receta | 1 a N | Un médico emite varias recetas |
| Paciente | 1..* | Receta | 1 a N | Un paciente recibe varias recetas |

---

## 2. DIAGRAMA DE COMPONENTES DE DESARROLLO

### Arquitectura de Componentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  /api/v1/pacientes                                                  │  │
│  │  /api/v1/medicos                                                    │  │
│  │  /api/v1/citas                                                    │  │
│  │  /api/v1/pagos                                                    │  │
│  │  /api/v1/teleconsultas                                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│   AUTH SERVICE      │ │ PATIENT SERVICE     │ │  MEDICAL SERVICE    │
│  (Microservicio)    │ │  (Microservicio)    │ │   (Microservicio)   │
├─────────────────────┤ ├─────────────────────┤ ├─────────────────────┤
│ - JWT Authentication│ │ - Citas Management  │ │ - Historial Clínico │
│ - OAuth2 Provider  │ │ - Availability     │ │ - Diagnostico       │
│ - User Management  │ │ - Booking Flow     │ │ - Recetas           │
│ - Role Management  │ │ - Reminders        │ │ - Clinical Notes    │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
           │                       │                       │
           │                       │                       │
           └───────────────────────┼───────────────────────┘
                                   │
                                   ▼
┌─────────────────────┐ ┌─────────────────────┐
│   BILLING MODULE    │ │ TELECONSULT MODULE  │
│   (Microservicio)   │ │   (Microservicio)   │
├─────────────────────┤ ├─────────────────────┤
│ - Payment Processing│ │ - Video Conference  │
│ - Invoice Generation│ │ - Signaling Server  │
│ - Refunds          │ │ - Recording Mgmt    │
│ - Tax Calculations │ │ - Quality Metrics   │
└─────────────────────┘ └─────────────────────┘
           │                       │
           │                       │
           ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INTEGRACIÓN EXTERNA                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Pasarela de Pago (Stripe/PayPal) ◄─── API REST ──► Pasarela de Pago      │
│  Historia Clínica Nacional ◄─── API ──► HCN (Opcional)                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND WEB PORTAL                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐            │
│  │   Paciente UI    │  │    Medico UI     │  │   Admin UI       │            │
│  │                  │  │                  │  │                  │            │
│  │ - Dashboard      │  │ - Agenda         │  │ - Users          │            │
│  │ - Citas          │  │ - Historias      │  │ - Reports        │            │
│  │ - Historial      │  │ - Recetas        │  │ - Analytics      │            │
│  │ - Recetas        │  │ - Teleconsultas  │  │ - System Mgmt    │            │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Detalle de Componentes

#### 1. API Gateway Componentes
- **Request Router**: Enruta peticiones según path y método
- **Rate Limiter**: Controla cuotas por usuario/IP
- **Authentication Middleware**: Valida tokens JWT
- **Logging Service**: Registra requests/responses

#### 2. Auth Service
- **User Repository**: Acceso a base de datos usuarios
- **Token Service**: Genera/valida JWT
- **Password Hasher**: bcrypt/scrypt
- **Role Manager**: Asignación de roles

#### 3. Patient Service
- **Booking Service**: Lógica de agendamiento
- **Notification Service**: Email/SMS/Telegram
- **Availability Checker**: Verifica horarios

#### 4. Medical Service
- **Clinical History Service**: Gestión historial
- **Prescription Service**: Generación recetas
- **Diagnosis Service**: Registro diagnósticos

#### 5. Billing Module
- **Payment Gateway Adapter**: Integración pasarela
- **Invoice Generator**: PDF/comprobantes
- **Tax Calculator**: Impuestos locales

#### 6. Teleconsult Module
- **Signaling Server**: WebSocket para señalización
- **Media Router**: STUN/TURN server
- **Recording Service**: Grabación sesiones

#### 7. Database Components
- **Primary DB**: PostgreSQL (ACID compliance)
- **Cache Layer**: Redis (sesiones, disponibilidad)
- **File Storage**: S3/MinIO (documentos, recetas)

#### 8. Infrastructure Components
- **Load Balancer**: NGINX
- **CDN**: Cloudflare/CloudFront
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

---

*Documento generado para la Fase 2 del proyecto MediConnect - Paradigma 4+1 UML*
*Diagramas vectoriales disponibles en: diagramas/clases.png, diagramas/componentes.png*