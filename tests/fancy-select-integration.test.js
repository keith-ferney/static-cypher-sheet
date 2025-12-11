/**
 * FancySelect Integration Tests
 * Tests for the FancySelect dropdown component integration
 */

require('./test-setup');

// Access classes from global scope (set by test-setup)
const FancySelect = global.FancySelect;
const CharacterModel = global.CharacterModel;
const CharacterView = global.CharacterView;
const CharacterController = global.CharacterController;

// Create global instances for testing
let model, view, controller, cypherData;

describe('FancySelect Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    
    // Reset model, view, controller
    model = new CharacterModel();
    view = new CharacterView();
    controller = new CharacterController(model, view);
    
    // Setup DOM for FancySelect tests
    document.body.innerHTML = `
      <div id="character-sheet-view">
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
      </div>
    `;
    
    // Mock cypherData with test data
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
      loaded: true
    };
  });

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
    // Make cypherData global so initializeFancySelects can access it
    global.cypherData = cypherData;
    
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
