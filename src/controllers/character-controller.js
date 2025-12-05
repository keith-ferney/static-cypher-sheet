// Character Controller - Handles application logic and coordinates model/view
class CharacterController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.savedCharacterSnapshot = null;
    }

    async initialize() {
        // Wait for data to load
        await loadCypherData();
        this.view.renderAdvancements();
        this.model.loadCharacters();
        
        // If no characters exist, show character sheet instead of list
        if (this.model.getAllCharacters().length === 0) {
            this.showNewCharacterForm();
        } else {
            this.showCharacterList();
        }
        
        // Initialize FancySelects after view is shown
        this.view.initializeFancySelects();
        
        // Set up change detection
        this.setupChangeDetection();
    }

    setupChangeDetection() {
        const sheetView = document.getElementById('character-sheet-view');
        
        // Listen for input changes
        sheetView.addEventListener('input', () => {
            this.checkForChanges();
        });
        
        // Listen for checkbox changes
        sheetView.addEventListener('change', () => {
            this.checkForChanges();
        });
    }

    checkForChanges() {
        if (!this.savedCharacterSnapshot) {
            return;
        }
        
        const currentData = this.view.getCharacterDataFromForm();
        const hasChanges = JSON.stringify(currentData) !== JSON.stringify(this.savedCharacterSnapshot);
        
        this.view.updateSaveButtonState(hasChanges);
    }

    saveSnapshot() {
        const currentData = this.view.getCharacterDataFromForm();
        this.savedCharacterSnapshot = JSON.parse(JSON.stringify(currentData));
        this.view.updateSaveButtonState(false);
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
        this.saveSnapshot();
    }

    loadCharacter(id) {
        const character = this.model.getCharacter(id);
        if (!character) return;

        this.model.setCurrentCharacterId(id);
        this.view.loadCharacterToForm(character);
        this.view.showCharacterSheet();
        this.saveSnapshot();
    }

    saveCharacter() {
        const characterData = this.view.getCharacterDataFromForm();
        this.model.saveCharacter(characterData);
        this.saveSnapshot();
        alert('Character saved successfully!');
    }

    deleteCurrentCharacter() {
        if (!confirm('Are you sure you want to delete this character?')) return;
        this.model.deleteCharacter(this.model.getCurrentCharacterId());
        this.showCharacterList();
    }

    // Skills methods
    addSkill() {
        const skills = this.view.getCurrentSkills();
        skills.push({ name: '', pool: '', type: '', powerShift: 0 });
        this.view.renderSkills(skills);
        this.checkForChanges();
    }

    removeSkill(index) {
        const skills = this.view.getCurrentSkills();
        skills.splice(index, 1);
        this.view.renderSkills(skills);
        this.checkForChanges();
    }

    // Abilities methods
    addAbility() {
        const abilities = this.view.getCurrentAbilities();
        abilities.push({ name: '', description: '' });
        this.view.renderAbilities(abilities);
        this.checkForChanges();
    }

    addAbilityFromSelect() {
        if (!this.view.abilitySelect || !this.view.abilitySelect.value) {
            alert('Please select an ability first');
            return;
        }
        
        const selectedAbility = cypherData.abilities.find(a => a.name === this.view.abilitySelect.value);
        if (selectedAbility) {
            const abilities = this.view.getCurrentAbilities();
            abilities.push({ 
                name: selectedAbility.name, 
                description: selectedAbility.description 
            });
            this.view.renderAbilities(abilities);
            
            // Reset the select
            this.view.abilitySelect.setValue(null);
            this.checkForChanges();
        }
    }

    removeAbility(index) {
        const abilities = this.view.getCurrentAbilities();
        abilities.splice(index, 1);
        this.view.renderAbilities(abilities);
        this.checkForChanges();
    }

    toggleAbilityDesc(index) {
        this.view.toggleAbilityDesc(index);
    }

    // Equipment methods
    addEquipment() {
        const input = document.getElementById('new-equipment');
        const item = input.value.trim();
        if (!item) return;
        const equipment = this.view.getCurrentEquipment();
        equipment.push(item);
        this.view.renderEquipment(equipment);
        input.value = '';
        this.checkForChanges();
    }

    removeEquipment(index) {
        const equipment = this.view.getCurrentEquipment();
        equipment.splice(index, 1);
        this.view.renderEquipment(equipment);
        this.checkForChanges();
    }

    // Attacks methods
    addAttack() {
        const input = document.getElementById('new-attack');
        const attack = input.value.trim();
        if (!attack) return;
        const attacks = this.view.getCurrentAttacks();
        attacks.push(attack);
        this.view.renderAttacks(attacks);
        input.value = '';
        this.checkForChanges();
    }

    removeAttack(index) {
        const attacks = this.view.getCurrentAttacks();
        attacks.splice(index, 1);
        this.view.renderAttacks(attacks);
        this.checkForChanges();
    }

    // Cyphers methods
    addCypher() {
        const nameInput = document.getElementById('new-cypher-name');
        const levelInput = document.getElementById('new-cypher-level');
        const descInput = document.getElementById('new-cypher-desc');
        const name = nameInput.value.trim();
        const level = levelInput.value.trim();
        const description = descInput.value.trim();
        if (!name) return;
        const cyphers = this.view.getCurrentCyphers();
        cyphers.push({ name, level, description });
        this.view.renderCyphers(cyphers);
        nameInput.value = '';
        levelInput.value = '';
        descInput.value = '';
        this.checkForChanges();
    }

    removeCypher(index) {
        const cyphers = this.view.getCurrentCyphers();
        cyphers.splice(index, 1);
        this.view.renderCyphers(cyphers);
        this.checkForChanges();
    }
}
