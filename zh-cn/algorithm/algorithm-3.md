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
longestCommonSubsequence(["a", "d", "e"], ["a", "d", "f"]);
```

## No.7 最长递增子序列

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


