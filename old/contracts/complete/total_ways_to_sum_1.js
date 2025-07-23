/**
 * 
 * @param {Number} data_in 
 * @returns {Number}
 */
export default function total_ways_to_sum_1(data_in) {
    const TARGET = data_in
    var cache = {}
    return recursive(TARGET, TARGET, cache) - 1

    function recursive(limit, n, cache) {
        if (n < 1) { return 1 }
        if (limit == 1) { return 1 }
        if (n < limit) { return recursive(n, n, cache) }
        if (n in cache) {
            var values = cache[n]
            if (limit in values) { return values[limit] }
        }
        var spine = 0
        for (var i = 1; i <= limit; i++) {
            spine += recursive(i, n - i, cache)
        }
        if (!(n in cache)) { cache[n] = {} }
        cache[n][limit] = spine
        return spine
    }
}