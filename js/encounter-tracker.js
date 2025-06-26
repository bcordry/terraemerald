// ENCOUNTER TRACKER WITH KO TRACKING AND POKÉMON IMAGE AXIS LABELS

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    initializeEncounterTracker();
});

function initializeGraphToggle() {
    const koStatsSection = document.getElementById('koStatsSection');
    const toggleBtn = document.getElementById('toggleGraphBtn');
    const chartContainer = koStatsSection.querySelector('.chart-container');
    const statsTitle = koStatsSection.querySelector('.stats-title');
    if (!toggleBtn || !chartContainer || !statsTitle) return;

    toggleBtn.addEventListener('click', function() {
        const isHidden = chartContainer.style.display === 'none';
        chartContainer.style.display = isHidden ? '' : 'none';
        statsTitle.style.display = isHidden ? '' : 'none';
        toggleBtn.textContent = isHidden ? 'Hide Graph' : 'Show Graph';
    });
}

// Global variables for chart and data management
let koChart = null;
let encounterData = {};
let koData = {};
let pokemonImageCache = {}; // Cache for loaded images

// List of all locations in Terra Emerald
const locations = [
    "Route 101", "Route 102", "Route 103", "Route 104", "Route 105", 
    "Route 106", "Route 107", "Route 108", "Route 109", "Route 110",
    "Route 111", "Route 112", "Route 113", "Route 114", "Route 115", 
    "Route 116", "Route 117", "Route 118", "Route 119", "Route 120",
    "Route 121", "Route 122", "Route 123", "Route 124", "Route 125", 
    "Route 126", "Route 127", "Route 128", "Route 129", "Route 130",
    "Route 131", "Route 132", "Route 133", "Route 134", "Abandoned Ship", 
    "Altering Cave", "Artisan Cave", "Battle Frontier",
    "Battle Resort", "Battle Tower", "Birth Island", "Cave of Origin", 
    "Desert Underpass", "Dewford Town", "Ever Grande City",
    "Fallarbor Town", "Faraway Island", "Fiery Path", "Fortree City", 
    "Granite Cave", "Jagged Pass", "Lavaridge Town", "Lilycove City",
    "Littleroot Town", "Marine Cave", "Mauville City", "Meteor Falls", 
    "Mirage Island", "Mirage Spots", "Mirage Tower", "Mossdeep City",
    "Mt. Chimney", "Mt. Pyre", "New Mauville", "Oldale Town", 
    "Pacifidlog Town", "Petalburg City", "Petalburg Woods", "Roaming Hoenn",
    "Rustboro City", "Rusturf Tunnel", "Safari Zone", "Scorched Slab", 
    "Sea Mauville", "Seafloor Cavern", "Sealed Chamber", "Shoal Cave",
    "Sky Pillar", "Slateport City", "Sootopolis City", "Southern Island", 
    "SS Tidal", "Team Magma/Aqua Hideout", "Terra Cave",
    "Trainer Hill", "Verdanturf Town", "Victory Road"
];

// List of Pokémon available in dropdowns with their Pokédex numbers for PokéAPI
const pokemonList = [
    { name: "Pikachu", id: 25 },
    { name: "Charizard", id: 6 },
    { name: "Silvally", id: 773 },
    { name: "Breloom", id: 286 },
    { name: "Snorlax", id: 143 }
];

// Function to get PokéAPI sprite URL using Pokédex number
function getPokemonIcon(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
}

// Function to find Pokémon data by name
function findPokemonByName(name) {
    return pokemonList.find(pokemon => pokemon.name === name);
}

// Function to preload and cache Pokémon images
function preloadPokemonImage(pokemonId) {
    return new Promise((resolve, reject) => {
        if (pokemonImageCache[pokemonId]) {
            resolve(pokemonImageCache[pokemonId]);
            return;
        }
        
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Handle CORS for external images
        img.onload = function() {
            pokemonImageCache[pokemonId] = img;
            resolve(img);
        };
        img.onerror = function() {
            console.warn(`Failed to load Pokémon image for ID: ${pokemonId}`);
            reject(new Error(`Failed to load image for Pokémon ID: ${pokemonId}`));
        };
        img.src = getPokemonIcon(pokemonId);
    });
}

// Main initialization function
function initializeEncounterTracker() {
    loadSavedData();
    buildEncounterInterface();
    initializeKOChart();
    initializeExportControls();
    updateKOChart();
    updateKOStatsUI();
    initializeGraphToggle();
}

// Build the main encounter tracking interface
function buildEncounterInterface() {
    const container = document.getElementById('encounterColumns');
    if (!container) return;

    // Split locations into two columns
    const midpoint = Math.ceil(locations.length / 2);
    const leftColumnLocations = locations.slice(0, midpoint);
    const rightColumnLocations = locations.slice(midpoint);
    const columns = [leftColumnLocations, rightColumnLocations];

    columns.forEach((columnLocations, columnIndex) => {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'encounter-column';
        columnDiv.setAttribute('data-column', columnIndex);

        columnLocations.forEach((location) => {
            const encounterRow = createEncounterRow(location);
            columnDiv.appendChild(encounterRow);
        });

        container.appendChild(columnDiv);
    });

    // Restore UI state after DOM is built
    setTimeout(() => {
        restoreUIState();
    }, 100);
}

// Create a single encounter row with KO tracking
function createEncounterRow(locationName) {
    const row = document.createElement('div');
    row.className = 'encounter-row';
    row.setAttribute('data-location', locationName);

    // Pokémon icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'pokemon-icon';
    iconContainer.setAttribute('aria-label', `Pokémon icon for ${locationName}`);

    // Location name display
    const locationSpan = document.createElement('span');
    locationSpan.className = 'location-name';
    locationSpan.textContent = locationName;

    // Pokémon selection dropdown
    const pokemonSelect = document.createElement('select');
    pokemonSelect.className = 'pokemon-select';
    pokemonSelect.setAttribute('aria-label', `Select Pokémon for ${locationName}`);

    // Default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Pokémon';
    pokemonSelect.appendChild(defaultOption);

    // Pokémon options
    pokemonList.forEach(pokemon => {
        const option = document.createElement('option');
        option.value = pokemon.name;
        option.textContent = pokemon.name;
        option.setAttribute('data-pokemon-id', pokemon.id);
        pokemonSelect.appendChild(option);
    });

    // KO tracker (initially hidden)
    const koTracker = createKOTracker(locationName);

    // Pokémon selection event
    pokemonSelect.addEventListener('change', function() {
        handlePokemonSelection(this, iconContainer, koTracker, locationName);
    });

    // Assemble the row
    row.appendChild(iconContainer);
    row.appendChild(locationSpan);
    row.appendChild(pokemonSelect);
    row.appendChild(koTracker);

    return row;
}

// Create KO tracking controls
function createKOTracker(locationName) {
    const koTracker = document.createElement('div');
    koTracker.className = 'ko-tracker';
    koTracker.style.display = 'none';

    // Percentage of total KOs
    const koPercent = document.createElement('span');
    koPercent.className = 'ko-percent';
    koPercent.textContent = '0%';
    koPercent.style.marginRight = '8px';
    koPercent.title = 'Percent of all KOs';

    // KO label and controls
    const koLabel = document.createElement('span');
    koLabel.className = 'ko-label';
    koLabel.textContent = 'KOs:';

    const koControls = document.createElement('div');
    koControls.className = 'ko-controls';

    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'ko-btn';
    decreaseBtn.textContent = '−';
    decreaseBtn.setAttribute('aria-label', 'Decrease KO count');

    const koCount = document.createElement('span');
    koCount.className = 'ko-count';
    koCount.textContent = '0';

    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'ko-btn';
    increaseBtn.textContent = '+';
    increaseBtn.setAttribute('aria-label', 'Increase KO count');

    decreaseBtn.addEventListener('click', function() {
        updateKOCount(locationName, -1, koCount);
    });

    increaseBtn.addEventListener('click', function() {
        updateKOCount(locationName, 1, koCount);
    });

    koControls.appendChild(decreaseBtn);
    koControls.appendChild(koCount);
    koControls.appendChild(increaseBtn);

    koControls.appendChild(koPercent);
    koTracker.appendChild(koLabel);
    koTracker.appendChild(koControls);

    return koTracker;
}

// Handle Pokémon selection and show/hide KO tracker
function handlePokemonSelection(selectElement, iconContainer, koTracker, locationName) {
    iconContainer.innerHTML = '';
    const selectedPokemonName = selectElement.value;

    if (!selectedPokemonName) {
        koTracker.style.display = 'none';
        delete encounterData[locationName];
        saveData();
        updateKOChart();
        updateKOStatsUI();
        return;
    }

    const selectedPokemon = findPokemonByName(selectedPokemonName);
    if (!selectedPokemon) return;

    // Show Pokémon icon
    const pokemonImage = document.createElement('img');
    pokemonImage.src = getPokemonIcon(selectedPokemon.id);
    pokemonImage.alt = `${selectedPokemonName} sprite`;
    pokemonImage.title = `${selectedPokemonName} at ${locationName}`;
    pokemonImage.style.opacity = '0';
    pokemonImage.style.transition = 'opacity 0.3s ease';
    pokemonImage.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    pokemonImage.addEventListener('error', function() {
        this.alt = '❌';
        this.title = `Failed to load ${selectedPokemonName} sprite`;
    });
    iconContainer.appendChild(pokemonImage);

    // Show KO tracker and update data
    koTracker.style.display = 'flex';
    encounterData[locationName] = selectedPokemonName;
    if (!koData[locationName]) koData[locationName] = 0;
    const koCountElement = koTracker.querySelector('.ko-count');
    koCountElement.textContent = koData[locationName] || 0;
    saveData();
    updateKOChart();
}

// Update KO count for a location
function updateKOCount(locationName, change, koCountElement) {
    if (!encounterData[locationName]) return;
    if (!koData[locationName]) koData[locationName] = 0;
    koData[locationName] = Math.max(0, koData[locationName] + change);
    koCountElement.textContent = koData[locationName];
    saveData();
    updateKOChart();
    updateKOStatsUI();
}

function updateKOStatsUI() {
    // Update total KO tracker
    const totalKOs = Object.values(koData).reduce((sum, count) => sum + count, 0);
    const totalKOTracker = document.getElementById('totalKOTracker');
    if (totalKOTracker) {
        totalKOTracker.textContent = `Total KOs: ${totalKOs}`;
    }

    // Update each row's percent
    document.querySelectorAll('.encounter-row').forEach(row => {
        const location = row.getAttribute('data-location');
        const percentSpan = row.querySelector('.ko-percent');
        if (percentSpan && koData[location] && totalKOs > 0) {
            const percent = ((koData[location] / totalKOs) * 100).toFixed(1);
            percentSpan.textContent = `${percent}%`;
        } else if (percentSpan) {
            percentSpan.textContent = '0%';
        }
    });
}

// --- IMPROVED CHART.JS IMAGE AXIS LABELS PLUGIN ---
const pokemonImagePlugin = {
    id: 'pokemonImagePlugin',
    afterDraw: function(chart) {
        const yAxis = chart.scales.y;
        const ctx = chart.ctx;
        
        if (!yAxis || !chart.pokemonImages) return;
        
        // Get the chart data to determine positioning
        const chartData = chart.data.datasets[0].data;
        
        chart.pokemonImages.forEach((pokemonId, index) => {
            if (!pokemonId || !pokemonImageCache[pokemonId]) return;
            
            const img = pokemonImageCache[pokemonId];
            
            // Calculate Y position for this bar
            const imageSize = 40; // size of pokemon sprite
            const xPos = yAxis.left - imageSize - 12; // 12px padding from axis
            const yPos = yAxis.getPixelForValue(index);

            ctx.save();
            ctx.beginPath();
            ctx.arc(xPos + imageSize/2, yPos, imageSize/2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, xPos, yPos - imageSize/2, imageSize, imageSize);
            ctx.restore();
            
            // Draw the Pokémon image
            ctx.drawImage(
                img, 
                xPos, 
                yPos - imageSize/2, 
                imageSize, 
                imageSize
            );
            
            ctx.restore();
        });
    }
};

// Register the plugin with Chart.js
Chart.register(pokemonImagePlugin);

// Initialize the KO statistics chart
function initializeKOChart() {
    const ctx = document.getElementById('koChart');
    if (!ctx) return;

    koChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                // This dataset is used for the KO counts
                label: 'KO Count',
                data: [],
                backgroundColor: 'rgba(220, 53, 69, 0.8)',
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal bars
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                bar: {
                barThickness: 40, // or 48, to match your icon size
                borderRadius: 4  // optional: makes bars look rounder
                }
            },
            layout: {
                padding: {
                    left: 60 // Make room for Pokémon images
                }
            },
            plugins: {
                title: {
                    display: false, // Hide the title
                    //text: 'KO Counter',
                    color: '#ffff',
                    font: {
                        size: 16,
                        family: 'Bebas Neue'
                    }
                },
                legend: {
                    display: false, // Hide the legend
                    // labels: {
                    //     color: '#ffff'
                    // }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffff',
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: 'transparent', // Hide text labels completely
                        callback: function() { 
                            return ""; // Return empty string for labels
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    ctx.style.height = '400px';
}

// Update the KO chart with current data and Pokémon images
async function updateKOChart() {
    if (!koChart) return;

    // Get locations with KOs > 0
    const locationsWithKOs = Object.entries(koData)
        .filter(([location, count]) => count > 0 && encounterData[location])
        .sort(([,a], [,b]) => b - a);

    if (locationsWithKOs.length === 0) {
        document.getElementById('koStatsSection').style.display = 'none';
        return;
    }
    document.getElementById('koStatsSection').style.display = 'block';

    // ADD THIS: Dynamic chart height calculation
    const minHeight = 400; // Minimum chart height in px
    const barHeight = 42;  // Height per bar (includes spacing)
    const numBars = locationsWithKOs.length;
    const chartHeight = Math.max(minHeight, numBars * barHeight);

    // Apply the height to the canvas
    const chartCanvas = document.getElementById('koChart');
    if (chartCanvas) {
        chartCanvas.style.height = chartHeight + 'px';
        chartCanvas.height = chartHeight; // Also set the actual canvas height
    }

    // Prepare chart data
    const labels = locationsWithKOs.map(([location]) => location); // Use location names as labels (will be hidden)
    const data = locationsWithKOs.map(([, count]) => count);

    // Define color constants
    const GOLD = '#FFD700';
    const SILVER = '#C0C0C0';
    const RED = '#DC3545';
    const BLUE = '#0074D9';

    // Build color array based on rank
    const barColors = data.map((_, i) => {
        if (i < 5) return GOLD;
        if (i < 15) return SILVER;
        if (i < 25) return RED;
        return BLUE;
    });
    
    // Get Pokémon IDs for images
    const pokemonIds = [];
    for (const [location] of locationsWithKOs) {
        const pokemon = encounterData[location];
        const poke = findPokemonByName(pokemon);
        if (poke) {
            pokemonIds.push(poke.id);
            // Preload the image
            try {
                await preloadPokemonImage(poke.id);
            } catch (error) {
                console.warn(`Failed to preload image for ${pokemon}:`, error);
            }
        } else {
            pokemonIds.push(null);
        }
    }

    // Update chart data
    koChart.data.labels = labels;
    koChart.data.datasets[0].data = data;
    koChart.data.datasets[0].backgroundColor = barColors; 
    koChart.pokemonImages = pokemonIds;

    // Resize and update
    koChart.resize();
    koChart.update();
}

// --- Data Persistence and Export (unchanged from previous version) ---

function initializeExportControls() {
    const exportToSheetsBtn = document.getElementById('exportToSheets');
    const exportToFileBtn = document.getElementById('exportToFile');
    const clearAllDataBtn = document.getElementById('clearAllData');

    if (exportToSheetsBtn) {
        exportToSheetsBtn.addEventListener('click', exportToGoogleSheets);
    }
    if (exportToFileBtn) {
        exportToFileBtn.addEventListener('click', exportToFile);
    }
    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', clearAllData);
    }
}

function exportToGoogleSheets() {
    const statusElement = document.getElementById('exportStatus');
    const exportData = {
        timestamp: new Date().toISOString(),
        encounters: encounterData,
        koData: koData,
        summary: generateSummaryData()
    };
    statusElement.textContent = 'Exporting to Google Sheets...';
    statusElement.className = 'export-status';
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportData)
    })
    .then(() => {
        statusElement.textContent = 'Successfully exported to Google Sheets!';
        statusElement.className = 'export-status success';
        setTimeout(() => { statusElement.textContent = ''; statusElement.className = 'export-status'; }, 5000);
    })
    .catch(error => {
        statusElement.textContent = 'Export failed. Please try downloading as file instead.';
        statusElement.className = 'export-status error';
        setTimeout(() => { statusElement.textContent = ''; statusElement.className = 'export-status'; }, 5000);
    });
}

function exportToFile() {
    const exportData = {
        timestamp: new Date().toISOString(),
        encounters: encounterData,
        koData: koData,
        summary: generateSummaryData()
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `terra-emerald-tracker-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    const statusElement = document.getElementById('exportStatus');
    statusElement.textContent = 'Data downloaded successfully!';
    statusElement.className = 'export-status success';
    setTimeout(() => { statusElement.textContent = ''; statusElement.className = 'export-status'; }, 3000);
}

function generateSummaryData() {
    const totalEncounters = Object.keys(encounterData).length;
    const totalKOs = Object.values(koData).reduce((sum, count) => sum + count, 0);
    const pokemonCounts = {};
    Object.values(encounterData).forEach(pokemon => {
        pokemonCounts[pokemon] = (pokemonCounts[pokemon] || 0) + 1;
    });
    const pokemonKOs = {};
    Object.entries(koData).forEach(([location, kos]) => {
        const pokemon = encounterData[location];
        if (pokemon && kos > 0) {
            pokemonKOs[pokemon] = (pokemonKOs[pokemon] || 0) + kos;
        }
    });
    return {
        totalEncounters,
        totalKOs,
        pokemonCounts,
        pokemonKOs,
        averageKOsPerEncounter: totalEncounters > 0 ? (totalKOs / totalEncounters).toFixed(2) : 0
    };
}

function clearAllData() {
    if (!confirm('Are you sure you want to clear all encounter and KO data? This cannot be undone.')) return;
    encounterData = {};
    koData = {};
    document.querySelectorAll('.pokemon-select').forEach(select => { select.value = ''; });
    document.querySelectorAll('.pokemon-icon').forEach(icon => { icon.innerHTML = ''; });
    document.querySelectorAll('.ko-tracker').forEach(tracker => {
        tracker.style.display = 'none';
        const countElement = tracker.querySelector('.ko-count');
        if (countElement) countElement.textContent = '0';
    });
    saveData();
    updateKOChart();
    updateKOStatsUI();
    const statusElement = document.getElementById('exportStatus');
    statusElement.textContent = 'All data cleared successfully!';
    statusElement.className = 'export-status success';
    setTimeout(() => { statusElement.textContent = ''; statusElement.className = 'export-status'; }, 3000);
}

function saveData() {
    try {
        localStorage.setItem('terraEmeraldEncounters', JSON.stringify(encounterData));
        localStorage.setItem('terraEmeraldKOs', JSON.stringify(koData));
    } catch (error) {
        console.error('Failed to save data:', error);
    }
}

function loadSavedData() {
    try {
        const savedEncounters = localStorage.getItem('terraEmeraldEncounters');
        const savedKOs = localStorage.getItem('terraEmeraldKOs');
        if (savedEncounters) encounterData = JSON.parse(savedEncounters);
        if (savedKOs) koData = JSON.parse(savedKOs);
    } catch (error) {
        encounterData = {};
        koData = {};
    }
}

function restoreUIState() {
    Object.entries(encounterData).forEach(([locationName, pokemonName]) => {
        const row = document.querySelector(`[data-location="${locationName}"]`);
        if (row) {
            const select = row.querySelector('.pokemon-select');
            const iconContainer = row.querySelector('.pokemon-icon');
            const koTracker = row.querySelector('.ko-tracker');
            select.value = pokemonName;
            handlePokemonSelection(select, iconContainer, koTracker, locationName);
        }
        updateKOStatsUI();
    });
}