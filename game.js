// Main game logic and event bindings

document.addEventListener('DOMContentLoaded', () => {
    const researchButton = document.getElementById('research-button');
    const availablePapersElement = document.getElementById('available-papers');
    const lifetimePapersElement = document.getElementById('lifetime-papers');
    const labFundingElement = document.getElementById('lab-funding');
    const grantsListElement = document.getElementById('grants-list');

    researchButton.addEventListener('click', () => {
        performResearch();
    });

    /**
     * Updates the game display with the current state
     */
    window.updateDisplay = function() {
        availablePapersElement.textContent = state.availablePapers;
        lifetimePapersElement.textContent = state.lifetimePapers;
        labFundingElement.textContent = state.labFunding;
    }
});