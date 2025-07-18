import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import VirtualPet from './models/virtualPetModel.js';

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const data = JSON.parse(fs.readFileSync('./data/virtualPets.json', 'utf-8'));
  await VirtualPet.deleteMany({}); // Limpia la colección antes de migrar
  await VirtualPet.insertMany(data);
  console.log('Datos de virtualPets migrados a MongoDB');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Error en la migración:', err);
  process.exit(1);
}); 