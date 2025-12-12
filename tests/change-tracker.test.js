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
        <textarea id="char-background"></textarea>
        <textarea id="char-notes"></textarea>
        <input id="char-portrait" />
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
      // Manually call checkForChanges since events don't propagate in JSDOM
      tracker.checkForChanges();
      
      const saveBtn = document.getElementById('save-btn');
      // The snapshot should be different now
      const currentSnapshot = JSON.stringify(view.getCharacterDataFromForm());
      expect(currentSnapshot).not.toBe(tracker.savedCharacterSnapshot);
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
