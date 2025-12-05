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
    this.hoveredIndex = -1;
    this.isOpen = false;
    this.dropdownElement = null;
    
    // Bind event handlers so we can properly add/remove them
    this.outsideClickHandler = this.handleOutsideClick.bind(this);
    this.optionClickHandler = this.handleOptionClick.bind(this);
    this.optionHoverHandler = this.handleOptionHover.bind(this);
    
    // Add this instance to the static list
    FancySelect.instances.push(this);
    
    this.render();
  }
  
  static closeAll() {
    FancySelect.instances.forEach(instance => {
      if (instance.isOpen) {
        instance.isOpen = false;
        instance.hoveredIndex = -1;
        instance.render();
      }
    });
  }
  
  handleOutsideClick(e) {
    // Don't close if clicking on a description tooltip
    if (e.target.closest('.fancy-select-option-description')) {
      return;
    }
    
    if (this.isOpen && !this.container.contains(e.target)) {
      this.isOpen = false;
      this.hoveredIndex = -1; // Clear hover state
      this.render();
    }
  }

  handleOptionClick(e) {
    e.stopPropagation();
    const optionEl = e.target.closest('.fancy-select-option');
    if (optionEl) {
      const value = optionEl.dataset.value;
      const option = this.options.find(opt => String(opt[this.valueKey]) === value);
      if (option) this.selectOption(option);
    }
  }

  handleOptionHover(e) {
    const optionEl = e.target.closest('.fancy-select-option');
    if (optionEl) {
      const optionsContainer = this.container.querySelector('.fancy-select-options');
      const newIndex = parseInt(optionEl.dataset.index);
      if (newIndex !== this.hoveredIndex) {
        // Remove old hover state
        const oldHovered = optionsContainer.querySelector('.fancy-select-option.hovered');
        if (oldHovered) oldHovered.classList.remove('hovered');
        
        // Add new hover state
        this.hoveredIndex = newIndex;
        optionEl.classList.add('hovered');
        
        // Position description tooltip with fixed positioning
        const description = optionEl.querySelector('.fancy-select-option-description');
        if (description) {
          const rect = optionEl.getBoundingClientRect();
          description.style.position = 'fixed';
          description.style.top = `${rect.top}px`;
          description.style.left = `${rect.right - 1}px`; // Overlap by 1px to eliminate gap
          description.style.right = 'auto';
          description.style.width = 'auto';
          description.style.minWidth = '300px';
          description.style.maxWidth = `${window.innerWidth - rect.right - 20}px`; // Use available space
          description.style.paddingLeft = '0.75rem'; // Add left padding back
          
          // Prevent page scroll when scrolling inside description
          description.addEventListener('wheel', (e) => {
            e.stopPropagation();
            
            // Only prevent default if we're at scroll boundaries
            const atTop = description.scrollTop === 0 && e.deltaY < 0;
            const atBottom = description.scrollTop + description.clientHeight >= description.scrollHeight && e.deltaY > 0;
            
            if (atTop || atBottom) {
              e.preventDefault();
            }
          }, { passive: false });
          
          // Hide description when mouse leaves it
          description.addEventListener('mouseleave', () => {
            optionEl.classList.remove('hovered');
            this.hoveredIndex = -1;
          });
        }
      }
    }
  }
  
  render() {
    const selectedOption = this.options.find(opt => opt[this.valueKey] === this.value);
    const displayText = selectedOption ? selectedOption[this.labelKey] : this.placeholder;
    const description = selectedOption ? selectedOption[this.descriptionKey] : '';
    
    this.container.innerHTML = `
      <div class="fancy-select ${this.extraWide ? 'extra-wide' : ''}">
        <div class="fancy-select-trigger" tabindex="0" title="${description}">
          ${displayText}
          <svg class="w-4 h-4 ${this.isOpen ? 'rotate-180' : ''}" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414L10 12.586z"/>
          </svg>
        </div>
        <div class="fancy-select-dropdown ${this.isOpen ? '' : 'hidden'}">
          <input 
            type="text" 
            class="fancy-select-search" 
            placeholder="Search..."
            value="${this.searchTerm}"
          />
          <div class="fancy-select-options">
            ${this.getFilteredOptions().map((opt, idx) => `
              <div 
                class="fancy-select-option ${idx === this.hoveredIndex ? 'hovered' : ''}"
                data-value="${opt[this.valueKey]}"
                data-index="${idx}"
                data-description="${(opt[this.descriptionKey] || '').replace(/"/g, '&quot;')}"
              >
                <div class="fancy-select-option-label">${opt[this.labelKey]}</div>
                ${opt[this.descriptionKey] ? `<div class="fancy-select-option-description">${opt[this.descriptionKey]}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    this.attachEvents();
  }
  
  getFilteredOptions() {
    if (!this.searchTerm) return this.options;
    const term = this.searchTerm.toLowerCase();
    return this.options.filter(opt => 
      opt[this.labelKey].toLowerCase().includes(term)
    );
  }
  
  updateOptionsList() {
    const optionsContainer = this.container.querySelector('.fancy-select-options');
    if (!optionsContainer) return;
    
    // Clear hover state when updating list
    this.hoveredIndex = -1;
    
    optionsContainer.innerHTML = this.getFilteredOptions().map((opt, idx) => `
      <div 
        class="fancy-select-option"
        data-value="${opt[this.valueKey]}"
        data-index="${idx}"
        data-description="${(opt[this.descriptionKey] || '').replace(/"/g, '&quot;')}"
      >
        <div class="fancy-select-option-label">${opt[this.labelKey]}</div>
        ${opt[this.descriptionKey] ? `<div class="fancy-select-option-description">${opt[this.descriptionKey]}</div>` : ''}
      </div>
    `).join('');
    
    // Re-attach option-specific event listeners
    this.attachOptionEvents(optionsContainer);
  }
  
  attachOptionEvents(optionsContainer) {
    // Remove old event listeners before adding new ones to prevent accumulation
    optionsContainer.removeEventListener('click', this.optionClickHandler);
    optionsContainer.removeEventListener('mouseover', this.optionHoverHandler);
    
    // Add event listeners
    optionsContainer.addEventListener('click', this.optionClickHandler);
    optionsContainer.addEventListener('mouseover', this.optionHoverHandler);
  }
  
  attachEvents() {
    const trigger = this.container.querySelector('.fancy-select-trigger');
    const searchInput = this.container.querySelector('.fancy-select-search');
    const optionsContainer = this.container.querySelector('.fancy-select-options');
    const dropdown = this.container.querySelector('.fancy-select-dropdown');
    
    // Remove old outside click listener before adding new one
    document.removeEventListener('click', this.outsideClickHandler);
    
    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent immediate close from outside click
      
      // Close all other dropdowns first
      FancySelect.instances.forEach(instance => {
        if (instance !== this && instance.isOpen) {
          instance.isOpen = false;
          instance.hoveredIndex = -1;
          instance.render();
        }
      });
      
      this.isOpen = !this.isOpen;
      this.hoveredIndex = -1; // Reset hover state when opening
      this.render();
      if (this.isOpen) {
        setTimeout(() => {
          const input = this.container.querySelector('.fancy-select-search');
          if (input) input.focus();
        }, 0);
      }
    });
    
    // Hide all hovers when mouse leaves the dropdown
    dropdown.addEventListener('mouseleave', () => {
      const allOptions = optionsContainer.querySelectorAll('.fancy-select-option');
      allOptions.forEach(opt => opt.classList.remove('hovered'));
      this.hoveredIndex = -1;
    });
    
    // Search input
    searchInput.addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      this.hoveredIndex = 0;
      // Update only the options list, not the entire dropdown
      this.updateOptionsList();
    });
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      const filtered = this.getFilteredOptions();
      const optionsContainer = this.container.querySelector('.fancy-select-options');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const oldIndex = this.hoveredIndex;
        this.hoveredIndex = Math.min(this.hoveredIndex + 1, filtered.length - 1);
        
        // Update hover state directly without re-rendering
        if (oldIndex !== this.hoveredIndex) {
          const options = optionsContainer.querySelectorAll('.fancy-select-option');
          if (options[oldIndex]) options[oldIndex].classList.remove('hovered');
          if (options[this.hoveredIndex]) {
            options[this.hoveredIndex].classList.add('hovered');
            options[this.hoveredIndex].scrollIntoView({ block: 'nearest' });
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const oldIndex = this.hoveredIndex;
        this.hoveredIndex = Math.max(this.hoveredIndex - 1, 0);
        
        // Update hover state directly without re-rendering
        if (oldIndex !== this.hoveredIndex) {
          const options = optionsContainer.querySelectorAll('.fancy-select-option');
          if (options[oldIndex]) options[oldIndex].classList.remove('hovered');
          if (options[this.hoveredIndex]) {
            options[this.hoveredIndex].classList.add('hovered');
            options[this.hoveredIndex].scrollIntoView({ block: 'nearest' });
          }
        }
      } else if (e.key === 'Enter' && filtered[this.hoveredIndex]) {
        e.preventDefault();
        this.selectOption(filtered[this.hoveredIndex]);
      } else if (e.key === 'Escape') {
        this.isOpen = false;
        this.render();
      }
    });
    
    // Attach option-specific event listeners
    this.attachOptionEvents(optionsContainer);
    
    // Add outside click listener (only once)
    if (this.isOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.outsideClickHandler);
      }, 0);
    }
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
}
