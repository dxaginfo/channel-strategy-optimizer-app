/**
 * Channel Strategy Optimizer
 * Sample Data
 */

// Sample data for channel performance and audience metrics
const sampleChannelData = {
    // Historical audience data by channel (quarterly for past 2 years)
    audienceHistory: [
        {
            period: "Q1 2023",
            traditional: 9500000,
            streaming: 4200000,
            social: 8100000,
            mobile: 2700000,
            website: 1900000
        },
        {
            period: "Q2 2023",
            traditional: 9300000,
            streaming: 4500000,
            social: 8700000,
            mobile: 2900000,
            website: 1950000
        },
        {
            period: "Q3 2023",
            traditional: 9100000,
            streaming: 4700000,
            social: 9300000,
            mobile: 3100000,
            website: 2000000
        },
        {
            period: "Q4 2023",
            traditional: 8900000,
            streaming: 5100000,
            social: 10200000,
            mobile: 3400000,
            website: 2100000
        },
        {
            period: "Q1 2024",
            traditional: 8700000,
            streaming: 5300000,
            social: 10800000,
            mobile: 3600000,
            website: 2200000
        },
        {
            period: "Q2 2024",
            traditional: 8400000,
            streaming: 5600000,
            social: 11500000,
            mobile: 3700000,
            website: 2300000
        },
        {
            period: "Q3 2024",
            traditional: 8200000,
            streaming: 5700000,
            social: 12300000,
            mobile: 3800000,
            website: 2400000
        },
        {
            period: "Q4 2024",
            traditional: 8000000,
            streaming: 6100000,
            social: 13100000,
            mobile: 4100000,
            website: 2500000
        }
    ],
    
    // Financial performance by channel (quarterly for past 2 years)
    financialPerformance: [
        {
            period: "Q1 2023",
            traditional: { revenue: 4200000, cost: 2700000, profit: 1500000 },
            streaming: { revenue: 1800000, cost: 800000, profit: 1000000 },
            social: { revenue: 900000, cost: 400000, profit: 500000 },
            mobile: { revenue: 600000, cost: 300000, profit: 300000 },
            website: { revenue: 300000, cost: 150000, profit: 150000 }
        },
        {
            period: "Q2 2023",
            traditional: { revenue: 4100000, cost: 2650000, profit: 1450000 },
            streaming: { revenue: 1950000, cost: 850000, profit: 1100000 },
            social: { revenue: 950000, cost: 420000, profit: 530000 },
            mobile: { revenue: 650000, cost: 320000, profit: 330000 },
            website: { revenue: 320000, cost: 160000, profit: 160000 }
        },
        {
            period: "Q3 2023",
            traditional: { revenue: 4050000, cost: 2600000, profit: 1450000 },
            streaming: { revenue: 2050000, cost: 900000, profit: 1150000 },
            social: { revenue: 1000000, cost: 450000, profit: 550000 },
            mobile: { revenue: 700000, cost: 330000, profit: 370000 },
            website: { revenue: 340000, cost: 170000, profit: 170000 }
        },
        {
            period: "Q4 2023",
            traditional: { revenue: 3950000, cost: 2550000, profit: 1400000 },
            streaming: { revenue: 2200000, cost: 950000, profit: 1250000 },
            social: { revenue: 1100000, cost: 480000, profit: 620000 },
            mobile: { revenue: 750000, cost: 350000, profit: 400000 },
            website: { revenue: 360000, cost: 180000, profit: 180000 }
        },
        {
            period: "Q1 2024",
            traditional: { revenue: 3900000, cost: 2500000, profit: 1400000 },
            streaming: { revenue: 2300000, cost: 980000, profit: 1320000 },
            social: { revenue: 1200000, cost: 500000, profit: 700000 },
            mobile: { revenue: 800000, cost: 370000, profit: 430000 },
            website: { revenue: 380000, cost: 190000, profit: 190000 }
        },
        {
            period: "Q2 2024",
            traditional: { revenue: 3800000, cost: 2450000, profit: 1350000 },
            streaming: { revenue: 2450000, cost: 1050000, profit: 1400000 },
            social: { revenue: 1300000, cost: 530000, profit: 770000 },
            mobile: { revenue: 830000, cost: 380000, profit: 450000 },
            website: { revenue: 400000, cost: 200000, profit: 200000 }
        },
        {
            period: "Q3 2024",
            traditional: { revenue: 3700000, cost: 2400000, profit: 1300000 },
            streaming: { revenue: 2500000, cost: 1100000, profit: 1400000 },
            social: { revenue: 1350000, cost: 550000, profit: 800000 },
            mobile: { revenue: 850000, cost: 390000, profit: 460000 },
            website: { revenue: 420000, cost: 210000, profit: 210000 }
        },
        {
            period: "Q4 2024",
            traditional: { revenue: 3600000, cost: 2350000, profit: 1250000 },
            streaming: { revenue: 2700000, cost: 1150000, profit: 1550000 },
            social: { revenue: 1450000, cost: 580000, profit: 870000 },
            mobile: { revenue: 900000, cost: 410000, profit: 490000 },
            website: { revenue: 440000, cost: 220000, profit: 220000 }
        }
    ],
    
    // Audience demographic breakdown by channel (current)
    demographics: {
        traditional: {
            "18-24": 0.08,
            "25-34": 0.15,
            "35-44": 0.22,
            "45-54": 0.25,
            "55+": 0.30
        },
        streaming: {
            "18-24": 0.22,
            "25-34": 0.33,
            "35-44": 0.25,
            "45-54": 0.12,
            "55+": 0.08
        },
        social: {
            "18-24": 0.35,
            "25-34": 0.30,
            "35-44": 0.20,
            "45-54": 0.10,
            "55+": 0.05
        },
        mobile: {
            "18-24": 0.28,
            "25-34": 0.32,
            "35-44": 0.22,
            "45-54": 0.12,
            "55+": 0.06
        },
        website: {
            "18-24": 0.15,
            "25-34": 0.25,
            "35-44": 0.30,
            "45-54": 0.18,
            "55+": 0.12
        }
    },
    
    // Engagement metrics by channel (current)
    engagement: {
        traditional: {
            averageViewTime: 45, // minutes
            completionRate: 0.72,
            adSkipRate: 0.25,
            interactionRate: 0.01
        },
        streaming: {
            averageViewTime: 52,
            completionRate: 0.85,
            adSkipRate: 0.35,
            interactionRate: 0.03
        },
        social: {
            averageViewTime: 8,
            completionRate: 0.65,
            adSkipRate: 0.45,
            interactionRate: 0.12
        },
        mobile: {
            averageViewTime: 18,
            completionRate: 0.72,
            adSkipRate: 0.38,
            interactionRate: 0.15
        },
        website: {
            averageViewTime: 4,
            completionRate: 0.45,
            adSkipRate: 0.50,
            interactionRate: 0.08
        }
    },
    
    // Growth projections (annual growth rate)
    growthProjections: {
        traditional: -0.08, // -8% annually
        streaming: 0.25,    // +25% annually
        social: 0.30,       // +30% annually
        mobile: 0.22,       // +22% annually
        website: 0.10       // +10% annually
    },
    
    // Content performance by type and channel (rating 1-10)
    contentPerformance: {
        liveEvents: {
            traditional: 8.5,
            streaming: 7.8,
            social: 6.2,
            mobile: 6.5,
            website: 5.0
        },
        highlights: {
            traditional: 7.0,
            streaming: 8.5,
            social: 9.2,
            mobile: 8.8,
            website: 7.5
        },
        analysis: {
            traditional: 8.2,
            streaming: 7.5,
            social: 5.5,
            mobile: 6.0,
            website: 8.2
        },
        behindTheScenes: {
            traditional: 6.5,
            streaming: 8.0,
            social: 9.5,
            mobile: 8.5,
            website: 7.0
        },
        interviews: {
            traditional: 7.8,
            streaming: 7.5,
            social: 7.0,
            mobile: 6.8,
            website: 7.2
        }
    },
    
    // Audience migration patterns (percentage moving from row to column annually)
    migrationPatterns: {
        traditional: {
            traditional: 0.85,
            streaming: 0.08,
            social: 0.04,
            mobile: 0.02,
            website: 0.01
        },
        streaming: {
            traditional: 0.02,
            streaming: 0.88,
            social: 0.05,
            mobile: 0.04,
            website: 0.01
        },
        social: {
            traditional: 0.01,
            streaming: 0.03,
            social: 0.90,
            mobile: 0.05,
            website: 0.01
        },
        mobile: {
            traditional: 0.01,
            streaming: 0.04,
            social: 0.06,
            mobile: 0.88,
            website: 0.01
        },
        website: {
            traditional: 0.02,
            streaming: 0.05,
            social: 0.08,
            mobile: 0.05,
            website: 0.80
        }
    }
};