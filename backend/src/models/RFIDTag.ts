import mongoose, { Schema, Document } from 'mongoose';

export interface IRFIDTag extends Document {
  tagId: string;
  userId: mongoose.Types.ObjectId;
  description: string;
  isActive: boolean;
  permissions: string[];
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const rfidTagSchema = new Schema<IRFIDTag>({
  tagId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: [{
    type: String,
    enum: ['door_access', 'elevator_access', 'parking_access', 'admin_area']
  }],
  lastUsed: {
    type: Date
  }
}, {
  timestamps: true
});

export const RFIDTag = mongoose.model<IRFIDTag>('RFIDTag', rfidTagSchema);