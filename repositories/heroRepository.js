import Hero from '../models/heroModel.js'

async function getHeroes() {
    try {
        return await Hero.find();
    } catch (error) {
        console.error('Error getting heroes:', error);
        return [];
    }
}

async function saveHeroes(heroes) {
    try {
        if (Array.isArray(heroes)) {
            await Hero.insertMany(heroes);
        } else {
            await heroes.save();
        }
    } catch (error) {
        console.error('Error saving heroes:', error);
        throw error;
    }
}

async function updateHero(id, updateData) {
    try {
        return await Hero.findOneAndUpdate({ id: id }, updateData, { new: true });
    } catch (error) {
        console.error('Error updating hero:', error);
        throw error;
    }
}

async function findHeroById(id) {
    try {
        return await Hero.findOne({ id: id });
    } catch (error) {
        console.error('Error finding hero:', error);
        return null;
    }
}

export default {
    getHeroes,
    saveHeroes,
    updateHero,
    findHeroById
}