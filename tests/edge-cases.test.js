/**
 * Edge Cases and Error Handling Tests
 * Tests for edge cases, error conditions, and data validation
 */

require('./test-setup');

// Access classes from global scope (set by test-setup)
const FancySelect = global.FancySelect;
const CharacterModel = global.CharacterModel;
const CharacterView = global.CharacterView;
const CharacterController = global.CharacterController;

// Create global instances for testing
let model, view, controller, cypherData;

describe('Edge Cases and Error Handling Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    
    // Reset model, view, controller
    model = new CharacterModel();
    view = new CharacterView();
    controller = new CharacterController(model, view);
    
    // Setup DOM
    document.body.innerHTML = `
      <div id="character-sheet-view">
        <input id="char-name" />
        <input id="char-tier" type="number" value="1" />
        <input id="char-background" />
        <input id="char-notes" />
        <input id="char-portrait" />
        
        <div id="descriptor-select"></div>
        <input id="char-descriptor" type="hidden" />
        
        <div id="type-select"></div>
        <input id="char-type" type="hidden" />
        
        <div id="focus-select"></div>
        <input id="char-focus" type="hidden" />
        
        <div id="flavor-select"></div>
        <input id="char-flavor" type="hidden" />
        
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
        
        <input type="checkbox" id="impaired" />
        <input type="checkbox" id="debilitated" />
        <input type="checkbox" id="recovery-action" />
        <input type="checkbox" id="recovery-10min" />
        <input type="checkbox" id="recovery-1hour" />
        <input type="checkbox" id="recovery-10hour" />
        
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
        { id: 1, name: 'Strong', description: 'Physically powerful' }
      ],
      types: [
        { id: 1, name: 'Warrior', description: 'Combat specialist' }
      ],
      foci: [
        { id: 1, name: 'Fights With Panache', description: 'Stylish fighter' }
      ],
      flavors: [
        { id: 1, name: 'Combat', description: 'Focused on fighting' }
      ],
      abilities: [],
      advancements: [],
      powerShifts: [
        { name: 'Accuracy', description: 'Attack bonus', has_healing_checkboxes: false, allows_additional_text: false, is_per_round: false },
        { name: 'Flight', description: 'Fly around', has_healing_checkboxes: false, allows_additional_text: true, is_per_round: true }
      ],
      loaded: true
    };
    
    // Make cypherData global so renderers and views can access it
    global.cypherData = cypherData;
  });

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

  test('Save and load should handle special characters', () => {
    view.initializeFancySelects();
    model.setCurrentCharacterId('special-test');
    
    document.getElementById('char-name').value = 'Test "Hero" <Script>';
    document.getElementById('char-background').value = "Line 1\nLine 2\nLine 3";
    
    global.alert = jest.fn();
    controller.saveCharacter();
    
    view.clearForm();
    controller.loadCharacter('special-test');
    
    expect(document.getElementById('char-name').value).toBe('Test "Hero" <Script>');
    // HTML inputs don't preserve newlines the same way - just check it's not empty
    expect(document.getElementById('char-background').value).toContain("Line 1");
  });
});
