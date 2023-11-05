
// Main game logic and event bindings

document.addEventListener('DOMContentLoaded', () => {
    const researchButton = document.getElementById('research-button');
    const grantsListElement = document.getElementById('grants-list');

    // Event listener for the "Perform Research" button
    researchButton.addEventListener('click', () => {
        performResearch(1);
    });


    const hirePostdocButton = document.getElementById('hire-postdoc-button');
    hirePostdocButton.addEventListener('click', () => {
        hirePostdoc();
    });

    const acceptStudentButton = document.getElementById('accept-student-button');
    acceptStudentButton.addEventListener('click',()=>{
        acceptStudent(1)
    })
    

    // Function to update the game display with the current state
    window.updateDisplay = function() {
        const availablePapersElement = document.getElementById('available-papers');
        const lifetimePapersElement = document.getElementById('lifetime-papers');
        const labFundingElement = document.getElementById('lab-funding');

        availablePapersElement.textContent = state.availablePapers;
        lifetimePapersElement.textContent = state.lifetimePapers;
        labFundingElement.textContent = state.labFunding.toLocaleString(2);
        // Update the postdocs display
        const postdocsElement = document.getElementById('postdocs');
        postdocsElement.textContent = state.postdocs;

        //update students
        
        const studentsElement = document.getElementById('students');
        studentsElement.textContent = state.students
        const maxStudentsElement = document.getElementById('maxstudents');
        maxStudentsElement.textContent = state.maxStudents
        const graduatesElement = document.getElementById('graduates');
        graduatesElement.textContent = state.graduates

        document.getElementById('max-funding-upgrade').disabled = state.labFunding < state.upgradeCosts.maxFunding();
        document.getElementById('increase-grant-rate').disabled = state.labFunding < state.upgradeCosts.increaseGrantRate();
        document.getElementById('auto-accept-students-upgrade').disabled = state.labFunding < state.upgradeCosts.autoAcceptStudents();
    

        // Show or hide the "Hire Postdoc" button based on lab funding
        const hirePostdocButton = document.getElementById('hire-postdoc-button');
        if (state.labFunding > 0) {
            hirePostdocButton.disabled = false;
            hirePostdocButton.classList.remove('button-disabled');

        } else {
            hirePostdocButton.disabled = true;
            hirePostdocButton.classList.add('button-disabled');
        }

        const acceptStudentButton = document.getElementById('accept-student-button');
        if (state.students < state.maxStudents) {
            acceptStudentButton.disabled = false;
            acceptStudentButton.classList.remove('button-disabled')
        } else {
            acceptStudentButton.disabled = true;
            acceptStudentButton.classList.add('button-disabled');
        }
    
    };

    // Function to update the grants display
    window.updateGrantDisplay = function() {
        grantsListElement.innerHTML = ''; // Clear the current list
        state.grantOpportunities.forEach((grant, index) => {
            const grantElement = document.createElement('li');
            grantElement.textContent = `Grant ${index + 1}: $${grant.fundingAmount} (Cost: ${grant.cost} papers, Chance: ${grant.chance}%)`;
            
            // Check if enough papers are available for the grant
            if (state.availablePapers >= grant.cost) {
                grantElement.classList.add('affordable'); // Add the 'affordable' class if the condition is met
            }
            
            grantElement.onclick = () => applyForGrant(index);
            grantsListElement.appendChild(grantElement);
        });
    };
    

    // Periodically check for new grant opportunities
    setInterval(() => {
        generateGrants();
        updateDisplay();
    }, 1000); 

    window.updateGrantsInProgressDisplay = function() {
        const grantsInProgressElement = document.getElementById('grants-in-progress');
    
        state.grantsInProgress.forEach((grant,index) => {
            let grantProgressElement = document.getElementById(`grant-progress-${grant.id}`);
            if (grant.finalized) {
                return;
            }
            if (!grantProgressElement) {
                grantProgressElement = document.createElement('li');
                grantProgressElement.className = 'grant-progress-item';
                grantProgressElement.id = `grant-progress-${grant.id}`;
                grantsInProgressElement.appendChild(grantProgressElement);
            }
    
            const elapsedTime = Date.now() - grant.startTime;
            const remainingTime = grant.decisionTimeline - elapsedTime;
            const progressPercent = Math.max(0, 100 - (remainingTime / grant.decisionTimeline * 100));
    
            grantProgressElement.innerHTML = `
            Grant ${index + 1}: $${grant.fundingAmount} - Decision in ${Math.ceil(remainingTime / 1000)}s
            <div class="progress-bar" style="width: ${progressPercent}%"></div>
            `;
    
            if (remainingTime <= 0 && !grant.finalized) {
                finalizeGrantDecision(grant, grantProgressElement);
            }
        });
    };

 

    function finalizeGrantDecision(grant, grantElement) {
        if (grant.finalized) {
            return;
        }
        grant.finalized = true;
    
        const success = isGrantSuccessful(grant.chance);
        if (success) {
            state.labFunding += grant.fundingAmount;
            grantElement.classList.add('grant-success');
            grantElement.textContent = `Grant: $${grant.fundingAmount} - Approved. Click to dismiss.`;
        } else {
            grantElement.classList.add('grant-failure');
            grantElement.textContent = `Grant: $${grant.fundingAmount} - Denied. Click to dismiss.`;
        }
    
        let autoDismissTimeout = setTimeout(() => {
            // This code will run after 5 seconds unless the timer is cleared
            const grantIndex = state.grantsInProgress.findIndex(g => g.id === grant.id);
            if (grantIndex > -1) {
                state.grantsInProgress.splice(grantIndex, 1);
            }
            grantElement.remove();
            updateDisplay();
        }, 5000); // 5 seconds
    
        grantElement.addEventListener('click', function() {
            const grantIndex = state.grantsInProgress.findIndex(g => g.id === grant.id);
            if (grantIndex > -1) {
                state.grantsInProgress.splice(grantIndex, 1);
            }
            grantElement.remove();
            updateDisplay();
            // Clear the auto-dismiss timer when the user clicks the grant
            clearTimeout(autoDismissTimeout);
        });
    
        clearInterval(grant.updateInterval);
    }
    
    
    setInterval(updateGrantsInProgressDisplay, 1000);    
    
});

function flashMessage(message) {
    const flashBox = document.createElement('div');
    flashBox.className = 'flash-message';
    flashBox.textContent = message;
    document.body.appendChild(flashBox);
    flashBox.style.display = 'block';
  
    setTimeout(() => {
      document.body.removeChild(flashBox);
    }, 3000); // Remove the flash message after 3 seconds
  }
  

function buyMaxFundingUpgrade() {
    var upgradeCost = state.upgradeCosts.maxFunding();

    // Check if the player has enough money to buy the upgrade
    if (state.labFunding >= upgradeCost) {
        // Deduct the cost from the player's funds
        state.labFunding -= upgradeCost;

        // Increase the maxFundingLevel
        state.maxFundingLevel += 1;

        // Calculate the new maxFunding amount
        state.maxFunding = Math.pow(2, state.maxFundingLevel) * state.grantBaseAmount;

        // Update the cost on the "Max Funding" button for the next upgrade
        document.getElementById('max-funding-upgrade').textContent = 'Max Funding - $' + (10000 * Math.pow(2, state.maxFundingLevel)).toLocaleString();

        // Update other parts of the UI if necessary
        // For example: update displayed lab funding
        // document.getElementById('lab-funding').textContent = '$' + state.labFunding.toLocaleString();
    } else {
        flashMessage('Not enough funds to purchase this upgrade.');
    }
}


function buyIncreaseGrantRate() {
    var upgradeCost = state.upgradeCosts.increaseGrantRate();
    // Check if the player has enough money to buy the upgrade
    if (state.labFunding >= upgradeCost) {
        // Deduct the cost from the player's funds
        state.labFunding -= upgradeCost;

        // Increase the maxFundingLevel
        state.newGrantLevel += 1;

        // increase funding chance by 10%
        state.newGrantChance = state.newGrantChance*1.1;

        // Update the cost on the "Max Funding" button for the next upgrade
        document.getElementById('increase-grant-rate').textContent = 'Upgrade New Grant Rate - $' + (1000 * Math.pow(2, state.newGrantLevel)).toLocaleString();

        // Update the paragraph
        document.getElementById('new-grant-rate').textContent = 'Current chance: ' + (state.newGrantChance).toLocaleString();

        // Update other parts of the UI if necessary
        // For example: update displayed lab funding
        // document.getElementById('lab-funding').textContent = '$' + state.labFunding.toLocaleString();
    } else {
        flashMessage('Not enough funds to purchase this upgrade.');
    }
}


function buyAutoAcceptStudentsUpgrade() {
    var upgradeCost = state.upgradeCosts.autoAcceptStudents();
    // Check if the player has enough money to buy the upgrade
    if (state.labFunding >= upgradeCost) {
        // Deduct the cost from the player's funds
        state.labFunding -= upgradeCost;

        // Set the autoAcceptStudents property to true
        state.autoAcceptStudents = true;
        state.autoAcceptRate += 1;

        // Update the button to reflect that the upgrade has been purchased
        var upgradeButton = document.getElementById('auto-accept-students-upgrade');
        upgradeButton.textContent = 'Accept More Students - $'+(20000 * Math.pow(2, state.autoAcceptRate)).toLocaleString();

        var autoAcceptText = document.getElementById('auto-accept-text');
        autoAcceptText.textContent = 'Current rate: '+(state.autoAcceptRate).toLocaleString() + ' Students/second'
        // Update other parts of the UI if necessary
        // For example: update displayed lab funding
        // document.getElementById('lab-funding').textContent = '$' + state.labFunding.toLocaleString();
    } else {
        flashMessage('Not enough funds to purchase this upgrade.');
    }
}

