/**
 * @file start-all.js
 * @description Orquestador maestro que inicia los 4 microservicios DDD y el API Gateway
 * de Visual RAG en un único comando (`npm start` dentro de /backend).
 */

const { startIdentityService } = require('./services/identity-service/src/index');
const { startClinicalOrdersService } = require('./services/clinical-orders-service/src/index');
const { startVisualRagService } = require('./services/visual-rag-service/src/index');
const { startPharmacyPricingService } = require('./services/pharmacy-pricing-service/src/index');
const { startApiGateway } = require('./api-gateway/src/index');

/**
 * Inicializa todos los microservicios del ecosistema Visual RAG y el API Gateway.
 * @returns {Object} Instancias de los servidores levantados.
 */
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
