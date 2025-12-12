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
    test('should render abilities with descriptions', async () => {
      const abilities = [
        { name: 'Bash', description: 'Hit things hard' },
        { name: 'Hack', description: 'Break into systems' }
      ];
      
      await AbilitiesRenderer.renderAbilities(abilities);
      
      const container = document.getElementById('abilities-list');
      expect(container.children.length).toBeGreaterThan(0);
    });

    test('should render empty abilities list', async () => {
      await AbilitiesRenderer.renderAbilities([]);
      
      const container = document.getElementById('abilities-list');
      expect(container.innerHTML).toBe('');
    });

    test('should handle abilities without descriptions', async () => {
      const abilities = [{ name: 'Test Ability' }];
      
      await expect(AbilitiesRenderer.renderAbilities(abilities)).resolves.not.toThrow();
    });

    test('should handle null abilities', async () => {
      await expect(AbilitiesRenderer.renderAbilities(null)).rejects.toThrow();
    });

    test('should warn when container not found', async () => {
      document.getElementById('abilities-list').remove();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      await AbilitiesRenderer.renderAbilities([]);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Abilities container not found');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('CyphersRenderer', () => {
    test('should render cyphers with all fields', async () => {
      const cyphers = [
        { name: 'Detonation', level: '1d6+4', description: 'Explodes' },
        { name: 'Stim', level: '1d6+2', description: 'Boosts' }
      ];
      
      await CyphersRenderer.renderCyphers(cyphers);
      
      const container = document.getElementById('cyphers-list');
      expect(container.children.length).toBeGreaterThan(0);
    });

    test('should render empty cyphers list', async () => {
      await CyphersRenderer.renderCyphers([]);
      
      const container = document.getElementById('cyphers-list');
      expect(container.innerHTML).toBe('');
    });

    test('should handle cyphers without description', async () => {
      const cyphers = [{ name: 'Test', level: '1d6' }];
      
      await expect(CyphersRenderer.renderCyphers(cyphers)).resolves.not.toThrow();
    });

    test('should handle cyphers without level', async () => {
      const cyphers = [{ name: 'Test', description: 'Desc' }];
      
      await expect(CyphersRenderer.renderCyphers(cyphers)).resolves.not.toThrow();
    });

    test('should warn when container not found', async () => {
      document.getElementById('cyphers-list').remove();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      await CyphersRenderer.renderCyphers([]);
      
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('AdvancementsRenderer', () => {
    test('should render advancements for tier 1', async () => {
      await AdvancementsRenderer.renderAdvancements();
      
      const container = document.getElementById('advancements-list');
      expect(container.innerHTML).toContain('INCREASE CAPABILITIES');
    });

    test('should render all advancement tiers', async () => {
      await AdvancementsRenderer.renderAdvancements();
      
      const container = document.getElementById('advancements-list');
      expect(container.innerHTML).toContain('INCREASE CAPABILITIES');
      expect(container.innerHTML).toContain('MOVE TOWARD PERFECTION');
    });

    test('should render advancement options as checkboxes', async () => {
      await AdvancementsRenderer.renderAdvancements();
      
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    test('should handle missing advancements data', async () => {
      global.cypherData.advancements = [];
      
      await expect(AdvancementsRenderer.renderAdvancements()).resolves.not.toThrow();
    });

    test('should warn when container not found', async () => {
      document.getElementById('advancements-list').remove();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      await AdvancementsRenderer.renderAdvancements();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Advancements container not found');
      consoleWarnSpy.mockRestore();
    });

    test('should handle advancements without options', async () => {
      global.cypherData.advancements = [{ tier: 1 }];
      
      await expect(AdvancementsRenderer.renderAdvancements()).resolves.not.toThrow();
    });
  });

  describe('Renderer Integration', () => {
    test('should render multiple sections without conflicts', async () => {
      await AbilitiesRenderer.renderAbilities([{ name: 'Ability 1' }]);
      await CyphersRenderer.renderCyphers([{ name: 'Cypher 1' }]);
      await AdvancementsRenderer.renderAdvancements();
      
      expect(document.getElementById('abilities-list').innerHTML).toBeTruthy();
      expect(document.getElementById('cyphers-list').innerHTML).toBeTruthy();
      expect(document.getElementById('advancements-list').innerHTML).toBeTruthy();
    });

    test('should handle rapid re-renders', async () => {
      for (let i = 0; i < 10; i++) {
        await AbilitiesRenderer.renderAbilities([{ name: `Ability ${i}` }]);
      }
      
      const container = document.getElementById('abilities-list');
      expect(container.innerHTML).toBeTruthy();
    });
  });
});
