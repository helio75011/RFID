import { RFIDTag, IRFIDTag } from '../models/RFIDTag';
import { AccessLog } from '../models/AccessLog';
import { User } from '../models/User';

export class RFIDService {
  static async createTag(tagData: {
    tagId: string;
    userId: string;
    description: string;
    permissions: string[];
  }): Promise<IRFIDTag> {
    const existingTag = await RFIDTag.findOne({ tagId: tagData.tagId });
    if (existingTag) {
      throw new Error('Cette étiquette RFID existe déjà');
    }

    const tag = new RFIDTag(tagData);
    await tag.save();

    // Ajouter l'étiquette à l'utilisateur
    await User.findByIdAndUpdate(
      tagData.userId,
      { $push: { rfidTags: tag.tagId } }
    );

    return tag;
  }

  static async validateAccess(
    tagId: string,
    location: string,
    requiredPermission: string
  ): Promise<{ granted: boolean; userId?: string; message: string }> {
    try {
      const tag = await RFIDTag.findOne({ tagId, isActive: true }).populate('userId');
      
      if (!tag) {
        await this.logAccess(tagId, null, 'access_denied', location, {
          reason: 'Étiquette non trouvée ou inactive'
        });
        return { granted: false, message: 'Étiquette non trouvée ou inactive' };
      }

      const user = tag.userId as any;
      if (!user.isActive) {
        await this.logAccess(tagId, user._id, 'access_denied', location, {
          reason: 'Utilisateur inactif'
        });
        return { granted: false, message: 'Utilisateur inactif' };
      }

      if (!tag.permissions.includes(requiredPermission)) {
        await this.logAccess(tagId, user._id, 'access_denied', location, {
          reason: 'Permissions insuffisantes',
          requiredPermission
        });
        return { granted: false, userId: user._id, message: 'Permissions insuffisantes' };
      }

      // Mise à jour de la dernière utilisation
      tag.lastUsed = new Date();
      await tag.save();

      // Log de l'accès accordé
      await this.logAccess(tagId, user._id, 'access_granted', location);

      return { 
        granted: true, 
        userId: user._id, 
        message: `Accès accordé pour ${user.name}` 
      };
    } catch (error) {
      console.error('Erreur lors de la validation d\'accès:', error);
      return { granted: false, message: 'Erreur système' };
    }
  }

  static async logAccess(
    tagId: string,
    userId: string | null,
    action: 'access_granted' | 'access_denied',
    location: string,
    metadata?: any
  ): Promise<void> {
    try {
      const accessLog = new AccessLog({
        tagId,
        userId,
        action,
        location,
        metadata
      });
      await accessLog.save();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du log:', error);
    }
  }

  static async getAccessLogs(filters?: {
    tagId?: string;
    userId?: string;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const query: any = {};
    
    if (filters?.tagId) query.tagId = filters.tagId;
    if (filters?.userId) query.userId = filters.userId;
    if (filters?.location) query.location = filters.location;
    
    if (filters?.startDate || filters?.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = filters.startDate;
      if (filters.endDate) query.timestamp.$lte = filters.endDate;
    }

    return AccessLog.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(filters?.limit || 100);
  }
}