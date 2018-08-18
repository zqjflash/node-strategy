# 第六节 排序

## No.1 堆排序

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