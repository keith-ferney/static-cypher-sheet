// Abilities Renderer - Handles rendering and retrieving data for abilities
class AbilitiesRenderer {
    // Helper to escape HTML in attribute values
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static getCurrentAbilities() {
        const items = document.querySelectorAll('#abilities-list .ability-item');
        if (!items || items.length === 0) return [];
        
        return Array.from(items)
            .map(el => {
                const isEditMode = el.getAttribute('data-edit-mode') === 'true';
                let name, description;
                
                if (isEditMode) {
                    // In edit mode, read from inputs
                    name = el.querySelector('.ability-name-input').value.trim();
                    description = el.querySelector('.ability-desc-input').value.trim();
                } else {
                    // In view mode, read from display elements
                    name = el.querySelector('.ability-name-display').textContent.trim();
                    description = el.querySelector('.ability-desc-display').textContent.trim();
                }
                
                return { name, description };
            })
            .filter(ability => ability.name && ability.name.trim() !== '');
    }

    static async renderAbilities(abilities) {
        const container = document.getElementById('abilities-list');
        if (!container) {
            console.warn('Abilities container not found');
            return;
        }
        
        const template = await templateLoader.loadTemplate('ability-item');
        container.innerHTML = abilities.map((ability, idx) => {
            return templateLoader.render(template, {
                name: ability.name || '',
                description: ability.description || '',
                index: idx
            });
        }).join('');
    }

    static toggleEditMode(index) {
        const items = document.querySelectorAll('#abilities-list .ability-item');
        if (!items[index]) return;

        const item = items[index];
        const isEditMode = item.getAttribute('data-edit-mode') === 'true';
        const nameDisplay = item.querySelector('.ability-name-display');
        const nameInput = item.querySelector('.ability-name-input');
        const descDisplay = item.querySelector('.ability-desc-display');
        const descInput = item.querySelector('.ability-desc-input');
        const editBtn = item.querySelector('.ability-edit-btn');

        if (isEditMode) {
            // Switch to view mode - save changes to display
            nameDisplay.textContent = nameInput.value;
            descDisplay.textContent = descInput.value;
            
            nameDisplay.classList.remove('hidden');
            nameInput.classList.add('hidden');
            descDisplay.classList.remove('hidden');
            descInput.classList.add('hidden');
            
            editBtn.textContent = '✎';
            editBtn.title = 'Edit ability';
            item.setAttribute('data-edit-mode', 'false');
            
            // Trigger change detection
            if (window.app) {
                app.checkForChanges();
            }
        } else {
            // Switch to edit mode
            nameInput.value = nameDisplay.textContent;
            descInput.value = descDisplay.textContent;
            
            nameDisplay.classList.add('hidden');
            nameInput.classList.remove('hidden');
            descDisplay.classList.add('hidden');
            descInput.classList.remove('hidden');
            
            editBtn.textContent = '✓';
            editBtn.title = 'Save changes';
            item.setAttribute('data-edit-mode', 'true');
            
            // Focus the name input
            nameInput.focus();
        }
    }

    static toggleAbilityDesc(index) {
        const abilities = document.querySelectorAll('#abilities-list .ability-item');
        if (abilities[index]) {
            const item = abilities[index];
            const isEditMode = item.getAttribute('data-edit-mode') === 'true';
            const descDisplay = item.querySelector('.ability-desc-display');
            const descInput = item.querySelector('.ability-desc-input');
            const chevron = item.querySelector('.ability-chevron');
            
            if (isEditMode) {
                // In edit mode, toggle the textarea
                descInput.classList.toggle('hidden');
            } else {
                // In view mode, toggle the display paragraph
                descDisplay.classList.toggle('hidden');
            }
            
            if (chevron) {
                chevron.classList.toggle('rotate-180');
            }
        }
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.AbilitiesRenderer = AbilitiesRenderer;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AbilitiesRenderer;
}
