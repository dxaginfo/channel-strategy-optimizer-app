/**
 * Channel Strategy Optimizer
 * Main Application Logic
 */

// Application State
const appState = {
    currentSection: 'analyzer',
    userData: null,
    sampleData: null,
    charts: {}
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initNavigation();
    initImportExport();
    
    // Load sample data (this would normally come from user input or API)
    loadSampleData();
    
    // Initialize module-specific functionality
    initAnalyzer();
    initComparator();
    initCalculator();
    initPredictor();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    // Handle section navigation
    const navLinks = document.querySelectorAll('[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            switchSection(sectionId);
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            document.querySelectorAll(`.nav-link[data-section="${sectionId}"]`).forEach(navLink => {
                navLink.classList.add('active');
            });
        });
    });
}

/**
 * Switch between application sections
 */
function switchSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        appState.currentSection = sectionId;
        
        // Trigger section-specific initialization
        switch(sectionId) {
            case 'analyzer':
                updateAnalyzerView();
                break;
            case 'comparator':
                updateComparatorView();
                break;
            case 'calculator':
                updateCalculatorView();
                break;
            case 'predictor':
                updatePredictorView();
                break;
        }
    }
}

/**
 * Import/Export functionality
 */
function initImportExport() {
    // Import modal functionality
    const importDataBtn = document.getElementById('importData');
    const importModal = new bootstrap.Modal(document.getElementById('importModal'));
    
    importDataBtn.addEventListener('click', function() {
        importModal.show();
    });
    
    // Switch between import methods
    const importTypeSelect = document.getElementById('importType');
    
    importTypeSelect.addEventListener('change', function() {
        const importType = this.value;
        
        document.querySelectorAll('.import-section').forEach(section => {
            section.style.display = 'none';
        });
        
        if (importType === 'file' || importType === 'paste') {
            document.getElementById(`${importType}Import`).style.display = 'block';
        }
    });
    
    // Handle data import
    const confirmImportBtn = document.getElementById('confirmImport');
    
    confirmImportBtn.addEventListener('click', function() {
        const importType = importTypeSelect.value;
        
        if (importType === 'file') {
            const fileInput = document.getElementById('dataFile');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        if (file.name.endsWith('.json')) {
                            appState.userData = JSON.parse(e.target.result);
                        } else if (file.name.endsWith('.csv')) {
                            appState.userData = parseCSV(e.target.result);
                        } else {
                            alert('Unsupported file format. Please upload a JSON or CSV file.');
                            return;
                        }
                        
                        refreshAllViews();
                        importModal.hide();
                    } catch (error) {
                        alert('Error parsing file: ' + error.message);
                    }
                };
                
                reader.readAsText(file);
            }
        } else if (importType === 'paste') {
            const pasteData = document.getElementById('dataPaste').value;
            
            try {
                // Try to parse as JSON first
                try {
                    appState.userData = JSON.parse(pasteData);
                } catch (jsonError) {
                    // If not JSON, try CSV
                    appState.userData = parseCSV(pasteData);
                }
                
                refreshAllViews();
                importModal.hide();
            } catch (error) {
                alert('Error parsing data: ' + error.message);
            }
        } else if (importType === 'sample') {
            // Use sample data
            appState.userData = appState.sampleData;
            refreshAllViews();
            importModal.hide();
        }
    });
    
    // Export functionality
    const exportDataBtn = document.getElementById('exportData');
    
    exportDataBtn.addEventListener('click', function() {
        const data = appState.userData || appState.sampleData;
        
        if (data) {
            // Create a JSON file for download
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'channel-strategy-data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert('No data available to export.');
        }
    });
}

/**
 * Helper function to parse CSV data
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        const entry = {};
        
        headers.forEach((header, index) => {
            // Try to convert numeric values
            const value = values[index];
            entry[header] = isNaN(value) ? value : Number(value);
        });
        
        data.push(entry);
    }
    
    return data;
}

/**
 * Load sample data for demonstration
 */
function loadSampleData() {
    // This would normally be loaded from a file or API
    appState.sampleData = sampleChannelData;
    appState.userData = sampleChannelData; // Use sample data by default
}

/**
 * Refresh all module views
 */
function refreshAllViews() {
    updateAnalyzerView();
    updateComparatorView();
    updateCalculatorView();
    updatePredictorView();
}

/**
 * Helper to format numbers
 */
function formatNumber(number, decimals = 0) {
    return number.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * Helper to format percentages
 */
function formatPercent(number, decimals = 1) {
    return number.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        style: 'percent'
    });
}

/**
 * Helper to format currency
 */
function formatCurrency(number, decimals = 0) {
    return number.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        style: 'currency',
        currency: 'USD'
    });
}

/**
 * Generate random colors for charts
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Common chart colors for consistent UI
 */
const chartColors = {
    traditional: 'rgba(54, 162, 235, 0.8)',
    streaming: 'rgba(255, 99, 132, 0.8)',
    social: 'rgba(75, 192, 192, 0.8)',
    mobile: 'rgba(255, 159, 64, 0.8)',
    website: 'rgba(153, 102, 255, 0.8)',
    other: 'rgba(201, 203, 207, 0.8)'
};