# Visual RAG — Triage & PostOp Monitor

Aplicación móvil en **React Native administrada por Expo** y Back-End con **Arquitectura de Microservicios bajo Domain-Driven Design (DDD)**, construida fielmente a partir del prototipo de Figma (**Visual RAG - Triage & PostOp Monitor**, 10 pantallas móviles) mediante ingeniería de software asistida por Inteligencia Artificial.

---

## Integrantes del Grupo

- **Casa Nelson**
- **Riofrío Ramsés**
- **Toro Gabriel**
- **Toapanta Anthony**

---

## Enlaces Principales del Proyecto

- **Repositorio en GitHub**: [https://github.com/gaboToro/visual_RAG-Grupo8](https://github.com/gaboToro/visual_RAG-Grupo8)
- **Diseño UI/UX en Figma (10 Pantallas Móviles)**: [https://www.figma.com/design/WmzK6xpeiBrKucpNzUKIYP/VISUALRAGTRAIE?node-id=22-221&p=f&t=8a3NuzHfzabmUxGU-0](https://www.figma.com/design/WmzK6xpeiBrKucpNzUKIYP/VISUALRAGTRAIE?node-id=22-221&p=f&t=8a3NuzHfzabmUxGU-0)

---

## 1. Problemática Identificada y Propuesta de Solución

### Problemática Encontrada
Durante la etapa de recuperación postoperatoria ambulatoria (en el hogar), tanto los pacientes como los médicos cirujanos enfrentan tres problemas críticos:
1. **Incertidumbre y detección tardía de complicaciones en heridas quirúrgicas**: Los pacientes no cuentan con el criterio clínico para distinguir entre un proceso de cicatrización normal y signos tempranos de infección, dehiscencia o cicatrización hipertrófica. Esto ocasiona que complicaciones tratables se agraven antes de acudir al médico o, por el contrario, que se saturen las consultas por alarmas infundadas.
2. **Desconexión con las órdenes médicas personalizadas**: Las indicaciones postoperatorias en papel (días de reposo, acciones prohibidas, cuidados permitidos y signos de alarma) suelen extraviarse o incumplirse por falta de un seguimiento diario interactivo.
3. **Sobrecosto y fricción en la adquisición de medicamentos e insumos de curación**: Al adquirir antisépticos, analgésicos o apósitos especializados (como Clorhexidina o apósitos Tegaderm), el paciente desconoce en qué cadena farmacéutica se encuentran al mejor precio o con entrega inmediata.

### Solución Propuesta: Visual RAG
**Visual RAG** es un ecosistema móvil integral de triaje y monitorización postoperatoria que conecta al paciente con su médico tratante:
- El **Médico Cirujano** registra y actualiza la **Ficha Postoperatoria** digital del paciente (procedimiento, cronograma de reposo, prohibiciones, cuidados e insumos recetados).
- El **Paciente** sube **fotografías de su herida postoperatoria**, las cuales son evaluadas por un motor **Visual RAG (Retrieval-Augmented Generation con Machine Learning)** que compara los vectores visuales (`VisualEmbedding`) contra un dataset clínico validado, emitiendo un **Reporte Clínico Oficial** verificado.
- De acuerdo con el tratamiento médico subido por su doctor y el estado actual de la herida, la aplicación **compara precios entre farmacias aliadas (ej. Cruz Azul vs. Fybeca)** y recomienda los medicamentos e insumos al **mejor precio del mercado**.

---

## 2. Modelo de Negocio (Monetización Real y Sostenible)

El software genera ingresos de forma sostenible a través de **dos líneas de negocio B2B / B2B2C altamente viables**:

1. **Comisión por Transacción en Farmacias Aliadas (Marketplace Farmacéutico — *Affiliate / CPA*)**:
   - **Cómo funciona**: Cada vez que un paciente necesita adquirir los medicamentos o insumos de curación recetados por su cirujano (ej. *Clorhexidina Solución 2%* o *Apósito Tegaderm 3M*), la app le muestra en qué farmacia están más baratos y permite comprarlos desde el botón **`Pedir Online ↗`**.
   - **Por qué es rentable y creíble**: Las cadenas farmacéuticas aliadas (como **Cruz Azul** o **Fybeca**) otorgan a **Visual RAG** un porcentaje de comisión (entre el **6% y el 12%** sobre el valor de la venta) por cada compra concretada desde la aplicación. Para las farmacias esto representa clientes seguros con receta médica activa y alta recurrencia durante todo su postoperatorio, sin que el paciente pague un centavo extra.

2. **Convenios con Aseguradoras de Salud y Medicina Prepagada (Reducción de Siniestralidad B2B)**:
   - **Cómo funciona**: Se comercializan licencias corporativas a aseguradoras médicas privadas y clínicas quirúrgicas.
   - **Por qué es rentable y creíble**: Para una aseguradora o clínica, una infección quirúrgica no detectada a tiempo que termina en reingreso a quirófano o terapia intensiva cuesta entre \$3,000 y \$15,000 USD. **Visual RAG** actúa como un sistema de alerta temprana que detecta complicaciones a tiempo, reduciendo los costos de siniestralidad de las aseguradoras en más de un 40%. Las aseguradoras pagan una suscripción mensual por paciente monitoreado (\$8 - \$15 USD/mes).

---

## 3. Uso de Inteligencia Artificial en el Flujo de la Aplicación

La Inteligencia Artificial se encuentra integrada en el flujo central de valor del sistema mediante **Machine Learning y Retrieval-Augmented Generation Visual**:

- **Extracción de Características Visuales (`VisualEmbedding`)**: Transforma las imágenes de incisiones tomadas por el paciente en vectores densos normalizados representativos de patrones dérmicos (colorimetría de bordes, eritema perilesional, exudado y aproximación de bordes).
- **Recuperación Aumentada (Visual RAG)**: Mediante un algoritmo de similitud por cosenos ($k\text{-NN}$), la imagen del paciente se contrasta contra una base de conocimiento curada de casos postoperatorios (`PostOpWoundDataset`), recuperando el diagnóstico clínico más cercano y la evidencia médica respaldada.
- **Generación de Reportes Clínicos Oficiales**: Emite un diagnóstico fundamentado con métricas de confianza (`confidence`), badges de triaje preventivo y consejos médicos automáticos alineados a la evolución de la herida.

---

## 4. Flujo Completo del Software

1. **Paciente sube la fotografía de su herida postoperatoria (1 a 4 fotos)**: Desde la pestaña **Evaluación**, el paciente captura o selecciona las imágenes de su incisión quirúrgica (`Correcion Neuronal`).
2. **Evaluación con Dataset Machine Learning (Visual RAG)**: El microservicio `visual-rag-service` extrae el vector de características visuales (`VisualEmbedding`), ejecuta una búsqueda de similitud coseno ($k\text{-NN}$) contra el dataset clínico de heridas postoperatorias (`PostOpWoundDataset`) y genera un **Reporte Clínico Oficial** verificado (`REP-475381`, `Cicatrización Normal`, `Evolución Favorable`).
3. **Alineación con el Tratamiento Médico subido por el Doctor**: El microservicio `clinical-orders-service` gestiona la **Ficha Postoperatoria** configurada por el Médico Cirujano (cronograma de reposo, acciones prohibidas, cuidados permitidos, signos de alerta e insumos recetados).
4. **Recomendación de Medicamentos a Mejores Precios**: El microservicio `pharmacy-pricing-service` cruza los medicamentos del tratamiento médico y del diagnóstico Visual RAG contra los catálogos de farmacias aliadas (**Cruz Azul** vs **Fybeca**), calculando el ahorro (`Ahorras $0.95 en este insumo`, `Cruz Azul $3.20 Precio Más Bajo` vs `Fybeca $4.15 Entrega en 30 min`).
5. **Scraper Web de Farmacias en Tiempo Real**: Incorpora un extractor web automatizado (`FybecaPharmacyScraper`) que consulta directamente el catálogo digital de farmacias vía HTTPS nativo, analizando precios de mercado en vivo (`data-gtm` / ecommerce) con soporte resiliente de contingencia offline.

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
│   │   └── src/index.js                          # Reverse Proxy, CORS y orquestación entre microservicios
│   └── services/
│       ├── identity-service/                     # Bounded Context 1: Identidad y Accesos (Puerto 4001)
│       │   └── src/
│       │       ├── index.js                      # Servidor HTTP del microservicio de identidad
│       │       ├── domain/                       # Capa de Dominio (Entidad User, Value Object ClinicalInfo)
│       │       ├── application/                  # Casos de uso (Login, Registro, Asignación de Pacientes)
│       │       └── infrastructure/               # Repositorio en memoria y controlador HTTP
│       ├── clinical-orders-service/              # Bounded Context 2: Órdenes y Ficha Postoperatoria (Puerto 4002)
│       │   └── src/
│       │       ├── index.js                      # Servidor HTTP del microservicio clínico
│       │       ├── domain/                       # Entidad PostOpRecord, Value Object SurgerySchedule
│       │       ├── application/                  # Casos de uso de gestión y actualización de ficha médica
│       │       └── infrastructure/               # Repositorio en memoria y controlador HTTP
│       ├── visual-rag-service/                   # Bounded Context 3: Inteligencia Artificial Visual RAG (Puerto 4003)
│       │   └── src/
│       │       ├── index.js                      # Servidor HTTP del microservicio RAG
│       │       ├── domain/                       # Entidad WoundEvaluationReport, Value Object VisualEmbedding
│       │       │   └── services/                 # WoundRagEvaluatorService (Similitud Coseno k-NN)
│       │       ├── application/                  # Casos de uso de evaluación y consulta de reportes
│       │       └── infrastructure/               # Dataset de heridas postoperatorias y persistencia
│       └── pharmacy-pricing-service/             # Bounded Context 4: Farmacia y Precios (Puerto 4004)
│           └── src/
│               ├── index.js                      # Servidor HTTP del microservicio de farmacia
│               ├── domain/
│               │   ├── entities/MedicationProduct.js
│               │   ├── value-objects/PriceComparisonResult.js
│               │   ├── services/BestPriceRecommenderService.js
│               │   ├── services/IPharmacyScraper.js
│               │   └── repositories/IMedicationRepository.js
│               ├── application/
│               │   └── use-cases/PharmacyPricingUseCases.js
│               └── infrastructure/
│                   ├── persistence/InMemoryMedicationRepository.js
│                   ├── scrapers/FybecaPharmacyScraper.js
│                   ├── scrapers/run-scraper.js
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
        ├── assets/                               # Logos y recursos gráficos
        ├── components/
        │   ├── common/ReportDetailModal.tsx      # Modal detallado de visualización de reporte médico
        │   ├── icons/FigmaIcons.tsx              # Componentes de íconos SVG vectorizados de Figma
        │   └── navigation/BottomTabBar.tsx       # Barra de navegación inferior
        ├── context/AppContext.tsx                # Estado global y sincronización con API Gateway
        ├── screens/
        │   ├── auth/LoginScreen.tsx              # Pantalla 01: Login (Paciente y Médico Cirujano)
        │   ├── patient/
        │   │   ├── EvaluationScreen.tsx          # Pantalla 02: Paciente - Evaluación
        │   │   ├── SavedReportsScreen.tsx        # Pantalla 03: Paciente - Reportes Guardados
        │   │   ├── PharmacyScreen.tsx            # Pantalla 05: Paciente - Farmacia & Insumos
        │   │   ├── MedicalOrdersScreen.tsx       # Pantalla 06: Paciente - Órdenes Médicas
        │   │   └── PatientProfileScreen.tsx      # Pantalla 07: Paciente - Perfil Clínico
        │   └── doctor/
        │       ├── DoctorPatientsScreen.tsx      # Pantalla 08: Doctor - Lista de Pacientes
        │       ├── PostOpRecordScreen.tsx        # Pantalla 09: Doctor - Ficha Postoperatoria
        │       └── DoctorProfileScreen.tsx       # Pantalla 10: Doctor - Perfil Profesional
        ├── services/apiClient.ts                 # Cliente HTTP con fallback resiliente offline
        ├── theme/colors.ts                       # Paleta de colores oficial extraída de Figma
        └── types/index.ts                        # Definiciones TypeScript de entidades y DTOs
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

# Ejecutar el Scraper Web en vivo para cualquier insumo (ej. clorhexidina, gasa, tegaderm)
npm run scrape clorhexidina

# Iniciar los 4 microservicios (puertos 4001-4004) y el API Gateway (puerto 4000)
npm start
```

### 2. Ejecutar el Front-End (React Native + Expo)

```bash
cd frontend
npm install
npx expo start
```
- Presiona `w` para abrir la aplicación web en tu navegador (`http://localhost:8081`).
- O escanea el código QR con la app **Expo Go** en tu dispositivo móvil Android o iOS.
