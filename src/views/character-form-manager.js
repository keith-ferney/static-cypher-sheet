// Character Form Manager - Handles form data operations
class CharacterFormManager {
    constructor(formRenderer) {
        this.formRenderer = formRenderer;
        this.model = null; // Will be set by CharacterView
    }

    setModel(model) {
        this.model = model;
    }

    /**
     * Load character data into the form
     */
    loadToForm(character, fancySelects) {
        // Basic fields
        document.getElementById('char-name').value = character.name || '';
        document.getElementById('char-tier').value = character.tier || 1;
        document.getElementById('char-descriptor').value = character.descriptor || '';
        document.getElementById('char-type').value = character.type || '';
        document.getElementById('char-focus').value = character.focus || '';
        document.getElementById('char-flavor').value = character.flavor || '';
        
        // Update FancySelect dropdowns
        if (fancySelects.descriptorSelect && character.descriptor) {
            fancySelects.descriptorSelect.setValue(character.descriptor);
        }
        if (fancySelects.typeSelect && character.type) {
            fancySelects.typeSelect.setValue(character.type);
        }
        if (fancySelects.focusSelect && character.focus) {
            fancySelects.focusSelect.setValue(character.focus);
        }
        if (fancySelects.flavorSelect && character.flavor) {
            fancySelects.flavorSelect.setValue(character.flavor);
        }
        
        // Text areas
        document.getElementById('char-background').value = character.background || '';
        document.getElementById('char-notes').value = character.notes || '';
        document.getElementById('char-portrait').value = character.portrait || '';
        
        // Stats
        document.getElementById('might-pool').value = character.mightPool || 10;
        document.getElementById('might-edge').value = character.mightEdge || 0;
        document.getElementById('might-current').value = character.mightCurrent || 10;
        document.getElementById('speed-pool').value = character.speedPool || 10;
        document.getElementById('speed-edge').value = character.speedEdge || 0;
        document.getElementById('speed-current').value = character.speedCurrent || 10;
        document.getElementById('intellect-pool').value = character.intellectPool || 10;
        document.getElementById('intellect-edge').value = character.intellectEdge || 0;
        document.getElementById('intellect-current').value = character.intellectCurrent || 10;
        document.getElementById('char-effort').value = character.effort || 1;
        document.getElementById('char-experience').value = character.experience || 0;
        
        // Recovery
        document.getElementById('recovery-modifier').value = character.recoveryModifier || 0;
        document.getElementById('impaired').checked = character.impaired || false;
        document.getElementById('debilitated').checked = character.debilitated || false;
        document.getElementById('recovery-action').checked = character.recoveryAction || false;
        document.getElementById('recovery-10min').checked = character.recovery10min || false;
        document.getElementById('recovery-1hour').checked = character.recovery1hour || false;
        document.getElementById('recovery-10hour').checked = character.recovery10hour || false;
        
        // Render complex lists
        FormRenderer.renderSkills(character.skills || []);
        FormRenderer.renderAbilities(character.abilities || []);
        FormRenderer.renderEquipment(character.equipment || []);
        FormRenderer.renderAttacks(character.attacks || []);
        FormRenderer.renderCyphers(character.cyphers || []);
        FormRenderer.renderPowerShifts(character.powerShifts || []);
        FormRenderer.renderAdvancements(character.advancements || []);
    }

    /**
     * Clear all form fields
     */
    clearForm() {
        // Basic fields
        document.getElementById('char-name').value = '';
        document.getElementById('char-tier').value = '1';
        document.getElementById('char-descriptor').value = '';
        document.getElementById('char-type').value = '';
        document.getElementById('char-focus').value = '';
        document.getElementById('char-flavor').value = '';
        document.getElementById('char-background').value = '';
        document.getElementById('char-notes').value = '';
        document.getElementById('char-portrait').value = '';
        
        // Reset stats to defaults
        document.getElementById('might-pool').value = '10';
        document.getElementById('might-edge').value = '0';
        document.getElementById('might-current').value = '10';
        document.getElementById('speed-pool').value = '10';
        document.getElementById('speed-edge').value = '0';
        document.getElementById('speed-current').value = '10';
        document.getElementById('intellect-pool').value = '10';
        document.getElementById('intellect-edge').value = '0';
        document.getElementById('intellect-current').value = '10';
        document.getElementById('char-effort').value = '1';
        document.getElementById('char-experience').value = '0';
        document.getElementById('recovery-modifier').value = '0';
        
        // Uncheck all checkboxes
        document.getElementById('impaired').checked = false;
        document.getElementById('debilitated').checked = false;
        document.getElementById('recovery-action').checked = false;
        document.getElementById('recovery-10min').checked = false;
        document.getElementById('recovery-1hour').checked = false;
        document.getElementById('recovery-10hour').checked = false;
        
        // Clear all lists
        FormRenderer.renderSkills([]);
        FormRenderer.renderAbilities([]);
        FormRenderer.renderEquipment([]);
        FormRenderer.renderAttacks([]);
        FormRenderer.renderCyphers([]);
        FormRenderer.renderPowerShifts([]);
        FormRenderer.renderAdvancements([]);
    }

    /**
     * Get all character data from the form
     */
    getDataFromForm() {
        // Preserve isLocked from current character if it exists
        const currentIsLocked = this.model?.currentCharacter?.isLocked || false;
        
        return {
            name: document.getElementById('char-name').value || 'Unnamed Character',
            tier: parseInt(document.getElementById('char-tier').value) || 1,
            descriptor: document.getElementById('char-descriptor').value,
            type: document.getElementById('char-type').value,
            focus: document.getElementById('char-focus').value,
            flavor: document.getElementById('char-flavor').value,
            background: document.getElementById('char-background').value,
            notes: document.getElementById('char-notes').value,
            portrait: document.getElementById('char-portrait').value,
            mightPool: parseInt(document.getElementById('might-pool').value) || 10,
            mightEdge: parseInt(document.getElementById('might-edge').value) || 0,
            mightCurrent: parseInt(document.getElementById('might-current').value) || 10,
            speedPool: parseInt(document.getElementById('speed-pool').value) || 10,
            speedEdge: parseInt(document.getElementById('speed-edge').value) || 0,
            speedCurrent: parseInt(document.getElementById('speed-current').value) || 10,
            intellectPool: parseInt(document.getElementById('intellect-pool').value) || 10,
            intellectEdge: parseInt(document.getElementById('intellect-edge').value) || 0,
            intellectCurrent: parseInt(document.getElementById('intellect-current').value) || 10,
            effort: parseInt(document.getElementById('char-effort').value) || 1,
            experience: parseInt(document.getElementById('char-experience').value) || 0,
            recoveryModifier: parseInt(document.getElementById('recovery-modifier').value) || 0,
            impaired: document.getElementById('impaired').checked,
            debilitated: document.getElementById('debilitated').checked,
            recoveryAction: document.getElementById('recovery-action').checked,
            recovery10min: document.getElementById('recovery-10min').checked,
            recovery1hour: document.getElementById('recovery-1hour').checked,
            recovery10hour: document.getElementById('recovery-10hour').checked,
            skills: FormRenderer.getCurrentSkills(),
            abilities: FormRenderer.getCurrentAbilities(),
            equipment: FormRenderer.getCurrentEquipment(),
            attacks: FormRenderer.getCurrentAttacks(),
            cyphers: FormRenderer.getCurrentCyphers(),
            powerShifts: FormRenderer.getCurrentPowerShifts(),
            advancements: FormRenderer.getCurrentAdvancements(),
            isLocked: currentIsLocked // Preserve lock state
        };
    }
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterFormManager;
}
