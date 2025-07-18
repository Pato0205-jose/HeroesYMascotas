import mongoose from 'mongoose';

const virtualPetSchema = new mongoose.Schema({
  id: Number,
  name: String,
  ownerId: Number,
  felicidad: Number,
  salud: Number,
  satisfecha: Boolean,
  ropa: String,
  muerta: Boolean,
  enferma: Boolean
});

export default mongoose.model('VirtualPet', virtualPetSchema); 