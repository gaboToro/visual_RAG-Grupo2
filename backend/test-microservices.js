/**
 * @file test-microservices.js
 * @description Suite de pruebas de integración para verificar todos los microservicios DDD
 * y la orquestación del flujo de negocio de Visual RAG (Paciente + Doctor + RAG + Farmacia).
 */

const {
  InMemoryUserRepository,
} = require('./services/identity-service/src/infrastructure/persistence/InMemoryUserRepository');
const {
  IdentityUseCases,
} = require('./services/identity-service/src/application/use-cases/IdentityUseCases');

const {
  InMemoryPostOpRecordRepository,
} = require('./services/clinical-orders-service/src/infrastructure/persistence/InMemoryPostOpRecordRepository');
const {
  ClinicalOrdersUseCases,
} = require('./services/clinical-orders-service/src/application/use-cases/ClinicalOrdersUseCases');

const {
  PostOpWoundDataset,
} = require('./services/visual-rag-service/src/infrastructure/dataset/PostOpWoundDataset');
const {
  InMemoryWoundReportRepository,
} = require('./services/visual-rag-service/src/infrastructure/persistence/InMemoryWoundReportRepository');
const {
  WoundRagEvaluatorService,
} = require('./services/visual-rag-service/src/domain/services/WoundRagEvaluatorService');
const {
  VisualRagUseCases,
} = require('./services/visual-rag-service/src/application/use-cases/VisualRagUseCases');

const {
  InMemoryMedicationRepository,
} = require('./services/pharmacy-pricing-service/src/infrastructure/persistence/InMemoryMedicationRepository');
const {
  BestPriceRecommenderService,
} = require('./services/pharmacy-pricing-service/src/domain/services/BestPriceRecommenderService');
const {
  PharmacyPricingUseCases,
} = require('./services/pharmacy-pricing-service/src/application/use-cases/PharmacyPricingUseCases');

/**
 * Ejecuta secuencialmente las pruebas de los 4 microservicios DDD validando sus entidades,
 * objetos de valor, servicios de dominio y casos de uso.
 */
async function runDddMicroservicesTests() {
  console.log('==============================================================');
  console.log('  Ejecutando Pruebas DDD de Microservicios - VISUAL RAG       ');
  console.log('==============================================================');

  // 1. Microservicio Identity-Service
  const identityUseCases = new IdentityUseCases(new InMemoryUserRepository());
  const patientAuth = await identityUseCases.authenticateUser({
    email: 'nelsoncasa@gmail.com',
    password: 'nelson123',
    role: 'PATIENT',
  });
  console.assert(patientAuth.user.fullName === 'Nelson Steven Casa', 'Error en Login Paciente');
  console.log('✅ [Identity-Service] Login Paciente verificado:', patientAuth.user.fullName);

  const doctorAuth = await identityUseCases.authenticateUser({
    email: 'nelson.doctor@gmail.com',
    password: 'doctor123',
    role: 'DOCTOR',
  });
  console.assert(doctorAuth.user.fullName === 'Dr. Nelson Casa', 'Error en Login Doctor');
  console.log('✅ [Identity-Service] Login Médico Cirujano verificado:', doctorAuth.user.fullName);

  // 2. Microservicio Clinical-Orders-Service
  const clinicalUseCases = new ClinicalOrdersUseCases(new InMemoryPostOpRecordRepository());
  const postOpRecord = await clinicalUseCases.getPatientPostOpRecord('pat-1');
  console.assert(
    postOpRecord.schedule.procedureName === 'Correcion Neuronal',
    'Error en procedimiento quirúrgico'
  );
  console.log(
    '✅ [Clinical-Orders-Service] Ficha Postoperatoria cargada:',
    postOpRecord.schedule.procedureName,
    `(${postOpRecord.schedule.completionPercentage}%)`
  );

  // 3. Microservicio Visual-RAG-Service (Dataset ML + Evaluación de Herida)
  const ragUseCases = new VisualRagUseCases(
    new InMemoryWoundReportRepository(),
    new WoundRagEvaluatorService(new PostOpWoundDataset())
  );
  const newReport = await ragUseCases.evaluatePatientWoundPhotos({
    patientId: 'pat-1',
    patientName: 'Nelson Steven Casa',
    postOpDay: 79,
    photos: ['Foto #1', 'Foto #2'],
    doctorTreatment: postOpRecord,
  });
  console.assert(
    newReport.diagnosisTitle === 'Cicatrización Normal',
    'Error en clasificación RAG'
  );
  console.log(
    '✅ [Visual-RAG-Service] Evaluación ML/RAG exitosa:',
    newReport.folio,
    '->',
    newReport.diagnosisTitle,
    `(Confianza: ${newReport.confidenceScore})`
  );

  // 4. Microservicio Pharmacy-Pricing-Service (Mejores Precios de Medicamentos)
  const pharmacyUseCases = new PharmacyPricingUseCases(
    new InMemoryMedicationRepository(),
    new BestPriceRecommenderService()
  );
  const pharmacyRec = await pharmacyUseCases.getRecommendationsForPatient({
    postOpDay: 79,
    woundClassification: newReport.diagnosisTitle,
    prescribedMedications: postOpRecord.prescribedMedications,
  });
  console.assert(
    pharmacyRec.priceComparison.savingsAmount === 0.95,
    'El ahorro calculado entre Cruz Azul ($3.20) y Fybeca ($4.15) debe ser $0.95'
  );
  console.log(
    '✅ [Pharmacy-Pricing-Service] Comparativa de Precios:',
    pharmacyRec.priceComparison.savingsLabel,
    `| Mejor oferta: ${pharmacyRec.priceComparison.bestOffer.pharmacyName} (${pharmacyRec.priceComparison.bestOffer.formattedPrice})`
  );

  console.log('\n🎉 Todas las pruebas de los 4 microservicios DDD finalizaron con éxito.');
}

runDddMicroservicesTests().catch((err) => {
  console.error('❌ Error en pruebas de microservicios:', err);
  process.exit(1);
});
