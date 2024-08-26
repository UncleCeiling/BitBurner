input = [
    [9, 14],
    [14, 21],
    [13, 17],
    [23, 27],
    [6, 13],
    [6, 10],
    [9, 11],
    [23, 31],
    [1, 11],
]

example_input = [[1, 3], [8, 10], [2, 6], [10, 16]]
example_output = [[1, 6], [8, 16]]

line = set()
for pair in example_input:
    pair_range = list(range(pair[0], pair[1] + 1))
    print(pair_range)
