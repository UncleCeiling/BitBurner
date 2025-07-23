/** @param {NS} ns */
export default function spiralize_matrix(data_in) {
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