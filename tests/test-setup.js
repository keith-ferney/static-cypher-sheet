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

// Mock template loader for tests
const { TemplateLoader } = require('../src/utils/template-loader.js');

// Create a mock template loader that returns inline templates
const mockTemplateLoader = {
  templates: {},
  loadTemplate: jest.fn(async (templateName) => {
    // Return simple mock templates for testing
    const templates = {
      'advancement-item': '<label class="advancement-item"><input type="checkbox" data-advancement="{{name}}" {{#isChecked}}checked{{/isChecked}}><span>{{name}}</span><small>{{description}}</small></label>',
      'skill-row': '<div class="skill-row"><input class="skill-name" value="{{name}}"><select class="skill-pool"><option value="">- select pool -</option><option value="might" {{#poolMight}}selected{{/poolMight}}>Might</option><option value="speed" {{#poolSpeed}}selected{{/poolSpeed}}>Speed</option><option value="intellect" {{#poolIntellect}}selected{{/poolIntellect}}>Intellect</option></select><input class="skill-ps" value="{{powerShift}}"><select class="skill-type"><option value="">- select type -</option><option value="trained" {{#typeTrained}}selected{{/typeTrained}}>Trained</option><option value="specialized" {{#typeSpecialized}}selected{{/typeSpecialized}}>Specialized</option><option value="inability" {{#typeInability}}selected{{/typeInability}}>Inability</option></select><button onclick="app.removeSkill({{index}})">×</button></div>',
      'equipment-item': '<div class="equipment-item"><span>{{item}}</span><button onclick="app.removeEquipment({{index}})">×</button></div>',
      'ability-item': '<div class="ability-item" data-edit-mode="false"><span class="ability-name-display">{{name}}</span><input class="ability-name-input hidden" value="{{name}}"><p class="ability-desc-display hidden">{{description}}</p><textarea class="ability-desc-input hidden">{{description}}</textarea><button onclick="app.removeAbility({{index}})">×</button></div>',
      'cypher-item': '<div class="cypher-item"><strong class="cypher-name">{{name}}</strong><input class="cypher-level-input" value="{{level}}" onchange="app.updateCypherLevel({{index}}, this.value)"><p class="cypher-desc">{{description}}</p><button onclick="app.removeCypher({{index}})">×</button></div>',
      'attack-item': '<div class="attack-item"><span>{{attack}}</span><button onclick="app.removeAttack({{index}})">×</button></div>',
      'power-shift-item': '<label><input type="number" class="ps-value" value="{{value}}" data-ps-name="{{name}}" data-ps-id="{{psId}}"><span>{{name}}</span>{{#hasHealingCheckboxes}}<div>{{#healingCheckboxes}}<input type="checkbox" {{#checked}}checked{{/checked}} data-ps-heart="{{psName}}" data-heart-num="{{num}}">{{/healingCheckboxes}}</div>{{/hasHealingCheckboxes}}{{#allowsAdditionalText}}<input type="text" class="ps-text" value="{{additionalText}}" data-ps-text="{{name}}-{{psId}}">{{/allowsAdditionalText}}{{#canRemove}}<button onclick="removePowerShiftInstance(\'{{name}}\', \'{{psId}}\')">×</button>{{/canRemove}}{{#isLast}}<button onclick="addPowerShiftInstance(\'{{name}}\')">+</button>{{/isLast}}{{#isPerRound}}<span>Per Round</span>{{/isPerRound}}</label>'
    };
    return templates[templateName] || '';
  }),
  render: (template, data) => {
    let result = template;
    
    // Handle conditionals {{#key}}content{{/key}} - process from innermost to outermost
    // Keep processing until no more matches
    let previousResult;
    do {
      previousResult = result;
      result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
        const value = data[key];
        if (Array.isArray(value)) {
          return value.map(item => {
            let itemResult = content;
            
            // First handle nested conditionals for this item
            itemResult = itemResult.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (nestedMatch, nestedKey, nestedContent) => {
              return item[nestedKey] ? nestedContent : '';
            });
            
            // Then replace variables in the item content
            Object.keys(item).forEach(itemKey => {
              const regex = new RegExp(`\\{\\{${itemKey}\\}\\}`, 'g');
              itemResult = itemResult.replace(regex, mockTemplateLoader.escapeHtml(item[itemKey]));
            });
            return itemResult;
          }).join('');
        } else if (value) {
          return content;
        } else {
          return '';
        }
      });
    } while (result !== previousResult); // Keep processing until stable
    
    // Simple variable replacement
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, mockTemplateLoader.escapeHtml(data[key]) || '');
    });
    return result;
  },
  escapeHtml: (text) => {
    if (typeof text !== 'string') return String(text !== undefined ? text : '');
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
};

global.TemplateLoader = TemplateLoader;
global.templateLoader = mockTemplateLoader;

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
  mockTemplateLoader,
  localStorageMock
};
