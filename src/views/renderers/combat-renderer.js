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

    static renderAttacks(attacks) {
        const container = document.getElementById('attacks-list');
        if (!container) {
            console.warn('Attacks container not found');
            return;
        }
        container.innerHTML = attacks.map((attack, idx) => `
            <div class="attack-item flex justify-between items-center text-sm border border-gray-300 rounded p-2">
                <span>${attack}</span>
                <button onclick="app.removeAttack(${idx})" class="text-red-600 hover:text-red-800">×</button>
            </div>
        `).join('');
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
