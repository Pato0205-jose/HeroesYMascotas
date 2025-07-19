import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  power: String,
  age: Number,
  adopted: Boolean,
  ownerId: Number
});

export default mongoose.model('Pet', petSchema);
