// Character Sheet View - Handles all DOM rendering and UI updates
class CharacterView {
    constructor() {
        // FancySelect instances
        this.descriptorSelect = null;
        this.typeSelect = null;
        this.focusSelect = null;
        this.flavorSelect = null;
        this.abilitySelect = null;
    }

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

    renderAdvancements(characterAdvancements = []) {
        const container = document.getElementById('advancements-list');
        if (!cypherData || !cypherData.advancements) {
            return;
        }
        
        container.innerHTML = cypherData.advancements.map(advancement => {
            const isChecked = characterAdvancements.includes(advancement.name);
            return `
                <label class="text-black flex flex-col lg:items-center lg:text-center w-fit px-2">
                    <input type="checkbox" data-advancement="${advancement.name}" ${isChecked ? 'checked' : ''}>
                    <span class="text-sm">${advancement.name}</span>
                    <small class="text-xs">${advancement.description}</small>
                </label>
            `;
        }).join('') + `
            <label class="text-black flex flex-col lg:items-center lg:text-center w-fit px-2">
                <input type="checkbox" data-advancement="Other" ${characterAdvancements.includes('Other') ? 'checked' : ''}>
                <span class="text-sm">Other</span>
                <small class="text-xs">As specified in the rule book or something</small>
            </label>
        `;
    }

    showCharacterList() {
        document.getElementById('character-list-view').classList.remove('hidden');
        document.getElementById('character-sheet-view').classList.add('hidden');
    }

    showCharacterSheet() {
        document.getElementById('character-list-view').classList.add('hidden');
        document.getElementById('character-sheet-view').classList.remove('hidden');
    }

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

    loadCharacterToForm(character) {
        document.getElementById('char-name').value = character.name || '';
        document.getElementById('char-tier').value = character.tier || 1;
        document.getElementById('char-descriptor').value = character.descriptor || '';
        document.getElementById('char-type').value = character.type || '';
        document.getElementById('char-focus').value = character.focus || '';
        document.getElementById('char-flavor').value = character.flavor || '';
        
        // Update FancySelect dropdowns - use name as the value since valueKey is 'name'
        if (this.descriptorSelect && character.descriptor) {
            this.descriptorSelect.setValue(character.descriptor);
        }
        if (this.typeSelect && character.type) {
            this.typeSelect.setValue(character.type);
        }
        if (this.focusSelect && character.focus) {
            this.focusSelect.setValue(character.focus);
        }
        if (this.flavorSelect && character.flavor) {
            this.flavorSelect.setValue(character.flavor);
        }
        
        document.getElementById('char-background').value = character.background || '';
        document.getElementById('char-notes').value = character.notes || '';
        document.getElementById('char-portrait').value = character.portrait || '';
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
        document.getElementById('recovery-modifier').value = character.recoveryModifier || 0;
        document.getElementById('impaired').checked = character.impaired || false;
        document.getElementById('debilitated').checked = character.debilitated || false;
        document.getElementById('recovery-action').checked = character.recoveryAction || false;
        document.getElementById('recovery-10min').checked = character.recovery10min || false;
        document.getElementById('recovery-1hour').checked = character.recovery1hour || false;
        document.getElementById('recovery-10hour').checked = character.recovery10hour || false;

        this.renderSkills(character.skills || []);
        this.renderAbilities(character.abilities || []);
        this.renderEquipment(character.equipment || []);
        this.renderAttacks(character.attacks || []);
        this.renderCyphers(character.cyphers || []);
        this.renderPowerShifts(character.powerShifts || []);
        this.renderAdvancements(character.advancements || []);
    }

    clearForm() {
        document.getElementById('char-name').value = '';
        document.getElementById('char-tier').value = 1;
        document.getElementById('char-descriptor').value = '';
        document.getElementById('char-type').value = '';
        document.getElementById('char-focus').value = '';
        document.getElementById('char-flavor').value = '';
        
        // Reset FancySelect dropdowns
        if (this.descriptorSelect) this.descriptorSelect.setValue(null);
        if (this.typeSelect) this.typeSelect.setValue(null);
        if (this.focusSelect) this.focusSelect.setValue(null);
        if (this.flavorSelect) this.flavorSelect.setValue(null);
        
        document.getElementById('char-background').value = '';
        document.getElementById('char-notes').value = '';
        document.getElementById('char-portrait').value = '';
        document.getElementById('might-pool').value = 10;
        document.getElementById('might-edge').value = 0;
        document.getElementById('might-current').value = 10;
        document.getElementById('speed-pool').value = 10;
        document.getElementById('speed-edge').value = 0;
        document.getElementById('speed-current').value = 10;
        document.getElementById('intellect-pool').value = 10;
        document.getElementById('intellect-edge').value = 0;
        document.getElementById('intellect-current').value = 10;
        document.getElementById('char-effort').value = 1;
        document.getElementById('char-experience').value = 0;
        document.getElementById('recovery-modifier').value = 0;
        document.getElementById('impaired').checked = false;
        document.getElementById('debilitated').checked = false;
        document.getElementById('recovery-action').checked = false;
        document.getElementById('recovery-10min').checked = false;
        document.getElementById('recovery-1hour').checked = false;
        document.getElementById('recovery-10hour').checked = false;
        this.renderSkills([]);
        this.renderAbilities([]);
        this.renderEquipment([]);
        this.renderAttacks([]);
        this.renderCyphers([]);
        this.renderPowerShifts([]);
        this.renderAdvancements([]);
    }

    getCharacterDataFromForm() {
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
            skills: this.getCurrentSkills(),
            abilities: this.getCurrentAbilities(),
            equipment: this.getCurrentEquipment(),
            attacks: this.getCurrentAttacks(),
            cyphers: this.getCurrentCyphers(),
            powerShifts: this.getCurrentPowerShifts(),
            advancements: this.getCurrentAdvancements()
        };
    }

    // Skills Management
    getCurrentSkills() {
        const rows = document.querySelectorAll('#skills-list .skill-row');
        if (!rows || rows.length === 0) return [];
        
        return Array.from(rows)
            .map(el => {
                const nameInput = el.querySelector('.skill-name');
                const poolSelect = el.querySelector('.skill-pool');
                const typeSelect = el.querySelector('.skill-type');
                const psInput = el.querySelector('.skill-ps');
                
                return {
                    name: nameInput ? nameInput.value : '',
                    pool: poolSelect ? poolSelect.value : '',
                    type: typeSelect ? typeSelect.value : '',
                    powerShift: psInput ? (parseInt(psInput.value) || 0) : 0
                };
            })
            .filter(skill => skill.name.trim() !== '');
    }

    renderSkills(skills) {
        const container = document.getElementById('skills-list');
        
        if (!skills || skills.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        const normalizedSkills = skills.map(skill => {
            if (typeof skill === 'string') {
                return { name: skill, pool: '', type: '', powerShift: 0 };
            }
            return skill;
        });
        
        container.innerHTML = normalizedSkills.map((skill, idx) => `
            <tr class="skill-row">
                <td><input type="text" value="${skill.name || ''}" class="skill-name w-full" placeholder="Skill name"></td>
                <td>
                    <select class="skill-pool w-full">
                        <option value="" ${!skill.pool ? 'selected' : ''}>-</option>
                        <option value="might" ${skill.pool === 'might' ? 'selected' : ''}>M</option>
                        <option value="speed" ${skill.pool === 'speed' ? 'selected' : ''}>S</option>
                        <option value="intellect" ${skill.pool === 'intellect' ? 'selected' : ''}>I</option>
                    </select>
                </td>
                <td><input type="number" value="${skill.powerShift || 0}" class="skill-ps w-full text-center" min="0"></td>
                <td>
                    <select class="skill-type w-full">
                        <option value="" ${!skill.type ? 'selected' : ''}>-</option>
                        <option value="trained" ${skill.type === 'trained' ? 'selected' : ''}>Trained</option>
                        <option value="specialized" ${skill.type === 'specialized' ? 'selected' : ''}>Specialized</option>
                        <option value="inability" ${skill.type === 'inability' ? 'selected' : ''}>Inability</option>
                    </select>
                </td>
                <td><button onclick="app.removeSkill(${idx})" class="w-full bg-red-600 hover:bg-red-700 text-white text-xs px-1 py-1 rounded">×</button></td>
            </tr>
        `).join('');
    }

    // Abilities Management
    getCurrentAbilities() {
        const items = document.querySelectorAll('#abilities-list .ability-item');
        if (!items || items.length === 0) return [];
        
        return Array.from(items)
            .map(el => {
                const nameInput = el.querySelector('.ability-name');
                const descTextarea = el.querySelector('.ability-desc');
                
                return {
                    name: nameInput ? nameInput.value : '',
                    description: descTextarea ? descTextarea.value : ''
                };
            })
            .filter(ability => ability.name.trim() !== '');
    }

    renderAbilities(abilities) {
        const container = document.getElementById('abilities-list');
        
        if (!abilities || abilities.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = abilities.map((ability, idx) => `
            <div class="ability-item border border-gray-300 p-2 rounded mb-2">
                <div class="flex gap-2 items-center mb-1">
                    <input type="text" value="${ability.name || ''}" class="ability-name flex-1 px-2 py-1 border border-gray-300 rounded" placeholder="Ability name">
                    <button onclick="app.toggleAbilityDesc(${idx})" class="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs">▼</button>
                    <button onclick="app.removeAbility(${idx})" class="px-2 py-1 bg-red-600 hover:bg-red-800 text-white rounded text-xs">×</button>
                </div>
                <textarea class="ability-desc w-full px-2 py-1 border border-gray-300 rounded text-xs hidden" rows="3" placeholder="Description">${ability.description || ''}</textarea>
            </div>
        `).join('');
    }

    toggleAbilityDesc(index) {
        const items = document.querySelectorAll('#abilities-list .ability-item');
        if (items[index]) {
            const textarea = items[index].querySelector('.ability-desc');
            textarea.classList.toggle('hidden');
        }
    }

    // Equipment Management
    getCurrentEquipment() {
        return Array.from(document.querySelectorAll('#equipment-list .equipment-item'))
            .map(el => el.textContent.replace('×', '').trim());
    }

    renderEquipment(equipment) {
        const container = document.getElementById('equipment-list');
        container.innerHTML = equipment.map((item, idx) => `
            <div class="equipment-item flex justify-between items-center text-sm">
                <span>${item}</span>
                <button onclick="app.removeEquipment(${idx})" class="text-red-600 hover:text-red-800">×</button>
            </div>
        `).join('');
    }

    // Attacks Management
    getCurrentAttacks() {
        return Array.from(document.querySelectorAll('#attacks-list .attack-item'))
            .map(el => el.textContent.replace('×', '').trim());
    }

    renderAttacks(attacks) {
        const container = document.getElementById('attacks-list');
        container.innerHTML = attacks.map((attack, idx) => `
            <div class="attack-item flex justify-between items-center text-sm">
                <span>${attack}</span>
                <button onclick="app.removeAttack(${idx})" class="text-red-600 hover:text-red-800">×</button>
            </div>
        `).join('');
    }

    // Cyphers Management
    getCurrentCyphers() {
        return Array.from(document.querySelectorAll('#cyphers-list .cypher-item'))
            .map(el => ({
                name: el.querySelector('.cypher-name').textContent,
                level: el.querySelector('.cypher-level').textContent,
                description: el.querySelector('.cypher-desc').textContent
            }));
    }

    renderCyphers(cyphers) {
        const container = document.getElementById('cyphers-list');
        container.innerHTML = cyphers.map((cypher, idx) => `
            <div class="cypher-item border border-gray-300 p-2 rounded">
                <div class="flex justify-between items-start">
                    <div>
                        <strong class="cypher-name">${cypher.name}</strong>
                        <span class="cypher-level text-gray-600 text-xs ml-2">(Lvl ${cypher.level})</span>
                        <p class="cypher-desc text-xs text-gray-600">${cypher.description}</p>
                    </div>
                    <button onclick="app.removeCypher(${idx})" class="text-red-600 hover:text-red-800">×</button>
                </div>
            </div>
        `).join('');
    }

    // Power Shifts Management
    getCurrentPowerShifts() {
        const container = document.getElementById('powershifts-list');
        const labels = container.querySelectorAll('label');
        
        const powerShifts = [];
        
        labels.forEach(label => {
            const valueInput = label.querySelector('.ps-value');
            if (!valueInput) return;
            
            const name = valueInput.dataset.psName;
            const value = parseInt(valueInput.value) || 0;
            
            const textInput = label.querySelector(`[data-ps-text="${name}"]`);
            const additional_text = textInput ? textInput.value : '';
            
            const heartCheckboxes = label.querySelectorAll(`[data-ps-heart="${name}"]`);
            const hearts_used = Array.from(heartCheckboxes).filter(cb => cb.checked).length;
            
            if (value > 0 || additional_text || hearts_used > 0) {
                powerShifts.push({
                    name,
                    value,
                    additional_text,
                    hearts_used
                });
            }
        });
        
        return powerShifts;
    }

    renderPowerShifts(characterPowerShifts) {
        const container = document.getElementById('powershifts-list');
        
        if (!cypherData || !cypherData.powerShifts || cypherData.powerShifts.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-600">Loading power shifts...</p>';
            return;
        }
        
        const charPSArray = Array.isArray(characterPowerShifts) ? characterPowerShifts : [];
        
        container.innerHTML = cypherData.powerShifts.map(ps => {
            const existing = charPSArray.find(cps => cps.name === ps.name);
            const value = existing ? existing.value : 0;
            const additionalText = existing ? (existing.additional_text || '') : '';
            const heartsUsed = existing ? (existing.hearts_used || 0) : 0;
            
            let html = `
                <label class="text-black flex flex-row gap-1 items-center text-center w-fit px-2 py-1">
                    <input 
                        type="number" 
                        value="${value}" 
                        min="0" 
                        max="5"
                        class="w-5 p-0 text-xs ps-value" 
                        data-ps-name="${ps.name}"
                    />
                    <span class="text-sm" title="${ps.description || ''}">${ps.name}</span>
            `;
            
            if (ps.has_healing_checkboxes) {
                html += '<div class="flex gap-1">';
                for (let i = 1; i <= 5; i++) {
                    html += `
                        <input 
                            type="checkbox" 
                            ${i <= heartsUsed ? 'checked' : ''}
                            data-ps-heart="${ps.name}"
                            data-heart-num="${i}"
                        />
                    `;
                }
                html += '</div>';
            }
            
            if (ps.allows_additional_text) {
                html += `
                    <input 
                        type="text" 
                        value="${additionalText}"
                        class="w-32 p-0 text-xs ps-text" 
                        data-ps-text="${ps.name}"
                    />
                `;
            }
            
            if (ps.is_per_round) {
                html += '<span class="text-xs">Per Round</span>';
            }
            
            html += '</label>';
            return html;
        }).join('');
    }

    getCurrentAdvancements() {
        const checkboxes = document.querySelectorAll('#advancements-list input[type="checkbox"][data-advancement]');
        const advancements = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                advancements.push(checkbox.dataset.advancement);
            }
        });
        
        return advancements;
    }

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
}
