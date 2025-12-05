# Development Workflow Guide

## Overview

This project has two main development modes:

1. **Live Development** - For rapid UI development with instant browser refresh
2. **Build Testing** - For testing production builds continuously

## Mode 1: Live Development (Recommended for Most Work)

Use this for day-to-day development work.

```bash
npm run dev
```

**What it does:**
- Starts a development server on `http://localhost:8000`
- Opens your browser automatically
- Watches ALL files for changes
- Auto-refreshes browser when you save any file
- No build step required

**Best for:**
- UI development
- Testing features quickly
- Debugging with browser dev tools
- Most development work

**Note:** Files are served directly from source, not from `dist/`

## Mode 2: Build Testing

Use this when you want to test the production build continuously.

### Option A: Auto-Build + Manual Refresh

**Terminal 1:**
```bash
npm run build:watch
```

**Terminal 2:**
```bash
cd dist && python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

**What it does:**
- Watches: `src/`, `data/`, `styles.css`, `index.html`
- Auto-rebuilds to `dist/` on any change
- You manually refresh browser to see changes

**Best for:**
- Testing production builds
- Verifying cache-busting works
- Testing before deployment
- Ensuring build process includes all files

### Option B: Just Build Watch (No Server)

```bash
npm run build:watch
```

**What it does:**
- Watches files and rebuilds automatically
- Useful if you have a separate server running
- Or if you just want to ensure dist/ is always up-to-date

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server with live reload |
| `npm run build` | One-time build to dist/ |
| `npm run build:watch` | Auto-rebuild on file changes |
| `npm run rebuild` | Clean and rebuild |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests continuously |

## Recommended Workflows

### Daily Development
```bash
npm run dev
# Make changes, see them instantly in browser
```

### Pre-Deployment Testing
```bash
# Terminal 1
npm run build:watch

# Terminal 2
cd dist && python3 -m http.server 8080

# Browser: http://localhost:8080
# Make changes, rebuild happens automatically, manually refresh browser
```

### One-Time Build for Deployment
```bash
npm run build
# Upload dist/ folder to Netlify
```

## File Watching Details

**`npm run dev` watches:**
- Everything in the project
- Live-server handles file watching

**`npm run build:watch` watches:**
- `src/**/*` - All source files
- `data/**/*` - All JSON data files
- `styles.css` - Main stylesheet
- `index.html` - Main HTML file

**Ignored by watchers:**
- `node_modules/`
- `dist/` (build output)
- `tests/` (handled separately by `test:watch`)
- `.git/`

## Tips

1. **Use `npm run dev` for most work** - It's faster and more convenient

2. **Use `npm run build:watch` before deploying** - Catch build issues early

3. **Type `rs` in the build:watch terminal** - Manually trigger a rebuild

4. **Keep both modes running** - Run `npm run dev` in one terminal and `npm run build:watch` in another to have both development and production builds always ready

5. **Check the version number** - Each build creates a new timestamp in `dist/version.txt`

## Troubleshooting

### Build watch not detecting changes
- Ensure files are in watched directories
- Check that nodemon is installed: `npm list nodemon`
- Try manual rebuild: Type `rs` in the terminal

### Dev server not auto-refreshing
- Check browser console for errors
- Ensure live-server is installed: `npm list live-server`
- Try restarting: `Ctrl+C` then `npm run dev`

### Files not in dist/ after build
- Check `build.js` filesToCopy array
- Verify source files exist
- Look for build errors in console
