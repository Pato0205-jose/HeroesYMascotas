import Hero from '../models/heroModel.js';
import bcrypt from 'bcryptjs';

async function register({ username, password, name, alias, powers }) {
  const existing = await Hero.findOne({ username });
  if (existing) throw new Error('El usuario ya existe');
  const hash = await bcrypt.hash(password, 10);

  // Generar un id incremental igual que en los héroes normales
  const heroes = await Hero.find();
  let newId = 1;
  if (heroes.length > 0) {
    const maxId = Math.max(...heroes.map(h => h.id || 0));
    newId = maxId + 1;
  }

  const hero = new Hero({ id: newId, username, password: hash, name, alias, powers });
  await hero.save();
  return hero;
}

async function login({ username, password }) {
  const hero = await Hero.findOne({ username });
  if (!hero) throw new Error('Usuario o contraseña incorrectos');
  const valid = await bcrypt.compare(password, hero.password);
  if (!valid) throw new Error('Usuario o contraseña incorrectos');
  
  // Usar hero.id si existe, sino usar hero._id como fallback
  const token = hero.id ? hero.id.toString() : hero._id.toString();
  return { token };
}

export default {
  register,
  login
}; 