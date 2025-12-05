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
  'src/app.js',
  'src/models/character.js',
  'src/models/data-loader.js',
  'src/views/toast-notification.js',
  'src/views/form-renderer.js',
  'src/views/character-form-manager.js',
  'src/views/character-view.js',
  'src/controllers/character-controller.js',
  'src/components/fancy-select.js',
  'data/descriptors.json',
  'data/types.json',
  'data/foci.json',
  'data/flavors.json',
  'data/abilities.json',
  'data/advancements.json',
  'data/powershifts.json',
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
html = html.replace('src="src/components/fancy-select.js"', `src="src/components/fancy-select.js?v=${VERSION}"`);
html = html.replace('src="src/models/character.js"', `src="src/models/character.js?v=${VERSION}"`);
html = html.replace('src="src/views/toast-notification.js"', `src="src/views/toast-notification.js?v=${VERSION}"`);
html = html.replace('src="src/views/form-renderer.js"', `src="src/views/form-renderer.js?v=${VERSION}"`);
html = html.replace('src="src/views/character-form-manager.js"', `src="src/views/character-form-manager.js?v=${VERSION}"`);
html = html.replace('src="src/views/character-view.js"', `src="src/views/character-view.js?v=${VERSION}"`);
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
