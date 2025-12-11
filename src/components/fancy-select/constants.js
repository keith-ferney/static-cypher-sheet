// Constants for FancySelect and TooltipManager
const TOOLTIP_CONSTANTS = {
  OVERLAP_OFFSET: -1,
  MIN_WIDTH: 300,
  EDGE_PADDING: 20,
  TRIGGER_MAX_WIDTH: 500
};

// Make available globally for tests and browser usage
if (typeof global !== 'undefined') {
  global.TOOLTIP_CONSTANTS = TOOLTIP_CONSTANTS;
}
