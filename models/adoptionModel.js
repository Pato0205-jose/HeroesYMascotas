import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
  id: Number,
  petId: Number,
  heroId: Number,
  date: String
});

export default mongoose.model('Adoption', adoptionSchema);
