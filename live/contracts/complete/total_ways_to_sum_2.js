/** @param {NS} ns */
export default function total_ways_to_sum_2(data_in) {
    // Take data
    const TARGET = data_in[0]
    const NUMBERS = data_in[1].sort((a, b) => b - a)
    // Some Voodoo
    let result = check_sums(TARGET, NUMBERS)
    // Give the result
    return result

    function check_sums(TARGET, NUMBERS, index = 0) {
        // If the index value is the last one, if TARGET value is divisible by the value of the index, return 1, otherwise return 0
        if (NUMBERS.length == index + 1) { if (TARGET % NUMBERS[index] == 0) { return 1 } else { return 0 } }
        // Set result to 0
        let result = 0
        // Calculate how many of the current index value would fit in the target
        let multiplier = Math.floor(TARGET / NUMBERS[index])
        // Check each multiple
        for (let i = multiplier; i >= 0; i--) {
            // If it's an exact multiple, increment the result
            if (TARGET == NUMBERS[index] * i) { result++ }
            // Otherwise, run this function with the next index and add whatever is returned to the result total.
            else { result += check_sums(TARGET - (NUMBERS[index] * i), NUMBERS, index + 1) }
        }
        // Return the final count for this index
        return result
    }
}