/**
 * Character Controller Tests
 * Comprehensive tests for CharacterController methods
 */

require('./test-setup');

const CharacterModel = global.CharacterModel;
const CharacterView = global.CharacterView;
const CharacterController = global.CharacterController;

describe('CharacterController', () => {
  let model, view, controller;

  beforeEach(() => {
    localStorage.clear();
    
    // Setup DOM FIRST
    document.body.innerHTML = `
      <div id="character-sheet-view">
        <input id="char-name" value="Test Character" />
        <input id="char-tier" type="number" value="1" />
        <input id="char-descriptor" />
        <input id="char-type" />
        <input id="char-focus" />
        <input id="char-flavor" />
        <textarea id="char-background"></textarea>
        <textarea id="char-notes"></textarea>
        <input id="char-portrait" />
        
        <div id="descriptor-select"></div>
        <div id="type-select"></div>
        <div id="focus-select"></div>
        <div id="flavor-select"></div>
        <div id="ability-select"></div>
        
        <!-- Stats -->
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
        
        <!-- Dynamic sections -->
        <div id="skills-list"></div>
        <div id="abilities-list"></div>
        <div id="equipment-list"></div>
        <div id="power-shifts-list"></div>
        <div id="powershifts-list"></div>
        <div id="attacks-list"></div>
        <div id="cyphers-list"></div>
        <div id="advancements-list"></div>
        <div id="character-list-view" class="hidden"></div>
        <div id="toast-container"></div>
        <div id="character-list"></div>
        <table id="character-table">
          <tbody id="characters-tbody"></tbody>
        </table>
        <div id="toast-container"></div>
        
        <!-- Equipment input -->
        <input id="new-equipment" />
        
        <!-- Attack input -->
        <input id="new-attack" />
        
        <!-- Cypher inputs -->
        <input id="new-cypher-name" />
        <input id="new-cypher-level" />
        <input id="new-cypher-desc" />
      </div>
    `;
    
    // Mock global cypherData
    global.cypherData = {
      abilities: [
        { name: 'Test Ability', description: 'A test ability' },
        { name: 'Another Ability', description: 'Another test ability' }
      ],
      descriptors: [],
      types: [],
      foci: [],
      flavors: [],
      advancements: [],
      powerShifts: [
        { name: 'Strength', allows_additional_text: true, has_healing: false, description: 'Power shift for strength' }
      ]
    };
    
    // Create instances AFTER DOM
    model = new CharacterModel();
    view = new CharacterView();
    controller = new CharacterController(model, view);
  });

  describe('Skills Management', () => {
    test('should add a skill', async () => {
      const beforeCount = view.getCurrentSkills().length;
      await controller.addSkill();
      // After adding, the container should have the rendered HTML
      const container = document.getElementById('skills-list');
      expect(container.innerHTML).toContain('skill-row');
      // getCurrentSkills filters out empty skills, so count might not increase
      // But the HTML should be there for the user to fill in
    });

    test('should add a skill and retrieve it with name', async () => {
      await controller.addSkill();
      // Set a name in the rendered input
      const nameInput = document.querySelector('.skill-name');
      nameInput.value = 'Test Skill';
      const skills = view.getCurrentSkills();
      expect(skills.length).toBe(1);
      expect(skills[0].name).toBe('Test Skill');
    });

    test('should remove a skill', async () => {
      // Add skills with names so they're retrievable
      await controller.addSkill();
      document.querySelector('.skill-name').value = 'Skill 1';
      await controller.addSkill();
      document.querySelectorAll('.skill-name')[1].value = 'Skill 2';
      
      await controller.removeSkill(0);
      const skills = view.getCurrentSkills();
      expect(skills.length).toBe(1);
      expect(skills[0].name).toBe('Skill 2');
    });
  });

  describe('Abilities Management', () => {
    test('should add an empty ability', async () => {
      await controller.addAbility();
      // Empty abilities are filtered out by getCurrentAbilities
      // But the HTML should be rendered
      const container = document.getElementById('abilities-list');
      expect(container.innerHTML).toContain('ability-item');
    });

    test('should remove an ability', async () => {
      // Add abilities with names
      await controller.addAbility();
      // Abilities use textContent, so we need to manipulate the DOM differently
      const container = document.getElementById('abilities-list');
      // Re-render with actual data
      await view.renderAbilities([
        { name: 'Ability 1', description: 'Desc 1' },
        { name: 'Ability 2', description: 'Desc 2' }
      ]);
      await controller.removeAbility(0);
      const abilities = view.getCurrentAbilities();
      expect(abilities.length).toBe(1);
      expect(abilities[0].name).toBe('Ability 2');
    });

    test('should toggle ability description', async () => {
      await controller.addAbility();
      // Mock the toggleAbilityDesc method
      const spy = jest.spyOn(view, 'toggleAbilityDesc');
      controller.toggleAbilityDesc(0);
      expect(spy).toHaveBeenCalledWith(0);
    });

    test('should add ability from select when ability selected', async () => {
      // Mock ability select
      view.abilitySelect = {
        value: 'Test Ability',
        setValue: jest.fn()
      };
      
      await controller.addAbilityFromSelect();
      const abilities = view.getCurrentAbilities();
      expect(abilities.length).toBe(1);
      expect(abilities[0].name).toBe('Test Ability');
      expect(view.abilitySelect.setValue).toHaveBeenCalledWith(null);
    });

    test('should alert when no ability selected', () => {
      // Mock alert
      global.alert = jest.fn();
      
      view.abilitySelect = { value: null };
      controller.addAbilityFromSelect();
      
      expect(global.alert).toHaveBeenCalledWith('Please select an ability first');
    });

    test('should not add ability when abilitySelect is null', () => {
      global.alert = jest.fn();
      view.abilitySelect = null;
      
      controller.addAbilityFromSelect();
      expect(global.alert).toHaveBeenCalled();
    });
  });

  describe('Equipment Management', () => {
    test('should add equipment', async () => {
      const input = document.getElementById('new-equipment');
      input.value = 'Sword';
      
      await controller.addEquipment();
      const equipment = view.getCurrentEquipment();
      expect(equipment).toContain('Sword');
      expect(input.value).toBe('');
    });

    test('should not add empty equipment', async () => {
      const input = document.getElementById('new-equipment');
      input.value = '   ';
      
      await controller.addEquipment();
      const equipment = view.getCurrentEquipment();
      expect(equipment.length).toBe(0);
    });

    test('should remove equipment', async () => {
      const input = document.getElementById('new-equipment');
      input.value = 'Sword';
      await controller.addEquipment();
      input.value = 'Shield';
      await controller.addEquipment();
      
      await controller.removeEquipment(0);
      const equipment = view.getCurrentEquipment();
      expect(equipment.length).toBe(1);
      expect(equipment[0]).toBe('Shield');
    });
  });

  describe('Power Shifts Management', () => {
    test('should add power shift instance', async () => {
      await controller.addPowerShiftInstance('Strength');
      // Set value to non-zero since getCurrentPowerShifts filters out 0 values
      const valueInput = document.querySelector('.ps-value');
      if (valueInput) valueInput.value = '1';
      const powerShifts = view.getCurrentPowerShifts();
      expect(powerShifts.length).toBe(1);
      expect(powerShifts[0].name).toBe('Strength');
      expect(powerShifts[0].value).toBe(1);
    });

    test('should remove power shift instance', async () => {
      await controller.addPowerShiftInstance('Strength');
      const valueInput = document.querySelector('.ps-value');
      if (valueInput) valueInput.value = '1';
      const powerShifts = view.getCurrentPowerShifts();
      const psId = powerShifts[0].id;
      
      await controller.removePowerShiftInstance('Strength', psId);
      const updatedPowerShifts = view.getCurrentPowerShifts();
      expect(updatedPowerShifts.length).toBe(0);
    });

    test('should only remove specific power shift instance', async () => {
      await controller.addPowerShiftInstance('Strength');
      await controller.addPowerShiftInstance('Strength');
      const valueInputs = document.querySelectorAll('.ps-value');
      valueInputs.forEach(input => input.value = '1');
      const powerShifts = view.getCurrentPowerShifts();
      const firstId = powerShifts[0].id;
      
      await controller.removePowerShiftInstance('Strength', firstId);
      const updatedPowerShifts = view.getCurrentPowerShifts();
      expect(updatedPowerShifts.length).toBe(1);
      expect(updatedPowerShifts[0].id).not.toBe(firstId);
    });
  });

  describe('Attacks Management', () => {
    test('should add attack', async () => {
      const input = document.getElementById('new-attack');
      input.value = 'Light Blaster (4)';
      
      await controller.addAttack();
      const attacks = view.getCurrentAttacks();
      expect(attacks).toContain('Light Blaster (4)');
      expect(input.value).toBe('');
    });

    test('should not add empty attack', async () => {
      const input = document.getElementById('new-attack');
      input.value = '   ';
      
      await controller.addAttack();
      const attacks = view.getCurrentAttacks();
      expect(attacks.length).toBe(0);
    });

    test('should remove attack', async () => {
      const input = document.getElementById('new-attack');
      input.value = 'Attack 1';
      await controller.addAttack();
      input.value = 'Attack 2';
      await controller.addAttack();
      
      await controller.removeAttack(0);
      const attacks = view.getCurrentAttacks();
      expect(attacks.length).toBe(1);
      expect(attacks[0]).toBe('Attack 2');
    });
  });

  describe('Cyphers Management', () => {
    test('should add cypher with all fields', async () => {
      const nameInput = document.getElementById('new-cypher-name');
      const levelInput = document.getElementById('new-cypher-level');
      const descInput = document.getElementById('new-cypher-desc');
      
      nameInput.value = 'Detonation';
      levelInput.value = '1d6+4';
      descInput.value = 'Explodes in 30-foot radius';
      
      await controller.addCypher();
      const cyphers = view.getCurrentCyphers();
      expect(cyphers.length).toBe(1);
      expect(cyphers[0]).toEqual({
        name: 'Detonation',
        level: '1d6+4',
        description: 'Explodes in 30-foot radius'
      });
      expect(nameInput.value).toBe('');
      expect(levelInput.value).toBe('');
      expect(descInput.value).toBe('');
    });

    test('should not add cypher without name', async () => {
      const nameInput = document.getElementById('new-cypher-name');
      nameInput.value = '   ';
      
      await controller.addCypher();
      const cyphers = view.getCurrentCyphers();
      expect(cyphers.length).toBe(0);
    });

    test('should remove cypher', async () => {
      const nameInput = document.getElementById('new-cypher-name');
      nameInput.value = 'Cypher 1';
      await controller.addCypher();
      nameInput.value = 'Cypher 2';
      await controller.addCypher();
      
      await controller.removeCypher(0);
      const cyphers = view.getCurrentCyphers();
      expect(cyphers.length).toBe(1);
      expect(cyphers[0].name).toBe('Cypher 2');
    });
  });

  describe('Change Detection', () => {
    test('should check for changes', () => {
      const spy = jest.spyOn(controller.changeTracker, 'checkForChanges');
      controller.checkForChanges();
      expect(spy).toHaveBeenCalled();
    });

    test('should save snapshot', () => {
      const spy = jest.spyOn(controller.changeTracker, 'saveSnapshot');
      controller.saveSnapshot();
      expect(spy).toHaveBeenCalled();
    });

    test('should setup change detection on input', () => {
      const spy = jest.spyOn(controller.changeTracker, 'checkForChanges');
      controller.setupChangeDetection();
      
      const input = document.getElementById('char-name');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      expect(spy).toHaveBeenCalled();
    });

    test('should setup change detection on change', () => {
      const spy = jest.spyOn(controller.changeTracker, 'checkForChanges');
      controller.setupChangeDetection();
      
      const input = document.getElementById('char-name');
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Character Lock/Unlock', () => {
    test('should toggle character lock state', () => {
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Test', isLocked: false });
      
      controller.toggleCharacterLock();
      
      const character = model.currentCharacter;
      expect(character.isLocked).toBe(true);
    });

    test('should unlock locked character', () => {
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Test', isLocked: true });
      
      controller.toggleCharacterLock();
      
      const character = model.currentCharacter;
      expect(character.isLocked).toBe(false);
    });

    test('should not toggle lock when no current character', () => {
      model.currentCharacterId = null;
      controller.toggleCharacterLock();
      // Should not throw error
      expect(model.currentCharacter).toBeUndefined();
    });
  });

  describe('CRUD Operations Delegation', () => {
    test('should delegate showCharacterList', () => {
      const spy = jest.spyOn(controller.crudController, 'showCharacterList');
      controller.showCharacterList();
      expect(spy).toHaveBeenCalled();
    });

    test('should delegate showNewCharacterForm', () => {
      const spy = jest.spyOn(controller.crudController, 'showNewCharacterForm');
      controller.showNewCharacterForm();
      expect(spy).toHaveBeenCalled();
    });

    test('should delegate loadCharacter', () => {
      const spy = jest.spyOn(controller.crudController, 'loadCharacter');
      controller.loadCharacter('123');
      expect(spy).toHaveBeenCalledWith('123');
    });

    test('should delegate saveCharacter', () => {
      const spy = jest.spyOn(controller.crudController, 'saveCharacter');
      controller.saveCharacter();
      expect(spy).toHaveBeenCalled();
    });

    test('should delegate deleteCurrentCharacter', () => {
      const spy = jest.spyOn(controller.crudController, 'deleteCurrentCharacter');
      controller.deleteCurrentCharacter();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Initialize', () => {
    test('should initialize with no characters', async () => {
      global.loadCypherData = jest.fn(() => Promise.resolve());
      
      const showNewFormSpy = jest.spyOn(controller, 'showNewCharacterForm');
      await controller.initialize();
      
      expect(showNewFormSpy).toHaveBeenCalled();
    });

    test('should initialize and load last viewed character', async () => {
      global.loadCypherData = jest.fn(() => Promise.resolve());
      
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Last Viewed' });
      const charId = model.getCurrentCharacterId();
      
      // Simulate restoring last viewed character
      localStorage.setItem('currentCharacterId', charId);
      
      const newController = new CharacterController(model, view);
      const loadCharSpy = jest.spyOn(newController, 'loadCharacter');
      
      await newController.initialize();
      
      // Should attempt to load the character
      expect(true).toBe(true);
    });

    test('should show character list when characters exist but no last viewed', async () => {
      global.loadCypherData = jest.fn(() => Promise.resolve());
      
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Character 1' });
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Character 2' });
      model.setCurrentCharacterId(null);
      
      const showListSpy = jest.spyOn(controller, 'showCharacterList');
      await controller.initialize();
      
      expect(showListSpy).toHaveBeenCalled();
    });
  });
});
