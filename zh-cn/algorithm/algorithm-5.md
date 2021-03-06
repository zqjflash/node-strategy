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

## No.2 跳转搜索 (或块搜索) - 搜索排序数组

跳转搜索是用于有序数组的搜素算法.基本思想是通过以固定步长向前跳跃或跳过一些元素来代替搜索所有元素来检查更少的元素(而不是线性搜索).

例如,假设我们有一个大小为n的数组arr[]和大小为m的块(将被跳转).然后我们搜索索引`arr[0],arr[m],arr[2*m],...arr[k*m]`等等,一旦我们找到了间隔(`arr[k*m] < x < arr[(k+1) * m]`),我们就从索引k*m开始执行线性搜索操作来查找元素x.

### 什么是最佳跳跃步长?

在最坏的情况下,我们必须进行n/m跳转,并且如果最后一次选中的值大于要搜索的元素,我们将对于线性搜索进行m-1比较,因此,最坏情况下的比较总数将是(n/m) + m-1.

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
 * @param {*[]} sortedArray
 * @param {*} seekElement
 * @param {function(a, b)} [comparatorCallback]
 * @param {number}
 */
function jumpSearch(sortedArray, seekElement, comparatorCallback) {
    const comparator = new Comparator(comparatorCallback);
    const arraySize = sortedArray.length;

    if (!arraySize) {
        return -1;
    }

    const jumpSize = Math.floor(Math.sqrt(arraySize));
    let blockStart = 0;
    let blockEnd = jumpSize;
    while (comparator.greaterThan(seekElement, sortedArray[Math.min(blockEnd, arraySize) - 1])) {
        blockStart = blockEnd;
        blockEnd += jumpSize;
        if (blockStart > arraySize) {
            return -1;
        }
    }

    let currentIndex = blockStart;
    while(currentIndex < Math.min(blockEnd, arraySize)) {
        if (comparator.equal(sortedArray[currentIndex], seekElement)) {
            return currentIndex;
        }
        currentIndex += 1;
    }
    return -1;
}
jumpSearch(["a", "c", "d"], "d");
```

## No.3 二分查找

搜索过程从数组的中间元素开始,如果中间元素正好是要查找的元素,则搜索过程结束,如果某一特定元素大于或者小于中间元素,则在数组大于或小于中间元素的那一半中查找,而且跟开始一样从中间元素开始比较.如果在某一步数组为空,则代表找不到.

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
 * Binary search implementation.
 * @param {*[]} sortedArray
 * @param {*} seekElement
 * @param {function(a, b)} [comparatorCallback]
 * @return {number}
 */
function binarySearch(sortedArray, seekElement, comparatorCallback) {
    const comparator = new Comparator(comparatorCallback);
    let startIndex = 0;
    let endIndex = sortedArray.length - 1;
    while (startIndex <= endIndex) {
        const middleIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
        // 如果中间元素等于比较的元素,直接返回
        if (comparator.equal(sortedArray[middleIndex], seekElement)) {
            return middleIndex;
        }
        // 选择所在范围的半区进行遍历
        if (comparator.lessThan(sortedArray[middleIndex], seekElement)) {
            // 右移到所在范围的半区起始点
            startIndex = middleIndex + 1;
        } else {
            // 左移到所在范围的半区结束点
            endIndex = middleIndex - 1;
        }
    }
    return -1;
}
binarySearch(["a", "c", "d"], "d"); // 2
```

## No.4 插值搜索 - 搜索均匀分布的排序数组

给定n个均匀分布值的排序数组,写一个函数来搜索数组中的特定元素x.
线性搜索时间复杂度O(n),跳跃搜索时间复杂度O(√n),二分查找时间复杂度O(logn)

插值搜索是对实例的二分查找搜索的改进,其中排序数组中的值是均匀分布的,根据正在搜索的键值,插值搜索可以去不同的位置,例如,如果键值更接近最后一个元素,则插值搜索可能会朝向尾部开始搜索.

```js
pos = lo + [(x-arr[lo]) * (hi - lo) / (arr[hi] - arr[lo])]
x => 搜索元素
lo => 开始搜索数组的索引
hi =>  数组的结束索引
```

```js
/**
 * @param {*[]} sortedArray 均匀分布的排序数组
 * @param {*} seekElement
 * @return {number}
 */
function interpolationSearch(sortedArray, seekElement) {
    let leftIndex = 0;
    let rightIndex = sortedArray.length - 1;
    while (leftIndex <= rightIndex) {
        const rangeDelta = sortedArray[rightIndex] - sortedArray[leftIndex];
        const indexDelta = rightIndex - leftIndex;
        const valueDelta = seekElement - sortedArray[leftIndex];

        // 如果valueDelta小于0意味着没有找到元素
        if (valueDelta < 0) {
            return -1;
        }

        // 找不到范围的元素
        if (!rangeDelta) {
            return sortedArray[leftIndex] === seekElement ? leftIndex : -1;
        }

        // 插值中间指数
        const middleIndex = leftIndex + Math.floor(valueDelta * indexDelta / rangeDelta);

        // 如果发现元素直接返回索引位置
        if (sortedArray[middleIndex] === seekElement) {
            return middleIndex;
        }

        if (sortedArray[middleIndex] < seekElement) {
            leftIndex = middleIndex + 1;
        } else {
            rightIndex = middleIndex - 1;
        }
    }
    return -1;
}
interpolationSearch([5, 19, 21], 19); // 索引值1
```



