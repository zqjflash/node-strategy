# 第七节 常见算法题

## No.1 给一个数组（其元素不重复），求所有元素相加为某个值的2个元素对的下标对

> 示例：给一个数组（其元素不重复），求所有元素相加为某个值的2个元素对的下标对；

```js
// eg: [2, 9, 3, 10, 8, 1, 22]，目标值11，有[[0, 1], [2, 4], [3, 5]]

// 采用排序法
function findNum(arr, target) {
  const a = arr.slice().sort((a, b) => a - b);
  const len = a.length;
  const key = []; // 存放最后的下标组
  const val = []; // 存放最后的元素组

  if (len <= 1) {
      return;
  }

  let i = 0;
  let j = len - 1;

  while (i < j) {
      // 排除法，先过滤不符合条件的
      if (a[i] + a[j] < target) {
          i++;
      } else if (a[i] + a[j] > target) {
          j--;
      } else {
          console.log('i', i);
          console.log('j', j);
          val.push([a[i], a[j]]);
          key.push([i, j]);
          i++;
          j--;
      }
  }

  // 如果只要下标组，则return key;
  return {
      key, val
  }
}

// 采用差值匹配法
function findNum2(arr, target) {
    const len = arr.length;
    const key = []; // 存放最后的下标组
    const val = []; // 存放最后的元素组
    if (len <= 1) {
        return;
    }
    for (let i = 0; i < len; i++) {
        const diff = target - arr[i];
        // 从i+1开始查询是否存在diff的值（下标）
        const index = arr.slice(i+1).findIndex(i => i === diff);
        if (index !== -1) {
            key.push([i, index]);
            val.push([arr[i], arr[index]]);
        }
    }

    // 如果只要下标组，则：return key;
    return {
        key, val
    }
}
```