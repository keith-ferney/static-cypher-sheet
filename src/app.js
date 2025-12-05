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

function toggleAbilityDesc(index) {
    app.toggleAbilityDesc(index);
}

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
}

function removeCypher(index) {
    app.removeCypher(index);
}

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
    
    // Reset file input and hide modal
    event.target.value = '';
    hideImportExportModal();
}

function showImportExportModal() {
    document.getElementById('import-export-modal').classList.remove('hidden');
}

function hideImportExportModal() {
    document.getElementById('import-export-modal').classList.add('hidden');
}
