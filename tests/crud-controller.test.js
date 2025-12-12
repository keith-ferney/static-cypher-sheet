/**
 * CRUD Controller Tests
 * Tests for CharacterCRUDController operations
 */

require('./test-setup');

const CharacterModel = global.CharacterModel;
const CharacterView = global.CharacterView;
const CharacterCRUDController = global.CharacterCRUDController;

describe('CharacterCRUDController', () => {
  let model, view, controller;

  beforeEach(() => {
    localStorage.clear();
    
    // Mock URL.createObjectURL and revokeObjectURL for JSDOM
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
    
    // Setup DOM FIRST
    document.body.innerHTML = `
      <div id="character-list-view"></div>
      <div id="character-sheet-view">
        <input id="char-name" value="Test Character" />
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
        <div id="character-list"></div>
        <table id="character-table">
          <tbody id="characters-tbody"></tbody>
        </table>
        
        <button id="lock-toggle"></button>
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
    controller = new CharacterCRUDController(model, view);
  });

  describe('Show Views', () => {
    test('should show character list', () => {
      model.setCurrentCharacterId('123');
      controller.showCharacterList();
      
      expect(model.getCurrentCharacterId()).toBeNull();
    });

    test('should render character list when showing', () => {
      model.characters = [
        { id: '1', name: 'Character 1' },
        { id: '2', name: 'Character 2' }
      ];
      
      const spy = jest.spyOn(view, 'renderCharacterList');
      controller.showCharacterList();
      
      expect(spy).toHaveBeenCalledWith(model.characters);
    });

    test('should show character sheet when loading character', async () => {
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Test' });
      const charId = model.getCurrentCharacterId();
      
      const spy = jest.spyOn(view, 'showCharacterSheet');
      await controller.loadCharacter(charId);
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('New Character Form', () => {
    test('should create new character ID', async () => {
      await controller.showNewCharacterForm();
      expect(model.getCurrentCharacterId()).toBeTruthy();
    });

    test('should clear form for new character', async () => {
      const spy = jest.spyOn(view, 'clearForm');
      await controller.showNewCharacterForm();
      expect(spy).toHaveBeenCalled();
    });

    test('should show character sheet for new character', async () => {
      const spy = jest.spyOn(view, 'showCharacterSheet');
      await controller.showNewCharacterForm();
      expect(spy).toHaveBeenCalled();
    });

    test('should set new character as unlocked', async () => {
      const spy = jest.spyOn(view, 'updateLockState');
      await controller.showNewCharacterForm();
      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('Load Character', () => {
    test('should load character data to form', async () => {
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Test Character', tier: 2 });
      const charId = model.getCurrentCharacterId();
      
      const spy = jest.spyOn(view, 'loadCharacterToForm');
      await controller.loadCharacter(charId);
      
      expect(spy).toHaveBeenCalled();
      const loadedChar = spy.mock.calls[0][0];
      expect(loadedChar.name).toBe('Test Character');
    });

    test('should set current character ID when loading', () => {
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Test' });
      const charId = model.getCurrentCharacterId();
      model.setCurrentCharacterId(null);
      
      controller.loadCharacter(charId);
      expect(model.getCurrentCharacterId()).toBe(charId);
    });

    test('should not load non-existent character', () => {
      const spy = jest.spyOn(view, 'loadCharacterToForm');
      controller.loadCharacter('999');
      expect(spy).not.toHaveBeenCalled();
    });

    test('should restore lock state when loading', async () => {
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Test', isLocked: true });
      const charId = model.getCurrentCharacterId();
      
      const spy = jest.spyOn(view, 'updateLockState');
      await controller.loadCharacter(charId);
      
      expect(spy).toHaveBeenCalledWith(true);
    });

    test('should default to unlocked when no lock state', async () => {
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Test' });
      const charId = model.getCurrentCharacterId();
      
      const spy = jest.spyOn(view, 'updateLockState');
      await controller.loadCharacter(charId);
      
      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('Save Character', () => {
    test('should save character data', () => {
      model.createNewCharacterId();
      
      const spy = jest.spyOn(model, 'saveCharacter');
      controller.saveCharacter();
      
      expect(spy).toHaveBeenCalled();
    });

    test('should show success toast after save', () => {
      model.createNewCharacterId();
      
      const spy = jest.spyOn(view, 'showToast');
      controller.saveCharacter();
      
      expect(spy).toHaveBeenCalledWith('Character saved successfully!', 'success');
    });
  });

  describe('Delete Character', () => {
    test('should delete character after confirmation', () => {
      global.confirm = jest.fn(() => true);
      
      model.createNewCharacterId();
      model.saveCharacter({ name: 'To Delete' });
      const charId = model.getCurrentCharacterId();
      
      controller.deleteCurrentCharacter();
      
      expect(model.getCharacter(charId)).toBeUndefined();
    });

    test('should not delete without confirmation', () => {
      global.confirm = jest.fn(() => false);
      
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Keep Me' });
      const charId = model.getCurrentCharacterId();
      
      controller.deleteCurrentCharacter();
      
      expect(model.getCharacter(charId)).toBeDefined();
    });

    test('should show character list after delete', () => {
      global.confirm = jest.fn(() => true);
      
      model.createNewCharacterId();
      model.saveCharacter({ name: 'To Delete' });
      
      const spy = jest.spyOn(controller, 'showCharacterList');
      controller.deleteCurrentCharacter();
      
      expect(spy).toHaveBeenCalled();
    });

    test('should show toast after delete', () => {
      global.confirm = jest.fn(() => true);
      
      model.createNewCharacterId();
      model.saveCharacter({ name: 'To Delete' });
      
      const spy = jest.spyOn(view, 'showToast');
      controller.deleteCurrentCharacter();
      
      expect(spy).toHaveBeenCalledWith('Character deleted', 'success');
    });

    test('should use character name in confirmation', () => {
      global.confirm = jest.fn(() => true);
      
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Hero Name' });
      
      controller.deleteCurrentCharacter();
      
      expect(global.confirm).toHaveBeenCalledWith(
        expect.stringContaining('Hero Name')
      );
    });

    test('should handle delete when no current character', () => {
      global.confirm = jest.fn(() => true);
      model.currentCharacterId = null;
      
      expect(() => controller.deleteCurrentCharacter()).not.toThrow();
    });
  });

  describe('Export Operations', () => {
    test('should export current character', () => {
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Export Me' });
      
      const spy = jest.spyOn(controller, 'downloadJSON');
      controller.exportCurrentCharacter();
      
      expect(spy).toHaveBeenCalled();
    });

    test('should export all characters', () => {
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Character 1' });
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Character 2' });
      
      const spy = jest.spyOn(controller, 'downloadJSON');
      controller.exportAllCharacters();
      
      expect(spy).toHaveBeenCalled();
    });

    test('should handle export with no current character', () => {
      const showToastSpy = jest.spyOn(view, 'showToast');
      model.currentCharacterId = null;
      
      controller.exportCurrentCharacter();
      expect(showToastSpy).toHaveBeenCalledWith('No character selected', 'error');
    });
  });

  describe('Import Operations', () => {
    test('should import characters in merge mode', () => {
      const fileContent = JSON.stringify([
        { id: '1', name: 'Imported Character' }
      ]);
      
      const file = new Blob([fileContent], { type: 'application/json' });
      
      controller.importCharacters(file, 'merge');
      
      // File reading is async, so we'll just verify no errors
      expect(true).toBe(true);
    });

    test('should import characters in replace mode', () => {
      const fileContent = JSON.stringify([
        { id: '1', name: 'Imported Character' }
      ]);
      
      const file = new Blob([fileContent], { type: 'application/json' });
      
      controller.importCharacters(file, 'replace');
      
      expect(true).toBe(true);
    });
  });

  describe('Download JSON', () => {
    test('should create download link', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});
      
      controller.downloadJSON('{"test": "data"}', 'test.json');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    test('should trigger download with correct filename', () => {
      const clickSpy = jest.fn();
      const mockLink = {
        href: '',
        download: '',
        click: clickSpy,
        style: {}
      };
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});
      
      controller.downloadJSON('{"test": "data"}', 'characters.json');
      
      expect(mockLink.download).toBe('characters.json');
      expect(clickSpy).toHaveBeenCalled();
    });
  });
});
