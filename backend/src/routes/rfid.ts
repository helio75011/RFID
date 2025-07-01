import { Router } from 'express';
import { RFIDController } from '../controllers/rfidController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Routes publiques pour les lecteurs RFID
router.post('/validate', RFIDController.validateAccess, RFIDController.validateAccess);

// Routes protégées
router.use(authenticateToken);

router.get('/tags', RFIDController.getTags);
router.get('/logs', RFIDController.getAccessLogs);

// Routes admin uniquement
router.post('/tags', requireAdmin, RFIDController.validateCreateTag, RFIDController.createTag);
router.put('/tags/:id/deactivate', requireAdmin, RFIDController.deactivateTag);

export default router;