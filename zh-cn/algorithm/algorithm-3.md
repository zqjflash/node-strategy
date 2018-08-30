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