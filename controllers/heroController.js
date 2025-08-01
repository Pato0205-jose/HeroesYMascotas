import express from "express";
import { check, validationResult } from 'express-validator';
import heroService from "../services/heroServices.js";
import Hero from "../models/heroModel.js";
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/heroes:
 *   get:
 *     tags: [Héroes]
 *     summary: Obtiene todos los héroes
 *     responses:
 *       200:
 *         description: Lista de héroes
 */
// GET - Obtener todos los héroes (sin autenticación)
router.get('/', async (req, res) => {
  try {
    const heroes = await heroService.getAllHeroes();
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/heroes:
 *   post:
 *     tags: [Héroes]
 *     summary: Agrega un héroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               alias:
 *                 type: string
 *               city:
 *                 type: string
 *               team:
 *                 type: string
 *     responses:
 *       201:
 *         description: Héroe agregado
 *       400:
 *         description: Error de validación
 */
// POST - Agregar un héroe (sin autenticación)
router.post(
  '/',
  [
    check('name').notEmpty().withMessage('El nombre es requerido'),
    check('alias').notEmpty().withMessage('El alias es requerido')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const addedHero = await heroService.addHero(req.body);
      res.status(201).json(addedHero);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @swagger
 * /api/heroes/{id}:
 *   put:
 *     tags: [Héroes]
 *     summary: Actualiza un héroe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               alias:
 *                 type: string
 *               city:
 *                 type: string
 *               team:
 *                 type: string
 *     responses:
 *       200:
 *         description: Héroe actualizado
 *       404:
 *         description: Héroe no encontrado
 */
// PUT - Actualizar héroe (con autenticación)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedHero = await heroService.updateHero(req.params.id, req.body);
    res.json(updatedHero);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/heroes/{id}:
 *   delete:
 *     tags: [Héroes]
 *     summary: Elimina un héroe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Héroe eliminado
 *       404:
 *         description: Héroe no encontrado
 */
// DELETE - Eliminar héroe (con autenticación)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await heroService.deleteHero(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/heroes/sample-data:
 *   post:
 *     tags: [Héroes]
 *     summary: Crear datos de ejemplo
 *     responses:
 *       200:
 *         description: Datos de ejemplo creados
 */
// POST - Crear datos de ejemplo
router.post('/sample-data', async (req, res) => {
  try {
    await heroService.createSampleData();
    res.json({ message: 'Datos de ejemplo creados exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
