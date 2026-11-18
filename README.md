# Visual RAG â€” Triage & PostOp Monitor

AplicaciÃ³n mÃ³vil en **React Native administrada por Expo** y Back-End con **Arquitectura de Microservicios bajo Domain-Driven Design (DDD)**, construida fielmente a partir del prototipo de Figma (**Visual RAG - Triage & PostOp Monitor**, 10 pantallas mÃ³viles) mediante ingenierÃ­a de software asistida por Inteligencia Artificial.

---

## Integrantes del Equipo (Grupo 2)

- **Casa Jean Carlos**
- **RiofrÃ­o RamsÃ©s**
- **Saltos Jose**
- **Toro Gabriel**

---

## Enlace al Prototipo Oficial en Figma

- **DiseÃ±o UI/UX en Figma (10 Pantallas MÃ³viles)**: [https://www.figma.com/design/WmzK6xpeiBrKucpNzUKIYP/VISUALRAGTRAIE?node-id=22-221&p=f&t=8a3NuzHfzabmUxGU-0](https://www.figma.com/design/WmzK6xpeiBrKucpNzUKIYP/VISUALRAGTRAIE?node-id=22-221&p=f&t=8a3NuzHfzabmUxGU-0)

---

## 1. ProblemÃ¡tica Identificada y Propuesta de SoluciÃ³n

### ProblemÃ¡tica Encontrada
Durante la etapa de recuperaciÃ³n postoperatoria ambulatoria (en el hogar), tanto los pacientes como los mÃ©dicos cirujanos enfrentan tres problemas crÃ­ticos:
1. **Incertidumbre y detecciÃ³n tardÃ­a de complicaciones en heridas quirÃºrgicas**: Los pacientes no cuentan con el criterio clÃ­nico para distinguir entre un proceso de cicatrizaciÃ³n normal y signos tempranos de infecciÃ³n, dehiscencia o cicatrizaciÃ³n hipertrÃ³fica. Esto ocasiona que complicaciones tratables se agraven antes de acudir al mÃ©dico o, por el contrario, que se saturen las consultas por alarmas infundadas.
2. **DesconexiÃ³n con las Ã³rdenes mÃ©dicas personalizadas**: Las indicaciones postoperatorias en papel (dÃ­as de reposo, acciones prohibidas, cuidados permitidos y signos de alarma) suelen extraviarse o incumplirse por falta de un seguimiento diario interactivo.
3. **Sobrecosto y fricciÃ³n en la adquisiciÃ³n de medicamentos e insumos de curaciÃ³n**: Al adquirir antisÃ©pticos, analgÃ©sicos o apÃ³sitos especializados (como Clorhexidina o apÃ³sitos Tegaderm), el paciente desconoce en quÃ© cadena farmacÃ©utica se encuentran al mejor precio o con entrega inmediata.

### SoluciÃ³n Propuesta: Visual RAG
**Visual RAG (Triage & PostOp Monitor)** resuelve esta problemÃ¡tica conectando en tiempo real al **MÃ©dico Cirujano** y al **Paciente** en un ecosistema mÃ³vil inteligente:
- El **MÃ©dico Cirujano** registra y actualiza la **Ficha Postoperatoria** digital del paciente (procedimiento, cronograma de reposo, prohibiciones, cuidados e insumos recetados).
- El **Paciente** sube **fotografÃ­as de su herida postoperatoria**, las cuales son evaluadas por un motor **Visual RAG (Retrieval-Augmented Generation con Machine Learning)** que compara los vectores visuales (`VisualEmbedding`) contra un dataset clÃ­nico validado, emitiendo un **Reporte ClÃ­nico Oficial** verificado.
- De acuerdo con el tratamiento mÃ©dico subido por su doctor y el estado actual de la herida, la aplicaciÃ³n **compara precios entre farmacias aliadas (ej. Cruz Azul vs. Fybeca)** y recomienda los medicamentos e insumos al **mejor precio del mercado**.

---

## 2. Modelo de Negocio (CÃ³mo Genera Ingresos el Software)

Para garantizar una adopciÃ³n masiva y sin fricciÃ³n, **la aplicaciÃ³n es 100% gratuita tanto para los Pacientes como para los MÃ©dicos Cirujanos**. De esta forma, el mÃ©dico digitaliza el seguimiento de sus pacientes sin costo y el paciente accede gratuitamente al triaje visual y al comparador de precios.

El software genera ingresos de forma sostenible a travÃ©s de **dos lÃ­neas de negocio B2B / B2B2C altamente viables**:

1. **ComisiÃ³n por TransacciÃ³n en Farmacias Aliadas (Marketplace FarmacÃ©utico â€” *Affiliate / CPA*)**:
   - **CÃ³mo funciona**: Cada vez que un paciente necesita adquirir los medicamentos o insumos de curaciÃ³n recetados por su cirujano (ej. *Clorhexidina SoluciÃ³n 2%* o *ApÃ³sito Tegaderm 3M*), la app le muestra en quÃ© farmacia estÃ¡n mÃ¡s baratos y permite comprarlos desde el botÃ³n **`Pedir Online â†—`**.
   - **Por quÃ© es rentable y creÃ­ble**: Las cadenas farmacÃ©uticas aliadas (como **Cruz Azul** o **Fybeca**) otorgan a **Visual RAG** un porcentaje de comisiÃ³n (entre el **6% y el 12%** sobre el valor de la venta) por cada compra concretada desde la aplicaciÃ³n. Para las farmacias esto representa clientes seguros con receta mÃ©dica activa y alta recurrencia durante todo su postoperatorio, sin que el paciente pague un centavo extra.

2. **Convenios con Aseguradoras de Salud y Medicina Prepagada (ReducciÃ³n de Siniestralidad B2B)**:
   - **CÃ³mo funciona**: Las empresas de seguros mÃ©dicos y medicina prepagada integran **Visual RAG** dentro de su cobertura postoperatoria pagando una tarifa fija por paciente operado monitoreado (*tarifa por episodio quirÃºrgico*).
   - **Por quÃ© es rentable y creÃ­ble**: Para una aseguradora, una infecciÃ³n postoperatoria detectada tarde o un reingreso hospitalario de urgencia cuesta miles de dÃ³lares en hospitalizaciÃ³n y reintervenciÃ³n. Al financiar el monitoreo preventivo con **Visual RAG**, la aseguradora detecta signos de alerta a tiempo desde casa y reduce drÃ¡sticamente sus gastos por complicaciones evitables, convirtiendo el pago del software en un ahorro directo para la aseguradora.

---

## 3. Uso de Inteligencia Artificial en la CreaciÃ³n del Proyecto

Este proyecto fue desarrollado aplicando metodologÃ­as modernas de **IngenierÃ­a de Software Asistida por IA (AI-Driven Software Development)**, integrando diseÃ±o UI/UX desde Figma, arquitectura limpia por dominios y desarrollo mÃ³vil multiplataforma.

### Inteligencia Artificial y Herramientas Utilizadas
- **Agente de IA e IDE**: **Google Antigravity (AGY)** impulsado por modelos fundacionales avanzados de generaciÃ³n de cÃ³digo y anÃ¡lisis multimodal (**Claude Opus 4.6 / Gemini**).
- **IntegraciÃ³n Directa con DiseÃ±o (MCP)**: Servidor **Figma MCP (Model Context Protocol)** (`get_metadata`, `get_design_context`, `get_screenshot`), utilizado por la IA para inspeccionar directamente los nodos de las 10 pantallas del prototipo en Figma, extraer la paleta de colores clÃ­nica, las medidas exactas y descargar los 272 vectores SVG locales sin intervenciÃ³n manual.

### Prompt Inicial Utilizado
A continuaciÃ³n, se documenta de forma Ã­ntegra el **prompt inicial** entregado a la IA para la generaciÃ³n arquitectÃ³nica y funcional del proyecto:

> *"Crea el proyecto visual RAG basÃ¡ndote en un prototipo mÃ³vil realizado en figma (https://www.figma.com/design/WmzK6xpeiBrKucpNzUKIYP/VISUALRAGTRAIE?node-id=22-221&p=f&t=8a3NuzHfzabmUxGU-0) usando ReactNative administrado por Expo para el front-end y genera el back-end con una arquitectura de microservicios y usando la metodologÃ­a Domain-Driven Design, mantÃ©n una estructura de carpetas ordenadas y comenta cada funciÃ³n dentro del cÃ³digo para entender que hace. Visual RAG  es una APP donde el Paciente sube la foto de su herida postoperatoria, su foto es evaluada usando un dataset evaluado con machine learning (RAG) y acorde a su tratamiento mÃ©dico subido por su doctor la APP recomienda medicamentos a mejores precios"*

---

## 4. Flujo de Negocio Principal

1. **Paciente sube la fotografÃ­a de su herida postoperatoria (1 a 4 fotos)**: Desde la pestaÃ±a **EvaluaciÃ³n**, el paciente captura o selecciona las imÃ¡genes de su incisiÃ³n quirÃºrgica (`Correcion Neuronal`).
2. **EvaluaciÃ³n con Dataset Machine Learning (Visual RAG)**: El microservicio `visual-rag-service` extrae el vector de caracterÃ­sticas visuales (`VisualEmbedding`), ejecuta una bÃºsqueda de similitud coseno ($k\text{-NN}$) contra el dataset clÃ­nico de heridas postoperatorias (`PostOpWoundDataset`) y genera un **Reporte ClÃ­nico Oficial** verificado (`REP-475381`, `CicatrizaciÃ³n Normal`, `EvoluciÃ³n Favorable`).
3. **AlineaciÃ³n con el Tratamiento MÃ©dico subido por el Doctor**: El microservicio `clinical-orders-service` gestiona la **Ficha Postoperatoria** configurada por el MÃ©dico Cirujano (cronograma de reposo, acciones prohibidas, cuidados permitidos, signos de alerta e insumos recetados).
4. **RecomendaciÃ³n de Medicamentos a Mejores Precios**: El microservicio `pharmacy-pricing-service` cruza los medicamentos del tratamiento mÃ©dico y del diagnÃ³stico Visual RAG contra los catÃ¡logos de farmacias aliadas (**Cruz Azul** vs **Fybeca**), calculando el ahorro (`Ahorras $0.95 en este insumo`, `Cruz Azul $3.20 Precio MÃ¡s Bajo` vs `Fybeca $4.15 Entrega en 30 min`).
5. **Scraper Web de Farmacias en Tiempo Real**: Incorpora un extractor web automatizado (`FybecaPharmacyScraper`) que consulta directamente el catÃ¡logo digital de farmacias vÃ­a HTTPS nativo, analizando precios de mercado en vivo (`data-gtm` / ecommerce) con soporte resiliente de contingencia offline.

---

## 5. Estructura de Carpetas del Proyecto

```text
visual_RAG-Grupo2/
â”œâ”€â”€ .gitignore                                    # Reglas de exclusiÃ³n de Git (node_modules, .expo, etc.)
â”œâ”€â”€ README.md                                     # DocumentaciÃ³n general, modelo de negocio y arquitectura
â”‚
â”œâ”€â”€ backend/                                      # Back-End: Microservicios + Domain-Driven Design (DDD)
â”‚   â”œâ”€â”€ package.json                              # Scripts de arranque y pruebas del Back-End
â”‚   â”œâ”€â”€ package-lock.json                         # Ãrbol bloqueado de dependencias del Back-End
â”‚   â”œâ”€â”€ start-all.js                              # Orquestador de los 4 microservicios + API Gateway
â”‚   â”œâ”€â”€ test-microservices.js                     # Suite de verificaciÃ³n DDD de extremo a extremo
â”‚   â”œâ”€â”€ api-gateway/                              # Punto de entrada Ãºnico (Puerto 4000)
â”‚   â”‚   â””â”€â”€ src/
â”‚   â”‚       â””â”€â”€ index.js                          # Enrutador central y orquestador de Triage Visual RAG
â”‚   â””â”€â”€ services/
â”‚       â”œâ”€â”€ identity-service/                     # Bounded Context 1: Identidad y Perfiles (Puerto 4001)
â”‚       â”‚   â””â”€â”€ src/
â”‚       â”‚       â”œâ”€â”€ index.js                      # Servidor HTTP del microservicio de identidad
â”‚       â”‚       â”œâ”€â”€ domain/
â”‚       â”‚       â”‚   â”œâ”€â”€ entities/User.js          # Entidad raÃ­z de agregado User
â”‚       â”‚       â”‚   â”œâ”€â”€ value-objects/ClinicalInfo.js
â”‚       â”‚       â”‚   â””â”€â”€ repositories/IUserRepository.js
â”‚       â”‚       â”œâ”€â”€ application/
â”‚       â”‚       â”‚   â””â”€â”€ use-cases/IdentityUseCases.js
â”‚       â”‚       â””â”€â”€ infrastructure/
â”‚       â”‚           â”œâ”€â”€ persistence/InMemoryUserRepository.js
â”‚       â”‚           â””â”€â”€ http/IdentityController.js
â”‚       â”œâ”€â”€ clinical-orders-service/              # Bounded Context 2: Ã“rdenes y Ficha PostOp (Puerto 4002)
â”‚       â”‚   â””â”€â”€ src/
â”‚       â”‚       â”œâ”€â”€ index.js                      # Servidor HTTP del microservicio de Ã³rdenes clÃ­nicas
â”‚       â”‚       â”œâ”€â”€ domain/
â”‚       â”‚       â”‚   â”œâ”€â”€ entities/PostOpRecord.js  # Entidad raÃ­z Ficha Postoperatoria
â”‚       â”‚       â”‚   â”œâ”€â”€ value-objects/SurgerySchedule.js
â”‚       â”‚       â”‚   â””â”€â”€ repositories/IPostOpRecordRepository.js
â”‚       â”‚       â”œâ”€â”€ application/
â”‚       â”‚       â”‚   â””â”€â”€ use-cases/ClinicalOrdersUseCases.js
â”‚       â”‚       â””â”€â”€ infrastructure/
â”‚       â”‚           â”œâ”€â”€ persistence/InMemoryPostOpRecordRepository.js
â”‚       â”‚           â””â”€â”€ http/ClinicalOrdersController.js
â”‚       â”œâ”€â”€ visual-rag-service/                   # Bounded Context 3: Motor ML Visual RAG (Puerto 4003)
â”‚       â”‚   â””â”€â”€ src/
â”‚       â”‚       â”œâ”€â”€ index.js                      # Servidor HTTP del microservicio Visual RAG
â”‚       â”‚       â”œâ”€â”€ domain/
â”‚       â”‚       â”‚   â”œâ”€â”€ entities/WoundEvaluationReport.js
â”‚       â”‚       â”‚   â”œâ”€â”€ value-objects/VisualEmbedding.js
â”‚       â”‚       â”‚   â”œâ”€â”€ services/WoundRagEvaluatorService.js
â”‚       â”‚       â”‚   â””â”€â”€ repositories/IWoundReportRepository.js
â”‚       â”‚       â”œâ”€â”€ application/
â”‚       â”‚       â”‚   â””â”€â”€ use-cases/VisualRagUseCases.js
â”‚       â”‚       â””â”€â”€ infrastructure/
â”‚       â”‚           â”œâ”€â”€ dataset/PostOpWoundDataset.js
â”‚       â”‚           â”œâ”€â”€ persistence/InMemoryWoundReportRepository.js
â”‚       â”‚           â””â”€â”€ http/VisualRagController.js
â”‚       â””â”€â”€ pharmacy-pricing-service/             # Bounded Context 4: Farmacia y Precios (Puerto 4004)
â”‚           â””â”€â”€ src/
â”‚               â”œâ”€â”€ index.js                      # Servidor HTTP del microservicio de farmacia
â”‚               â”œâ”€â”€ domain/
â”‚               â”‚   â”œâ”€â”€ entities/MedicationProduct.js
â”‚               â”‚   â”œâ”€â”€ value-objects/PriceComparisonResult.js
â”‚               â”‚   â”œâ”€â”€ services/BestPriceRecommenderService.js
â”‚               â”‚   â”œâ”€â”€ services/IPharmacyScraper.js
â”‚               â”‚   â””â”€â”€ repositories/IMedicationRepository.js
â”‚               â”œâ”€â”€ application/
â”‚               â”‚   â””â”€â”€ use-cases/PharmacyPricingUseCases.js
â”‚               â””â”€â”€ infrastructure/
â”‚                   â”œâ”€â”€ persistence/InMemoryMedicationRepository.js
â”‚                   â”œâ”€â”€ scrapers/FybecaPharmacyScraper.js
â”‚                   â”œâ”€â”€ scrapers/run-scraper.js
â”‚                   â””â”€â”€ http/PharmacyPricingController.js
â”‚
â””â”€â”€ frontend/                                     # Front-End: React Native + Expo (TypeScript)
    â”œâ”€â”€ App.tsx                                   # Enrutador raÃ­z (Login, Portal Paciente, Portal MÃ©dico)
    â”œâ”€â”€ app.json                                  # ConfiguraciÃ³n del proyecto Expo
    â”œâ”€â”€ babel.config.js                           # ConfiguraciÃ³n de compilaciÃ³n Babel para Expo
    â”œâ”€â”€ tsconfig.json                             # ConfiguraciÃ³n de TypeScript
    â”œâ”€â”€ package.json                              # Dependencias de Expo y React Native
    â”œâ”€â”€ package-lock.json                         # Ãrbol bloqueado de dependencias del Front-End
    â”œâ”€â”€ assets/figma/                             # 272 vectores SVG descargados localmente desde Figma
    â””â”€â”€ src/
        â”œâ”€â”€ assets/
        â”‚   â””â”€â”€ figmaManifest.ts                  # Manifiesto local de assets de Figma
        â”œâ”€â”€ components/
        â”‚   â”œâ”€â”€ common/
        â”‚   â”‚   â”œâ”€â”€ TopHeader.tsx                 # Encabezado Portal Paciente y Portal MÃ©dico
        â”‚   â”‚   â”œâ”€â”€ PatientBottomBar.tsx          # Barra inferior de 5 pestaÃ±as (Paciente)
        â”‚   â”‚   â”œâ”€â”€ DoctorBottomBar.tsx           # Barra inferior de 3 pestaÃ±as (MÃ©dico)
        â”‚   â”‚   â””â”€â”€ ReportDetailModal.tsx         # Pantalla 04: Modal Reporte ClÃ­nico Oficial
        â”‚   â””â”€â”€ icons/
        â”‚       â””â”€â”€ FigmaIcons.tsx                # Componentes SVG con los trazos exactos de Figma
        â”œâ”€â”€ context/
        â”‚   â””â”€â”€ AppContext.tsx                    # Estado global y sincronizaciÃ³n con el API Gateway
        â”œâ”€â”€ screens/
        â”‚   â”œâ”€â”€ auth/
        â”‚   â”‚   â””â”€â”€ LoginScreen.tsx               # Pantalla 01: Login Screen (Paciente / MÃ©dico Cirujano)
        â”‚   â”œâ”€â”€ patient/
        â”‚   â”‚   â”œâ”€â”€ EvaluationScreen.tsx          # Pantalla 02: Paciente - EvaluaciÃ³n
        â”‚   â”‚   â”œâ”€â”€ SavedReportsScreen.tsx        # Pantalla 03: Paciente - Reportes Guardados
        â”‚   â”‚   â”œâ”€â”€ PharmacyScreen.tsx            # Pantalla 05: Paciente - Farmacia & Insumos
        â”‚   â”‚   â”œâ”€â”€ MedicalOrdersScreen.tsx       # Pantalla 06: Paciente - Ã“rdenes MÃ©dicas
        â”‚   â”‚   â””â”€â”€ PatientProfileScreen.tsx      # Pantalla 07: Paciente - Perfil ClÃ­nico
        â”‚   â””â”€â”€ doctor/
        â”‚       â”œâ”€â”€ DoctorPatientsScreen.tsx      # Pantalla 08: Doctor - Mis Pacientes
        â”‚       â”œâ”€â”€ PostOpRecordScreen.tsx        # Pantalla 09: Doctor - Ficha Postoperatoria
        â”‚       â””â”€â”€ DoctorProfileScreen.tsx       # Pantalla 10: Doctor - Perfil Profesional
        â”œâ”€â”€ services/
        â”‚   â””â”€â”€ apiClient.ts                      # Cliente HTTP hacia el API Gateway (Puerto 4000)
        â”œâ”€â”€ theme/
        â”‚   â””â”€â”€ colors.ts                         # Tokens de diseÃ±o (Teal #0D9488, Slate #0F172A, etc.)
        â””â”€â”€ types/
            â””â”€â”€ index.ts                          # Contratos e interfaces TypeScript
```

---

## 6. Cuentas Demo Incluidas

- **Cuenta Paciente Demo**: `nelsoncasa@gmail.com` / `nelson123`
- **Cuenta MÃ©dico Cirujano Demo**: `nelson.doctor@gmail.com` / `doctor123`

---

## 7. Instrucciones de EjecuciÃ³n

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

