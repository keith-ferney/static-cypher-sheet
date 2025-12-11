/**
 * Character Workflow Integration Tests
 * Tests for full character creation, loading, and management workflows
 */

require('./test-setup');

// Access classes from global scope (set by test-setup)
const CharacterModel = global.CharacterModel;
const CharacterView = global.CharacterView;
const CharacterController = global.CharacterController;

// Create global instances for testing
let model, view, controller, cypherData;

describe('Full Character Workflow Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    
    // Reset model, view, controller
    model = new CharacterModel();
    view = new CharacterView();
    controller = new CharacterController(model, view);
    
    // Setup full DOM
    document.body.innerHTML = `
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
    
    // Mock cypherData
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
        { name: 'Flight', description: 'Fly around', has_healing_checkboxes: false, allows_additional_text: true, is_per_round: true }
      ],
      loaded: true
    };
  });

  test('Create character with FancySelects and save', () => {
    // Make cypherData global for initialization
    global.cypherData = cypherData;
    
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
    view.renderSkills([
      { name: 'Athletics', pool: 'might', type: 'trained', powerShift: 0 },
      { name: 'Combat', pool: 'speed', type: 'specialized', powerShift: 1 }
    ]);
    
    // Add power shifts
    view.renderPowerShifts([
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

  test('Load character should populate FancySelects', () => {
    // Make cypherData global for initialization
    global.cypherData = cypherData;
    
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
        { name: 'Flight', value: 1, additional_text: 'long', hearts_used: 0 }
      ]
    };
    
    model.characters = [testChar];
    view.initializeFancySelects();
    
    controller.loadCharacter('load-test');
    
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
    const flightText = document.querySelector('[data-ps-text="Flight"]');
    expect(flightValue.value).toBe('1');
    expect(flightText.value).toBe('long');
    
    // Check skills
    const skillRows = document.querySelectorAll('.skill-row');
    expect(skillRows.length).toBe(1);
  });

  test('Clear form should reset FancySelects', () => {
    // Make cypherData global for initialization
    global.cypherData = cypherData;
    
    view.initializeFancySelects();
    
    // Set values
    view.descriptorSelect.setValue(1);
    view.typeSelect.setValue(2);
    view.focusSelect.setValue(3);
    view.flavorSelect.setValue(1);
    
    expect(view.descriptorSelect.value).toBe(1);
    
    // Clear form
    view.clearForm();
    
    // Check all FancySelects reset
    expect(view.descriptorSelect.value).toBe(null);
    expect(view.typeSelect.value).toBe(null);
    expect(view.focusSelect.value).toBe(null);
    expect(view.flavorSelect.value).toBe(null);
  });
});
