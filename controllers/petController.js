import express from 'express';
import { check, validationResult } from 'express-validator';
import Pet from '../models/petModel.js';
import petService from '../services/petServices.js';

const router = express.Router();

/**
 * @swagger
 * /api/pets:
 *   get:
 *     tags: [Mascotas]
 *     summary: Obtiene todas las mascotas
 *     responses:
 *       200:
 *         description: Lista de mascotas
 */
router.get('/', async (req, res) => {
  try {
    const allPets = await petService.getAllPets();
    // Filtrar solo mascotas del usuario autenticado
    const pets = allPets.filter(p => Number(p.ownerId) === Number(req.hero.id));
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pets:
 *   post:
 *     tags: [Mascotas]
 *     summary: Agrega una mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               power:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mascota agregada
 *       400:
 *         description: Error de validación
 */
router.post(
  '/',
  [
    check('name').notEmpty().withMessage('El nombre es requerido'),
    check('type').notEmpty().withMessage('El tipo es requerido'),
    check('power').notEmpty().withMessage('El poder es requerido')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, type, power } = req.body;
    const newPet = { name, type, power };

    try {
      const addedPet = await petService.addPet(newPet, req.hero.id);
      res.status(201).json(addedPet);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     tags: [Mascotas]
 *     summary: Actualiza una mascota
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
 *               type:
 *                 type: string
 *               power:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *       404:
 *         description: Mascota no encontrada
 */
router.put('/pets/:id', async (req, res) => {
  try {
    const pet = await petService.getAllPets().then(pets => pets.find(p => p.id === parseInt(req.params.id)));
    if (!pet || Number(pet.ownerId) !== Number(req.hero.id)) return res.status(404).json({ error: 'Mascota no encontrada' });
    const updatedPet = await petService.updatePet(req.params.id, req.body);
    res.json(updatedPet);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     tags: [Mascotas]
 *     summary: Elimina una mascota
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mascota eliminada
 *       404:
 *         description: Mascota no encontrada
 */
router.delete('/pets/:id', async (req, res) => {
  try {
    const pet = await petService.getAllPets().then(pets => pets.find(p => p.id === parseInt(req.params.id)));
    if (!pet || Number(pet.ownerId) !== Number(req.hero.id)) return res.status(404).json({ error: 'Mascota no encontrada' });
    const result = await petService.deletePet(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
