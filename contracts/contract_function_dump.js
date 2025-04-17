
async function proper_2_colour(data_in) {
    // Sort edges small-to-large in both axes
    data_in[1].forEach(edge => edge.sort((a, b) => a - b))
    data_in[1].sort((a, b) => a[0] - b[0])
    // Take data
    let num_vertices = data_in[0]
    let edges = Array.from(data_in[1])
    // If no edges, output with success
    if (edges.length < 1) { for (let i = 0; i < num_vertices; i++) { results[i] = 0 } }

    // Build empty results array
    let results = []
    for (let i = 0; i < num_vertices; i++) { results[i] = null }

    // Init variables
    let impossible = false
    let queue = []

    // While there are still things to compare
    while (edges.length > 0 || queue.length > 0) {
        // Take a comparison
        let comparison = []
        if (queue.length > 0) { comparison = queue.shift() }
        else if (edges.length > 0) { comparison = edges.shift() }
        // Split the comparison
        let c0 = comparison[0]
        let c1 = comparison[1]
        ns.print(c0, ' | ', c1)
        // If it's taking too long, just assume it's not possible.
        if (time_to_kill < Date.now()) { time_to_kill = Date.now() + (5 * 1000); return [] }
        // Start the first result as 0
        if (results[0] == null) { results[0] = 0 }

        // If first node is not coloured
        if (results[c0] == null) {
            // If second node is also not coloured
            if (results[c1] == null) {
                if (edges.filter((x) => x[0] == c0 || x[1] == c0).length == 0) { results[c0] = 0 }
                if (edges.filter((x) => x[0] == c1 || x[1] == c1).length == 0) { results[c1] = 1 }
                edges.push([c0, c1])
                // Add nodes to the queue
                queue.push(...edges.filter((x) => x[0] == c0))
                queue.push(...edges.filter((x) => x[0] == c1))
            } else {
                // First node is coloured, but second isn't
                results[c0] = (results[c1] + 1) % 2 // Set colour of empty first node to opposite of the coloured second node
                queue.push(...edges.filter((x) => x[0] == c0)) // Add freshly coloured nodes to the queue
            }
            // First node is coloured
        } else {
            // If second node isn't coloured
            if (results[c1] == null) {
                results[c1] = (results[c0] + 1) % 2 // Set colour of empty second node to opposite of the coloured first node
                queue.push(...edges.filter((x) => x[0] == c1)) // Add freshly coloured nodes to the queue
            } else {
                // If both nodes are the same colour, set the impossible flag and break.
                if (results[c0] === results[c1]) {
                    impossible = true
                    break
                }
            }
        }
    }
    if (impossible) { results = [] }
    if (results.includes(null)) { for (let item in results) { if (results[item] === null) { results[item] = 0 } } }
    return results
}

function shortest_path(data_in) {
    // Take in data
    const grid = data_in
    // Calc number of rows & columns
    let rows = grid.length
    let cols = grid[0].length
    // Initialise flag and queue
    let pathFound = false
    let queue = []
    // Add starting point to the queue
    queue.push([rows - 1, cols - 1, "F"])
    // While there are routes to explore, explore them
    while (queue.length > 0) {
        // Pull from Queue
        let next = queue.shift()
        // Populate values from queue data
        let row = next[0], col = next[1], command = next[2]
        // Add the command to the grid
        grid[row][col] = command
        // ns.print('\n')
        // for (let row of grid) { ns.print(row), '\n' }
        // If we've reached the start, we've pound a path, so flag and break.
        if (row == 0 && col == 0) { pathFound = true; break }
        // If direction is inside the grid, and the square is not blocked, and the square is not already in the queue, add it to the queue.
        if (row - 1 >= 0 && grid[row - 1][col] == "0" && queue.find(e => e[0] == row - 1 && e[1] == col) == undefined) { queue.push([row - 1, col, "D"]) }
        if (row + 1 < rows && grid[row + 1][col] == "0" && queue.find(e => e[0] == row + 1 && e[1] == col) == undefined) { queue.push([row + 1, col, "U"]) }
        if (col - 1 >= 0 && grid[row][col - 1] == "0" && queue.find(e => e[0] == row && e[1] == col - 1) == undefined) { queue.push([row, col - 1, "R"]) }
        if (col + 1 < cols && grid[row][col + 1] == "0" && queue.find(e => e[0] == row && e[1] == col + 1) == undefined) { queue.push([row, col + 1, "L"]) }
    }
    // Create path variable
    let path = []
    // If we found a path, parse it
    if (pathFound) {
        // Start at the top left (the start)
        let col = 0
        let row = 0
        // Add commands until we reach the finish
        while (grid[row][col] != "F") {
            // Add command to path
            path.push(grid[row][col])
            // Follow command
            switch (grid[row][col]) {
                case "U":
                    row -= 1
                    break
                case "D":
                    row += 1
                    break
                case "L":
                    col -= 1
                    break
                case "R":
                    col += 1
                    break
            }
        }
    }
    // Join list into a string and return it
    return path.join('')
}

function min_path_sum_triangle(data_in) {
    // Make Triangles
    const original_tri = data_in
    const cost_tri = []
    const tri_height = original_tri.length
    // Fill empty Tri
    for (let row in original_tri) {
        cost_tri.push([])
        for (let item in original_tri[row]) { cost_tri[row][item] = null }
    }
    // Backfill empty Tri with costs
    original_tri.reverse()
    cost_tri.reverse()
    // Fill first row
    for (let item in original_tri[0]) { cost_tri[0][item] = original_tri[0][item] }
    for (let row = 0; row < original_tri.length; row++) {
        for (let i = 0; i < original_tri[row].length; i++) {
            if (i == original_tri[row].length - 1 && i >= 0) { continue }
            let pair = [cost_tri[row][i], cost_tri[row][i + 1]]
            let smallest = Math.min(...pair)
            cost_tri[row + 1][i] = (original_tri[row + 1][i] + smallest)
        }
    }
    // Re-orient the cost triangle
    cost_tri.reverse()
    return cost_tri[0][0]
}

function total_ways_sum_2(data_in) {
    // Take data
    const TARGET = data_in[0]
    const NUMBERS = data_in[1].sort((a, b) => b - a)
    // Some Voodoo shit
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

function spiralize_matrix(data_in) {
    // Take data
    let matrix = data_in
    let array = []
    while (matrix.length != 0 && matrix[0].length != 0) {
        // Strip the first row into the array
        for (let item of matrix[0]) { array.push(item) }
        matrix.shift()
        // If Matrix is empty, skip
        if (matrix.length == 0 || matrix[0].length == 0) { continue }
        // Strip last column
        for (let row of matrix) { array.push(row[matrix[0].length - 1]) }
        for (let row of matrix) { row.pop() }

        // If Matrix is empty, skip
        if (matrix.length == 0 || matrix[0].length == 0) { continue }
        // Strip last row
        for (let item of matrix[matrix.length - 1].reverse()) { array.push(item) }
        matrix.pop()

        // If Matrix is empty, skip
        if (matrix.length == 0 || matrix[0].length == 0) { continue }
        // Strip first column
        for (let row of matrix.toReversed()) { array.push(row[0]); row.shift() }
    }

    // Give the result
    return array
}

function sanitize_parentheses(data_in) {
    // Take data
    const INPUT = data_in
    // Check to see if the input is valid, if so, return it
    if (check_valid(INPUT)) { return [INPUT] }
    // Build other variables, and calculate char totals
    let results = []
    let total_chars = INPUT.length
    let parenthesis_chars = INPUT.match(/\(|\)/g).length // match() contains regexp: / \( | \) /g = open-bracket OR closed-bracket, globally (/ indicates start/end of regexp, \ is escape character)
    let non_parenthesis_chars = total_chars - parenthesis_chars
    let variations = new Set()
    variations.add(INPUT)
    // Start a countdown from total number of characters
    for (let i = total_chars; i > 0; i--) {
        // If no parenthesis left (or only 1 character), return the INPUT with () stripped out
        if (i == non_parenthesis_chars || i < 2) { return [INPUT.replace(/\(|\)/g, '')] }
        // Generate new variants for each variant currently stored
        let generated = new Set()
        for (let variant of variations) {
            variations.delete(variant)
            // Add the generated variants to set of generated items
            let variants = gen_variants(variant)
            for (let item of variants) { generated.add(item) }
        }
        // check if any generated items are valid and push them to the results array. Otherwise, push them to variants.
        for (let item of generated) {
            if (check_valid(item)) { results.push(item) }
            else { variations.add(item) }
        }
        // If there are any valid results, return them
        if (results.length > 0) { return results }
    }

    function gen_variants(string) {
        // Create variable to store output 
        let variations = []
        // Generate a variant for each possible character
        for (let char in string) {
            // Skip stuff that isn't '(' or ')'
            if (!string[char].includes('(') && !string[char].includes(')')) { continue }
            // Do some array voodoo to remove the character
            let array = string.split('')
            array.splice(char, 1)
            let variant = array.join('')
            // Push the resulting variant to the output (joined as a string)
            variations.push(variant)
        }
        return variations
    }

    function check_valid(string) {
        // Start a counter for unclosed parenthesis
        let unclosed = 0
        // Work through each character from the start
        for (let char of string) {
            // +1 for every Parenthesis opened, -1 for every closure.
            if (char == '(') { unclosed++ }
            else if (char == ')') { unclosed-- }
            // If we ever go negative, it means we've closed a non-existant Parenthesis, so automatic fail.
            if (unclosed < 0) { return false }
        }
        // If no Parenthesis are left unclosed, output true
        if (unclosed == 0) { return true } else { return false }
    }
}

function max_sum_subarray(data_in) {
    // Init Array
    const ARRAY = Array.from(data_in)
    // Get starting sum and array
    var max_sum = sum_array(ARRAY)
    var max_sub_array = Array.from(ARRAY)
    // ns.print('0,0 | ',max_sum, ' | ',max_sub_array)
    for (var i = 1; i < ARRAY.length; i++) {
        for (var j = 0; j < i; j++) {
            var current_array = Array.from(ARRAY).slice(j, ARRAY.length - i + j)
            var current_sum = sum_array(current_array)
            // ns.print(i,',',j,' | ',current_sum, ' | ', current_array )
            if (max_sum < current_sum) {
                new_max_sum(current_sum)
                new_max_array(current_array)
            }
        }
    }
    // ns.print(max_sum,' | ',max_sub_array)
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