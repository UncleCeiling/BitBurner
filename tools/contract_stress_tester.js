/** @param {NS} ns */
export async function main(ns) {
    ns.tail()
    const loops = 10
    let solutions = [
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
    ns.print(solutions)
    for (let i = 0; i < loops; i++) {
        for (let type of solutions) {
            let file = ns.codingcontract.createDummyContract(type)
            ns.print(file)
        }
    }
}