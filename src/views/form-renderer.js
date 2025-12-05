// Form Renderer - Handles rendering and retrieving data for various form sections
class FormRenderer {
    // ========== SKILLS ==========
    static getCurrentSkills() {
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

    static renderSkills(skills) {
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
                <td><button onclick="app.removeSkill(${idx})" class="text-red-600 hover:text-red-800">×</button></td>
            </tr>
        `).join('');
    }

    // ========== ABILITIES ==========
    static getCurrentAbilities() {
        const items = document.querySelectorAll('#abilities-list .ability-item');
        if (!items || items.length === 0) return [];
        
        return Array.from(items).map(el => ({
            name: el.querySelector('.ability-name').textContent,
            description: el.querySelector('.ability-desc').textContent
        }));
    }

    static renderAbilities(abilities) {
        const container = document.getElementById('abilities-list');
        container.innerHTML = abilities.map((ability, idx) => `
            <div class="ability-item border border-gray-300 p-2 rounded">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <strong class="ability-name cursor-pointer hover:text-blue-600" onclick="app.toggleAbilityDesc(${idx})">${ability.name}</strong>
                        <p class="ability-desc text-xs text-gray-600 mt-1 hidden">${ability.description}</p>
                    </div>
                    <button onclick="app.removeAbility(${idx})" class="text-red-600 hover:text-red-800 ml-2">×</button>
                </div>
            </div>
        `).join('');
    }

    static toggleAbilityDesc(index) {
        const abilities = document.querySelectorAll('#abilities-list .ability-item');
        if (abilities[index]) {
            const desc = abilities[index].querySelector('.ability-desc');
            desc.classList.toggle('hidden');
        }
    }

    // ========== EQUIPMENT ==========
    static getCurrentEquipment() {
        return Array.from(document.querySelectorAll('#equipment-list .equipment-item'))
            .map(el => el.textContent.trim());
    }

    static renderEquipment(equipment) {
        const container = document.getElementById('equipment-list');
        container.innerHTML = equipment.map((item, idx) => `
            <div class="equipment-item flex justify-between items-center text-sm">
                <span>${item}</span>
                <button onclick="app.removeEquipment(${idx})" class="text-red-600 hover:text-red-800">×</button>
            </div>
        `).join('');
    }

    // ========== ATTACKS ==========
    static getCurrentAttacks() {
        return Array.from(document.querySelectorAll('#attacks-list .attack-item'))
            .map(el => el.textContent.trim());
    }

    static renderAttacks(attacks) {
        const container = document.getElementById('attacks-list');
        container.innerHTML = attacks.map((attack, idx) => `
            <div class="attack-item flex justify-between items-center text-sm">
                <span>${attack}</span>
                <button onclick="app.removeAttack(${idx})" class="text-red-600 hover:text-red-800">×</button>
            </div>
        `).join('');
    }

    // ========== CYPHERS ==========
    static getCurrentCyphers() {
        return Array.from(document.querySelectorAll('#cyphers-list .cypher-item'))
            .map(el => {
                const levelText = el.querySelector('.cypher-level').textContent;
                // Remove the "(Lvl " prefix and ")" suffix to get just the level value
                const level = levelText.replace(/^\(Lvl\s*/, '').replace(/\)$/, '');
                return {
                    name: el.querySelector('.cypher-name').textContent,
                    level: level,
                    description: el.querySelector('.cypher-desc').textContent
                };
            });
    }

    static renderCyphers(cyphers) {
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

    // ========== POWER SHIFTS ==========
    static getCurrentPowerShifts() {
        const container = document.getElementById('powershifts-list');
        const labels = container.querySelectorAll('label');
        
        const powerShifts = [];
        
        labels.forEach(label => {
            const valueInput = label.querySelector('.ps-value');
            if (!valueInput) return;
            
            const value = parseInt(valueInput.value) || 0;
            if (value === 0) return; // Skip power shifts with 0 value
            
            const psName = valueInput.dataset.psName;
            const powerShift = { name: psName, value: value };
            
            // Check for healing checkboxes
            const heartCheckboxes = label.querySelectorAll(`input[data-ps-heart="${psName}"]`);
            if (heartCheckboxes.length > 0) {
                let heartsUsed = 0;
                heartCheckboxes.forEach(cb => {
                    if (cb.checked) heartsUsed++;
                });
                if (heartsUsed > 0) {
                    powerShift.hearts_used = heartsUsed;
                }
            }
            
            // Check for additional text
            const textInput = label.querySelector(`input[data-ps-text="${psName}"]`);
            if (textInput && textInput.value.trim()) {
                powerShift.additional_text = textInput.value.trim();
            }
            
            powerShifts.push(powerShift);
        });
        
        return powerShifts;
    }

    static renderPowerShifts(characterPowerShifts) {
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

    // ========== ADVANCEMENTS ==========
    static getCurrentAdvancements() {
        const checkboxes = document.querySelectorAll('#advancements-list input[type="checkbox"][data-advancement]');
        const advancements = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                advancements.push(checkbox.dataset.advancement);
            }
        });
        
        return advancements;
    }

    static renderAdvancements(characterAdvancements = []) {
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
}
