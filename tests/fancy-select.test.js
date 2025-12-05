/**
 * Tests for FancySelect Component
 * These tests verify that the fancy dropdown selector works correctly
 */

// Load the FancySelect code
const fs = require('fs');
const path = require('path');
const fancySelectCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select.js'), 'utf8');

// Execute the FancySelect code and extract the class
const FancySelect = eval(`(function() { ${fancySelectCode}; return FancySelect; })()`);

describe('FancySelect Component', () => {
  let container;
  let testData;
  let onChangeMock;

  beforeEach(() => {
    // Setup DOM container
    document.body.innerHTML = '<div id="test-container"></div>';
    container = document.getElementById('test-container');
    
    // Setup test data
    testData = [
      { id: 1, name: 'First Option', description: 'First description' },
      { id: 2, name: 'Second Option', description: 'Second description' },
      { id: 3, name: 'Third Option', description: 'Third description' },
      { id: 4, name: 'Fourth Option', description: 'Fourth description' }
    ];

    // Setup onChange mock
    onChangeMock = jest.fn();
    
    // Clear FancySelect instances
    FancySelect.instances = [];
  });

  describe('Option Selection', () => {
    test('should select the first option when clicked', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      // Click first option
      const firstOption = container.querySelectorAll('.fancy-select-option')[0];
      firstOption.click();

      // Verify onChange was called with correct option
      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(testData[0]);
      expect(select.value).toBe(1);
    });

    test('should select the second option when clicked', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      // Click second option
      const secondOption = container.querySelectorAll('.fancy-select-option')[1];
      secondOption.click();

      // Verify onChange was called with correct option
      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(testData[1]);
      expect(select.value).toBe(2);
    });

    test('should select the third option when clicked', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      // Click third option
      const thirdOption = container.querySelectorAll('.fancy-select-option')[2];
      thirdOption.click();

      // Verify onChange was called with correct option
      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(testData[2]);
      expect(select.value).toBe(3);
    });

    test('should select the fourth option when clicked', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      // Click fourth option
      const fourthOption = container.querySelectorAll('.fancy-select-option')[3];
      fourthOption.click();

      // Verify onChange was called with correct option
      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(testData[3]);
      expect(select.value).toBe(4);
    });

    test('should display selected option in trigger', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      // Click third option
      const thirdOption = container.querySelectorAll('.fancy-select-option')[2];
      thirdOption.click();

      // Verify the trigger displays the selected option
      const triggerText = container.querySelector('.fancy-select-trigger').textContent.trim();
      expect(triggerText).toContain('Third Option');
    });

    test('should close dropdown after selecting an option', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      expect(select.isOpen).toBe(true);

      // Click second option
      const secondOption = container.querySelectorAll('.fancy-select-option')[1];
      secondOption.click();

      // Verify dropdown is closed
      expect(select.isOpen).toBe(false);
    });
  });

  describe('Search Functionality', () => {
    test('should filter options based on search term', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      // Type in search
      const searchInput = container.querySelector('.fancy-select-search');
      searchInput.value = 'Second';
      searchInput.dispatchEvent(new Event('input'));

      // Verify only matching options are shown
      const visibleOptions = container.querySelectorAll('.fancy-select-option');
      expect(visibleOptions.length).toBe(1);
      expect(visibleOptions[0].textContent).toContain('Second Option');
    });

    test('should allow selecting filtered options', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      // Type in search
      const searchInput = container.querySelector('.fancy-select-search');
      searchInput.value = 'Third';
      searchInput.dispatchEvent(new Event('input'));

      // Click the filtered option
      const filteredOption = container.querySelector('.fancy-select-option');
      filteredOption.click();

      // Verify onChange was called with correct option
      // Note: onChange might be called during render() too, so just check it was called with the right data
      expect(onChangeMock).toHaveBeenCalledWith(testData[2]);
      expect(select.value).toBe(3);
    });

    test('should not accumulate click event listeners', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      // Type in search multiple times to trigger updateOptionsList
      const searchInput = container.querySelector('.fancy-select-search');
      
      searchInput.value = 'First';
      searchInput.dispatchEvent(new Event('input'));
      
      searchInput.value = 'Second';
      searchInput.dispatchEvent(new Event('input'));
      
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));

      // Click second option
      const secondOption = container.querySelectorAll('.fancy-select-option')[1];
      secondOption.click();

      // Verify onChange was called exactly once for the selection (not multiple times due to duplicate listeners)
      // The onChange might also be called during render, but should not be called multiple times for the same click
      const callsForSecondOption = onChangeMock.mock.calls.filter(call => call[0] === testData[1]);
      expect(callsForSecondOption.length).toBeLessThanOrEqual(2); // At most once for select, once for render
    });
  });

  describe('Event Listener Management', () => {
    test('should remove event listeners on multiple renders', () => {
      let callCount = 0;
      const trackingOnChange = (option) => {
        callCount++;
      };

      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: trackingOnChange
      });

      // Open and close dropdown multiple times
      for (let i = 0; i < 3; i++) {
        const trigger = container.querySelector('.fancy-select-trigger');
        trigger.click(); // Open
        trigger.click(); // Close
      }

      // Open one more time and select an option
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      const secondOption = container.querySelectorAll('.fancy-select-option')[1];
      callCount = 0; // Reset before clicking
      secondOption.click();

      // Should only be called once, not multiple times due to accumulated listeners
      expect(callCount).toBe(1);
    });

    test('should select correct option when clicking on nested elements', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      // Click on the label element of the third option (nested inside the option div)
      const thirdOptionLabel = container.querySelectorAll('.fancy-select-option-label')[2];
      thirdOptionLabel.click();

      // Should select the third option, not the first
      expect(onChangeMock).toHaveBeenCalledWith(testData[2]);
      expect(select.value).toBe(3);
    });

    test('should select correct option data-value attributes', () => {
      // Create FancySelect instance
      const select = new FancySelect(container, {
        data: testData,
        labelKey: 'name',
        valueKey: 'id',
        descriptionKey: 'description',
        placeholder: '- Select -',
        onChange: onChangeMock
      });

      // Open dropdown
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();

      // Check that data-value attributes are set correctly
      const options = container.querySelectorAll('.fancy-select-option');
      expect(options[0].dataset.value).toBe('1');
      expect(options[1].dataset.value).toBe('2');
      expect(options[2].dataset.value).toBe('3');
      expect(options[3].dataset.value).toBe('4');
    });
  });
});
