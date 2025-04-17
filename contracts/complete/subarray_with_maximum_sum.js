/** @param {NS} ns */
export default function subarray_with_maximum_sum(data_in) {
    // Init Array
    const ARRAY = Array.from(data_in)
    // Get starting sum and array
    var max_sum = sum_array(ARRAY)
    var max_sub_array = Array.from(ARRAY)
    for (var i = 1; i < ARRAY.length; i++) {
        for (var j = 0; j < i; j++) {
            var current_array = Array.from(ARRAY).slice(j, ARRAY.length - i + j)
            var current_sum = sum_array(current_array)
            if (max_sum < current_sum) {
                new_max_sum(current_sum)
                new_max_array(current_array)
            }
        }
    }
    return max_sum
    // Update values
    function new_max_sum(sum_in) { max_sum = sum_in }
    function new_max_array(array_in) { max_sub_array = array_in }
    // Calculate the sum of the array
    function sum_array(array_in) {
        let sum = 0
        for (let item of array_in) { sum = sum + item }
        return sum
    }
}