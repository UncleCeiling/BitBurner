/** @param {NS} ns */
export function merge_overlapping_intervals(data_in) {
    // Sort the data, lowest low first.
    var data = data_in
    data.sort((a, b) => { return Math.min(...a) - Math.min(...b) })
    var results = []
    let current_interval = data[0]
    // For each interval in the data
    for (let interval of data) {
        // If the smallest value is smaller than the largest value of our current interval
        if (Math.min(...interval) <= Math.max(...current_interval)) {
            // Combine the intervals
            current_interval.push(Math.max(...interval))
        } else {
            // Otherwise, they don't overlap, so push the current_interval to results
            results.push([Math.min(...current_interval), Math.max(...current_interval)])
            // Then set set the current_interval to be this interval
            current_interval = interval
        }
    }
    results.push([Math.min(...current_interval), Math.max(...current_interval)])
    return results
}