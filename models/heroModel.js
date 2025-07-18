import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  id: Number,
  name: String,
  alias: String,
  powers: [String],
  username: { type: String, unique: true },
  password: String // hashed
});

export default mongoose.model('Hero', heroSchema);