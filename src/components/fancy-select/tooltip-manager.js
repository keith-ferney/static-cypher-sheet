/**
 * TooltipManager - Handles tooltip positioning and scroll behavior
 */
class TooltipManager {
  constructor(triggerElement, tooltipElement, options = {}) {
    this.triggerElement = triggerElement;
    this.tooltipElement = tooltipElement;
    this.position = options.position || 'bottom'; // 'bottom' or 'right'
    this.offset = options.offset !== undefined ? options.offset : TOOLTIP_CONSTANTS.OVERLAP_OFFSET;
    this.maxWidth = options.maxWidth || TOOLTIP_CONSTANTS.TRIGGER_MAX_WIDTH;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Show tooltip on trigger hover
    this.triggerElement.addEventListener('mouseenter', () => {
      this.showTooltip();
    });
    
    this.triggerElement.addEventListener('mouseleave', (e) => {
      // Don't hide if mouse is moving to the tooltip
      if (e.relatedTarget === this.tooltipElement) {
        return;
      }
      this.hideTooltip();
    });
    
    // Keep tooltip visible when hovering over it
    this.tooltipElement.addEventListener('mouseenter', () => {
      this.tooltipElement.dataset.tooltipVisible = 'true';
      this.tooltipElement.dataset.hovered = 'true';
    });
    
    this.tooltipElement.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
    
    // Prevent page scroll when scrolling inside tooltip
    TooltipManager.addScrollHandler(this.tooltipElement);
  }
  
  static addScrollHandler(tooltipElement) {
    tooltipElement.addEventListener('wheel', (e) => {
      e.stopPropagation();
      
      // Only prevent default if we're at scroll boundaries
      const atTop = tooltipElement.scrollTop === 0 && e.deltaY < 0;
      const atBottom = tooltipElement.scrollTop + tooltipElement.clientHeight >= tooltipElement.scrollHeight && e.deltaY > 0;
      
      if (atTop || atBottom) {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  static positionTooltip(tooltipElement, triggerElement, position = 'bottom', offset = TOOLTIP_CONSTANTS.OVERLAP_OFFSET) {
    const rect = triggerElement.getBoundingClientRect();
    tooltipElement.style.position = 'fixed';
    
    if (position === 'bottom') {
      tooltipElement.style.top = `${rect.bottom + offset}px`;
      tooltipElement.style.left = `${rect.left}px`;
      tooltipElement.style.right = 'auto';
      tooltipElement.style.maxWidth = `${Math.min(TOOLTIP_CONSTANTS.TRIGGER_MAX_WIDTH, window.innerWidth - rect.left - TOOLTIP_CONSTANTS.EDGE_PADDING)}px`;
    } else if (position === 'right') {
      tooltipElement.style.top = `${rect.top}px`;
      tooltipElement.style.left = `${rect.right + offset}px`;
      tooltipElement.style.right = 'auto';
      tooltipElement.style.width = 'auto';
      tooltipElement.style.minWidth = `${TOOLTIP_CONSTANTS.MIN_WIDTH}px`;
      tooltipElement.style.maxWidth = `${window.innerWidth - rect.right - TOOLTIP_CONSTANTS.EDGE_PADDING}px`;
      tooltipElement.style.paddingLeft = '0.75rem';
    }
  }
  
  showTooltip() {
    TooltipManager.positionTooltip(this.tooltipElement, this.triggerElement, this.position, this.offset);
    this.tooltipElement.dataset.tooltipVisible = 'true';
  }
  
  hideTooltip() {
    delete this.tooltipElement.dataset.tooltipVisible;
    delete this.tooltipElement.dataset.hovered;
  }
}

// Make available globally for tests and browser usage
if (typeof global !== 'undefined') {
  global.TooltipManager = TooltipManager;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TooltipManager;
}
