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
      <div id="abilities-container"></div>
      <div id="cyphers-container"></div>
      <div id="advancements-container"></div>
    `;
    
    global.cypherData = {
      advancements: [
        { tier: 1, options: ['Increase Capabilities', 'Move Toward Perfection', 'Extra Effort', 'Skill Training'] },
        { tier: 2, options: ['Increase Capabilities', 'Move Toward Perfection', 'Extra Effort', 'Skill Training'] }
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
      
      const container = document.getElementById('abilities-container');
      expect(container.children.length).toBeGreaterThan(0);
    });

    test('should render empty abilities list', () => {
      AbilitiesRenderer.renderAbilities([]);
      
      const container = document.getElementById('abilities-container');
      expect(container.innerHTML).toBeTruthy();
    });

    test('should handle abilities without descriptions', () => {
      const abilities = [{ name: 'Test Ability' }];
      
      expect(() => AbilitiesRenderer.renderAbilities(abilities)).not.toThrow();
    });

    test('should handle null abilities', () => {
      expect(() => AbilitiesRenderer.renderAbilities(null)).not.toThrow();
    });

    test('should warn when container not found', () => {
      document.getElementById('abilities-container').remove();
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
      
      const container = document.getElementById('cyphers-container');
      expect(container.children.length).toBeGreaterThan(0);
    });

    test('should render empty cyphers list', () => {
      CyphersRenderer.renderCyphers([]);
      
      const container = document.getElementById('cyphers-container');
      expect(container.innerHTML).toBeTruthy();
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
      document.getElementById('cyphers-container').remove();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      CyphersRenderer.renderCyphers([]);
      
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('AdvancementsRenderer', () => {
    test('should render advancements for tier 1', () => {
      AdvancementsRenderer.renderAdvancements();
      
      const container = document.getElementById('advancements-container');
      expect(container.innerHTML).toContain('Tier 1');
    });

    test('should render all advancement tiers', () => {
      AdvancementsRenderer.renderAdvancements();
      
      const container = document.getElementById('advancements-container');
      expect(container.innerHTML).toContain('Tier 1');
      expect(container.innerHTML).toContain('Tier 2');
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
      document.getElementById('advancements-container').remove();
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
      
      expect(document.getElementById('abilities-container').innerHTML).toBeTruthy();
      expect(document.getElementById('cyphers-container').innerHTML).toBeTruthy();
      expect(document.getElementById('advancements-container').innerHTML).toBeTruthy();
    });

    test('should handle rapid re-renders', () => {
      for (let i = 0; i < 10; i++) {
        AbilitiesRenderer.renderAbilities([{ name: `Ability ${i}` }]);
      }
      
      const container = document.getElementById('abilities-container');
      expect(container.innerHTML).toBeTruthy();
    });
  });
});
