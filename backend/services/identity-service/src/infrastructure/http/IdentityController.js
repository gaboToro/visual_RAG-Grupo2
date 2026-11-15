class IdentityController {

  constructor(identityUseCases) {
    this.identityUseCases = identityUseCases;
  }

  async handleRequest(req, res, parsedBody, urlObj) {
    const pathname = urlObj.pathname;
    const method = req.method;

    try {

      if (method === 'POST' && pathname === '/login') {
        const result = await this.identityUseCases.authenticateUser(parsedBody);
        return this.sendJson(res, 200, result);
      }

      if (method === 'GET' && pathname === '/patients') {
        const q = urlObj.searchParams.get('q') || '';
        const patients = await this.identityUseCases.listDoctorPatients(q);
        return this.sendJson(res, 200, { patients });
      }

      if (method === 'POST' && pathname === '/patients') {
        const created = await this.identityUseCases.assignNewPatient(parsedBody);
        return this.sendJson(res, 201, { patient: created });
      }

      const patientProfileMatch = pathname.match(/^\/patients\/([^/]+)\/profile$/);
      if (method === 'PUT' && patientProfileMatch) {
        const patientId = patientProfileMatch[1];
        const updated = await this.identityUseCases.updatePatientClinicalProfile(
          patientId,
          parsedBody
        );
        return this.sendJson(res, 200, { user: updated });
      }

      const patientDeleteMatch = pathname.match(/^\/patients\/([^/]+)$/);
      if (method === 'DELETE' && patientDeleteMatch) {
        const patientId = patientDeleteMatch[1];
        const result = await this.identityUseCases.removePatient(patientId);
        return this.sendJson(res, 200, result);
      }

      const doctorProfileMatch = pathname.match(/^\/doctors\/([^/]+)\/profile$/);
      if (method === 'PUT' && doctorProfileMatch) {
        const doctorId = doctorProfileMatch[1];
        const updated = await this.identityUseCases.updateDoctorProfessionalProfile(
          doctorId,
          parsedBody
        );
        return this.sendJson(res, 200, { user: updated });
      }

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
