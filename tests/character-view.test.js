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
        
        <input id="char-might-pool" value="10" />
        <input id="char-speed-pool" value="10" />
        <input id="char-intellect-pool" value="10" />
        <input id="char-might-edge" value="0" />
        <input id="char-speed-edge" value="0" />
        <input id="char-intellect-edge" value="0" />
        <input id="char-effort" value="1" />
        <input id="char-xp" value="0" />
        <input id="char-armor" value="0" />
        <input id="char-recovery-rolls" value="1d6+1" />
        <input id="char-damage-track" value="Hale" />
        
        <div id="skills-container"></div>
        <div id="abilities-container"></div>
        <div id="equipment-container"></div>
        <div id="power-shifts-container"></div>
        <div id="attacks-container"></div>
        <div id="cyphers-container"></div>
        <div id="advancements-container"></div>
        <div id="toast-container"></div>
        <table id="character-table">
          <tbody id="characters-tbody"></tbody>
        </table>
        <div id="character-list"></div>
        
        <button id="lock-toggle" class="lock-btn">
          <span class="lock-icon">🔓</span>
          <span class="lock-text">Unlocked</span>
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
      
      expect(listView.classList.contains('active')).toBe(true);
      expect(sheetView.classList.contains('active')).toBe(false);
    });

    test('should show character sheet', () => {
      view.showCharacterSheet();
      
      const listView = document.getElementById('character-list-view');
      const sheetView = document.getElementById('character-sheet-view');
      
      expect(listView.classList.contains('active')).toBe(false);
      expect(sheetView.classList.contains('active')).toBe(true);
    });
  });

  describe('Character List Rendering', () => {
    test('should render character list', () => {
      const characters = [
        { id: '1', name: 'Hero One', tier: 1, descriptor: 'Strong', type: 'Warrior', focus: 'Fights' },
        { id: '2', name: 'Hero Two', tier: 3, descriptor: 'Swift', type: 'Explorer', focus: 'Explores' }
      ];
      
      view.renderCharacterList(characters);
      
      const listContainer = document.getElementById('character-list');
      expect(listContainer.children.length).toBe(2);
    });

    test('should show empty message when no characters', () => {
      view.renderCharacterList([]);
      
      const listContainer = document.getElementById('character-list');
      expect(listContainer.textContent).toContain('No characters yet');
    });
  });

  describe('Form Operations', () => {
    test('should get character data from form', () => {
      document.getElementById('char-name').value = 'Test Hero';
      document.getElementById('char-tier').value = '2';
      document.getElementById('char-descriptor').value = 'Strong';
      
      const data = view.getCharacterDataFromForm();
      
      expect(data.name).toBe('Test Hero');
      expect(data.tier).toBe('2');
      expect(data.descriptor).toBe('Strong');
    });

    test('should clear form', () => {
      document.getElementById('char-name').value = 'Test';
      view.descriptorSelect = { setValue: jest.fn() };
      view.typeSelect = { setValue: jest.fn() };
      view.focusSelect = { setValue: jest.fn() };
      view.flavorSelect = { setValue: jest.fn() };
      
      view.clearForm();
      
      expect(document.getElementById('char-name').value).toBe('');
      expect(view.descriptorSelect.setValue).toHaveBeenCalledWith(null);
    });

    test('should load character to form', () => {
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
      
      view.loadCharacterToForm(character);
      
      expect(document.getElementById('char-name').value).toBe('Test Hero');
      expect(document.getElementById('char-tier').value).toBe('2');
      expect(view.descriptorSelect.setValue).toHaveBeenCalledWith('Strong');
    });
  });

  describe('Lock State Management', () => {
    test('should update lock state to locked', () => {
      view.updateLockState(true);
      
      const lockBtn = document.getElementById('lock-toggle');
      const icon = lockBtn.querySelector('.lock-icon');
      const text = lockBtn.querySelector('.lock-text');
      
      expect(lockBtn.classList.contains('locked')).toBe(true);
      expect(icon.textContent).toBe('🔒');
      expect(text.textContent).toBe('Locked');
    });

    test('should update lock state to unlocked', () => {
      view.updateLockState(false);
      
      const lockBtn = document.getElementById('lock-toggle');
      const icon = lockBtn.querySelector('.lock-icon');
      const text = lockBtn.querySelector('.lock-text');
      
      expect(lockBtn.classList.contains('locked')).toBe(false);
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
    test('should render advancements', () => {
      global.cypherData.advancements = [
        { tier: 1, options: ['Option 1', 'Option 2'] }
      ];
      
      view.renderAdvancements();
      
      const container = document.getElementById('advancements-container');
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('Current Data Getters', () => {
    test('should get current skills', () => {
      view.formManager.getCurrentSkills = jest.fn(() => [{ name: 'Climbing' }]);
      const skills = view.getCurrentSkills();
      expect(skills).toEqual([{ name: 'Climbing' }]);
    });

    test('should get current abilities', () => {
      view.formManager.getCurrentAbilities = jest.fn(() => [{ name: 'Bash' }]);
      const abilities = view.getCurrentAbilities();
      expect(abilities).toEqual([{ name: 'Bash' }]);
    });

    test('should get current equipment', () => {
      view.formManager.getCurrentEquipment = jest.fn(() => ['Sword']);
      const equipment = view.getCurrentEquipment();
      expect(equipment).toEqual(['Sword']);
    });

    test('should get current power shifts', () => {
      view.formManager.getCurrentPowerShifts = jest.fn(() => [{ name: 'Strength', value: 1 }]);
      const powerShifts = view.getCurrentPowerShifts();
      expect(powerShifts).toEqual([{ name: 'Strength', value: 1 }]);
    });

    test('should get current attacks', () => {
      view.formManager.getCurrentAttacks = jest.fn(() => ['Punch (2)']);
      const attacks = view.getCurrentAttacks();
      expect(attacks).toEqual(['Punch (2)']);
    });

    test('should get current cyphers', () => {
      view.formManager.getCurrentCyphers = jest.fn(() => [{ name: 'Detonation' }]);
      const cyphers = view.getCurrentCyphers();
      expect(cyphers).toEqual([{ name: 'Detonation' }]);
    });
  });

  describe('Renderers', () => {
    test('should render skills', () => {
      const spy = jest.spyOn(view.formManager, 'renderSkills');
      view.renderSkills([{ name: 'Climbing' }]);
      expect(spy).toHaveBeenCalledWith([{ name: 'Climbing' }]);
    });

    test('should render abilities', () => {
      const spy = jest.spyOn(view.formManager, 'renderAbilities');
      view.renderAbilities([{ name: 'Bash' }]);
      expect(spy).toHaveBeenCalledWith([{ name: 'Bash' }]);
    });

    test('should render equipment', () => {
      const spy = jest.spyOn(view.formManager, 'renderEquipment');
      view.renderEquipment(['Sword']);
      expect(spy).toHaveBeenCalledWith(['Sword']);
    });

    test('should render power shifts', () => {
      const spy = jest.spyOn(view.formManager, 'renderPowerShifts');
      view.renderPowerShifts([{ name: 'Strength' }]);
      expect(spy).toHaveBeenCalledWith([{ name: 'Strength' }]);
    });

    test('should render attacks', () => {
      const spy = jest.spyOn(view.formManager, 'renderAttacks');
      view.renderAttacks(['Punch']);
      expect(spy).toHaveBeenCalledWith(['Punch']);
    });

    test('should render cyphers', () => {
      const spy = jest.spyOn(view.formManager, 'renderCyphers');
      view.renderCyphers([{ name: 'Detonation' }]);
      expect(spy).toHaveBeenCalledWith([{ name: 'Detonation' }]);
    });
  });

  describe('Toggle Ability Description', () => {
    test('should toggle ability description visibility', () => {
      view.formManager.renderAbilities([
        { name: 'Ability 1', description: 'Description 1' }
      ]);
      
      const abilitiesContainer = document.getElementById('abilities-container');
      const descEl = abilitiesContainer.querySelector('.ability-desc');
      
      if (descEl) {
        const initialDisplay = descEl.style.display;
        view.toggleAbilityDesc(0);
        expect(descEl.style.display).not.toBe(initialDisplay);
      }
    });
  });
});
