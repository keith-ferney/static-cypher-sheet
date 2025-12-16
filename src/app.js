// Main application entry point
let app; // Global app instance for handlers

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize MVC components
    const model = new CharacterModel();
    const view = new CharacterView();
    const controller = new CharacterController(model, view);
    
    // Make controller available globally for handlers
    app = controller;
    
    // Initialize the application
    await controller.initialize();
    
    // Set up event delegation for data-action buttons
    setupEventDelegation();
});

// Event delegation handler for data-action attributes
function setupEventDelegation() {
    // Handle clicks
    document.addEventListener('click', (e) => {
        const element = e.target.closest('[data-action]');
        if (!element) return;
        
        const action = element.dataset.action;
        
        // Handle actions with index parameter
        if (element.dataset.index !== undefined) {
            const index = parseInt(element.dataset.index);
            
            if (action === 'removeSkill') {
                app.removeSkill(index);
            } else if (action === 'removeEquipment') {
                app.removeEquipment(index);
            } else if (action === 'removeAttack') {
                app.removeAttack(index);
            } else if (action === 'removeCypher') {
                app.removeCypher(index);
            } else if (action === 'removeAbility') {
                app.removeAbility(index);
            } else if (action === 'toggleAbilityEditMode') {
                AbilitiesRenderer.toggleEditMode(index);
            }
        }
        // Handle power shift actions with special parameters
        else if (action === 'addPowerShiftInstance') {
            const psName = element.dataset.psName;
            app.addPowerShiftInstance(psName);
        } else if (action === 'removePowerShiftInstance') {
            const psName = element.dataset.psName;
            const psId = element.dataset.psId;
            app.removePowerShiftInstance(psName, psId);
        }
        // Handle loadCharacter with character ID
        else if (action === 'loadCharacter') {
            const charId = element.dataset.charId;
            app.loadCharacter(charId);
        }
        // Handle no-parameter actions
        else if (typeof window[action] === 'function') {
            window[action]();
        }
        
        // Close parent details element if inside options menu
        const details = element.closest('details');
        if (details && !details.hasAttribute('open')) {
            // Only close if it was already open (for options menu)
        } else if (details) {
            details.removeAttribute('open');
        }
    });
    
    // Handle change events for inputs with data-action
    document.addEventListener('change', (e) => {
        const element = e.target.closest('[data-action]');
        if (!element) return;
        
        const action = element.dataset.action;
        
        if (action === 'updateCypherLevel') {
            const index = parseInt(element.dataset.index);
            app.updateCypherLevel(index, element.value);
        } else if (action === 'checkForChanges') {
            app.checkForChanges();
        } else if (action === 'handleImportFile') {
            handleImportFile(e);
        } else if (action === 'loadCharacter') {
            const charId = element.dataset.charId;
            app.loadCharacter(charId);
        }
    });
}

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

// Stub for backward compatibility with old saved characters that have inline onclick handlers
// This prevents errors when loading characters saved before the CSS-only refactoring
window.toggleAbilityDesc = function() {
    // No-op: Ability descriptions are now handled by native <details> element
    // Old saved characters may have onclick="app.toggleAbilityDesc()" in their HTML
    console.warn('toggleAbilityDesc called from old saved data - functionality now handled by <details> element');
};
