// Cyphers Renderer - Handles rendering and retrieving data for cyphers
class CyphersRenderer {
    static getCurrentCyphers() {
        return Array.from(document.querySelectorAll('#cyphers-list .cypher-item'))
            .map(el => {
                const levelText = el.querySelector('.cypher-level').textContent;
                // Remove the "(Lvl " prefix and ")" suffix to get just the level value
                const level = levelText.replace(/^\(Lvl\s*/, '').replace(/\)$/, '');
                return {
                    name: el.querySelector('.cypher-name').textContent,
                    level: level,
                    description: el.querySelector('.cypher-desc').textContent
                };
            });
    }

    static renderCyphers(cyphers) {
        const container = document.getElementById('cyphers-list');
        if (!container) {
            console.warn('Cyphers container not found');
            return;
        }
        container.innerHTML = cyphers.map((cypher, idx) => `
            <div class="cypher-item border border-gray-300 p-2 rounded">
                <div class="flex justify-between items-start">
                    <div>
                        <strong class="cypher-name">${cypher.name}</strong>
                        <span class="cypher-level text-gray-600 text-xs ml-2">(Lvl ${cypher.level})</span>
                        <p class="cypher-desc text-xs text-gray-600">${cypher.description}</p>
                    </div>
                    <button onclick="app.removeCypher(${idx})" class="text-red-600 hover:text-red-800">×</button>
                </div>
            </div>
        `).join('');
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.CyphersRenderer = CyphersRenderer;
}
