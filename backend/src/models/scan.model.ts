import mongoose, { Document, Schema } from 'mongoose';

// 🧾 Interface TypeScript pour typer les données
export interface IScan extends Document {
  residentId: string;
  tag: string;
  zone: string;
  timestamp: Date;
}

// 🧱 Schéma Mongoose
const ScanSchema: Schema<IScan> = new Schema({
  residentId: {
    type: String,
    required: [true, 'residentId est requis'],
    trim: true
  },
  tag: {
    type: String,
    required: [true, 'tag est requis'],
    trim: true
  },
  zone: {
    type: String,
    required: [true, 'zone est requise'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true, // Ajoute createdAt et updatedAt
  collection: 'scans' // Nom explicite de la collection
});

// Index pour optimiser les requêtes
ScanSchema.index({ residentId: 1, timestamp: -1 });
ScanSchema.index({ zone: 1, timestamp: -1 });
ScanSchema.index({ tag: 1 });

// 📦 Export du modèle prêt à l'emploi
export const Scan = mongoose.model<IScan>('Scan', ScanSchema);