# Build & Deployment Guide

## Overview
This is a simple cache-busting build pipeline for the static Cypher Character Creator. It generates versioned files to prevent browser caching issues when deploying updates.

## Prerequisites
- Node.js installed (for running the build script)

## Building for Production

### Run the build:
```bash
npm run build
```

This will:
1. Create a `dist/` folder
2. Copy all necessary files
3. Add version query strings to JS/CSS files in index.html (e.g., `app.js?v=1234567890`)
4. Generate a `version.txt` file with build info

### Output
All production-ready files will be in the `dist/` folder:
```
dist/
├── index.html (with cache-busting)
├── styles.css
├── src/
│   ├── app.js
│   ├── models/
│   │   ├── character.js
│   │   └── data-loader.js
│   ├── views/
│   │   └── character-view.js
│   ├── controllers/
│   │   └── character-controller.js
│   └── components/
│       └── fancy-select.js
├── data/
│   ├── descriptors.json
│   ├── types.json
│   ├── foci.json
│   ├── flavors.json
│   ├── abilities.json
│   ├── advancements.json
│   └── powershifts.json
├── assets/
│   ├── CharacterSheetBackground.png
│   └── ClaimTheSky.png
└── version.txt
```

## Deployment

### Option 1: GitHub Pages
1. Build the project: `npm run build`
2. Push the `dist/` folder to a `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Option 2: Netlify/Vercel
1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Or set build command to `npm run build` and publish directory to `dist`

### Option 3: Static Hosting (AWS S3, etc.)
1. Build the project: `npm run build`
2. Upload contents of `dist/` folder to your hosting
3. Set appropriate cache headers:
   - `index.html`: `Cache-Control: no-cache` (always check for updates)
   - `*.js`, `*.css`: `Cache-Control: public, max-age=31536000` (cache forever, version changes bust cache)
   - `*.json`, `*.png`: `Cache-Control: public, max-age=31536000`

### Option 4: Simple File Server
1. Build the project: `npm run build`
2. Copy `dist/` contents to your web server directory
3. Done!

## Cache Busting Explained

Each build generates a unique timestamp (e.g., `1764891424961`) and appends it as a query string:
- Before: `<script src="src/app.js"></script>`
- After: `<script src="src/app.js?v=1764891424961"></script>`

When you deploy an update:
1. Run `npm run build` again (generates new timestamp)
2. Deploy the new `dist/` folder
3. Users automatically get the latest version (no manual cache clearing needed!)

## Development Workflow

### During Development
- Work directly in the root folder
- Run `npm test` to test your changes
- Test locally with `python3 -m http.server 8080`
- No build needed for local development

### When Ready to Deploy
```bash
# 1. Make your changes
# 2. Test them
npm test

# 3. Build for production
npm run build

# 4. Optionally test the built version
# Open dist/index.html in browser

# 5. Deploy dist/ folder
```

## Continuous Deployment

If using GitHub Actions, Netlify, or similar:

**GitHub Actions Example:**
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
      - name: Build
        run: |
          cd static-deploy
          npm run build
      - name: Deploy
        # Your deployment step here
```

## Files Explained

- `build.js` - The build script that creates the dist folder
- `package.json` - Contains the `npm run build` command
- `.gitignore` - Excludes `dist/` from version control
- `dist/` - Generated folder (not committed to git)

## Troubleshooting

### Users still seeing old version after deployment
- Verify the version query strings are present in deployed `index.html`
- Check browser DevTools Network tab - query string should be different
- Ensure `index.html` itself isn't being cached by your server

### Build fails
- Ensure you're in the `static-deploy/` directory
- Check that all source files exist
- Try deleting `dist/` and running `npm run build` again

## Version History

You can check what version is currently deployed:
```bash
cat dist/version.txt
```

Shows:
```
Build version: 1764891424961
Build date: 2025-12-04T23:37:05.005Z
```

## No Framework, No Problem

This project intentionally uses **zero dependencies** (except dev dependencies for testing). The build script is plain Node.js with no external packages. This means:
- ✅ Works forever (no breaking changes)
- ✅ No security vulnerabilities 
- ✅ No npm package updates needed
- ✅ Maximum stability
