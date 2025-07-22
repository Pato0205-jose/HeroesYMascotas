import petService from './petServices.js';
import heroService from './heroServices.js';
import adoptionRepository from '../repositories/adoptionRepository.js';
import Adoption from '../models/adoptionModel.js';

async function assignOwner(petId, heroId) {
  const pets = await petService.getAllPets();
  const pet = pets.find(p => p.id === parseInt(petId));
  if (!pet) throw new Error('Mascota no encontrada');

  const heroes = await heroService.getAllHeroes();
  const hero = heroes.find(h => h.id === parseInt(heroId));
  if (!hero) throw new Error('Héroe no encontrado');

  // Validar que la mascota no tenga dueño (ownerId válido)
  if (pet.ownerId && pet.ownerId !== null && pet.ownerId !== undefined && pet.ownerId !== '') {
    throw new Error(`La mascota ${pet.name} ya tiene un dueño`);
  }

  // Asignar el dueño y marcar como adoptada, actualizar la mascota en MongoDB
  const updatedPet = { ...pet, ownerId: Number(hero.id), adopted: true };
  await petService.updatePet(petId, updatedPet);

  // Verificar que la mascota realmente fue actualizada
  const petsAfter = await petService.getAllPets();
  const petAfter = petsAfter.find(p => p.id === parseInt(petId));
  if (!petAfter.ownerId || Number(petAfter.ownerId) !== Number(hero.id)) {
    throw new Error('Error al actualizar la mascota como adoptada');
  }

  // Guardar historial de adopción solo si fue exitosa
  const adoptions = await adoptionRepository.getAdoptions();
  const newId = adoptions.length > 0 ? Math.max(...adoptions.map(a => a.id)) + 1 : 1;
  const newAdoption = new Adoption({
    id: newId,
    petId: parseInt(petId),
    heroId: parseInt(heroId),
    date: new Date().toISOString()
  });
  
  await adoptionRepository.saveAdoptions(newAdoption);
  return `La mascota ${pet.name} fue adoptada por ${hero.alias}`;
}

async function getAdoptions(heroId) {
  const pets = await petService.getAllPets();
  const heroes = await heroService.getAllHeroes();

  return pets
    .filter(p => p.ownerId && Number(p.ownerId) === Number(heroId))
    .map(p => {
      const owner = heroes.find(h => h.id === p.ownerId);
      return {
        ...p,
        ownerAlias: owner ? owner.alias : null
      };
    });
}

async function getAdoptionHistory(heroId) {
  const adoptions = await adoptionRepository.getAdoptions();
  const pets = await petService.getAllPets();
  const heroes = await heroService.getAllHeroes();

  return adoptions
    .filter(ad => ad.petId && ad.heroId && Number(ad.heroId) === Number(heroId))
    .map(ad => {
      const pet = pets.find(p => p.id === ad.petId);
      const hero = heroes.find(h => h.id === ad.heroId);

      // Solo retornar si tanto la mascota como el héroe existen
      if (pet && hero) {
        return {
          id: ad.id,
          pet: { id: pet.id, name: pet.name },
          hero: { id: hero.id, alias: hero.alias },
          date: ad.date
        };
      }
      return null;
    })
    .filter(ad => ad !== null); // Eliminar adopciones con datos faltantes
}

export default {
  assignOwner,
  getAdoptions,
  getAdoptionHistory
};
