/** @param {NS} ns */
export default function compression_1_rle_compression(data_in) {
    const INPUT = data_in
    let answer = ''
    let i = 0
    for (let i = 0, count = 0; // Starting from the first character
        i < INPUT.length; // Until we've checked the whole message
        i += count) { // Jumping ahead by number of instances of that character
        let char = INPUT[i] // Store the character
        count = 1 // Count the first instance of that character
        while ( // As long as...
            i + count < INPUT.length && // ...we haven't gone past the end of the message and...
            count < 9 && // ...we haven't counted more than 9 of the same character and...
            INPUT[i + count] == char // ...the next character is the same as the current one.
        ) { count++ } // Increment the count of that character.
        answer += `${count}${char}` // Now append this encoding to the answer string and move to the next part.
    }
    return answer
}