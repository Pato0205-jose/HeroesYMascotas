import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Hero from './models/heroModel.js';

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const data = JSON.parse(fs.readFileSync('./data/superheroes.json', 'utf-8'));
  await Hero.deleteMany({}); // Limpia la colección antes de migrar
  await Hero.insertMany(data);
  console.log('Datos de heroes migrados a MongoDB');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Error en la migración:', err);
  process.exit(1);
}); 