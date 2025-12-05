// Character Model - Handles data persistence and retrieval
class CharacterModel {
    constructor() {
        this.characters = [];
        this.currentCharacterId = null;
    }

    loadCharacters() {
        const stored = localStorage.getItem('cypherCharacters');
        this.characters = stored ? JSON.parse(stored) : [];
        return this.characters;
    }

    saveCharacters() {
        localStorage.setItem('cypherCharacters', JSON.stringify(this.characters));
    }

    getCharacter(id) {
        return this.characters.find(c => c.id === id);
    }

    getAllCharacters() {
        return this.characters;
    }

    saveCharacter(characterData) {
        const character = {
            id: this.currentCharacterId,
            ...characterData,
            updatedAt: new Date().toISOString()
        };

        const index = this.characters.findIndex(c => c.id === this.currentCharacterId);
        if (index >= 0) {
            this.characters[index] = character;
        } else {
            this.characters.push(character);
        }

        this.saveCharacters();
        return character;
    }

    deleteCharacter(id) {
        this.characters = this.characters.filter(c => c.id !== id);
        this.saveCharacters();
    }

    setCurrentCharacterId(id) {
        this.currentCharacterId = id;
    }

    getCurrentCharacterId() {
        return this.currentCharacterId;
    }

    createNewCharacterId() {
        this.currentCharacterId = Date.now().toString();
        return this.currentCharacterId;
    }
}
