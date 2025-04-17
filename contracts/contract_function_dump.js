function sanitize_parentheses(data_in) {
    // Take data
    const INPUT = data_in
    // Check to see if the input is valid, if so, return it
    if (check_valid(INPUT)) { return [INPUT] }
    // Build other variables, and calculate char totals
    let results = []
    let total_chars = INPUT.length
    let parenthesis_chars = INPUT.match(/\(|\)/g).length // match() contains regexp: / \( | \) /g = open-bracket OR closed-bracket, globally (/ indicates start/end of regexp, \ is escape character)
    let non_parenthesis_chars = total_chars - parenthesis_chars
    let variations = new Set()
    variations.add(INPUT)
    // Start a countdown from total number of characters
    for (let i = total_chars; i > 0; i--) {
        // If no parenthesis left (or only 1 character), return the INPUT with () stripped out
        if (i == non_parenthesis_chars || i < 2) { return [INPUT.replace(/\(|\)/g, '')] }
        // Generate new variants for each variant currently stored
        let generated = new Set()
        for (let variant of variations) {
            variations.delete(variant)
            // Add the generated variants to set of generated items
            let variants = gen_variants(variant)
            for (let item of variants) { generated.add(item) }
        }
        // check if any generated items are valid and push them to the results array. Otherwise, push them to variants.
        for (let item of generated) {
            if (check_valid(item)) { results.push(item) }
            else { variations.add(item) }
        }
        // If there are any valid results, return them
        if (results.length > 0) { return results }
    }

    function gen_variants(string) {
        // Create variable to store output 
        let variations = []
        // Generate a variant for each possible character
        for (let char in string) {
            // Skip stuff that isn't '(' or ')'
            if (!string[char].includes('(') && !string[char].includes(')')) { continue }
            // Do some array voodoo to remove the character
            let array = string.split('')
            array.splice(char, 1)
            let variant = array.join('')
            // Push the resulting variant to the output (joined as a string)
            variations.push(variant)
        }
        return variations
    }

    function check_valid(string) {
        // Start a counter for unclosed parenthesis
        let unclosed = 0
        // Work through each character from the start
        for (let char of string) {
            // +1 for every Parenthesis opened, -1 for every closure.
            if (char == '(') { unclosed++ }
            else if (char == ')') { unclosed-- }
            // If we ever go negative, it means we've closed a non-existant Parenthesis, so automatic fail.
            if (unclosed < 0) { return false }
        }
        // If no Parenthesis are left unclosed, output true
        if (unclosed == 0) { return true } else { return false }
    }
}
