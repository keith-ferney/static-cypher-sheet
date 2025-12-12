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

    static async renderAdvancements(characterAdvancements = []) {
        const container = document.getElementById('advancements-list');
        if (!container) {
            console.warn('Advancements container not found');
            return;
        }
        if (!cypherData || !cypherData.advancements) {
            return;
        }
        
        const template = await templateLoader.loadTemplate('advancement-item');
        
        const advancementsHtml = cypherData.advancements.map(advancement => {
            const isChecked = characterAdvancements.includes(advancement.name);
            return templateLoader.render(template, {
                name: advancement.name,
                description: advancement.description,
                isChecked: isChecked
            });
        }).join('');
        
        // Add "Other" option
        const otherHtml = templateLoader.render(template, {
            name: 'Other',
            description: 'As specified in the rule book or something',
            isChecked: characterAdvancements.includes('Other')
        });
        
        container.innerHTML = advancementsHtml + otherHtml;
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.AdvancementsRenderer = AdvancementsRenderer;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancementsRenderer;
}
