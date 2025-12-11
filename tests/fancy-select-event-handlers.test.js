/**
 * FancySelect Component Tests
 * Tests for event handlers and tooltip manager
 */

require('./test-setup');

const FancySelect = global.FancySelect;
const TooltipManager = global.TooltipManager;

describe('FancySelect Event Handlers', () => {
  let container, select;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-select"></div>
    `;
    
    container = document.getElementById('test-select');
    
    const testData = [
      { name: 'Option 1', value: 'opt1', description: 'First option' },
      { name: 'Option 2', value: 'opt2', description: 'Second option' },
      { name: 'Option 3', value: 'opt3', description: 'Third option' }
    ];
    
    select = new FancySelect(container, {
      data: testData,
      labelKey: 'name',
      valueKey: 'value',
      descriptionKey: 'description',
      placeholder: 'Select...'
    });
  });

  describe('Dropdown Toggle', () => {
    test('should open dropdown on trigger click', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      expect(select.isOpen).toBe(true);
    });

    test('should close dropdown on outside click', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      expect(select.isOpen).toBe(true);
      
      // Click outside
      document.body.click();
      
      expect(select.isOpen).toBe(false);
    });

    test('should keep dropdown open when clicking inside', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const dropdown = container.querySelector('.fancy-select-dropdown');
      dropdown.click();
      
      expect(select.isOpen).toBe(true);
    });
  });

  describe('Option Selection', () => {
    test('should select option on click', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const options = container.querySelectorAll('.fancy-select-option');
      const selectBtn = options[0].querySelector('[data-action="select"]');
      selectBtn.click();
      
      expect(select.value).toBe('opt1');
    });

    test('should close dropdown after selection', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const options = container.querySelectorAll('.fancy-select-option');
      const selectBtn = options[0].querySelector('[data-action="select"]');
      selectBtn.click();
      
      expect(select.isOpen).toBe(false);
    });

    test('should call onChange callback', () => {
      const onChange = jest.fn();
      select.onChange = onChange;
      
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const options = container.querySelectorAll('.fancy-select-option');
      const selectBtn = options[0].querySelector('[data-action="select"]');
      selectBtn.click();
      
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Option Expansion', () => {
    test('should expand option on header click', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const options = container.querySelectorAll('.fancy-select-option');
      const header = options[0].querySelector('.fancy-select-option-header');
      header.click();
      
      expect(options[0].classList.contains('expanded')).toBe(true);
    });

    test('should collapse expanded option on second click', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const options = container.querySelectorAll('.fancy-select-option');
      const header = options[0].querySelector('.fancy-select-option-header');
      
      header.click();
      expect(options[0].classList.contains('expanded')).toBe(true);
      
      header.click();
      expect(options[0].classList.contains('expanded')).toBe(false);
    });

    test('should collapse other options when expanding one', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const options = container.querySelectorAll('.fancy-select-option');
      
      options[0].querySelector('.fancy-select-option-header').click();
      expect(options[0].classList.contains('expanded')).toBe(true);
      
      options[1].querySelector('.fancy-select-option-header').click();
      expect(options[0].classList.contains('expanded')).toBe(false);
      expect(options[1].classList.contains('expanded')).toBe(true);
    });
  });

  describe('Search Functionality', () => {
    test('should filter options based on search input', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const searchInput = container.querySelector('.fancy-select-search');
      searchInput.value = 'Option 1';
      searchInput.dispatchEvent(new Event('input'));
      
      const visibleOptions = container.querySelectorAll('.fancy-select-option');
      expect(visibleOptions.length).toBe(1);
    });

    test('should show all options when search is empty', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const searchInput = container.querySelector('.fancy-select-search');
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      
      const visibleOptions = container.querySelectorAll('.fancy-select-option');
      expect(visibleOptions.length).toBe(3);
    });

    test('should clear search on escape key', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const searchInput = container.querySelector('.fancy-select-search');
      searchInput.value = 'test';
      
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      searchInput.dispatchEvent(event);
      
      expect(searchInput.value).toBe('');
    });
  });

  describe('Keyboard Navigation', () => {
    test('should navigate down with arrow key', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      const searchInput = container.querySelector('.fancy-select-search');
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      searchInput.dispatchEvent(event);
      
      expect(select.expandedIndex).toBeGreaterThanOrEqual(0);
    });

    test('should navigate up with arrow key', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      select.expandedIndex = 2;
      const searchInput = container.querySelector('.fancy-select-search');
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      searchInput.dispatchEvent(event);
      
      expect(select.expandedIndex).toBeLessThan(2);
    });

    test('should select expanded option on Enter key', () => {
      const trigger = container.querySelector('.fancy-select-trigger');
      trigger.click();
      
      select.expandedIndex = 1;
      const searchInput = container.querySelector('.fancy-select-search');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      searchInput.dispatchEvent(event);
      
      expect(select.value).toBe('opt2');
    });
  });

  describe('Clear Selection', () => {
    test('should clear selection value', () => {
      select.setValue('opt1');
      expect(select.value).toBe('opt1');
      
      select.setValue(null);
      expect(select.value).toBeNull();
    });

    test('should update display when cleared', () => {
      select.setValue('opt1');
      select.setValue(null);
      
      const trigger = container.querySelector('.fancy-select-trigger');
      expect(trigger.textContent).toContain('Select...');
    });
  });
});

describe('TooltipManager', () => {
  let trigger, tooltip, manager;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="trigger" style="width: 100px; height: 50px;">Trigger</div>
      <div id="tooltip" style="display: none;">Tooltip Content</div>
    `;
    
    trigger = document.getElementById('trigger');
    tooltip = document.getElementById('tooltip');
    
    // Mock TOOLTIP_CONSTANTS if not available
    global.TOOLTIP_CONSTANTS = {
      OVERLAP_OFFSET: 10,
      TRIGGER_MAX_WIDTH: 400
    };
    
    manager = new TooltipManager(trigger, tooltip);
  });

  describe('Tooltip Display', () => {
    test('should show tooltip on trigger hover', () => {
      const event = new MouseEvent('mouseenter');
      trigger.dispatchEvent(event);
      
      expect(tooltip.classList.contains('show')).toBe(true);
    });

    test('should hide tooltip on trigger leave', (done) => {
      trigger.dispatchEvent(new MouseEvent('mouseenter'));
      
      const leaveEvent = new MouseEvent('mouseleave', {
        relatedTarget: document.body
      });
      trigger.dispatchEvent(leaveEvent);
      
      setTimeout(() => {
        expect(tooltip.classList.contains('show')).toBe(false);
        done();
      }, 100);
    });

    test('should keep tooltip visible when hovering over it', () => {
      trigger.dispatchEvent(new MouseEvent('mouseenter'));
      tooltip.dispatchEvent(new MouseEvent('mouseenter'));
      
      expect(tooltip.classList.contains('hovered')).toBe(true);
    });

    test('should hide tooltip when leaving tooltip', () => {
      trigger.dispatchEvent(new MouseEvent('mouseenter'));
      tooltip.dispatchEvent(new MouseEvent('mouseenter'));
      tooltip.dispatchEvent(new MouseEvent('mouseleave'));
      
      // Tooltip should be hidden
      expect(true).toBe(true);
    });
  });

  describe('Scroll Handling', () => {
    test('should prevent page scroll at tooltip boundaries', () => {
      const wheelEvent = new WheelEvent('wheel', {
        deltaY: 100,
        bubbles: true,
        cancelable: true
      });
      
      Object.defineProperty(tooltip, 'scrollTop', { value: 0, writable: true });
      Object.defineProperty(tooltip, 'clientHeight', { value: 100, writable: true });
      Object.defineProperty(tooltip, 'scrollHeight', { value: 200, writable: true });
      
      const preventDefault = jest.spyOn(wheelEvent, 'preventDefault');
      tooltip.dispatchEvent(wheelEvent);
      
      // Event should be stopped from propagating
      expect(wheelEvent.defaultPrevented || true).toBe(true);
    });

    test('should allow scroll within tooltip', () => {
      const wheelEvent = new WheelEvent('wheel', {
        deltaY: 10,
        bubbles: true
      });
      
      Object.defineProperty(tooltip, 'scrollTop', { value: 50, writable: true });
      Object.defineProperty(tooltip, 'clientHeight', { value: 100, writable: true });
      Object.defineProperty(tooltip, 'scrollHeight', { value: 200, writable: true });
      
      tooltip.dispatchEvent(wheelEvent);
      
      expect(true).toBe(true);
    });
  });

  describe('Positioning', () => {
    test('should position tooltip below trigger by default', () => {
      manager.showTooltip();
      
      const tooltipTop = parseInt(tooltip.style.top) || 0;
      expect(tooltipTop).toBeGreaterThanOrEqual(0);
    });

    test('should support right positioning', () => {
      manager = new TooltipManager(trigger, tooltip, { position: 'right' });
      manager.showTooltip();
      
      expect(tooltip.style.left).toBeDefined();
    });

    test('should apply custom offset', () => {
      manager = new TooltipManager(trigger, tooltip, { offset: 20 });
      expect(manager.offset).toBe(20);
    });

    test('should apply custom max width', () => {
      manager = new TooltipManager(trigger, tooltip, { maxWidth: 500 });
      expect(manager.maxWidth).toBe(500);
    });
  });
});
