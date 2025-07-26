/** @param {NS} ns */
export default function shortest_path_in_a_grid(data_in) {
  // Take in data
  const grid = data_in;
  // Calc number of rows & columns
  let rows = grid.length;
  let cols = grid[0].length;
  // Initialise flag and queue
  let pathFound = false;
  let queue = [];
  // Add starting point to the queue
  queue.push([rows - 1, cols - 1, "F"]);
  // While there are routes to explore, explore them
  while (queue.length > 0) {
    // Pull from Queue
    let next = queue.shift();
    // Populate values from queue data
    let row = next[0],
      col = next[1],
      command = next[2];
    // Add the command to the grid
    grid[row][col] = command;
    // If we've reached the start, we've pound a path, so flag and break.
    if (row == 0 && col == 0) {
      pathFound = true;
      break;
    }
    // If direction is inside the grid, and the square is not blocked, and the square is not already in the queue, add it to the queue.
    if (
      row - 1 >= 0 &&
      grid[row - 1][col] == "0" &&
      queue.find((e) => e[0] == row - 1 && e[1] == col) == undefined
    ) {
      queue.push([row - 1, col, "D"]);
    }
    if (
      row + 1 < rows &&
      grid[row + 1][col] == "0" &&
      queue.find((e) => e[0] == row + 1 && e[1] == col) == undefined
    ) {
      queue.push([row + 1, col, "U"]);
    }
    if (
      col - 1 >= 0 &&
      grid[row][col - 1] == "0" &&
      queue.find((e) => e[0] == row && e[1] == col - 1) == undefined
    ) {
      queue.push([row, col - 1, "R"]);
    }
    if (
      col + 1 < cols &&
      grid[row][col + 1] == "0" &&
      queue.find((e) => e[0] == row && e[1] == col + 1) == undefined
    ) {
      queue.push([row, col + 1, "L"]);
    }
  }
  // Create path variable
  let path = [];
  // If we found a path, parse it
  if (pathFound) {
    // Start at the top left (the start)
    let col = 0;
    let row = 0;
    // Add commands until we reach the finish
    while (grid[row][col] != "F") {
      // Add command to path
      path.push(grid[row][col]);
      // Follow command
      switch (grid[row][col]) {
        case "U":
          row -= 1;
          break;
        case "D":
          row += 1;
          break;
        case "L":
          col -= 1;
          break;
        case "R":
          col += 1;
          break;
      }
    }
  }
  // Join list into a string and return it
  return path.join("");
}
