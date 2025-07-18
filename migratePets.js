import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Pet from './models/petModel.js';

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const data = JSON.parse(fs.readFileSync('./data/pets.json', 'utf-8'));
  await Pet.deleteMany({}); // Limpia la colección antes de migrar
  await Pet.insertMany(data);
  console.log('Datos de pets migrados a MongoDB');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Error en la migración:', err);
  process.exit(1);
}); 