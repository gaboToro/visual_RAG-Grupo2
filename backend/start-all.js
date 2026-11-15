const { startIdentityService } = require('./services/identity-service/src/index');
const { startClinicalOrdersService } = require('./services/clinical-orders-service/src/index');
const { startVisualRagService } = require('./services/visual-rag-service/src/index');
const { startPharmacyPricingService } = require('./services/pharmacy-pricing-service/src/index');
const { startApiGateway } = require('./api-gateway/src/index');

function bootstrapMicroservicesEcosystem() {
  console.log('==============================================================');
  console.log('  Iniciando Arquitectura de Microservicios DDD - VISUAL RAG   ');
  console.log('==============================================================');

  const identityServer = startIdentityService(4001);
  const clinicalServer = startClinicalOrdersService(4002);
  const ragServer = startVisualRagService(4003);
  const pharmacyServer = startPharmacyPricingService(4004);
  const gatewayServer = startApiGateway(4000);

  return {
    identityServer,
    clinicalServer,
    ragServer,
    pharmacyServer,
    gatewayServer,
  };
}

if (require.main === module) {
  bootstrapMicroservicesEcosystem();
}

module.exports = { bootstrapMicroservicesEcosystem };
