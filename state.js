// Game state management with grant generation and application functionality

let state = {
    availablePapers: 0,
    lifetimePapers: 0,
    labFunding: 0,
    postdocs: 0, // Number of postdocs hired

    grantOpportunities: [],
    grantsInProgress: [],
    grantBaseAmount: 1000, // Starting funding amount for grants
    grantPaperCost: 10, // Default cost in papers for a grant
    grantSuccessChance: 50, // Starting success chance for grants
    grantDecisionTime: 10000 // Decision time in milliseconds for grants
};

/**
 * Adds a paper to the available and lifetime totals
 */

/**
 * Hires a postdoc if there is enough funding.
 */
function hirePostdoc() {
    if (state.labFunding > 0) {
        state.postdocs += 1;
        state.labFunding -= 100; // Cost to hire a postdoc
        updateDisplay();
    }
}

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
        // Remove the grant from the opportunities list
        state.grantOpportunities.splice(grantIndex, 1);
        grant.startTime = Date.now(); // Add this line after the grant object is defined
        state.grantsInProgress.push(grant); // Add this line before the splice operation
        updateGrantDisplay(); // Update the display to remove the grant from the list
        updateGrantsInProgressDisplay();
        setTimeout(() => {
            if (isGrantSuccessful(grant.chance)) {
                state.labFunding += grant.fundingAmount;
            }
            updateDisplay();
            // Potentially generate new grants after one has been processed
            generateGrants();
        }, grant.decisionTimeline);
    } else {
        alert('Not enough research papers!');
    }
    updateDisplay();
}

/**
 * Creates a new grant opportunity
 */
function createGrantOpportunity() {
    const grant = {
        id: Date.now(),
        fundingAmount: state.grantBaseAmount,
        cost: state.grantPaperCost,
        chance: state.grantSuccessChance,
        decisionTimeline: state.grantDecisionTime
    };
    state.grantOpportunities.push(grant);
    updateGrantDisplay();
}

/**
 * Generates grant opportunities if conditions are met
 */
function generateGrants() {
    if (state.availablePapers >= 10 && state.grantOpportunities.length < 5) {
        createGrantOpportunity();
    }
}

/**
 * Updates the game display with the current state
 */
function updateDisplay() {
    const availablePapersElement = document.getElementById('available-papers');
    const lifetimePapersElement = document.getElementById('lifetime-papers');
    const labFundingElement = document.getElementById('lab-funding');

    availablePapersElement.textContent = state.availablePapers;
    lifetimePapersElement.textContent = state.lifetimePapers;
    labFundingElement.textContent = state.labFunding.toFixed(2);
}

/**
 * Updates the grants display with the current state
 */
function updateGrantDisplay() {
    const grantsListElement = document.getElementById('grants-list');
    grantsListElement.innerHTML = ''; // Clear the current list
    state.grantOpportunities.forEach((grant, index) => {
        const grantElement = document.createElement('li');
        grantElement.textContent = `Grant ${index + 1}: $${grant.fundingAmount} (Cost: ${grant.cost} papers, Chance: ${grant.chance}%)`;
        grantElement.onclick = () => applyForGrant(index);
        grantsListElement.appendChild(grantElement);
    });
}

function updateGrantsInProgressDisplay() {
    // This function will be implemented in the game.js file.
    // It's declared here for consistency and will be called from applyForGrant.
}
function payAndGenerateResearch() {
    while (state.labFunding < 100 * state.postdocs && state.postdocs > 0) {
        // Not enough funding, reduce the number of postdocs by one
        state.postdocs -= 1;
    }

    if (state.postdocs > 0) {
        // Now we have enough funding to pay the postdocs
        state.labFunding -= 100 * state.postdocs;
        state.availablePapers += state.postdocs;
    }

    updateDisplay();
}

// Set an interval to run the payAndGenerateResearch function every second
setInterval(payAndGenerateResearch, 1000);
