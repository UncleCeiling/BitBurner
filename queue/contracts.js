/** @param {NS} ns */
export async function main(ns) {
    const SOLUTIONS = [
        'Find Largest Prime Factor',
        'Total Ways to Sum II',
        'Spiralize Matrix',
        'Array Jumping Game',
        'Array Jumping Game II',
        'Merge Overlapping Intervals',
        'Minimum Path Sum in a Triangle',
        'Shortest Path in a Grid',
        'Sanitize Parentheses in Expression',
        'Proper 2-Coloring of a Graph',
        'Compression I: RLE Compression',
        'Encryption I: Caesar Cipher',
    ]
    let contracts = get_contracts()
    for (let server of Object.keys(contracts)) {
        for (let contract of contracts[server]) {
            let type = ns.codingcontract.getContractType(contract, server)
            if (!SOLUTIONS.includes(type)) { ns.tprint(`WARN - Solution to "${type}" does not exist for ${server}.`); continue }
            else {
                let data_in = ns.codingcontract.getData(contract, server)
                let result
                switch (type) {
                    case 'Merge Overlapping Intervals':
                        result = merge_overlap(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Encryption I: Caesar Cipher':
                        result = encrypt_1(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Find Largest Prime Factor':
                        result = largest_prime_factor(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Proper 2-Coloring of a Graph':
                        result = await proper_2_colour(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Array Jumping Game':
                        result = array_jumping(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Array Jumping Game II':
                        result = array_jumping_2(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Shortest Path in a Grid':
                        result = shortest_path(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Minimum Path Sum in a Triangle':
                        result = min_path_sum_triangle(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Total Ways to Sum II':
                        result = total_ways_sum_2(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Spiralize Matrix':
                        result = spiralize_matrix(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Compression I: RLE Compression':
                        result = compression_1(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Sanitize Parentheses in Expression':
                        result = sanitize_parentheses(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    case 'Subarray with Maximum Sum':
                        result = max_sum_subarray(data_in)
                        ns.tprint(`INFO - Attempting ${type} on ${server} (${contract})`)
                        break

                    default:
                        ns.print('WARN - How did you get here?')
                        break
                }
                let reward = false
                let tries = ns.codingcontract.getNumTriesRemaining(contract, server)
                const exceptions = ['Array Jumping Game']
                if (tries <= 1 && !exceptions.includes(type)) {
                    ns.tprint(`ERROR - Not enough tries (${tries}) to submit ${contract} on ${server}. (${type}).`)
                    ns.tprint(`ERROR - Input:`)
                    ns.tprint(data_in)
                    ns.tprint('ERROR - Result:')
                    ns.tprint(result)
                    continue
                }
                else { reward = ns.codingcontract.attempt(result, contract, server) }
                if (reward) {
                    ns.tprint(`SUCCESS - ${contract} solved on ${server}: ${reward}`)
                } else {
                    ns.tprint(`FAIL - Failed to solve ${contract} on ${server}.`)

                    ns.tprint(`FAIL - Input:`)
                    ns.tprint(data_in)
                    ns.tprint('FAIL - Result:')
                    ns.tprint(result)
                }
                await ns.asleep(200)
            }
        }
    }

    function get_server_set() {
        let servers = new Set(['home'])
        for (let server of servers) {
            for (let result of ns.scan(server)) {
                if (result.includes('custom-')) { continue }
                servers.add(result)
            }
        }
        return servers
    }

    function get_contracts() {
        var contracts = []
        for (let server of get_server_set()) {
            let files = ns.ls(server, '.cct')
            if (files.length > 0) { contracts[server] = files } else { continue }
        }
        return contracts
    }

    function merge_overlap(data_in) {
        // Sort the data, lowest low first.
        var data = data_in
        data.sort((a, b) => { return Math.min(...a) - Math.min(...b) })
        // Set output variable
        var results = []
        // Set current interval info
        let current_interval = data[0]
        // For each interval in the data
        for (let interval of data) {
            // If the smallest value is smaller than the largest value of our current interval
            if (Math.min(...interval) <= Math.max(...current_interval)) {
                // Combine the intervals
                ns.print(current_interval)
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

    function encrypt_1(data_in) {
        // Alphabet in order
        const ALPHABET = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z'
        ]
        // Split the message into an array
        const INPUT = data_in[0].split('')
        const LEFT_SHIFT = data_in[1]
        var output = []
        // For each character
        for (let character of INPUT) {
            // Get the index of that character
            let index = ALPHABET.indexOf(character)
            // If it's not in the alphabet, just push it to the message
            if (index < 0) { output.push(character); continue }
            // Shift the index
            index -= LEFT_SHIFT
            // If the index is now negative (wish this was python), add 26
            if (index < 0) { index += 26 }
            // Push to output
            output.push(ALPHABET[index])
        }
        // Turn output array into a string
        var results = output.join('')
        // Hand in your work
        return results
    }

    function largest_prime_factor(data_in) {
        let target = data_in
        let factors = new Set()
        let prime_factors = new Set()

        if (is_prime(target)) { return target }

        // For each possible factor between 2 and sqrt of target, check if it's a factor
        for (let i = 2; i <= Math.sqrt(target); i++) {
            if (target % i === 0) {
                // Add both parts to the factors sets
                factors.add(i)
                factors.add(target / i)
                // If either is a prime, add them to the prime set
                if (is_prime(i)) { prime_factors.add(i) }
                if (is_prime(target / i)) { prime_factors.add(target / i) }
            }
        }

        // Find the largest of the primes
        let result = Math.max(...prime_factors)
        // ns.tprint(result)
        // Hand in your work
        return result

        // Function to check if a number is a prime
        function is_prime(number) {
            for (let i = 2; i < number; i++) {
                if (number % i === 0) { return false }
            }
            return true
        }
    }

    async function proper_2_colour(data_in) {
        // Sort edges small-to-large in both axes
        data_in[1].forEach(edge => edge.sort((a, b) => a - b))
        data_in[1].sort((a, b) => a[0] - b[0])
        // Take data
        let num_vertices = data_in[0]
        let edges = Array.from(data_in[1])
        // If no edges, output with success
        if (edges.length < 1) { for (let i = 0; i < num_vertices; i++) { results[i] = 0 } }

        ns.tprint(edges)

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
            ns.tprint(c0, ' | ', c1)
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
            ns.tprint(results)
            await ns.asleep(10)
        }
        if (impossible) { results = [] }
        if (results.includes(null)) { for (let item in results) { if (results[item] === null) { results[item] = 0 } } }
        return results
    }

    function array_jumping(data_in) {
        // Make constants
        const array = data_in
        const target_index = array.length - 1
        ns.print(target_index)
        // For each item, update reach if index takes us further than previous reach
        for (var reach = 0, i = 0; i < target_index && i <= reach; ++i) {
            reach = Math.max(i + array[i], reach)
            ns.print(reach)
            // If our reach is larger than our target index, return 1
            if (reach >= target_index) { return 1 }
        }
        // We didn't reach the target index so return 0
        return 0
    }

    function array_jumping_2(data_in) {
        // Create variables
        const ARRAY = data_in
        let target_index = ARRAY.length - 1
        let current_index = 0 // For tracking our current index
        let counter = 0 // For counting the jumps we've made
        // As long as we've not reached the end of our array, keep going
        while (current_index < target_index && counter <= target_index) {
            // Value of current index is 0, we can't progress, so return 0
            if (ARRAY[current_index] === 0) { return 0 }
            // If the value pf our current index, plus the index, is equal to or larger than our target, increment the counter one last time and return the counter variable
            if (ARRAY[current_index] + current_index >= target_index) { counter++; return counter }
            // Reset current options var and populate it
            let current_options = []
            for (let i = 1; i <= ARRAY[current_index]; ++i) { current_options.push(current_index + i) }
            // ns.print(`${current_index} | ${current_options} | ${counter}`)
            // Set the current index to the index of the largest reach index in the current options
            current_index = current_options.sort((a, b) => (ARRAY[b] + b) - (ARRAY[a] + a))[0] // This sort sorts the indexs into descending order of (index + value of index)
            // Increment counter
            counter++
        }
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

    function compression_1(data_in) {
        // Take data and init the answer variable
        const INPUT = data_in
        let answer = ''
        // Starting from the first character and ending at the end of the message
        for (let i = 0; i < INPUT.length; i) {
            // What character is it?
            let char = INPUT[i]
            // Set count to 1 (we have to include the character we've chosen)
            let count = 1
            // As long as we're not over-running the string, the current run isn't longer than 9 characters and there is another character, increase the count
            while (i + count < INPUT.length && count < 9 && INPUT[i + count] == char) { count++ }
            // Append count and character to the answer string
            answer += `${count}${char}`
            // Move to the start of the next run
            i += count
        }
        return answer
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
}