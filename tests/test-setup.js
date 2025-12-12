/**
 * Shared Test Setup and Utilities
 * Common setup code for all integration tests
 */

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

// Mock window.confirm (not implemented in JSDOM)
global.confirm = jest.fn(() => true);

// Load and register all source files in dependency order
// Each file exports its class and also registers on global
const { loadCypherData, cypherData } = require('../src/models/data-loader.js');
global.loadCypherData = loadCypherData;
global.cypherData = cypherData;

const FancySelectConstants = require('../src/components/fancy-select/constants.js');
Object.assign(global, FancySelectConstants);

const FancySelectUtils = require('../src/components/fancy-select/utils.js');
Object.assign(global, FancySelectUtils);

const TooltipManager = require('../src/components/fancy-select/tooltip-manager.js');
global.TooltipManager = TooltipManager;

const EventHandlers = require('../src/components/fancy-select/event-handlers.js');
Object.assign(global, EventHandlers);

const DomBuilder = require('../src/components/fancy-select/dom-builder.js');
Object.assign(global, DomBuilder);

const FancySelectCore = require('../src/components/fancy-select/fancy-select-core.js');
global.FancySelect = FancySelectCore;

const SkillsRenderer = require('../src/views/renderers/skills-renderer.js');
global.SkillsRenderer = SkillsRenderer;

const AbilitiesRenderer = require('../src/views/renderers/abilities-renderer.js');
global.AbilitiesRenderer = AbilitiesRenderer;

const EquipmentRenderer = require('../src/views/renderers/equipment-renderer.js');
global.EquipmentRenderer = EquipmentRenderer;

const CombatRenderer = require('../src/views/renderers/combat-renderer.js');
global.CombatRenderer = CombatRenderer;

const CyphersRenderer = require('../src/views/renderers/cyphers-renderer.js');
global.CyphersRenderer = CyphersRenderer;

const PowerShiftsRenderer = require('../src/views/renderers/power-shifts-renderer.js');
global.PowerShiftsRenderer = PowerShiftsRenderer;

const AdvancementsRenderer = require('../src/views/renderers/advancements-renderer.js');
global.AdvancementsRenderer = AdvancementsRenderer;

const FormRenderer = require('../src/views/form-renderer.js');
global.FormRenderer = FormRenderer;

const ToastNotification = require('../src/views/toast-notification.js');
global.ToastNotification = ToastNotification;

const CharacterFormManager = require('../src/views/character-form-manager.js');
global.CharacterFormManager = CharacterFormManager;

const CharacterModel = require('../src/models/character.js');
global.CharacterModel = CharacterModel;

const CharacterView = require('../src/views/character-view.js');
global.CharacterView = CharacterView;

const CharacterCRUDController = require('../src/controllers/modules/character-crud-controller.js');
global.CharacterCRUDController = CharacterCRUDController;

const CharacterChangeTracker = require('../src/controllers/modules/character-change-tracker.js');
global.CharacterChangeTracker = CharacterChangeTracker;

const CharacterController = require('../src/controllers/character-controller.js');
global.CharacterController = CharacterController;

// Export from global for tests
module.exports = {
  FancySelect: global.FancySelect,
  FormRenderer: global.FormRenderer,
  ToastNotification: global.ToastNotification,
  CharacterFormManager: global.CharacterFormManager,
  CharacterModel: global.CharacterModel,
  CharacterView: global.CharacterView,
  CharacterController: global.CharacterController,
  CharacterCRUDController: global.CharacterCRUDController,
  CharacterChangeTracker: global.CharacterChangeTracker,
  localStorageMock
};
