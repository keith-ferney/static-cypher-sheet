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
}

// Make available globally
if (typeof global !== 'undefined') {
    global.AbilitiesRenderer = AbilitiesRenderer;
}
