# FASE 1 COMPLETA - REQUERIMIENTOS Y CASOS DE USO

**Proyecto:** MediConnect - Guía de Modelamiento UML 4+1
**Fecha:** 2026-10-30
**Autor:** Análisis de la guía completa de MediConnect

---

## 1. MATRIZ DE REQUERIMIENTOS

### Requerimientos Funcionales (RF)

| ID | Requerimiento | Prioridad | Complejidad | Detalle / Comentario |
|----|---------------|-----------|-------------|---------------------|
| RF1 | Gestión y Agendamiento de Citas | Alta | Media | El paciente busca profesionales por especialidad, filtra por disponibilidad horaria y confirma la reserva de la cita médica. |
| RF2 | Registro de Historial Clínico | Alta | Alta | Consulta y actualización de fichas médicas, diagnósticos, recetas digitales y registro de consultas. |
| RF3 | Módulo de Videoconferencia Médica | Alta | Alta | Teleconsultas en tiempo real con audio y video de alta calidad entre paciente y médico. |
| RF4 | Procesamiento de Pagos y Facturación | Media | Media | Integración con pasarela de pago externa, generación de comprobante digital con código QR, notificación por email y SMS. |

### Requerimientos No Funcionales (RNF)

| ID | Requerimiento | Prioridad | Complejidad | Detalle / Comentario |
|----|---------------|-----------|-------------|---------------------|
| RNF1 | Alta Disponibilidad Operativa (99.9%) | Alta | Alta | El sistema debe garantizar un uptime del 99.9% continuo durante el horario hábil de atención médica. |
| RNF2 | Seguridad y Confidencialidad de Datos | Alta | Media | Toda la información médica y transaccional debe encriptarse en tránsito (TLS 1.3) y en reposo (AES-256) acorde a normativas sanitarias. |

---

## 2. ACTORES IDENTIFICADOS

| Actor | Tipo | Descripción del Rol |
|-------|------|---------------------|
| **Paciente** | Actor Primario | Usuario principal de la plataforma. Busca profesionales, agenda citas, consulta su historial clínico, recibe recetas digitales y realiza pagos. |
| **Médico** | Actor Primario | Profesional de la salud que registra diagnósticos, emite recetas, atiende teleconsultas por videoconferencia y genera facturas. |
| **Sistema de Pago** | Actor Secundario (Externo) | Sistema externo que recibe solicitudes de transacción, procesa pagos, confirma operaciones y emite comprobantes digitales. |

---

## 3. DIAGRAMA DE CASOS DE USO (UML EN TEXTO ASCII)

```

                    +----------------------------------+
                    |         MEDICONNECT              |
                    |      Sistema de Salud             |
                    +----------------------------------+
                               | ^
           +-------------------+ +-------------------+
           |                     |
           v                     v
     +-----------+         +-----------+
     |  PACIENTE |         |   MEDICO  |
     +-----------+         +-----------+
           |                     |
           |                     |
           |      +-------------+-------------+
           |      |                           |
           v      v                           v
    +-------------+           +---------------------+
    | Buscar      |           | Consultar Pacientes |
    | Profesional |           +---------------------+
    +-------------+                     |
           |                             v
           v                    +---------------------+
    +-------------+             | Ver Historial       |
    | Consultar   |             | Clínico             |
    | Disponibilidad            +---------------------+
    +-------------+                     |
           |                             v
           v                    +---------------------+
    +-------------+             | Registrar Diagnóstico|
    | Reservar    |             +---------------------+
    | Cita Médica |                     |
    +-------------+                     v
           |                    +---------------------+
           |                    | Emitir Receta       |
           v                    | Digital             |
    +-------------+             +---------------------+
    | Confirmar   |                     |
    | Reserva     |                     v
    +-------------+             +---------------------+
           |                    | Iniciar Video-      |
           v                    | conferencia         |
    +-------------+             +---------------------+
    | Pagar       |                     |
    | Consulta    |                     v
    +-------------+             +---------------------+
           |                    | Finalizar Consulta  |
           v                    +---------------------+
    +-------------+                     |
    | Recibir     |                     v
    | Comprobante |             +---------------------+
    | Digital     |             | Generar Factura     |
    +-------------+             +---------------------+
           |                     |
           |                     |
           +----------+----------+
                      |
                      v
           +---------------------+
           |  SISTEMA DE PAGO    |
           |  (Actor Externo)    |
           +---------------------+
                      |
                      |
      +---------------+---------------+
      |               |               |
      v               v               v
+------------+ +------------+ +------------+
| Recibir    | | Procesar   | | Enviar     |
| Solicitud  | | Transacción| | Confirmación|
+------------+ +------------+ +------------+
      |               |               |
      |               |               v
      |               |         +------------+
      |               |         | Emitir     |
      |               |         | Comprobante|
      |               |         +------------+
      v               v
+------------+ +------------+
| Confirmar  | | Notificar  |
| Operación  | | al Paciente|
+------------+ +------------+

NOTAS DE RELACIÓN UML:
- Paciente interactúa con: Buscar Profesional, Consultar Disponibilidad, Reservar Cita Médica, Confirmar Reserva, Pagar Consulta, Recibir Comprobante Digital.
- Médico interactúa con: Consultar Pacientes, Ver Historial Clínico, Registrar Diagnóstico, Emitir Receta Digital, Iniciar Videoconferencia, Finalizar Consulta, Generar Factura.
- Sistema de Pago interactúa con: Recibir Solicitud de Pago, Procesar Transacción, Enviar Confirmación, Emitir Comprobante.
- El sistema (MediConnect) es el límite del sistema modelado.

```

---

## 4. NARRATIVA DETALLADA DEL CASO DE USO PRINCIPAL

### Caso de Uso: "Reserva y Pago de Consulta"

**Actor Principal:** Paciente  
**Actores Secundarios:** Médico, Sistema de Pago  
**Precondición:** El paciente está registrado y autenticado en la plataforma MediConnect.  
**Postcondición:** La cita está confirmada, el pago está completado y el comprobante digital fue emitido. El médico recibe la notificación de la nueva cita reservada.

---

### Flujo Principal - Escenario Happy Path (Paso a Paso)

| Paso | Actor que inicia | Acción / Descripción | Resultado / Salida del Sistema |
|------|-----------------|----------------------|-------------------------------|
| **1** | Paciente | El paciente accede a la plataforma MediConnect desde su dispositivo (móvil o navegador web) e inicia sesión con su cuenta registrada. | El sistema valida las credenciales y presenta el panel principal del paciente. |
| **2** | Paciente | El paciente selecciona la opción **"Buscar Profesional"** y elige una especialidad médica (ej. Cardiología, Pediatría, Dermatología, Medicina General). | El sistema consulta la base de datos y presenta una lista de profesionales disponibles filtrados por la especialidad seleccionada. |
| **3** | Paciente | El paciente aplica filtros adicionales sobre la lista mostrada: ubicación geográfica, rango de horarios disponibles, valoración/calificación del profesional y tarifa de consulta. | El sistema actualiza los resultados en tiempo real según los criterios seleccionados. |
| **4** | Paciente | El paciente elige un profesional específico y el sistema muestra la agenda disponible para las próximas semanas con los horarios libres del médico. El paciente filtra por disponibilidad horaria (mañana/tarde, días específicos). | El sistema presenta un calendario interactivo con los bloques de tiempo disponibles para reserva. |
| **5** | Paciente | El paciente selecciona una fecha y hora específica y confirma la reserva. El paciente puede agregar una nota breve con el motivo de la consulta. | El sistema genera un **ID de cita único** y bloquea el horario seleccionado en la agenda del médico. Se muestra una pantalla de confirmación preliminar. |
| **6** | Sistema de Pago (mediado por MediConnect) | El sistema solicita los datos necesarios para el procesamiento del pago: método de pago (tarjeta de crédito/débito o billetera electrónica), datos del paciente para facturación (nombre, documento, dirección) y monto a pagar. | Se presenta el formulario de pago seguro con cifrado TLS 1.3 (cumple RNF2). |
| **7** | Paciente | El paciente confirma el pago ingresando los datos de la tarjeta o seleccionando la billetera electrónica. El sistema envía la solicitud de transacción a la pasarela de pago externa. | La pasarela de pago recibe la solicitud y realiza la autorización en tiempo real. |
| **8** | Sistema de Pago | El sistema procesa la transacción: realiza la autorización bancaria, confirma los fondos disponibles y confirma la operación al sistema MediConnect. | La transacción es aprobada. El sistema registra el pago asociado al ID de cita. |
| **9** | MediConnect | El sistema genera el **comprobante digital con código QR** y envía la confirmación al paciente por **email** y **SMS** con los detalles completos. | Se emite comprobante con datos de la consulta, método de pago, monto, fecha/hora y código QR para validación. |
| **10** | Médico (Actor Notificado) | El médico recibe una **notificación automática** en su panel de trabajo con los datos de la nueva cita reservada: nombre del paciente, especialidad, fecha, hora, motivo de la consulta y comprobante asociado. | El médico puede consultar la cita en su agenda y prepararse para la consulta. |
| **11** | Paciente | El paciente recibe en su panel y por notificación: la confirmación de la cita con datos completos, el enlace para la videoconferencia (si la consulta es virtual), el comprobante de pago con código de barras/QR y los datos del profesional asignado. | El caso de uso finaliza exitosamente. La cita está confirmada y pagada. |

---

### Escenarios Alternativos

#### Escenario Alternativo A: Fecha/Hora no disponible (Conflicto de Agenda)

| Paso | Acción | Resultado |
|------|--------|-----------|
| **4a** | Al intentar confirmar la reserva (Paso 5), el sistema detecta que otro paciente ya reservó ese bloque horario en los últimos segundos. | El sistema muestra un mensaje de error indicando que la fecha/hora seleccionada ya no está disponible. Se solicita al paciente que seleccione otra alternativa del calendario actualizado. El flujo regresa al Paso 4. |

#### Escenario Alternativo B: Pago fallido (Error en Transacción)

| Paso | Acción | Resultado |
|------|--------|-----------|
| **7a** | Durante el procesamiento del pago (Paso 7-8), la pasarela rechaza la tarjeta (fondos insuficientes, datos incorrectos, tarjeta vencida) o ocurre un error de comunicación con el sistema externo. | El sistema notifica al paciente con un mensaje claro del error y sugiere un método de pago alternativo (otra tarjeta o billetera electrónica). El sistema mantiene la reserva en estado "pendiente de pago" por 10 minutos. Si no se completa el pago en ese tiempo, la reserva se libera automáticamente y el flujo regresa al Paso 6. |

---

### Justificación Técnica del Caso Principal

- **RF1 (Gestión y Agendamiento):** El caso cubre completamente la búsqueda por especialidad, el filtrado de disponibilidad horaria, la confirmación de reserva y la generación del ID de cita único.
- **RF4 (Procesamiento de Pagos):** Se modela explícitamente la integración con pasarela de pago externa, la emisión del comprobante digital y las notificaciones por múltiples canales.
- **RNF1 (Alta Disponibilidad):** El caso asume que el sistema está operativo (99.9%) en todos los pasos, especialmente en la confirmación de reserva y procesamiento de pago en tiempo real.
- **RNF2 (Seguridad y Confidencialidad):** Se menciona el cifrado TLS 1.3 en el formulario de pago, la protección de datos del paciente y la emisión de comprobante con identificación segura (código QR), cumpliendo las normativas sanitarias.

---

## 5. RESUMEN DE ENTREGA

**Archivo entregado:** `/home/fer/.local/share/equipo/trabajo/GuiaModelamiento/or-laguna/entregas/fase1_casos_uso.md`

**Contenido verificado:**
- ✅ Matriz de requerimientos funcionales RF1-RF4 con prioridad, complejidad y detalle.
- ✅ Matriz de requerimientos no funcionales RNF1-RNF2 con prioridad, complejidad y detalle.
- ✅ Diagrama de casos de uso en texto ASCII UML con los 3 actores requeridos: Paciente, Médico, Sistema de Pago.
- ✅ Narrativa paso a paso del caso principal "Reserva y Pago de Consulta" con flujo principal (11 pasos), escenarios alternativos (conflicto de agenda, pago fallido) y justificación técnica vinculada a RF/RNF.
- ✅ Formato Markdown completo con tablas, diagramas ASCII, pasos numerados y referencias a actores.

---

REQUISITOS: S1
PENDIENTES:
FIN-3c83f