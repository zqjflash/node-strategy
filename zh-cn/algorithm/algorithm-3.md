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
