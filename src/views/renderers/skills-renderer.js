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
            <tr class="skill-row">
                <td><input type="text" value="${skill.name || ''}" class="skill-name w-full" placeholder="Skill name"></td>
                <td>
                    <select class="skill-pool w-full">
                        <option value="" ${!skill.pool ? 'selected' : ''}>-</option>
                        <option value="might" ${skill.pool === 'might' ? 'selected' : ''}>M</option>
                        <option value="speed" ${skill.pool === 'speed' ? 'selected' : ''}>S</option>
                        <option value="intellect" ${skill.pool === 'intellect' ? 'selected' : ''}>I</option>
                    </select>
                </td>
                <td><input type="number" value="${skill.powerShift || 0}" class="skill-ps w-full text-center" min="0"></td>
                <td>
                    <select class="skill-type w-full">
                        <option value="" ${!skill.type ? 'selected' : ''}>-</option>
                        <option value="trained" ${skill.type === 'trained' ? 'selected' : ''}>Trained</option>
                        <option value="specialized" ${skill.type === 'specialized' ? 'selected' : ''}>Specialized</option>
                        <option value="inability" ${skill.type === 'inability' ? 'selected' : ''}>Inability</option>
                    </select>
                </td>
                <td><button onclick="app.removeSkill(${idx})" class="text-red-600 hover:text-red-800">×</button></td>
            </tr>
        `).join('');
    }
}

// Make available globally
if (typeof global !== 'undefined') {
    global.SkillsRenderer = SkillsRenderer;
}
