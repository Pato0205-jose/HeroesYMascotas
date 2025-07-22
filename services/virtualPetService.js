import virtualPetRepository from '../repositories/virtualPetRepository.js';
import VirtualPet from '../models/virtualPetModel.js';
import fs from 'fs-extra';
const activityFilePath = './data/virtualPetsActivity.json';

async function getAllVirtualPets() {
  return await virtualPetRepository.getVirtualPets();
}

async function getVirtualPetById(id) {
  return await virtualPetRepository.findVirtualPetById(parseInt(id));
}

async function updateVirtualPet(id, updatedFields) {
  return await virtualPetRepository.updateVirtualPet(parseInt(id), updatedFields);
}

async function doActivity(id, activity) {
  const pet = await getVirtualPetById(id);
  if (!pet) throw new Error('Mascota virtual no encontrada');
  if (pet.muerta) throw new Error('La mascota está muerta');
  if (pet.felicidad >= 100) throw new Error('La mascota ya está completamente feliz');
  let felicidad = pet.felicidad;
  let salud = pet.salud;
  let satisfecha = pet.satisfecha;
  if (activity === 'jugar' || activity === 'pasear') {
    felicidad += 10;
    if (felicidad > 100) {
      felicidad = 100;
      satisfecha = true;
      salud -= 10; // sobreestimulación
      await logActivity(id, activity, { resultado: 'sobreestimulación' });
    } else {
      await logActivity(id, activity, { resultado: 'actividad realizada' });
    }
  }
  if (felicidad <= 0) {
    felicidad = 0;
    pet.muerta = true;
    await logActivity(id, activity, { resultado: 'muerta por infelicidad' });
  }
  return await updateVirtualPet(id, { felicidad, salud, satisfecha, muerta: pet.muerta });
}

async function feedPet(id, comida = null) {
  const pet = await getVirtualPetById(id);
  if (!pet) throw new Error('Mascota virtual no encontrada');
  if (pet.muerta) throw new Error('La mascota está muerta');
  let salud = pet.salud;
  let satisfecha = pet.satisfecha;
  let enferma = pet.enferma;
  let muerta = pet.muerta;
  if (pet.satisfecha) {
    enferma = true;
    salud -= 20; // Daño fatal al sobrealimentar
    if (salud <= 0) {
      salud = 0;
      muerta = true;
      await logActivity(id, 'alimentar', { resultado: 'murió por sobrealimentación', comida });
    } else {
      await logActivity(id, 'alimentar', { resultado: 'enferma por sobrealimentación', comida });
    }
    return await updateVirtualPet(id, { salud, enferma, muerta });
  }
  satisfecha = true;
  salud += 10;
  if (salud > 100) {
    salud = 80;
    enferma = true;
    await logActivity(id, 'alimentar', { resultado: 'enferma por sobrealimentación', comida });
  } else {
    await logActivity(id, 'alimentar', { resultado: 'alimentada', comida });
  }
  return await updateVirtualPet(id, { salud, satisfecha, enferma });
}

async function dressPet(id, ropa) {
  const pet = await getVirtualPetById(id);
  if (!pet) throw new Error('Mascota virtual no encontrada');
  if (pet.muerta) throw new Error('La mascota está muerta');
  await logActivity(id, 'vestir', { ropa });
  return await updateVirtualPet(id, { ropa });
}

async function curePet(id) {
  const pet = await getVirtualPetById(id);
  if (!pet) throw new Error('Mascota virtual no encontrada');
  if (pet.muerta) throw new Error('La mascota está muerta');
  let salud = pet.salud;
  salud = 100;
  await logActivity(id, 'curar', {});
  return await updateVirtualPet(id, { salud });
}

async function checkDead(id) {
  const pet = await getVirtualPetById(id);
  if (!pet) throw new Error('Mascota virtual no encontrada');
  return pet.muerta;
}

async function createVirtualPetFromAdopted(petId) {
  const pets = await virtualPetRepository.getVirtualPets();
  const existingVirtualPet = pets.find(p => p.id === parseInt(petId));
  if (existingVirtualPet) {
    throw new Error('Esta mascota ya existe como mascota virtual');
  }
  
  // Importar el servicio de mascotas para verificar si está adoptada
  const petService = await import('./petServices.js');
  const allPets = await petService.default.getAllPets();
  const adoptedPet = allPets.find(p => p.id === parseInt(petId));
  
  if (!adoptedPet) {
    throw new Error('Mascota no encontrada');
  }
  
  if (!adoptedPet.ownerId || adoptedPet.ownerId === null || adoptedPet.ownerId === undefined) {
    throw new Error('La mascota debe estar adoptada para crear una mascota virtual');
  }
  
  const newVirtualPet = new VirtualPet({
    id: adoptedPet.id,
    name: adoptedPet.name,
    ownerId: adoptedPet.ownerId,
    felicidad: 50,  // Permite hacer actividad (no está al máximo)
    salud: 1,       // Se muere con una sola alimentación
    satisfecha: false, // Permite alimentar una vez
    ropa: null,
    muerta: false,
    enferma: false
  });
  
  await newVirtualPet.save();
  return newVirtualPet;
}

async function revivePet(id) {
  const pet = await getVirtualPetById(id);
  if (!pet) throw new Error('Mascota virtual no encontrada');
  if (!pet.muerta) throw new Error('La mascota no está muerta');
  const salud = 50;
  const muerta = false;
  const enferma = true;
  const satisfecha = false;
  await logActivity(id, 'revivir', { resultado: 'resucitada' });
  return await updateVirtualPet(id, { salud, muerta, enferma, satisfecha });
}

async function logActivity(id, tipoActividad, detalles = {}) {
  const log = await fs.readJson(activityFilePath).catch(() => []);
  log.push({ idMascota: id, tipoActividad, fecha: new Date().toISOString(), detalles });
  await fs.writeJson(activityFilePath, log);
}

async function getActivityLog(id) {
  const log = await fs.readJson(activityFilePath).catch(() => []);
  return log.filter(entry => entry.idMascota == id);
}

export default {
  getAllVirtualPets,
  getVirtualPetById,
  updateVirtualPet,
  doActivity,
  feedPet,
  dressPet,
  curePet,
  checkDead,
  createVirtualPetFromAdopted,
  getActivityLog,
  revivePet
}; 