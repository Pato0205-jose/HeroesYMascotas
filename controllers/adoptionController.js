import express from 'express';
import adoptionService from '../services/adoptionService.js';

const router = express.Router();

/**
 * @swagger
 * /api/adopt/{petId}:
 *   post:
 *     tags: [Adopciones]
 *     summary: Un héroe adopta una mascota (requiere autenticación)
 *     parameters:
 *       - in: header
 *         name: x-hero-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del héroe autenticado
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mensaje de éxito
 *       400:
 *         description: Error de validación
 */
// POST: un héroe adopta a una mascota (usando el héroe autenticado)
router.post('/adopt/:petId', async (req, res) => {
  try {
    // Validar que la mascota no tenga dueño y que el id sea válido
    const pets = await import('../services/petServices.js').then(m => m.default.getAllPets());
    const pet = (await pets).find(p => p.id === parseInt(req.params.petId));
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
    if (pet.ownerId && Number(pet.ownerId) !== Number(req.hero.id)) {
      return res.status(403).json({ error: 'No tienes permiso para adoptar o modificar la mascota de otro héroe.' });
    }
    const heroId = req.hero.id;
    const result = await adoptionService.assignOwner(req.params.petId, heroId);
    res.json({ message: result });
  } catch (err) {
    if (err.message.includes('no encontrada') || err.message.includes('no encontrado')) {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes('ya tiene un dueño')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// POST: un héroe adopta a una mascota (con petId en el body)
router.post('/adopt', async (req, res) => {
  try {
    console.log('Adopt request body:', req.body);
    console.log('Hero from middleware:', req.hero);
    
    const { petId } = req.body;
    if (!petId) {
      return res.status(400).json({ error: 'ID de mascota requerido' });
    }
    
    // Validar que la mascota no tenga dueño y que el id sea válido
    const pets = await import('../services/petServices.js').then(m => m.default.getAllPets());
    const pet = (await pets).find(p => p.id === parseInt(petId));
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
    if (pet.adopted) {
      return res.status(400).json({ error: 'La mascota ya está adoptada' });
    }
    
    const heroId = req.hero.id;
    console.log('Attempting to adopt pet', petId, 'by hero', heroId);
    const result = await adoptionService.assignOwner(petId, heroId);
    res.json({ message: result });
  } catch (err) {
    console.error('Adoption error:', err);
    if (err.message.includes('no encontrada') || err.message.includes('no encontrado')) {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes('ya tiene un dueño')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     tags: [Adopciones]
 *     summary: Obtiene todas las adopciones del héroe autenticado
 *     parameters:
 *       - in: header
 *         name: x-hero-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del héroe autenticado
 *     responses:
 *       200:
 *         description: Lista de adopciones del héroe
 *       401:
 *         description: No autorizado
 */
// GET: ver todas las adopciones del héroe autenticado
router.get('/adoptions', async (req, res) => {
  try {
    const adoptions = await adoptionService.getAdoptions(req.hero.id);
    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: ver todas las adopciones del héroe autenticado (alias)
router.get('/my-adoptions', async (req, res) => {
  try {
    const adoptions = await adoptionService.getAdoptions(req.hero.id);
    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/adoptions/{petId}:
 *   get:
 *     tags: [Adopciones]
 *     summary: Obtiene una mascota por su ID
 *     parameters:
 *       - in: header
 *         name: x-hero-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del héroe autenticado
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *       403:
 *         description: No tienes permiso para ver esta mascota
 *       404:
 *         description: Mascota no encontrada
 */
// GET: ver una mascota adoptada por id, solo si pertenece al héroe autenticado
router.get('/adoptions/:petId', async (req, res) => {
  try {
    const pets = await import('../services/petServices.js').then(m => m.default.getAllPets());
    const pet = (await pets).find(p => p.id === parseInt(req.params.petId));
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
    if (Number(pet.ownerId) !== Number(req.hero.id)) {
      return res.status(403).json({ error: 'No tienes permiso para ver la mascota de otro héroe.' });
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
