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
            const powerShift = { 
                name: psName, 
                value: value,
                hearts_used: 0,
                additional_text: ''
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
        
        if (!container) {
            console.warn('Power shifts container not found');
            return;
        }
        
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
}

// Make available globally
if (typeof global !== 'undefined') {
    global.PowerShiftsRenderer = PowerShiftsRenderer;
}
