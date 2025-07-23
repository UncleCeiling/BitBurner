/** @param {NS} ns */
export default function sanitize_parentheses_in_expression(data_in) {
    const INPUT = data_in // Take data
    if (check_valid(INPUT)) { return [INPUT] } // Check to see if the input is valid, if so, return it
    let results = []// Build other variables, and calculate char totals
    let total_chars = INPUT.length
    let parenthesis_chars = INPUT.match(/\(|\)/g).length // match() contains regexp: / \( | \) /g = open-bracket OR closed-bracket, globally (/ indicates start/end of regexp, \ is escape character)
    let non_parenthesis_chars = total_chars - parenthesis_chars
    let variations = new Set()
    variations.add(INPUT)
    for (let i = total_chars; i > 0; i--) { // Start a countdown from total number of characters
        if (i == non_parenthesis_chars || i < 2) { return [INPUT.replace(/\(|\)/g, '')] } // If no parenthesis left (or only 1 character), return the INPUT with () stripped out
        let generated = new Set() // Generate new variants for each variant currently stored
        for (let variant of variations) {
            variations.delete(variant)
            let variants = gen_variants(variant) // Add the generated variants to set of generated items
            for (let item of variants) { generated.add(item) }
        }
        for (let item of generated) { // check if any generated items are valid and push them to the results array. Otherwise, push them to variants.
            if (check_valid(item)) { results.push(item) }
            else { variations.add(item) }
        }
        if (results.length > 0) { return results } // If there are any valid results, return them
    }

    function gen_variants(string) {
        let variations = []
        for (let char in string) { // Generate a variant for each possible character
            if (!string[char].includes('(') && !string[char].includes(')')) { continue } // Skip stuff that isn't '(' or ')'
            let array = string.split('')// Do some array voodoo to remove the character
            array.splice(char, 1)
            let variant = array.join('')
            variations.push(variant)// Push the resulting variant to the output (joined as a string)
        }
        return variations
    }

    function check_valid(string) {
        let unclosed = 0 // Start a counter for unclosed parenthesis
        for (let char of string) { // Work through each character from the start
            if (char == '(') { unclosed++ } // +1 for every Parenthesis opened, -1 for every closure.
            else if (char == ')') { unclosed-- }
            if (unclosed < 0) { return false } // If we ever go negative, it means we've closed a non-existant Parenthesis, so automatic fail.
        }
        if (unclosed == 0) { return true } else { return false } // If no Parenthesis are left unclosed, output true
    }
}