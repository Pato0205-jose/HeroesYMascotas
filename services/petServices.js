import petRepository from '../repositories/petRepository.js';
import Pet from '../models/petModel.js';

async function getAllPets() {
  return await petRepository.getPets();
}

async function addPet(pet, ownerId) {
  const pets = await petRepository.getPets();
  const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
  
  // Crear un nuevo documento de Mongoose
  const newPet = new Pet({
    id: newId,
    name: pet.name,
    type: pet.type,
    power: pet.power,
    age: pet.age || 0,
    adopted: false,
    ownerId: Number(ownerId)
  });

  await newPet.save();
  return newPet;
}

async function updatePet(id, updatedPet) {
  const pet = await petRepository.findPetById(parseInt(id));
  if (!pet) throw new Error('Mascota no encontrada');

  delete updatedPet.id;
  return await petRepository.updatePet(parseInt(id), updatedPet);
}

async function deletePet(id) {
  const pet = await petRepository.findPetById(parseInt(id));
  if (!pet) throw new Error('Mascota no encontrada');
  
  // Solo bloquear si ownerId existe y es válido
  if (pet.ownerId && pet.ownerId !== null && pet.ownerId !== undefined && pet.ownerId !== '') {
    throw new Error('No se puede eliminar una mascota que ya ha sido adoptada');
  }
  
  await pet.deleteOne();
  return { message: 'Mascota eliminada' };
}

export default {
  getAllPets,
  addPet,
  updatePet,
  deletePet
};
