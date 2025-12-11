// Data loader for Cypher System data
let cypherData = {
    descriptors: [],
    types: [],
    foci: [],
    flavors: [],
    abilities: [],
    advancements: [],
    powerShifts: [],
    loaded: false
};

// Load all data files
async function loadCypherData() {
    if (cypherData.loaded) return cypherData;
    
    try {
        const [descriptors, types, foci, flavors, abilities, advancements, powerShifts] = await Promise.all([
            fetch('data/descriptors.json').then(r => r.json()),
            fetch('data/types.json').then(r => r.json()),
            fetch('data/foci.json').then(r => r.json()),
            fetch('data/flavors.json').then(r => r.json()),
            fetch('data/abilities.json').then(r => r.json()),
            fetch('data/advancements.json').then(r => r.json()),
            fetch('data/powershifts.json').then(r => r.json())
        ]);
        
        cypherData.descriptors = descriptors;
        cypherData.types = types;
        cypherData.foci = foci;
        cypherData.flavors = flavors;
        cypherData.abilities = abilities;
        cypherData.advancements = advancements;
        cypherData.powerShifts = powerShifts;
        cypherData.loaded = true;
        
        return cypherData;
    } catch (error) {
        console.error('Error loading cypher data:', error);
        cypherData.loaded = true; // Mark as loaded even on error to prevent infinite retry
        return cypherData;
    }
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadCypherData, cypherData };
}
