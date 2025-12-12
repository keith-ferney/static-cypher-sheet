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

    static renderAbilities(abilities) {
        const container = document.getElementById('abilities-list');
        if (!container) {
            console.warn('Abilities container not found');
            return;
        }
        container.innerHTML = abilities.map((ability, idx) => `
            <div class="ability-item border border-gray-300 p-2 rounded" data-edit-mode="false">
                <div class="flex justify-between items-start gap-2">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <svg class="ability-chevron w-4 h-4 transition-transform cursor-pointer flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" onclick="app.toggleAbilityDesc(${idx})">
                                <path d="M10 12.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414L10 12.586z"/>
                            </svg>
                            <span class="ability-name-display flex-1 font-semibold text-sm">${this.escapeHtml(ability.name || '')}</span>
                            <input 
                                type="text" 
                                value="${this.escapeHtml(ability.name || '')}" 
                                placeholder="Ability name"
                                class="ability-name-input hidden flex-1 font-semibold px-1 py-0.5 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none"
                                onclick="event.stopPropagation()"
                                onchange="app.checkForChanges()"
                            />
                        </div>
                        <p class="ability-desc-display text-xs text-gray-600 mt-1 ml-6 hidden whitespace-pre-wrap">${this.escapeHtml(ability.description || '')}</p>
                        <textarea 
                            class="ability-desc-input w-full text-xs text-gray-600 mt-1 ml-6 px-1 py-0.5 border border-gray-300 rounded hidden resize-y min-h-[60px] focus:border-blue-500 focus:outline-none"
                            placeholder="Ability description"
                            onclick="event.stopPropagation()"
                            onchange="app.checkForChanges()"
                        >${this.escapeHtml(ability.description || '')}</textarea>
                    </div>
                    <div class="flex gap-1 flex-shrink-0">
                        <button onclick="AbilitiesRenderer.toggleEditMode(${idx}); event.stopPropagation();" class="ability-edit-btn text-blue-600 hover:text-blue-800 text-sm px-1" title="Edit ability">✎</button>
                        <button onclick="app.removeAbility(${idx}); event.stopPropagation();" class="text-red-600 hover:text-red-800 text-lg leading-none">×</button>
                    </div>
                </div>
            </div>
        `).join('');
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
