import Pet from '../models/petModel.js';

async function getPets() {
  try {
    return await Pet.find();
  } catch (error) {
    console.error('Error getting pets:', error);
    return [];
  }
}

async function savePets(pets) {
  try {
    if (Array.isArray(pets)) {
      await Pet.insertMany(pets);
    } else {
      await pets.save();
    }
  } catch (error) {
    console.error('Error saving pets:', error);
    throw error;
  }
}

async function updatePet(id, updateData) {
  try {
    return await Pet.findOneAndUpdate({ id: id }, updateData, { new: true });
  } catch (error) {
    console.error('Error updating pet:', error);
    throw error;
  }
}

async function findPetById(id) {
  try {
    return await Pet.findOne({ id: id });
  } catch (error) {
    console.error('Error finding pet:', error);
    return null;
  }
}

export default {
  getPets,
  savePets,
  updatePet,
  findPetById
};
