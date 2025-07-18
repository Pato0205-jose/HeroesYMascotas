import heroRepository from '../repositories/heroRepository.js';

async function getAllHeroes() {
    return await heroRepository.getHeroes();
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }

    const heroes = await heroRepository.getHeroes();
    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 1;
    const newHero = { ...hero, id: newId };

    await heroRepository.saveHeroes(newHero);
    return newHero;
}

async function updateHero(id, updatedHero) {
    const hero = await heroRepository.findHeroById(parseInt(id));
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }

    delete updatedHero.id;
    return await heroRepository.updateHero(parseInt(id), updatedHero);
}

async function deleteHero(id) {
    const hero = await heroRepository.findHeroById(parseInt(id));
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }

    await hero.deleteOne();
    return { message: 'Héroe eliminado' };
}

async function findHeroesByCity(city) {
    const heroes = await heroRepository.getHeroes();
    return heroes.filter(hero => hero.city && hero.city.toLowerCase() === city.toLowerCase());
}

async function faceVillain(heroId, villain) {
    const hero = await heroRepository.findHeroById(parseInt(heroId));
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    return `${hero.alias} enfrenta a ${villain}`;
}

export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain
};
