// Character Controller - Handles application logic and coordinates model/view
class CharacterController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Pass model reference to view
        this.view.setModel(model);
        
        // Initialize sub-controllers
        this.crudController = new CharacterCRUDController(model, view);
        this.changeTracker = new CharacterChangeTracker(model, view);
    }

    async initialize() {
        // Wait for data to load
        await loadCypherData();
        this.view.renderAdvancements();
        this.model.loadCharacters();
        
        // Initialize FancySelects BEFORE loading character data
        this.view.initializeFancySelects();
        
        // Set up change detection callback for FancySelects
        this.view.setChangeDetectionCallback(() => this.checkForChanges());
        
        // Try to restore the last viewed character
        const lastCharacterId = this.model.restoreCurrentCharacterId();
        
        if (lastCharacterId && this.model.getCharacter(lastCharacterId)) {
            // If we have a saved character ID and it still exists, load it
            await this.loadCharacter(lastCharacterId);
        } else if (this.model.getAllCharacters().length === 0) {
            // If no characters exist, show character sheet instead of list
            await this.showNewCharacterForm();
        } else {
            // Otherwise show the character list
            this.showCharacterList();
        }
        
        // Set up change detection
        this.changeTracker.setupChangeDetection();
    }

    setupChangeDetection() {
        const sheetView = document.getElementById('character-sheet-view');
        
        // Listen for input changes
        sheetView.addEventListener('input', () => {
            this.changeTracker.checkForChanges();
        });
        
        // Listen for checkbox changes
        sheetView.addEventListener('change', () => {
            this.changeTracker.checkForChanges();
        });
    }

    checkForChanges() {
        this.changeTracker.checkForChanges();
    }

    saveSnapshot() {
        this.changeTracker.saveSnapshot();
    }

    showCharacterList() {
        this.crudController.showCharacterList();
    }

    async showNewCharacterForm() {
        await this.crudController.showNewCharacterForm();
        this.changeTracker.saveSnapshot();
    }

    async loadCharacter(id) {
        await this.crudController.loadCharacter(id);
        this.changeTracker.saveSnapshot();
    }

    saveCharacter() {
        this.crudController.saveCharacter();
        this.changeTracker.saveSnapshot();
    }

    deleteCurrentCharacter() {
        this.crudController.deleteCurrentCharacter();
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

    // Note: toggleAbilityDesc removed - now handled by native <details> element

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

    // Power Shifts methods
    async addPowerShiftInstance(psName) {
        // Get ALL power shifts including those with value 0
        const powerShifts = this.view.getAllPowerShifts();
        const newId = Date.now().toString(); // Use timestamp as unique ID
        
        powerShifts.push({
            name: psName,
            value: 0,
            additional_text: '',
            id: newId
        });
        
        await this.view.renderPowerShifts(powerShifts);
        this.checkForChanges();
    }

    async removePowerShiftInstance(psName, psId) {
        const powerShifts = this.view.getCurrentPowerShifts();
        const filtered = powerShifts.filter(ps => !(ps.name === psName && ps.id === psId));
        await this.view.renderPowerShifts(filtered);
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

    // Export current character
    exportCurrentCharacter() {
        this.crudController.exportCurrentCharacter();
    }

    // Export all characters
    exportAllCharacters() {
        this.crudController.exportAllCharacters();
    }

    // Import characters
    importCharacters(file, mode = 'merge') {
        this.crudController.importCharacters(file, mode);
    }

    // Helper to download JSON
    downloadJSON(jsonData, filename) {
        this.crudController.downloadJSON(jsonData, filename);
    }

    // Toggle character lock/unlock
    toggleCharacterLock() {
        const currentCharacter = this.model.currentCharacter;
        if (!currentCharacter) return;
        
        const isLocked = currentCharacter.isLocked || false;
        const newLockState = !isLocked;
        
        // Update model first
        currentCharacter.isLocked = newLockState;
        
        // Save the character data with the lock state
        const characterData = this.view.getCharacterDataFromForm();
        characterData.isLocked = newLockState; // Ensure it's in the saved data
        this.model.saveCharacter(characterData);
        
        // Update UI
        this.view.updateLockState(newLockState);
        
        // Update snapshot to match current state (so no "unsaved changes" indicator)
        this.changeTracker.saveSnapshot();
        
        this.view.showToast(newLockState ? 'Character locked' : 'Character unlocked', 'success');
    }
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterController;
}
