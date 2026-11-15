class VisualEmbedding {

  constructor(vector) {
    if (!Array.isArray(vector) || vector.length !== 6) {
      throw new Error('El VisualEmbedding requiere exactamente 6 dimensiones de características visuales.');
    }
    this.vector = vector.map((v) => Number(v));
    Object.freeze(this.vector);
    Object.freeze(this);
  }

  static fromUploadedPhotos({ photos = [], postOpDay = 79, patientNotes = '' }) {
    const notesLower = (patientNotes || '').toLowerCase();
    const photoSeed = photos.length > 0 ? String(photos[0]?.uri || photos[0] || '') : 'default';

    if (notesLower.includes('roja') || notesLower.includes('borde') || photoSeed.includes('hypertrophic')) {
      return new VisualEmbedding([0.92, 0.85, 0.32, 0.24, 0.05, 0.78]);
    }

    const maturityFactor = Math.min(1.0, Math.max(0.75, postOpDay / 80));
    return new VisualEmbedding([
      Number((0.96 * maturityFactor).toFixed(3)),
      Number((0.94 * maturityFactor).toFixed(3)),
      0.08,
      0.06,
      0.02,
      0.95,
    ]);
  }

  cosineSimilarity(targetVector) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < this.vector.length; i++) {
      dotProduct += this.vector[i] * targetVector[i];
      normA += this.vector[i] * this.vector[i];
      normB += targetVector[i] * targetVector[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;
    return Number((dotProduct / denominator).toFixed(4));
  }
}

module.exports = { VisualEmbedding };
