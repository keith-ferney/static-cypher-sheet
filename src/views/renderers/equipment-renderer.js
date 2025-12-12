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

    static async renderEquipment(equipment) {
        const container = document.getElementById('equipment-list');
        if (!container) {
            console.warn('Equipment container not found');
            return;
        }
        
        const template = await templateLoader.loadTemplate('equipment-item');
        container.innerHTML = equipment.map((item, idx) => {
            return templateLoader.render(template, {
                item: item,
                index: idx
            });
        }).join('');
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
