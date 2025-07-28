/**
 * Given a number, returns the largest prime factor of that number
 * @param {Number} data_in Number to find the largest prime factor of
 * @returns {Number} Largest prime factor
 */
export default function find_largest_prime_factor(data_in) {
  let number = data_in; // Ingest number number
  let factor = 2;
  while (number > (factor - 1) * (factor - 1)) {
    // While our number is more than our last factor squared
    while (number % factor === 0) {
      number = Math.round(number / factor);
    } // If the factor *is* a factor, divide our number by that number.
    factor++; // Try the next factor up
  }
  if (number === 1) {
    return factor - 1;
  } // If we get a 1, then the last factor was a square, so that's our answer
  return number;
}
