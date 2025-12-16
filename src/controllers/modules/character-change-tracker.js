// Character Change Detection Module
class CharacterChangeTracker {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.savedCharacterSnapshot = null;
    }

    setupChangeDetection() {
        const characterSheetView = document.getElementById('character-sheet-view');
        if (!characterSheetView) return;

        const checkChanges = () => this.checkForChanges();

        // Add change listeners to all inputs in the character sheet
        characterSheetView.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', checkChanges);
            input.addEventListener('change', checkChanges);
        });

        // Add observers for dynamic content that gets added/removed
        const observer = new MutationObserver(() => {
            // Re-attach listeners to any new inputs
            characterSheetView.querySelectorAll('input, select, textarea').forEach(input => {
                // Remove old listeners first to avoid duplicates
                input.removeEventListener('input', checkChanges);
                input.removeEventListener('change', checkChanges);
                // Add listeners
                input.addEventListener('input', checkChanges);
                input.addEventListener('change', checkChanges);
            });
            // Check for changes
            checkChanges();
        });

        const dynamicSections = [
            'skills-list',
            'abilities-list',
            'equipment-list',
            'attacks-list',
            'cyphers-list',
            'powershifts-list',
            'advancements-list'
        ];

        dynamicSections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true
                });
            }
        });
    }

    checkForChanges() {
        if (!this.model.getCurrentCharacterId()) return;

        const currentData = this.view.getCharacterDataFromForm();
        const currentSnapshot = JSON.stringify(currentData);

        if (this.savedCharacterSnapshot !== currentSnapshot) {
            this.view.updateSaveButtonState(true);
        } else {
            this.view.updateSaveButtonState(false);
        }
    }

    saveSnapshot() {
        if (!this.model.getCurrentCharacterId()) {
            this.savedCharacterSnapshot = null;
            return;
        }

        const currentData = this.view.getCharacterDataFromForm();
        this.savedCharacterSnapshot = JSON.stringify(currentData);
        this.view.updateSaveButtonState(false);
    }

    clearSnapshot() {
        this.savedCharacterSnapshot = null;
        this.view.updateSaveButtonState(false);
    }
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterChangeTracker;
}
