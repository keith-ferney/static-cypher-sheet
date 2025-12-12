/**
 * Renderer Edge Cases Tests
 * Tests for renderer edge cases and error handling
 */

require('./test-setup');

const AbilitiesRenderer = global.AbilitiesRenderer;
const CyphersRenderer = global.CyphersRenderer;
const AdvancementsRenderer = global.AdvancementsRenderer;

describe('Renderer Edge Cases', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="abilities-list"></div>
      <div id="cyphers-list"></div>
      <div id="advancements-list"></div>
    `;
    
    global.cypherData = {
      advancements: [
        { name: "INCREASE CAPABILITIES", description: "+4 points into stat Pools" },
        { name: "MOVE TOWARD PERFECTION", description: "+1 to the Edge of your choice" },
        { name: "EXTRA EFFORT", description: "+1 into Effort" },
        { name: "SKILL TRAINING", description: "Train in a skill or specialize in a trained skill" }
      ]
    };
  });

  describe('AbilitiesRenderer', () => {
    test('should render abilities with descriptions', () => {
      const abilities = [
        { name: 'Bash', description: 'Hit things hard' },
        { name: 'Hack', description: 'Break into systems' }
      ];
      
      AbilitiesRenderer.renderAbilities(abilities);
      
      const container = document.getElementById('abilities-list');
      expect(container.children.length).toBeGreaterThan(0);
    });

    test('should render empty abilities list', () => {
      AbilitiesRenderer.renderAbilities([]);
      
      const container = document.getElementById('abilities-list');
      expect(container.innerHTML).toBe('');
    });

    test('should handle abilities without descriptions', () => {
      const abilities = [{ name: 'Test Ability' }];
      
      expect(() => AbilitiesRenderer.renderAbilities(abilities)).not.toThrow();
    });

    test('should handle null abilities', () => {
      expect(() => AbilitiesRenderer.renderAbilities(null)).toThrow();
    });

    test('should warn when container not found', () => {
      document.getElementById('abilities-list').remove();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      AbilitiesRenderer.renderAbilities([]);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Abilities container not found');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('CyphersRenderer', () => {
    test('should render cyphers with all fields', () => {
      const cyphers = [
        { name: 'Detonation', level: '1d6+4', description: 'Explodes' },
        { name: 'Stim', level: '1d6+2', description: 'Boosts' }
      ];
      
      CyphersRenderer.renderCyphers(cyphers);
      
      const container = document.getElementById('cyphers-list');
      expect(container.children.length).toBeGreaterThan(0);
    });

    test('should render empty cyphers list', () => {
      CyphersRenderer.renderCyphers([]);
      
      const container = document.getElementById('cyphers-list');
      expect(container.innerHTML).toBe('');
    });

    test('should handle cyphers without description', () => {
      const cyphers = [{ name: 'Test', level: '1d6' }];
      
      expect(() => CyphersRenderer.renderCyphers(cyphers)).not.toThrow();
    });

    test('should handle cyphers without level', () => {
      const cyphers = [{ name: 'Test', description: 'Desc' }];
      
      expect(() => CyphersRenderer.renderCyphers(cyphers)).not.toThrow();
    });

    test('should warn when container not found', () => {
      document.getElementById('cyphers-list').remove();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      CyphersRenderer.renderCyphers([]);
      
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('AdvancementsRenderer', () => {
    test('should render advancements for tier 1', () => {
      AdvancementsRenderer.renderAdvancements();
      
      const container = document.getElementById('advancements-list');
      expect(container.innerHTML).toContain('INCREASE CAPABILITIES');
    });

    test('should render all advancement tiers', () => {
      AdvancementsRenderer.renderAdvancements();
      
      const container = document.getElementById('advancements-list');
      expect(container.innerHTML).toContain('INCREASE CAPABILITIES');
      expect(container.innerHTML).toContain('MOVE TOWARD PERFECTION');
    });

    test('should render advancement options as checkboxes', () => {
      AdvancementsRenderer.renderAdvancements();
      
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    test('should handle missing advancements data', () => {
      global.cypherData.advancements = [];
      
      expect(() => AdvancementsRenderer.renderAdvancements()).not.toThrow();
    });

    test('should warn when container not found', () => {
      document.getElementById('advancements-list').remove();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      AdvancementsRenderer.renderAdvancements();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Advancements container not found');
      consoleWarnSpy.mockRestore();
    });

    test('should handle advancements without options', () => {
      global.cypherData.advancements = [{ tier: 1 }];
      
      expect(() => AdvancementsRenderer.renderAdvancements()).not.toThrow();
    });
  });

  describe('Renderer Integration', () => {
    test('should render multiple sections without conflicts', () => {
      AbilitiesRenderer.renderAbilities([{ name: 'Ability 1' }]);
      CyphersRenderer.renderCyphers([{ name: 'Cypher 1' }]);
      AdvancementsRenderer.renderAdvancements();
      
      expect(document.getElementById('abilities-list').innerHTML).toBeTruthy();
      expect(document.getElementById('cyphers-list').innerHTML).toBeTruthy();
      expect(document.getElementById('advancements-list').innerHTML).toBeTruthy();
    });

    test('should handle rapid re-renders', () => {
      for (let i = 0; i < 10; i++) {
        AbilitiesRenderer.renderAbilities([{ name: `Ability ${i}` }]);
      }
      
      const container = document.getElementById('abilities-list');
      expect(container.innerHTML).toBeTruthy();
    });
  });
});
