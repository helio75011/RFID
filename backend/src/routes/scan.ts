import { Router, Request, Response } from 'express';
import { Scan, IScan } from '../models/Scan';

export const scanRouter = Router();

/**
 * @route   POST /scan
 * @desc    Enregistre un nouveau scan RFID
 * @body    { residentId: string, tag: string, zone: string }
 */
scanRouter.post('/', async (req: Request, res: Response) => {
  const { residentId, tag, zone } = req.body;

  // 🛑 Vérification des champs
  if (!residentId || !tag || !zone) {
    return res.status(400).json({ error: 'Champs requis : residentId, tag, zone' });
  }

  try {
    const newScan: IScan = new Scan({
      residentId,
      tag,
      zone,
      timestamp: new Date() // facultatif car géré par défaut
    });

    await newScan.save();
    return res.status(201).json({ message: '✅ Scan enregistré', scan: newScan });
  } catch (err) {
    console.error('Erreur enregistrement scan:', err);
    return res.status(500).json({ error: '❌ Erreur interne serveur', details: err });
  }
});
