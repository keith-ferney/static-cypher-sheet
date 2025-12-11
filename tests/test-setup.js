/**
 * Shared Test Setup and Utilities
 * Common setup code for all integration tests
 */

const fs = require('fs');
const path = require('path');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;

// Load all necessary files in order
const dataLoaderCode = fs.readFileSync(path.join(__dirname, '../src/models/data-loader.js'), 'utf8');

// Load FancySelect modules in order
const constantsCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/constants.js'), 'utf8');
const utilsCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/utils.js'), 'utf8');
const tooltipManagerCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/tooltip-manager.js'), 'utf8');
const eventHandlersCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/event-handlers.js'), 'utf8');
const domBuilderCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/dom-builder.js'), 'utf8');
const fancySelectCoreCode = fs.readFileSync(path.join(__dirname, '../src/components/fancy-select/fancy-select-core.js'), 'utf8');

// Load renderer modules
const skillsRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/skills-renderer.js'), 'utf8');
const abilitiesRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/abilities-renderer.js'), 'utf8');
const equipmentRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/equipment-renderer.js'), 'utf8');
const combatRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/combat-renderer.js'), 'utf8');
const cyphersRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/cyphers-renderer.js'), 'utf8');
const powerShiftsRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/power-shifts-renderer.js'), 'utf8');
const advancementsRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/renderers/advancements-renderer.js'), 'utf8');
const formRendererCode = fs.readFileSync(path.join(__dirname, '../src/views/form-renderer.js'), 'utf8');

const toastNotificationCode = fs.readFileSync(path.join(__dirname, '../src/views/toast-notification.js'), 'utf8');
const characterFormManagerCode = fs.readFileSync(path.join(__dirname, '../src/views/character-form-manager.js'), 'utf8');
const characterModelCode = fs.readFileSync(path.join(__dirname, '../src/models/character.js'), 'utf8');
const characterViewCode = fs.readFileSync(path.join(__dirname, '../src/views/character-view.js'), 'utf8');
const characterCRUDControllerCode = fs.readFileSync(path.join(__dirname, '../src/controllers/modules/character-crud-controller.js'), 'utf8');
const characterChangeTrackerCode = fs.readFileSync(path.join(__dirname, '../src/controllers/modules/character-change-tracker.js'), 'utf8');
const characterControllerCode = fs.readFileSync(path.join(__dirname, '../src/controllers/character-controller.js'), 'utf8');

// Execute fancy-select modules and export classes
eval(constantsCode);
eval(utilsCode);
eval(tooltipManagerCode);
eval(eventHandlersCode);
eval(domBuilderCode);
eval(fancySelectCoreCode); // Defines FancySelect class globally
eval(dataLoaderCode);
eval(skillsRendererCode);
eval(abilitiesRendererCode);
eval(equipmentRendererCode);
eval(combatRendererCode);
eval(cyphersRendererCode);
eval(powerShiftsRendererCode);
eval(advancementsRendererCode);
eval(formRendererCode);
const ToastNotification = eval(`(function() { ${toastNotificationCode}; return ToastNotification; })()`);
const CharacterFormManager = eval(`(function() { ${characterFormManagerCode}; return CharacterFormManager; })()`);
const CharacterModel = eval(`(function() { ${characterModelCode}; return CharacterModel; })()`);
const CharacterView = eval(`(function() { ${characterViewCode}; return CharacterView; })()`);
const CharacterCRUDController = eval(`(function() { ${characterCRUDControllerCode}; return CharacterCRUDController; })()`);
const CharacterChangeTracker = eval(`(function() { ${characterChangeTrackerCode}; return CharacterChangeTracker; })()`);
const CharacterController = eval(`(function() { ${characterControllerCode}; return CharacterController; })()`);

// Access FancySelect from global (created by eval)
const FancySelect = global.FancySelect;
const FormRenderer = global.FormRenderer;

global.FancySelect = FancySelect;
global.FormRenderer = FormRenderer;
global.ToastNotification = ToastNotification;
global.CharacterFormManager = CharacterFormManager;
global.CharacterModel = CharacterModel;
global.CharacterView = CharacterView;
global.CharacterCRUDController = CharacterCRUDController;
global.CharacterChangeTracker = CharacterChangeTracker;
global.CharacterController = CharacterController;

// Export for use in test files
module.exports = {
  FancySelect,
  FormRenderer,
  ToastNotification,
  CharacterFormManager,
  CharacterModel,
  CharacterView,
  CharacterController,
  CharacterCRUDController,
  CharacterChangeTracker,
  localStorageMock
};
