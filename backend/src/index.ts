import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { scanRouter } from './routes/scan';

// Configuration des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à la base de données
connectDB();

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/scan', scanRouter); // Préfixe /api pour une meilleure organisation

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API RFID EHPAD - Serveur opérationnel !',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Route de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de gestion d'erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    timestamp: new Date().toISOString()
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Scan: http://localhost:${PORT}/api/scan`);
});