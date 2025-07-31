import Hero from '../models/heroModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
  
  const token = jwt.sign(
    { id: hero.id, username: hero.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return { token, hero: { id: hero.id, username: hero.username, name: hero.name, alias: hero.alias } };
}

async function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token no proporcionado');
  }
  
  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  const hero = await Hero.findOne({ id: decoded.id });
  if (!hero) {
    throw new Error('Usuario no encontrado');
  }
  
  return { id: hero.id, username: hero.username, name: hero.name, alias: hero.alias };
}

export default {
  register,
  login,
  verifyToken
}; 