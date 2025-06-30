import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { scanRouter } from './routes/scan';

// 🔧 Chargement des variables d'environnement
dotenv.config();

// 🔌 Connexion à MongoDB
connectDB();

// ⚙️ Initialisation de l'app Express
const app = express();
const PORT = process.env.PORT || 3000;

// 🧩 Middlewares
app.use(cors());
app.use(express.json());

// 📦 Routes
app.use('/scan', scanRouter);

// 🚀 Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
});
