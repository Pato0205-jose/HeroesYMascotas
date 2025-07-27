import petRepository from '../repositories/petRepository.js';
import Pet from '../models/petModel.js';

async function getAllPets() {
  return await petRepository.getPets();
}

async function addPet(pet, ownerId) {
  const pets = await petRepository.getPets();
  
  // Generar un nuevo ID de manera más robusta
  let newId = 1;
  if (pets.length > 0) {
    const maxId = Math.max(...pets.map(p => p.id || 0));
    newId = maxId + 1;
  }
  
  // Crear un nuevo documento de Mongoose SIN ownerId inicialmente
  const newPet = new Pet({
    id: newId,
    name: pet.name,
    type: pet.type,
    power: pet.power,
    age: 0, // Edad por defecto
    adopted: false,
    ownerId: null  // Sin dueño inicialmente
  });

  await newPet.save();
  return newPet;
}

async function updatePet(id, updatedPet) {
  try {
    // Buscar la mascota por ID
    const pet = await Pet.findOne({ id: parseInt(id) });
    if (!pet) throw new Error('Mascota no encontrada');

    // Actualizar los campos
    Object.assign(pet, updatedPet);
    
    // Guardar los cambios
    await pet.save();
    return pet;
  } catch (error) {
    console.error('Error updating pet:', error);
    throw new Error('Error al actualizar la mascota');
  }
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
