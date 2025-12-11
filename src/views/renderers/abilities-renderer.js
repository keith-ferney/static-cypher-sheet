// Abilities Renderer - Handles rendering and retrieving data for abilities
class AbilitiesRenderer {
    static getCurrentAbilities() {
        const items = document.querySelectorAll('#abilities-list .ability-item');
        if (!items || items.length === 0) return [];
        
        return Array.from(items)
            .map(el => ({
                name: el.querySelector('.ability-name').textContent,
                description: el.querySelector('.ability-desc').textContent
            }))
            .filter(ability => ability.name && ability.name.trim() !== '');
    }

    static renderAbilities(abilities) {
        const container = document.getElementById('abilities-list');
        if (!container) {
            console.warn('Abilities container not found');
            return;
        }
        container.innerHTML = abilities.map((ability, idx) => `
            <div class="ability-item border border-gray-300 p-2 rounded cursor-pointer" onclick="app.toggleAbilityDesc(${idx})">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <svg class="ability-chevron w-4 h-4 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414L10 12.586z"/>
                            </svg>
                            <strong class="ability-name hover:text-blue-600">${ability.name}</strong>
                        </div>
                        <p class="ability-desc text-xs text-gray-600 mt-1 ml-6 hidden">${ability.description}</p>
                    </div>
                    <button onclick="app.removeAbility(${idx}); event.stopPropagation();" class="text-red-600 hover:text-red-800 ml-2">×</button>
                </div>
            </div>
        `).join('');
    }

    static toggleAbilityDesc(index) {
        const abilities = document.querySelectorAll('#abilities-list .ability-item');
        if (abilities[index]) {
            const desc = abilities[index].querySelector('.ability-desc');
            const chevron = abilities[index].querySelector('.ability-chevron');
            desc.classList.toggle('hidden');
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
