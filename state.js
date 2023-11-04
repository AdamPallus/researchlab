// Game state management

let state = {
    availablePapers: 0,
    lifetimePapers: 0,
    labFunding: 0,
    grantOpportunities: [],
};

/**
 * Adds a paper to the available and lifetime totals
 */
function performResearch() {
    state.availablePapers += 1;
    state.lifetimePapers += 1;
    updateDisplay();
}

/**
 * Attempts to apply for a grant
 */
function applyForGrant(grantIndex) {
    let grant = state.grantOpportunities[grantIndex];
    if (state.availablePapers >= grant.cost) {
        state.availablePapers -= grant.cost;
        setTimeout(() => {
            if (isGrantSuccessful(grant.chance)) {
                state.labFunding += grant.fundingAmount;
            }
            updateDisplay();
        }, grant.decisionTimeline);
    } else {
        alert('Not enough research papers!');
    }
    updateDisplay();
}

/**
 * Updates the game display with the current state
 */
function updateDisplay() {
    // This function will interact with the DOM, to be implemented in game.js
}