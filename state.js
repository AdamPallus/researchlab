// Game state management with grant generation and application functionality

let state = {
    availablePapers: 0,
    lifetimePapers: 0,
    labFunding: 0,
    postdocs: 0, // Number of postdocs hired
    students: 0,

    grantOpportunities: [],
    grantsInProgress: [],
    grantBaseAmount: 1000, // Starting funding amount for grants
    grantPaperCost: 10, // Default cost in papers for a grant
    grantSuccessChance: 50, // Starting success chance for grants
    grantDecisionTime: 10000, // Decision time in milliseconds for grants
    newGrantChance: 0.5,
    minChance: 20,
    maxChance: 80,
    minFunding: 500,
    maxFunding: 10000,
    minTime: 3000,
    maxTime: 20000,
    scalingFactor: 0.1,
    maxGrants: 10
};

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

    } else {
        alert('Not enough research papers!');
    }
    updateDisplay();
}


function createGrantOpportunity() {
    const fundingAmount = Math.floor(randomBetween(state.minFunding, state.maxFunding + 1));
    const grant = {
        id: Date.now(),
        fundingAmount: fundingAmount,
        cost: Math.ceil(Math.sqrt(fundingAmount) * state.scalingFactor),
        chance: Math.round(randomBetween(state.minChance, state.maxChance)),
        decisionTimeline: Math.round(randomBetween(state.minTime, state.maxTime + 1))
    };

    state.grantOpportunities.push(grant);
    if (state.grantOpportunities.length > state.maxGrants) {
        // Remove the oldest (first) grant opportunity
        state.grantOpportunities.shift();
      }
    updateGrantDisplay();
}



/**
 * Generates grant opportunities if conditions are met
 */
function generateGrants() {
    if (Math.random() < state.newGrantChance) {
        createGrantOpportunity();
    }
    // if (state.grantOpportunities.length < state.maxGrants) {
    //     createGrantOpportunity();
    // }
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
        state.lifetimePapers += state.postdocs;
    }

    updateDisplay();
}

// Set an interval to run the payAndGenerateResearch function every second
setInterval(payAndGenerateResearch, 1000);
