import VirtualPet from '../models/virtualPetModel.js';

async function getVirtualPets() {
  try {
    return await VirtualPet.find();
  } catch (error) {
    console.error('Error getting virtual pets:', error);
    return [];
  }
}

async function saveVirtualPets(pets) {
  try {
    // Si es un array, usar insertMany, si es un objeto, usar save
    if (Array.isArray(pets)) {
      await VirtualPet.insertMany(pets);
    } else {
      await pets.save();
    }
  } catch (error) {
    console.error('Error saving virtual pets:', error);
    throw error;
  }
}

async function updateVirtualPet(id, updateData) {
  try {
    return await VirtualPet.findOneAndUpdate({ id: id }, updateData, { new: true });
  } catch (error) {
    console.error('Error updating virtual pet:', error);
    throw error;
  }
}

async function findVirtualPetById(id) {
  try {
    return await VirtualPet.findOne({ id: id });
  } catch (error) {
    console.error('Error finding virtual pet:', error);
    return null;
  }
}

export default {
  getVirtualPets,
  saveVirtualPets,
  updateVirtualPet,
  findVirtualPetById
}; 