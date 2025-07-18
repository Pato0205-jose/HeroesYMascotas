import mongoose from 'mongoose';

const virtualPetActivitySchema = new mongoose.Schema({
  idMascota: Number,
  tipoActividad: String,
  fecha: String,
  detalles: mongoose.Schema.Types.Mixed
});

export default mongoose.model('VirtualPetActivity', virtualPetActivitySchema); 