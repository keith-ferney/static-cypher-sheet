// Main application entry point
let app; // Global app instance for onclick handlers

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize MVC components
    const model = new CharacterModel();
    const view = new CharacterView();
    const controller = new CharacterController(model, view);
    
    // Make controller available globally for onclick handlers
    app = controller;
    
    // Initialize the application
    await controller.initialize();
});

// Global functions for onclick handlers (delegates to controller)
function showCharacterList() {
    app.showCharacterList();
}

function showNewCharacterForm() {
    app.showNewCharacterForm();
}

function loadCharacter(id) {
    app.loadCharacter(id);
}

function saveCharacter() {
    app.saveCharacter();
}

function deleteCurrentCharacter() {
    app.deleteCurrentCharacter();
}

function addSkill() {
    app.addSkill();
}

function removeSkill(index) {
    app.removeSkill(index);
}

function addAbility() {
    app.addAbility();
}

function addAbilityFromSelect() {
    app.addAbilityFromSelect();
}

function removeAbility(index) {
    app.removeAbility(index);
}

// Note: Ability description toggle now uses native <details> element - no JS needed!
// Note: Cypher descriptions don't need toggle - always visible

function addEquipment() {
    app.addEquipment();
}

function removeEquipment(index) {
    app.removeEquipment(index);
}

function addAttack() {
    app.addAttack();
}

function removeAttack(index) {
    app.removeAttack(index);
}

function addCypher() {
    app.addCypher();
    // Close form after adding (CSS-only toggle)
    const toggleCheckbox = document.getElementById('cypher-form-toggle');
    if (toggleCheckbox) {
        toggleCheckbox.checked = false;
    }
    // Clear form fields
    document.getElementById('new-cypher-name').value = '';
    document.getElementById('new-cypher-level').value = '';
    document.getElementById('new-cypher-desc').value = '';
}

function removeCypher(index) {
    app.removeCypher(index);
}

// Note: Cypher form toggle now uses CSS-only checkbox solution - no JS needed!

function updateCypherLevel(index, newLevel) {
    const cyphers = app.character.cyphers || [];
    if (cyphers[index]) {
        cyphers[index].level = newLevel;
        app.character.cyphers = cyphers;
        app.saveCharacter();
    }
}

function addPowerShiftInstance(psName) {
    app.addPowerShiftInstance(psName);
}

function removePowerShiftInstance(psName, psId) {
    app.removePowerShiftInstance(psName, psId);
}

// Note: Options menu now uses native <details> element - no JS needed!

// Import/Export functions
function exportCurrentCharacter() {
    app.exportCurrentCharacter();
}

function exportAllCharacters() {
    app.exportAllCharacters();
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const mode = document.querySelector('input[name="import-mode"]:checked').value;
    app.importCharacters(file, mode);
    
    // Reset file input and close modal (CSS-only toggle)
    event.target.value = '';
    const toggleCheckbox = document.getElementById('import-export-toggle');
    if (toggleCheckbox) {
        toggleCheckbox.checked = false;
    }
}

// Note: Import/Export modal now uses CSS-only checkbox solution - no JS needed!

function toggleCharacterLock() {
    app.toggleCharacterLock();
}
