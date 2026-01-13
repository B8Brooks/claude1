/**
 * Study Break Planner - Game Engine
 * Core game logic, state management, and calculations
 */

// ============================================
// GAME CONFIGURATION
// ============================================

const CONFIG = {
    TOTAL_WEEKS: 12,
    FIRST_YEAR_CLASS_SIZE: 500, // Total first-year students

    // Resource defaults
    WEEKLY_BUDGET: 150,
    MAX_SAVINGS: 50,
    WEEKLY_TIME: 8,
    WEEKLY_ENERGY: 10,
    ENERGY_PENALTY: 3, // If you end at 0 energy, next week starts at 10 - this

    // Random event chance (0-1)
    RANDOM_EVENT_CHANCE: 0.30,

    // Reputation thresholds
    REPUTATION_MIN: 0,
    REPUTATION_MAX: 100,
    REPUTATION_START: 50,

    // Regulars system
    REGULARS_GROWTH_RATE: 0.15, // Percentage of happy attendees who become regulars
    REGULARS_RETENTION_RATE: 0.85, // Percentage of regulars who return each week

    // Semester phases (affects difficulty and demand)
    MIDTERM_WEEKS: [4, 5, 9, 10],
    FINALS_WEEK: 12
};

// ============================================
// EVENT TYPES DEFINITION
// ============================================

const EVENT_TYPES = {
    pizza_chill: {
        id: 'pizza_chill',
        name: 'Pizza & Chill',
        icon: '🍕',
        description: 'Low-key hangout with pizza',
        baseCost: 40,
        baseEnergy: 3,
        baseTime: 1,
        baseAppeal: 60,
        crowdTolerance: 0.9, // How well it handles overcrowding (1 = very tolerant)
    },
    game_night: {
        id: 'game_night',
        name: 'Game Night',
        icon: '🎮',
        description: 'Board games and video games',
        baseCost: 50,
        baseEnergy: 5,
        baseTime: 2,
        baseAppeal: 75,
        crowdTolerance: 0.7,
    },
    outdoor_activity: {
        id: 'outdoor_activity',
        name: 'Outdoor Activity',
        icon: '🏃',
        description: 'Sports, frisbee, or nature walk',
        baseCost: 25,
        baseEnergy: 7,
        baseTime: 2,
        baseAppeal: 70,
        crowdTolerance: 1.0,
        weatherDependent: true,
    },
    themed_party: {
        id: 'themed_party',
        name: 'Themed Party',
        icon: '🎉',
        description: 'Decorations, costumes, and fun',
        baseCost: 80,
        baseEnergy: 6,
        baseTime: 3,
        baseAppeal: 85,
        crowdTolerance: 0.8,
    },
    wellness: {
        id: 'wellness',
        name: 'Wellness & Self-Care',
        icon: '🧘',
        description: 'Meditation, yoga, or relaxation',
        baseCost: 35,
        baseEnergy: 4,
        baseTime: 2,
        baseAppeal: 55,
        crowdTolerance: 0.5, // Intimate event, doesn't scale well
        stressRelief: true, // Bonus during midterms/finals
    },
    study_snacks: {
        id: 'study_snacks',
        name: 'Study Session + Snacks',
        icon: '📚',
        description: 'Collaborative studying with refreshments',
        baseCost: 30,
        baseEnergy: 3,
        baseTime: 1,
        baseAppeal: 50,
        crowdTolerance: 0.6,
        stressRelief: true,
    }
};

// ============================================
// VENUES DEFINITION
// ============================================

const VENUES = {
    common_room: {
        id: 'common_room',
        name: 'Common Room',
        icon: '🏠',
        description: 'Cozy but limited space',
        cost: 0,
        capacity: 30,
        vibeBonus: 0,
        weatherRisk: false,
    },
    reserved_lounge: {
        id: 'reserved_lounge',
        name: 'Reserved Lounge',
        icon: '🛋️',
        description: 'Better atmosphere, small fee',
        cost: 25,
        capacity: 50,
        vibeBonus: 10,
        weatherRisk: false,
    },
    outdoor_quad: {
        id: 'outdoor_quad',
        name: 'Outdoor Quad',
        icon: '🌳',
        description: 'Open air, weather dependent',
        cost: 0,
        capacity: 100,
        vibeBonus: 5,
        weatherRisk: true,
    }
};

// ============================================
// RANDOM EVENTS DEFINITION
// ============================================

const RANDOM_EVENTS = [
    {
        id: 'double_booked',
        title: 'Room Double-Booked!',
        icon: '😱',
        description: 'The student activities board accidentally double-booked your reserved space. Another group is already setting up!',
        choices: [
            {
                text: 'Find an alternative space quickly',
                cost: { time: 2, energy: 2 },
                effect: { venueCapacity: -0.3 },
                resultText: 'You scrambled and found a smaller backup room.'
            },
            {
                text: 'Negotiate to share the space',
                cost: { energy: 3 },
                effect: { happiness: -10, venueCapacity: -0.2 },
                resultText: 'You shared the space, but it was cramped and awkward.'
            },
            {
                text: 'Postpone and do extra promotion',
                cost: { budget: 20 },
                effect: { attendance: 1.2 },
                resultText: 'The delay built anticipation - more people showed up!'
            }
        ],
        condition: (state) => state.selectedVenue !== 'outdoor_quad'
    },
    {
        id: 'residence_hall_crisis',
        title: 'Residence Hall Needs Support',
        icon: '💙',
        description: 'A residence hall is having a rough week - several students are struggling with homesickness and stress. They could really use some extra support.',
        choices: [
            {
                text: 'Extend personal outreach to that hall',
                cost: { time: 2, energy: 3 },
                effect: { reputation: 8, regulars: 5 },
                resultText: 'Your extra effort meant a lot. You gained loyal regulars.'
            },
            {
                text: 'Invite them but stay focused on your plan',
                cost: {},
                effect: { attendance: 1.1 },
                resultText: 'A few more students came, appreciating the invite.'
            },
            {
                text: 'Host a special mini-event just for them',
                cost: { budget: 30, energy: 4 },
                effect: { reputation: 15, happiness: 10 },
                resultText: 'The dedicated event was deeply appreciated.'
            }
        ]
    },
    {
        id: 'sponsor_offer',
        title: 'Local Business Sponsorship!',
        icon: '🎁',
        description: 'A local coffee shop wants to sponsor your event with free drinks and snacks in exchange for promoting their business.',
        choices: [
            {
                text: 'Accept the sponsorship',
                cost: {},
                effect: { budget: 40, happiness: 5 },
                resultText: 'Free coffee and pastries were a hit!'
            },
            {
                text: 'Decline to keep the event ad-free',
                cost: {},
                effect: { happiness: 3 },
                resultText: 'Students appreciated the authentic, non-commercial vibe.'
            },
            {
                text: 'Negotiate for more goods, less branding',
                cost: { time: 1 },
                effect: { budget: 25, happiness: 8 },
                resultText: 'You got a good deal with subtle branding.'
            }
        ]
    },
    {
        id: 'rain_forecast',
        title: 'Rain in the Forecast!',
        icon: '🌧️',
        description: 'Weather reports show a 70% chance of rain during your outdoor event.',
        choices: [
            {
                text: 'Move to an indoor backup location',
                cost: { budget: 15, time: 1 },
                effect: { venueCapacity: -0.4 },
                resultText: 'The smaller indoor space worked, though it was cozy.'
            },
            {
                text: 'Risk it and hope for the best',
                cost: {},
                effect: { weatherRoll: true }, // Special: 70% chance of bad outcome
                resultText: '' // Set dynamically based on roll
            },
            {
                text: 'Rent tents and tarps',
                cost: { budget: 40 },
                effect: { happiness: 5 },
                resultText: 'The covered outdoor space had a cozy festival vibe!'
            }
        ],
        condition: (state) => state.selectedVenue === 'outdoor_quad'
    },
    {
        id: 'viral_post',
        title: 'Your Event Goes Viral!',
        icon: '📱',
        description: 'A student\'s post about your last event is getting lots of attention on social media!',
        choices: [
            {
                text: 'Ride the wave with extra promotion',
                cost: { time: 2 },
                effect: { attendance: 1.4, reputation: 5 },
                resultText: 'The buzz brought in way more people than expected!'
            },
            {
                text: 'Keep it low-key',
                cost: {},
                effect: { attendance: 1.15 },
                resultText: 'Word spread naturally, bringing some extra attendees.'
            }
        ],
        condition: (state) => state.reputation >= 60
    },
    {
        id: 'budget_cut',
        title: 'Budget Concerns',
        icon: '💸',
        description: 'The student affairs office is reviewing budgets. They might cut your funding unless you can show impact.',
        choices: [
            {
                text: 'Document everything meticulously',
                cost: { time: 2 },
                effect: { budget: 30 },
                resultText: 'Your documentation impressed them - bonus funding secured!'
            },
            {
                text: 'Focus on the event, worry later',
                cost: {},
                effect: { budget: -20 },
                resultText: 'Without documentation, they reduced next week\'s budget.'
            },
            {
                text: 'Invite administrators to see the impact',
                cost: { energy: 1 },
                effect: { budget: 50, happiness: -5 },
                resultText: 'They were impressed, but students felt watched.'
            }
        ]
    },
    {
        id: 'celebrity_appearance',
        title: 'Special Guest Available!',
        icon: '⭐',
        description: 'A popular campus figure (student body president / local musician) offers to make an appearance at your event!',
        choices: [
            {
                text: 'Welcome them enthusiastically',
                cost: { energy: 2 },
                effect: { attendance: 1.3, happiness: 10 },
                resultText: 'The special guest was a huge draw!'
            },
            {
                text: 'Politely decline',
                cost: {},
                effect: {},
                resultText: 'You kept the intimate vibe of your event.'
            }
        ]
    },
    {
        id: 'volunteer_help',
        title: 'Volunteer Helpers!',
        icon: '🙋',
        description: 'Some regular attendees offer to help set up and run the event.',
        choices: [
            {
                text: 'Gladly accept their help',
                cost: {},
                effect: { energy: 3, happiness: 5, regulars: 2 },
                resultText: 'The volunteers made everything easier and felt valued!'
            },
            {
                text: 'Thank them but handle it yourself',
                cost: {},
                effect: {},
                resultText: 'You kept control but missed a bonding opportunity.'
            }
        ],
        condition: (state) => state.regulars >= 5
    }
];

// ============================================
// PROMOTION DESCRIPTIONS
// ============================================

const PROMOTION_LEVELS = [
    { hours: 0, description: 'Word of mouth only', multiplier: 0.6 },
    { hours: 1, description: 'A few posters around campus', multiplier: 0.8 },
    { hours: 2, description: 'Posters and some social media', multiplier: 1.0 },
    { hours: 3, description: 'Active social media campaign', multiplier: 1.2 },
    { hours: 4, description: 'Full promotion with door-to-door outreach', multiplier: 1.4 },
    { hours: 5, description: 'Maximum visibility - everyone knows about it', multiplier: 1.6 }
];

// ============================================
// FOOD QUALITY DESCRIPTIONS
// ============================================

const FOOD_LEVELS = [
    { min: 0, max: 15, description: 'Just water and maybe some crackers', quality: 0.5 },
    { min: 16, max: 35, description: 'Basic chips and drinks', quality: 0.7 },
    { min: 36, max: 55, description: 'Decent snacks and drinks', quality: 0.9 },
    { min: 56, max: 75, description: 'Good variety of food and beverages', quality: 1.1 },
    { min: 76, max: 90, description: 'Great spread with options for everyone', quality: 1.25 },
    { min: 91, max: 100, description: 'Premium catering - impressive selection', quality: 1.4 }
];

// ============================================
// PERSONAL TOUCH DESCRIPTIONS
// ============================================

const PERSONAL_TOUCH_LEVELS = [
    { points: 0, description: 'No personal engagement', bonus: 0 },
    { points: 1, description: 'Remember a few names', bonus: 5 },
    { points: 2, description: 'Follow up with regulars, themed details', bonus: 12 },
    { points: 3, description: 'Personalized welcomes, special touches', bonus: 20 },
    { points: 4, description: 'Deep connections, memorable experiences', bonus: 30 }
];

// ============================================
// REPUTATION STATUS MESSAGES
// ============================================

const REPUTATION_MESSAGES = [
    { min: 0, max: 20, message: 'Students avoid your events', trend: 'negative' },
    { min: 21, max: 35, message: 'Attendance has been sluggish', trend: 'negative' },
    { min: 36, max: 50, message: 'Unknown newcomer', trend: 'neutral' },
    { min: 51, max: 65, message: 'Building a small following', trend: 'positive' },
    { min: 66, max: 80, message: 'Students are buzzing about your events', trend: 'positive' },
    { min: 81, max: 95, message: 'You\'re the talk of campus!', trend: 'positive' },
    { min: 96, max: 100, message: 'Legendary advisor status!', trend: 'positive' }
];

// ============================================
// GAME STATE
// ============================================

let gameState = {
    // Current progress
    week: 1,

    // Resources
    budget: CONFIG.WEEKLY_BUDGET,
    savedBudget: 0,
    time: CONFIG.WEEKLY_TIME,
    energy: CONFIG.WEEKLY_ENERGY,

    // Reputation & regulars
    reputation: CONFIG.REPUTATION_START,
    regulars: 0,

    // Last week's results (for word-of-mouth)
    lastWeekHappiness: 50,

    // Current event planning
    selectedEventType: null,
    selectedVenue: null,
    foodBudget: 30,
    promotionHours: 2,
    personalTouchPoints: 1,

    // Random event state
    currentRandomEvent: null,
    randomEventChoice: null,

    // Week history
    weekHistory: [],

    // Tracking
    totalAttendance: 0,
    totalHappiness: 0,

    // Flags
    endedAtZeroEnergy: false
};

// ============================================
// GAME STATE MANAGEMENT
// ============================================

/**
 * Initialize a new game
 */
function initNewGame() {
    gameState = {
        week: 1,
        budget: CONFIG.WEEKLY_BUDGET,
        savedBudget: 0,
        time: CONFIG.WEEKLY_TIME,
        energy: CONFIG.WEEKLY_ENERGY,
        reputation: CONFIG.REPUTATION_START,
        regulars: 0,
        lastWeekHappiness: 50,
        selectedEventType: 'pizza_chill',
        selectedVenue: 'common_room',
        foodBudget: 30,
        promotionHours: 2,
        personalTouchPoints: 1,
        currentRandomEvent: null,
        randomEventChoice: null,
        weekHistory: [],
        totalAttendance: 0,
        totalHappiness: 0,
        endedAtZeroEnergy: false
    };
    saveGame();
    return gameState;
}

/**
 * Save game state to localStorage
 */
function saveGame() {
    try {
        localStorage.setItem('studyBreakPlanner_save', JSON.stringify(gameState));
    } catch (e) {
        console.warn('Could not save game:', e);
    }
}

/**
 * Load game state from localStorage
 * @returns {boolean} Whether a saved game was found
 */
function loadGame() {
    try {
        const saved = localStorage.getItem('studyBreakPlanner_save');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Validate that it's a valid save
            if (parsed.week && parsed.budget !== undefined) {
                gameState = { ...gameState, ...parsed };
                return true;
            }
        }
    } catch (e) {
        console.warn('Could not load game:', e);
    }
    return false;
}

/**
 * Check if a saved game exists
 */
function hasSavedGame() {
    try {
        const saved = localStorage.getItem('studyBreakPlanner_save');
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.week && parsed.week <= CONFIG.TOTAL_WEEKS;
        }
    } catch (e) {
        return false;
    }
    return false;
}

/**
 * Clear saved game
 */
function clearSave() {
    try {
        localStorage.removeItem('studyBreakPlanner_save');
    } catch (e) {
        console.warn('Could not clear save:', e);
    }
}

// ============================================
// RESOURCE CALCULATIONS
// ============================================

/**
 * Calculate total costs for current event configuration
 * @returns {Object} Cost breakdown
 */
function calculateEventCosts() {
    const eventType = EVENT_TYPES[gameState.selectedEventType];
    const venue = VENUES[gameState.selectedVenue];

    const costs = {
        budget: eventType.baseCost + venue.cost + gameState.foodBudget,
        time: eventType.baseTime + gameState.promotionHours,
        energy: eventType.baseEnergy + gameState.personalTouchPoints
    };

    return costs;
}

/**
 * Check if player can afford current event configuration
 * @returns {Object} Affordability status for each resource
 */
function checkAffordability() {
    const costs = calculateEventCosts();

    return {
        budget: gameState.budget >= costs.budget,
        time: gameState.time >= costs.time,
        energy: gameState.energy >= costs.energy,
        canAfford: gameState.budget >= costs.budget &&
                   gameState.time >= costs.time &&
                   gameState.energy >= costs.energy,
        costs: costs
    };
}

/**
 * Get remaining resources after event
 */
function getRemainingResources() {
    const costs = calculateEventCosts();
    return {
        budget: gameState.budget - costs.budget,
        time: gameState.time - costs.time,
        energy: gameState.energy - costs.energy
    };
}

// ============================================
// SEMESTER PHASE CALCULATIONS
// ============================================

/**
 * Get the current semester phase
 * @returns {Object} Phase info
 */
function getSemesterPhase() {
    const week = gameState.week;

    if (week === CONFIG.FINALS_WEEK) {
        return {
            name: 'Finals Week',
            cssClass: 'finals',
            demandMultiplier: 1.5,  // Higher demand for stress relief
            difficultyMultiplier: 1.4 // Harder to please
        };
    }

    if (CONFIG.MIDTERM_WEEKS.includes(week)) {
        return {
            name: 'Midterms',
            cssClass: 'midterms',
            demandMultiplier: 1.3,
            difficultyMultiplier: 1.2
        };
    }

    if (week <= 2) {
        return {
            name: 'Welcome Week',
            cssClass: '',
            demandMultiplier: 1.2, // Students eager to socialize
            difficultyMultiplier: 0.9 // Easy to please
        };
    }

    if (week >= 10 && week < 12) {
        return {
            name: 'Late Semester',
            cssClass: '',
            demandMultiplier: 1.1,
            difficultyMultiplier: 1.1
        };
    }

    return {
        name: 'Regular Week',
        cssClass: '',
        demandMultiplier: 1.0,
        difficultyMultiplier: 1.0
    };
}

// ============================================
// ATTENDANCE CALCULATION
// ============================================

/**
 * Calculate expected attendance for the event
 *
 * Formula:
 * Base = (EventAppeal / 100) * VenueCapacity
 * Modified by:
 * - Promotion multiplier (0.6 - 1.6)
 * - Reputation factor (0.5 - 1.5 based on reputation)
 * - Word-of-mouth bonus (based on last week's happiness)
 * - Semester phase demand
 * - Regulars (guaranteed attendees)
 * - Random variance (±15%)
 *
 * @param {Object} modifiers - Optional modifiers from random events
 * @returns {Object} Attendance details
 */
function calculateAttendance(modifiers = {}) {
    const eventType = EVENT_TYPES[gameState.selectedEventType];
    const venue = VENUES[gameState.selectedVenue];
    const phase = getSemesterPhase();

    // Base attendance from event appeal
    let baseAttendance = (eventType.baseAppeal / 100) * venue.capacity;

    // Promotion multiplier
    const promoLevel = PROMOTION_LEVELS[gameState.promotionHours];
    baseAttendance *= promoLevel.multiplier;

    // Reputation factor (maps 0-100 reputation to 0.5-1.5 multiplier)
    const reputationFactor = 0.5 + (gameState.reputation / 100);
    baseAttendance *= reputationFactor;

    // Word-of-mouth bonus from last week
    // If happiness was > 70, get a bonus; if < 40, get a penalty
    const womBonus = (gameState.lastWeekHappiness - 50) / 100; // -0.1 to +0.5
    baseAttendance *= (1 + womBonus);

    // Semester phase demand
    baseAttendance *= phase.demandMultiplier;

    // Stress relief bonus during stressful periods
    if (eventType.stressRelief && (phase.name === 'Midterms' || phase.name === 'Finals Week')) {
        baseAttendance *= 1.2;
    }

    // Add guaranteed regulars
    baseAttendance += gameState.regulars * 0.8; // 80% of regulars show up

    // Apply random event modifiers
    if (modifiers.attendance) {
        baseAttendance *= modifiers.attendance;
    }
    if (modifiers.venueCapacity) {
        // Reduce effective venue capacity
        const reducedCapacity = venue.capacity * (1 + modifiers.venueCapacity);
        baseAttendance = Math.min(baseAttendance, reducedCapacity);
    }

    // Random variance (±15%)
    const variance = 0.85 + Math.random() * 0.3;
    let finalAttendance = Math.round(baseAttendance * variance);

    // Soft cap at venue capacity (can go slightly over with crowding)
    const crowdedThreshold = venue.capacity * 1.2;
    const hardCap = venue.capacity * 1.5;

    finalAttendance = Math.min(finalAttendance, hardCap);
    finalAttendance = Math.max(finalAttendance, Math.round(gameState.regulars * 0.5)); // At least some regulars
    finalAttendance = Math.max(finalAttendance, 3); // Minimum 3 attendees

    const isCrowded = finalAttendance > crowdedThreshold;
    const crowdingRatio = finalAttendance / venue.capacity;

    return {
        count: finalAttendance,
        percentage: Math.round((finalAttendance / CONFIG.FIRST_YEAR_CLASS_SIZE) * 100),
        isCrowded,
        crowdingRatio,
        venueCapacity: venue.capacity
    };
}

// ============================================
// HAPPINESS CALCULATION
// ============================================

/**
 * Calculate happiness score for the event
 *
 * Formula:
 * Base happiness starts at 50
 * Modified by:
 * - Food quality bonus (0-20 points)
 * - Venue vibe bonus (0-10 points)
 * - Event type match to demand (0-15 points)
 * - Personal touches (0-30 points)
 * - Energy investment (execution quality)
 * - Crowding penalty (if over capacity)
 * - Empty event penalty (if under 30% capacity)
 * - Semester difficulty modifier
 *
 * @param {Object} attendance - Attendance calculation results
 * @param {Object} modifiers - Optional modifiers from random events
 * @returns {Object} Happiness details
 */
function calculateHappiness(attendance, modifiers = {}) {
    const eventType = EVENT_TYPES[gameState.selectedEventType];
    const venue = VENUES[gameState.selectedVenue];
    const phase = getSemesterPhase();

    let happiness = 50; // Base happiness
    let highlights = [];

    // Food quality bonus
    const foodLevel = FOOD_LEVELS.find(l =>
        gameState.foodBudget >= l.min && gameState.foodBudget <= l.max
    );
    const foodBonus = Math.round((foodLevel.quality - 0.5) * 25);
    happiness += foodBonus;
    if (foodBonus >= 15) {
        highlights.push({ text: 'The food spread was impressive!', positive: true });
    } else if (foodBonus <= 0) {
        highlights.push({ text: 'Students wished there was more food.', positive: false });
    }

    // Venue vibe bonus
    happiness += venue.vibeBonus;
    if (venue.vibeBonus >= 10) {
        highlights.push({ text: 'The venue had a great atmosphere.', positive: true });
    }

    // Personal touches bonus
    const personalLevel = PERSONAL_TOUCH_LEVELS[gameState.personalTouchPoints];
    happiness += personalLevel.bonus;
    if (personalLevel.bonus >= 20) {
        highlights.push({ text: 'Students felt personally welcomed and valued.', positive: true });
    }

    // Event type bonus for stress relief during stressful periods
    if (eventType.stressRelief && (phase.name === 'Midterms' || phase.name === 'Finals Week')) {
        happiness += 10;
        highlights.push({ text: 'The relaxing event was perfect for stressed students.', positive: true });
    }

    // Crowding effects
    if (attendance.isCrowded) {
        const crowdPenalty = Math.round((attendance.crowdingRatio - 1.2) * 40);
        const toleratedPenalty = Math.round(crowdPenalty * (1 - eventType.crowdTolerance));
        happiness -= toleratedPenalty;
        if (toleratedPenalty > 5) {
            highlights.push({ text: 'The event felt overcrowded.', positive: false });
        }
    }

    // Empty event penalty
    const fillRate = attendance.count / venue.capacity;
    if (fillRate < 0.3) {
        happiness -= 15;
        highlights.push({ text: 'The turnout was disappointingly low.', positive: false });
    } else if (fillRate < 0.5) {
        happiness -= 5;
    } else if (fillRate >= 0.7 && fillRate <= 1.1) {
        happiness += 5;
        highlights.push({ text: 'Great turnout - the energy was perfect!', positive: true });
    }

    // Apply semester difficulty
    happiness = Math.round(happiness / phase.difficultyMultiplier);

    // Apply random event modifiers
    if (modifiers.happiness) {
        happiness += modifiers.happiness;
    }

    // Weather effects for outdoor events
    if (modifiers.weatherBad && venue.weatherRisk) {
        happiness -= 25;
        highlights.push({ text: 'Bad weather dampened everyone\'s spirits.', positive: false });
    }

    // Clamp happiness to 1-100
    happiness = Math.max(1, Math.min(100, happiness));

    return {
        score: happiness,
        highlights,
        foodQuality: foodLevel.description,
        personalTouches: personalLevel.description
    };
}

// ============================================
// REPUTATION CALCULATION
// ============================================

/**
 * Calculate reputation change after an event
 *
 * @param {number} attendance - Number of attendees
 * @param {number} happiness - Happiness score
 * @param {Object} modifiers - Optional modifiers from random events
 * @returns {Object} Reputation change details
 */
function calculateReputationChange(attendance, happiness, modifiers = {}) {
    // Base change derived from happiness
    // happiness 50 = 0 change, 80 = +6, 20 = -6
    let change = Math.round((happiness - 50) / 5);

    // Bonus for high attendance
    const venue = VENUES[gameState.selectedVenue];
    if (attendance >= venue.capacity * 0.8) {
        change += 2;
    }

    // Apply random event modifiers
    if (modifiers.reputation) {
        change += modifiers.reputation;
    }

    // Scale down if already at extremes (regression to mean)
    if (gameState.reputation > 80 && change > 0) {
        change = Math.ceil(change * 0.5);
    }
    if (gameState.reputation < 30 && change < 0) {
        change = Math.ceil(change * 0.5);
    }

    const newReputation = Math.max(CONFIG.REPUTATION_MIN,
                          Math.min(CONFIG.REPUTATION_MAX,
                          gameState.reputation + change));

    return {
        change,
        newReputation,
        message: getReputationMessage(newReputation)
    };
}

/**
 * Get reputation status message
 */
function getReputationMessage(reputation) {
    const level = REPUTATION_MESSAGES.find(l =>
        reputation >= l.min && reputation <= l.max
    );
    return level || REPUTATION_MESSAGES[3]; // Default to neutral
}

// ============================================
// REGULARS CALCULATION
// ============================================

/**
 * Calculate new regulars after an event
 *
 * @param {number} attendance - Number of attendees
 * @param {number} happiness - Happiness score
 * @param {Object} modifiers - Optional modifiers from random events
 * @returns {Object} Regulars update details
 */
function calculateRegularsChange(attendance, happiness, modifiers = {}) {
    // Existing regulars retention
    let keptRegulars = Math.round(gameState.regulars * CONFIG.REGULARS_RETENTION_RATE);

    // New regulars from happy attendees
    // Only happy attendees (happiness > 60) convert to regulars
    const happyFactor = Math.max(0, (happiness - 60) / 40); // 0 at 60, 1 at 100
    const newRegulars = Math.round(attendance * CONFIG.REGULARS_GROWTH_RATE * happyFactor);

    // Apply modifiers
    let modifierRegulars = modifiers.regulars || 0;

    const totalRegulars = Math.min(keptRegulars + newRegulars + modifierRegulars, 50); // Cap at 50 regulars

    return {
        previous: gameState.regulars,
        kept: keptRegulars,
        gained: newRegulars + modifierRegulars,
        total: totalRegulars
    };
}

// ============================================
// RANDOM EVENTS
// ============================================

/**
 * Check if a random event occurs this week
 * @returns {Object|null} Random event or null
 */
function checkForRandomEvent() {
    if (Math.random() > CONFIG.RANDOM_EVENT_CHANCE) {
        return null;
    }

    // Filter events by condition
    const eligibleEvents = RANDOM_EVENTS.filter(event => {
        if (!event.condition) return true;
        return event.condition(gameState);
    });

    if (eligibleEvents.length === 0) return null;

    // Pick random event
    const event = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];

    // Filter choices player can afford
    event.availableChoices = event.choices.filter(choice => {
        const cost = choice.cost;
        const remaining = getRemainingResources();

        if (cost.budget && remaining.budget < cost.budget) return false;
        if (cost.time && remaining.time < cost.time) return false;
        if (cost.energy && remaining.energy < cost.energy) return false;

        return true;
    });

    // If no choices available, skip event
    if (event.availableChoices.length === 0) return null;

    return event;
}

/**
 * Apply random event choice effects
 * @param {Object} event - The random event
 * @param {number} choiceIndex - Index of chosen option
 * @returns {Object} Modifiers to apply to event calculations
 */
function applyRandomEventChoice(event, choiceIndex) {
    const choice = event.choices[choiceIndex];
    const modifiers = { ...choice.effect };

    // Deduct costs
    if (choice.cost.budget) gameState.budget -= choice.cost.budget;
    if (choice.cost.time) gameState.time -= choice.cost.time;
    if (choice.cost.energy) gameState.energy -= choice.cost.energy;

    // Handle weather roll
    if (modifiers.weatherRoll) {
        const rainHappened = Math.random() < 0.7;
        if (rainHappened) {
            modifiers.weatherBad = true;
            modifiers.resultText = 'It rained and the event was a soggy mess.';
        } else {
            modifiers.happiness = 10;
            modifiers.resultText = 'The weather held! Students loved the outdoor event.';
        }
        delete modifiers.weatherRoll;
    }

    // Add budget directly to game state if positive
    if (modifiers.budget && modifiers.budget > 0) {
        gameState.budget += modifiers.budget;
        delete modifiers.budget;
    }

    // Add energy directly to game state if positive
    if (modifiers.energy && modifiers.energy > 0) {
        gameState.energy += modifiers.energy;
        delete modifiers.energy;
    }

    modifiers.resultText = modifiers.resultText || choice.resultText;

    return modifiers;
}

// ============================================
// EVENT EXECUTION
// ============================================

/**
 * Execute the planned event and calculate all results
 * @param {Object} modifiers - Modifiers from random events
 * @returns {Object} Complete event results
 */
function executeEvent(modifiers = {}) {
    const costs = calculateEventCosts();

    // Deduct resources
    gameState.budget -= costs.budget;
    gameState.time -= costs.time;
    gameState.energy -= costs.energy;

    // Calculate outcomes
    const attendance = calculateAttendance(modifiers);
    const happiness = calculateHappiness(attendance, modifiers);
    const reputationResult = calculateReputationChange(attendance.count, happiness.score, modifiers);
    const regularsResult = calculateRegularsChange(attendance.count, happiness.score, modifiers);

    // Update game state
    gameState.reputation = reputationResult.newReputation;
    gameState.regulars = regularsResult.total;
    gameState.lastWeekHappiness = happiness.score;
    gameState.totalAttendance += attendance.count;
    gameState.totalHappiness += happiness.score;

    // Track if ended at zero energy
    gameState.endedAtZeroEnergy = gameState.energy <= 0;

    // Record week history
    const weekRecord = {
        week: gameState.week,
        eventType: gameState.selectedEventType,
        venue: gameState.selectedVenue,
        attendance: attendance.count,
        happiness: happiness.score,
        reputationChange: reputationResult.change,
        regulars: regularsResult.total
    };
    gameState.weekHistory.push(weekRecord);

    // Save game
    saveGame();

    return {
        attendance,
        happiness,
        reputationResult,
        regularsResult,
        weekRecord,
        remainingBudget: gameState.budget,
        randomEventResult: modifiers.resultText || null
    };
}

// ============================================
// WEEK PROGRESSION
// ============================================

/**
 * Advance to the next week
 * @returns {boolean} Whether the game continues (false if semester ended)
 */
function advanceWeek() {
    gameState.week++;

    if (gameState.week > CONFIG.TOTAL_WEEKS) {
        return false; // Semester ended
    }

    // Calculate new budget (base + savings from last week, capped)
    const savings = Math.min(gameState.budget, CONFIG.MAX_SAVINGS);
    gameState.budget = CONFIG.WEEKLY_BUDGET + savings;
    gameState.savedBudget = savings;

    // Reset time
    gameState.time = CONFIG.WEEKLY_TIME;

    // Reset energy (with penalty if ended at 0)
    if (gameState.endedAtZeroEnergy) {
        gameState.energy = CONFIG.WEEKLY_ENERGY - CONFIG.ENERGY_PENALTY;
    } else {
        gameState.energy = CONFIG.WEEKLY_ENERGY;
    }
    gameState.endedAtZeroEnergy = false;

    // Reset event selection
    gameState.selectedEventType = 'pizza_chill';
    gameState.selectedVenue = 'common_room';
    gameState.foodBudget = 30;
    gameState.promotionHours = 2;
    gameState.personalTouchPoints = 1;
    gameState.currentRandomEvent = null;
    gameState.randomEventChoice = null;

    // Save game
    saveGame();

    return true;
}

// ============================================
// FINAL SCORE CALCULATION
// ============================================

/**
 * Calculate final score and rating at end of semester
 * @returns {Object} Final score details
 */
function calculateFinalScore() {
    const avgHappiness = Math.round(gameState.totalHappiness / CONFIG.TOTAL_WEEKS);

    // Score components:
    // - Total attendance (up to 2000 points for 1000+ total attendance)
    // - Average happiness (up to 1000 points)
    // - Final reputation (up to 500 points)
    // - Regulars built (up to 500 points for 30+ regulars)

    const attendanceScore = Math.min(2000, Math.round(gameState.totalAttendance * 2));
    const happinessScore = Math.round(avgHappiness * 10);
    const reputationScore = Math.round(gameState.reputation * 5);
    const regularsScore = Math.min(500, Math.round(gameState.regulars * 17));

    const totalScore = attendanceScore + happinessScore + reputationScore + regularsScore;

    // Rating based on total score
    let rating;
    if (totalScore >= 3500) rating = 'Legendary Campus Icon';
    else if (totalScore >= 3000) rating = 'Beloved Advisor';
    else if (totalScore >= 2500) rating = 'Campus Favorite';
    else if (totalScore >= 2000) rating = 'Respected Organizer';
    else if (totalScore >= 1500) rating = 'Competent Planner';
    else if (totalScore >= 1000) rating = 'Learning the Ropes';
    else rating = 'Room for Growth';

    // Find best event
    let bestEvent = null;
    let bestHappiness = 0;
    for (const week of gameState.weekHistory) {
        if (week.happiness > bestHappiness) {
            bestHappiness = week.happiness;
            bestEvent = `Week ${week.week}: ${EVENT_TYPES[week.eventType].name}`;
        }
    }

    return {
        totalScore,
        rating,
        breakdown: {
            attendance: attendanceScore,
            happiness: happinessScore,
            reputation: reputationScore,
            regulars: regularsScore
        },
        stats: {
            totalAttendance: gameState.totalAttendance,
            avgHappiness,
            finalReputation: gameState.reputation,
            finalRegulars: gameState.regulars,
            bestEvent
        }
    };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get description for current food budget level
 */
function getFoodDescription(budget) {
    const level = FOOD_LEVELS.find(l => budget >= l.min && budget <= l.max);
    return level ? level.description : 'Standard refreshments';
}

/**
 * Get description for current promotion level
 */
function getPromotionDescription(hours) {
    const level = PROMOTION_LEVELS[hours];
    return level ? level.description : 'Some promotion';
}

/**
 * Get description for current personal touch level
 */
function getPersonalDescription(points) {
    const level = PERSONAL_TOUCH_LEVELS[points];
    return level ? level.description : 'Some personal engagement';
}

// Export for use in ui.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        EVENT_TYPES,
        VENUES,
        RANDOM_EVENTS,
        gameState,
        initNewGame,
        saveGame,
        loadGame,
        hasSavedGame,
        clearSave,
        calculateEventCosts,
        checkAffordability,
        getSemesterPhase,
        calculateAttendance,
        calculateHappiness,
        calculateReputationChange,
        checkForRandomEvent,
        applyRandomEventChoice,
        executeEvent,
        advanceWeek,
        calculateFinalScore,
        getFoodDescription,
        getPromotionDescription,
        getPersonalDescription,
        getReputationMessage
    };
}
