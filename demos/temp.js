/** @param {NS} ns */
export async function main(ns) {
    ns.tail(); ns.disableLog('ALL')
    let array = ['this', 'that', 'the other']
    let random = Math.random() 								// Pick a random num between 0 & 1
    let scaled_random = random * array.length // Scale this random number by the size of our array 
    let index = Math.floor(scaled_random) 		// Round down (1.22135414 is not a usable index)
    ns.print(array[index])
}