/**
 * @file IdentityController.js
 * @description Controlador HTTP (Infrastructure Layer - DDD) que expone los endpoints REST
 * del microservicio de Identidad para autenticación, pacientes y perfiles.
 */

class IdentityController {
  /**
   * Inicializa el controlador inyectando los casos de uso de Identidad.
   * @param {import('../../application/use-cases/IdentityUseCases').IdentityUseCases} identityUseCases
   */
  constructor(identityUseCases) {
    this.identityUseCases = identityUseCases;
  }

  /**
   * Maneja las peticiones entrantes en el microservicio de Identidad y enruta hacia el caso de uso correspondiente.
   * @param {import('http').IncomingMessage} req - Petición HTTP entrante.
   * @param {import('http').ServerResponse} res - Respuesta HTTP saliente.
   * @param {Object} parsedBody - Cuerpo JSON de la petición.
   * @param {URL} urlObj - Objeto URL analizado.
   */
  async handleRequest(req, res, parsedBody, urlObj) {
    const pathname = urlObj.pathname;
    const method = req.method;

    try {
      // POST /login -> Autenticación de Paciente o Médico Cirujano
      if (method === 'POST' && pathname === '/login') {
        const result = await this.identityUseCases.authenticateUser(parsedBody);
        return this.sendJson(res, 200, result);
      }

      // GET /patients -> Listado y búsqueda de pacientes asignados al médico
      if (method === 'GET' && pathname === '/patients') {
        const q = urlObj.searchParams.get('q') || '';
        const patients = await this.identityUseCases.listDoctorPatients(q);
        return this.sendJson(res, 200, { patients });
      }

      // POST /patients -> Asignar un nuevo paciente
      if (method === 'POST' && pathname === '/patients') {
        const created = await this.identityUseCases.assignNewPatient(parsedBody);
        return this.sendJson(res, 201, { patient: created });
      }

      // PUT /patients/:id/profile -> Actualizar datos clínicos del paciente
      const patientProfileMatch = pathname.match(/^\/patients\/([^/]+)\/profile$/);
      if (method === 'PUT' && patientProfileMatch) {
        const patientId = patientProfileMatch[1];
        const updated = await this.identityUseCases.updatePatientClinicalProfile(
          patientId,
          parsedBody
        );
        return this.sendJson(res, 200, { user: updated });
      }

      // DELETE /patients/:id -> Eliminar/desasignar paciente del listado del médico
      const patientDeleteMatch = pathname.match(/^\/patients\/([^/]+)$/);
      if (method === 'DELETE' && patientDeleteMatch) {
        const patientId = patientDeleteMatch[1];
        const result = await this.identityUseCases.removePatient(patientId);
        return this.sendJson(res, 200, result);
      }

      // PUT /doctors/:id/profile -> Actualizar datos profesionales del médico cirujano
      const doctorProfileMatch = pathname.match(/^\/doctors\/([^/]+)\/profile$/);
      if (method === 'PUT' && doctorProfileMatch) {
        const doctorId = doctorProfileMatch[1];
        const updated = await this.identityUseCases.updateDoctorProfessionalProfile(
          doctorId,
          parsedBody
        );
        return this.sendJson(res, 200, { user: updated });
      }

      // GET /health -> Estado de salud del microservicio
      if (method === 'GET' && pathname === '/health') {
        return this.sendJson(res, 200, {
          service: 'identity-service',
          boundedContext: 'Identity & Profiles',
          status: 'UP',
        });
      }

      return this.sendJson(res, 404, { error: `Ruta no encontrada en identity-service: ${pathname}` });
    } catch (error) {
      const status = error.statusCode || 400;
      return this.sendJson(res, status, { error: error.message });
    }
  }

  /**
   * Envía una respuesta JSON estandarizada con cabeceras CORS habilitadas.
   * @param {import('http').ServerResponse} res - Objeto de respuesta HTTP.
   * @param {number} statusCode - Código de estado HTTP.
   * @param {Object} payload - Cuerpo de datos a serializar en JSON.
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

module.exports = { IdentityController };
