/**
 * @file PharmacyPricingController.js
 * @description Controlador HTTP (Infrastructure Layer - DDD) del microservicio de Farmacia y Precios.
 */

class PharmacyPricingController {
  /**
   * Inicializa el controlador inyectando los casos de uso de Farmacia.
   * @param {import('../../application/use-cases/PharmacyPricingUseCases').PharmacyPricingUseCases} useCases
   */
  constructor(useCases) {
    this.useCases = useCases;
  }

  /**
   * Enruta las peticiones HTTP hacia los casos de uso del contexto de Farmacia.
   * @param {import('http').IncomingMessage} req - Petición HTTP.
   * @param {import('http').ServerResponse} res - Respuesta HTTP.
   * @param {Object} parsedBody - Cuerpo JSON analizado.
   * @param {URL} urlObj - Objeto URL.
   */
  async handleRequest(req, res, parsedBody, urlObj) {
    const pathname = urlObj.pathname;
    const method = req.method;

    try {
      // GET /recommendations o POST /recommendations -> Obtiene comparativa de precios e insumos
      if ((method === 'GET' || method === 'POST') && pathname === '/recommendations') {
        const postOpDay = Number(urlObj.searchParams.get('postOpDay')) || parsedBody.postOpDay || 79;
        const woundClassification =
          urlObj.searchParams.get('woundClassification') ||
          parsedBody.woundClassification ||
          'Cicatrización Normal';
        const prescribedMedications = parsedBody.prescribedMedications || [];

        const data = await this.useCases.getRecommendationsForPatient({
          postOpDay,
          woundClassification,
          prescribedMedications,
        });
        return this.sendJson(res, 200, data);
      }

      // GET /health -> Estado del microservicio
      if (method === 'GET' && pathname === '/health') {
        return this.sendJson(res, 200, {
          service: 'pharmacy-pricing-service',
          boundedContext: 'Pharmacy & Best-Price Medication Recommendations',
          status: 'UP',
        });
      }

      return this.sendJson(res, 404, {
        error: `Ruta no encontrada en pharmacy-pricing-service: ${pathname}`,
      });
    } catch (error) {
      return this.sendJson(res, error.statusCode || 400, { error: error.message });
    }
  }

  /**
   * Envía una respuesta JSON con cabeceras CORS configuradas.
   * @param {import('http').ServerResponse} res - Respuesta HTTP.
   * @param {number} statusCode - Código de estado HTTP.
   * @param {Object} payload - Cuerpo JSON.
   */
  sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end(JSON.stringify(payload));
  }
}

module.exports = { PharmacyPricingController };
