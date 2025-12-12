// Power Shifts Renderer - Handles rendering and retrieving data for power shifts
class PowerShiftsRenderer {
    static getCurrentPowerShifts() {
        return this.getAllPowerShifts(true); // Filter out zero values
    }

    static getAllPowerShifts(filterZeroValues = false) {
        const container = document.getElementById('powershifts-list');
        const labels = container.querySelectorAll('label');
        
        const powerShifts = [];
        
        labels.forEach(label => {
            const valueInput = label.querySelector('.ps-value');
            if (!valueInput) return;
            
            const value = parseInt(valueInput.value) || 0;
            const psName = valueInput.dataset.psName;
            const psId = valueInput.dataset.psId || '0'; // Unique ID for multiple instances
            
            const powerShift = { 
                name: psName, 
                value: value,
                hearts_used: 0,
                additional_text: '',
                id: psId
            };
            
            // Check for healing checkboxes
            const heartCheckboxes = label.querySelectorAll(`input[data-ps-heart="${psName}"]`);
            if (heartCheckboxes.length > 0) {
                let heartsUsed = 0;
                heartCheckboxes.forEach(cb => {
                    if (cb.checked) heartsUsed++;
                });
                powerShift.hearts_used = heartsUsed;
            }
            
            // Check for additional text
            const textInput = label.querySelector(`input[data-ps-text="${psName}-${psId}"]`);
            if (textInput && textInput.value.trim()) {
                powerShift.additional_text = textInput.value.trim();
            }
            
            // Filter logic: skip power shifts with 0 value UNLESS they have additional text
            if (filterZeroValues && value === 0 && !powerShift.additional_text) {
                return; // Skip power shifts with 0 value and no additional text
            }
            
            powerShifts.push(powerShift);
        });
        
        return powerShifts;
    }

    static async renderPowerShifts(characterPowerShifts) {
        const container = document.getElementById('powershifts-list');
        
        if (!container) {
            console.warn('Power shifts container not found');
            return;
        }
        
        if (!cypherData || !cypherData.powerShifts || cypherData.powerShifts.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-600">Loading power shifts...</p>';
            return;
        }
        
        const charPSArray = Array.isArray(characterPowerShifts) ? characterPowerShifts : [];
        const template = await templateLoader.loadTemplate('power-shift-item');
        
        let html = '';
        
        cypherData.powerShifts.forEach(ps => {
            // For power shifts that allow additional text, find all instances
            if (ps.allows_additional_text) {
                const instances = charPSArray.filter(cps => cps.name === ps.name);
                
                // Show at least one entry, or all saved instances
                const entriesToShow = instances.length > 0 ? instances : [{ name: ps.name, value: 0, additional_text: '', id: '0' }];
                const hasMultipleInstances = entriesToShow.length > 1;
                
                entriesToShow.forEach((existing, index) => {
                    const psId = existing.id || index.toString();
                    const isLast = index === entriesToShow.length - 1;
                    const canRemove = hasMultipleInstances;
                    html += this.renderSinglePowerShift(template, ps, existing.value, existing.additional_text || '', 0, psId, canRemove, isLast);
                });
            } else {
                // Single instance power shifts
                const existing = charPSArray.find(cps => cps.name === ps.name);
                const value = existing ? existing.value : 0;
                const additionalText = existing ? (existing.additional_text || '') : '';
                const heartsUsed = existing ? (existing.hearts_used || 0) : 0;
                html += this.renderSinglePowerShift(template, ps, value, additionalText, heartsUsed, '0', false, false);
            }
        });
        
        container.innerHTML = html;
    }
    
    static renderSinglePowerShift(template, ps, value, additionalText, heartsUsed, psId, canRemove, isLast) {
        const data = {
            name: ps.name,
            description: ps.description || '',
            value: value,
            psId: psId,
            additionalText: additionalText,
            hasHealingCheckboxes: ps.has_healing_checkboxes,
            allowsAdditionalText: ps.allows_additional_text,
            canRemove: canRemove,
            isLast: isLast,
            isPerRound: ps.is_per_round
        };

        // Build healing checkboxes array if needed
        if (ps.has_healing_checkboxes) {
            data.healingCheckboxes = [];
            for (let i = 1; i <= 5; i++) {
                data.healingCheckboxes.push({
                    checked: i <= heartsUsed,
                    psName: ps.name,
                    num: i
                });
            }
        }

        return templateLoader.render(template, data);
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.PowerShiftsRenderer = PowerShiftsRenderer;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PowerShiftsRenderer;
}
