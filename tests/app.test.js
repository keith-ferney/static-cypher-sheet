/**
 * Tests for Cypher Character Creator
 * These tests verify all core functionality works correctly
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
const fancySelectCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select.js'), 'utf8');
const characterModelCode = fs.readFileSync(path.join(__dirname, '../src/models/character.js'), 'utf8');
const characterViewCode = fs.readFileSync(path.join(__dirname, '../src/views/character-view.js'), 'utf8');
const characterControllerCode = fs.readFileSync(path.join(__dirname, '../src/controllers/character-controller.js'), 'utf8');

// Execute the code in the global scope and extract classes
eval(dataLoaderCode);
const FancySelect = eval(`(function() { ${fancySelectCode}; return FancySelect; })()`);
const CharacterModel = eval(`(function() { ${characterModelCode}; return CharacterModel; })()`);
const CharacterView = eval(`(function() { ${characterViewCode}; return CharacterView; })()`);
const CharacterController = eval(`(function() { ${characterControllerCode}; return CharacterController; })()`);

// Make them global
global.FancySelect = FancySelect;
global.CharacterModel = CharacterModel;
global.CharacterView = CharacterView;
global.CharacterController = CharacterController;

// Create global instances for testing
let model, view, controller;

describe('Cypher Character Creator - Core Functions', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset model, view, controller
    model = new CharacterModel();
    view = new CharacterView();
    controller = new CharacterController(model, view);
    
    // Setup DOM - All elements needed by saveCharacter/loadCharacter
    document.body.innerHTML = `
      <table>
        <tbody id="skills-list"></tbody>
      </table>
      <div id="abilities-list"></div>
      <div id="equipment-list"></div>
      <div id="attacks-list"></div>
      <div id="cyphers-list"></div>
      <div id="powershifts-list"></div>
      <input id="char-name" />
      <input id="char-tier" />
      <select id="char-descriptor"></select>
      <select id="char-type"></select>
      <select id="char-focus"></select>
      <select id="char-flavor"></select>
      <input id="char-background" />
      <input id="char-notes" />
      <input id="char-portrait" />
      <input id="might-pool" />
      <input id="might-edge" />
      <input id="might-current" />
      <input id="speed-pool" />
      <input id="speed-edge" />
      <input id="speed-current" />
      <input id="intellect-pool" />
      <input id="intellect-edge" />
      <input id="intellect-current" />
      <input id="char-effort" />
      <input id="char-experience" />
      <input id="recovery-modifier" />
      <input type="checkbox" id="impaired" />
      <input type="checkbox" id="debilitated" />
      <input type="checkbox" id="recovery-action" />
      <input type="checkbox" id="recovery-10min" />
      <input type="checkbox" id="recovery-1hour" />
      <input type="checkbox" id="recovery-10hour" />
      <div id="character-list-view"></div>
      <div id="character-sheet-view"></div>
    `;
    
    // Mock cypherData
    cypherData = {
      descriptors: [],
      types: [],
      foci: [],
      flavors: [],
      abilities: [{id: 1, name: 'Test Ability', description: 'Test desc'}],
      advancements: [],
      powerShifts: [
        {name: 'Accuracy', description: 'Test', has_healing_checkboxes: false, allows_additional_text: false, is_per_round: false},
        {name: 'Flight', description: 'Fly', has_healing_checkboxes: false, allows_additional_text: true, is_per_round: true}
      ],
      loaded: true
    };
  });

  describe('Skills Management', () => {
    test('renderSkills should handle empty array', () => {
      view.renderSkills([]);
      const container = document.getElementById('skills-list');
      expect(container.innerHTML).toBe('');
    });

    test('renderSkills should render skill rows', () => {
      const skills = [
        { name: 'Lockpicking', pool: 'speed', type: 'trained', powerShift: 0 },
        { name: 'History', pool: 'intellect', type: 'specialized', powerShift: 1 }
      ];
      
      view.renderSkills(skills);
      
      const rows = document.querySelectorAll('.skill-row');
      expect(rows.length).toBe(2);
      expect(rows[0].querySelector('.skill-name').value).toBe('Lockpicking');
      expect(rows[0].querySelector('.skill-pool').value).toBe('speed');
      expect(rows[1].querySelector('.skill-type').value).toBe('specialized');
    });

    test('getCurrentSkills should return skills from DOM', () => {
      const skills = [
        { name: 'Climbing', pool: 'might', type: 'trained', powerShift: 0 }
      ];
      
      view.renderSkills(skills);
      const retrieved = view.getCurrentSkills();
      
      expect(retrieved.length).toBe(1);
      expect(retrieved[0].name).toBe('Climbing');
      expect(retrieved[0].pool).toBe('might');
    });

    test('getCurrentSkills should filter out skills without names', () => {
      view.renderSkills([
        { name: 'Valid Skill', pool: 'might', type: 'trained', powerShift: 0 },
        { name: '', pool: 'speed', type: 'trained', powerShift: 0 }
      ]);
      
      const retrieved = view.getCurrentSkills();
      expect(retrieved.length).toBe(1);
      expect(retrieved[0].name).toBe('Valid Skill');
    });

    test('renderSkills should normalize old string format', () => {
      view.renderSkills(['Old Skill String']);
      
      const rows = document.querySelectorAll('.skill-row');
      expect(rows.length).toBe(1);
      expect(rows[0].querySelector('.skill-name').value).toBe('Old Skill String');
      expect(rows[0].querySelector('.skill-pool').value).toBe('');
    });
  });

  describe('Abilities Management', () => {
    test('renderAbilities should handle empty array', () => {
      view.renderAbilities([]);
      const container = document.getElementById('abilities-list');
      expect(container.innerHTML).toBe('');
    });

    test('renderAbilities should render ability items', () => {
      const abilities = [
        { name: 'Fire Blast', description: 'Shoot fire' },
        { name: 'Ice Shield', description: 'Create ice barrier' }
      ];
      
      view.renderAbilities(abilities);
      
      const items = document.querySelectorAll('.ability-item');
      expect(items.length).toBe(2);
      expect(items[0].querySelector('.ability-name').value).toBe('Fire Blast');
      expect(items[1].querySelector('.ability-desc').value).toBe('Create ice barrier');
    });

    test('getCurrentAbilities should return abilities from DOM', () => {
      view.renderAbilities([{ name: 'Test', description: 'Test desc' }]);
      
      const retrieved = view.getCurrentAbilities();
      expect(retrieved.length).toBe(1);
      expect(retrieved[0].name).toBe('Test');
    });

    test('getCurrentAbilities should filter out abilities without names', () => {
      view.renderAbilities([
        { name: 'Valid Ability', description: 'desc' },
        { name: '', description: 'empty name' }
      ]);
      
      const retrieved = view.getCurrentAbilities();
      expect(retrieved.length).toBe(1);
    });
  });

  describe('Power Shifts Management', () => {
    test('renderPowerShifts should handle empty/undefined input', () => {
      view.renderPowerShifts(undefined);
      const container = document.getElementById('powershifts-list');
      // Should render all available power shifts with value 0
      expect(container.innerHTML).toContain('Accuracy');
      expect(container.innerHTML).toContain('Flight');
    });

    test('renderPowerShifts should populate existing values', () => {
      view.renderPowerShifts([
        { name: 'Accuracy', value: 3 }
      ]);
      
      const valueInputs = document.querySelectorAll('.ps-value');
      const accuracyInput = Array.from(valueInputs).find(input => 
        input.dataset.psName === 'Accuracy'
      );
      
      expect(accuracyInput.value).toBe('3');
    });

    test('getCurrentPowerShifts should only return power shifts with values > 0', () => {
      view.renderPowerShifts([
        { name: 'Accuracy', value: 2 },
        { name: 'Flight', value: 0 }
      ]);
      
      const retrieved = view.getCurrentPowerShifts();
      expect(retrieved.length).toBe(1);
      expect(retrieved[0].name).toBe('Accuracy');
      expect(retrieved[0].value).toBe(2);
    });
  });

  describe('Character Save/Load', () => {
    test('saveCharacter should save to localStorage', () => {
      model.setCurrentCharacterId('12345');
      document.getElementById('char-name').value = 'Test Hero';
      document.getElementById('char-tier').value = '3';
      
      view.renderSkills([{ name: 'Combat', pool: 'might', type: 'trained', powerShift: 0 }]);
      view.renderAbilities([{ name: 'Super Strength', description: 'Very strong' }]);
      
      // Mock alert
      global.alert = jest.fn();
      
      controller.saveCharacter();
      
      const allCharacters = model.getAllCharacters();
      expect(allCharacters.length).toBe(1);
      expect(allCharacters[0].name).toBe('Test Hero');
      expect(allCharacters[0].tier).toBe(3);
      expect(allCharacters[0].skills.length).toBe(1);
      expect(allCharacters[0].abilities.length).toBe(1);
      
      const stored = localStorage.getItem('cypherCharacters');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored);
      expect(parsed[0].name).toBe('Test Hero');
    });

    test('loadCharacter should populate form from character data', () => {
      const character = {
        id: '999',
        name: 'Loaded Hero',
        tier: 5,
        descriptor: 'Strong',
        type: 'Warrior',
        focus: 'Fights',
        mightPool: 15,
        speedPool: 10,
        intellectPool: 8,
        skills: [
          { name: 'Swords', pool: 'might', type: 'specialized', powerShift: 1 }
        ],
        abilities: [
          { name: 'Bash', description: 'Hit hard' }
        ],
        equipment: ['Sword', 'Shield'],
        attacks: ['Slash'],
        cyphers: [],
        powerShifts: []
      };
      
      model.characters = [character];
      
      controller.loadCharacter('999');
      
      expect(document.getElementById('char-name').value).toBe('Loaded Hero');
      expect(document.getElementById('char-tier').value).toBe('5');
      expect(document.getElementById('might-pool').value).toBe('15');
      
      const skillRows = document.querySelectorAll('.skill-row');
      expect(skillRows.length).toBe(1);
      expect(skillRows[0].querySelector('.skill-name').value).toBe('Swords');
    });
  });

  describe('Edge Cases', () => {
    test('should handle undefined character properties gracefully', () => {
      const character = {
        id: '1',
        name: 'Minimal'
      };
      
      model.characters = [character];
      
      // Setup full DOM
      document.body.innerHTML += `
        <input id="char-descriptor" />
        <input id="char-type" />
        <input id="char-focus" />
        <input id="char-flavor" />
        <input id="char-background" />
        <input id="char-notes" />
        <input id="char-portrait" />
        <input id="might-edge" />
        <input id="might-current" />
        <input id="speed-edge" />
        <input id="speed-current" />
        <input id="intellect-edge" />
        <input id="intellect-current" />
        <input id="char-effort" />
        <input id="char-experience" />
        <input id="recovery-modifier" />
        <input type="checkbox" id="impaired" />
        <input type="checkbox" id="debilitated" />
        <input type="checkbox" id="recovery-action" />
        <input type="checkbox" id="recovery-10min" />
        <input type="checkbox" id="recovery-1hour" />
        <input type="checkbox" id="recovery-10hour" />
        <div id="character-list-view"></div>
        <div id="character-sheet-view"></div>
      `;
      
      // Should not throw
      expect(() => controller.loadCharacter('1')).not.toThrow();
    });
  });
});
