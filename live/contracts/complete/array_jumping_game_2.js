/** @param {NS} ns */
export default function array_jumping_game_2(data_in) {
  const ARRAY = data_in;
  const TARGET = ARRAY.length - 1;
  for (
    let i = 0, counter = 0; // i: current index, counter: for counting the jumps
    i < TARGET && counter <= TARGET; // Until we reach the end of the array
    counter++ // Increment the counter
  ) {
    if (ARRAY[i] === 0) {
      return 0;
    } // If a 0 is our best option, we can't progress, so return 0
    if (ARRAY[i] + i >= TARGET) {
      counter++;
      return counter;
    } // If the current index, plus its value is enough to take us to the end of the array, we're done, so count that jump and return the value.
    let options = []; // We haven't found an end-state so let's try another hop.
    for (let j = 1; j <= ARRAY[i]; j++) {
      options.push(i + j);
    } // Make a list of the options for the next jump
    i = options.sort((a, b) => ARRAY[b] + b - (ARRAY[a] + a))[0]; // Pick the next location that will take us the furthest
  }
}
