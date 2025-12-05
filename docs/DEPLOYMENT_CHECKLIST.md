# Deployment Checklist

Use this checklist every time you deploy an update.

## Pre-Deployment

- [ ] All changes tested locally with `npm run dev`
- [ ] Run tests: `npm test`
- [ ] All tests passing
- [ ] Bug fixes documented in relevant files
- [ ] Verify all new JavaScript files are added to `build.js` filesToCopy array

## Build

- [ ] Run build: `npm run build`
- [ ] Check for build errors
- [ ] Verify `dist/` folder created
- [ ] Spot-check a few files in `dist/` to ensure they copied correctly
- [ ] Verify all refactored view files are present:
  - [ ] `dist/src/views/toast-notification.js`
  - [ ] `dist/src/views/form-renderer.js`
  - [ ] `dist/src/views/character-form-manager.js`
  - [ ] `dist/src/views/character-view.js`

## Verify Cache-Busting

- [ ] Open `dist/index.html` in text editor
- [ ] Confirm all JS/CSS files have `?v=` query strings
- [ ] Note the version number from `dist/version.txt`

## Test Built Version (Recommended)

Use a local server to test (don't open file:// directly):
```bash
cd dist && python3 -m http.server 8080
```

- [ ] Open `http://localhost:8080` in browser
- [ ] Check browser console for any errors
- [ ] Verify all JavaScript files load correctly (no 404s)
- [ ] Create a test character
- [ ] Test dropdown selectors (Descriptor, Type, Focus, Flavor)
- [ ] Save character and verify toast notification appears
- [ ] Reload page and verify character persists
- [ ] Test all form sections (Skills, Abilities, Equipment, etc.)
- [ ] Reload page - character should persist
- [ ] Delete test character

## Deploy

Choose your deployment method:

### GitHub Pages
- [ ] Copy `dist/` contents to deployment branch
- [ ] Push to GitHub
- [ ] Wait for GitHub Pages to update (~1 minute)
- [ ] Visit live site

### Netlify/Vercel
- [ ] Drag and drop `dist/` folder to dashboard, OR
- [ ] Push to git and let auto-deploy run
- [ ] Wait for deployment to complete
- [ ] Visit live site

### Manual Upload (S3, FTP, etc.)
- [ ] Upload `dist/` folder contents to hosting
- [ ] Verify all files uploaded
- [ ] Visit live site

## Post-Deployment Verification

- [ ] Open live site in browser
- [ ] Open DevTools > Network tab
- [ ] Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- [ ] Verify JS/CSS files show new version query string
- [ ] Test core functionality:
  - [ ] Create character
  - [ ] Select from dropdowns
  - [ ] Save character
  - [ ] Reload page
  - [ ] Character persists
- [ ] Test on different browser (if possible)

## If Users Report Issues

1. Check browser console for errors
2. Verify they're not seeing cached version:
   - View page source
   - Check if JS files have current version query string
   - If not, they need to hard refresh
3. Check `version.txt` on live site matches your deployment

## Notes

- Version numbers are timestamps, so each build is unique
- Users don't need to clear cache - version query strings handle it
- If editing source files, rebuild before deploying
- The `dist/` folder is gitignored - don't commit it
