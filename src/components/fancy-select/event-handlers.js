// FancySelect Event Handlers Module
class FancySelectEventHandlers {
    constructor(selectInstance) {
        this.select = selectInstance;
        
        // Bind handlers to maintain context
        this.outsideClickHandler = this.handleOutsideClick.bind(this);
        this.optionClickHandler = this.handleOptionClick.bind(this);
    }

    handleOutsideClick(e) {
        // Close dropdown if clicking outside
        if (this.select.isOpen && !this.select.container.contains(e.target)) {
            this.select.isOpen = false;
            this.select.expandedIndex = -1;
            this.select.render();
            return;
        }
        
        // Close info description if clicking outside (but not on the info button)
        if (this.select.showTriggerDescription) {
            const infoButton = this.select.container.querySelector('.fancy-select-info-button');
            const descriptionBox = this.select.container.querySelector('.fancy-select-trigger-description');
            
            if (!infoButton?.contains(e.target) && !descriptionBox?.contains(e.target)) {
                this.select.showTriggerDescription = false;
                this.select.render();
            }
        }
    }

    handleOptionClick(e) {
        e.stopPropagation();
        
        const optionEl = e.target.closest('.fancy-select-option');
        if (!optionEl) return;
        
        const action = e.target.closest('[data-action]')?.dataset.action;
        const value = optionEl.dataset.value;
        const index = parseInt(optionEl.dataset.index);
        const option = this.select.options.find(opt => 
            String(opt[this.select.valueKey]) === value
        );
        
        if (!option) return;
        
        if (action === 'select') {
            // Checkbox clicked - select the option
            this.select.selectOption(option);
        } else if (action === 'toggle') {
            // Header clicked (chevron or label) - toggle expansion
            if (this.select.expandedIndex === index) {
                this.select.expandedIndex = -1;
            } else {
                this.select.expandedIndex = index;
            }
            this.updateExpandedState();
        } else {
            // Clicked somewhere else on the option - toggle expansion
            if (this.select.expandedIndex === index) {
                this.select.expandedIndex = -1;
            } else {
                this.select.expandedIndex = index;
            }
            this.updateExpandedState();
        }
    }

    updateExpandedState() {
        const optionsContainer = this.select.container.querySelector('.fancy-select-options');
        if (!optionsContainer) return;
        
        const allOptions = optionsContainer.querySelectorAll('.fancy-select-option');
        allOptions.forEach((opt, idx) => {
            if (idx === this.select.expandedIndex) {
                opt.dataset.expanded = 'true';
            } else {
                delete opt.dataset.expanded;
            }
        });
    }

    handleArrowKey(direction, filtered, optionsContainer) {
        const oldIndex = this.select.expandedIndex;
        
        if (direction === 'down') {
            this.select.expandedIndex = Math.min(this.select.expandedIndex + 1, filtered.length - 1);
        } else if (direction === 'up') {
            this.select.expandedIndex = Math.max(this.select.expandedIndex - 1, 0);
        }
        
        this.updateNavigationState(oldIndex, this.select.expandedIndex, optionsContainer);
    }

    updateNavigationState(oldIndex, newIndex, optionsContainer) {
        if (oldIndex !== newIndex) {
            const options = optionsContainer.querySelectorAll('.fancy-select-option');
            if (options[newIndex]) {
                // scrollIntoView may not be available in test environments (e.g., JSDOM)
                if (typeof options[newIndex].scrollIntoView === 'function') {
                    options[newIndex].scrollIntoView({ block: 'nearest' });
                }
            }
        }
    }

    attachEvents() {
        const trigger = this.select.container.querySelector('.fancy-select-trigger');
        const searchInput = this.select.container.querySelector('.fancy-select-search');
        const optionsContainer = this.select.container.querySelector('.fancy-select-options');
        const dropdown = this.select.container.querySelector('.fancy-select-dropdown');
        const infoButton = this.select.container.querySelector('.fancy-select-info-button');
        
        // Remove old outside click listener before adding new one
        document.removeEventListener('click', this.outsideClickHandler);
        
        // Info button to toggle description
        if (infoButton) {
            infoButton.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close all other info boxes first
                this.select.closeOtherInfoBoxes();
                
                this.select.showTriggerDescription = !this.select.showTriggerDescription;
                this.select.render();
            });
        }
        
        // Toggle dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Don't open if disabled
            if (this.select.disabled) {
                return;
            }
            
            // Hide trigger description when opening dropdown
            this.select.showTriggerDescription = false;
            
            // Close all other dropdowns first
            this.select.closeOthers();
            
            this.select.isOpen = !this.select.isOpen;
            this.select.expandedIndex = -1;
            this.select.render();
            if (this.select.isOpen) {
                setTimeout(() => {
                    const input = this.select.container.querySelector('.fancy-select-search');
                    if (input) input.focus();
                }, 0);
            }
        });
        
        // Search input
        searchInput.addEventListener('input', (e) => {
            this.select.searchTerm = e.target.value;
            this.select.expandedIndex = -1;
            this.select.updateOptionsList();
        });
        
        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const filtered = this.select.getFilteredOptions();
            const optionsContainer = this.select.container.querySelector('.fancy-select-options');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.handleArrowKey('down', filtered, optionsContainer);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.handleArrowKey('up', filtered, optionsContainer);
            } else if (e.key === 'Enter' && filtered[this.select.expandedIndex]) {
                e.preventDefault();
                this.select.selectOption(filtered[this.select.expandedIndex]);
            } else if (e.key === 'Escape') {
                // Clear the search and close the dropdown
                this.select.searchTerm = '';
                searchInput.value = '';
                this.select.isOpen = false;
                this.select.render();
            }
        });
        
        // Attach option-specific event listeners
        this.attachOptionEvents(optionsContainer);
        
        // Add outside click listener (only once)
        // Always add it so we can close the info description box
        setTimeout(() => {
            document.addEventListener('click', this.outsideClickHandler);
        }, 0);
    }

    attachOptionEvents(optionsContainer) {
        // Replace event listeners to prevent accumulation
        replaceEventListener(optionsContainer, 'click', this.optionClickHandler);
    }
}

// Make available globally for tests and browser usage
if (typeof global !== 'undefined') {
    global.FancySelectEventHandlers = FancySelectEventHandlers;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FancySelectEventHandlers;
}
