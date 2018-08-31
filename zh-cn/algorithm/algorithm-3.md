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
