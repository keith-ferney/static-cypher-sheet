# Netlify Deployment Guide

## Quick Deployment

### Option 1: Drag and Drop (Easiest)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Go to [Netlify](https://app.netlify.com/)
   - Drag and drop the `dist/` folder onto the deploy area
   - Done! Your site is live

### Option 2: Git Integration (Recommended for Updates)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose your repository
   - Netlify will auto-detect `netlify.toml` configuration

3. **Automatic Builds:**
   - Every push to `main` branch triggers automatic deployment
   - Netlify runs `npm run build`
   - Publishes the `dist/` folder

## Configuration

The `netlify.toml` file is already configured with:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

This tells Netlify:
- ✅ Run `npm run build` to build the project
- ✅ Deploy the `dist/` folder

## JavaScript Files & MIME Types

**You don't need to worry about JavaScript files on Netlify!**

The issue you experienced locally (JavaScript files not loading) was because you were opening `index.html` directly with the `file://` protocol. 

On Netlify (and any proper web server):
- ✅ Files are served with correct MIME types
- ✅ HTTP headers are properly configured
- ✅ All JavaScript modules load correctly
- ✅ No CORS issues

The `netlify.toml` includes explicit JavaScript MIME type headers just to be extra safe, but Netlify handles this correctly by default.

## Build Process

Our build script (`build.js`) handles:
1. **Cache Busting** - Adds version query strings to all JS/CSS files
2. **File Copying** - Copies all necessary files to `dist/`
3. **HTML Processing** - Updates script tags with version numbers

All refactored view components are included:
- `toast-notification.js` - Toast notifications
- `form-renderer.js` - Form rendering utilities  
- `character-form-manager.js` - Form data management
- `character-view.js` - Main view orchestrator

## Troubleshooting

### Build Fails on Netlify

**Check Node version:**
Netlify uses Node 18.x by default. If you need a specific version, add to `netlify.toml`:

```toml
[build.environment]
  NODE_VERSION = "18"
```

### Files Missing After Build

Verify all files are in `build.js` filesToCopy array. Run locally:
```bash
npm run build
ls -la dist/src/views/
```

### JavaScript Not Loading

This should NOT happen on Netlify, but if it does:
1. Check browser console for 404 errors
2. Verify files exist in deployed site
3. Check that `netlify.toml` is in the repository root

## Testing Before Deployment

**Always test the built version locally before deploying:**

```bash
# Build
npm run build

# Test built version
cd dist && python3 -m http.server 8080

# Open http://localhost:8080 in your browser
```

This simulates the Netlify environment and catches issues before deployment.

## Custom Domain

To add a custom domain:
1. Go to Site Settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions
4. Netlify provides free HTTPS with Let's Encrypt

## Environment Variables

This app doesn't use environment variables (all data is static JSON files), but if you need them later:
1. Site Settings → Build & deploy → Environment
2. Add key-value pairs
3. Access in build script via `process.env.YOUR_VAR`

## Monitoring

- **Deploy logs:** Check each deployment's build log for errors
- **Function logs:** Not applicable (static site, no serverless functions)
- **Analytics:** Enable Netlify Analytics for traffic insights

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Deploy Previews](https://docs.netlify.com/site-deploys/deploy-previews/)
