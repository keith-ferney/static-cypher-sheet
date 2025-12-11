// Character Change Detection Module
class CharacterChangeTracker {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.savedCharacterSnapshot = null;
    }

    setupChangeDetection() {
        const form = document.getElementById('characterForm');
        if (!form) return;

        const checkChanges = () => this.checkForChanges();

        // Add change listeners to all form inputs
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', checkChanges);
            input.addEventListener('change', checkChanges);
        });

        // Add observers for dynamic content
        const observer = new MutationObserver(checkChanges);
        const dynamicSections = [
            'skillsContainer',
            'abilitiesContainer',
            'equipmentContainer',
            'attacksContainer',
            'cyphersContainer'
        ];

        dynamicSections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element, {
                    childList: true,
                    subtree: true,
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
            this.view.showUnsavedIndicator();
        } else {
            this.view.hideUnsavedIndicator();
        }
    }

    saveSnapshot() {
        if (!this.model.getCurrentCharacterId()) {
            this.savedCharacterSnapshot = null;
            return;
        }

        const currentData = this.view.getCharacterDataFromForm();
        this.savedCharacterSnapshot = JSON.stringify(currentData);
        this.view.hideUnsavedIndicator();
    }

    clearSnapshot() {
        this.savedCharacterSnapshot = null;
        this.view.hideUnsavedIndicator();
    }
}
