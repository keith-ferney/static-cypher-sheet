/**
 * Test to reproduce power shift ability name bug
 */

require('./tests/test-setup');

const CharacterModel = global.CharacterModel;
const CharacterView = global.CharacterView;
const CharacterController = global.CharacterController;

// Setup
localStorage.clear();

const model = new CharacterModel();
const view = new CharacterView();
const controller = new CharacterController(model, view);

document.body.innerHTML = `
  <div id="character-sheet-view">
    <div id="powershifts-list"></div>
  </div>
`;

global.cypherData = {
  powerShifts: [
    { name: 'Flight', description: 'Fly around', has_healing_checkboxes: false, allows_additional_text: true, is_per_round: true }
  ],
  loaded: true
};

// Render initial power shift
view.renderPowerShifts([]);

console.log('Initial render done');
const textInput = document.querySelector('[data-ps-text^="Flight-"]');
console.log('Text input found:', !!textInput);
console.log('Text input value:', textInput ? textInput.value : 'N/A');

// User types "super speed" in the ability name box
if (textInput) {
  textInput.value = 'super speed';
  console.log('Set text to "super speed"');
}

// User clicks the green plus button
console.log('\nClicking green plus button...');
controller.addPowerShiftInstance('Flight');

// Check what happened
const textInputs = document.querySelectorAll('[data-ps-text^="Flight-"]');
console.log('\nAfter adding instance:');
console.log('Number of Flight instances:', textInputs.length);
textInputs.forEach((input, i) => {
  console.log(`  Instance ${i}: value="${input.value}", id=${input.dataset.psText}`);
});

// Get the current power shifts
const powerShifts = view.getAllPowerShifts();
console.log('\nPower shifts data:');
powerShifts.forEach(ps => {
  console.log(`  ${ps.name} (id: ${ps.id}): value=${ps.value}, text="${ps.additional_text}"`);
});
