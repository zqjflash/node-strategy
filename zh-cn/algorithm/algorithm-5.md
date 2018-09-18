# 第五节 搜索

## No.1 线性搜索

按一定的顺序检查数组中每一个元素,直到找到所要寻找的特定值为止.

假设一个数组中有n个元素, 最好的情况就是要寻找的特定值就是数组里的第一个元素,这样仅需1次比较就可以,而最坏的情况是要寻找的特定值不在这个数组或者是数组里的最后一个元素,这就需要进行n次比较.

比较类:

```js
class Comparator {
    /**
     * @param {function(a: *, b: *)} [compareFunction]
     */
    constructor(compareFunction) {
        this.compare = compareFunction || Comparator.defaultCompareFunction;
    }

    /**
     * @param {(string|number)} a
     * @param {(string|number)} b
     * @returns {number}
     */
    static defaultCompareFunction(a, b) {
        if (a === b) {
            return 0;
        }
        return a < b ? -1 : 1;
    }

    // 等于
    equal(a, b) {
        return this.compare(a, b) === 0;
    }

    // 小于
    lessThan(a, b) {
        return this.compare(a, b) < 0;
    }

    // 大于
    greaterThan(a, b) {
        return this.compare(a, b) > 0;
    }

    // 小于等于
    lessThanOrEqual(a, b) {
        return this.lessThan(a, b) || this.equal(a, b);
    }

    // 大于等于
    greaterThanOrEqual(a, b) {
        return this.greaterThan(a, b) || this.equal(a, b);
    }

    // 取反
    reverse() {
        const compareOriginal = this.compare;
        this.compare = (a, b) => compareOriginal(b, a);
    }
}

/**
 * @param {*[]} array
 * @param {*} seekElement
 * @param {function(a, b)} [comparatorCallback]
 * @param {number[]}
 */
function linearSearch(array, seekElement, comparatorCallback) {
    const comparator = new Comparator(comparatorCallback);
    const foundIndices = [];
    array.forEach((element, index) => {
        if (comparator.equal(element, seekElement)) {
            foundIndices.push(index);
        }
    });
    return foundIndices;
}
linearSearch(["a", "c", "d"], "d"); // [2]

```



