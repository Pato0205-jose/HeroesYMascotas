import express from 'express';

// Controladores
import heroController from './controllers/heroController.js';
import petController from './controllers/petController.js';
import adoptionController from './controllers/adoptionController.js';
import virtualPetController from './controllers/virtualPetController.js';
import swaggerRouter from './swagger.js';
import authMiddleware from './middleware/auth.js';
import authController from './controllers/authController.js';

import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

const app = express();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/auth', authController); // Sin authMiddleware aquí
app.use('/api/pets', authMiddleware, petController);
app.use('/api', authMiddleware, adoptionController); // proteger adopciones
app.use('/api/virtual', authMiddleware, virtualPetController); // proteger mascotas virtuales
app.use('/api-docs', swaggerRouter); // Swagger UI

// Servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
