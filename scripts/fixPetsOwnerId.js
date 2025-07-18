import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pet from '../models/petModel.js';
import fs from 'fs';

dotenv.config();

// Leer los datos de pets.json para obtener los ownerId correctos
const petsData = JSON.parse(fs.readFileSync('./data/pets.json', 'utf-8'));

async function fixOwnerIds() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  for (const petJson of petsData) {
    if (petJson.ownerId !== undefined && petJson.ownerId !== null) {
      const pet = await Pet.findOne({ id: petJson.id });
      if (pet) {
        pet.ownerId = petJson.ownerId;
        await pet.save();
        console.log(`Mascota ${pet.name} (id ${pet.id}) ahora pertenece al héroe ${pet.ownerId}`);
      } else {
        console.log(`Mascota con id ${petJson.id} no encontrada en MongoDB`);
      }
    }
  }
  await mongoose.disconnect();
  console.log('Actualización completada.');
}

fixOwnerIds().catch(err => {
  console.error('Error actualizando mascotas:', err);
  process.exit(1);
}); 