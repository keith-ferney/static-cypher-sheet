/**
 * Character View Tests
 * Tests for CharacterView methods not covered elsewhere
 */

require('./test-setup');

const CharacterView = global.CharacterView;
const CharacterModel = global.CharacterModel;

describe('CharacterView', () => {
  let view, model;

  beforeEach(() => {
    localStorage.clear();
    
    // Setup DOM FIRST
    document.body.innerHTML = `
      <div id="character-list-view"></div>
      <div id="character-sheet-view">
        <input id="char-name" />
        <input id="char-tier" value="1" />
        <input id="char-descriptor" />
        <input id="char-type" />
        <input id="char-focus" />
        <input id="char-flavor" />
        <input id="char-background" />
        <input id="char-notes" />
        <input id="char-portrait" />
        
        <div id="descriptor-select"></div>
        <div id="type-select"></div>
        <div id="focus-select"></div>
        <div id="flavor-select"></div>
        <div id="ability-select"></div>
        
        <input id="might-pool" value="10" />
        <input id="might-edge" value="0" />
        <input id="might-current" value="10" />
        <input id="speed-pool" value="10" />
        <input id="speed-edge" value="0" />
        <input id="speed-current" value="10" />
        <input id="intellect-pool" value="10" />
        <input id="intellect-edge" value="0" />
        <input id="intellect-current" value="10" />
        <input id="char-effort" value="1" />
        <input id="char-experience" value="0" />
        <input id="recovery-modifier" value="0" />
        <input id="impaired" type="checkbox" />
        <input id="debilitated" type="checkbox" />
        <input id="recovery-action" type="checkbox" />
        <input id="recovery-10min" type="checkbox" />
        <input id="recovery-1hour" type="checkbox" />
        <input id="recovery-10hour" type="checkbox" />
        
        <div id="skills-list"></div>
        <div id="abilities-list"></div>
        <div id="equipment-list"></div>
        <div id="power-shifts-list"></div>
        <div id="powershifts-list"></div>
        <div id="attacks-list"></div>
        <div id="cyphers-list"></div>
        <div id="advancements-list"></div>
        <div id="advancements-container"></div>
        <div id="toast-container"></div>
        <table id="character-table">
          <tbody id="characters-tbody"></tbody>
        </table>
        <div id="character-list"></div>
        
        <button id="lock-toggle-btn" class="lock-btn">
          <span id="lock-icon">🔓</span>
          <span id="lock-text">Unlocked</span>
        </button>
      </div>
    `;
    
    global.cypherData = {
      descriptors: [{ name: 'Strong', description: 'Mighty' }],
      types: [{ name: 'Warrior', description: 'Fighter' }],
      foci: [{ name: 'Fights', description: 'Combat' }],
      flavors: [{ name: 'Stealth', description: 'Sneaky' }],
      abilities: [{ name: 'Bash', description: 'Hit things' }],
      advancements: [],
      powerShifts: []
    };
    
    // Mock global app object for onclick handlers
    global.app = {
      toggleAbilityDesc: jest.fn(),
      removeSkill: jest.fn(),
      removeAbility: jest.fn(),
      removeEquipment: jest.fn(),
      removeAttack: jest.fn(),
      removeCypher: jest.fn(),
      removePowerShiftInstance: jest.fn()
    };
    
    view = new CharacterView();
    model = new CharacterModel();
    view.setModel(model);
  });

  describe('Initialization', () => {
    test('should create toast notification instance', () => {
      expect(view.toast).toBeDefined();
    });

    test('should create form manager instance', () => {
      expect(view.formManager).toBeDefined();
    });

    test('should set model reference', () => {
      expect(view.model).toBe(model);
    });
  });

  describe('View Navigation', () => {
    test('should show character list', () => {
      view.showCharacterList();
      
      const listView = document.getElementById('character-list-view');
      const sheetView = document.getElementById('character-sheet-view');
      
      expect(listView.classList.contains('hidden')).toBe(false);
      expect(sheetView.classList.contains('hidden')).toBe(true);
    });

    test('should show character sheet', () => {
      view.showCharacterSheet();
      
      const listView = document.getElementById('character-list-view');
      const sheetView = document.getElementById('character-sheet-view');
      
      expect(listView.classList.contains('hidden')).toBe(true);
      expect(sheetView.classList.contains('hidden')).toBe(false);
    });
  });

  describe('Character List Rendering', () => {
    test('should render character list', () => {
      const characters = [
        { id: '1', name: 'Hero One', tier: 1, descriptor: 'Strong', type: 'Warrior', focus: 'Fights' },
        { id: '2', name: 'Hero Two', tier: 3, descriptor: 'Swift', type: 'Explorer', focus: 'Explores' }
      ];
      
      view.renderCharacterList(characters);
      
      const tbody = document.getElementById('characters-tbody');
      expect(tbody.children.length).toBe(2);
    });

    test('should show empty message when no characters', () => {
      view.renderCharacterList([]);
      
      const tbody = document.getElementById('characters-tbody');
      expect(tbody.textContent).toContain('No characters yet');
    });
  });

  describe('Form Operations', () => {
    test('should get character data from form', () => {
      document.getElementById('char-name').value = 'Test Hero';
      document.getElementById('char-tier').value = '2';
      document.getElementById('char-descriptor').value = 'Strong';
      
      const data = view.getCharacterDataFromForm();
      
      expect(data.name).toBe('Test Hero');
      expect(data.tier).toBe(2);
      expect(data.descriptor).toBe('Strong');
    });

    test('should clear form', async () => {
      document.getElementById('char-name').value = 'Test';
      view.descriptorSelect = { setValue: jest.fn() };
      view.typeSelect = { setValue: jest.fn() };
      view.focusSelect = { setValue: jest.fn() };
      view.flavorSelect = { setValue: jest.fn() };
      
      await view.clearForm();
      
      expect(document.getElementById('char-name').value).toBe('');
      expect(view.descriptorSelect.setValue).toHaveBeenCalledWith(null);
    });

    test('should load character to form', async () => {
      const character = {
        id: '1',
        name: 'Test Hero',
        tier: '2',
        descriptor: 'Strong',
        type: 'Warrior',
        focus: 'Fights',
        flavor: '',
        skills: [],
        abilities: [],
        equipment: [],
        powerShifts: [],
        attacks: [],
        cyphers: []
      };
      
      view.descriptorSelect = { setValue: jest.fn() };
      view.typeSelect = { setValue: jest.fn() };
      view.focusSelect = { setValue: jest.fn() };
      view.flavorSelect = { setValue: jest.fn() };
      
      await view.loadCharacterToForm(character);
      
      expect(document.getElementById('char-name').value).toBe('Test Hero');
      expect(document.getElementById('char-tier').value).toBe('2');
      expect(view.descriptorSelect.setValue).toHaveBeenCalledWith('Strong');
    });
  });

  describe('Lock State Management', () => {
    test('should update lock state to locked', () => {
      view.updateLockState(true);
      
      const lockBtn = document.getElementById('lock-toggle-btn');
      const icon = document.getElementById('lock-icon');
      const text = document.getElementById('lock-text');
      
      expect(lockBtn.classList.contains('bg-orange-600')).toBe(true);
      expect(icon.textContent).toBe('🔒');
      expect(text.textContent).toBe('Locked');
    });

    test('should update lock state to unlocked', () => {
      view.updateLockState(false);
      
      const lockBtn = document.getElementById('lock-toggle-btn');
      const icon = document.getElementById('lock-icon');
      const text = document.getElementById('lock-text');
      
      expect(lockBtn.classList.contains('bg-blue-600')).toBe(true);
      expect(icon.textContent).toBe('🔓');
      expect(text.textContent).toBe('Unlocked');
    });

    test('should disable form inputs when locked', () => {
      view.updateLockState(true);
      
      const nameInput = document.getElementById('char-name');
      expect(nameInput.disabled).toBe(true);
    });

    test('should enable form inputs when unlocked', () => {
      view.updateLockState(false);
      
      const nameInput = document.getElementById('char-name');
      expect(nameInput.disabled).toBe(false);
    });

    test('should disable skills, abilities, attacks, and power shifts when locked', () => {
      // Setup some content first
      document.getElementById('skills-list').innerHTML = `
        <div class="skill-row">
          <input type="text" class="skill-name">
          <select class="skill-pool"></select>
          <button>Remove</button>
        </div>
      `;
      document.getElementById('abilities-list').innerHTML = `
        <div class="ability-item">
          <button>Remove</button>
        </div>
      `;
      document.getElementById('attacks-list').innerHTML = `
        <div class="attack-item">
          <button>Remove</button>
        </div>
      `;
      document.getElementById('powershifts-list').innerHTML = `
        <label>
          <input type="number" class="ps-value">
          <button>Add</button>
        </label>
      `;
      document.getElementById('advancements-list').innerHTML = `
        <label class="advancement-item cursor-pointer hover:bg-gray-50">
          <input type="checkbox">
        </label>
      `;
      
      view.updateLockState(true);
      
      // Check skills
      const skillInput = document.querySelector('#skills-list input');
      const skillButton = document.querySelector('#skills-list button');
      expect(skillInput.disabled).toBe(true);
      expect(skillButton.disabled).toBe(true);
      
      // Check abilities
      const abilityButton = document.querySelector('#abilities-list button');
      expect(abilityButton.disabled).toBe(true);
      
      // Check attacks
      const attackButton = document.querySelector('#attacks-list button');
      expect(attackButton.disabled).toBe(true);
      
      // Check power shifts
      const psInput = document.querySelector('#powershifts-list input');
      const psButton = document.querySelector('#powershifts-list button');
      expect(psInput.disabled).toBe(true);
      expect(psButton.disabled).toBe(true);
      
      // Check advancements
      const advCheckbox = document.querySelector('#advancements-list input[type="checkbox"]');
      expect(advCheckbox.disabled).toBe(true);
    });

    test('should enable skills, abilities, attacks, and power shifts when unlocked', () => {
      // Setup some content first
      document.getElementById('skills-list').innerHTML = `
        <div class="skill-row">
          <input type="text" class="skill-name">
          <button>Remove</button>
        </div>
      `;
      document.getElementById('abilities-list').innerHTML = `
        <div class="ability-item">
          <button>Remove</button>
        </div>
      `;
      document.getElementById('powershifts-list').innerHTML = `
        <label>
          <input type="number" class="ps-value">
        </label>
      `;
      document.getElementById('advancements-list').innerHTML = `
        <label class="advancement-item">
          <input type="checkbox">
        </label>
      `;
      
      view.updateLockState(false);
      
      // Check skills
      const skillInput = document.querySelector('#skills-list input');
      const skillButton = document.querySelector('#skills-list button');
      expect(skillInput.disabled).toBe(false);
      expect(skillButton.disabled).toBe(false);
      
      // Check abilities
      const abilityButton = document.querySelector('#abilities-list button');
      expect(abilityButton.disabled).toBe(false);
      
      // Check power shifts
      const psInput = document.querySelector('#powershifts-list input');
      expect(psInput.disabled).toBe(false);
      
      // Check advancements
      const advCheckbox = document.querySelector('#advancements-list input[type="checkbox"]');
      expect(advCheckbox.disabled).toBe(false);
    });
  });

  describe('Change Detection', () => {
    test('should set change detection callback', () => {
      const callback = jest.fn();
      view.setChangeDetectionCallback(callback);
      
      view.triggerChangeDetection();
      
      expect(callback).toHaveBeenCalled();
    });

    test('should not error when triggering without callback', () => {
      view.changeDetectionCallback = null;
      expect(() => view.triggerChangeDetection()).not.toThrow();
    });
  });

  describe('Advancements Rendering', () => {
    test('should render advancements', async () => {
      global.cypherData.advancements = [
        { name: 'Advancement 1', description: 'Option 1' }
      ];
      
      await view.renderAdvancements([]);
      
      const container = document.getElementById('advancements-list');
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('Current Data Getters', () => {
    test('should get current skills', () => {
      const FormRenderer = require('../src/views/form-renderer');
      jest.spyOn(FormRenderer, 'getCurrentSkills').mockReturnValue([{ name: 'Climbing' }]);
      const skills = view.getCurrentSkills();
      expect(skills).toEqual([{ name: 'Climbing' }]);
    });

    test('should get current abilities', () => {
      const FormRenderer = require('../src/views/form-renderer');
      jest.spyOn(FormRenderer, 'getCurrentAbilities').mockReturnValue([{ name: 'Bash' }]);
      const abilities = view.getCurrentAbilities();
      expect(abilities).toEqual([{ name: 'Bash' }]);
    });

    test('should get current equipment', () => {
      const FormRenderer = require('../src/views/form-renderer');
      jest.spyOn(FormRenderer, 'getCurrentEquipment').mockReturnValue(['Sword']);
      const equipment = view.getCurrentEquipment();
      expect(equipment).toEqual(['Sword']);
    });

    test('should get current power shifts', () => {
      const FormRenderer = require('../src/views/form-renderer');
      jest.spyOn(FormRenderer, 'getCurrentPowerShifts').mockReturnValue([{ name: 'Strength', value: 1 }]);
      const powerShifts = view.getCurrentPowerShifts();
      expect(powerShifts).toEqual([{ name: 'Strength', value: 1 }]);
    });

    test('should get current attacks', () => {
      const FormRenderer = require('../src/views/form-renderer');
      jest.spyOn(FormRenderer, 'getCurrentAttacks').mockReturnValue(['Punch (2)']);
      const attacks = view.getCurrentAttacks();
      expect(attacks).toEqual(['Punch (2)']);
    });

    test('should get current cyphers', () => {
      const FormRenderer = require('../src/views/form-renderer');
      jest.spyOn(FormRenderer, 'getCurrentCyphers').mockReturnValue([{ name: 'Detonation' }]);
      const cyphers = view.getCurrentCyphers();
      expect(cyphers).toEqual([{ name: 'Detonation' }]);
    });
  });

  describe('Renderers', () => {
    test('should render skills', () => {
      const FormRenderer = require('../src/views/form-renderer');
      const spy = jest.spyOn(FormRenderer, 'renderSkills');
      view.renderSkills([{ name: 'Climbing' }]);
      expect(spy).toHaveBeenCalledWith([{ name: 'Climbing' }]);
    });

    test('should render abilities', () => {
      const FormRenderer = require('../src/views/form-renderer');
      const spy = jest.spyOn(FormRenderer, 'renderAbilities');
      view.renderAbilities([{ name: 'Bash' }]);
      expect(spy).toHaveBeenCalledWith([{ name: 'Bash' }]);
    });

    test('should render equipment', () => {
      const FormRenderer = require('../src/views/form-renderer');
      const spy = jest.spyOn(FormRenderer, 'renderEquipment');
      view.renderEquipment(['Sword']);
      expect(spy).toHaveBeenCalledWith(['Sword']);
    });

    test('should render power shifts', () => {
      const FormRenderer = require('../src/views/form-renderer');
      const spy = jest.spyOn(FormRenderer, 'renderPowerShifts');
      view.renderPowerShifts([{ name: 'Strength' }]);
      expect(spy).toHaveBeenCalledWith([{ name: 'Strength' }]);
    });

    test('should render attacks', () => {
      const FormRenderer = require('../src/views/form-renderer');
      const spy = jest.spyOn(FormRenderer, 'renderAttacks');
      view.renderAttacks(['Punch']);
      expect(spy).toHaveBeenCalledWith(['Punch']);
    });

    test('should render cyphers', () => {
      const FormRenderer = require('../src/views/form-renderer');
      const spy = jest.spyOn(FormRenderer, 'renderCyphers');
      view.renderCyphers([{ name: 'Detonation' }]);
      expect(spy).toHaveBeenCalledWith([{ name: 'Detonation' }]);
    });
  });

  describe('Toggle Ability Description', () => {
    test('ability description toggle is now handled by native <details> element', () => {
      // This functionality is now CSS-only via <details> element
      // No JavaScript function needed
      expect(true).toBe(true);
    });
  });
});
