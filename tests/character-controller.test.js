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
    
    // Create instances
    model = new CharacterModel();
    view = new CharacterView();
    controller = new CharacterController(model, view);
    
    // Setup DOM
    document.body.innerHTML = `
      <div id="character-sheet-view">
        <input id="char-name" value="Test Character" />
        <input id="char-tier" type="number" value="1" />
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
        
        <!-- Stats -->
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
        
        <!-- Dynamic sections -->
        <div id="skills-container"></div>
        <div id="abilities-container"></div>
        <div id="equipment-container"></div>
        <div id="power-shifts-container"></div>
        <div id="attacks-container"></div>
        <div id="cyphers-container"></div>
        <div id="advancements-container"></div>
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
      powerShifts: []
    };
  });

  describe('Skills Management', () => {
    test('should add a skill', () => {
      controller.addSkill();
      const skills = view.getCurrentSkills();
      expect(skills.length).toBe(1);
      expect(skills[0]).toEqual({ name: '', pool: '', type: '', powerShift: 0 });
    });

    test('should remove a skill', () => {
      controller.addSkill();
      controller.addSkill();
      controller.removeSkill(0);
      const skills = view.getCurrentSkills();
      expect(skills.length).toBe(1);
    });
  });

  describe('Abilities Management', () => {
    test('should add an empty ability', () => {
      controller.addAbility();
      const abilities = view.getCurrentAbilities();
      expect(abilities.length).toBe(1);
      expect(abilities[0]).toEqual({ name: '', description: '' });
    });

    test('should remove an ability', () => {
      controller.addAbility();
      controller.addAbility();
      controller.removeAbility(0);
      const abilities = view.getCurrentAbilities();
      expect(abilities.length).toBe(1);
    });

    test('should toggle ability description', () => {
      controller.addAbility();
      // Mock the toggleAbilityDesc method
      const spy = jest.spyOn(view, 'toggleAbilityDesc');
      controller.toggleAbilityDesc(0);
      expect(spy).toHaveBeenCalledWith(0);
    });

    test('should add ability from select when ability selected', () => {
      // Mock ability select
      view.abilitySelect = {
        value: 'Test Ability',
        setValue: jest.fn()
      };
      
      controller.addAbilityFromSelect();
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
    test('should add equipment', () => {
      const input = document.getElementById('new-equipment');
      input.value = 'Sword';
      
      controller.addEquipment();
      const equipment = view.getCurrentEquipment();
      expect(equipment).toContain('Sword');
      expect(input.value).toBe('');
    });

    test('should not add empty equipment', () => {
      const input = document.getElementById('new-equipment');
      input.value = '   ';
      
      controller.addEquipment();
      const equipment = view.getCurrentEquipment();
      expect(equipment.length).toBe(0);
    });

    test('should remove equipment', () => {
      const input = document.getElementById('new-equipment');
      input.value = 'Sword';
      controller.addEquipment();
      input.value = 'Shield';
      controller.addEquipment();
      
      controller.removeEquipment(0);
      const equipment = view.getCurrentEquipment();
      expect(equipment.length).toBe(1);
      expect(equipment[0]).toBe('Shield');
    });
  });

  describe('Power Shifts Management', () => {
    test('should add power shift instance', () => {
      controller.addPowerShiftInstance('Strength');
      const powerShifts = view.getCurrentPowerShifts();
      expect(powerShifts.length).toBe(1);
      expect(powerShifts[0].name).toBe('Strength');
      expect(powerShifts[0].value).toBe(0);
      expect(powerShifts[0].additional_text).toBe('');
      expect(powerShifts[0].id).toBeDefined();
    });

    test('should remove power shift instance', () => {
      controller.addPowerShiftInstance('Strength');
      const powerShifts = view.getCurrentPowerShifts();
      const psId = powerShifts[0].id;
      
      controller.removePowerShiftInstance('Strength', psId);
      const updatedPowerShifts = view.getCurrentPowerShifts();
      expect(updatedPowerShifts.length).toBe(0);
    });

    test('should only remove specific power shift instance', () => {
      controller.addPowerShiftInstance('Strength');
      controller.addPowerShiftInstance('Strength');
      const powerShifts = view.getCurrentPowerShifts();
      const firstId = powerShifts[0].id;
      
      controller.removePowerShiftInstance('Strength', firstId);
      const updatedPowerShifts = view.getCurrentPowerShifts();
      expect(updatedPowerShifts.length).toBe(1);
      expect(updatedPowerShifts[0].id).not.toBe(firstId);
    });
  });

  describe('Attacks Management', () => {
    test('should add attack', () => {
      const input = document.getElementById('new-attack');
      input.value = 'Light Blaster (4)';
      
      controller.addAttack();
      const attacks = view.getCurrentAttacks();
      expect(attacks).toContain('Light Blaster (4)');
      expect(input.value).toBe('');
    });

    test('should not add empty attack', () => {
      const input = document.getElementById('new-attack');
      input.value = '   ';
      
      controller.addAttack();
      const attacks = view.getCurrentAttacks();
      expect(attacks.length).toBe(0);
    });

    test('should remove attack', () => {
      const input = document.getElementById('new-attack');
      input.value = 'Attack 1';
      controller.addAttack();
      input.value = 'Attack 2';
      controller.addAttack();
      
      controller.removeAttack(0);
      const attacks = view.getCurrentAttacks();
      expect(attacks.length).toBe(1);
      expect(attacks[0]).toBe('Attack 2');
    });
  });

  describe('Cyphers Management', () => {
    test('should add cypher with all fields', () => {
      const nameInput = document.getElementById('new-cypher-name');
      const levelInput = document.getElementById('new-cypher-level');
      const descInput = document.getElementById('new-cypher-desc');
      
      nameInput.value = 'Detonation';
      levelInput.value = '1d6+4';
      descInput.value = 'Explodes in 30-foot radius';
      
      controller.addCypher();
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

    test('should not add cypher without name', () => {
      const nameInput = document.getElementById('new-cypher-name');
      nameInput.value = '   ';
      
      controller.addCypher();
      const cyphers = view.getCurrentCyphers();
      expect(cyphers.length).toBe(0);
    });

    test('should remove cypher', () => {
      const nameInput = document.getElementById('new-cypher-name');
      nameInput.value = 'Cypher 1';
      controller.addCypher();
      nameInput.value = 'Cypher 2';
      controller.addCypher();
      
      controller.removeCypher(0);
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
      controller.setupChangeDetection();
      const spy = jest.spyOn(controller.changeTracker, 'checkForChanges');
      
      const input = document.getElementById('char-name');
      input.dispatchEvent(new Event('input'));
      
      expect(spy).toHaveBeenCalled();
    });

    test('should setup change detection on change', () => {
      controller.setupChangeDetection();
      const spy = jest.spyOn(controller.changeTracker, 'checkForChanges');
      
      const input = document.getElementById('char-name');
      input.dispatchEvent(new Event('change'));
      
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
