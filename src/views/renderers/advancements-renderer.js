// Advancements Renderer - Handles rendering and retrieving data for character advancements
class AdvancementsRenderer {
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
        if (!container) {
            console.warn('Advancements container not found');
            return;
        }
        if (!cypherData || !cypherData.advancements) {
            return;
        }
        
        container.innerHTML = cypherData.advancements.map(advancement => {
            const isChecked = characterAdvancements.includes(advancement.name);
            return `
                <label class="advancement-item flex items-start gap-2 p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors ${isChecked ? 'bg-blue-50 border-blue-300' : ''}">
                    <input type="checkbox" data-advancement="${advancement.name}" ${isChecked ? 'checked' : ''} class="mt-0.5 flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <span class="text-sm font-semibold block">${advancement.name}</span>
                        <small class="text-xs text-gray-600 block">${advancement.description}</small>
                    </div>
                </label>
            `;
        }).join('') + `
            <label class="advancement-item flex items-start gap-2 p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors ${characterAdvancements.includes('Other') ? 'bg-blue-50 border-blue-300' : ''}">
                <input type="checkbox" data-advancement="Other" ${characterAdvancements.includes('Other') ? 'checked' : ''} class="mt-0.5 flex-shrink-0">
                <div class="flex-1 min-w-0">
                    <span class="text-sm font-semibold block">Other</span>
                    <small class="text-xs text-gray-600 block">As specified in the rule book or something</small>
                </div>
            </label>
        `;
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.AdvancementsRenderer = AdvancementsRenderer;
}
