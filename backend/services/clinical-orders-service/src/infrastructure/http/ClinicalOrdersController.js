/**
 * @file ClinicalOrdersController.js
 * @description Controlador HTTP (Infrastructure Layer - DDD) para consultar y actualizar
 * las Fichas Postoperatorias y Órdenes de Recuperación.
 */

class ClinicalOrdersController {
  /**
   * Inicializa el controlador inyectando los casos de uso de Órdenes Clínicas.
   * @param {import('../../application/use-cases/ClinicalOrdersUseCases').ClinicalOrdersUseCases} useCases
   */
  constructor(useCases) {
    this.useCases = useCases;
  }

  /**
   * Enruta las peticiones HTTP entrantes hacia el caso de uso correspondiente.
   * @param {import('http').IncomingMessage} req - Petición HTTP.
   * @param {import('http').ServerResponse} res - Respuesta HTTP.
   * @param {Object} parsedBody - Cuerpo JSON analizado.
   * @param {URL} urlObj - Objeto URL.
   */
  async handleRequest(req, res, parsedBody, urlObj) {
    const pathname = urlObj.pathname;
    const method = req.method;

    try {
      // GET /orders/:patientId -> Obtiene las órdenes médicas y ficha postoperatoria del paciente
      const getMatch = pathname.match(/^\/orders\/([^/]+)$/);
      if (method === 'GET' && getMatch) {
        const patientId = getMatch[1];
        const record = await this.useCases.getPatientPostOpRecord(patientId);
        return this.sendJson(res, 200, { record });
      }

      // PUT /orders/:patientId -> Guarda o actualiza la ficha postoperatoria subida por el doctor
      if (method === 'PUT' && getMatch) {
        const patientId = getMatch[1];
        const updatedRecord = await this.useCases.savePatientPostOpRecord(patientId, parsedBody);
        return this.sendJson(res, 200, { record: updatedRecord });
      }

      // GET /health -> Estado del microservicio
      if (method === 'GET' && pathname === '/health') {
        return this.sendJson(res, 200, {
          service: 'clinical-orders-service',
          boundedContext: 'Postoperative Orders & Medical Care',
          status: 'UP',
        });
      }

      return this.sendJson(res, 404, {
        error: `Ruta no encontrada en clinical-orders-service: ${pathname}`,
      });
    } catch (error) {
      return this.sendJson(res, error.statusCode || 400, { error: error.message });
    }
  }

  /**
   * Envía una respuesta JSON con cabeceras CORS configuradas.
   * @param {import('http').ServerResponse} res - Respuesta HTTP.
   * @param {number} statusCode - Código de estado HTTP.
   * @param {Object} payload - Objeto a serializar.
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

module.exports = { ClinicalOrdersController };
