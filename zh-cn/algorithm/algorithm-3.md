# 第三节 集合

## No.1 笛卡尔积 - 多集合结果

定义: 两个集合X和Y的笛卡尔积,又称直积,在集合论中表示为X * Y,是所有可能的有序对组成的集合.其中有序对的第一个对象是X的成员,第二个对象是Y的成员.

举个实例:如果集合X是10个元素点数集合{1,2,3,4,5,6,7,8,9,10},而集合Y是2个元素的性别集合{男,女},这两个集合的笛卡尔积是有20个元素的集合.

```js
function cartesianProduct(setA, setB) {
    if (!setA || !setB || !setA.length || !setB.length) {
        return null;
    }
    const product = [];
    for (let indexA = 0; indexA < setA.length; indexA += 1) {
        for (let indexB = 0; indexB < setB.length; indexB += 1) {
            product.push([setA[indexA], setB[indexB]]);
        }
    }
    return product;
}
const setA = [1,2,3,4,5,6,7,8,9,10];
const setB = ["男", "女"];
cartesianProduct(setA, setB); // [[1,"男"],[1,"女"],...]
```

## No.2 幂集 - 该集合的所有子集

> 原集合中所有的子集(包括全集和空集)构成的集族.

```js
/**
 * @param {*[]} orriginalSet 原始幂集的元素
 * @param {*[][]} allSubsets 到目前形成的所有子集
 * @param {*[]} currentSubSet 当前的子集
 * @param {number} startAt 最初的位置
 */
function btPowerSetRecursive(originalSet, allSubsets=[[]], currentSubSet = [], startAt = 0) {
    // 为了避免重复,每次形成一个子集,
    for (let position = startAt; position < originalSet.length; position += 1) {
        // 构造当前元素的子集
        currentSubSet.push(originalSet[position]);
        // 记录已经存在的有效子集
        allSubsets.push([...currentSubSet]);
        // 继续递归
        btPowerSetRecursive(originalSet, allSubsets, currentSubSet, position + 1);
        // 排除最后一个元素的子集
        currentSubSet.pop();
    }
    // 返回所有子集
    return allSubsets;
}
function btPowerSet(originalSet) {
    return btPowerSetRecursive(originalSet);
}
btPowerSet(["a", "b", "c"]); // [[], ["a"], ["a", "b"], ["a", "b", "c"], ["a", "c"], ["b"], ["b", "c"], ["c"]]
```

* 使用位运算求幂集

```js
/**
 * @param {*[]} originalSet
 * @return [*[][]]
 */
function powerSet(originalSet) {
    const subSets = [];
    const numberOfCombinations = 2 ** originalSet.length;

    // 每个数字的二进制表示在一个范围从0到2的n次方
    for (let combinationIndex = 0; combinationIndex < numberOfCombinations; combinationIndex += 1) {
        const subSet = [];
        for (let setElementIndex = 0; setElementIndex < originalSet.length; setElementIndex += 1) {
            // 判断是否需要包含当前元素的子集
            if (combinationIndex & (1 << setElementIndex)) {
                subSet.push(originalSet[setElementIndex]);
            }
        }
        subSets.push(subSet);
    }
    return subSets;
}
powerSet(["a", "b", "c"]); // [[], ["a"], ["a", "b"], ["a", "b", "c"], ["a", "c"], ["b"], ["b", "c"], ["c"]]
```

## No.3 排列 (有/无重复)

定义: 从n个不同元素中取出m个元素,按照一定的顺序排成一列,叫做从n个元素中取出m个元素的一个排列,当m=n时,这个排列为全排列.

公式: p(n,m) = n! / (n-m)!

```js
/**
 * @param {*[]} permutationOptions 排列项
 * @param {number} permutationLength 排列长度
 * @return {*[]}
 */
function permutateWithRepetitions(
    permutationOptions,
    permutationLength = permutationOptions.length
) {
    if (permutationLength === 1) {
        return permutationOptions.map(permutationOption => [permutationOptions]);
    }
    // 初始化一个排列数组
    const permutations = [];

    // 遍历所有选项,并将其加入到一个小排列中
    permutationOptions.forEach((currentOption) => {
        const smallerPermutations = permutateWithRepetitions(permutationOptions, permutationLength - 1);
        smallerPermutations.forEach((smallerPermutation) => {
            permutations.push([currentOption].concat(smallerPermutation));
        });
    });
    return permutations;
}
permutateWithRepetitions(["a", "b"], 2);  // [["a", ["a", "b"]], ["a", ["a", "b"]], ["b", ["a", "b"]], ["b", ["a", "b"]]]
```

// 去重排列

```js
/**
 * @param {*[]} permutationOptions
 * @param {*[]}
 */
function permutateWithoutRepetitions(permutationOptions) {
    if (permutationOptions.length === 1) {
        return [permutationOptions];
    }
    // 初始化排列数组
    const permutations = [];

    // 得到所有permutationOptions除第一个元素外的排列
    const smallerPermutations = permutateWithoutRepetitions(permutationOptions.slice(1));

    // 第一个选项插入到小排列的所有可能位置
    const firstOption = permutationOptions[0];

    for (let permIndex = 0; permIndex < smallerPermutations.length; permIndex += 1) {
        const smallerPermutation = smallerPermutations[permIndex];
        for (let positionIndex = 0; positionIndex <= smallerPermutation.length; positionIndex += 1) {
            const permutationPrefix = smallerPermutation.slice(0, positionIndex);
            const permutationSuffix = smallerPermutation.slice(positionIndex);
            permutations.push(permutationPrefix.concat([firstOption], permutationSuffix));
        }
    }
    return permutations;
}
permutateWithoutRepetitions(["a", "b"]); // [["a", "b"], ["b", "a"]]
```

## No.4 组合(有无重复)

定义: 从n个不同的元素中,任取m个元素为一组,叫作从n个不同元素中取出m个元素的一个组合.我们把有关求组合的个数的问题叫组合问题.

重复组合公式: C(m,n) = m!/n!(m-n)!

非重复组合公式: H(m,n) = (n+m-1)!/m!(n-1)!

```js
function combineWithRepetitions(comboOptions, comboLength) {
    if (comboLength === 1) {
        return comboOptions.map(comboOption => [comboOption]);
    }
    // 初始化一个组合数组
    const combos = [];

    comboOptions.forEach((currentOption, optionIndex) => {
        const smallerCombos = combineWithRepetitions(
            comboOptions.slice(optionIndex),
            comboLength - 1
        );
        smallerCombos.forEach((smallerCombo) => {
            combos.push([currentOption].concat(smallerCombo));
        });
    });
    return combos;
}
combineWithRepetitions(["a", "b"], 2); // [["a", "a"], ["b", "b"], ["a", "b"]]
```

非重复组合:

```js
function combineWithoutRepetitions(comboOptions, comboLength) {
    if (comboLength === 1) {
        return comboOptions.map(comboOption => [comboOption]);
    }

    // 初始化一个组合数组
    const combos = [];

    comboOptions.forEach((currentOption, optionIndex) => {
        const smallerCombos = combineWithoutRepetitions(
            comboOptions.slice(optionIndex + 1),
            comboLength - 1
        );
        smallerCombos.forEach((smallerCombo) => {
            combos.push([currentOption].concat(smallerCombo));
        });
    });
    return combos;
}
combineWithoutRepetitions(["a", "b"], 2); ["a", "b"]
```

## No.5 洗牌算法 - 随机置换有限序列

洗牌算法是常见的随机问题,它可以抽象成:得到一个M以内的所有自然数的随机顺序数组.

```js
/**
 * @param {*[]} originalArray
 * @return {*[]}
 */
function fisherYates(originalArray) {
    // 克隆一个原始数组,防止原始数组修改
    const array = originalArray.slice(0);
    for (let i = (array.length - 1); i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}
fisherYates([5, 8, 20, 17]); // [8, 20, 17, 5]
```

## No.6  最长公共子序列 (LCS)

> 一个数列S,如果分别是两个或多个已知数列的子序列,且是所有匹配此条件序列中最长的,则S称为已知序列的最长公共子序列.主要广泛地应用在版本控制,比如Git用来调和文件之间的改变.

动态规划的一个计算最长公共子序列的方法,以两个序列X、Y为例:

设有二维数组f[i][j]表示X的i位和Y的j位之前的最长公共子序列的长度,则有:

f[1][1] = same(1, 1)
f[i][j] = max{f[i - 1][j - 1] + same(i, j), f[i - 1][j], f[i][j - 1]}

其中,same(a, b)当X的第a位与Y的第b位完全相同时为"1",否则为0.此时,f[i][j]中最大的数便是X和Y的最长公共子序列的长度,依据该数组回溯,便可找出最长公共子序列.

```js
/**
 * @param {string[]} set1
 * @param {string[]} set2
 * @return {string[]}
 */
function longestCommonSubsequence(set1, set2) {
    // 初始化LCS二维数组
    const lcsMatrix = Array(set2.length + 1).fill(null).map(() => Array(set1.length + 1).fill(null));

    // 第一行填充0
    for (let columnIndex = 0; columnIndex <= set1.length; columnIndex += 1) {
        lcsMatrix[0][columnIndex] = 0;
    }

    // 第一列填充0
    for (let rowIndex = 0; rowIndex <=  set2.length; rowIndex += 1) {
        lcsMatrix[rowIndex][0] = 0;
    }

    // 对两个子序列剩下的列进行填充
    for (let rowIndex = 1; rowIndex <= set2.length; rowIndex += 1) {
        for (let columnIndex = 1; columnIndex <= set1.length; columnIndex += 1) {
            if (set1[columnIndex - 1] === set2[rowIndex - 1]) {
                lcsMatrix[rowIndex][columnIndex] = lcsMatrix[rowIndex - 1][columnIndex - 1] + 1;
            } else {
                lcsMatrix[rowIndex][columnIndex] = Math.max(
                    lcsMatrix[rowIndex - 1][columnIndex],
                    lcsMatrix[rowIndex][columnIndex - 1]
                );
            }
        }
    }

    // 计算lcs矩阵最大的字符串长度为0,返回空数组
    if (!lcsMatrix[set2.length][set1.length]) {
        return [''];
    }

    const longestSequence = [];
    let columnIndex = set1.length;
    let rowIndex = set2.length;

    while (columnIndex > 0 || rowIndex > 0) {
        if (set1[columnIndex - 1] === set2[rowIndex - 1]) {
            // 从后往前填充子序列1
            longestSequence.unshift(set1[columnIndex - 1]);
            columnIndex -= 1;
            rowIndex -= 1;
        } else if (lcsMatrix[rowIndex][columnIndex] === lcsMatrix[rowIndex][columnIndex - 1]) {
            // 左移
            columnIndex -= 1;
        } else {
            // 上移
            rowIndex -= 1;
        }
    }
    return longestSequence;
}
longestCommonSubsequence(["a", "d", "e"], ["a", "d", "f"]); // ["a", "d"]
```

## No.7 最长递增子序列(LIS)

> 给定一个长度为N的数组,找出一个最长的单调自增子序列(不一定连续,但是顺序不能乱).例如:给定一个长度为6的数组A{5, 6, 7, 1, 2, 8},则其最长的单调递增子序列为{5, 6, 7, 8},长度为4.

不过,有时候一个数组可能存在多个最长递增子序列,比如下列数组:

```
{0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15}
// 最长递增子序列有多种情况
{0, 2, 6, 9, 11, 15}
{0, 4, 6, 9, 11, 15}
{0, 2, 6, 9, 13, 15}
{0, 4, 6, 9, 13, 15}
```

实现代码:

```js
/**
 * 动态规划找最长递增子序列
 * @param {number[]} sequence
 * @return {number}
 */
function dpLongestIncreasingSubsequence(sequence) {
    // 申请一个长度为sequence.length的空间,记录最长递增子序列的长度
    const lengthsArray = Array(sequence.length).fill(1);
    let previousElementIndex = 0;
    let currentElementIndex = 1;

    while(currentElementIndex < sequence.length) {
        if (sequence[previousElementIndex] < sequence[currentElementIndex]) {
            const newLength = lengthsArray[previousElementIndex] + 1;
            if (newLength > lengthsArray[currentElementIndex]) {
                lengthsArray[currentElementIndex] = newLength;
            }
        }
        // 右移前一个元素索引
        previousElementIndex += 1;

        if (previousElementIndex === currentElementIndex) {
            currentElementIndex += 1;
            previousElementIndex = 0;
        }
    }
    console.log(lengthsArray);
    // 在lengthsArray找到最大元素,这个最大数就是最长递增子序列的长度
    let longestIncreasingLength = 0;
    for (let i = 0; i < lengthsArray.length; i += 1) {
        if (lengthsArray[i] > longestIncreasingLength) {
            longestIncreasingLength = lengthsArray[i];
        }
    }
    return longestIncreasingLength;
}
dpLongestIncreasingSubsequence([0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]); // 最长递增子序列的长度为6
```

## No.8 最短公共父序列 (SCS)

示例:

```js
Input: str1 = "geek", str2 = "eke"
Output: "geeke"

Input: str1 = "AGGTAB", str2 = "GXTXAYB"
Output: "AGXGTXAYB"
```

```js
function longestCommonSubsequence(set1, set2) {
    // 初始化LCS二维数组
    const lcsMatrix = Array(set2.length + 1).fill(null).map(() => Array(set1.length + 1).fill(null));

    // 第一行填充0
    for (let columnIndex = 0; columnIndex <= set1.length; columnIndex += 1) {
        lcsMatrix[0][columnIndex] = 0;
    }

    // 第一列填充0
    for (let rowIndex = 0; rowIndex <=  set2.length; rowIndex += 1) {
        lcsMatrix[rowIndex][0] = 0;
    }

    // 对两个子序列剩下的列进行填充
    for (let rowIndex = 1; rowIndex <= set2.length; rowIndex += 1) {
        for (let columnIndex = 1; columnIndex <= set1.length; columnIndex += 1) {
            if (set1[columnIndex - 1] === set2[rowIndex - 1]) {
                lcsMatrix[rowIndex][columnIndex] = lcsMatrix[rowIndex - 1][columnIndex - 1] + 1;
            } else {
                lcsMatrix[rowIndex][columnIndex] = Math.max(
                    lcsMatrix[rowIndex - 1][columnIndex],
                    lcsMatrix[rowIndex][columnIndex - 1]
                );
            }
        }
    }

    // 计算lcs矩阵最大的字符串长度为0,返回空数组
    if (!lcsMatrix[set2.length][set1.length]) {
        return [''];
    }

    const longestSequence = [];
    let columnIndex = set1.length;
    let rowIndex = set2.length;

    while (columnIndex > 0 || rowIndex > 0) {
        if (set1[columnIndex - 1] === set2[rowIndex - 1]) {
            // 从后往前填充子序列1
            longestSequence.unshift(set1[columnIndex - 1]);
            columnIndex -= 1;
            rowIndex -= 1;
        } else if (lcsMatrix[rowIndex][columnIndex] === lcsMatrix[rowIndex][columnIndex - 1]) {
            // 左移
            columnIndex -= 1;
        } else {
            // 上移
            rowIndex -= 1;
        }
    }
    return longestSequence;
}
function shortestCommonSupersequence(set1, set2) {
    // 先找到set1和set2的最长公共子序列
    const lcs = longestCommonSubsequence(set1, set2);
    // 如果lcs为空,最短公共子序列就是两个序列组合
    if (lcs.length === 1 && lcs[0] === '') {
        return set1.concat(set2);
    }
    let supersequence = [];
    let setIndex1 = 0;
    let setIndex2 = 0;
    let lcsIndex = 0;
    let setOnHold1 = false;
    let setOnHold2 = false;
    while (lcsIndex < lcs.length) {
        // Add elements of the first set to supersequence in correct order.
        if (setIndex1 < set1.length) {
            if (!setOnHold1 && set1[setIndex1] !== lcs[lcsIndex]) {
                supersequence.push(set1[setIndex1]);
                setIndex1 += 1;
            } else {
                setOnHold1 = true;
            }
        }

        // Add elements of the second set to supersequence in correct order.
        if (setIndex2 < set2.length) {
            if (!setOnHold2 && set2[setIndex2] !== lcs[lcsIndex]) {
                supersequence.push(set2[setIndex2]);
                setIndex2 += 1;
            } else {
                setOnHold2 = true;
            }
        }

        // Add LCS element to the supersequence in correct order.
        if (setOnHold1 && setOnHold2) {
            supersequence.push(lcs[lcsIndex]);
            lcsIndex += 1;
            setIndex1 += 1;
            setIndex2 += 1;
            setOnHold1 = false;
            setOnHold2 = false;
        }
    }

    // Attach set1 leftovers.
    if (setIndex1 < set1.length) {
        supersequence = supersequence.concat(set1.slice(setIndex1));
    }

    // Attach set2 leftovers.
    if (setIndex2 < set2.length) {
        supersequence = supersequence.concat(set2.slice(setIndex2));
    }
    return supersequence;
}
shortestCommonSupersequence("AGGTAB", "GXTXAYB");
```

## No.9 背包问题 - "0/1" and "Unbound" ones

> 有N件物品和一个容量为V的背包.第i件物品的重要c[i],价值为w[i].将哪些物品装入背包可使价值总和最大.

思路:

特点: 每种物品仅有一件,可以选择放或不放.

用子问题定义状态,即f[i][v]表示前i件物品恰放入一个容器为v的背包可以获得的最大价值.则其状态转移方程便是:

```js
f[i][v]=max{f[i-1][v], f[i-1][v-c[i]]+w[i]}
```

解释一下方程:将前i件物品放入容量v的背包中,若只考虑第i件物品的策略(放或不放),那么就可以转化为一个只牵扯前i-1件物品的问题.如果不放第i件物品,那么问题就转化为前i-1件物品放入容量为v的背包中,价值为f[i-1][v];如果放第i件物品,那么问题就转化为“前i-1件物品放入剩下的容量为v-c[i]的背包中”,此时能获得的最大价值就是f[i-1][v-c[i]]再加上通过放入第i件物品获得的价值w[i].

代码实现:

```js
/**
 * @param size 承重量
 * @param value 每件物品的价值
 * @param weight 每件物品的重量
 */
const packageMaxValue = (weight, value, size) => {
    // 省略参数合法性校验
    let bagMatrix = [];
    for (let w = 0; w <= size; w++) {
        // 初始化二维数组
        bagMatrix[w] = [];
        for (let j = 0; j < 5; j++) {
            // 背包的容量为0,那么一个东西也装不下,此时的值肯定也是为0
            if (w === 0) {
                bagMatrix[w][j] = 0;
                continue;
            }
            // 背包的容量小于物品j的重量
            if (w < weight[j]) {
                bagMatrix[w][j] = bagMatrix[w][j-1] || 0;
                continue;
            }
            bagMatrix[w][j] = Math.max((bagMatrix[w-weight[j]][j-1] || 0) + value[j], bagMatrix[w][j-1] || 0);
        }
    }
    return bagMatrix;
};
let weight = [4, 5, 6, 2, 2];
let value = [6, 4, 5, 3, 6];
console.log(packageMaxValue(weight, value, 10));
```

## No.9 最大子数列问题 - BF算法 与 动态规划

最大子数列问题的目标是在数列的一维方向找到一个连续的子数列,使该子数列的和最大.例如,对一个数列[-2, 1, -3, 4, -1, 2, 1, -5, 4],其连续子数列中和最大的是[4, -1, 2, 1],其和为6.

算法描述:

* 遍历该数组,在遍历过程中,将遍历的元素依次累加起来,当累加结果小于或等于0时,从下一个元素开始,重新开始累加;
* 累加过程中,要用一个变量记录所获得过的最大值;
* 一次遍历之后,变量中存储的即为最大子片段的和值.

```js
/**
 * @param {Number[]} inputArray
 * @param {Number[]}
 */
function bfMaximumSubarray(inputArray) {
    let maxSubarrayStartIndex = 0;
    let maxSubarrayLength = 0;
    let maxSubarraySum = null;

    for (let startIndex = 0; startIndex < inputArray.length; startIndex += 1) {
        let subarraySum = 0;
        for (let arrLength = 1; arrLength <= (inputArray.length - startIndex); arrLength += 1) {
            subarraySum += inputArray[startIndex + (arrLength - 1)];
            if (maxSubarraySum === null || subarraySum > maxSubarraySum) {
                maxSubarraySum = subarraySum;
                maxSubarrayStartIndex = startIndex;
                console.log(startIndex);
                maxSubarrayLength = arrLength;
            }
        }
    }
    return inputArray.slice(maxSubarrayStartIndex, maxSubarrayStartIndex + maxSubarrayLength);
}
bfMaximumSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]); // [4, -1, 2, 1]
```

## No.10 组合求和 - 查找形成特定总和的所有组合

> 输入两个整数n和m,从数列1,2,3......n中随意取几个数.使其和等于m,要求将其中所有的可能组合列出来.

解法:

* 采用0~1背包的思想,使用递归方法;
* 当选择n时,就用剩下的n-1填满m-n;
* 当不选择n时,就用剩下的n-1填满m;

注:当m=n时,即找到了符合条件的解.

```js
/**
 * @param {number[]} candidates 复数
 * @param {number} remainingSum 剩余的和
 * @param {number[][]} finalCombinations 结果列表的组合
 * @param {number[]} currentCombination 当前组合
 * @param {number} startFrom 检索开始
 * @return {number[][]}
 */
function combinationSumRecursive(candidates, remainingSum, finalCombinations = [], currentCombination = [], startFrom = 0) {
    if (remainingSum < 0) {
        return finalCombinations;
    }
    if (remainingSum === 0) {
        finalCombinations.push(currentCombination.slice());
        return finalCombinations;
    }
    for (let candidateIndex = startFrom; candidateIndex < candidates.length; candidateIndex += 1) {
        console.log(candidateIndex);
        const currentCandidate = candidates[candidateIndex];
        currentCombination.push(currentCandidate);
        combinationSumRecursive(candidates, remainingSum - currentCandidate, finalCombinations, currentCombination, candidateIndex);
        currentCombination.pop();
    }
    return finalCombinations;
}
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
function combinationSum(candidates, target) {
    return combinationSumRecursive(candidates, target);
}
combinationSum([2, 3, 6, 7], 7); // [[2, 2, 3], [7]]
```
