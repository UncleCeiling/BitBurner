/**
 * 
 * @param {[String,String]} data_in
 * @returns {String} Ciphertext as Uppercase string
 */
export default function encryption_2_vigenere_cipher(data_in) {
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const PLAINTEXT = data_in[0];
    const KEYWORD = data_in[1];
    let ciphertext = "";
    for (let i = 0; i < PLAINTEXT.length; i++) { ciphertext += caesar_shift(PLAINTEXT[i], KEYWORD[i % KEYWORD.length]) }
    return ciphertext

    function caesar_shift(letter, shift_amount) {
        let ciphered = ALPHABET.indexOf(letter) + ALPHABET.indexOf(shift_amount);
        if (ciphered >= 26) { ciphered -= 26 };
        return ALPHABET[ciphered]
    }
}