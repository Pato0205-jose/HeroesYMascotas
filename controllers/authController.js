import express from 'express';
import authService from '../services/authService.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión como superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Error de validación
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un nuevo superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               alias:
 *                 type: string
 *               powers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Usuario registrado
 *       400:
 *         description: Error de validación
 */
router.post('/register', async (req, res) => {
  try {
    const hero = await authService.register(req.body);
    res.json({ id: hero.id, username: hero.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { token, hero } = await authService.login(req.body);
    res.json({ token, hero });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     tags: [Auth]
 *     summary: Verificar token JWT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hero:
 *                   type: object
 *       401:
 *         description: Token inválido
 */
router.get('/verify', async (req, res) => {
  try {
    const hero = await authService.verifyToken(req.headers.authorization);
    res.json({ hero });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

export default router; 