//#region IMPORTS

import array_jumping_game_1 from "contracts/complete/array_jumping_game_1";
import array_jumping_game_2 from "contracts/complete/array_jumping_game_2";
import compression_1_rle_compression from "contracts/complete/compression_1_rle_compression";
import encryption_1_caesar_cipher from "contracts/complete/encryption_1_caesar_cipher";
import encryption_2_vigenere_cipher from "contracts/complete/encryption_2_vigenere_cipher";
import find_largest_prime_factor from "contracts/complete/find_largest_prime_factor";
import generate_ip_addresses from "contracts/complete/generate_ip_addresses";
import merge_overlapping_intervals from "contracts/complete/merge_overlapping_intervals";
import minimum_path_sum_in_a_triangle from "contracts/complete/minimum_path_sum_in_a_triangle";
import proper_2_coloring_of_a_graph from "contracts/complete/proper_2_coloring_of_a_graph";
import sanitize_parentheses_in_expression from "contracts/complete/sanitize_parentheses_in_expression";
import shortest_path_in_a_grid from "contracts/complete/shortest_path_in_a_grid";
import spiralize_matrix from "contracts/complete/spiralize_matrix";
import subarray_with_maximum_sum from "contracts/complete/subarray_with_maximum_sum";
import total_ways_to_sum_1 from "contracts/complete/total_ways_to_sum_1";
import total_ways_to_sum_2 from "contracts/complete/total_ways_to_sum_2";
import { ANSI } from "live/imports/ANSI";

//#endregion

//#region CONSTANTS

const SOLUTIONS = {
    // 'Algorithmic Stock Trader I':,
    // 'Algorithmic Stock Trader II':,
    // 'Algorithmic Stock Trader III':,
    // 'Algorithmic Stock Trader IV':,
    'Array Jumping Game': array_jumping_game_1,
    'Array Jumping Game II': array_jumping_game_2,
    'Compression I: RLE Compression': compression_1_rle_compression,
    // 'Compression II: LZ Decompression':,
    // 'Compression III: LZ Compression':,
    'Encryption I: Caesar Cipher': encryption_1_caesar_cipher,
    'Encryption II: Vigenère Cipher': encryption_2_vigenere_cipher,
    // 'Find All Valid Math Expressions':,
    'Find Largest Prime Factor': find_largest_prime_factor,
    'Generate IP Addresses': generate_ip_addresses,
    // 'HammingCodes: Integer to Encoded Binary':,
    // 'HammingCodes: Encoded Binary to Integer':,
    'Merge Overlapping Intervals': merge_overlapping_intervals,
    'Minimum Path Sum in a Triangle': minimum_path_sum_in_a_triangle,
    'Proper 2-Coloring of a Graph': proper_2_coloring_of_a_graph, //! REDO ME
    'Sanitize Parentheses in Expression': sanitize_parentheses_in_expression,
    'Shortest Path in a Grid': shortest_path_in_a_grid,
    'Spiralize Matrix': spiralize_matrix,
    'Subarray with Maximum Sum': subarray_with_maximum_sum,
    'Total Ways to Sum': total_ways_to_sum_1,
    'Total Ways to Sum II': total_ways_to_sum_2,
    // 'Unique Paths in a Grid I':,
    // 'Unique Paths in a Grid II':,
}
export { SOLUTIONS }
//#endregion

/** @param {NS} ns */
export async function main(ns) {
    // Disable logs
    ns.disableLog("ALL");
    let history = { "success": 0, "fail": 0 };
    let contracts = get_contracts();
    ns.print(contracts);
    if (contracts.length <= 0) { ns.tprint(`${ANSI.fg.cyan}No contracts found.${ANSI.reset}`); return };
    for (let server of Object.keys(contracts)) {
        for (let contract of contracts[server]) {
            let type = ns.codingcontract.getContractType(contract, server);
            if (!Object.keys(SOLUTIONS).includes(type)) { ns.tprint(`${ANSI.fg.yellow}${type} does not exist (${server}).${ANSI.reset}`); continue };
            let data_in = ns.codingcontract.getData(contract, server);
            let result = SOLUTIONS[type](data_in);
            let reward = ns.codingcontract.attempt(result, contract, server);
            if (reward) {
                if (!reward.includes("No reward")) {
                    ns.tprint(`${ANSI.fg.green}${type}: ${contract} solved - ${reward}.${ANSI.reset}`)
                } history.success++
            } else { ns.tprint(`${ANSI.fg.red}${type}: Failed to solve ${contract}.\nData: ${data_in}\nResult: ${result}${ANSI.reset}`); history.fail++ };
            await ns.asleep(10)
        }
    }
    if (history.success > 0) { ns.tprint(`${ANSI.fg.green}Completed ${history.success} contracts.${ANSI.reset}`) };
    if (history.fail > 0) { ns.tprint(`${ANSI.fg.red}Failed ${history.fail} contracts.${ANSI.reset}`) };


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