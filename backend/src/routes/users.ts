import { Router } from 'express';
import { User } from '../models/User';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

router.use(authenticateToken);

// Obtenir profil utilisateur
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('rfidTags');
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Routes admin uniquement
router.get('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/deactivate', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');
    
    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }
    
    res.json({ message: 'Utilisateur désactivé', user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;