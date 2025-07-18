import Hero from '../models/heroModel.js';

export default async function (req, res, next) {
  let heroId = req.headers['x-hero-id'];
  if (!heroId) {
    // Permitir también Authorization: Bearer <id> (donde <id> es un número)
    const auth = req.headers['authorization'];
    if (auth && auth.startsWith('Bearer ')) {
      heroId = auth.replace('Bearer ', '').trim();
    }
  }
  // Validar que sea un número
  if (!heroId || isNaN(heroId)) {
    return res.status(401).json({ error: 'Se requiere un id de héroe numérico en x-hero-id o Authorization: Bearer <id>' });
  }
  // Buscar el héroe en MongoDB
  const hero = await Hero.findOne({ id: parseInt(heroId) });
  if (!hero) return res.status(401).json({ error: 'Héroe no encontrado' });
  req.hero = hero;
  next();
} 