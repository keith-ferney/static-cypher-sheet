// FancySelect DOM Builder Module
class FancySelectDOMBuilder {
    constructor(selectInstance) {
        this.select = selectInstance;
    }

    generateOptionHTML(opt, idx) {
        const isSelected = opt[this.select.valueKey] === this.select.value;
        const isExpanded = idx === this.select.expandedIndex;
        
        const optionClass = getClassNames('fancy-select-option', {
            'expanded': isExpanded,
            'selected': isSelected
        });
        
        const hasDescription = opt[this.select.descriptionKey];
        
        return `
          <div 
            class="${optionClass}"
            data-value="${opt[this.select.valueKey]}"
            data-index="${idx}"
            data-description="${escapeHTML(opt[this.select.descriptionKey] || '')}"
          >
            <div class="fancy-select-option-header" data-action="toggle">
              <div class="fancy-select-option-checkbox-container" data-action="select">
                <div class="fancy-select-option-checkbox">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="fancy-select-option-label">${opt[this.select.labelKey]}</div>
              ${hasDescription ? `
                <svg class="fancy-select-option-chevron" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
              ` : `<span style="width: 1rem;"></span>`}
            </div>
            ${hasDescription ? `<div class="fancy-select-option-description">${opt[this.select.descriptionKey]}</div>` : ''}
          </div>
        `;
    }

    buildHTML() {
        const selectedOption = this.select.options.find(opt => 
            opt[this.select.valueKey] === this.select.value
        );
        const displayText = selectedOption ? selectedOption[this.select.labelKey] : this.select.placeholder;
        const description = selectedOption ? selectedOption[this.select.descriptionKey] : '';
        
        const selectClass = getClassNames('fancy-select', {
            'extra-wide': this.select.extraWide
        });
        
        const iconClass = getClassNames('fancy-select-trigger-chevron', {
            'rotate-180': this.select.isOpen
        });
        
        const dropdownClass = getClassNames('fancy-select-dropdown', {
            'hidden': !this.select.isOpen
        });
        
        const descriptionClass = getClassNames('fancy-select-trigger-description', {
            'show': this.select.showTriggerDescription
        });
        
        return `
          <div class="${selectClass}">
            <div class="fancy-select-trigger-wrapper">
              <div class="fancy-select-trigger" tabindex="0">
                <span class="fancy-select-trigger-text">${displayText}</span>
                <svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414L10 12.586z"/>
                </svg>
              </div>
              ${description ? `
                <button class="fancy-select-info-button" type="button" title="Show description">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                </button>
              ` : ''}
            </div>
            ${description ? `<div class="${descriptionClass}">${description}</div>` : ''}
            <div class="${dropdownClass}">
              <input 
                type="text" 
                class="fancy-select-search" 
                placeholder="Search..."
                value="${this.select.searchTerm}"
              />
              <div class="fancy-select-options">
                ${this.select.getFilteredOptions().map((opt, idx) => this.generateOptionHTML(opt, idx)).join('')}
              </div>
            </div>
          </div>
        `;
    }

    updateOptionsList() {
        const optionsContainer = this.select.container.querySelector('.fancy-select-options');
        if (!optionsContainer) return;
        
        // Clear expanded state when updating list
        this.select.expandedIndex = -1;
        
        optionsContainer.innerHTML = this.select.getFilteredOptions()
            .map((opt, idx) => this.generateOptionHTML(opt, idx))
            .join('');
        
        // Re-attach option-specific event listeners
        this.select.eventHandlers.attachOptionEvents(optionsContainer);
    }
}

// Make available globally for tests and browser usage
if (typeof global !== 'undefined') {
    global.FancySelectDOMBuilder = FancySelectDOMBuilder;
}
