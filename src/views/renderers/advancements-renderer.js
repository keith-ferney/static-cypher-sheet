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

// Make available globally
if (typeof global !== 'undefined') {
    global.AdvancementsRenderer = AdvancementsRenderer;
}
