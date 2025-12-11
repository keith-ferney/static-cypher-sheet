/**
 * Data Loader Tests
 * Tests for data loading functionality
 */

require('./test-setup');

const { loadCypherData, cypherData } = require('../src/models/data-loader.js');

describe('Data Loader', () => {
  beforeEach(() => {
    // Reset loaded flag
    cypherData.loaded = false;
    cypherData.descriptors = [];
    cypherData.types = [];
    cypherData.foci = [];
    cypherData.flavors = [];
    cypherData.abilities = [];
    cypherData.advancements = [];
    cypherData.powerShifts = [];
  });

  describe('loadCypherData', () => {
    test('should return cypherData object', async () => {
      const result = await loadCypherData();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('descriptors');
      expect(result).toHaveProperty('types');
      expect(result).toHaveProperty('foci');
      expect(result).toHaveProperty('flavors');
      expect(result).toHaveProperty('abilities');
      expect(result).toHaveProperty('advancements');
      expect(result).toHaveProperty('powerShifts');
    });

    test('should set loaded flag to true', async () => {
      await loadCypherData();
      expect(cypherData.loaded).toBe(true);
    });

    test('should not reload if already loaded', async () => {
      cypherData.loaded = true;
      cypherData.descriptors = [{ name: 'Test' }];
      
      const result = await loadCypherData();
      expect(result.descriptors).toEqual([{ name: 'Test' }]);
    });

    test('should handle fetch errors gracefully', async () => {
      // Mock fetch to fail
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await loadCypherData();
      
      expect(result.loaded).toBe(true); // Still marks as loaded to prevent infinite retry
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('should load all data types', async () => {
      // Mock successful fetch
      global.fetch = jest.fn((url) => {
        let mockData = [];
        if (url.includes('descriptors')) mockData = [{ name: 'Descriptor 1' }];
        else if (url.includes('types')) mockData = [{ name: 'Type 1' }];
        else if (url.includes('foci')) mockData = [{ name: 'Focus 1' }];
        else if (url.includes('flavors')) mockData = [{ name: 'Flavor 1' }];
        else if (url.includes('abilities')) mockData = [{ name: 'Ability 1' }];
        else if (url.includes('advancements')) mockData = [{ tier: 1 }];
        else if (url.includes('powershifts')) mockData = [{ name: 'Shift 1' }];
        
        return Promise.resolve({
          json: () => Promise.resolve(mockData)
        });
      });
      
      const result = await loadCypherData();
      
      expect(result.descriptors).toBeDefined();
      expect(result.types).toBeDefined();
      expect(result.foci).toBeDefined();
      expect(result.flavors).toBeDefined();
      expect(result.abilities).toBeDefined();
      expect(result.advancements).toBeDefined();
      expect(result.powerShifts).toBeDefined();
      
      // Check that data was actually populated
      expect(result.descriptors.length).toBeGreaterThan(0);
      expect(result.types.length).toBeGreaterThan(0);
    });
    
    test('should handle partial load failures', async () => {
      let callCount = 0;
      global.fetch = jest.fn(() => {
        callCount++;
        if (callCount <= 3) {
          return Promise.resolve({ json: () => Promise.resolve([]) });
        }
        return Promise.reject(new Error('Network error'));
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await loadCypherData();
      
      expect(cypherData.loaded).toBe(true);
      consoleSpy.mockRestore();
    });
  });

  describe('cypherData structure', () => {
    test('should have initial empty arrays', () => {
      expect(Array.isArray(cypherData.descriptors)).toBe(true);
      expect(Array.isArray(cypherData.types)).toBe(true);
      expect(Array.isArray(cypherData.foci)).toBe(true);
      expect(Array.isArray(cypherData.flavors)).toBe(true);
      expect(Array.isArray(cypherData.abilities)).toBe(true);
      expect(Array.isArray(cypherData.advancements)).toBe(true);
      expect(Array.isArray(cypherData.powerShifts)).toBe(true);
    });

    test('should have loaded flag', () => {
      expect(cypherData).toHaveProperty('loaded');
      expect(typeof cypherData.loaded).toBe('boolean');
    });
  });
});
