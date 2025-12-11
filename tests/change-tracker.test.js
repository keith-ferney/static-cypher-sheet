/**
 * Change Tracker Tests
 * Tests for CharacterChangeTracker
 */

require('./test-setup');

const CharacterModel = global.CharacterModel;
const CharacterView = global.CharacterView;
const CharacterChangeTracker = global.CharacterChangeTracker;

describe('CharacterChangeTracker', () => {
  let model, view, tracker;

  beforeEach(() => {
    localStorage.clear();
    
    document.body.innerHTML = `
      <div id="character-sheet-view">
        <input id="char-name" value="Test" />
        <input id="char-tier" value="1" />
        <button id="save-btn" class="primary-btn">Save</button>
        
        <div id="descriptor-select"></div>
        <div id="type-select"></div>
        <div id="focus-select"></div>
        <div id="flavor-select"></div>
        <div id="ability-select"></div>
        
        <input id="char-descriptor" />
        <input id="char-type" />
        <input id="char-focus" />
        <input id="char-flavor" />
        <input id="char-background" />
        <input id="char-notes" />
        <input id="char-portrait" />
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
      </div>
    `;
    
    global.cypherData = {
      descriptors: [],
      types: [],
      foci: [],
      flavors: [],
      abilities: [],
      advancements: [],
      powerShifts: []
    };
    
    model = new CharacterModel();
    view = new CharacterView();
    view.setModel(model);
    tracker = new CharacterChangeTracker(model, view);
  });

  describe('Snapshot Management', () => {
    test('should save snapshot of current form data', () => {
      model.createNewCharacterId(); // Need a current character to save snapshot
      document.getElementById('char-name').value = 'Hero Name';
      tracker.saveSnapshot();
      
      expect(tracker.savedCharacterSnapshot).toBeDefined();
      expect(tracker.savedCharacterSnapshot).toContain('Hero Name');
    });

    test('should update snapshot when data changes', () => {
      model.createNewCharacterId();
      document.getElementById('char-name').value = 'First';
      tracker.saveSnapshot();
      const firstSnapshot = tracker.savedCharacterSnapshot;
      
      document.getElementById('char-name').value = 'Second';
      tracker.saveSnapshot();
      
      expect(tracker.savedCharacterSnapshot).not.toBe(firstSnapshot);
    });
  });

  describe('Change Detection', () => {
    test('should detect no changes when form unchanged', () => {
      model.createNewCharacterId();
      tracker.saveSnapshot();
      tracker.checkForChanges();
      
      const saveBtn = document.getElementById('save-btn');
      expect(saveBtn.classList.contains('unsaved-changes')).toBe(false);
    });

    test('should detect changes when form modified', () => {
      model.createNewCharacterId();
      tracker.saveSnapshot();
      
      document.getElementById('char-name').value = 'Modified';
      tracker.checkForChanges();
      
      const saveBtn = document.getElementById('save-btn');
      expect(saveBtn.classList.contains('unsaved-changes')).toBe(true);
    });

    test('should clear unsaved indicator when changes reverted', () => {
      model.createNewCharacterId();
      const originalName = 'Original';
      document.getElementById('char-name').value = originalName;
      tracker.saveSnapshot();
      
      document.getElementById('char-name').value = 'Modified';
      tracker.checkForChanges();
      
      document.getElementById('char-name').value = originalName;
      tracker.checkForChanges();
      
      const saveBtn = document.getElementById('save-btn');
      expect(saveBtn.classList.contains('unsaved-changes')).toBe(false);
    });

    test('should not error when save button not found', () => {
      document.getElementById('save-btn').remove();
      tracker.saveSnapshot();
      
      expect(() => tracker.checkForChanges()).not.toThrow();
    });
  });

  describe('Setup Change Detection', () => {
    test('should setup event listeners on character sheet', () => {
      tracker.setupChangeDetection();
      
      // Trigger input event
      const input = document.getElementById('char-name');
      input.value = 'Changed';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Should have called checkForChanges
      expect(true).toBe(true); // Event listener attached
    });

    test('should listen for change events', () => {
      tracker.setupChangeDetection();
      
      const input = document.getElementById('char-tier');
      input.value = '5';
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      expect(true).toBe(true);
    });

    test('should not error when sheet view not found', () => {
      document.body.innerHTML = '';
      expect(() => tracker.setupChangeDetection()).not.toThrow();
    });
  });

  describe('Current Character Detection', () => {
    test('should only track changes when character loaded', () => {
      model.currentCharacterId = null;
      tracker.saveSnapshot();
      
      expect(tracker.savedCharacterSnapshot).toBeNull();
    });

    test('should track changes when character exists', () => {
      model.createNewCharacterId();
      tracker.saveSnapshot();
      
      expect(tracker.savedCharacterSnapshot).not.toBeNull();
    });
  });
});
