/**
 * Study Break Planner - UI Module
 * Handles all rendering and user interactions
 */

// ============================================
// DOM ELEMENT REFERENCES
// ============================================

const elements = {
    // Screens
    screens: {
        title: document.getElementById('screen-title'),
        planning: document.getElementById('screen-planning'),
        randomEvent: document.getElementById('screen-random-event'),
        results: document.getElementById('screen-results'),
        semesterEnd: document.getElementById('screen-semester-end')
    },

    // Title screen
    btnNewGame: document.getElementById('btn-new-game'),
    btnContinue: document.getElementById('btn-continue'),

    // Header
    currentWeek: document.getElementById('current-week'),
    semesterPhase: document.getElementById('semester-phase'),
    reputationStatus: document.getElementById('reputation-status'),

    // Resources
    budgetBar: document.getElementById('budget-bar'),
    budgetCurrent: document.getElementById('budget-current'),
    budgetMax: document.getElementById('budget-max'),
    timeBar: document.getElementById('time-bar'),
    timeCurrent: document.getElementById('time-current'),
    energyBar: document.getElementById('energy-bar'),
    energyCurrent: document.getElementById('energy-current'),

    // Event planning
    eventTypesContainer: document.getElementById('event-types'),
    venueOptionsContainer: document.getElementById('venue-options'),

    // Sliders
    foodSlider: document.getElementById('food-slider'),
    foodCurrent: document.getElementById('food-current'),
    foodMin: document.getElementById('food-min'),
    foodMax: document.getElementById('food-max'),
    foodDescription: document.getElementById('food-description'),

    promotionSlider: document.getElementById('promotion-slider'),
    promotionCurrent: document.getElementById('promotion-current'),
    promotionDescription: document.getElementById('promotion-description'),

    personalSlider: document.getElementById('personal-slider'),
    personalCurrent: document.getElementById('personal-current'),
    personalDescription: document.getElementById('personal-description'),

    // Cost summary
    totalBudgetCost: document.getElementById('total-budget-cost'),
    totalTimeCost: document.getElementById('total-time-cost'),
    totalEnergyCost: document.getElementById('total-energy-cost'),
    costWarnings: document.getElementById('cost-warnings'),
    btnPlanEvent: document.getElementById('btn-plan-event'),

    // Random event screen
    randomEventIcon: document.getElementById('random-event-icon'),
    randomEventTitle: document.getElementById('random-event-title'),
    randomEventDescription: document.getElementById('random-event-description'),
    randomEventChoices: document.getElementById('random-event-choices'),

    // Results screen
    attendeesAnimation: document.getElementById('attendees-animation'),
    resultAttendance: document.getElementById('result-attendance'),
    resultAttendanceDetail: document.getElementById('result-attendance-detail'),
    resultHappiness: document.getElementById('result-happiness'),
    resultReputationChange: document.getElementById('result-reputation-change'),
    eventHighlightsList: document.getElementById('event-highlights-list'),
    resultsSummary: document.getElementById('results-summary'),
    btnNextWeek: document.getElementById('btn-next-week'),

    // Semester end screen
    finalScore: document.getElementById('final-score'),
    finalRating: document.getElementById('final-rating'),
    totalAttendance: document.getElementById('total-attendance'),
    avgHappiness: document.getElementById('avg-happiness'),
    totalRegulars: document.getElementById('total-regulars'),
    bestEvent: document.getElementById('best-event'),
    weekHistoryGrid: document.getElementById('week-history-grid'),
    btnPlayAgain: document.getElementById('btn-play-again')
};

// Current random event modifiers (accumulated from random event choice)
let currentEventModifiers = {};

// ============================================
// SCREEN MANAGEMENT
// ============================================

/**
 * Show a specific screen and hide others
 * @param {string} screenName - Name of screen to show
 */
function showScreen(screenName) {
    Object.values(elements.screens).forEach(screen => {
        screen.classList.remove('active');
    });
    elements.screens[screenName].classList.add('active');
}

// ============================================
// TITLE SCREEN
// ============================================

/**
 * Initialize the title screen
 */
function initTitleScreen() {
    // Check for saved game
    if (hasSavedGame()) {
        elements.btnContinue.disabled = false;
    } else {
        elements.btnContinue.disabled = true;
    }
}

// ============================================
// PLANNING SCREEN RENDERING
// ============================================

/**
 * Render the complete planning screen
 */
function renderPlanningScreen() {
    renderHeader();
    renderResources();
    renderEventTypes();
    renderVenues();
    renderSliders();
    updateCostSummary();
}

/**
 * Render header with week and reputation info
 */
function renderHeader() {
    elements.currentWeek.textContent = gameState.week;

    const phase = getSemesterPhase();
    elements.semesterPhase.textContent = phase.name;
    elements.semesterPhase.className = `semester-phase ${phase.cssClass}`;

    const repMessage = getReputationMessage(gameState.reputation);
    elements.reputationStatus.textContent = repMessage.message;
}

/**
 * Render resource bars and values
 */
function renderResources() {
    const maxBudget = CONFIG.WEEKLY_BUDGET + CONFIG.MAX_SAVINGS;

    // Budget
    elements.budgetCurrent.textContent = gameState.budget;
    elements.budgetMax.textContent = maxBudget;
    elements.budgetBar.style.width = `${(gameState.budget / maxBudget) * 100}%`;

    // Time
    elements.timeCurrent.textContent = gameState.time;
    elements.timeBar.style.width = `${(gameState.time / CONFIG.WEEKLY_TIME) * 100}%`;

    // Energy
    elements.energyCurrent.textContent = gameState.energy;
    elements.energyBar.style.width = `${(gameState.energy / CONFIG.WEEKLY_ENERGY) * 100}%`;
}

/**
 * Render event type selection cards
 */
function renderEventTypes() {
    elements.eventTypesContainer.innerHTML = '';

    Object.values(EVENT_TYPES).forEach(eventType => {
        const card = document.createElement('div');
        card.className = `event-type-card ${gameState.selectedEventType === eventType.id ? 'selected' : ''}`;
        card.dataset.eventType = eventType.id;

        card.innerHTML = `
            <div class="event-type-icon">${eventType.icon}</div>
            <div class="event-type-name">${eventType.name}</div>
            <div class="event-type-cost">$${eventType.baseCost} | ${eventType.baseEnergy}⚡</div>
        `;

        card.addEventListener('click', () => selectEventType(eventType.id));
        elements.eventTypesContainer.appendChild(card);
    });
}

/**
 * Render venue selection cards
 */
function renderVenues() {
    elements.venueOptionsContainer.innerHTML = '';

    Object.values(VENUES).forEach(venue => {
        const card = document.createElement('div');
        card.className = `venue-card ${gameState.selectedVenue === venue.id ? 'selected' : ''}`;
        card.dataset.venue = venue.id;

        let costText = venue.cost > 0 ? `$${venue.cost}` : 'Free';
        let warningHtml = '';

        if (venue.weatherRisk) {
            warningHtml = '<div class="venue-warning">⚠️ Weather dependent</div>';
        }

        card.innerHTML = `
            <div class="venue-header">
                <span class="venue-icon">${venue.icon}</span>
                <span class="venue-name">${venue.name}</span>
            </div>
            <div class="venue-details">${costText} | Cap: ${venue.capacity}</div>
            ${warningHtml}
        `;

        card.addEventListener('click', () => selectVenue(venue.id));
        elements.venueOptionsContainer.appendChild(card);
    });
}

/**
 * Render slider values and descriptions
 */
function renderSliders() {
    // Food slider
    elements.foodSlider.value = gameState.foodBudget;
    elements.foodCurrent.textContent = gameState.foodBudget;
    elements.foodDescription.textContent = getFoodDescription(gameState.foodBudget);

    // Promotion slider
    elements.promotionSlider.value = gameState.promotionHours;
    elements.promotionCurrent.textContent = gameState.promotionHours;
    elements.promotionDescription.textContent = getPromotionDescription(gameState.promotionHours);

    // Personal touches slider
    elements.personalSlider.value = gameState.personalTouchPoints;
    elements.personalCurrent.textContent = gameState.personalTouchPoints;
    elements.personalDescription.textContent = getPersonalDescription(gameState.personalTouchPoints);
}

/**
 * Update the cost summary panel
 */
function updateCostSummary() {
    const affordability = checkAffordability();
    const costs = affordability.costs;

    elements.totalBudgetCost.textContent = `$${costs.budget}`;
    elements.totalTimeCost.textContent = `${costs.time} hours`;
    elements.totalEnergyCost.textContent = `${costs.energy} points`;

    // Update resource card styling based on affordability
    const budgetCard = document.querySelector('.resource-card.budget');
    const timeCard = document.querySelector('.resource-card.time');
    const energyCard = document.querySelector('.resource-card.energy');

    budgetCard.classList.toggle('insufficient', !affordability.budget);
    timeCard.classList.toggle('insufficient', !affordability.time);
    energyCard.classList.toggle('insufficient', !affordability.energy);

    // Show warnings
    elements.costWarnings.innerHTML = '';

    if (!affordability.budget) {
        addWarning('Not enough budget! Reduce food or choose cheaper options.');
    }
    if (!affordability.time) {
        addWarning('Not enough time! Reduce promotion effort.');
    }
    if (!affordability.energy) {
        addWarning('Not enough energy! Reduce personal touches or choose a different event.');
    }

    // Enable/disable plan button
    elements.btnPlanEvent.disabled = !affordability.canAfford;
}

/**
 * Add a warning message to the cost summary
 */
function addWarning(message) {
    const warning = document.createElement('div');
    warning.className = 'cost-warning';
    warning.textContent = message;
    elements.costWarnings.appendChild(warning);
}

// ============================================
// EVENT SELECTION HANDLERS
// ============================================

/**
 * Select an event type
 */
function selectEventType(eventTypeId) {
    gameState.selectedEventType = eventTypeId;

    // Update UI
    document.querySelectorAll('.event-type-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.eventType === eventTypeId);
    });

    updateCostSummary();
    saveGame();
}

/**
 * Select a venue
 */
function selectVenue(venueId) {
    gameState.selectedVenue = venueId;

    // Update UI
    document.querySelectorAll('.venue-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.venue === venueId);
    });

    updateCostSummary();
    saveGame();
}

// ============================================
// SLIDER HANDLERS
// ============================================

/**
 * Handle food budget slider change
 */
function handleFoodSliderChange(e) {
    gameState.foodBudget = parseInt(e.target.value);
    elements.foodCurrent.textContent = gameState.foodBudget;
    elements.foodDescription.textContent = getFoodDescription(gameState.foodBudget);
    updateCostSummary();
}

/**
 * Handle promotion slider change
 */
function handlePromotionSliderChange(e) {
    gameState.promotionHours = parseInt(e.target.value);
    elements.promotionCurrent.textContent = gameState.promotionHours;
    elements.promotionDescription.textContent = getPromotionDescription(gameState.promotionHours);
    updateCostSummary();
}

/**
 * Handle personal touches slider change
 */
function handlePersonalSliderChange(e) {
    gameState.personalTouchPoints = parseInt(e.target.value);
    elements.personalCurrent.textContent = gameState.personalTouchPoints;
    elements.personalDescription.textContent = getPersonalDescription(gameState.personalTouchPoints);
    updateCostSummary();
}

// ============================================
// RANDOM EVENT SCREEN
// ============================================

/**
 * Render the random event screen
 * @param {Object} event - Random event object
 */
function renderRandomEventScreen(event) {
    elements.randomEventIcon.textContent = event.icon;
    elements.randomEventTitle.textContent = event.title;
    elements.randomEventDescription.textContent = event.description;

    elements.randomEventChoices.innerHTML = '';

    event.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'random-choice-btn';

        // Build cost text
        const costParts = [];
        if (choice.cost.budget) costParts.push(`$${choice.cost.budget}`);
        if (choice.cost.time) costParts.push(`${choice.cost.time}h time`);
        if (choice.cost.energy) costParts.push(`${choice.cost.energy} energy`);

        const costText = costParts.length > 0 ? `Cost: ${costParts.join(', ')}` : 'No cost';

        // Check if player can afford this choice
        const remaining = getRemainingResources();
        const canAfford = (!choice.cost.budget || remaining.budget >= choice.cost.budget) &&
                         (!choice.cost.time || remaining.time >= choice.cost.time) &&
                         (!choice.cost.energy || remaining.energy >= choice.cost.energy);

        btn.innerHTML = `
            <span class="choice-text">${choice.text}</span>
            <span class="choice-cost">${costText}</span>
        `;

        btn.disabled = !canAfford;
        btn.addEventListener('click', () => handleRandomEventChoice(event, index));

        elements.randomEventChoices.appendChild(btn);
    });
}

/**
 * Handle random event choice selection
 */
function handleRandomEventChoice(event, choiceIndex) {
    currentEventModifiers = applyRandomEventChoice(event, choiceIndex);
    gameState.randomEventChoice = choiceIndex;

    // Proceed to execute the event
    executeAndShowResults();
}

// ============================================
// RESULTS SCREEN
// ============================================

/**
 * Execute event and show results
 */
function executeAndShowResults() {
    const results = executeEvent(currentEventModifiers);

    showScreen('results');
    renderResultsScreen(results);

    // Reset modifiers for next event
    currentEventModifiers = {};
}

/**
 * Render the results screen
 * @param {Object} results - Event execution results
 */
function renderResultsScreen(results) {
    // Animate attendees appearing
    animateAttendees(results.attendance.count);

    // Attendance stat
    elements.resultAttendance.textContent = results.attendance.count;
    elements.resultAttendanceDetail.textContent = `${results.attendance.percentage}% of first-years`;

    // Happiness stat with color coding
    elements.resultHappiness.textContent = results.happiness.score;
    elements.resultHappiness.className = 'stat-value';
    if (results.happiness.score >= 70) {
        elements.resultHappiness.classList.add('high');
    } else if (results.happiness.score >= 50) {
        elements.resultHappiness.classList.add('medium');
    } else {
        elements.resultHappiness.classList.add('low');
    }

    // Reputation change with color coding
    const repChange = results.reputationResult.change;
    const repSign = repChange >= 0 ? '+' : '';
    elements.resultReputationChange.textContent = `${repSign}${repChange}`;
    elements.resultReputationChange.className = 'stat-value';
    if (repChange > 0) {
        elements.resultReputationChange.classList.add('positive');
    } else if (repChange < 0) {
        elements.resultReputationChange.classList.add('negative');
    }

    // Event highlights
    renderHighlights(results.happiness.highlights, results.randomEventResult);

    // Summary text
    renderResultsSummary(results);

    // Update button text based on week
    if (gameState.week >= CONFIG.TOTAL_WEEKS) {
        elements.btnNextWeek.textContent = 'View Semester Summary';
    } else {
        elements.btnNextWeek.textContent = 'Continue to Next Week';
    }
}

/**
 * Animate attendee icons appearing
 */
function animateAttendees(count) {
    elements.attendeesAnimation.innerHTML = '';

    const displayCount = Math.min(count, 50); // Cap visual display
    const icons = ['😊', '😄', '🙂', '😁', '🤗', '😎'];

    for (let i = 0; i < displayCount; i++) {
        setTimeout(() => {
            const icon = document.createElement('span');
            icon.className = 'attendee-icon';
            icon.textContent = icons[Math.floor(Math.random() * icons.length)];
            icon.style.animationDelay = `${i * 30}ms`;
            elements.attendeesAnimation.appendChild(icon);
        }, i * 30);
    }
}

/**
 * Render event highlights list
 */
function renderHighlights(highlights, randomEventResult) {
    elements.eventHighlightsList.innerHTML = '';

    // Add random event result if present
    if (randomEventResult) {
        const li = document.createElement('li');
        li.textContent = randomEventResult;
        li.className = 'random-event-result';
        elements.eventHighlightsList.appendChild(li);
    }

    // Add happiness highlights
    highlights.forEach(highlight => {
        const li = document.createElement('li');
        li.textContent = highlight.text;
        li.className = highlight.positive ? 'positive' : 'negative';
        elements.eventHighlightsList.appendChild(li);
    });

    // Add generic positive highlights if there weren't many
    if (highlights.length < 2 && !randomEventResult) {
        const genericPositive = [
            'Students seemed to enjoy themselves.',
            'The event went smoothly overall.',
            'A few new faces showed up.'
        ];
        const li = document.createElement('li');
        li.textContent = genericPositive[Math.floor(Math.random() * genericPositive.length)];
        elements.eventHighlightsList.appendChild(li);
    }
}

/**
 * Render results summary text
 */
function renderResultsSummary(results) {
    const eventType = EVENT_TYPES[gameState.selectedEventType];
    let summary = '';

    if (results.happiness.score >= 80) {
        summary = `Your ${eventType.name} was a huge hit! Students are already asking about next week.`;
    } else if (results.happiness.score >= 65) {
        summary = `The ${eventType.name} went well. You're building a good reputation on campus.`;
    } else if (results.happiness.score >= 50) {
        summary = `The ${eventType.name} was decent. There's room for improvement, but students appreciated the effort.`;
    } else if (results.happiness.score >= 35) {
        summary = `The ${eventType.name} had some issues. Consider adjusting your approach next time.`;
    } else {
        summary = `The ${eventType.name} didn't go as planned. Don't give up - learn from this experience!`;
    }

    // Add regulars info
    if (results.regularsResult.gained > 0) {
        summary += ` You gained ${results.regularsResult.gained} new regular${results.regularsResult.gained > 1 ? 's' : ''}!`;
    }

    // Add budget warning if low
    if (results.remainingBudget < 20) {
        summary += ' Your budget is running low for next week.';
    }

    elements.resultsSummary.textContent = summary;
}

// ============================================
// SEMESTER END SCREEN
// ============================================

/**
 * Render the semester end summary screen
 */
function renderSemesterEndScreen() {
    const finalResults = calculateFinalScore();

    // Main score display
    elements.finalScore.textContent = finalResults.totalScore;
    elements.finalRating.textContent = finalResults.rating;

    // Stats
    elements.totalAttendance.textContent = finalResults.stats.totalAttendance;
    elements.avgHappiness.textContent = finalResults.stats.avgHappiness;
    elements.totalRegulars.textContent = finalResults.stats.finalRegulars;
    elements.bestEvent.textContent = finalResults.stats.bestEvent || 'N/A';

    // Week history grid
    renderWeekHistory();

    // Clear the save since game is complete
    clearSave();
}

/**
 * Render the week-by-week history grid
 */
function renderWeekHistory() {
    elements.weekHistoryGrid.innerHTML = '';

    gameState.weekHistory.forEach(week => {
        const card = document.createElement('div');
        card.className = 'week-history-card';

        // Color code by happiness
        if (week.happiness >= 70) {
            card.classList.add('good');
        } else if (week.happiness >= 50) {
            card.classList.add('medium');
        } else {
            card.classList.add('poor');
        }

        card.innerHTML = `
            <div class="week-history-number">W${week.week}</div>
            <div class="week-history-happiness">${week.happiness}</div>
        `;

        card.title = `Week ${week.week}: ${EVENT_TYPES[week.eventType].name}\nAttendance: ${week.attendance}\nHappiness: ${week.happiness}`;

        elements.weekHistoryGrid.appendChild(card);
    });
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle starting a new game
 */
function handleNewGame() {
    initNewGame();
    showScreen('planning');
    renderPlanningScreen();
}

/**
 * Handle continuing a saved game
 */
function handleContinueGame() {
    if (loadGame()) {
        showScreen('planning');
        renderPlanningScreen();
    }
}

/**
 * Handle planning/executing an event
 */
function handlePlanEvent() {
    // Check for random event
    const randomEvent = checkForRandomEvent();

    if (randomEvent) {
        gameState.currentRandomEvent = randomEvent;
        showScreen('randomEvent');
        renderRandomEventScreen(randomEvent);
    } else {
        // No random event, execute directly
        executeAndShowResults();
    }
}

/**
 * Handle advancing to next week
 */
function handleNextWeek() {
    if (gameState.week >= CONFIG.TOTAL_WEEKS) {
        // Show semester end
        showScreen('semesterEnd');
        renderSemesterEndScreen();
    } else {
        // Advance to next week
        advanceWeek();
        showScreen('planning');
        renderPlanningScreen();
    }
}

/**
 * Handle playing again
 */
function handlePlayAgain() {
    showScreen('title');
    initTitleScreen();
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Title screen
    elements.btnNewGame.addEventListener('click', handleNewGame);
    elements.btnContinue.addEventListener('click', handleContinueGame);

    // Sliders
    elements.foodSlider.addEventListener('input', handleFoodSliderChange);
    elements.promotionSlider.addEventListener('input', handlePromotionSliderChange);
    elements.personalSlider.addEventListener('input', handlePersonalSliderChange);

    // Plan event button
    elements.btnPlanEvent.addEventListener('click', handlePlanEvent);

    // Results screen
    elements.btnNextWeek.addEventListener('click', handleNextWeek);

    // Semester end
    elements.btnPlayAgain.addEventListener('click', handlePlayAgain);
}

/**
 * Initialize the game UI
 */
function initUI() {
    initEventListeners();
    initTitleScreen();
    showScreen('title');
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}
