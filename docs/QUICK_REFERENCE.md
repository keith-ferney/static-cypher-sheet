# 🚀 Quick Reference - Build Pipeline

## Commands

```bash
npm run build      # Build for production → creates dist/
npm run clean      # Remove dist/ folder
npm run rebuild    # Clean + build in one command
npm test           # Run automated tests
```

## Workflow

### Making Changes
1. Edit files in the root folder (NOT in dist/)
2. Test locally - open `index.html` in browser or run `python3 -m http.server 8080`
3. Run tests: `npm test`

### Deploying
1. `npm run build`
2. Upload `dist/` folder to hosting
3. Done! Cache-busting is automatic

## What Gets Cache-Busted?

✅ `src/app.js?v=TIMESTAMP`  
✅ `src/models/data-loader.js?v=TIMESTAMP`  
✅ `src/components/fancy-select.js?v=TIMESTAMP`  
✅ `src/views/character-view.js?v=TIMESTAMP`
✅ `src/controllers/character-controller.js?v=TIMESTAMP`
✅ `src/models/character.js?v=TIMESTAMP`
✅ `styles.css?v=TIMESTAMP`

❌ JSON files (don't need versioning)  
❌ Images (don't change)  

## Troubleshooting

**Users seeing old version?**
→ Check they're getting the new version query string  
→ Have them hard refresh (Cmd+Shift+R)

**Build fails?**
→ Make sure you're in `static-deploy/` directory  
→ Try `npm run rebuild`

## File Structure

```
static-cypher-sheet/
├── src/                     ← Edit these
│   ├── app.js
│   ├── models/
│   ├── views/
│   ├── controllers/
│   └── components/
├── styles.css               ← Edit this
├── index.html               ← Edit this
├── data/*.json              ← Edit these
├── build.js                 ← Build script (don't edit)
├── package.json             ← Scripts config
├── dist/                    ← Generated (don't edit!)
│   ├── index.html           ← Has cache-busting
│   ├── src/                 ← Copied from source
│   └── ...                  ← All files copied
└── tests/                   ← Your tests
```

## Remember

- ✅ Always edit source files (root folder)
- ✅ Always run `npm run build` before deploying
- ✅ Always deploy the `dist/` folder
- ❌ Never edit files in `dist/` (they get overwritten)
- ❌ Never commit `dist/` to git (it's generated)
