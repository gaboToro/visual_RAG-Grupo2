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

async function runDddMicroservicesTests() {
  console.log('==============================================================');
  console.log('  Ejecutando Pruebas DDD de Microservicios - VISUAL RAG       ');
  console.log('==============================================================');

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

  let duplicateErrorCaught = false;
  try {
    await identityUseCases.assignNewPatient({
      fullName: 'Duplicado Test',
      email: 'nelsoncasa@gmail.com',
      cedula: '1700000001',
    });
  } catch (err) {
    duplicateErrorCaught = err.statusCode === 409;
  }
  console.assert(duplicateErrorCaught, 'Debe rechazar correos duplicados con código 409');

  const assignedPatient = await identityUseCases.assignNewPatient({
    fullName: 'Carlos Andrés Pérez',
    email: 'carlos.perez@gmail.com',
    cedula: '1712345678',
    bloodType: 'ab+',
  });
  console.assert(assignedPatient.clinicalInfo.bloodType === 'AB+', 'Normalización de grupo sanguíneo falló');
  const removedResult = await identityUseCases.removePatient(assignedPatient.id);
  console.assert(removedResult.success === true, 'Eliminación de paciente asignado falló');
  console.log('✅ [Identity-Service] Validación de duplicados, alta y baja de paciente verificada');

  const updatedRecord = await clinicalUseCases.savePatientPostOpRecord('pat-2', {
    procedureName: 'Colecistectomía Laparoscópica',
    surgeryDate: '2026-10-31',
    totalRestDays: 20,
    currentDay: 15,
    prohibitedActions: ['Evitar grasas', 'Evitar grasas', 'No levantar peso'],
  });
  console.assert(updatedRecord.schedule.remainingDays === 5, 'Cálculo de días restantes incorrecto');
  console.assert(updatedRecord.prohibitedActions.length === 2, 'Deduplicación de indicaciones falló');
  console.log('✅ [Clinical-Orders-Service] Actualización y deduplicación de ficha verificada');

  const infectionReport = await ragUseCases.evaluatePatientWoundPhotos({
    patientId: 'pat-2',
    patientName: 'María Elena Quispe',
    postOpDay: 15,
    photos: ['file:///herida-alerta-1.jpg'],
    patientNotes: 'Presenta fiebre y secreción purulenta en el borde',
    doctorTreatment: updatedRecord,
  });
  console.assert(
    infectionReport.diagnosisTitle === 'Signos de Infección / Dehiscencia',
    'Error en detección RAG de signos de infección'
  );
  console.assert(
    infectionReport.statusBadge === 'Requiere Atención Médica',
    'El badge de alerta médica debe activarse ante signos de infección'
  );
  const fetchedByFolio = await ragUseCases.getReportDetailByFolio(infectionReport.folio);
  console.assert(fetchedByFolio.photoUris.length === 1, 'Persistencia de URIs de fotos falló');
  console.log(
    '✅ [Visual-RAG-Service] Detección de signos de alerta y consulta por folio verificada:',
    infectionReport.folio
  );

  const catalogItems = await pharmacyUseCases.getFullCatalog();
  console.assert(catalogItems.length >= 5, 'El catálogo ampliado debe tener al menos 5 insumos');
  console.assert(
    typeof pharmacyRec.totalSavingsAmount === 'number' && pharmacyRec.totalSavingsAmount > 0,
    'El ahorro total estimado debe ser mayor a 0'
  );
  console.log(
    '✅ [Pharmacy-Pricing-Service] Catálogo ampliado verificado:',
    `${catalogItems.length} insumos disponibles`
  );

  console.log('\n🎉 Todas las pruebas de los 4 microservicios DDD finalizaron con éxito.');
}

runDddMicroservicesTests().catch((err) => {
  console.error('❌ Error en pruebas de microservicios:', err);
  process.exit(1);
});
