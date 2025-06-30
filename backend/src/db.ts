import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ehpad_rfid';

export const connectDB = async (): Promise<void> => {
  try {
    console.log('🔄 Connexion à MongoDB...');
    
    // Connexion simple à MongoDB Atlas
    await mongoose.connect(MONGO_URI);
    
    console.log('✅ MongoDB connecté avec succès !');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error);
    
    // Suggestions d'aide
    if (error instanceof Error) {
      console.log('💡 Vérifiez :');
      console.log('   - Votre URI MongoDB dans .env');
      console.log('   - Les whitelist IP dans MongoDB Atlas');
      console.log('   - Vos identifiants de connexion');
    }
    
    // En développement, ne pas arrêter le processus
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  Serveur démarré en mode développement sans DB');
    } else {
      process.exit(1);
    }
  }
};

// Gestion des événements de connexion
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connecté à MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur de connexion MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose déconnecté');
});