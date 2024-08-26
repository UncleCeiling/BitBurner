# Contracts

## List

```[
"Find Largest Prime Factor",
"Subarray with Maximum Sum",
"Total Ways to Sum","Total Ways to Sum II",
"Spiralize Matrix",
"Array Jumping Game",
"Array Jumping Game II",
"Merge Overlapping Intervals",
"Generate IP Addresses",
"Algorithmic Stock Trader I",
"Algorithmic Stock Trader II",
"Algorithmic Stock Trader III",
"Algorithmic Stock Trader IV",
"Minimum Path Sum in a Triangle",
"Unique Paths in a Grid I",
"Unique Paths in a Grid II",
"Shortest Path in a Grid",
"Sanitize Parentheses in Expression",
"Find All Valid Math Expressions",
"HammingCodes: Integer to Encoded Binary",
"HammingCodes: Encoded Binary to Integer",
"Proper 2-Coloring of a Graph",
"Compression I: RLE Compression",
"Compression II: LZ Decompression",
"Compression III: LZ Compression",
"Encryption I: Caesar Cipher",
"Encryption II: Vigenère Cipher"
]```

## API

Namespace: `ns.codingcontract`

| Method | Description |
|-|-|
| `attempt(answer, filename, host)` | Attempts a coding contract, returning a reward string on success or empty string on failure. |
| `createDummyContract(type)` | Generate a dummy contract. |
| `getContractType(filename, host)` | Get the type of a coding contract. |
| `getContractTypes()` | List all contract types. |
| `getData(filename, host)` | Get the input data. |
| `getDescription(filename, host)` | Get the description. |
| `getNumTriesRemaining(filename, host)` | Get the number of attempts remaining. |

## Solutions

### Merge Overlapping Intervals

You are attempting to solve a Coding Contract. You have 15 tries remaining, after which the contract will self-destruct.

Given the following array of arrays of numbers representing a list of intervals, merge all overlapping intervals.

[[9,14],[14,21],[13,17],[23,27],[6,13],[6,10],[9,11],[23,31],[1,11]]

Example:

[[1, 3], [8, 10], [2, 6], [10, 16]]

would merge into [[1, 6], [8, 16]].

The intervals must be returned in ASCENDING order. You can assume that in an interval, the first number will always be smaller than the second.

If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.

___

1. Sort intervals so lowest interval at the start.
2. Compare each interval with the first.
    - If the smallest item of the next interval is less than or equal to the largest item in the first interval; Make the first interval's largest value the same as the largest value in both intervals.
    - Otherwise, add the first interval to a "Results list" and set the next interval as the interval being compared to.
3. When there are no more comparisons, add the final interval to the results.
4. Output

### Encryption I: Caesar Cipher

You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.

Caesar cipher is one of the simplest encryption technique. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. For example, with a left shift of 3, D would be replaced by A, E would become B, and A would become X (because of rotation).

You are given an array with two elements:
  ["TABLE DEBUG LOGIN PASTE CLOUD", 1]
The first element is the plaintext, the second element is the left shift value.

Return the ciphertext as uppercase string. Spaces remains the same.

If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.

___

1. Create Arrays for Alphabet, Input message and Output message
2. For each character in Input message, find index position in Alphabet
3. Index - Left-shift value = new index
4. New index into output message
5. Join Output message
6. Output

### Proper 2-Coloring of a Graph (WIP - omega-net - contract-468024.cct)

### Find Largest Prime Factor (WIP - snap-fitness - contract-829165-CyberSec.cct)

You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.

A prime factor is a factor that is a prime number. What is the largest prime factor of 897014657?

If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.

### Compression I: RLE Compression (WIP - megacorp - contract-730228.cct)
