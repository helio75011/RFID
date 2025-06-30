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
    required: true 
  },
  tag: { 
    type: String, 
    required: true 
  },
  zone: { type: String, 
    required: true 
  },
  timestamp: { type: Date, 
    default: 
    Date.now 
  }
});

// 📦 Export du modèle prêt à l'emploi
export const Scan = mongoose.model<IScan>('Scan', ScanSchema);