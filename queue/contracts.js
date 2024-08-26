/** @param {NS} ns */
export async function main(ns) {
    const SOLUTIONS = [
        'Merge Overlapping Intervals',
        'Encryption I: Caesar Cipher',
        'Find Largest Prime Factor'
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
                        result = merge_overlap(data_in, contract, server)
                        ns.tprint(`SUCCESS - Attempting ${contract} on ${server}`)
                        break;

                    case 'Encryption I: Caesar Cipher':
                        result = encrypt_1(data_in, contract, server)
                        ns.tprint(`SUCCESS - Attempting ${contract} on ${server}`)
                        break;

                    case 'Find Largest Prime Factor':
                        result = largest_prime_factor(data_in, contract, server)
                        ns.tprint(`SUCCESS - Attempting ${contract} on ${server}`)
                        break;

                    default:
                        ns.print('WARN - How did you get here?')
                        break;
                }
                let reward = ns.codingcontract.attempt(result, contract, server)
                if (reward) {
                    ns.tprint(`SUCCESS - ${contract} solved on ${server}: ${reward}`)
                } else {
                    ns.tprint(`ERROR - Failed to solve ${contract} on ${server} with result: ${result}`)
                }
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
        ns.tprint(result)
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

}