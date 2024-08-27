# Contracts

## ToDo List

[/] ["Find Largest Prime Factor"](#find-largest-prime-factor)  
[ ] ["Subarray with Maximum Sum"](#subarray-with-maximum-sum)  
[ ] ["Total Ways to Sum"](#total-ways-to-sum)  
[/] ["Total Ways to Sum II"](#total-ways-to-sum-ii)  
[/] ["Spiralize Matrix"](#spiralize-matrix)  
[/] ["Array Jumping Game"](#array-jumping-game)  
[/] ["Array Jumping Game II"](#array-jumping-game-ii)  
[/] ["Merge Overlapping Intervals"](#merge-overlapping-intervals)  
[ ] ["Generate IP Addresses"](#generate-ip-addresses)  
[ ] ["Algorithmic Stock Trader I"](#algorithmic-stock-trader-i)  
[ ] ["Algorithmic Stock Trader II"](#algorithmic-stock-trader-ii)  
[ ] ["Algorithmic Stock Trader III"](#algorithmic-stock-trader-iii)  
[ ] ["Algorithmic Stock Trader IV"](#algorithmic-stock-trader-iv)  
[/] ["Minimum Path Sum in a Triangle"](#minimum-path-sum-in-a-triangle)  
[ ] ["Unique Paths in a Grid I"](#unique-paths-in-a-grid-i)  
[ ] ["Unique Paths in a Grid II"](#unique-paths-in-a-grid-ii)  
[/] ["Shortest Path in a Grid"](#shortest-path-in-a-grid)  
[ ] ["Sanitize Parentheses in Expression"](#sanitize-parentheses-in-expression)  
[ ] ["Find All Valid Math Expressions"](#find-all-valid-math-expressions)  
[ ] ["HammingCodes: Integer to Encoded Binary"](#hammingcodes-integer-to-encoded-binary)  
[ ] ["HammingCodes: Encoded Binary to Integer"](#hammingcodes-encoded-binary-to-integer)  
[/] ["Proper 2-Coloring of a Graph"](#proper-2-coloring-of-a-graph)  
[/] ["Compression I: RLE Compression"](#compression-i-rle-compression)  
[ ] ["Compression II: LZ Decompression"](#compression-ii-lz-decompression)  
[ ] ["Compression III: LZ Compression"](#compression-iii-lz-compression)  
[/] ["Encryption I: Caesar Cipher"](#encryption-i-caesar-cipher)  
[ ] ["Encryption II: Vigenère Cipher"](#encryption-ii-vigenère-cipher)  

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

### "Find Largest Prime Factor"

A prime factor is a factor that is a prime number. What is the largest prime factor of 897014657?

___

1. Check if each possible factor is a factor.
2. If it's a factor, check if it (and it's compliment) are primes.
3. If they are, add them to a set.
4. Check for the largest item in that set by the end.

### "Subarray with Maximum Sum"

### "Total Ways to Sum"

### "Total Ways to Sum II"

How many different distinct ways can the number 96 be written as a sum of integers contained in the set:

[4,5,6,8,14,15,17,19]?

You may use each integer in the set zero or more times.

___

1. Check each index for possible combinations recursively
2. Propagate the result up from the last index's call, returning values all the way to the top
3. Output

### "Spiralize Matrix"

Given the following array of arrays of numbers representing a 2D matrix, return the elements of the matrix as an array in spiral order:

    [
        [12,19,12, 2,35,36,18,48,14]
        [13,27,50,50,14,15, 3,15, 2]
        [45, 4, 9,15,23,31,37, 1,36]
        [38,22,42, 1, 9,43, 3,31,48]
        [ 7,33,31,44,24,48,14,29,31]
        [33,13,26,16, 5, 8,12, 5,33]
        [ 5,40,32,16,40,32,36, 2,11]
        [40, 8, 1, 6,24,37,28,25,38]
        [10,24,29,18,26, 5,37, 7,39]
    ]

Here is an example of what spiral order should be:

    [
        [1, 2, 3]
        [4, 5, 6]
        [7, 8, 9]
    ]

Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]

Note that the matrix will not always be square:

    [
        [1,  2,  3,  4]
        [5,  6,  7,  8]
        [9, 10, 11, 12]
    ]

Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

___

1. Record the number of rows and columns and make a destructible version of the matrix
2. Strip the top row, right column, bottom row and left column into an array one by one until matrix is empty
3. Output

### "Array Jumping Game"

You are given the following array of integers:

1,9,8,0,3,10,0,5,10,0

Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n.

Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last index.

Your answer should be submitted as 1 or 0, representing true and false respectively.

___

1. For each jump available to the left-most index, check all the jumps therein, starting from the longest jump.
2. If any chain of jumps reaches the last index, flag and break.
3. If all jumps fall short, flag.
4. Check flag and output accordingly.

### "Array Jumping Game II"

You are given the following array of integers:

1,2,4,2,7,5,5,3,3,4,0,3,3,4,2,2,1,1

Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n.

Assuming you are initially positioned at the start of the array, determine the minimum number of jumps to reach the end of the array.

If it's impossible to reach the end, then the answer should be 0.

___

1. Make a jump counter
2. Starting at index 0, look at all possible jumps and try the largest value (if both are the same, pick the one with the furthest reach).
3. Increment jump counter
4. Repeat until win or highest index is 0

### "Merge Overlapping Intervals"

Given the following array of arrays of numbers representing a list of intervals, merge all overlapping intervals.

[[9,14],[14,21],[13,17],[23,27],[6,13],[6,10],[9,11],[23,31],[1,11]]

Example:

[[1, 3], [8, 10], [2, 6], [10, 16]]

would merge into [[1, 6], [8, 16]].

The intervals must be returned in ASCENDING order. You can assume that in an interval, the first number will always be smaller than the second.

___

1. Sort intervals so lowest interval at the start.
2. Compare each interval with the first.
    - If the smallest item of the next interval is less than or equal to the largest item in the first interval; Make the first interval's largest value the same as the largest value in both intervals.
    - Otherwise, add the first interval to a "Results list" and set the next interval as the interval being compared to.
3. When there are no more comparisons, add the final interval to the results.
4. Output

### "Generate IP Addresses"

### "Algorithmic Stock Trader I"

### "Algorithmic Stock Trader II"

### "Algorithmic Stock Trader III"

### "Algorithmic Stock Trader IV"

### "Minimum Path Sum in a Triangle"

Given a triangle, find the minimum path sum from top to bottom. In each step of the path, you may only move to adjacent numbers in the row below. The triangle is represented as a 2D array of numbers:

[
      [8],
     [7,9],
    [3,8,1],
   [1,1,5,3],
  [8,5,2,3,2]
]

Example: If you are given the following triangle:

[
     [2],
    [3,4],
   [6,5,7],
  [4,1,8,3]
]

The minimum path sum is 11 (2 -> 3 -> 5 -> 1).

___

1. Make an empty Triangle
2. From the bottom row,for each pair in the row, calculate the lowest possible cost by adding the lowest number to the value above it.
3. Get the index of the lowest value for each row from the top down
4. Translate indices to original triangle
5. Output

### "Unique Paths in a Grid I"

### "Unique Paths in a Grid II"

### "Shortest Path in a Grid"

You are located in the top-left corner of the following grid:

  [[0,0,0,0,1,1,1,1],
   [0,0,0,0,1,1,1,0],
   [0,0,0,0,0,1,1,0],
   [0,0,0,1,1,0,1,0],
   [0,1,0,0,0,0,0,0],
   [1,1,1,0,0,0,0,0],
   [0,0,0,0,0,0,0,0]]

You are trying to find the shortest path to the bottom-right corner of the grid, but there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

Determine the shortest path from start to finish, if one exists. The answer should be given as a string of UDLR characters, indicating the moves along the path

NOTE: If there are multiple equally short paths, any of them is accepted as answer. If there is no path, the answer should be an empty string.
NOTE: The data returned for this contract is an 2D array of numbers representing the grid.

Examples:

  [[0,1,0,0,0],
   [0,0,0,1,0]]

Answer: 'DRRURRD'

  [[0,1],
   [1,0]]

Answer: ''

___

1. Starting from the finish, check for valid squares around the square of interest.
2. Add the appropriate direction to each valid square and add that square to a queue.
3. Work through the queue making the same check until you either run out of options (no route) or reach 0,0 (route found)
4. Read the directions off the grid into a path.
5. Output the path

### "Sanitize Parentheses in Expression"

### "Find All Valid Math Expressions"

### "HammingCodes: Integer to Encoded Binary"

### "HammingCodes: Encoded Binary to Integer"

### "Proper 2-Coloring of a Graph"

You are given the following data, representing a graph:

[10,[[3,8],[0,6],[0,2],[5,9],[0,5],[3,9],[1,2],[2,3],[1,9],[3,5],[3,4],[1,5]]]

Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or plotting. The first element of the data represents the number of vertices in the graph. Each vertex is a unique number between 0 and 9. The next element of the data represents the edges of the graph. Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v]. Note that an edge [u,v] is the same as an edge [v,u], as order does not matter. You must construct a 2-coloring of the graph, meaning that you have to assign each vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have the same color. Submit your answer in the form of an array, where element i represents the color of vertex i. If it is impossible to construct a 2-coloring of the given graph, instead submit an empty array.

Examples:

Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
Output: [0, 0, 1, 1]

Input: [3, [[0, 1], [0, 2], [1, 2]]]
Output: []

___

1. Create an empty results array
2. Pick an edge
3. If both vertices on the edge are uncoloured, colour them and add them to the front of the queue
4. If only 1 is coloured, colour the opposite one the opposite colour and add it to the front of the queue.
5. If both are coloured the same, the graph is impossible to colour, raise a flag and break.
6. Output

### "Compression I: RLE Compression"

Run-length encoding (RLE) is a data compression technique which encodes data as a series of runs of a repeated single character. Runs are encoded as a length, followed by the character itself. Lengths are encoded as a single ASCII digit; runs of 10 characters or more are encoded by splitting them into multiple runs.

You are given the following input string:
    KKhhhhhr1bbggggggggggg88888888888888bbbbbbbbXuutJJXXXXXXXXX7777777777777jjj44Z
Encode it using run-length encoding with the minimum possible output length.

Examples:
    aaaaabccc            ->  5a1b3c
    aAaAaA               ->  1a1A1a1A1a1A
    111112333            ->  511233
    zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)

___

1. Until you reach the end of the message, take the first character of a run and set the run length to 1.
2. Check that the next character after the run is the same, that the run is not longer than 9 and check to see if you've reached the end of the message.
3. If character is the same and the run is shorter than 9, increment the run length and repeat.
4. Otherwise, add the length and character to the output and move to the beginning of the next run.

### "Compression II: LZ Decompression"

### "Compression III: LZ Compression"

### "Encryption I: Caesar Cipher"

Caesar cipher is one of the simplest encryption technique. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. For example, with a left shift of 3, D would be replaced by A, E would become B, and A would become X (because of rotation).

You are given an array with two elements:
  ["TABLE DEBUG LOGIN PASTE CLOUD", 1]
The first element is the plaintext, the second element is the left shift value.

Return the ciphertext as uppercase string. Spaces remains the same.

___

1. Create Arrays for Alphabet, Input message and Output message
2. For each character in Input message, find index position in Alphabet
3. Index - Left-shift value = new index
4. New index into output message
5. Join Output message
6. Output

### "Encryption II: Vigenère Cipher"

## Sources

[Drakmyth GitHub](https://github.com/Drakmyth/BitburnerScripts/tree/master/src/contracts)

[Cappinator Github](https://github.com/Cappinator/bitburner-scripts/tree/main/contracts)

[Devmount app Github](https://github.com/devmount/bitburner-contract-solver/blob/main/app.js)

[Web Contract Solver](https://devmount.github.io/bitburner-contract-solver/)
