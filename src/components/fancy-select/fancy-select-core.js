/**
 * FancySelect - Searchable dropdown with tooltips
 * Usage:
 *   new FancySelect(containerElement, {
 *     data: array,
 *     labelKey: 'name',
 *     valueKey: 'id',
 *     descriptionKey: 'description',
 *     placeholder: '- Select -',
 *     value: currentValue,
 *     onChange: (selectedOption) => { ... }
 *   });
 */
class FancySelect {
  static instances = []; // Track all instances
  
  constructor(container, options) {
    this.container = container;
    this.options = options.data || [];
    this.labelKey = options.labelKey || 'name';
    this.valueKey = options.valueKey || 'id';
    this.descriptionKey = options.descriptionKey || 'description';
    this.placeholder = options.placeholder || '- Select -';
    this.onChange = options.onChange || (() => {});
    this.value = options.value || null;
    this.extraWide = options.extraWide || false;
    
    this.searchTerm = '';
    this.expandedIndex = -1;
    this.isOpen = false;
    this.showTriggerDescription = false;
    this.dropdownElement = null;
    
    // Initialize helper modules
    this.eventHandlers = new FancySelectEventHandlers(this);
    this.domBuilder = new FancySelectDOMBuilder(this);
    
    // Add this instance to the static list
    FancySelect.instances.push(this);
    
    this.render();
  }
  
  static closeAll() {
    FancySelect.instances.forEach(instance => {
      if (instance.isOpen) {
        instance.isOpen = false;
        instance.expandedIndex = -1;
        instance.render();
      }
    });
  }
  
  closeOthers() {
    FancySelect.instances.forEach(instance => {
      if (instance !== this && instance.isOpen) {
        instance.isOpen = false;
        instance.expandedIndex = -1;
        instance.render();
      }
    });
  }
  
  closeOtherInfoBoxes() {
    FancySelect.instances.forEach(instance => {
      if (instance !== this && instance.showTriggerDescription) {
        instance.showTriggerDescription = false;
        instance.render();
      }
    });
  }
  
  render() {
    if (!this.container) {
      console.warn('FancySelect container not found');
      return;
    }
    this.container.innerHTML = this.domBuilder.buildHTML();
    this.eventHandlers.attachEvents();
  }
  
  getFilteredOptions() {
    if (!this.searchTerm) return this.options;
    const term = this.searchTerm.toLowerCase();
    return this.options.filter(opt => 
      opt[this.labelKey].toLowerCase().includes(term)
    );
  }
  
  updateOptionsList() {
    this.domBuilder.updateOptionsList();
  }
  
  selectOption(option) {
    this.value = option[this.valueKey];
    this.isOpen = false;
    this.searchTerm = '';
    this.onChange(option);
    this.render();
  }
  
  setValue(value) {
    this.value = value;
    this.render();
  }

  setDisabled(disabled) {
    this.disabled = disabled;
    this.render();
  }
}

// Make available globally for tests and browser usage
if (typeof global !== 'undefined') {
  global.FancySelect = FancySelect;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FancySelect;
}
