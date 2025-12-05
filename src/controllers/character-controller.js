// Character Controller - Handles application logic and coordinates model/view
class CharacterController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
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
    }

    loadCharacter(id) {
        const character = this.model.getCharacter(id);
        if (!character) return;

        this.model.setCurrentCharacterId(id);
        this.view.loadCharacterToForm(character);
        this.view.showCharacterSheet();
    }

    saveCharacter() {
        const characterData = this.view.getCharacterDataFromForm();
        this.model.saveCharacter(characterData);
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
    }

    removeSkill(index) {
        const skills = this.view.getCurrentSkills();
        skills.splice(index, 1);
        this.view.renderSkills(skills);
    }

    // Abilities methods
    addAbility() {
        const abilities = this.view.getCurrentAbilities();
        abilities.push({ name: '', description: '' });
        this.view.renderAbilities(abilities);
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
        }
    }

    removeAbility(index) {
        const abilities = this.view.getCurrentAbilities();
        abilities.splice(index, 1);
        this.view.renderAbilities(abilities);
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
    }

    removeEquipment(index) {
        const equipment = this.view.getCurrentEquipment();
        equipment.splice(index, 1);
        this.view.renderEquipment(equipment);
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
    }

    removeAttack(index) {
        const attacks = this.view.getCurrentAttacks();
        attacks.splice(index, 1);
        this.view.renderAttacks(attacks);
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
    }

    removeCypher(index) {
        const cyphers = this.view.getCurrentCyphers();
        cyphers.splice(index, 1);
        this.view.renderCyphers(cyphers);
    }
}
