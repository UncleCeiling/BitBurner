/** @param {NS} ns */
export async function main(ns) {
    const SOLUTIONS = [
        'Merge Overlapping Intervals',
        'Encryption I: Caesar Cipher'
    ]
    let contracts = get_contracts()
    for (let server of Object.keys(contracts)) {
        for (let contract of contracts[server]) {
            let type = ns.codingcontract.getContractType(contract, server)
            if (!SOLUTIONS.includes(type)) { ns.tprint(`ERROR - Solution to "${type}" does not exist for ${server}.`); continue }
            else {
                let data_in = ns.codingcontract.getData(contract, server)
                switch (contract) {
                    case 'Merge Overlapping Intervals':
                        merge_overlap(data_in, contract, server)
                        break;

                    case 'Encryption I: Caesar Cipher':
                        encrypt_1(data_in, contract, server)
                        break;

                    default:
                        ns.print('WARN - How did you get here?')
                        break;
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

    function merge_overlap(data_in, contract, server) {
        // Sort the data, lowest low first.
        data_in.sort((a, b) => {
            return Math.min(a) - Math.min(b)
        })
        // Set output variable
        var results = []
        // Set current interval info
        let current_interval = data_in[0]
        // For each interval in the data
        for (let interval of data_in) {
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
        ns.codingcontract.attempt(results, contract, server)
    }

    function encrypt_1(data_in, contract, server) {
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
        ns.codingcontract.attempt(results, contract, server)
    }

}