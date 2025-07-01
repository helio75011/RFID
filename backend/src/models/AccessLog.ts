import mongoose, { Schema, Document } from 'mongoose';

export interface IAccessLog extends Document {
  tagId: string;
  userId: mongoose.Types.ObjectId;
  action: 'access_granted' | 'access_denied';
  location: string;
  timestamp: Date;
  metadata?: any;
}

const accessLogSchema = new Schema<IAccessLog>({
  tagId: {
    type: String,
    required: true,
    ref: 'RFIDTag'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['access_granted', 'access_denied'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: false
});

export const AccessLog = mongoose.model<IAccessLog>('AccessLog', accessLogSchema);