/**
 * Test to reproduce the bug where power shift ability names don't save
 * Issue #6: After typing an ability into the power shifts ability box,
 * the text clears when clicking the green plus
 */

require('./test-setup');

// Access classes from global scope (set by test-setup)
const CharacterModel = global.CharacterModel;
const CharacterView = global.CharacterView;
const CharacterController = global.CharacterController;

describe('Power Shift Text Bug #6', () => {
    let controller;
    let view;
    let model;
    
    beforeEach(async () => {
        // Set up DOM
        document.body.innerHTML = `
            <div id="character-form"></div>
            <div id="powershifts-list"></div>
        `;
        
        // Mock cypherData
        global.cypherData = {
            powerShifts: [
                {
                    name: 'Flight',
                    description: 'You can fly',
                    allows_additional_text: true,
                    has_healing_checkboxes: false,
                    is_per_round: false
                }
            ]
        };
        
        model = new CharacterModel();
        view = new CharacterView();
        controller = new CharacterController(model, view);
        
        // Initialize with empty power shifts
        await view.renderPowerShifts([]);
    });
    
    test('should preserve text when clicking the green plus button', async () => {
        // User types "Supersonic Speed" in the text field
        const textInput = document.querySelector('input[data-ps-text="Flight-0"]');
        expect(textInput).toBeTruthy();
        
        // Simulate user typing
        textInput.value = 'Supersonic Speed';
        
        // Verify the text is in the input
        expect(textInput.value).toBe('Supersonic Speed');
        
        // User clicks the green plus button
        await controller.addPowerShiftInstance('Flight');
        
        // Check that the first instance still has the text
        const firstTextInput = document.querySelector('input[data-ps-text="Flight-0"]');
        expect(firstTextInput).toBeTruthy();
        expect(firstTextInput.value).toBe('Supersonic Speed');
        
        // Check that a second instance was created
        const allTextInputs = document.querySelectorAll('input[data-ps-text^="Flight-"]');
        expect(allTextInputs.length).toBe(2);
    });
    
    test('should save and restore text even with value=0', () => {
        // User types text
        const textInput = document.querySelector('input[data-ps-text="Flight-0"]');
        textInput.value = 'Supersonic Speed';
        
        // Keep value at 0 (don't increment it)
        const valueInput = document.querySelector('input[data-ps-name="Flight"]');
        expect(parseInt(valueInput.value)).toBe(0);
        
        // Get current power shifts (which should include the one with text even though value is 0)
        const currentPowerShifts = view.getCurrentPowerShifts();
        
        // Verify the power shift is included because it has additional_text
        expect(currentPowerShifts.length).toBe(1);
        expect(currentPowerShifts[0].name).toBe('Flight');
        expect(currentPowerShifts[0].value).toBe(0);
        expect(currentPowerShifts[0].additional_text).toBe('Supersonic Speed');
    });
    
    test('should filter out power shifts with value=0 and no text', () => {
        // Don't type any text, keep value at 0
        const valueInput = document.querySelector('input[data-ps-name="Flight"]');
        expect(parseInt(valueInput.value)).toBe(0);
        
        const textInput = document.querySelector('input[data-ps-text="Flight-0"]');
        expect(textInput.value).toBe(''); // No text
        
        // Get current power shifts - should be empty
        const currentPowerShifts = view.getCurrentPowerShifts();
        expect(currentPowerShifts.length).toBe(0);
    });
    
    test('should include power shift with value > 0 even without text', () => {
        // Set value but no text
        const valueInput = document.querySelector('input[data-ps-name="Flight"]');
        valueInput.value = '3';
        
        const textInput = document.querySelector('input[data-ps-text="Flight-0"]');
        expect(textInput.value).toBe(''); // No text
        
        // Get current power shifts - should include it because value > 0
        const currentPowerShifts = view.getCurrentPowerShifts();
        expect(currentPowerShifts.length).toBe(1);
        expect(currentPowerShifts[0].name).toBe('Flight');
        expect(currentPowerShifts[0].value).toBe(3);
        expect(currentPowerShifts[0].additional_text).toBe('');
    });
});
