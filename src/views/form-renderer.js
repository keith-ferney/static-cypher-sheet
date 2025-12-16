// Form Renderer - Unified interface for all renderers
// This file maintains backward compatibility while delegating to specialized renderers

class FormRenderer {
    // ========== SKILLS ==========
    static getCurrentSkills() {
        return SkillsRenderer.getCurrentSkills();
    }

    static renderSkills(skills) {
        return SkillsRenderer.renderSkills(skills);
    }

    // ========== ABILITIES ==========
    static getCurrentAbilities() {
        return AbilitiesRenderer.getCurrentAbilities();
    }

    static renderAbilities(abilities) {
        return AbilitiesRenderer.renderAbilities(abilities);
    }

    // Note: toggleAbilityDesc removed - now handled by native <details> element

    // ========== EQUIPMENT ==========
    static getCurrentEquipment() {
        return EquipmentRenderer.getCurrentEquipment();
    }

    static renderEquipment(equipment) {
        return EquipmentRenderer.renderEquipment(equipment);
    }

    // ========== ATTACKS ==========
    static getCurrentAttacks() {
        return CombatRenderer.getCurrentAttacks();
    }

    static renderAttacks(attacks) {
        return CombatRenderer.renderAttacks(attacks);
    }

    // ========== CYPHERS ==========
    static getCurrentCyphers() {
        return CyphersRenderer.getCurrentCyphers();
    }

    static renderCyphers(cyphers) {
        return CyphersRenderer.renderCyphers(cyphers);
    }

    // ========== POWER SHIFTS ==========
    static getCurrentPowerShifts() {
        return PowerShiftsRenderer.getCurrentPowerShifts();
    }

    static getAllPowerShifts() {
        return PowerShiftsRenderer.getAllPowerShifts();
    }

    static renderPowerShifts(characterPowerShifts) {
        return PowerShiftsRenderer.renderPowerShifts(characterPowerShifts);
    }

    // ========== ADVANCEMENTS ==========
    static getCurrentAdvancements() {
        return AdvancementsRenderer.getCurrentAdvancements();
    }

    static renderAdvancements(characterAdvancements) {
        return AdvancementsRenderer.renderAdvancements(characterAdvancements);
    }
}

// Make available globally for tests and browser usage
if (typeof global !== 'undefined') {
    global.FormRenderer = FormRenderer;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormRenderer;
}
