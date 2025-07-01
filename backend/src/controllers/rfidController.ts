import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { RFIDService } from '../services/rfidService';
import { RFIDTag } from '../models/RFIDTag';
import { body, validationResult, query } from 'express-validator';

export class RFIDController {
  static validateCreateTag = [
    body('tagId').trim().notEmpty().withMessage('ID de l\'étiquette requis'),
    body('userId').isMongoId().withMessage('ID utilisateur invalide'),
    body('description').trim().notEmpty().withMessage('Description requise'),
    body('permissions').isArray().withMessage('Permissions doivent être un tableau')
  ];

  static validateAccess = [
    body('tagId').trim().notEmpty().withMessage('ID de l\'étiquette requis'),
    body('location').trim().notEmpty().withMessage('Localisation requise'),
    body('requiredPermission').trim().notEmpty().withMessage('Permission requise')
  ];

  static async createTag(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { tagId, userId, description, permissions } = req.body;
      const tag = await RFIDService.createTag({ tagId, userId, description, permissions });

      res.status(201).json({
        message: 'Étiquette RFID créée avec succès',
        tag: {
          id: tag._id,
          tagId: tag.tagId,
          userId: tag.userId,
          description: tag.description,
          permissions: tag.permissions,
          isActive: tag.isActive
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async validateAccess(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { tagId, location, requiredPermission } = req.body;
      const result = await RFIDService.validateAccess(tagId, location, requiredPermission);

      res.json({
        granted: result.granted,
        message: result.message,
        userId: result.userId,
        timestamp: new Date()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTags(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId, isActive } = req.query;
      const filter: any = {};
      
      if (userId) filter.userId = userId;
      if (isActive !== undefined) filter.isActive = isActive === 'true';

      const tags = await RFIDTag.find(filter).populate('userId', 'name email');
      res.json({ tags });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAccessLogs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { tagId, userId, location, startDate, endDate, limit } = req.query;
      
      const filters: any = {};
      if (tagId) filters.tagId = tagId as string;
      if (userId) filters.userId = userId as string;
      if (location) filters.location = location as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (limit) filters.limit = parseInt(limit as string);

      const logs = await RFIDService.getAccessLogs(filters);
      res.json({ logs });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deactivateTag(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const tag = await RFIDTag.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!tag) {
        res.status(404).json({ error: 'Étiquette non trouvée' });
        return;
      }

      res.json({ message: 'Étiquette désactivée', tag });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}