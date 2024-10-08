// query necessary elements
const typeSelect = document.querySelector('#type');
const taskInput = document.querySelector('#task');
const trigger = document.querySelector('#trigger');
const result = document.querySelector('#result');

// empty task input and result on type change and set placeholder
typeSelect.addEventListener('change', (e) => {
    taskInput.value = '';
    const placeholder = e.target.value && db[e.target.value].example
        ? 'e.g.:\n\n' + db[e.target.value].example
        : 'Insert task input data here';
    taskInput.setAttribute('placeholder', placeholder);
    result.innerText = '';
});
// solve task on trigger click
trigger.addEventListener('click', () => {
    const type = typeSelect.value;
    const task = taskInput.value;
    if (type) {
        result.innerText = db[type].solver(task);
    }
});

// list of solver per type
// based on https://github.com/danielyxie/bitburner/blob/master/src/data/codingcontracttypes.ts
let db = {
    largestPrime: {
        name: "Find Largest Prime Factor",
        example: "335045386",
        solver: (data) => {
            let fac = 2;
            let n = data;
            while (n > (fac - 1) * (fac - 1)) {
                while (n % fac === 0) {
                    n = Math.round(n / fac);
                }
                ++fac;
            }
            return (n === 1 ? fac - 1 : n);
        },
    },
    maxSum: {
        name: "Subarray with Maximum Sum",
        example: "-9,3,8,-3,8,-9,-7,7,8,-8,...",
        solver: (data) => {
            data = data.split(',').map(n => parseInt(n));
            const nums = data.slice();
            for (let i = 1; i < nums.length; i++) {
                nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
            }
            return Math.max(...nums);
        },
    },
    waysToSum: {
        name: "Total Ways to Sum",
        example: "37",
        solver: (data) => {
            const ways = [1];
            ways.length = data + 1;
            ways.fill(0, 1);
            for (let i = 1; i < data; ++i) {
                for (let j = i; j <= data; ++j) {
                    ways[j] += ways[j - i];
                }
            }

            return ways[data];
        },
    },
    spiraliceMatrix: {
        name: "Spiralize Matrix",
        example: "[4,31,7,47,23,13,35,30,12,22,28]\n[19,46,7,11,29,23,2,48,45,40,46]\n[25,24,44,33,43,2,15,5,14,9,4]\n[42,35,16,13,44,33,27,50,47,5,37]\n...",
        solver: (data) => {
            data = data.split('\n').map(l => JSON.parse(l));
            const spiral = [];
            const m = data.length;
            const n = data[0].length;
            let u = 0;
            let d = m - 1;
            let l = 0;
            let r = n - 1;
            let k = 0;
            while (true) {
                // Up
                for (let col = l; col <= r; col++) {
                    spiral[k] = data[u][col];
                    ++k;
                }
                if (++u > d) {
                    break;
                }

                // Right
                for (let row = u; row <= d; row++) {
                    spiral[k] = data[row][r];
                    ++k;
                }
                if (--r < l) {
                    break;
                }

                // Down
                for (let col = r; col >= l; col--) {
                    spiral[k] = data[d][col];
                    ++k;
                }
                if (--d < u) {
                    break;
                }

                // Left
                for (let row = d; row >= u; row--) {
                    spiral[k] = data[row][l];
                    ++k;
                }
                if (++l > r) {
                    break;
                }
            }
            return '[' + spiral + ']';
        },
    },
    arrayJump: {
        name: "Array Jumping Game",
        example: "2,0,7,5,7,5,0,10,0,6,0,8,0,4,1,7,10",
        solver: (data) => {
            data = data.split(',').map(n => parseInt(n));
            const n = data.length;
            let i = 0;
            for (let reach = 0; i < n && i <= reach; ++i) {
                reach = Math.max(i + data[i], reach);
            }
            return i === n;
        },
    },
    mergeOverlappingIntervals: {
        name: "Merge Overlapping Intervals",
        example: "[[23,30],[5,10],[9,19],[9,12],[11,20],...]",
        solver: (data) => {
            data = JSON.parse(data);
            const intervals = data.slice();
            intervals.sort((a, b) => {
                return a[0] - b[0];
            });
            const result = [];
            let start = intervals[0][0];
            let end = intervals[0][1];
            for (const interval of intervals) {
                if (interval[0] <= end) {
                    end = Math.max(end, interval[1]);
                } else {
                    result.push([start, end]);
                    start = interval[0];
                    end = interval[1];
                }
            }
            result.push([start, end]);
            return '[' + result.map(e => '[' + e.join(',') + ']').join(',') + ']';
        },
    },
    generateIp: {
        name: "Generate IP Addresses",
        example: "16323010389",
        solver: (data) => {
            const ret = [];
            for (let a = 1; a <= 3; ++a) {
                for (let b = 1; b <= 3; ++b) {
                    for (let c = 1; c <= 3; ++c) {
                        for (let d = 1; d <= 3; ++d) {
                            if (a + b + c + d === data.length) {
                                const A = parseInt(data.substring(0, a), 10);
                                const B = parseInt(data.substring(a, a + b), 10);
                                const C = parseInt(data.substring(a + b, a + b + c), 10);
                                const D = parseInt(data.substring(a + b + c, a + b + c + d), 10);
                                if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
                                    const ip = [A.toString(), ".", B.toString(), ".", C.toString(), ".", D.toString()].join("");
                                    if (ip.length === data.length + 3) {
                                        ret.push(ip);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return '[' + ret.join(',') + ']';
        },
    },
    stockTrader1: {
        name: "Algorithmic Stock Trader I",
        example: "184,173,9,22,194,2,99,141,145,18,30,189,54,43,3,14,...",
        solver: (data) => {
            data = data.split(',').map(n => parseInt(n));
            let maxCur = 0;
            let maxSoFar = 0;
            for (let i = 1; i < data.length; ++i) {
                maxCur = Math.max(0, (maxCur += data[i] - data[i - 1]));
                maxSoFar = Math.max(maxCur, maxSoFar);
            }
            return maxSoFar.toString();
        },
    },
    stockTrader2: {
        name: "Algorithmic Stock Trader II",
        example: "66,60,200,158,70,196,29,...",
        solver: (data) => {
            data = data.split(',').map(n => parseInt(n));
            let profit = 0;
            for (let p = 1; p < data.length; ++p) {
                profit += Math.max(data[p] - data[p - 1], 0);
            }
            return profit.toString();
        },
    },
    stockTrader3: {
        name: "Algorithmic Stock Trader III",
        example: "86,126,188,85,112,77,39,69,...",
        solver: (data) => {
            data = data.split(',').map(n => parseInt(n));
            let hold1 = Number.MIN_SAFE_INTEGER;
            let hold2 = Number.MIN_SAFE_INTEGER;
            let release1 = 0;
            let release2 = 0;
            for (const price of data) {
                release2 = Math.max(release2, hold2 + price);
                hold2 = Math.max(hold2, release1 - price);
                release1 = Math.max(release1, hold1 + price);
                hold1 = Math.max(hold1, price * -1);
            }

            return release2.toString();
        },
    },
    stockTrader4: {
        name: "Algorithmic Stock Trader IV",
        example: "[6, [88,13,160,50,76,136,96,23,72,25,34,73,118]]",
        solver: (data) => {
            data = JSON.parse(data);
            const k = data[0];
            const prices = data[1];
            const len = prices.length;
            if (len < 2) {
                return 0;
            }
            if (k > len / 2) {
                let res = 0;
                for (let i = 1; i < len; ++i) {
                    res += Math.max(prices[i] - prices[i - 1], 0);
                }
                return res;
            }
            const hold = [];
            const rele = [];
            hold.length = k + 1;
            rele.length = k + 1;
            for (let i = 0; i <= k; ++i) {
                hold[i] = Number.MIN_SAFE_INTEGER;
                rele[i] = 0;
            }
            let cur;
            for (let i = 0; i < len; ++i) {
                cur = prices[i];
                for (let j = k; j > 0; --j) {
                    rele[j] = Math.max(rele[j], hold[j] + cur);
                    hold[j] = Math.max(hold[j], rele[j - 1] - cur);
                }
            }
            return rele[k];
        },
    },
    minTrianglePath: {
        name: "Minimum Path Sum in a Triangle",
        example: "",
        solver: (data) => {
            data = JSON.parse(data);
            const n = data.length;
            const dp = data[n - 1].slice();
            for (let i = n - 2; i > -1; --i) {
                for (let j = 0; j < data[i].length; ++j) {
                    dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j];
                }
            }
            return dp[0];
        },
    },
    uniqueGridPaths1: {
        name: "Unique Paths in a Grid I",
        example: "[9, 14]",
        solver: (data) => {
            data = JSON.parse(data);
            const n = data[0]; // Number of rows
            const m = data[1]; // Number of columns
            const currentRow = [];
            currentRow.length = n;
            for (let i = 0; i < n; i++) {
                currentRow[i] = 1;
            }
            for (let row = 1; row < m; row++) {
                for (let i = 1; i < n; i++) {
                    currentRow[i] += currentRow[i - 1];
                }
            }
            return currentRow[n - 1];
        },
    },
    uniqueGridPaths2: {
        name: "Unique Paths in a Grid II",
        example: "0,0,0,0,0,0,0,1,0,0,1,0,\n1,0,0,0,0,0,0,0,0,1,0,0,\n...",
        solver: (data) => {
            data = data.split('\n').map(l => l.slice(0, -1).split(','));
            const obstacleGrid = [];
            obstacleGrid.length = data.length;
            for (let i = 0; i < obstacleGrid.length; ++i) {
                obstacleGrid[i] = data[i].slice();
            }
            for (let i = 0; i < obstacleGrid.length; i++) {
                for (let j = 0; j < obstacleGrid[0].length; j++) {
                    if (obstacleGrid[i][j] == 1) {
                        obstacleGrid[i][j] = 0;
                    } else if (i == 0 && j == 0) {
                        obstacleGrid[0][0] = 1;
                    } else {
                        obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i - 1][j] : 0) + (j > 0 ? obstacleGrid[i][j - 1] : 0);
                    }
                }
            }
            return obstacleGrid[obstacleGrid.length - 1][obstacleGrid[0].length - 1];
        },
    },
    sanitizeParantheses: {
        name: "Sanitize Parentheses in Expression",
        example: "((()(()((aa())",
        solver: (data) => {
            let left = 0;
            let right = 0;
            const res = [];

            for (let i = 0; i < data.length; ++i) {
                if (data[i] === "(") {
                    ++left;
                } else if (data[i] === ")") {
                    left > 0 ? --left : ++right;
                }
            }

            function dfs(
                pair,
                index,
                left,
                right,
                s,
                solution,
                res,
            ) {
                if (s.length === index) {
                    if (left === 0 && right === 0 && pair === 0) {
                        for (let i = 0; i < res.length; i++) {
                            if (res[i] === solution) {
                                return;
                            }
                        }
                        res.push(solution);
                    }
                    return;
                }

                if (s[index] === "(") {
                    if (left > 0) {
                        dfs(pair, index + 1, left - 1, right, s, solution, res);
                    }
                    dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
                } else if (s[index] === ")") {
                    if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
                    if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
                } else {
                    dfs(pair, index + 1, left, right, s, solution + s[index], res);
                }
            }
            dfs(0, 0, left, right, data, "", res);
            return '[' + res + ']';
        },
    },
    validMath: {
        name: "Find All Valid Math Expressions",
        example: "['35474004', 82]",
        solver: (data) => {
            data = JSON.parse(data);
            const num = data[0];
            const target = data[1];

            function helper(
                res,
                path,
                num,
                target,
                pos,
                evaluated,
                multed,
            ) {
                if (pos === num.length) {
                    if (target === evaluated) {
                        res.push(path);
                    }
                    return;
                }

                for (let i = pos; i < num.length; ++i) {
                    if (i != pos && num[pos] == "0") {
                        break;
                    }
                    const cur = parseInt(num.substring(pos, i + 1));

                    if (pos === 0) {
                        helper(res, path + cur, num, target, i + 1, cur, cur);
                    } else {
                        helper(res, path + "+" + cur, num, target, i + 1, evaluated + cur, cur);
                        helper(res, path + "-" + cur, num, target, i + 1, evaluated - cur, -cur);
                        helper(res, path + "*" + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur);
                    }
                }
            }
            if (num == null || num.length === 0) {
                return 0;
            }

            const result = [];
            helper(result, "", num, target, 0, 0, 0);
            return '[' + result + ']';
        },
    },
};

// initially load all task types
for (const type in db) {
    const { name } = db[type];
    let option = document.createElement("option");
    option.value = type;
    option.innerText = name;
    typeSelect.append(option);
}