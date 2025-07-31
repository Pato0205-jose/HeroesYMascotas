import heroRepository from '../repositories/heroRepository.js';
import Hero from '../models/heroModel.js';
import bcrypt from 'bcryptjs';

async function getAllHeroes() {
    return await heroRepository.getHeroes();
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }

    const heroes = await heroRepository.getHeroes();
    
    // Generar un nuevo ID de manera más robusta
    let newId = 1;
    if (heroes.length > 0) {
        const maxId = Math.max(...heroes.map(h => h.id || 0));
        newId = maxId + 1;
    }
    
    // Crear un nuevo documento de Mongoose
    const newHero = new Hero({
        id: newId,
        name: hero.name,
        alias: hero.alias,
        city: hero.city || '',
        team: hero.team || '',
        powers: hero.powers || []
    });

    await newHero.save();
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

async function createSampleData() {
    // Verificar si ya existen héroes de ejemplo
    const existingHeroes = await Hero.find({ username: { $in: ['superman', 'batman', 'spiderman'] } });
    if (existingHeroes.length > 0) {
        throw new Error('Los datos de ejemplo ya existen');
    }

    const sampleHeroes = [
        {
            id: 1,
            username: 'superman',
            password: await bcrypt.hash('1234', 10),
            name: 'Clark Kent',
            alias: 'Superman',
            city: 'Metrópolis',
            team: 'Justice League',
            powers: ['Super fuerza', 'Vuelo', 'Visión de rayos X']
        },
        {
            id: 2,
            username: 'batman',
            password: await bcrypt.hash('1234', 10),
            name: 'Bruce Wayne',
            alias: 'Batman',
            city: 'Gotham',
            team: 'Justice League',
            powers: ['Inteligencia', 'Artes marciales', 'Tecnología']
        },
        {
            id: 3,
            username: 'spiderman',
            password: await bcrypt.hash('1234', 10),
            name: 'Peter Parker',
            alias: 'Spider-Man',
            city: 'Nueva York',
            team: 'Avengers',
            powers: ['Sentido arácnido', 'Trepar paredes', 'Lanzar telarañas']
        }
    ];

    for (const heroData of sampleHeroes) {
        const hero = new Hero(heroData);
        await hero.save();
    }
}

export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain,
    createSampleData
};
