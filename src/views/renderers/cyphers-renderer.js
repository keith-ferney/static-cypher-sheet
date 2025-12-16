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

    static async renderCyphers(cyphers) {
        const container = document.getElementById('cyphers-list');
        if (!container) {
            console.warn('Cyphers container not found');
            return;
        }
        
        const template = await templateLoader.loadTemplate('cypher-item');
        container.innerHTML = cyphers.map((cypher, idx) => {
            return templateLoader.render(template, {
                name: cypher.name,
                level: cypher.level,
                description: cypher.description,
                index: idx
            });
        }).join('');
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.CyphersRenderer = CyphersRenderer;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CyphersRenderer;
}
