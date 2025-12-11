/**
 * Power Shifts Integration Tests
 * Tests for power shift rendering and state management
 */

require('./test-setup');

// Access classes from global scope (set by test-setup)
const CharacterModel = global.CharacterModel;
const CharacterView = global.CharacterView;
const CharacterController = global.CharacterController;

// Create global instances for testing
let model, view, controller, cypherData;

describe('Power Shifts Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    
    // Reset model, view, controller
    model = new CharacterModel();
    view = new CharacterView();
    controller = new CharacterController(model, view);
    
    // Setup DOM
    document.body.innerHTML = `
      <div id="character-sheet-view">
        <div id="powershifts-list"></div>
      </div>
    `;
    
    // Mock cypherData with power shifts
    cypherData = {
      powerShifts: [
        { name: 'Accuracy', description: 'Attack bonus', has_healing_checkboxes: false, allows_additional_text: false, is_per_round: false },
        { name: 'Flight', description: 'Fly around', has_healing_checkboxes: false, allows_additional_text: true, is_per_round: true },
        { name: 'Healing', description: 'Heal damage', has_healing_checkboxes: true, allows_additional_text: false, is_per_round: false },
        { name: 'Dexterity', description: 'Speed bonus', has_healing_checkboxes: false, allows_additional_text: false, is_per_round: false }
      ],
      loaded: true
    };
    
    // Make cypherData global so renderers can access it
    global.cypherData = cypherData;
  });

  test('renderPowerShifts should render all three types correctly', () => {
    view.renderPowerShifts([]);
    
    const labels = document.querySelectorAll('#powershifts-list label');
    expect(labels.length).toBe(4); // Accuracy, Flight, Healing, Dexterity
    
    // Check simple type (Accuracy)
    const accuracyInput = document.querySelector('[data-ps-name="Accuracy"]');
    expect(accuracyInput).toBeTruthy();
    expect(accuracyInput.type).toBe('number');
    
    // Check text + per round type (Flight) - note: data attribute now includes psId
    const flightText = document.querySelector('[data-ps-text^="Flight-"]');
    expect(flightText).toBeTruthy();
    expect(flightText.type).toBe('text');
    
    const perRoundLabel = Array.from(labels).find(l => 
      l.textContent.includes('Flight') && l.textContent.includes('Per Round')
    );
    expect(perRoundLabel).toBeTruthy();
    
    // Check healing checkboxes type
    const healingCheckboxes = document.querySelectorAll('[data-ps-heart="Healing"]');
    expect(healingCheckboxes.length).toBe(5);
  });

  test('Power shifts should save and load correctly', () => {
    // Set up power shifts with id property
    view.renderPowerShifts([
      { name: 'Accuracy', value: 3, additional_text: '', hearts_used: 0, id: '0' },
      { name: 'Flight', value: 2, additional_text: 'short', hearts_used: 0, id: '0' },
      { name: 'Healing', value: 1, additional_text: '', hearts_used: 3, id: '0' }
    ]);
    
    // Verify values loaded
    const accuracyInput = document.querySelector('[data-ps-name="Accuracy"]');
    expect(accuracyInput.value).toBe('3');
    
    const flightValue = document.querySelector('[data-ps-name="Flight"]');
    const flightText = document.querySelector('[data-ps-text="Flight-0"]'); // Updated selector
    expect(flightValue.value).toBe('2');
    expect(flightText.value).toBe('short');
    
    const healingValue = document.querySelector('[data-ps-name="Healing"]');
    const healingChecks = document.querySelectorAll('[data-ps-heart="Healing"]:checked');
    expect(healingValue.value).toBe('1');
    expect(healingChecks.length).toBe(3);
    
    // Get current values
    const retrieved = view.getCurrentPowerShifts();
    expect(retrieved.length).toBe(3);
    
    const accuracy = retrieved.find(ps => ps.name === 'Accuracy');
    expect(accuracy.value).toBe(3);
    
    const flight = retrieved.find(ps => ps.name === 'Flight');
    expect(flight.value).toBe(2);
    expect(flight.additional_text).toBe('short');
    
    const healing = retrieved.find(ps => ps.name === 'Healing');
    expect(healing.value).toBe(1);
    expect(healing.hearts_used).toBe(3);
  });
});
