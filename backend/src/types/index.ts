export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  rfidTags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RFIDTag {
  id: string;
  tagId: string;
  userId: string;
  description: string;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessLog {
  id: string;
  tagId: string;
  userId: string;
  action: 'access_granted' | 'access_denied';
  location: string;
  timestamp: Date;
  metadata?: any;
}

export interface AuthRequest extends Request {
  user?: User;
}