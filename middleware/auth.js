import jwt from 'jsonwebtoken';
import Hero from '../models/heroModel.js';

export default async function (req, res, next) {
  try {
    console.log('Auth middleware - headers:', req.headers);
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth middleware - no authorization header');
      return res.status(401).json({ error: 'Token de autorización requerido' });
    }
    
    const token = authHeader.substring(7);
    console.log('Auth middleware - token:', token.substring(0, 20) + '...');
    
    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - decoded token:', decoded);
    
    // Buscar el héroe en MongoDB usando el ID del token
    const hero = await Hero.findOne({ id: decoded.id });
    if (!hero) {
      console.log('Auth middleware - hero not found for id:', decoded.id);
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    console.log('Auth middleware - hero found:', hero.id, hero.username);
    req.hero = hero;
    next();
  } catch (error) {
    console.error('Auth middleware - error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    } else {
      return res.status(500).json({ error: 'Error de autenticación' });
    }
  }
} 