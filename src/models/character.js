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
        // Save the current character ID to localStorage
        if (id) {
            localStorage.setItem('currentCharacterId', id);
        } else {
            localStorage.removeItem('currentCharacterId');
        }
    }

    getCurrentCharacterId() {
        return this.currentCharacterId;
    }

    get currentCharacter() {
        return this.getCharacter(this.currentCharacterId);
    }

    restoreCurrentCharacterId() {
        const savedId = localStorage.getItem('currentCharacterId');
        if (savedId) {
            this.currentCharacterId = savedId;
        }
        return this.currentCharacterId;
    }

    createNewCharacterId() {
        this.currentCharacterId = Date.now().toString();
        return this.currentCharacterId;
    }

    // Export single character as JSON
    exportCharacter(id) {
        const character = this.getCharacter(id);
        if (!character) {
            throw new Error('Character not found');
        }
        return JSON.stringify([character], null, 2);
    }

    // Export all characters as JSON
    exportAllCharacters() {
        return JSON.stringify(this.characters, null, 2);
    }

    // Import characters from JSON (merge or replace)
    importCharacters(jsonString, mode = 'merge') {
        try {
            const importedCharacters = JSON.parse(jsonString);
            
            if (!Array.isArray(importedCharacters)) {
                throw new Error('Invalid format: expected an array of characters');
            }

            // Validate each character has required fields
            for (const char of importedCharacters) {
                if (!char.id || !char.name) {
                    throw new Error('Invalid character data: missing required fields');
                }
            }

            if (mode === 'replace') {
                // Replace all existing characters
                this.characters = importedCharacters;
            } else {
                // Merge: update existing, add new
                for (const importedChar of importedCharacters) {
                    const existingIndex = this.characters.findIndex(c => c.id === importedChar.id);
                    if (existingIndex >= 0) {
                        // Update existing character
                        this.characters[existingIndex] = importedChar;
                    } else {
                        // Add new character
                        this.characters.push(importedChar);
                    }
                }
            }

            this.saveCharacters();
            return {
                success: true,
                imported: importedCharacters.length,
                total: this.characters.length
            };
        } catch (error) {
            throw new Error(`Import failed: ${error.message}`);
        }
    }
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterModel;
}
