import express, { Router, Request, Response } from 'express';
import { Scan } from '../models/scan.model';

export const scanRouter: Router = express.Router();

// 📝 POST - Enregistrer un nouveau scan
scanRouter.post('/', async (req: Request, res: Response) => {
  const { residentId, tag, zone } = req.body;

  // Validation des champs requis
  if (!residentId || !tag || !zone) {
    res.status(400).json({ 
      error: 'Champs requis : residentId, tag, zone',
      received: { residentId: !!residentId, tag: !!tag, zone: !!zone }
    });
    return;
  }

  try {
    const newScan = new Scan({ 
      residentId: residentId.trim(), 
      tag: tag.trim(), 
      zone: zone.trim(), 
      timestamp: new Date() 
    });
    
    const savedScan = await newScan.save();
    
    res.status(201).json({ 
      message: '✅ Scan enregistré avec succès', 
      scan: savedScan,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erreur enregistrement scan:', err);
    res.status(500).json({ 
      error: '❌ Erreur lors de l\'enregistrement du scan', 
      timestamp: new Date().toISOString()
    });
  }
});

// 📋 GET - Récupérer tous les scans (avec pagination)
scanRouter.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const scans = await Scan.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Scan.countDocuments();

    res.json({
      scans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Erreur récupération scans:', err);
    res.status(500).json({ 
      error: '❌ Erreur lors de la récupération des scans' 
    });
  }
});

// 🔍 GET - Récupérer les scans par residentId
scanRouter.get('/resident/:residentId', async (req: Request, res: Response) => {
  try {
    const { residentId } = req.params;
    const scans = await Scan.find({ residentId }).sort({ timestamp: -1 });
    
    res.json({ 
      residentId, 
      scans,
      count: scans.length 
    });
  } catch (err) {
    console.error('Erreur récupération scans résident:', err);
    res.status(500).json({ 
      error: '❌ Erreur lors de la récupération des scans du résident' 
    });
  }
});

// 🏢 GET - Récupérer les scans par zone
scanRouter.get('/zone/:zone', async (req: Request, res: Response) => {
  try {
    const { zone } = req.params;
    const scans = await Scan.find({ zone }).sort({ timestamp: -1 });
    
    res.json({ 
      zone, 
      scans,
      count: scans.length 
    });
  } catch (err) {
    console.error('Erreur récupération scans zone:', err);
    res.status(500).json({ 
      error: '❌ Erreur lors de la récupération des scans de la zone' 
    });
  }
});