/** @param {NS} ns */
/**
 *
 * @param {[String]} data_in
 * @returns
 */
export default function subarray_with_maximum_sum(data_in) {
  var input = data_in.map((a) => Number(a)); // Make Take array and make sure all the items are Numbers
  for (let i = 1; i < input.length; i++) {
    // Take each bubble of items in the array
    input[i] = Math.max(input[i], input[i] + input[i - 1]); // Work out if it's better to start from this number or just go from here
  }
  return Math.max(...input);
}
