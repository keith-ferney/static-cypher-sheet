// Cyphers Renderer - Handles rendering and retrieving data for cyphers
class CyphersRenderer {
    static getCurrentCyphers() {
        return Array.from(document.querySelectorAll('#cyphers-list .cypher-item'))
            .map(el => {
                const nameEl = el.querySelector('.cypher-name');
                const levelInput = el.querySelector('.cypher-level-input');
                const descEl = el.querySelector('.cypher-desc');
                
                // Check if elements exist before accessing them
                if (!nameEl || !levelInput || !descEl) {
                    return null;
                }
                
                return {
                    name: nameEl.textContent,
                    level: levelInput.value,
                    description: descEl.textContent
                };
            })
            .filter(cypher => cypher !== null);
    }

    static renderCyphers(cyphers) {
        const container = document.getElementById('cyphers-list');
        if (!container) {
            console.warn('Cyphers container not found');
            return;
        }
        container.innerHTML = cyphers.map((cypher, idx) => `
            <div class="cypher-item border border-gray-300 rounded p-2">
                <div class="flex justify-between items-start gap-2">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <strong class="cypher-name text-sm truncate">${cypher.name}</strong>
                            <div class="flex items-center gap-1 flex-shrink-0">
                                <span class="text-gray-500 text-xs">Lvl</span>
                                <input 
                                    type="text" 
                                    value="${cypher.level}" 
                                    onchange="app.updateCypherLevel(${idx}, this.value)"
                                    class="cypher-level-input w-10 px-1 text-xs text-center border border-gray-300 rounded"
                                >
                            </div>
                        </div>
                        <p class="cypher-desc text-xs text-gray-600">${cypher.description}</p>
                    </div>
                    <button onclick="app.removeCypher(${idx}); event.stopPropagation();" class="text-red-600 hover:text-red-800 text-lg leading-none flex-shrink-0">×</button>
                </div>
            </div>
        `).join('');
    }

    static toggleCypherDesc(index) {
        // No longer needed, but keeping for backward compatibility
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.CyphersRenderer = CyphersRenderer;
}
