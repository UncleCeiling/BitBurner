# Contracts

## List

```pseudo
[
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
]
```

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

### Proper 2-Coloring of a Graph

You are given the following data, representing a graph:

[10,[[3,8],[0,6],[0,2],[5,9],[0,5],[3,9],[1,2],[2,3],[1,9],[3,5],[3,4],[1,5]]]

Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or plotting. The first element of the data represents the number of vertices in the graph. Each vertex is a unique number between 0 and 9. The next element of the data represents the edges of the graph. Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v]. Note that an edge [u,v] is the same as an edge [v,u], as order does not matter. You must construct a 2-coloring of the graph, meaning that you have to assign each vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have the same color. Submit your answer in the form of an array, where element i represents the color of vertex i. If it is impossible to construct a 2-coloring of the given graph, instead submit an empty array.

Examples:

Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
Output: [0, 0, 1, 1]

Input: [3, [[0, 1], [0, 2], [1, 2]]]
Output: []

If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.

___

1. Create an empty results array
2. Pick an edge
3. If both vertices on the edge are uncoloured, colour them and add them to the front of the queue
4. If only 1 is coloured, colour the opposite one the opposite colour and add it to the front of the queue.
5. If both are coloured the same, the graph is impossible to colour, raise a flag and break.
6. Output

### Find Largest Prime Factor

You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.

A prime factor is a factor that is a prime number. What is the largest prime factor of 897014657?

If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.

___

1. Check if each possible factor is a factor.
2. If it's a factor, check if it (and it's compliment) are primes.
3. If they are, add them to a set.
4. Check for the largest item in that set by the end.

### Array Jumping Game (WIP - nwo - contract-41675-Netburners.cct)

You are attempting to solve a Coding Contract. You have 1 tries remaining, after which the contract will self-destruct.

You are given the following array of integers:

1,9,8,0,3,10,0,5,10,0

Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n.

Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last index.

Your answer should be submitted as 1 or 0, representing true and false respectively.

If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.
___

1. For each jump available to the left-most index, check all the jumps therein, starting from the longest jump.
2. If any chain of jumps reaches the last index, flag and break.
3. If all jumps fall short, flag.
4. Check flag and output accordingly.
