/** @param {NS} ns */
/**
 * Given some plaintext and a shift value, returns a Caesar-shifted version of that text.
 * @param {[String,Number]} data_in An array containing the Unencrypted Cipher-text and the value of the Caesar shift.
 * @returns {String} Encrypted Cipher-text
 */
export default function encryption_1_caesar_cipher(data_in) {
    const INPUT = data_in[0]; // Take message to encrypt
    const SHIFT = data_in[1]; // Take caesar shift value (left-shift)
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var output = '';
    for (let char of INPUT) { // For each character
        let char_index = ALPHABET.indexOf(char); // Check what letter of the alphabet it is
        if (char_index < 0) { output += char; continue }; // If character not in the alphabet, add it and move on
        char_index -= SHIFT; // Apply the caesar shift
        if (char_index < 0) { char_index += 26 }; // If we've gone past 0, add 26 to loop back around
        output += ALPHABET[char_index]; // Now we can add the character to the output
    };
    return output
}