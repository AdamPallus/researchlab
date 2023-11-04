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