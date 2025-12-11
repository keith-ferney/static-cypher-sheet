// Skills Renderer - Handles rendering and retrieving data for skills
class SkillsRenderer {
    static getCurrentSkills() {
        const rows = document.querySelectorAll('#skills-list .skill-row');
        if (!rows || rows.length === 0) return [];
        
        return Array.from(rows)
            .map(el => {
                const nameInput = el.querySelector('.skill-name');
                const poolSelect = el.querySelector('.skill-pool');
                const typeSelect = el.querySelector('.skill-type');
                const psInput = el.querySelector('.skill-ps');
                
                return {
                    name: nameInput ? nameInput.value : '',
                    pool: poolSelect ? poolSelect.value : '',
                    type: typeSelect ? typeSelect.value : '',
                    powerShift: psInput ? (parseInt(psInput.value) || 0) : 0
                };
            })
            .filter(skill => skill.name.trim() !== '');
    }

    static renderSkills(skills) {
        const container = document.getElementById('skills-list');
        
        if (!container) {
            console.warn('Skills container not found');
            return;
        }
        
        if (!skills || skills.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        const normalizedSkills = skills.map(skill => {
            if (typeof skill === 'string') {
                return { name: skill, pool: '', type: '', powerShift: 0 };
            }
            return skill;
        });
        
        container.innerHTML = normalizedSkills.map((skill, idx) => `
            <div class="skill-row border border-gray-300 rounded p-2">
                <div class="flex items-center gap-2 mb-1">
                    <input type="text" value="${skill.name || ''}" class="skill-name flex-1 px-2 py-1 text-sm border border-gray-200 rounded" placeholder="Skill name">
                    <button onclick="app.removeSkill(${idx})" class="text-red-600 hover:text-red-800 text-lg leading-none">×</button>
                </div>
                <div class="flex gap-2 text-xs">
                    <div class="flex-1">
                        <select class="skill-pool w-full px-1 py-1 border border-gray-200 rounded text-xs">
                            <option value="" ${!skill.pool ? 'selected' : ''}>- select pool -</option>
                            <option value="might" ${skill.pool === 'might' ? 'selected' : ''}>Might</option>
                            <option value="speed" ${skill.pool === 'speed' ? 'selected' : ''}>Speed</option>
                            <option value="intellect" ${skill.pool === 'intellect' ? 'selected' : ''}>Intellect</option>
                        </select>
                    </div>
                    <div class="w-16">
                        <input type="number" value="${skill.powerShift || 0}" class="skill-ps w-full px-1 py-1 text-center border border-gray-200 rounded text-xs" min="0" placeholder="PS">
                    </div>
                    <div class="flex-1">
                        <select class="skill-type w-full px-1 py-1 border border-gray-200 rounded text-xs">
                            <option value="" ${!skill.type ? 'selected' : ''}>- select type -</option>
                            <option value="trained" ${skill.type === 'trained' ? 'selected' : ''}>Trained</option>
                            <option value="specialized" ${skill.type === 'specialized' ? 'selected' : ''}>Specialized</option>
                            <option value="inability" ${skill.type === 'inability' ? 'selected' : ''}>Inability</option>
                        </select>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.SkillsRenderer = SkillsRenderer;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillsRenderer;
}
