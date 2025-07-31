import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// Para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controladores
import heroController from './controllers/heroController.js';
import petController from './controllers/petController.js';
import adoptionController from './controllers/adoptionController.js';
import virtualPetController from './controllers/virtualPetController.js';
import swaggerRouter from './swagger.js';
import authMiddleware from './middleware/auth.js';
import authController from './controllers/authController.js';


console.log('MONGODB_URI:', process.env.MONGODB_URI); // <-- Log para depuración

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

const app = express();
app.use(cors());

// Servir archivos estáticos (incluyendo game-offline.html)
app.use(express.static(__dirname));

// Ruta para el juego principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'game-offline.html'));
});

// Ruta para acceso directo al juego
app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'game-offline.html'));
});

// Middleware
app.use(express.json());

// Rutas
app.use('/api/auth', authController); // Sin authMiddleware aquí
app.use('/api/heroes', heroController); // Sin authMiddleware para crear héroes
app.use('/api/pets', authMiddleware, petController);
app.use('/api', authMiddleware, adoptionController); // proteger adopciones
app.use('/api/virtual', authMiddleware, virtualPetController); // proteger mascotas virtuales
app.use('/api-docs', swaggerRouter); // Swagger UI

// Endpoint para reiniciar el juego
app.post('/api/reset', async (req, res) => {
  try {
    const mongoose = await import('mongoose');
    const collections = await mongoose.default.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      await mongoose.default.connection.db.collection(collection.name).deleteMany({});
    }
    
    res.json({ message: 'Juego reiniciado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint de prueba para verificar configuración
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    jwtSecret: process.env.JWT_SECRET ? 'Configurado' : 'No configurado',
    mongodbUri: process.env.MONGODB_URI ? 'Configurado' : 'No configurado'
  });
});

// Servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
