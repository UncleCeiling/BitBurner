//#region IMPORTS

import array_jumping_game_1 from "contracts/complete/array_jumping_game_1";
import array_jumping_game_2 from "contracts/complete/array_jumping_game_2";
import compression_1_rle_compression from "contracts/complete/compression_1_rle_compression";
import encryption_1_caesar_cipher from "contracts/complete/encryption_1_caesar_cipher";
import find_largest_prime_factor from "contracts/complete/find_largest_prime_factor";

//#endregion

//#region CONSTANTS

// const TRIES_EXCEPTIONS = ['Array Jumping Game'] // Not used

const TODO = [
    'Algorithmic Stock Trader I',
    'Algorithmic Stock Trader II',
    'Algorithmic Stock Trader III',
    'Algorithmic Stock Trader IV',
    'Compression II: LZ Decompression',
    'Compression III: LZ Compression',
    'Encryption II: Vigenère Cipher',
    'Find All Valid Math Expressions',
    'Generate IP Addresses',
    'HammingCodes: Integer to Encoded Binary',
    'HammingCodes: Encoded Binary to Integer',
    'Merge Overlapping Intervals',
    'Minimum Path Sum in a Triangle',
    'Proper 2-Coloring of a Graph',
    'Sanitize Parentheses in Expression',
    'Shortest Path in a Grid',
    'Spiralize Matrix',
    'Subarray with Maximum Sum',
    'Total Ways to Sum',
    'Total Ways to Sum II',
    'Unique Paths in a Grid I',
    'Unique Paths in a Grid II',
]
const SOLUTIONS = {
    'Array Jumping Game': array_jumping_game_1,
    'Array Jumping Game II': array_jumping_game_2,
    'Compression I: RLE Compression': compression_1_rle_compression,
    'Encryption I: Caesar Cipher': encryption_1_caesar_cipher,
    'Find Largest Prime Factor': find_largest_prime_factor,
}
export { SOLUTIONS }
//#endregion

/** @param {NS} ns */
export async function main(ns) {
    // Disable logs
    ns.disableLog("ALL");
    let history = { "success": 0, "fail": 0 }
    let contracts = get_contracts();
    ns.print(contracts);
    if (contracts.length <= 0) { ns.tprint('INFO - No contracts found.'); return };
    for (let server of Object.keys(contracts)) {
        for (let contract of contracts[server]) {
            let type = ns.codingcontract.getContractType(contract, server);
            if (!Object.keys(SOLUTIONS).includes(type)) { ns.tprint(`WARN - ${server}: Solution to "${type}" does not exist.`); continue };
            let data_in = ns.codingcontract.getData(contract, server);
            let result = SOLUTIONS[type](data_in);
            let reward = ns.codingcontract.attempt(result, contract, server)
            if (reward) { if (!reward.includes("No reward")) { ns.tprint(`SUCCESS - ${type}: ${contract} solved - ${reward}.`) } history.success++ }
            else { ns.tprint(`FAIL - ${type}: Failed to solve ${contract}.\nData: ${data_in}\nResult: ${result}`); history.fail++ };
        }
    }
    if (history.success > 0) { ns.tprint(`SUCCESS - Completed ${history.success} contracts.`) }
    if (history.fail > 0) { ns.tprint(`FAIL - Failed ${history.fail} contracts.`) }


    function get_contracts() {
        let contracts = {};
        for (let server of get_servers()) {
            let files = ns.ls(server, '.cct');
            ns.print(`${server}: ${files}`);
            if (files.length > 0) { contracts[server] = files } else { continue };
        };
        return contracts
    }

    function get_servers() {
        let servers = new Set(['home']);
        for (let server of servers) { for (let result of ns.scan(server)) { servers.add(result) } };
        return servers
    }
}

/** NOTES
 * https://github.com/bitburner-official/bitburner-src/tree/dev/src/CodingContract/contracts
 */