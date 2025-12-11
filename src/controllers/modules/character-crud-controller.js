// Character CRUD Operations Module
class CharacterCRUDController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    showCharacterList() {
        this.view.showCharacterList();
        this.model.setCurrentCharacterId(null);
        this.view.renderCharacterList(this.model.getAllCharacters());
    }

    showNewCharacterForm() {
        this.model.createNewCharacterId();
        this.view.clearForm();
        this.view.showCharacterSheet();
        
        // Ensure new characters start unlocked
        this.view.updateLockState(false);
    }

    loadCharacter(id) {
        const character = this.model.getCharacter(id);
        if (!character) return;

        this.model.setCurrentCharacterId(id);
        this.view.loadCharacterToForm(character);
        this.view.showCharacterSheet();
        
        // Restore lock state
        this.view.updateLockState(character.isLocked || false);
    }

    saveCharacter() {
        const characterData = this.view.getCharacterDataFromForm();
        this.model.saveCharacter(characterData);
        this.view.showToast('Character saved successfully!', 'success');
    }

    deleteCurrentCharacter() {
        const character = this.model.currentCharacter;
        const characterName = character?.name || 'this character';
        
        if (!confirm(`Are you sure you want to delete "${characterName}"? This action cannot be undone.`)) {
            return;
        }
        
        this.model.deleteCharacter(this.model.getCurrentCharacterId());
        this.view.showToast('Character deleted', 'success');
        this.showCharacterList();
    }

    // Export current character
    exportCurrentCharacter() {
        const currentId = this.model.getCurrentCharacterId();
        if (!currentId) {
            this.view.showToast('No character selected', 'error');
            return;
        }

        try {
            const jsonData = this.model.exportCharacter(currentId);
            const character = this.model.getCharacter(currentId);
            const filename = `${character.name || 'character'}_${currentId}.json`;
            this.downloadJSON(jsonData, filename);
            this.view.showToast('Character exported successfully!', 'success');
        } catch (error) {
            this.view.showToast(`Export failed: ${error.message}`, 'error');
        }
    }

    // Export all characters
    exportAllCharacters() {
        try {
            const jsonData = this.model.exportAllCharacters();
            const filename = `all_characters_${Date.now()}.json`;
            this.downloadJSON(jsonData, filename);
            this.view.showToast(`Exported ${this.model.getAllCharacters().length} character(s)`, 'success');
        } catch (error) {
            this.view.showToast(`Export failed: ${error.message}`, 'error');
        }
    }

    // Import characters
    importCharacters(file, mode = 'merge') {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = this.model.importCharacters(e.target.result, mode);
                this.view.showToast(`Imported ${result.imported} character(s)`, 'success');
                this.showCharacterList();
            } catch (error) {
                this.view.showToast(error.message, 'error');
            }
        };
        reader.onerror = () => {
            this.view.showToast('Failed to read file', 'error');
        };
        reader.readAsText(file);
    }

    // Helper to download JSON
    downloadJSON(jsonData, filename) {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterCRUDController;
}
