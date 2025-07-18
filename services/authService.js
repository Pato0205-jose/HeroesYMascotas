import Hero from '../models/heroModel.js';
import bcrypt from 'bcryptjs';

async function register({ username, password, name, alias, powers }) {
  const existing = await Hero.findOne({ username });
  if (existing) throw new Error('El usuario ya existe');
  const hash = await bcrypt.hash(password, 10);
  const hero = new Hero({ username, password: hash, name, alias, powers });
  await hero.save();
  return hero;
}

async function login({ username, password }) {
  const hero = await Hero.findOne({ username });
  if (!hero) throw new Error('Usuario o contraseña incorrectos');
  const valid = await bcrypt.compare(password, hero.password);
  if (!valid) throw new Error('Usuario o contraseña incorrectos');
  // Devolver el id como token simple
  return { token: hero.id.toString() };
}

export default { register, login }; 