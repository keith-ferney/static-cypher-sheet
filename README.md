# Cypher System Character Creator - Static Version

A standalone, browser-based character sheet creator for the Cypher System RPG. This version requires no backend server and stores all data locally in your browser.

## Quick Start

### For Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (with auto-reload):
   ```bash
   npm run dev
   ```
   This will start a local server at `http://localhost:8000` and automatically refresh the browser when you make changes.

### For Users
1. Open `index.html` in your web browser (requires a local server)
2. Or run `npm run dev` for the best experience
3. Start creating characters!

### For Deployment
```bash
npm run build
```
Then deploy the `dist/` folder to any static hosting.

See [BUILD_DEPLOY.md](BUILD_DEPLOY.md) for detailed deployment instructions.

## Features

### Character Management
- Create, edit, and delete multiple characters
- All data stored in browser's localStorage
- Character list view with quick access to edit each character

### Character Sheet Features

#### Basic Information
- Character name, tier, and experience
- Descriptor, Type, Focus, and Flavor (matching original Cypher System sentence structure)
- Background, notes, and portrait description fields

#### Stats & Pools
- Might, Speed, and Intellect pools with current/max values and edge
- Effort tracking
- Recovery rolls (Action, 10 min, 1 hour, 10 hours)
- Recovery modifier
- Damage track (Impaired, Debilitated)

#### Enhanced Skills System
- **Name**: The skill name
- **Pool**: Associated stat pool (Might/Speed/Intellect)
- **PS**: Power shift value
- **Type**: Trained, Specialized, or Inability
- Table view for easy management
- Add/remove skills dynamically

#### Special Abilities
- Collapsible ability descriptions
- Editable name and description fields
- Toggle description visibility with ▼ button
- Supports multiple abilities

#### Equipment & Combat
- Equipment list with add/remove functionality
- Attacks tracking
- Cyphers with name, level, and description

#### Power Shifts
- Automatic loading from game data (powershifts.json)
- Numerical values (0-5) for each power shift type
- Displays all available power shift options

## Game Data Integration

The app loads comprehensive Cypher System game data from JSON files:

- **descriptors.json** (86K) - Character descriptors
- **types.json** (68K) - Character types with stat pools and abilities
- **foci.json** (77K) - Character foci
- **flavors.json** (6.8K) - Type flavors/variants
- **abilities.json** (451K) - All special abilities with descriptions
- **advancements.json** (423B) - Character advancement options
- **powershifts.json** (1.6K) - Power shift mechanics

Total game data: ~690KB extracted from original Laravel app seeders.

## Files Structure

```
static-cypher-sheet/
├── index.html              # Main character sheet HTML
├── styles.css              # Minimal custom CSS
├── build.js                # Build script for deployment
├── package.json            # NPM scripts and config
├── jest.config.json        # Test configuration
├── src/
│   ├── app.js              # Character management logic
│   ├── models/
│   │   ├── character.js    # Character data model
│   │   └── data-loader.js  # Loads game data from JSON files
│   ├── views/
│   │   └── character-view.js  # Character sheet rendering
│   ├── controllers/
│   │   └── character-controller.js  # Character CRUD operations
│   └── components/
│       └── fancy-select.js  # Searchable dropdown component
├── data/
│   ├── descriptors.json    # Character descriptors
│   ├── types.json          # Character types
│   ├── foci.json           # Character foci
│   ├── flavors.json        # Type flavors
│   ├── abilities.json      # Special abilities
│   ├── advancements.json   # Advancement options
│   └── powershifts.json    # Power shifts
├── assets/
│   ├── CharacterSheetBackground.png  # Paper texture
│   └── ClaimTheSky.png     # Logo image
├── tests/                   # Jest test files
└── docs/                    # Documentation
```

## Deployment

### Development Server
For development with auto-reload:
```bash
npm run dev
```
This starts a live-server on http://localhost:8000 that automatically refreshes when you make changes.

### Local Testing
Alternative simple server:
```bash
python3 -m http.server 8080
```
Then open http://localhost:8080 in your browser.

### Build for Production
```bash
npm run build
```
This creates a `dist/` folder with cache-busted assets ready for deployment.

### Available NPM Scripts
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build production-ready files to dist/
- `npm run build:watch` - Auto-rebuild on file changes (watches src/, data/, styles.css, index.html)
- `npm run clean` - Remove dist folder
- `npm run rebuild` - Clean and rebuild
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

**Pro Tip:** Use `npm run build:watch` in one terminal and serve the `dist/` folder in another to test production builds continuously!
### Netlify Deployment
1. Run `npm run build` to create the `dist/` folder
2. Drag and drop the `dist/` folder to Netlify
3. Or connect your Git repository and configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Other Hosting Options
- GitHub Pages: Deploy the `dist/` folder
- Vercel: Connect repo, set output to `dist/`
- AWS S3 + CloudFront: Upload `dist/` contents
- Any static file hosting service

## Technical Details

- **No Dependencies**: Pure vanilla JavaScript
- **Styling**: Tailwind CSS via CDN
- **Storage**: Browser localStorage API
- **Data Format**: JSON for all game content
- **Browser Support**: Modern browsers with ES6+ support

## Usage

1. Click "New Character" to create a character
2. Fill in basic information (name, tier, descriptor, type, focus)
3. Set stat pools, edges, and current values
4. Add skills with pool, type, and power shift values
5. Add special abilities with descriptions
6. Track equipment, attacks, and cyphers
7. Click "Save Character" to persist to localStorage
8. Click "Back to Characters" to return to the list

## Data Persistence

All character data is stored in browser localStorage under the key `cypherCharacters`. Data persists across browser sessions but is local to your browser. To backup:
- Use browser developer tools → Application → Local Storage
- Export the `cypherCharacters` value
- To restore, paste it back into localStorage

## Future Enhancements

Potential features to add:
- Export/import character data as JSON
- Print-friendly character sheet view
- Dark mode support
- Character sharing via URL
- Offline PWA support

## Credits

Based on the original Laravel/Vue Cypher System Character Creator.
All Cypher System content © Monte Cook Games.
