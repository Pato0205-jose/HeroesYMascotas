import petRepository from '../repositories/petRepository.js';

async function getAllPets() {
  return await petRepository.getPets();
}

async function addPet(pet, ownerId) {
  const pets = await petRepository.getPets();
  const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
  const newPet = { ...pet, id: newId, ownerId: Number(ownerId) };

  await petRepository.savePets(newPet);
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
