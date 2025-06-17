/**
 * Channel Strategy Optimizer
 * Audience Migration Analyzer Module
 */

/**
 * Initialize the Analyzer module
 */
function initAnalyzer() {
    // Set up event listeners for controls
    document.getElementById('analyzerTimePeriod').addEventListener('change', updateAnalyzerView);
    document.getElementById('analyzerSegment').addEventListener('change', updateAnalyzerView);
    document.getElementById('analyzerMetric').addEventListener('change', updateAnalyzerView);
    document.getElementById('analyzerChartType').addEventListener('change', updateAnalyzerView);
    
    // Initial chart setup
    setupMigrationChart();
}

/**
 * Set up the migration chart
 */
function setupMigrationChart() {
    const ctx = document.getElementById('migrationChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (appState.charts.migration) {
        appState.charts.migration.destroy();
    }
    
    // Create new chart
    appState.charts.migration = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Audience Migration Trends',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time Period'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Audience (millions)'
                    },
                    ticks: {
                        callback: function(value) {
                            return (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
    
    // Update with initial data
    updateAnalyzerView();
}

/**
 * Update the analyzer view based on current settings
 */
function updateAnalyzerView() {
    if (!appState.userData) return;
    
    const timePeriod = document.getElementById('analyzerTimePeriod').value;
    const segment = document.getElementById('analyzerSegment').value;
    const metric = document.getElementById('analyzerMetric').value;
    const chartType = document.getElementById('analyzerChartType').value;
    
    // Get filtered data based on time period
    const data = filterDataByTimePeriod(appState.userData.audienceHistory, timePeriod);
    
    // Update chart type
    appState.charts.migration.config.type = chartType === 'sankey' ? 'line' : chartType;
    
    // Update chart data
    updateMigrationChartData(data, segment, metric);
    
    // Update insights
    updateMigrationInsights(data, segment, metric);
}

/**
 * Filter data based on selected time period
 */
function filterDataByTimePeriod(data, timePeriod) {
    if (timePeriod === 'all') {
        return data;
    }
    
    let quarters = 0;
    switch(timePeriod) {
        case '3m': quarters = 1; break;
        case '6m': quarters = 2; break;
        case '1y': quarters = 4; break;
        case '2y': quarters = 8; break;
    }
    
    return data.slice(-quarters);
}

/**
 * Update the migration chart with new data
 */
function updateMigrationChartData(data, segment, metric) {
    const chart = appState.charts.migration;
    
    // Set labels (time periods)
    chart.data.labels = data.map(item => item.period);
    
    // Create datasets for each channel
    const channels = ['traditional', 'streaming', 'social', 'mobile', 'website'];
    chart.data.datasets = channels.map((channel, index) => {
        // Get demographic multiplier if segment is selected
        let multiplier = 1;
        if (segment !== 'all' && appState.userData.demographics) {
            multiplier = appState.userData.demographics[channel][segment] || 1;
        }
        
        return {
            label: capitalizeFirstLetter(channel),
            data: data.map(item => item[channel] * multiplier),
            borderColor: getChannelColor(channel),
            backgroundColor: getChannelColor(channel, 0.2),
            borderWidth: 2,
            tension: 0.3,
            fill: chart.config.type === 'radar' ? true : false,
            pointRadius: 3,
            pointHoverRadius: 6
        };
    });
    
    // Update chart title based on selected metric
    let metricTitle = 'Audience Size';
    switch(metric) {
        case 'viewers': metricTitle = 'Audience Size'; break;
        case 'watchTime': metricTitle = 'Watch Time'; break;
        case 'engagement': metricTitle = 'Engagement'; break;
        case 'revenue': metricTitle = 'Revenue'; break;
    }
    
    chart.options.plugins.title.text = `${metricTitle} by Channel`;
    
    // Update y-axis label
    let yAxisLabel = 'Audience (millions)';
    switch(metric) {
        case 'viewers': yAxisLabel = 'Audience (millions)'; break;
        case 'watchTime': yAxisLabel = 'Watch Time (minutes)'; break;
        case 'engagement': yAxisLabel = 'Engagement Rate'; break;
        case 'revenue': yAxisLabel = 'Revenue (USD)'; break;
    }
    chart.options.scales.y.title.text = yAxisLabel;
    
    // Update y-axis formatter
    if (metric === 'revenue') {
        chart.options.scales.y.ticks.callback = function(value) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
        };
    } else if (metric === 'engagement') {
        chart.options.scales.y.ticks.callback = function(value) {
            return (value / 10000000).toFixed(2);
        };
    } else {
        chart.options.scales.y.ticks.callback = function(value) {
            return (value / 1000000).toFixed(1) + 'M';
        };
    }
    
    // Update chart
    chart.update();
}

/**
 * Update the migration insights based on data analysis
 */
function updateMigrationInsights(data, segment, metric) {
    const insightsList = document.getElementById('migrationInsights');
    
    // Clear existing insights
    insightsList.innerHTML = '';
    
    // Only proceed if we have at least 2 data points for trend analysis
    if (data.length < 2) {
        addInsight(insightsList, 'Not enough data for trend analysis. Please select a longer time period.');
        return;
    }
    
    // Calculate growth rates for each channel
    const channels = ['traditional', 'streaming', 'social', 'mobile', 'website'];
    const growthRates = {};
    
    channels.forEach(channel => {
        const oldestValue = data[0][channel];
        const newestValue = data[data.length - 1][channel];
        
        if (oldestValue && oldestValue > 0) {
            growthRates[channel] = (newestValue - oldestValue) / oldestValue;
        } else {
            growthRates[channel] = 0;
        }
    });
    
    // Generate insights based on growth rates
    const sortedChannels = channels.sort((a, b) => growthRates[b] - growthRates[a]);
    
    // Fastest growing channel
    if (growthRates[sortedChannels[0]] > 0) {
        addInsight(
            insightsList, 
            `${capitalizeFirstLetter(sortedChannels[0])} shows the strongest growth at ${(growthRates[sortedChannels[0]] * 100).toFixed(1)}% over the selected period`
        );
    }
    
    // Declining channels
    const decliningChannels = channels.filter(channel => growthRates[channel] < 0);
    if (decliningChannels.length > 0) {
        addInsight(
            insightsList,
            `${decliningChannels.map(ch => capitalizeFirstLetter(ch)).join(', ')} ${decliningChannels.length === 1 ? 'is' : 'are'} showing audience decline`
        );
    }
    
    // Channel size comparison
    const latestData = data[data.length - 1];
    const largestChannel = channels.reduce((largest, channel) => 
        latestData[channel] > latestData[largest] ? channel : largest, channels[0]);
    
    addInsight(
        insightsList,
        `${capitalizeFirstLetter(largestChannel)} currently has the largest audience at ${formatNumber(latestData[largestChannel])} viewers`
    );
    
    // Crossover predictions
    channels.forEach((channel1, i) => {
        channels.slice(i + 1).forEach(channel2 => {
            const value1 = latestData[channel1];
            const value2 = latestData[channel2];
            
            const growth1 = growthRates[channel1];
            const growth2 = growthRates[channel2];
            
            // Check if smaller channel will overtake larger channel based on growth
            if (value1 > value2 && growth1 < growth2 && growth2 > 0) {
                const timeToCrossover = Math.log(value1 / value2) / Math.log(1 + growth2 - growth1);
                
                if (timeToCrossover > 0 && timeToCrossover < 16) { // if crossover happens in next 4 years (16 quarters)
                    const quartersToYears = Math.floor(timeToCrossover / 4);
                    const remainingQuarters = Math.ceil(timeToCrossover % 4);
                    
                    let timeText = '';
                    if (quartersToYears > 0) {
                        timeText += `${quartersToYears} year${quartersToYears > 1 ? 's' : ''}`;
                    }
                    if (remainingQuarters > 0) {
                        timeText += timeText ? ' and ' : '';
                        timeText += `${remainingQuarters} quarter${remainingQuarters > 1 ? 's' : ''}`;
                    }
                    
                    addInsight(
                        insightsList,
                        `At current growth rates, ${capitalizeFirstLetter(channel2)} will overtake ${capitalizeFirstLetter(channel1)} in approximately ${timeText}`
                    );
                }
            }
        });
    });
    
    // Add demographic insight if segment is selected
    if (segment !== 'all') {
        const topChannelForSegment = channels.reduce((top, channel) => {
            const segmentPercentage = appState.userData.demographics[channel][segment] || 0;
            const currentTopPercentage = appState.userData.demographics[top][segment] || 0;
            return segmentPercentage > currentTopPercentage ? channel : top;
        }, channels[0]);
        
        addInsight(
            insightsList,
            `The ${segment} demographic has highest representation on ${capitalizeFirstLetter(topChannelForSegment)} at ${((appState.userData.demographics[topChannelForSegment][segment] || 0) * 100).toFixed(1)}% of that channel's audience`
        );
    }
}

/**
 * Helper function to add an insight to the list
 */
function addInsight(list, text) {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
}

/**
 * Helper to get a consistent color for each channel
 */
function getChannelColor(channel, alpha = 1) {
    const colors = {
        traditional: `rgba(54, 162, 235, ${alpha})`,
        streaming: `rgba(255, 99, 132, ${alpha})`,
        social: `rgba(75, 192, 192, ${alpha})`,
        mobile: `rgba(255, 159, 64, ${alpha})`,
        website: `rgba(153, 102, 255, ${alpha})`
    };
    
    return colors[channel] || `rgba(201, 203, 207, ${alpha})`;
}

/**
 * Helper to capitalize the first letter of a string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}