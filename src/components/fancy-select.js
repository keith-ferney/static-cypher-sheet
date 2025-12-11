/**
 * FancySelect - Searchable dropdown with tooltips
 * 
 * This file serves as a unified entry point that loads all modular components.
 * The actual implementation is split across multiple files for better maintainability:
 * - constants.js: Configuration constants
 * - utils.js: Utility functions
 * - tooltip-manager.js: Tooltip positioning and behavior
 * - fancy-select-core.js: Main FancySelect component
 * 
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

// Note: In the current architecture, all dependencies are loaded via separate script tags in index.html
// This file exists for backward compatibility and documentation purposes.
// The actual classes (TOOLTIP_CONSTANTS, TooltipManager, FancySelect) are defined in their respective modules.
