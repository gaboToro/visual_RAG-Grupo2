# Visual RAG — Triage & PostOp Monitor

Aplicación móvil en **React Native administrada por Expo** y Back-End con **Arquitectura de Microservicios bajo Domain-Driven Design (DDD)**, construida fielmente a partir del prototipo de Figma (**Visual RAG - Triage & PostOp Monitor**, 10 pantallas móviles) mediante ingeniería de software asistida por Inteligencia Artificial.

---

## Integrantes del Equipo (Grupo 2)

- **Casa Jean Carlos**
- **Riofrío Ramsés**
- **Saltos Jose**
- **Toro Gabriel**

---

## Enlace al Prototipo Oficial en Figma

- **Diseño UI/UX en Figma (10 Pantallas Móviles)**: [https://www.figma.com/design/WmzK6xpeiBrKucpNzUKIYP/VISUALRAGTRAIE?node-id=22-221&p=f&t=8a3NuzHfzabmUxGU-0](https://www.figma.com/design/WmzK6xpeiBrKucpNzUKIYP/VISUALRAGTRAIE?node-id=22-221&p=f&t=8a3NuzHfzabmUxGU-0)

---

## 1. Problemática Identificada y Propuesta de Solución

### Problemática Encontrada
Durante la etapa de recuperación postoperatoria ambulatoria (en el hogar), tanto los pacientes como los médicos cirujanos enfrentan tres problemas críticos:
1. **Incertidumbre y detección tardía de complicaciones en heridas quirúrgicas**: Los pacientes no cuentan con el criterio clínico para distinguir entre un proceso de cicatrización normal y signos tempranos de infección, dehiscencia o cicatrización hipertrófica. Esto ocasiona que complicaciones tratables se agraven antes de acudir al médico o, por el contrario, que se saturen las consultas por alarmas infundadas.
2. **Desconexión con las órdenes médicas personalizadas**: Las indicaciones postoperatorias en papel (días de reposo, acciones prohibidas, cuidados permitidos y signos de alarma) suelen extraviarse o incumplirse por falta de un seguimiento diario interactivo.
3. **Sobrecosto y fricción en la adquisición de medicamentos e insumos de curación**: Al adquirir antisépticos, analgésicos o apósitos especializados (como Clorhexidina o apósitos Tegaderm), el paciente desconoce en qué cadena farmacéutica se encuentran al mejor precio o con entrega inmediata.

### Solución Propuesta: Visual RAG
**Visual RAG (Triage & PostOp Monitor)** resuelve esta problemática conectando en tiempo real al **Médico Cirujano** y al **Paciente** en un ecosistema móvil inteligente:
- El **Médico Cirujano** registra y actualiza la **Ficha Postoperatoria** digital del paciente (procedimiento, cronograma de reposo, prohibiciones, cuidados e insumos recetados).
- El **Paciente** sube **fotografías de su herida postoperatoria**, las cuales son evaluadas por un motor **Visual RAG (Retrieval-Augmented Generation con Machine Learning)** que compara los vectores visuales (`VisualEmbedding`) contra un dataset clínico validado, emitiendo un **Reporte Clínico Oficial** verificado.
- De acuerdo con el tratamiento médico subido por su doctor y el estado actual de la herida, la aplicación **compara precios entre farmacias aliadas (ej. Cruz Azul vs. Fybeca)** y recomienda los medicamentos e insumos al **mejor precio del mercado**.

---

## 2. Modelo de Negocio (Cómo Genera Ingresos el Software)

Para garantizar una adopción masiva y sin fricción, **la aplicación es 100% gratuita tanto para los Pacientes como para los Médicos Cirujanos**. De esta forma, el médico digitaliza el seguimiento de sus pacientes sin costo y el paciente accede gratuitamente al triaje visual y al comparador de precios.

El software genera ingresos de forma sostenible a través de **dos líneas de negocio B2B / B2B2C altamente viables**:

1. **Comisión por Transacción en Farmacias Aliadas (Marketplace Farmacéutico — *Affiliate / CPA*)**:
   - **Cómo funciona**: Cada vez que un paciente necesita adquirir los medicamentos o insumos de curación recetados por su cirujano (ej. *Clorhexidina Solución 2%* o *Apósito Tegaderm 3M*), la app le muestra en qué farmacia están más baratos y permite comprarlos desde el botón **`Pedir Online ↗`**.
   - **Por qué es rentable y creíble**: Las cadenas farmacéuticas aliadas (como **Cruz Azul** o **Fybeca**) otorgan a **Visual RAG** un porcentaje de comisión (entre el **6% y el 12%** sobre el valor de la venta) por cada compra concretada desde la aplicación. Para las farmacias esto representa clientes seguros con receta médica activa y alta recurrencia durante todo su postoperatorio, sin que el paciente pague un centavo extra.

2. **Convenios con Aseguradoras de Salud y Medicina Prepagada (Reducción de Siniestralidad B2B)**:
   - **Cómo funciona**: Las empresas de seguros médicos y medicina prepagada integran **Visual RAG** dentro de su cobertura postoperatoria pagando una tarifa fija por paciente operado monitoreado (*tarifa por episodio quirúrgico*).
   - **Por qué es rentable y creíble**: Para una aseguradora, una infección postoperatoria detectada tarde o un reingreso hospitalario de urgencia cuesta miles de dólares en hospitalización y reintervención. Al financiar el monitoreo preventivo con **Visual RAG**, la aseguradora detecta signos de alerta a tiempo desde casa y reduce drásticamente sus gastos por complicaciones evitables, convirtiendo el pago del software en un ahorro directo para la aseguradora.

---

## 3. Uso de Inteligencia Artificial en la Creación del Proyecto

Este proyecto fue desarrollado aplicando metodologías modernas de **Ingeniería de Software Asistida por IA (AI-Driven Software Development)**, integrando diseño UI/UX desde Figma, arquitectura limpia por dominios y desarrollo móvil multiplataforma.

### Inteligencia Artificial y Herramientas Utilizadas
- **Agente de IA e IDE**: **Google Antigravity (AGY)** impulsado por modelos fundacionales avanzados de generación de código y análisis multimodal (**Claude Opus 4.6 / Gemini**).
- **Integración Directa con Diseño (MCP)**: Servidor **Figma MCP (Model Context Protocol)** (`get_metadata`, `get_design_context`, `get_screenshot`), utilizado por la IA para inspeccionar directamente los nodos de las 10 pantallas del prototipo en Figma, extraer la paleta de colores clínica, las medidas exactas y descargar los 272 vectores SVG locales sin intervención manual.

### Prompt Inicial Utilizado
A continuación, se documenta de forma íntegra el **prompt inicial** entregado a la IA para la generación arquitectónica y funcional del proyecto:

> *"Crea el proyecto visual RAG basándote en un prototipo móvil realizado en figma (https://www.figma.com/design/NFeaKH7j5osWmqY9p6IZeW/VISUALRAGTRAIE--copia-?node-id=1-2&t=KGtySS3NCi3LvJYo-1) usando ReactNative administrado por Expo para el front-end y genera el back-end con una arquitectura de microservicios y usando la metodología Domain-Driven Design, mantén una estructura de carpetas ordenadas y comenta cada función dentro del código para entender que hace. Visual RAG  es una APP donde el Paciente sube la foto de su herida postoperatoria, su foto es evaluada usando un dataset evaluado con machine learning (RAG) y acorde a su tratamiento médico subido por su doctor la APP recomienda medicamentos a mejores precios"*

---

## 4. Flujo de Negocio Principal

1. **Paciente sube la fotografía de su herida postoperatoria (1 a 4 fotos)**: Desde la pestaña **Evaluación**, el paciente captura o selecciona las imágenes de su incisión quirúrgica (`Correcion Neuronal`).
2. **Evaluación con Dataset Machine Learning (Visual RAG)**: El microservicio `visual-rag-service` extrae el vector de características visuales (`VisualEmbedding`), ejecuta una búsqueda de similitud coseno ($k\text{-NN}$) contra el dataset clínico de heridas postoperatorias (`PostOpWoundDataset`) y genera un **Reporte Clínico Oficial** verificado (`REP-475381`, `Cicatrización Normal`, `Evolución Favorable`).
3. **Alineación con el Tratamiento Médico subido por el Doctor**: El microservicio `clinical-orders-service` gestiona la **Ficha Postoperatoria** configurada por el Médico Cirujano (cronograma de reposo, acciones prohibidas, cuidados permitidos, signos de alerta e insumos recetados).
4. **Recomendación de Medicamentos a Mejores Precios**: El microservicio `pharmacy-pricing-service` cruza los medicamentos del tratamiento médico y del diagnóstico Visual RAG contra los catálogos de farmacias aliadas (**Cruz Azul** vs **Fybeca**), calculando el ahorro (`Ahorras $0.95 en este insumo`, `Cruz Azul $3.20 Precio Más Bajo` vs `Fybeca $4.15 Entrega en 30 min`).

---

## 5. Estructura de Carpetas del Proyecto

```text
visual_RAG-Grupo2/
├── .gitignore                                    # Reglas de exclusión de Git (node_modules, .expo, etc.)
├── README.md                                     # Documentación general, modelo de negocio y arquitectura
│
├── backend/                                      # Back-End: Microservicios + Domain-Driven Design (DDD)
│   ├── package.json                              # Scripts de arranque y pruebas del Back-End
│   ├── package-lock.json                         # Árbol bloqueado de dependencias del Back-End
│   ├── start-all.js                              # Orquestador de los 4 microservicios + API Gateway
│   ├── test-microservices.js                     # Suite de verificación DDD de extremo a extremo
│   ├── api-gateway/                              # Punto de entrada único (Puerto 4000)
│   │   └── src/
│   │       └── index.js                          # Enrutador central y orquestador de Triage Visual RAG
│   └── services/
│       ├── identity-service/                     # Bounded Context 1: Identidad y Perfiles (Puerto 4001)
│       │   └── src/
│       │       ├── index.js                      # Servidor HTTP del microservicio de identidad
│       │       ├── domain/
│       │       │   ├── entities/User.js          # Entidad raíz de agregado User
│       │       │   ├── value-objects/ClinicalInfo.js
│       │       │   └── repositories/IUserRepository.js
│       │       ├── application/
│       │       │   └── use-cases/IdentityUseCases.js
│       │       └── infrastructure/
│       │           ├── persistence/InMemoryUserRepository.js
│       │           └── http/IdentityController.js
│       ├── clinical-orders-service/              # Bounded Context 2: Órdenes y Ficha PostOp (Puerto 4002)
│       │   └── src/
│       │       ├── index.js                      # Servidor HTTP del microservicio de órdenes clínicas
│       │       ├── domain/
│       │       │   ├── entities/PostOpRecord.js  # Entidad raíz Ficha Postoperatoria
│       │       │   ├── value-objects/SurgerySchedule.js
│       │       │   └── repositories/IPostOpRecordRepository.js
│       │       ├── application/
│       │       │   └── use-cases/ClinicalOrdersUseCases.js
│       │       └── infrastructure/
│       │           ├── persistence/InMemoryPostOpRecordRepository.js
│       │           └── http/ClinicalOrdersController.js
│       ├── visual-rag-service/                   # Bounded Context 3: Motor ML Visual RAG (Puerto 4003)
│       │   └── src/
│       │       ├── index.js                      # Servidor HTTP del microservicio Visual RAG
│       │       ├── domain/
│       │       │   ├── entities/WoundEvaluationReport.js
│       │       │   ├── value-objects/VisualEmbedding.js
│       │       │   ├── services/WoundRagEvaluatorService.js
│       │       │   └── repositories/IWoundReportRepository.js
│       │       ├── application/
│       │       │   └── use-cases/VisualRagUseCases.js
│       │       └── infrastructure/
│       │           ├── dataset/PostOpWoundDataset.js
│       │           ├── persistence/InMemoryWoundReportRepository.js
│       │           └── http/VisualRagController.js
│       └── pharmacy-pricing-service/             # Bounded Context 4: Farmacia y Precios (Puerto 4004)
│           └── src/
│               ├── index.js                      # Servidor HTTP del microservicio de farmacia
│               ├── domain/
│               │   ├── entities/MedicationProduct.js
│               │   ├── value-objects/PriceComparisonResult.js
│               │   ├── services/BestPriceRecommenderService.js
│               │   └── repositories/IMedicationRepository.js
│               ├── application/
│               │   └── use-cases/PharmacyPricingUseCases.js
│               └── infrastructure/
│                   ├── persistence/InMemoryMedicationRepository.js
│                   └── http/PharmacyPricingController.js
│
└── frontend/                                     # Front-End: React Native + Expo (TypeScript)
    ├── App.tsx                                   # Enrutador raíz (Login, Portal Paciente, Portal Médico)
    ├── app.json                                  # Configuración del proyecto Expo
    ├── babel.config.js                           # Configuración de compilación Babel para Expo
    ├── tsconfig.json                             # Configuración de TypeScript
    ├── package.json                              # Dependencias de Expo y React Native
    ├── package-lock.json                         # Árbol bloqueado de dependencias del Front-End
    ├── assets/figma/                             # 272 vectores SVG descargados localmente desde Figma
    └── src/
        ├── assets/
        │   └── figmaManifest.ts                  # Manifiesto local de assets de Figma
        ├── components/
        │   ├── common/
        │   │   ├── TopHeader.tsx                 # Encabezado Portal Paciente y Portal Médico
        │   │   ├── PatientBottomBar.tsx          # Barra inferior de 5 pestañas (Paciente)
        │   │   ├── DoctorBottomBar.tsx           # Barra inferior de 3 pestañas (Médico)
        │   │   └── ReportDetailModal.tsx         # Pantalla 04: Modal Reporte Clínico Oficial
        │   └── icons/
        │       └── FigmaIcons.tsx                # Componentes SVG con los trazos exactos de Figma
        ├── context/
        │   └── AppContext.tsx                    # Estado global y sincronización con el API Gateway
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

## 6. Cuentas Demo Incluidas

- **Cuenta Paciente Demo**: `nelsoncasa@gmail.com` / `nelson123`
- **Cuenta Médico Cirujano Demo**: `nelson.doctor@gmail.com` / `doctor123`

---

## 7. Instrucciones de Ejecución

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
