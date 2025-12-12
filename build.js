#!/usr/bin/env node

/**
 * Simple Build Script for Cache Busting
 * 
 * This script:
 * 1. Generates a version hash based on current timestamp
 * 2. Creates a dist/ folder
 * 3. Copies all files to dist/
 * 4. Updates index.html to include version query strings on JS/CSS files
 */

const fs = require('fs');
const path = require('path');

// Generate version hash (timestamp)
const VERSION = Date.now();

console.log('🚀 Building static-deploy...');
console.log(`📦 Version: ${VERSION}`);

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);

// Files to copy directly
const filesToCopy = [
  'styles.css',
  'styles/layout.css',
  'styles/components/tables.css',
  'styles/components/fancy-select.css',
  'styles/components/toast.css',
  'styles/components/modal.css',
  'src/app.js',
  'src/models/character.js',
  'src/models/data-loader.js',
  'src/utils/template-loader.js',
  'src/views/toast-notification.js',
  'src/views/renderers/skills-renderer.js',
  'src/views/renderers/abilities-renderer.js',
  'src/views/renderers/equipment-renderer.js',
  'src/views/renderers/combat-renderer.js',
  'src/views/renderers/cyphers-renderer.js',
  'src/views/renderers/power-shifts-renderer.js',
  'src/views/renderers/advancements-renderer.js',
  'src/views/form-renderer.js',
  'src/views/character-form-manager.js',
  'src/views/character-view.js',
  'src/controllers/modules/character-crud-controller.js',
  'src/controllers/modules/character-change-tracker.js',
  'src/controllers/character-controller.js',
  'src/components/fancy-select/constants.js',
  'src/components/fancy-select/utils.js',
  'src/components/fancy-select/tooltip-manager.js',
  'src/components/fancy-select/event-handlers.js',
  'src/components/fancy-select/dom-builder.js',
  'src/components/fancy-select/fancy-select-core.js',
  'src/components/fancy-select.js',
  'data/descriptors.json',
  'data/types.json',
  'data/foci.json',
  'data/flavors.json',
  'data/abilities.json',
  'data/advancements.json',
  'data/powershifts.json',
  'templates/advancement-item.html',
  'templates/skill-row.html',
  'templates/equipment-item.html',
  'templates/ability-item.html',
  'templates/cypher-item.html',
  'templates/attack-item.html',
  'templates/power-shift-item.html',
  'assets/CharacterSheetBackground.png',
  'assets/ClaimTheSky.png'
];

// Copy files
console.log('📂 Copying files...');
filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    // Create subdirectories if needed
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`  ✓ ${file}`);
  }
});

// Read and process index.html
console.log('📝 Processing index.html...');
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Add version query strings to CSS and JS files
html = html.replace('href="styles.css"', `href="styles.css?v=${VERSION}"`);
html = html.replace('src="src/models/data-loader.js"', `src="src/models/data-loader.js?v=${VERSION}"`);
html = html.replace('src="src/utils/template-loader.js"', `src="src/utils/template-loader.js?v=${VERSION}"`);
html = html.replace('src="src/components/fancy-select/constants.js"', `src="src/components/fancy-select/constants.js?v=${VERSION}"`);
html = html.replace('src="src/components/fancy-select/utils.js"', `src="src/components/fancy-select/utils.js?v=${VERSION}"`);
html = html.replace('src="src/components/fancy-select/tooltip-manager.js"', `src="src/components/fancy-select/tooltip-manager.js?v=${VERSION}"`);
html = html.replace('src="src/components/fancy-select/event-handlers.js"', `src="src/components/fancy-select/event-handlers.js?v=${VERSION}"`);
html = html.replace('src="src/components/fancy-select/dom-builder.js"', `src="src/components/fancy-select/dom-builder.js?v=${VERSION}"`);
html = html.replace('src="src/components/fancy-select/fancy-select-core.js"', `src="src/components/fancy-select/fancy-select-core.js?v=${VERSION}"`);
html = html.replace('src="src/components/fancy-select.js"', `src="src/components/fancy-select.js?v=${VERSION}"`);
html = html.replace('src="src/models/character.js"', `src="src/models/character.js?v=${VERSION}"`);
html = html.replace('src="src/views/toast-notification.js"', `src="src/views/toast-notification.js?v=${VERSION}"`);
html = html.replace('src="src/views/renderers/skills-renderer.js"', `src="src/views/renderers/skills-renderer.js?v=${VERSION}"`);
html = html.replace('src="src/views/renderers/abilities-renderer.js"', `src="src/views/renderers/abilities-renderer.js?v=${VERSION}"`);
html = html.replace('src="src/views/renderers/equipment-renderer.js"', `src="src/views/renderers/equipment-renderer.js?v=${VERSION}"`);
html = html.replace('src="src/views/renderers/combat-renderer.js"', `src="src/views/renderers/combat-renderer.js?v=${VERSION}"`);
html = html.replace('src="src/views/renderers/cyphers-renderer.js"', `src="src/views/renderers/cyphers-renderer.js?v=${VERSION}"`);
html = html.replace('src="src/views/renderers/power-shifts-renderer.js"', `src="src/views/renderers/power-shifts-renderer.js?v=${VERSION}"`);
html = html.replace('src="src/views/renderers/advancements-renderer.js"', `src="src/views/renderers/advancements-renderer.js?v=${VERSION}"`);
html = html.replace('src="src/views/form-renderer.js"', `src="src/views/form-renderer.js?v=${VERSION}"`);
html = html.replace('src="src/views/character-form-manager.js"', `src="src/views/character-form-manager.js?v=${VERSION}"`);
html = html.replace('src="src/views/character-view.js"', `src="src/views/character-view.js?v=${VERSION}"`);
html = html.replace('src="src/controllers/modules/character-crud-controller.js"', `src="src/controllers/modules/character-crud-controller.js?v=${VERSION}"`);
html = html.replace('src="src/controllers/modules/character-change-tracker.js"', `src="src/controllers/modules/character-change-tracker.js?v=${VERSION}"`);
html = html.replace('src="src/controllers/character-controller.js"', `src="src/controllers/character-controller.js?v=${VERSION}"`);
html = html.replace('src="src/app.js"', `src="src/app.js?v=${VERSION}"`);

// Write processed index.html
fs.writeFileSync(path.join(distDir, 'index.html'), html);
console.log('  ✓ index.html (with cache-busting)');

// Create a version file for reference
fs.writeFileSync(
  path.join(distDir, 'version.txt'),
  `Build version: ${VERSION}\nBuild date: ${new Date().toISOString()}\n`
);
console.log('  ✓ version.txt');

console.log('');
console.log('✅ Build complete!');
console.log(`📁 Output directory: ${distDir}`);
console.log(`🔗 Open dist/index.html to test`);
