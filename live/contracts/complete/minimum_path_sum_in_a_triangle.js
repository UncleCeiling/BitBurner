/** @param {NS} ns */
export default function minimum_path_sum_in_a_triangle(data_in) {
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