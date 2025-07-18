import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import VirtualPetActivity from './models/virtualPetActivityModel.js';

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const data = JSON.parse(fs.readFileSync('./data/virtualPetsActivity.json', 'utf-8'));
  await VirtualPetActivity.deleteMany({}); // Limpia la colección antes de migrar
  await VirtualPetActivity.insertMany(data);
  console.log('Datos de virtualPetsActivity migrados a MongoDB');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Error en la migración:', err);
  process.exit(1);
}); 