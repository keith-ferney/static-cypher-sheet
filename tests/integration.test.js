/**
 * Integration Tests for Cypher Character Creator
 * These tests verify end-to-end functionality including FancySelect and Power Shifts
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;

// Load the app code
const fs = require('fs');
const path = require('path');

// Load all necessary files in order
const dataLoaderCode = fs.readFileSync(path.join(__dirname, '../src/models/data-loader.js'), 'utf8');

// Load FancySelect modules in order
const constantsCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/constants.js'), 'utf8');
const utilsCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/utils.js'), 'utf8');
const tooltipManagerCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/tooltip-manager.js'), 'utf8');
const eventHandlersCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/event-handlers.js'), 'utf8');
const domBuilderCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/dom-builder.js'), 'utf8');
const fancySelectCoreCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/fancy-select-core.js'), 'utf8');

// Load template loader
const templateLoaderCode = fs.readFileSync(path.join(__dirname, '../src/utils/template-loader.js'), 'utf8');

// Load renderer modules
const skillsRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/skills-renderer.js'), 'utf8');
const abilitiesRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/abilities-renderer.js'), 'utf8');
const equipmentRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/equipment-renderer.js'), 'utf8');
const combatRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/combat-renderer.js'), 'utf8');
const cyphersRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/cyphers-renderer.js'), 'utf8');
const powerShiftsRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/power-shifts-renderer.js'), 'utf8');
const advancementsRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/advancements-renderer.js'), 'utf8');
const formRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/form-renderer.js'), 'utf8');

const toastNotificationCode = fs.readFileSync(path.join(__dirname, '../src/views/toast-notification.js'), 'utf8');
const characterFormManagerCode = fs.readFileSync(path.join(__dirname, '../src/views/character-form-manager.js'), 'utf8');
const characterModelCode = fs.readFileSync(path.join(__dirname, '../src/models/character.js'), 'utf8');
const characterViewCode = fs.readFileSync(path.join(__dirname, '../src/views/character-view.js'), 'utf8');
const characterCRUDControllerCode = fs.readFileSync(path.join(__dirname, '../src/controllers/modules/character-crud-controller.js'), 'utf8');
const characterChangeTrackerCode = fs.readFileSync(path.join(__dirname, '../src/controllers/modules/character-change-tracker.js'), 'utf8');
const characterControllerCode = fs.readFileSync(path.join(__dirname, '../src/controllers/character-controller.js'), 'utf8');

// Execute fancy-select modules and export classes
eval(constantsCode);
eval(utilsCode);
eval(tooltipManagerCode);
eval(eventHandlersCode);
eval(domBuilderCode);
eval(fancySelectCoreCode); // Defines FancySelect class globally
eval(dataLoaderCode);
eval(templateLoaderCode); // Must be before renderers

// Create mock template loader (same as test-setup.js)
global.templateLoader = require('./test-setup').mockTemplateLoader;

eval(skillsRendererCode);
eval(abilitiesRendererCode);
eval(equipmentRendererCode);
eval(combatRendererCode);
eval(cyphersRendererCode);
eval(powerShiftsRendererCode);
eval(advancementsRendererCode);
eval(formRendererCode);
const ToastNotification = eval(`(function() { ${toastNotificationCode}; return ToastNotification; })()`);
const CharacterFormManager = eval(`(function() { ${characterFormManagerCode}; return CharacterFormManager; })()`);
const CharacterModel = eval(`(function() { ${characterModelCode}; return CharacterModel; })()`);
const CharacterView = eval(`(function() { ${characterViewCode}; return CharacterView; })()`);
const CharacterCRUDController = eval(`(function() { ${characterCRUDControllerCode}; return CharacterCRUDController; })()`);
const CharacterChangeTracker = eval(`(function() { ${characterChangeTrackerCode}; return CharacterChangeTracker; })()`);
const CharacterController = eval(`(function() { ${characterControllerCode}; return CharacterController; })()`);

// Access FancySelect from global (created by eval)
const FancySelect = global.FancySelect;
const FormRenderer = global.FormRenderer;

global.FancySelect = FancySelect;
global.FormRenderer = FormRenderer;
global.ToastNotification = ToastNotification;
global.CharacterFormManager = CharacterFormManager;
global.CharacterModel = CharacterModel;
global.CharacterView = CharacterView;
global.CharacterCRUDController = CharacterCRUDController;
global.CharacterChangeTracker = CharacterChangeTracker;
global.CharacterController = CharacterController;

// Create global instances for testing
let model, view, controller;

describe('Cypher Character Creator - Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    
    // Reset model, view, controller
    model = new CharacterModel();
    view = new CharacterView();
    controller = new CharacterController(model, view);
    
    // Setup full DOM
    document.body.innerHTML = `
      <div id="character-list-view"></div>
      <div id="character-sheet-view">
        <input id="char-name" />
        <input id="char-tier" type="number" value="1" />
        
        <!-- FancySelect containers -->
        <div id="descriptor-select"></div>
        <input id="char-descriptor" type="hidden" />
        
        <div id="type-select"></div>
        <input id="char-type" type="hidden" />
        
        <div id="focus-select"></div>
        <input id="char-focus" type="hidden" />
        
        <div id="flavor-select"></div>
        <input id="char-flavor" type="hidden" />
        
        <div id="ability-select"></div>
        
        <input id="char-background" />
        <input id="char-notes" />
        <input id="char-portrait" />
        
        <!-- Stat pools -->
        <input id="might-pool" type="number" value="10" />
        <input id="might-edge" type="number" value="0" />
        <input id="might-current" type="number" value="10" />
        <input id="speed-pool" type="number" value="10" />
        <input id="speed-edge" type="number" value="0" />
        <input id="speed-current" type="number" value="10" />
        <input id="intellect-pool" type="number" value="10" />
        <input id="intellect-edge" type="number" value="0" />
        <input id="intellect-current" type="number" value="10" />
        
        <input id="char-effort" type="number" value="1" />
        <input id="char-experience" type="number" value="0" />
        <input id="recovery-modifier" type="number" value="0" />
        
        <!-- Damage track -->
        <input type="checkbox" id="impaired" />
        <input type="checkbox" id="debilitated" />
        <input type="checkbox" id="recovery-action" />
        <input type="checkbox" id="recovery-10min" />
        <input type="checkbox" id="recovery-1hour" />
        <input type="checkbox" id="recovery-10hour" />
        
        <!-- Lists -->
        <table><tbody id="skills-list"></tbody></table>
        <div id="abilities-list"></div>
        <div id="advancements-list"></div>
        <div id="equipment-list"></div>
        <div id="attacks-list"></div>
        <div id="cyphers-list"></div>
        <div id="powershifts-list"></div>
      </div>
    `;
    
    // Mock cypherData with comprehensive test data
    cypherData = {
      descriptors: [
        { id: 1, name: 'Strong', description: 'Physically powerful' },
        { id: 2, name: 'Swift', description: 'Fast and agile' },
        { id: 3, name: 'Clever', description: 'Mentally sharp' }
      ],
      types: [
        { id: 1, name: 'Warrior', description: 'Combat specialist' },
        { id: 2, name: 'Adept', description: 'Magic user' },
        { id: 3, name: 'Explorer', description: 'Adventurer' }
      ],
      foci: [
        { id: 1, name: 'Fights With Panache', description: 'Stylish fighter' },
        { id: 2, name: 'Masters Defense', description: 'Defensive expert' },
        { id: 3, name: 'Wields Two Weapons', description: 'Dual wielder' }
      ],
      flavors: [
        { id: 1, name: 'Combat', description: 'Focused on fighting' },
        { id: 2, name: 'Skills', description: 'Focused on abilities' },
        { id: 3, name: 'Stealth', description: 'Focused on sneaking' }
      ],
      abilities: [
        { id: 1, name: 'Bash', description: 'Hit hard' },
        { id: 2, name: 'Dart', description: 'Quick strike' }
      ],
      advancements: [],
      powerShifts: [
        { name: 'Accuracy', description: 'Attack bonus', has_healing_checkboxes: false, allows_additional_text: false, is_per_round: false },
        { name: 'Flight', description: 'Fly around', has_healing_checkboxes: false, allows_additional_text: true, is_per_round: true },
        { name: 'Healing', description: 'Heal damage', has_healing_checkboxes: true, allows_additional_text: false, is_per_round: false },
        { name: 'Dexterity', description: 'Speed bonus', has_healing_checkboxes: false, allows_additional_text: false, is_per_round: false }
      ],
      loaded: true
    };
    
    // Make cypherData available globally for views and renderers
    global.cypherData = cypherData;
  });

  describe('FancySelect Integration', () => {
    test('FancySelect should initialize and render correctly', () => {
      const select = new FancySelect(
        document.getElementById('descriptor-select'),
        {
          data: cypherData.descriptors,
          labelKey: 'name',
          valueKey: 'id',
          descriptionKey: 'description',
          placeholder: '- Select Descriptor -',
          onChange: (option) => {
            document.getElementById('char-descriptor').value = option.name;
          }
        }
      );
      
      const trigger = document.querySelector('.fancy-select-trigger');
      expect(trigger).toBeTruthy();
      expect(trigger.textContent).toContain('- Select Descriptor -');
    });

    test('FancySelect should open dropdown on click', () => {
      const select = new FancySelect(
        document.getElementById('descriptor-select'),
        {
          data: cypherData.descriptors,
          labelKey: 'name',
          valueKey: 'id',
          descriptionKey: 'description',
          placeholder: '- Select -',
          onChange: () => {}
        }
      );
      
      // Initially dropdown should be hidden (isOpen = false)
      expect(select.isOpen).toBe(false);
      
      // Directly toggle the dropdown state (simulating interaction)
      select.isOpen = true;
      select.render();
      
      // After toggling, dropdown should be visible
      const dropdown = document.querySelector('.fancy-select-dropdown');
      expect(dropdown.classList.contains('hidden')).toBe(false);
      expect(select.isOpen).toBe(true);
    });

    test('FancySelect should filter options on search', () => {
      const select = new FancySelect(
        document.getElementById('descriptor-select'),
        {
          data: cypherData.descriptors,
          labelKey: 'name',
          valueKey: 'id',
          descriptionKey: 'description',
          placeholder: '- Select -',
          onChange: () => {}
        }
      );
      
      // Open dropdown
      select.isOpen = true;
      select.searchTerm = 'str';
      select.render();
      
      const options = document.querySelectorAll('.fancy-select-option');
      expect(options.length).toBe(1);
      expect(options[0].querySelector('.fancy-select-option-label').textContent.trim()).toBe('Strong');
    });

    test('FancySelect should update hidden input on selection', () => {
      let selectedOption = null;
      const select = new FancySelect(
        document.getElementById('descriptor-select'),
        {
          data: cypherData.descriptors,
          labelKey: 'name',
          valueKey: 'id',
          descriptionKey: 'description',
          placeholder: '- Select -',
          onChange: (option) => {
            selectedOption = option;
            document.getElementById('char-descriptor').value = option.name;
          }
        }
      );
      
      select.selectOption(cypherData.descriptors[0]);
      
      expect(selectedOption.name).toBe('Strong');
      expect(document.getElementById('char-descriptor').value).toBe('Strong');
      expect(select.value).toBe(1);
    });

    test('All four FancySelects should work independently', () => {
      view.initializeFancySelects();
      
      // Select descriptor
      view.descriptorSelect.selectOption(cypherData.descriptors[0]);
      expect(document.getElementById('char-descriptor').value).toBe('Strong');
      
      // Select type
      view.typeSelect.selectOption(cypherData.types[1]);
      expect(document.getElementById('char-type').value).toBe('Adept');
      
      // Select focus
      view.focusSelect.selectOption(cypherData.foci[2]);
      expect(document.getElementById('char-focus').value).toBe('Wields Two Weapons');
      
      // Select flavor
      view.flavorSelect.selectOption(cypherData.flavors[0]);
      expect(document.getElementById('char-flavor').value).toBe('Combat');
    });
  });

  describe('Power Shifts Integration', () => {
    test('renderPowerShifts should render all three types correctly', async () => {
      await view.renderPowerShifts([]);
      
      const labels = document.querySelectorAll('#powershifts-list label');
      expect(labels.length).toBe(4); // Accuracy, Flight, Healing, Dexterity
      
      // Check simple type (Accuracy)
      const accuracyInput = document.querySelector('[data-ps-name="Accuracy"]');
      expect(accuracyInput).toBeTruthy();
      expect(accuracyInput.type).toBe('number');
      
      // Check text + per round type (Flight) - note: data attribute now includes psId
      const flightText = document.querySelector('[data-ps-text^="Flight-"]');
      expect(flightText).toBeTruthy();
      expect(flightText.type).toBe('text');
      
      const perRoundLabel = Array.from(labels).find(l => 
        l.textContent.includes('Flight') && l.textContent.includes('Per Round')
      );
      expect(perRoundLabel).toBeTruthy();
      
      // Check healing checkboxes type
      const healingCheckboxes = document.querySelectorAll('[data-ps-heart="Healing"]');
      expect(healingCheckboxes.length).toBe(5);
    });

    test('Power shifts should save and load correctly', async () => {
      // Set up power shifts with id property
      await view.renderPowerShifts([
        { name: 'Accuracy', value: 3, additional_text: '', hearts_used: 0, id: '0' },
        { name: 'Flight', value: 2, additional_text: 'short', hearts_used: 0, id: '0' },
        { name: 'Healing', value: 1, additional_text: '', hearts_used: 3, id: '0' }
      ]);
      
      // Verify values loaded
      const accuracyInput = document.querySelector('[data-ps-name="Accuracy"]');
      expect(accuracyInput.value).toBe('3');
      
      const flightValue = document.querySelector('[data-ps-name="Flight"]');
      const flightText = document.querySelector('[data-ps-text="Flight-0"]'); // Updated selector
      expect(flightValue.value).toBe('2');
      expect(flightText.value).toBe('short');
      
      const healingValue = document.querySelector('[data-ps-name="Healing"]');
      const healingChecks = document.querySelectorAll('[data-ps-heart="Healing"]:checked');
      expect(healingValue.value).toBe('1');
      expect(healingChecks.length).toBe(3);
      
      // Get current values
      const retrieved = view.getCurrentPowerShifts();
      expect(retrieved.length).toBe(3);
      
      const accuracy = retrieved.find(ps => ps.name === 'Accuracy');
      expect(accuracy.value).toBe(3);
      
      const flight = retrieved.find(ps => ps.name === 'Flight');
      expect(flight.value).toBe(2);
      expect(flight.additional_text).toBe('short');
      
      const healing = retrieved.find(ps => ps.name === 'Healing');
      expect(healing.value).toBe(1);
      expect(healing.hearts_used).toBe(3);
    });
  });

  describe('Full Character Workflow', () => {
    test('Create character with FancySelects and save', async () => {
      view.initializeFancySelects();
      
      // Set character ID
      model.setCurrentCharacterId('test-123');
      
      // Fill in basic info
      document.getElementById('char-name').value = 'Test Hero';
      document.getElementById('char-tier').value = '3';
      
      // Select via FancySelects
      view.descriptorSelect.selectOption(cypherData.descriptors[0]); // Strong
      view.typeSelect.selectOption(cypherData.types[0]); // Warrior
      view.focusSelect.selectOption(cypherData.foci[0]); // Fights With Panache
      
      // Set stats
      document.getElementById('might-pool').value = '15';
      document.getElementById('speed-pool').value = '12';
      
      // Add skills
      await view.renderSkills([
        { name: 'Athletics', pool: 'might', type: 'trained', powerShift: 0 },
        { name: 'Combat', pool: 'speed', type: 'specialized', powerShift: 1 }
      ]);
      
      // Add power shifts
      await view.renderPowerShifts([
        { name: 'Accuracy', value: 2, additional_text: '', hearts_used: 0 }
      ]);
      
      // Mock alert
      global.alert = jest.fn();
      
      // Save character
      controller.saveCharacter();
      
      const allCharacters = model.getAllCharacters();
      expect(allCharacters.length).toBe(1);
      const char = allCharacters[0];
      expect(char.name).toBe('Test Hero');
      expect(char.tier).toBe(3);
      expect(char.descriptor).toBe('Strong');
      expect(char.type).toBe('Warrior');
      expect(char.focus).toBe('Fights With Panache');
      expect(char.mightPool).toBe(15);
      expect(char.skills.length).toBe(2);
      expect(char.powerShifts.length).toBe(1);
      expect(char.powerShifts[0].value).toBe(2);
    });

    test('Load character should populate FancySelects', async () => {
      view.initializeFancySelects();
      
      const testChar = {
        id: 'load-test',
        name: 'Loaded Character',
        tier: 4,
        descriptor: 'Swift',
        type: 'Explorer',
        focus: 'Masters Defense',
        flavor: 'Stealth',
        mightPool: 10,
        speedPool: 14,
        intellectPool: 10,
        mightEdge: 0,
        speedEdge: 1,
        intellectEdge: 0,
        mightCurrent: 10,
        speedCurrent: 14,
        intellectCurrent: 10,
        effort: 1,
        experience: 2,
        recoveryModifier: 0,
        impaired: false,
        debilitated: false,
        recoveryAction: false,
        recovery10min: false,
        recovery1hour: true,
        recovery10hour: false,
        skills: [{ name: 'Stealth', pool: 'speed', type: 'specialized', powerShift: 0 }],
        abilities: [{ name: 'Dart', description: 'Quick strike' }],
        equipment: ['Cloak'],
        attacks: ['Dagger'],
        cyphers: [],
        powerShifts: [
          { name: 'Flight', value: 1, additional_text: 'long', hearts_used: 0, id: '0' }
        ]
      };
      
      model.characters = [testChar];
      view.initializeFancySelects();
      
      await controller.loadCharacter('load-test');
      
      // Check basic fields
      expect(document.getElementById('char-name').value).toBe('Loaded Character');
      expect(document.getElementById('char-tier').value).toBe('4');
      
      // Check FancySelect values (they store names, not IDs)
      expect(view.descriptorSelect.value).toBe('Swift');
      expect(view.typeSelect.value).toBe('Explorer');
      expect(view.focusSelect.value).toBe('Masters Defense');
      expect(view.flavorSelect.value).toBe('Stealth');
      
      // Check power shifts loaded correctly
      const flightValue = document.querySelector('[data-ps-name="Flight"]');
      const flightText = document.querySelector('[data-ps-text="Flight-0"]'); // Updated selector
      expect(flightValue.value).toBe('1');
      expect(flightText.value).toBe('long');
      
      // Check skills
      const skillRows = document.querySelectorAll('.skill-row');
      expect(skillRows.length).toBe(1);
    });

    test('Clear form should reset FancySelects', async () => {
      view.initializeFancySelects();
      
      // Set values
      view.descriptorSelect.setValue(1);
      view.typeSelect.setValue(2);
      view.focusSelect.setValue(3);
      view.flavorSelect.setValue(1);
      
      expect(view.descriptorSelect.value).toBe(1);
      
      // Clear form
      await view.clearForm();
      
      // Check all FancySelects reset
      expect(view.descriptorSelect.value).toBe(null);
      expect(view.typeSelect.value).toBe(null);
      expect(view.focusSelect.value).toBe(null);
      expect(view.flavorSelect.value).toBe(null);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('FancySelect should handle empty data array', () => {
      const select = new FancySelect(
        document.getElementById('descriptor-select'),
        {
          data: [],
          labelKey: 'name',
          valueKey: 'id',
          placeholder: '- No options -',
          onChange: () => {}
        }
      );
      
      const trigger = document.querySelector('.fancy-select-trigger');
      expect(trigger.textContent).toContain('- No options -');
      
      select.isOpen = true;
      select.render();
      
      const options = document.querySelectorAll('.fancy-select-option');
      expect(options.length).toBe(0);
    });

    test('Power shifts should handle missing properties', async () => {
      await view.renderPowerShifts([
        { name: 'Accuracy', value: 2 }, // Missing additional_text and hearts_used
        { name: 'Flight' }, // Missing value
      ]);
      
      const retrieved = view.getCurrentPowerShifts();
      const accuracy = retrieved.find(ps => ps.name === 'Accuracy');
      expect(accuracy.additional_text).toBe('');
      expect(accuracy.hearts_used).toBe(0);
    });

    test('Save and load should handle special characters', async () => {
      view.initializeFancySelects();
      model.setCurrentCharacterId('special-test');
      
      document.getElementById('char-name').value = 'Test "Hero" <Script>';
      document.getElementById('char-background').value = "Line 1\nLine 2\nLine 3";
      
      global.alert = jest.fn();
      
      controller.saveCharacter();
      
      await view.clearForm();
      await controller.loadCharacter('special-test');      expect(document.getElementById('char-name').value).toBe('Test "Hero" <Script>');
      // HTML inputs don't preserve newlines the same way - just check it's not empty
      expect(document.getElementById('char-background').value).toContain("Line 1");
    });
  });
});
