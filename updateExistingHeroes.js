import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Hero from './models/heroModel.js';

dotenv.config();

async function updateHeroes() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const heroes = await Hero.find({ $or: [ { username: { $exists: false } }, { username: null } ] });
  for (const hero of heroes) {
    hero.username = hero.alias || `hero${hero.id}`;
    hero.password = await bcrypt.hash('1234', 10);
    await hero.save();
    console.log(`Actualizado: ${hero.name} (${hero.username})`);
  }
  await mongoose.disconnect();
  console.log('Actualización completada. Todos los héroes tienen username y password.');
}

updateHeroes().catch(err => {
  console.error('Error actualizando héroes:', err);
  process.exit(1);
}); 