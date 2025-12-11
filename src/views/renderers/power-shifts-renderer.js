// Power Shifts Renderer - Handles rendering and retrieving data for power shifts
class PowerShiftsRenderer {
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
            
            powerShifts.push(powerShift);
        });
        
        return powerShifts;
    }

    static renderPowerShifts(characterPowerShifts) {
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
                    html += this.renderSinglePowerShift(ps, existing.value, existing.additional_text || '', 0, psId, canRemove, isLast);
                });
            } else {
                // Single instance power shifts
                const existing = charPSArray.find(cps => cps.name === ps.name);
                const value = existing ? existing.value : 0;
                const additionalText = existing ? (existing.additional_text || '') : '';
                const heartsUsed = existing ? (existing.hearts_used || 0) : 0;
                html += this.renderSinglePowerShift(ps, value, additionalText, heartsUsed, '0', false, false);
            }
        });
        
        container.innerHTML = html;
    }
    
    static renderSinglePowerShift(ps, value, additionalText, heartsUsed, psId, canRemove, isLast) {
        let html = `
            <label class="text-black flex flex-row gap-1 items-center text-center w-fit px-2 py-1">
                <input 
                    type="number" 
                    value="${value}" 
                    min="0" 
                    max="5"
                    class="w-5 p-0 text-xs ps-value" 
                    data-ps-name="${ps.name}"
                    data-ps-id="${psId}"
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
                    placeholder="ability name"
                    class="w-32 p-0 px-1 text-xs ps-text border border-gray-300 rounded" 
                    data-ps-text="${ps.name}-${psId}"
                />
            `;
            
            if (canRemove) {
                html += `
                    <button onclick="removePowerShiftInstance('${ps.name}', '${psId}')" class="text-red-600 hover:text-red-800 text-sm">×</button>
                `;
            }
            
            // Add the + button on the same line as the last item
            if (isLast) {
                html += `
                    <button onclick="addPowerShiftInstance('${ps.name}')" class="text-green-600 hover:text-green-800 text-lg font-bold px-1" title="Add another ${ps.name}">
                        +
                    </button>
                `;
            }
        }
        
        if (ps.is_per_round) {
            html += '<span class="text-xs">Per Round</span>';
        }
        
        html += '</label>';
        return html;
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
