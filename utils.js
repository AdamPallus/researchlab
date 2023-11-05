// Utility functions for the game

/**
 * Generates a random number between min (inclusive) and max (exclusive)
 */
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Calculates if the grant application is successful based on the chance
 */
function isGrantSuccessful(chance) {
    return randomBetween(0, 100) < chance;
}
/**
 * Generates a random grant with properties like funding amount, success chance, and approval time.
 */
function generateRandomGrant(minFunding, maxFunding, minTime, maxTime) {
    const fundingAmount = Math.floor(randomBetween(minFunding, maxFunding + 1));
    const successChance = Math.random();
    const approvalTime = Math.floor(randomBetween(minTime, maxTime + 1));
    const costInPapers = Math.ceil(fundingAmount / 10); // Example scaling factor of 10

    return {
        amount: fundingAmount,
        chance: successChance,
        time: approvalTime,
        cost: costInPapers
    };
}

/**
 * Poisson random number generator.
 */
function poissonRandomNumber(lambda) {
    let L = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;

    do {
        k++;
        p *= Math.random();
    } while (p > L);

    return k - 1;
}
