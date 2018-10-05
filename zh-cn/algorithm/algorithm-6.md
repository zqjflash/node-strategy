# 第六节 排序

## No.1 冒泡排序

冒泡排序算法的原理如下:

1. 比较相邻的元素.如果第一个比第二个大,就交换他们两个;
2. 对每一对相邻元素做同样的工作,从开始第一对到结尾的最后一对.在这一点,最后的元素应该会是最大的数.
3. 针对所有的元素重复以上的步骤,除了最后一个;
4. 持续每次对越来越少的元素重复上面的步骤,直到没有任何一对数字需要比较.

```js
function bubbleSort(arr) {
    let i = arr.length;
    let j;
    let tempExchangVal;
    while (i > 0) {
        for (j = 0; j < i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                tempExchangVal = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tempExchangVal;
            }
        }
        i--;
    }
    return arr;
}
let arr = [3, 2, 4, 9, 1, 5, 7, 6, 8];
let arrSorted = bubbleSort(arr);
console.log(arrSorted); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## No.2 选择排序

首先在未排序序列中找到最小(大)元素, 存放到排序序列的起始位置,然后再从剩余未排序元素中继续寻找最小(大)元素,放到已排序序列的末位.以此类推,直到所有元素均排序完毕.

```js
let sortArr = [8, 94, 15, 88, 55, 76, 21, 39];
function selectSort(arr) {
    let len = arr.length;
    let minIndex;
    let temp;
    console.time('选择排序耗时');
    for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    console.timeEnd('选择排序耗时');
    return arr;
}
selectSort(sortArr); // [8, 15, 21, 39, 55, 76, 88, 94]
```

## No.3 插入排序

基本思想是:把待排序的记录按其关键码值的大小逐个插入到一个已经排好序的有序序列中,直到所有的记录插入完为止,得到一个新的有序序列.

排序过程大概如下:

1. 从第一个元素开始,该元素可以认为已经被排序;
2. 取出下一个元素,在已经排序的元素序列中从后向前扫描;
3. 如果该元素(已排序)大于新元素, 将该元素移到下一个位置;
4. 重复步骤3,直到找到已排序的元素小于或者等于新元素的位置;
5. 将新元素插入到该位置后;
6. 重复步骤2~5.

```js
/**
 * 插入排序算法
 * @param {Array} arr 需要排序的数组
 * @return {Array} 从小到大排序好的数组
 */
function insertSort(arr) {
    let len = arr.length;
    for (let i = 1; i < len; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}
insertSort([8, 15, 21, 39, 55, 76, 88, 94]); // [8, 15, 21, 39, 55, 76, 88, 94]
```

## No.4 堆排序

在实际应用场景中,比如百万数据取top1000的数,使用堆排序,可以在不需要完整排序完再取出前top1000,可以利用大顶堆依次取出堆顶最大数达到1000个即可.

* 堆排序原理:

堆排序就是把最大堆堆顶的最大数去除,将剩余的堆继续调整为最大堆,再次将堆顶的最大数取出,这个过程持续到剩余数只有一个时结束.

堆排序的几个公式:

* Parent(i) = floor((i-1)/2) // i的父节点下标
* Left(i) = 2i + 1 // i的左子节点下标
* Right(i) = 2(i + 1) // i的右子节点下标

```js
function heapSort(array) {
    // 数组元素交换位置
    function swap(array, i, j) {
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    /**
     * 从index开始检查并保持最大堆性质
     * index: 检查的起始下标
     * heapSize: 堆大小
     */
    function maxHeapify(array, index, heapSize) {
        var iMax;
        var iLeft;
        var iRight;
        while(true) {
            iMax = index;
            iLeft = 2 * index + 1;
            iRight = 2 * (index + 1);
            if (iLeft < heapSize && array[index] < array[iLeft]) {
                iMax = iLeft;
            }
            if (iRight < heapSize && array[iMax] < array[iRight]) {
                iMax = iRight;
            }
            if (iMax != index) {
                swap(array, iMax, index);
                index = iMax;
            } else {
                break;
            }
        }
    }

    /**
     * 创建最大堆(Build-Max-Heap),自下而上的调用Max-Heapify来改造数组
     * 由于堆顶元素必然是堆中最大的元素,所以一次操作之后,堆中存在的最大元素被分离出堆,重复n-1次之后,数组排列完毕
     */
    function buildMaxHeap(array) {
        var i;
        var iParent = Math.floor(array.length / 2) - 1;
        for (i = iParent; i >= 0; i--) {
            maxHeapify(array, i, array.length);
        }
    }

    function sort(array) {
        buildMaxHeap(array);
        for (var i = array.length - 1; i > 0; i--) {
            swap(array, 0, i);
            maxHeapify(array, 0, i);
        }
        return array;
    }
    return sort(array);
}
```

## No.5 归并排序

归并操作的工作原理如下:

1. 申请空间,使其大小为两个已经排序序列之和,该空间用来存放合并后的序列;

2. 设定两个指针,最初位置分别为两个已经排序序列的其起始位置;

3. 比较两个指针所指向的元素,选择相对小的元素放入到合并空间,并移动指针到下一个位置;

4. 重复步骤3直到某一指针超出序列尾;

5. 将另一序列剩下的所有元素直接复制到合并序列尾;

```js
function mergeSort(arr) {  //采用自上而下的递归方法
    var len = arr.length;
    if(len < 2) {
        return arr;
    }
    var middle = Math.floor(len / 2),
        left = arr.slice(0, middle),
        right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right)
{
    var result = [];
    while (left.length>0 && right.length>0) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    while (left.length) {
        result.push(left.shift());
    }
    while (right.length) {
        result.push(right.shift());
    }
    return result;
}
mergeSort([8, 94, 15, 88, 55, 76, 21, 39]); // [8, 15, 21, 39, 55, 76, 88, 94]
```

## No.6 快速排序

基本思想:通过一趟排序将要排序的数据分割成独立的两部分,其中一部分的所有数据都比另外一部分的所有数据都要小,然后再按此方法对这两部分数据分别进行快速排序,整个排序过程可以递归进行,以此达到整个数据变成有序序列.

一趟快速排序的算法是:

1 设置两个变量i, j, 排序开始的时候: i = 0, j = N - 1;
2 以第一个数组元素作为关键数据,赋值给key, 即key = A[0];
3 从j开始向前搜索,即由后开始向前搜索(j--),找到第一个小于key的值A[j],将A[j]和A[i]互换;
4 从i开始向后搜索,即由前开始向后搜索(i++),找到第一个大于key的A[i],将A[i]和A[j]互换;
5 重复第3、4步,直到i=j;(3、4步中,没找到符合条件的值,即3中A[j]不小于key, 4中A[i]不大于key的时候改变j、i的值,使得j=j-1,i=i+1,直至找到为止.找到符合条件的值,进行交换的时候i,j指针位置不变,另外, i==j这一过程一定正好是i+或j-完成的时候,此时令循环结束).

## No.7 希尔排序

希尔排序是插入排序的一种更高效的实现,它与插入排序的不同之处在于,它会优先比较距离较远的元素.希尔排序的核心在于间隔序列的设定.既可以提前设定好间隔序列.也可以动态的定义间隔序列.

```js
function shellSort(arr) {
    let len = arr.length;
    let temp;
    let gap = 1;
    while (gap < len / 3) {
        gap = gap * 3 + 1;
    }
    for (gap; gap > 0; gap = Math.floor(gap / 3)) {
        for (let i = gap; i < len; i++) {
            temp = arr[i];
            let j = 0;
            for (j = i - gap; j > 0 && arr[j] > temp; j-=gap) {
                arr[j+gap] = arr[j];
            }
            arr[j+gap] = temp;
        }
    }
    return arr;
}
shellSort([8, 94, 15, 88, 55, 76, 21, 39]);
```

# 附录

* [JS的十大经典算法排序](https://www.cnblogs.com/dushao/p/6004883.html)