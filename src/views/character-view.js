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
}
