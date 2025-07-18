import express from 'express';
import virtualPetService from '../services/virtualPetService.js';

const router = express.Router();

/**
 * @swagger
 * /api/virtual/virtual-pets:
 *   get:
 *     tags: [MascotaVirtual]
 *     summary: Lista todas las mascotas virtuales
 *     responses:
 *       200:
 *         description: Lista de mascotas virtuales
 */
router.get('/virtual-pets', async (req, res) => {
  try {
    const pets = await virtualPetService.getAllVirtualPets();
    // Solo mostrar mascotas virtuales del usuario autenticado
    const myPets = pets.filter(p => Number(p.ownerId) === Number(req.hero.id));
    res.json(myPets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/virtual/virtual-pets:
 *   post:
 *     tags: [MascotaVirtual]
 *     summary: Crea una mascota virtual desde una mascota adoptada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mascota virtual creada
 *       400:
 *         description: Error de validación
 */
router.post('/virtual-pets', async (req, res) => {
  try {
    const { petId } = req.body;
    const pet = await virtualPetService.createVirtualPetFromAdopted(petId);
    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/virtual/virtual-pets/{id}/estado:
 *   get:
 *     tags: [MascotaVirtual]
 *     summary: Ver estado de una mascota virtual
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estado de la mascota virtual
 *       404:
 *         description: Mascota virtual no encontrada
 */
router.get('/virtual-pets/:id/estado', async (req, res) => {
  try {
    const pet = await virtualPetService.getVirtualPetById(req.params.id);
    if (!pet || !checkOwner(pet, req.hero.id)) return res.status(404).json({ error: 'Mascota virtual no encontrada' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/virtual/virtual-pets/{id}/actividad:
 *   post:
 *     tags: [MascotaVirtual]
 *     summary: Realizar actividad (jugar, pasear) con la mascota virtual
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
 *               activity:
 *                 type: string
 *                 example: jugar
 *     responses:
 *       200:
 *         description: Mascota virtual actualizada
 *       400:
 *         description: Error de validación
 */
router.post('/virtual-pets/:id/actividad', async (req, res) => {
  try {
    const pet = await virtualPetService.getVirtualPetById(req.params.id);
    if (!pet || !checkOwner(pet, req.hero.id)) return res.status(404).json({ error: 'Mascota virtual no encontrada' });
    const { activity } = req.body;
    const updatedPet = await virtualPetService.doActivity(req.params.id, activity);
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/virtual/virtual-pets/{id}/actividad:
 *   get:
 *     tags: [MascotaVirtual]
 *     summary: Obtener historial de actividad de la mascota virtual
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial de actividad
 *       404:
 *         description: Mascota virtual no encontrada
 */
router.get('/virtual-pets/:id/actividad', async (req, res) => {
  try {
    const pet = await virtualPetService.getVirtualPetById(req.params.id);
    if (!pet || !checkOwner(pet, req.hero.id)) return res.status(404).json({ error: 'Mascota virtual no encontrada' });
    const log = await virtualPetService.getActivityLog(req.params.id);
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/virtual/virtual-pets/{id}/comida:
 *   post:
 *     tags: [MascotaVirtual]
 *     summary: Alimentar mascota virtual
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
 *               comida:
 *                 type: string
 *                 example: pizza
 *     responses:
 *       200:
 *         description: Mascota virtual alimentada
 *       400:
 *         description: Error de validación
 */
router.post('/virtual-pets/:id/comida', async (req, res) => {
  try {
    const pet = await virtualPetService.getVirtualPetById(req.params.id);
    if (!pet || !checkOwner(pet, req.hero.id)) return res.status(404).json({ error: 'Mascota virtual no encontrada' });
    const { comida } = req.body;
    const updatedPet = await virtualPetService.feedPet(req.params.id, comida);
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/virtual/virtual-pets/{id}/ropa:
 *   post:
 *     tags: [MascotaVirtual]
 *     summary: Personalizar ropa de la mascota virtual
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
 *               ropa:
 *                 type: string
 *                 example: sombrero
 *     responses:
 *       200:
 *         description: Mascota virtual actualizada
 *       400:
 *         description: Error de validación
 */
router.post('/virtual-pets/:id/ropa', async (req, res) => {
  try {
    const pet = await virtualPetService.getVirtualPetById(req.params.id);
    if (!pet || !checkOwner(pet, req.hero.id)) return res.status(404).json({ error: 'Mascota virtual no encontrada' });
    const { ropa } = req.body;
    const updatedPet = await virtualPetService.dressPet(req.params.id, ropa);
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/virtual/virtual-pets/{id}/curar:
 *   post:
 *     tags: [MascotaVirtual]
 *     summary: Curar mascota virtual
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mascota virtual curada
 *       400:
 *         description: Error de validación
 */
router.post('/virtual-pets/:id/curar', async (req, res) => {
  try {
    const pet = await virtualPetService.getVirtualPetById(req.params.id);
    if (!pet || !checkOwner(pet, req.hero.id)) return res.status(404).json({ error: 'Mascota virtual no encontrada' });
    const updatedPet = await virtualPetService.curePet(req.params.id);
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/virtual/virtual-pets/{id}/muerta:
 *   get:
 *     tags: [MascotaVirtual]
 *     summary: Ver si la mascota virtual está muerta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estado de muerte de la mascota virtual
 *       400:
 *         description: Error de validación
 */
router.get('/virtual-pets/:id/muerta', async (req, res) => {
  try {
    const pet = await virtualPetService.getVirtualPetById(req.params.id);
    if (!pet || !checkOwner(pet, req.hero.id)) return res.status(404).json({ error: 'Mascota virtual no encontrada' });
    const muerta = await virtualPetService.checkDead(req.params.id);
    res.json({ muerta });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/virtual/virtual-pets/{id}/revivir:
 *   post:
 *     tags: [MascotaVirtual]
 *     summary: Revivir una mascota virtual muerta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mascota virtual revivida
 *       400:
 *         description: Error de validación
 */
router.post('/virtual-pets/:id/revivir', async (req, res) => {
  try {
    const pet = await virtualPetService.getVirtualPetById(req.params.id);
    if (!pet || !checkOwner(pet, req.hero.id)) return res.status(404).json({ error: 'Mascota virtual no encontrada' });
    const updatedPet = await virtualPetService.revivePet(req.params.id);
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

// Helper function to check if a pet belongs to the authenticated user
function checkOwner(pet, heroId) {
  if (!pet) return false;
  return Number(pet.ownerId) === Number(heroId);
} 