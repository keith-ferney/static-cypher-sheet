# Import/Export Feature Guide

## Overview

The import/export feature allows you to:
- **Export individual characters** to JSON files
- **Export all characters** at once
- **Import characters** from JSON files
- **Transfer characters between devices**
- **Backup your character data**

## Exporting Characters

### Export Single Character

1. **Open the character** you want to export
2. **Click the "📥 Export" button** in the sticky bottom bar
3. A JSON file will be downloaded with the format: `CharacterName_ID.json`

**Example filename:** `Elara_1764904123456.json`

### Export All Characters

1. **Go to the character list** (main view)
2. **Click "📥 Import/Export" button** in the top right
3. **Click "📤 Export All Characters"**
4. A JSON file will be downloaded with all your characters

**Example filename:** `all_characters_1764904123456.json`

## Importing Characters

### Import Process

1. **Click "📥 Import/Export" button** on the character list
2. **Click "📁 Choose File to Import"**
3. **Select a JSON file** from your computer
4. **Choose import mode:**
   - **Merge** (recommended) - Keeps existing characters, adds new ones
   - **Replace** - Deletes all existing characters, imports only from file
5. **Select the file** and import completes automatically

### Import Modes Explained

#### Merge Mode (Default)
- ✅ Keeps all your existing characters
- ✅ Adds new characters from the file
- ✅ Updates characters if IDs match (same character exported and re-imported)
- ✅ Safe option - no data loss

**Use when:**
- Importing characters from another device
- Adding shared characters to your collection
- Restoring a backup while keeping current work

#### Replace Mode
- ⚠️ **Deletes all existing characters**
- ⚠️ Imports only characters from the file
- ⚠️ Cannot be undone

**Use when:**
- Restoring from a complete backup
- Starting fresh with a new set of characters
- Replacing corrupted data

## File Format

Characters are exported as JSON (JavaScript Object Notation), a standard data format.

### Single Character File Example
```json
[
  {
    "id": "1764904123456",
    "name": "Elara the Swift",
    "tier": 3,
    "descriptor": "Swift",
    "type": "Jack",
    "focus": "Moves Like a Cat",
    "mightPool": 10,
    "speedPool": 14,
    "intellectPool": 12,
    ...
  }
]
```

### Multiple Characters File Example
```json
[
  {
    "id": "1764904123456",
    "name": "Elara the Swift",
    ...
  },
  {
    "id": "1764904123457",
    "name": "Garrick the Strong",
    ...
  }
]
```

## Use Cases

### 1. Transfer Between Devices

**Scenario:** You created characters on your laptop and want them on your tablet.

**Steps:**
1. On laptop: Export all characters
2. Transfer the JSON file (email, cloud storage, USB, etc.)
3. On tablet: Import with "Merge" mode

### 2. Backup Your Characters

**Recommended:** Export all characters regularly to backup your work.

**Steps:**
1. Click Import/Export
2. Export all characters
3. Save the JSON file to cloud storage or external drive
4. Repeat weekly or after major changes

### 3. Share Characters with Friends

**Scenario:** You want to share a character with your gaming group.

**Steps:**
1. Open the character
2. Export single character
3. Share the JSON file (email, Discord, etc.)
4. They import with "Merge" mode

### 4. Restore from Backup

**Scenario:** You accidentally deleted characters or browser storage was cleared.

**Steps:**
1. Click Import/Export
2. Import from your backup file
3. Choose "Replace" if you want only backup data
4. Or "Merge" to combine with any remaining data

## Important Notes

### Character IDs
- Each character has a unique ID (timestamp when created)
- When importing, matching IDs will update the existing character
- Different IDs will create new characters

### Data Included
Everything is exported:
- ✅ Basic info (name, tier, descriptor, type, focus, flavor)
- ✅ Stats (pools, edges, current values, effort, XP)
- ✅ Skills (all skills with training levels)
- ✅ Special abilities
- ✅ Equipment, attacks, cyphers
- ✅ Power shifts
- ✅ Advancements
- ✅ Background, notes, portrait
- ✅ Damage track status
- ✅ Recovery roll status

### Browser Storage
- Characters are normally stored in browser's localStorage
- localStorage is specific to each browser and device
- Clearing browser data deletes characters (unless you have backups!)
- Import/Export works around this limitation

## Troubleshooting

### "Import failed: Invalid format"
- **Cause:** File is not valid JSON or missing required fields
- **Solution:** Ensure you're using a file exported from this app

### "Import failed: missing required fields"
- **Cause:** Character data is corrupted or incomplete
- **Solution:** Check the JSON file has `id` and `name` fields for each character

### File won't download
- **Cause:** Browser pop-up blocker
- **Solution:** Allow downloads from this site

### Can't find exported file
- **Cause:** Default download location
- **Solution:** Check your browser's Downloads folder

### Characters not showing after import
- **Cause:** Still viewing character sheet instead of list
- **Solution:** Click "Back to List" or refresh the page

## Best Practices

1. **Regular Backups**
   - Export all characters weekly
   - Keep multiple backup versions
   - Store in cloud storage (Google Drive, Dropbox, etc.)

2. **Before Major Changes**
   - Export before deleting characters
   - Export before browser updates or cleanup
   - Export before switching devices

3. **Naming Convention**
   - Keep exported files organized
   - Add dates to backup files
   - Example: `cypher_backup_2025-12-04.json`

4. **Test Imports**
   - Test with "Merge" mode first
   - Verify characters imported correctly
   - Then use "Replace" if needed

5. **Share Safely**
   - Be aware exported files contain all character data
   - Don't share files if they contain personal notes
   - Can manually edit JSON to remove sensitive info

## Technical Details

### File Size
- Single character: ~1-5 KB
- All characters: Depends on number, typically < 100 KB
- Very small - easy to share and backup

### Compatibility
- Works across all browsers
- Works across all devices (Windows, Mac, Linux, mobile)
- Plain text JSON - can be opened in any text editor
- No special software needed

### Security
- Files are stored locally on your device
- Nothing is sent to a server
- Import/export happens entirely in your browser
- Your data stays private
