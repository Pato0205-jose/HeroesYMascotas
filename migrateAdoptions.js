import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Adoption from './models/adoptionModel.js';

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const data = JSON.parse(fs.readFileSync('./data/adoptions.json', 'utf-8'));
  await Adoption.deleteMany({}); // Limpia la colección antes de migrar
  await Adoption.insertMany(data);
  console.log('Datos de adoptions migrados a MongoDB');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Error en la migración:', err);
  process.exit(1);
}); 