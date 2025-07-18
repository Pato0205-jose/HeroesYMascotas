import Adoption from '../models/adoptionModel.js';

async function getAdoptions() {
  try {
    return await Adoption.find();
  } catch (error) {
    console.error('Error getting adoptions:', error);
    return [];
  }
}

async function saveAdoptions(adoptions) {
  try {
    if (Array.isArray(adoptions)) {
      await Adoption.insertMany(adoptions);
    } else {
      await adoptions.save();
    }
  } catch (error) {
    console.error('Error saving adoptions:', error);
    throw error;
  }
}

async function updateAdoption(id, updateData) {
  try {
    return await Adoption.findOneAndUpdate({ id: id }, updateData, { new: true });
  } catch (error) {
    console.error('Error updating adoption:', error);
    throw error;
  }
}

async function findAdoptionById(id) {
  try {
    return await Adoption.findOne({ id: id });
  } catch (error) {
    console.error('Error finding adoption:', error);
    return null;
  }
}

export default {
  getAdoptions,
  saveAdoptions,
  updateAdoption,
  findAdoptionById
};
