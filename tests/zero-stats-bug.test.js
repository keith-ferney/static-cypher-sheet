/**
 * Test for Bug Fix: Zero Stats Reset to 10 on Reload
 * 
 * This test verifies that when a character has stats set to 0,
 * they remain 0 after saving and reloading, rather than being
 * reset to the default value of 10.
 */

require('./test-setup');

const CharacterModel = global.CharacterModel;
const CharacterFormManager = global.CharacterFormManager;

describe('Zero Stats Bug Fix', () => {
  let model;
  let formManager;

  beforeEach(() => {
    // Setup DOM elements needed by CharacterFormManager
    document.body.innerHTML = `
      <input id="char-name" />
      <input id="char-tier" type="number" />
      <input id="char-descriptor" />
      <input id="char-type" />
      <input id="char-focus" />
      <input id="char-flavor" />
      <textarea id="char-background"></textarea>
      <textarea id="char-notes"></textarea>
      <input id="char-portrait" />
      
      <input id="might-pool" type="number" />
      <input id="might-edge" type="number" />
      <input id="might-current" type="number" />
      <input id="speed-pool" type="number" />
      <input id="speed-edge" type="number" />
      <input id="speed-current" type="number" />
      <input id="intellect-pool" type="number" />
      <input id="intellect-edge" type="number" />
      <input id="intellect-current" type="number" />
      <input id="char-effort" type="number" />
      <input id="char-experience" type="number" />
      <input id="recovery-modifier" type="number" />
      
      <input id="impaired" type="checkbox" />
      <input id="debilitated" type="checkbox" />
      <input id="recovery-action" type="checkbox" />
      <input id="recovery-10min" type="checkbox" />
      <input id="recovery-1hour" type="checkbox" />
      <input id="recovery-10hour" type="checkbox" />
      
      <div id="skills-list"></div>
      <div id="abilities-list"></div>
      <div id="equipment-list"></div>
      <div id="attacks-list"></div>
      <div id="cyphers-list"></div>
      <div id="power-shifts-list"></div>
      <div id="powershifts-list"></div>
      <div id="advancements-list"></div>
    `;

    localStorage.clear();
    model = new CharacterModel();
    formManager = new CharacterFormManager(global.FormRenderer);
    formManager.setModel(model);
  });

  const mockFancySelects = {
    descriptorSelect: null,
    typeSelect: null,
    focusSelect: null,
    flavorSelect: null
  };

  test('should preserve 0 values when saving and loading character', () => {
    // Create a new character ID
    model.createNewCharacterId();
    
    // Set all stat fields to 0 in the form
    document.getElementById('char-name').value = 'Zero Stats Hero';
    document.getElementById('might-pool').value = '0';
    document.getElementById('might-current').value = '0';
    document.getElementById('speed-pool').value = '0';
    document.getElementById('speed-current').value = '0';
    document.getElementById('intellect-pool').value = '0';
    document.getElementById('intellect-current').value = '0';
    
    // Get data from form (this is where the bug would occur in getDataFromForm)
    const characterData = formManager.getDataFromForm();
    
    // Verify the data extracted from form preserves 0 values
    expect(characterData.mightPool).toBe(0);
    expect(characterData.mightCurrent).toBe(0);
    expect(characterData.speedPool).toBe(0);
    expect(characterData.speedCurrent).toBe(0);
    expect(characterData.intellectPool).toBe(0);
    expect(characterData.intellectCurrent).toBe(0);
    
    // Save the character
    const savedCharacter = model.saveCharacter(characterData);
    
    // Verify saved character has 0 values
    expect(savedCharacter.mightPool).toBe(0);
    expect(savedCharacter.speedPool).toBe(0);
    expect(savedCharacter.intellectPool).toBe(0);
    
    // Clear the form
    formManager.clearForm();
    
    // Verify form was cleared to defaults (10)
    expect(document.getElementById('might-pool').value).toBe('10');
    expect(document.getElementById('speed-pool').value).toBe('10');
    expect(document.getElementById('intellect-pool').value).toBe('10');
    
    // Load the character back from storage (this is where the second bug would occur in loadToForm)
    const loadedCharacter = model.currentCharacter;
    formManager.loadToForm(loadedCharacter, mockFancySelects);
    
    // Verify the form now shows 0 values (not 10!)
    expect(document.getElementById('might-pool').value).toBe('0');
    expect(document.getElementById('might-current').value).toBe('0');
    expect(document.getElementById('speed-pool').value).toBe('0');
    expect(document.getElementById('speed-current').value).toBe('0');
    expect(document.getElementById('intellect-pool').value).toBe('0');
    expect(document.getElementById('intellect-current').value).toBe('0');
  });

  test('should handle undefined stats correctly (default to 10)', () => {
    model.createNewCharacterId();
    
    // Create a character with undefined stats (simulating old saved data)
    const characterWithUndefinedStats = {
      name: 'Old Character',
      // Stats are undefined/missing
    };
    
    formManager.loadToForm(characterWithUndefinedStats, mockFancySelects);
    
    // Should default to 10 when undefined
    expect(document.getElementById('might-pool').value).toBe('10');
    expect(document.getElementById('speed-pool').value).toBe('10');
    expect(document.getElementById('intellect-pool').value).toBe('10');
  });

  test('should handle null stats correctly (default to 10)', () => {
    model.createNewCharacterId();
    
    // Create a character with null stats
    const characterWithNullStats = {
      name: 'Null Character',
      mightPool: null,
      speedPool: null,
      intellectPool: null,
    };
    
    formManager.loadToForm(characterWithNullStats, mockFancySelects);
    
    // Should default to 10 when null
    expect(document.getElementById('might-pool').value).toBe('10');
    expect(document.getElementById('speed-pool').value).toBe('10');
    expect(document.getElementById('intellect-pool').value).toBe('10');
  });

  test('should preserve positive stat values', () => {
    model.createNewCharacterId();
    
    document.getElementById('char-name').value = 'Positive Stats Hero';
    document.getElementById('might-pool').value = '15';
    document.getElementById('speed-pool').value = '12';
    document.getElementById('intellect-pool').value = '18';
    
    const characterData = formManager.getDataFromForm();
    model.saveCharacter(characterData);
    
    formManager.clearForm();
    formManager.loadToForm(model.currentCharacter, mockFancySelects);
    
    expect(document.getElementById('might-pool').value).toBe('15');
    expect(document.getElementById('speed-pool').value).toBe('12');
    expect(document.getElementById('intellect-pool').value).toBe('18');
  });

  test('should handle mixed zero and positive values', () => {
    model.createNewCharacterId();
    
    document.getElementById('char-name').value = 'Mixed Stats Hero';
    document.getElementById('might-pool').value = '0';
    document.getElementById('speed-pool').value = '12';
    document.getElementById('intellect-pool').value = '0';
    
    const characterData = formManager.getDataFromForm();
    model.saveCharacter(characterData);
    
    formManager.clearForm();
    formManager.loadToForm(model.currentCharacter, mockFancySelects);
    
    expect(document.getElementById('might-pool').value).toBe('0');
    expect(document.getElementById('speed-pool').value).toBe('12');
    expect(document.getElementById('intellect-pool').value).toBe('0');
  });
});
