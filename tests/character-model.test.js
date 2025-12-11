/**
 * Character Model Tests
 * Comprehensive tests for CharacterModel CRUD and export/import operations
 */

require('./test-setup');

const CharacterModel = global.CharacterModel;

describe('CharacterModel', () => {
  let model;

  beforeEach(() => {
    localStorage.clear();
    model = new CharacterModel();
  });

  describe('Basic CRUD Operations', () => {
    test('should initialize with empty characters array', () => {
      expect(model.characters).toEqual([]);
      expect(model.currentCharacterId).toBeNull();
    });

    test('should load characters from localStorage', () => {
      const testChars = [{ id: '1', name: 'Test' }];
      localStorage.setItem('cypherCharacters', JSON.stringify(testChars));
      
      model.loadCharacters();
      expect(model.characters).toEqual(testChars);
    });

    test('should return empty array when no stored characters', () => {
      const result = model.loadCharacters();
      expect(result).toEqual([]);
    });

    test('should save characters to localStorage', () => {
      model.characters = [{ id: '1', name: 'Test' }];
      model.saveCharacters();
      
      const stored = JSON.parse(localStorage.getItem('cypherCharacters'));
      expect(stored).toEqual(model.characters);
    });

    test('should get character by id', () => {
      model.characters = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' }
      ];
      
      const char = model.getCharacter('2');
      expect(char.name).toBe('Second');
    });

    test('should return undefined for non-existent character', () => {
      const char = model.getCharacter('999');
      expect(char).toBeUndefined();
    });

    test('should get all characters', () => {
      model.characters = [{ id: '1' }, { id: '2' }];
      expect(model.getAllCharacters()).toEqual(model.characters);
    });

    test('should save new character', () => {
      model.createNewCharacterId();
      const characterData = { name: 'New Character', tier: 1 };
      
      const saved = model.saveCharacter(characterData);
      
      expect(saved.name).toBe('New Character');
      expect(saved.id).toBe(model.currentCharacterId);
      expect(saved.updatedAt).toBeDefined();
      expect(model.characters.length).toBe(1);
    });

    test('should update existing character', () => {
      model.createNewCharacterId();
      model.saveCharacter({ name: 'Original' });
      
      const updated = model.saveCharacter({ name: 'Updated' });
      
      expect(updated.name).toBe('Updated');
      expect(model.characters.length).toBe(1);
    });

    test('should delete character by id', () => {
      model.characters = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' }
      ];
      model.saveCharacters();
      
      model.deleteCharacter('1');
      
      expect(model.characters.length).toBe(1);
      expect(model.characters[0].id).toBe('2');
    });
  });

  describe('Current Character Management', () => {
    test('should set current character ID', () => {
      model.setCurrentCharacterId('123');
      expect(model.currentCharacterId).toBe('123');
      expect(localStorage.getItem('currentCharacterId')).toBe('123');
    });

    test('should remove current character ID from storage when set to null', () => {
      model.setCurrentCharacterId('123');
      model.setCurrentCharacterId(null);
      
      expect(model.currentCharacterId).toBeNull();
      expect(localStorage.getItem('currentCharacterId')).toBeNull();
    });

    test('should get current character ID', () => {
      model.currentCharacterId = '456';
      expect(model.getCurrentCharacterId()).toBe('456');
    });

    test('should get current character object', () => {
      model.characters = [{ id: '1', name: 'Current' }];
      model.currentCharacterId = '1';
      
      expect(model.currentCharacter.name).toBe('Current');
    });

    test('should restore current character ID from localStorage', () => {
      localStorage.setItem('currentCharacterId', '789');
      
      const restoredId = model.restoreCurrentCharacterId();
      
      expect(restoredId).toBe('789');
      expect(model.currentCharacterId).toBe('789');
    });

    test('should return null when no saved current ID', () => {
      const restoredId = model.restoreCurrentCharacterId();
      expect(restoredId).toBeNull();
    });

    test('should create new character ID using timestamp', () => {
      const id = model.createNewCharacterId();
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(model.currentCharacterId).toBe(id);
    });
  });

  describe('Export Functionality', () => {
    test('should export single character as JSON', () => {
      model.characters = [
        { id: '1', name: 'Character 1' },
        { id: '2', name: 'Character 2' }
      ];
      
      const exported = model.exportCharacter('1');
      const parsed = JSON.parse(exported);
      
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
      expect(parsed[0].name).toBe('Character 1');
    });

    test('should throw error when exporting non-existent character', () => {
      expect(() => {
        model.exportCharacter('999');
      }).toThrow('Character not found');
    });

    test('should export all characters as JSON', () => {
      model.characters = [
        { id: '1', name: 'First' },
        { id: '2', name: 'Second' }
      ];
      
      const exported = model.exportAllCharacters();
      const parsed = JSON.parse(exported);
      
      expect(parsed.length).toBe(2);
      expect(parsed[0].name).toBe('First');
      expect(parsed[1].name).toBe('Second');
    });
  });

  describe('Import Functionality', () => {
    test('should import characters in merge mode', () => {
      model.characters = [{ id: '1', name: 'Existing' }];
      
      const importData = JSON.stringify([
        { id: '2', name: 'New Character' }
      ]);
      
      const result = model.importCharacters(importData, 'merge');
      
      expect(result.success).toBe(true);
      expect(result.imported).toBe(1);
      expect(result.total).toBe(2);
      expect(model.characters.length).toBe(2);
    });

    test('should update existing character in merge mode', () => {
      model.characters = [{ id: '1', name: 'Original' }];
      
      const importData = JSON.stringify([
        { id: '1', name: 'Updated' }
      ]);
      
      const result = model.importCharacters(importData, 'merge');
      
      expect(model.characters.length).toBe(1);
      expect(model.characters[0].name).toBe('Updated');
    });

    test('should import characters in replace mode', () => {
      model.characters = [{ id: '1', name: 'Old' }];
      
      const importData = JSON.stringify([
        { id: '2', name: 'New 1' },
        { id: '3', name: 'New 2' }
      ]);
      
      const result = model.importCharacters(importData, 'replace');
      
      expect(result.success).toBe(true);
      expect(result.imported).toBe(2);
      expect(result.total).toBe(2);
      expect(model.characters.length).toBe(2);
      expect(model.characters.find(c => c.id === '1')).toBeUndefined();
    });

    test('should default to merge mode', () => {
      model.characters = [{ id: '1', name: 'Existing' }];
      
      const importData = JSON.stringify([
        { id: '2', name: 'New' }
      ]);
      
      const result = model.importCharacters(importData);
      
      expect(model.characters.length).toBe(2);
    });

    test('should throw error for invalid JSON', () => {
      expect(() => {
        model.importCharacters('not valid json');
      }).toThrow(/Import failed/);
    });

    test('should throw error for non-array data', () => {
      expect(() => {
        model.importCharacters(JSON.stringify({ id: '1', name: 'Test' }));
      }).toThrow(/Invalid format: expected an array/);
    });

    test('should throw error for character without id', () => {
      const importData = JSON.stringify([
        { name: 'No ID Character' }
      ]);
      
      expect(() => {
        model.importCharacters(importData);
      }).toThrow(/missing required fields/);
    });

    test('should throw error for character without name', () => {
      const importData = JSON.stringify([
        { id: '1' }
      ]);
      
      expect(() => {
        model.importCharacters(importData);
      }).toThrow(/missing required fields/);
    });

    test('should save to localStorage after import', () => {
      const importData = JSON.stringify([
        { id: '1', name: 'Imported' }
      ]);
      
      model.importCharacters(importData);
      
      const stored = JSON.parse(localStorage.getItem('cypherCharacters'));
      expect(stored.length).toBe(1);
      expect(stored[0].name).toBe('Imported');
    });
  });

  describe('Edge Cases', () => {
    test('should handle save with no current character ID', () => {
      model.currentCharacterId = null;
      const saved = model.saveCharacter({ name: 'Test' });
      
      expect(saved.id).toBeNull();
      expect(model.characters.length).toBe(1);
    });

    test('should preserve other character properties on save', () => {
      model.createNewCharacterId();
      model.saveCharacter({ 
        name: 'Test',
        tier: 3,
        descriptor: 'Strong',
        customField: 'custom value'
      });
      
      const char = model.currentCharacter;
      expect(char.name).toBe('Test');
      expect(char.tier).toBe(3);
      expect(char.descriptor).toBe('Strong');
      expect(char.customField).toBe('custom value');
    });

    test('should handle delete of non-existent character', () => {
      model.characters = [{ id: '1', name: 'Test' }];
      model.deleteCharacter('999');
      
      expect(model.characters.length).toBe(1);
    });
  });
});
