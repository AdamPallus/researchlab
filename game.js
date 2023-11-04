// Main game logic and event bindings

document.addEventListener('DOMContentLoaded', () => {
    const researchButton = document.getElementById('research-button');
    const grantsListElement = document.getElementById('grants-list');

    // Event listener for the "Perform Research" button
    researchButton.addEventListener('click', () => {
        performResearch();
    });

    // Function to update the game display with the current state
    window.updateDisplay = function() {
        const availablePapersElement = document.getElementById('available-papers');
        const lifetimePapersElement = document.getElementById('lifetime-papers');
        const labFundingElement = document.getElementById('lab-funding');

        availablePapersElement.textContent = state.availablePapers;
        lifetimePapersElement.textContent = state.lifetimePapers;
        labFundingElement.textContent = state.labFunding.toFixed(2);
    };

    // Function to update the grants display
    window.updateGrantDisplay = function() {
        grantsListElement.innerHTML = ''; // Clear the current list
        state.grantOpportunities.forEach((grant, index) => {
            const grantElement = document.createElement('li');
            grantElement.textContent = `Grant ${index + 1}: $${grant.fundingAmount} (Cost: ${grant.cost} papers, Chance: ${grant.chance}%)`;
            grantElement.onclick = () => applyForGrant(index);
            grantsListElement.appendChild(grantElement);
        });
    };

    // Periodically check for new grant opportunities
    setInterval(() => {
        generateGrants();
        updateDisplay();
    }, 5000); // Check every 5 seconds
});