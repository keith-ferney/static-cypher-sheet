// Combat Renderer - Handles rendering and retrieving data for attacks
class CombatRenderer {
    static getCurrentAttacks() {
        return Array.from(document.querySelectorAll('#attacks-list .attack-item'))
            .map(el => {
                const span = el.querySelector('span');
                return span ? span.textContent.trim() : '';
            })
            .filter(attack => attack !== '');
    }

    static async renderAttacks(attacks) {
        const container = document.getElementById('attacks-list');
        if (!container) {
            console.warn('Attacks container not found');
            return;
        }
        
        const template = await templateLoader.loadTemplate('attack-item');
        container.innerHTML = attacks.map((attack, idx) => {
            return templateLoader.render(template, {
                attack: attack,
                index: idx
            });
        }).join('');
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.CombatRenderer = CombatRenderer;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CombatRenderer;
}
