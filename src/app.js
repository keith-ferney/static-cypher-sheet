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

function toggleCypherDesc(index) {
    CyphersRenderer.toggleCypherDesc(index);
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
    // Hide form after adding
    const form = document.getElementById('cypher-form');
    const button = document.getElementById('toggle-cypher-form');
    if (form && button) {
        form.classList.add('hidden');
        button.textContent = '+ Add';
    }
}

function removeCypher(index) {
    app.removeCypher(index);
}

function toggleCypherForm() {
    const form = document.getElementById('cypher-form');
    const button = document.getElementById('toggle-cypher-form');
    if (form && button) {
        if (form.classList.contains('hidden')) {
            form.classList.remove('hidden');
            form.classList.add('flex');
            button.textContent = 'Cancel';
            // Clear form
            document.getElementById('new-cypher-name').value = '';
            document.getElementById('new-cypher-level').value = '';
            document.getElementById('new-cypher-desc').value = '';
        } else {
            form.classList.add('hidden');
            form.classList.remove('flex');
            button.textContent = '+ Add';
        }
    }
}

function updateCypherLevel(index, newLevel) {
    const cyphers = app.character.cyphers || [];
    if (cyphers[index]) {
        cyphers[index].level = newLevel;
        app.character.cyphers = cyphers;
        app.saveCharacter();
    }
}

function toggleOptionsMenu() {
    const menu = document.getElementById('options-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

function addPowerShiftInstance(psName) {
    app.addPowerShiftInstance(psName);
}

function removePowerShiftInstance(psName, psId) {
    app.removePowerShiftInstance(psName, psId);
}

// Close options menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('options-menu');
    const button = document.getElementById('options-menu-button');
    if (menu && button && !menu.contains(e.target) && !button.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

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
