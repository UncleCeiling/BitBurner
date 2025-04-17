/**
 * 
 * @param {[Number]} data_in Array of numbers
 * @returns {Number} `1` or `0`
 */
export default function array_jumping_game_1(data_in) {
    const ARRAY = data_in
    const TARGET = ARRAY.length - 1
    for (var reach = 0, i = 0; // Starting from the first index (0)
        i < TARGET && i <= reach; // Until we are at the target and `reach` >= the current position
        i++) { // Increment
        reach = Math.max(i + ARRAY[i], reach) // Check if the current position takes us further than we can already go and take whichever is higher.
        if (reach >= TARGET) { return 1 } // Check if we reached the Target and return 1 if we have
    }
    return 0 // None of the nodes allowed us to reach the end
}