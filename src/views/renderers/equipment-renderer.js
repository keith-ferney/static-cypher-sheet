// Equipment Renderer - Handles rendering and retrieving data for equipment
class EquipmentRenderer {
    static getCurrentEquipment() {
        return Array.from(document.querySelectorAll('#equipment-list .equipment-item'))
            .map(el => {
                const span = el.querySelector('span');
                return span ? span.textContent.trim() : '';
            })
            .filter(item => item !== '');
    }

    static renderEquipment(equipment) {
        const container = document.getElementById('equipment-list');
        if (!container) {
            console.warn('Equipment container not found');
            return;
        }
        container.innerHTML = equipment.map((item, idx) => `
            <div class="equipment-item flex justify-between items-center text-sm border border-gray-300 rounded p-2">
                <span>${item}</span>
                <button onclick="app.removeEquipment(${idx})" class="text-red-600 hover:text-red-800">×</button>
            </div>
        `).join('');
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.EquipmentRenderer = EquipmentRenderer;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EquipmentRenderer;
}
