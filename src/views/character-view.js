// Character Sheet View - Main orchestrator for character UI
class CharacterView {
    constructor() {
        // Initialize sub-components
        this.toast = new ToastNotification();
        this.formManager = new CharacterFormManager(FormRenderer);
        
        // FancySelect instances
        this.descriptorSelect = null;
        this.typeSelect = null;
        this.focusSelect = null;
        this.flavorSelect = null;
        this.abilitySelect = null;
        this.model = null; // Will be set by controller
    }

    setModel(model) {
        this.model = model;
        this.formManager.setModel(model);
    }

    // ========== TOAST NOTIFICATIONS ==========
    showToast(message, type = 'success') {
        this.toast.show(message, type);
    }

    // ========== FANCY SELECTS ==========
    initializeFancySelects() {
        // Initialize Descriptor Select
        this.descriptorSelect = new FancySelect(
            document.getElementById('descriptor-select'),
            {
                data: cypherData.descriptors || [],
                labelKey: 'name',
                valueKey: 'name',
                descriptionKey: 'description',
                placeholder: '- Select A Descriptor -',
                extraWide: true,
                onChange: (option) => {
                    document.getElementById('char-descriptor').value = option.name;
                    this.triggerChangeDetection();
                }
            }
        );

        // Initialize Type Select
        this.typeSelect = new FancySelect(
            document.getElementById('type-select'),
            {
                data: cypherData.types || [],
                labelKey: 'name',
                valueKey: 'name',
                descriptionKey: 'description',
                placeholder: '- Select A Type -',
                extraWide: true,
                onChange: (option) => {
                    document.getElementById('char-type').value = option.name;
                    this.triggerChangeDetection();
                }
            }
        );

        // Initialize Focus Select
        this.focusSelect = new FancySelect(
            document.getElementById('focus-select'),
            {
                data: cypherData.foci || [],
                labelKey: 'name',
                valueKey: 'name',
                descriptionKey: 'description',
                placeholder: '- Select A Focus -',
                onChange: (option) => {
                    document.getElementById('char-focus').value = option.name;
                    this.triggerChangeDetection();
                }
            }
        );

        // Initialize Flavor Select
        this.flavorSelect = new FancySelect(
            document.getElementById('flavor-select'),
            {
                data: cypherData.flavors || [],
                labelKey: 'name',
                valueKey: 'name',
                descriptionKey: 'description',
                placeholder: '- Select A Flavor (Optional) -',
                onChange: (option) => {
                    document.getElementById('char-flavor').value = option.name;
                    this.triggerChangeDetection();
                }
            }
        );
        
        // Initialize Ability Select
        this.abilitySelect = new FancySelect(
            document.getElementById('ability-select'),
            {
                data: cypherData.abilities || [],
                labelKey: 'name',
                valueKey: 'name',
                descriptionKey: 'description',
                placeholder: '- Select A Special Ability -',
                onChange: (option) => {
                    // Will be handled by controller
                }
            }
        );
    }

    // Trigger change detection callback (set by controller)
    triggerChangeDetection() {
        if (this.onChangeCallback) {
            this.onChangeCallback();
        }
    }

    // Set the change detection callback
    setChangeDetectionCallback(callback) {
        this.onChangeCallback = callback;
    }

    // ========== VIEW NAVIGATION ==========
    showCharacterList() {
        document.getElementById('character-list-view').classList.remove('hidden');
        document.getElementById('character-sheet-view').classList.add('hidden');
    }

    showCharacterSheet() {
        const listView = document.getElementById('character-list-view');
        const sheetView = document.getElementById('character-sheet-view');
        if (listView) listView.classList.add('hidden');
        if (sheetView) sheetView.classList.remove('hidden');
    }

    // ========== CHARACTER LIST ==========
    renderCharacterList(characters) {
        const tbody = document.getElementById('characters-tbody');
        if (characters.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No characters yet. Create your first character!</td></tr>';
            return;
        }

        tbody.innerHTML = characters.map(char => `
            <tr class="flex flex-col lg:table-row">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-200 flex flex-wrap">
                        <span class="lg:hidden">Name: </span>${char.name}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        <span class="lg:hidden">Descriptor: </span>${char.descriptor || 'None'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        <span class="lg:hidden">Type: </span>${char.type || 'None'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        <span class="lg:hidden">Focus: </span>${char.focus || 'None'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="app.loadCharacter('${char.id}')" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                </td>
            </tr>
        `).join('');
    }

    // ========== CHARACTER FORM ==========
    loadCharacterToForm(character) {
        const fancySelects = {
            descriptorSelect: this.descriptorSelect,
            typeSelect: this.typeSelect,
            focusSelect: this.focusSelect,
            flavorSelect: this.flavorSelect
        };
        this.formManager.loadToForm(character, fancySelects);
    }

    clearForm() {
        this.formManager.clearForm();
        
        // Reset FancySelects to null
        if (this.descriptorSelect) this.descriptorSelect.setValue(null);
        if (this.typeSelect) this.typeSelect.setValue(null);
        if (this.focusSelect) this.focusSelect.setValue(null);
        if (this.flavorSelect) this.flavorSelect.setValue(null);
        if (this.abilitySelect) this.abilitySelect.setValue(null);
    }

    getCharacterDataFromForm() {
        return this.formManager.getDataFromForm();
    }

    // ========== SAVE BUTTON STATE ==========
    updateSaveButtonState(hasChanges) {
        const saveButton = document.querySelector('button[onclick="saveCharacter()"]');
        if (!saveButton) return;
        
        if (hasChanges) {
            saveButton.classList.remove('bg-green-600', 'hover:bg-green-700');
            saveButton.classList.add('bg-yellow-500', 'hover:bg-yellow-600', 'save-button-unsaved');
            saveButton.innerHTML = '⚠️ Save Changes';
        } else {
            saveButton.classList.remove('bg-yellow-500', 'hover:bg-yellow-600', 'save-button-unsaved');
            saveButton.classList.add('bg-green-600', 'hover:bg-green-700');
            saveButton.innerHTML = '💾 Save Character';
        }
    }

    // ========== DELEGATED METHODS TO FormRenderer ==========
    // These methods delegate to the static FormRenderer class
    renderAdvancements(characterAdvancements) {
        FormRenderer.renderAdvancements(characterAdvancements);
    }

    getCurrentSkills() {
        return FormRenderer.getCurrentSkills();
    }

    renderSkills(skills) {
        FormRenderer.renderSkills(skills);
    }

    getCurrentAbilities() {
        return FormRenderer.getCurrentAbilities();
    }

    renderAbilities(abilities) {
        FormRenderer.renderAbilities(abilities);
    }

    toggleAbilityDesc(index) {
        FormRenderer.toggleAbilityDesc(index);
    }

    getCurrentEquipment() {
        return FormRenderer.getCurrentEquipment();
    }

    renderEquipment(equipment) {
        FormRenderer.renderEquipment(equipment);
    }

    getCurrentAttacks() {
        return FormRenderer.getCurrentAttacks();
    }

    renderAttacks(attacks) {
        FormRenderer.renderAttacks(attacks);
    }

    getCurrentCyphers() {
        return FormRenderer.getCurrentCyphers();
    }

    renderCyphers(cyphers) {
        FormRenderer.renderCyphers(cyphers);
    }

    getCurrentPowerShifts() {
        return FormRenderer.getCurrentPowerShifts();
    }

    getAllPowerShifts() {
        return FormRenderer.getAllPowerShifts();
    }

    renderPowerShifts(powerShifts) {
        FormRenderer.renderPowerShifts(powerShifts);
    }

    getCurrentAdvancements() {
        return FormRenderer.getCurrentAdvancements();
    }

    // ========== UNSAVED INDICATOR ==========
    showUnsavedIndicator() {
        const indicator = document.getElementById('unsaved-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
        }
    }

    hideUnsavedIndicator() {
        const indicator = document.getElementById('unsaved-indicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    // ========== CHARACTER LOCK ==========
    updateLockState(isLocked) {
        const lockBtn = document.getElementById('lock-toggle-btn');
        const lockIcon = document.getElementById('lock-icon');
        const lockText = document.getElementById('lock-text');
        
        // Update button appearance
        if (lockBtn) {
            if (isLocked) {
                lockBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                lockBtn.classList.add('bg-orange-600', 'hover:bg-orange-700');
            } else {
                lockBtn.classList.remove('bg-orange-600', 'hover:bg-orange-700');
                lockBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }
        }
        
        if (lockIcon) {
            lockIcon.textContent = isLocked ? '🔒' : '🔓';
        }
        
        if (lockText) {
            lockText.textContent = isLocked ? 'Locked' : 'Unlocked';
        }
        
        // Lock/unlock character creation fields
        this._setFieldsLockState(isLocked);
    }

    _setFieldsLockState(isLocked) {
        // Fields that should be locked (character creation fields that don't change during play)
        const fieldsToLock = [
            'char-name',
            'char-descriptor',
            'char-type',
            'char-focus',
            'char-flavor',
            'char-tier',
            'char-effort',
            'might-pool',
            'might-edge',
            'speed-pool',
            'speed-edge',
            'intellect-pool',
            'intellect-edge'
        ];
        
        fieldsToLock.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.disabled = isLocked;
                if (isLocked) {
                    field.classList.add('bg-gray-200', 'cursor-not-allowed');
                } else {
                    field.classList.remove('bg-gray-200', 'cursor-not-allowed');
                }
            }
        });
        
        // Also disable FancySelects
        if (this.descriptorSelect) this.descriptorSelect.setDisabled(isLocked);
        if (this.typeSelect) this.typeSelect.setDisabled(isLocked);
        if (this.focusSelect) this.focusSelect.setDisabled(isLocked);
        if (this.flavorSelect) this.flavorSelect.setDisabled(isLocked);
        
        // Disable add buttons for skills, abilities, attacks
        const addButtons = [
            document.querySelector('button[onclick="addSkill()"]'),
            document.querySelector('button[onclick="addAbilityFromSelect()"]'),
            document.querySelector('button[onclick="addAttack()"]')
        ];
        
        addButtons.forEach(button => {
            if (button) {
                button.disabled = isLocked;
                if (isLocked) {
                    button.classList.add('opacity-50', 'cursor-not-allowed');
                } else {
                    button.classList.remove('opacity-50', 'cursor-not-allowed');
                }
            }
        });
        
        // Disable ability select dropdown
        const abilitySelectContainer = document.getElementById('ability-select');
        if (abilitySelectContainer) {
            const inputs = abilitySelectContainer.querySelectorAll('input, select, button');
            inputs.forEach(input => {
                input.disabled = isLocked;
            });
        }
        
        // Disable new attack input
        const newAttackInput = document.getElementById('new-attack');
        if (newAttackInput) {
            newAttackInput.disabled = isLocked;
            if (isLocked) {
                newAttackInput.classList.add('bg-gray-200', 'cursor-not-allowed');
            } else {
                newAttackInput.classList.remove('bg-gray-200', 'cursor-not-allowed');
            }
        }
        
        // Lock/unlock skills inputs and remove buttons
        const skillInputs = document.querySelectorAll('#skills-list input, #skills-list select, #skills-list button');
        skillInputs.forEach(input => {
            input.disabled = isLocked;
            if (isLocked && input.tagName !== 'BUTTON') {
                input.classList.add('bg-gray-200', 'cursor-not-allowed');
            } else if (!isLocked && input.tagName !== 'BUTTON') {
                input.classList.remove('bg-gray-200', 'cursor-not-allowed');
            }
            if (isLocked && input.tagName === 'BUTTON') {
                input.classList.add('opacity-50', 'cursor-not-allowed');
            } else if (!isLocked && input.tagName === 'BUTTON') {
                input.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
        
        // Lock/unlock abilities remove buttons
        const abilityButtons = document.querySelectorAll('#abilities-list button');
        abilityButtons.forEach(button => {
            button.disabled = isLocked;
            if (isLocked) {
                button.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                button.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
        
        // Lock/unlock attacks remove buttons
        const attackButtons = document.querySelectorAll('#attacks-list button');
        attackButtons.forEach(button => {
            button.disabled = isLocked;
            if (isLocked) {
                button.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                button.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
        
        // Lock/unlock power shifts inputs and buttons
        const powerShiftControls = document.querySelectorAll('#powershifts-list input, #powershifts-list button');
        powerShiftControls.forEach(control => {
            control.disabled = isLocked;
            if (isLocked && control.tagName !== 'BUTTON') {
                control.classList.add('bg-gray-200', 'cursor-not-allowed');
            } else if (!isLocked && control.tagName !== 'BUTTON') {
                control.classList.remove('bg-gray-200', 'cursor-not-allowed');
            }
            if (isLocked && control.tagName === 'BUTTON') {
                control.classList.add('opacity-50', 'cursor-not-allowed');
            } else if (!isLocked && control.tagName === 'BUTTON') {
                control.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
        
        // Lock/unlock advancements checkboxes
        const advancementCheckboxes = document.querySelectorAll('#advancements-list input[type="checkbox"]');
        advancementCheckboxes.forEach(checkbox => {
            checkbox.disabled = isLocked;
            const label = checkbox.closest('label');
            if (label) {
                if (isLocked) {
                    label.classList.add('opacity-60', 'cursor-not-allowed');
                    label.classList.remove('cursor-pointer', 'hover:bg-gray-50');
                } else {
                    label.classList.remove('opacity-60', 'cursor-not-allowed');
                    label.classList.add('cursor-pointer', 'hover:bg-gray-50');
                }
            }
        });
    }
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterView;
}
