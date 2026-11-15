# Visual RAG — Triage & PostOp Monitor

Aplicación móvil en **React Native administrada por Expo** y Back-End con **Arquitectura de Microservicios bajo Domain-Driven Design (DDD)**, construida fielmente a partir del prototipo de Figma (**Visual RAG - Triage & PostOp Monitor**, 10 pantallas móviles).

---

## Flujo de Negocio Principal

1. **Paciente sube la fotografía de su herida postoperatoria (1 a 4 fotos)**: Desde la pestaña **Evaluación**, el paciente captura o selecciona las imágenes de su incisión quirúrgica (`Correcion Neuronal`).
2. **Evaluación con Dataset Machine Learning (Visual RAG)**: El microservicio `visual-rag-service` extrae el vector de características visuales (`VisualEmbedding`), ejecuta una búsqueda de similitud coseno ($k\text{-NN}$) contra el dataset clínico de heridas postoperatorias (`PostOpWoundDataset`) y genera un **Reporte Clínico Oficial** verificado (`REP-475381`, `Cicatrización Normal`, `Evolución Favorable`).
3. **Alineación con el Tratamiento Médico subido por el Doctor**: El microservicio `clinical-orders-service` gestiona la **Ficha Postoperatoria** configurada por el Médico Cirujano (cronograma de reposo, acciones prohibidas, cuidados permitidos, signos de alerta e insumos recetados).
4. **Recomendación de Medicamentos a Mejores Precios**: El microservicio `pharmacy-pricing-service` cruza los medicamentos del tratamiento médico y del diagnóstico Visual RAG contra los catálogos de farmacias aliadas (**Cruz Azul** vs **Fybeca**), calculando el ahorro (`Ahorras $0.95 en este insumo`, `Cruz Azul $3.20 Precio Más Bajo` vs `Fybeca $4.15 Entrega en 30 min`).

---

## Estructura de Carpetas del Proyecto

```text
visual_RAG-Grupo2/
├── backend/                                      # Back-End: Microservicios + DDD
│   ├── package.json                              # Scripts de arranque y pruebas
│   ├── start-all.js                              # Orquestador de los 4 microservicios + API Gateway
│   ├── test-microservices.js                     # Suite de verificación DDD de extremo a extremo
│   ├── api-gateway/                              # Punto de entrada único (Puerto 4000)
│   │   └── src/index.js                          # Enrutador y orquestador de Triage Visual RAG
│   └── services/
│       ├── identity-service/                     # Bounded Context 1: Identidad y Perfiles (Puerto 4001)
│       │   └── src/
│       │       ├── domain/                       # Entidad User, Value Object ClinicalInfo, IUserRepository
│       │       ├── application/                  # Casos de uso IdentityUseCases
│       │       └── infrastructure/               # InMemoryUserRepository, IdentityController
│       ├── clinical-orders-service/              # Bounded Context 2: Órdenes y Ficha PostOp (Puerto 4002)
│       │   └── src/
│       │       ├── domain/                       # Entidad PostOpRecord, Value Object SurgerySchedule
│       │       ├── application/                  # Casos de uso ClinicalOrdersUseCases
│       │       └── infrastructure/               # InMemoryPostOpRecordRepository, ClinicalOrdersController
│       ├── visual-rag-service/                   # Bounded Context 3: Motor ML Visual RAG (Puerto 4003)
│       │   └── src/
│       │       ├── domain/                       # WoundEvaluationReport, VisualEmbedding, WoundRagEvaluatorService
│       │       ├── application/                  # Casos de uso VisualRagUseCases
│       │       └── infrastructure/               # PostOpWoundDataset (ML RAG), InMemoryWoundReportRepository
│       └── pharmacy-pricing-service/             # Bounded Context 4: Farmacia y Precios (Puerto 4004)
│           └── src/
│               ├── domain/                       # MedicationProduct, PriceComparisonResult, BestPriceRecommenderService
│               ├── application/                  # Casos de uso PharmacyPricingUseCases
│               └── infrastructure/               # InMemoryMedicationRepository, PharmacyPricingController
│
└── frontend/                                     # Front-End: React Native + Expo (TypeScript)
    ├── App.tsx                                   # Enrutador raíz (Login, Portal Paciente, Portal Médico)
    ├── app.json                                  # Configuración de Expo
    ├── package.json                              # Dependencias de Expo y React Native
    ├── assets/figma/                             # 272 vectores SVG descargados localmente desde Figma
    └── src/
        ├── assets/figmaManifest.ts               # Manifiesto local de assets de Figma
        ├── components/
        │   ├── common/
        │   │   ├── TopHeader.tsx                 # Encabezado Portal Paciente y Portal Médico
        │   │   ├── PatientBottomBar.tsx          # Barra inferior de 5 pestañas (Paciente)
        │   │   ├── DoctorBottomBar.tsx           # Barra inferior de 3 pestañas (Médico)
        │   │   └── ReportDetailModal.tsx         # Pantalla 04: Modal Reporte Clínico Oficial
        │   └── icons/
        │       └── FigmaIcons.tsx                # Componentes SVG con los trazos exactos de Figma
        ├── context/
        │   └── AppContext.tsx                    # Estado global y conexión con el API Gateway
        ├── screens/
        │   ├── auth/
        │   │   └── LoginScreen.tsx               # Pantalla 01: Login Screen (Paciente / Médico Cirujano)
        │   ├── patient/
        │   │   ├── EvaluationScreen.tsx          # Pantalla 02: Paciente - Evaluación
        │   │   ├── SavedReportsScreen.tsx        # Pantalla 03: Paciente - Reportes Guardados
        │   │   ├── PharmacyScreen.tsx            # Pantalla 05: Paciente - Farmacia & Insumos
        │   │   ├── MedicalOrdersScreen.tsx       # Pantalla 06: Paciente - Órdenes Médicas
        │   │   └── PatientProfileScreen.tsx      # Pantalla 07: Paciente - Perfil Clínico
        │   └── doctor/
        │       ├── DoctorPatientsScreen.tsx      # Pantalla 08: Doctor - Mis Pacientes
        │       ├── PostOpRecordScreen.tsx        # Pantalla 09: Doctor - Ficha Postoperatoria
        │       └── DoctorProfileScreen.tsx       # Pantalla 10: Doctor - Perfil Profesional
        ├── services/
        │   └── apiClient.ts                      # Cliente HTTP hacia el API Gateway (Puerto 4000)
        ├── theme/
        │   └── colors.ts                         # Tokens de diseño (Teal #0D9488, Slate #0F172A, etc.)
        └── types/
            └── index.ts                          # Contratos e interfaces TypeScript
```

---

## Cuentas Demo Incluidas

- **Cuenta Paciente Demo**: `nelsoncasa@gmail.com` / `nelson123`
- **Cuenta Médico Cirujano Demo**: `nelson.doctor@gmail.com` / `doctor123`

---

## Instrucciones de Ejecución

### 1. Ejecutar y Verificar el Back-End (Microservicios DDD)

```bash
cd backend
# Ejecutar pruebas integradas de los 4 microservicios DDD
npm test

# Iniciar los 4 microservicios (puertos 4001-4004) y el API Gateway (puerto 4000)
npm start
```

### 2. Ejecutar el Front-End (React Native + Expo)

```bash
cd frontend
npm install
npx expo start
```
