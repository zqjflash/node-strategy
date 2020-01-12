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
    let idx1, idx2;
    arr.forEach((ele, index) => {
        // 获取匹配差值对应的索引
        let tempIdx = arr.indexOf(target - ele);
        if (tempIdx !== -1 && tempIdx !== index) {
            idx1 = index;
            idx2 = tempIdx;
        }
    });
    return [idx1, idx2];
}
```

## No.2 数组中最大差值

```js
function getMaxDiff(arr) {
    let min = arr[0];
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
        if (arr[i] > max) {
            max = arr[i];
        }
        return max - min;
    }
}

function getMaxDiff(arr) {
    let min = arr[0];
    let max = arr[0];
    arr.forEach(value => {
        if (value < min) {
            min = value;
        }
        if (value > max) {
            max = value;
        }
    });
    return max - min;
}

function getMaxDiff(arr) {
    return Math.max(...arr) - Math.min(...arr);
}

```

## No.3 二分查找（原数组必须有序，否则不行）

```js
function binarySearch(arr, target) {
    const a = arr.slice().sort((a, b) => a - b);
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
        const mid = ~~((high + low) / 2);
        if (target == arr[mid]) {
            return mid;
        } else if (target > arr[mid]) {
            low = mid + 1;
        } else if (target < arr[mid]) {
            high = mid - 1;
        }
    }
    return -1;
}
```

## No.4 统计一个字符串出现频率最高的字母/数字

```js
let str = 'tewfewljgkgsdfsdfsdfsdfloougfgvcxv';
const strChar = str => {
    let string = [...str],
    maxValue = '',
    obj = {},
    max = 0;
    string.forEach(value => {
        obj[value] = obj[value] == undefined ? 1 : obj[value] + 1;
        if (obj[value] > max) {
            max = obj[value];
            maxValue = value;
        }
    })
    return maxValue;
}
console.log(strChar(str)); // a
```

## No.5 两数相加

> 给出两个非空的链表用来表示两个非负的整数。其中，它们各自的位数时按照逆序的方式存储的，并且它们的每次节点只能存储一位数字。

示例：

输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807

```js
function ListNode(val) {
    this.val = val;
    this.next = null;
    return {
        val: this.val,
        next: null
    }
}

function addBigNumber(a, b) {
    let res = '';
    let temp = 0;
    a = a.split(''); // 转成字符串数组
    b = b.split('');

    while (a.length || b.length || temp) {
      temp += ~~a.pop() + ~~b.pop();
      res = (temp % 10) + res; // 倒序
      temp = temp > 9;
    }

    return res.replace(/^0+/, '');
}

var addTwoNumbers = function(l1, l2) {
    let num1 = '', num2 = '', cur;
    cur = l1;

    while(cur) {
        num1 += cur.val.toString();
        cur = cur.next;
    }

    cur = l2;
    while(cur) {
        num2 += cur.val.toString();
        cur = cur.next;
    }

    num1 = num1.split('').reverse().join('');
    num2 = num2.split('').reverse().join('');

    let total;

    if (num1.length > 21 || num2.length > 21) {
        total = addBigNumber(num1, num2);
    } else {
        total = Number(num1) + Number(num2);
    }

    total = total.toLocaleString().toString().split('').reverse().join('').replace(/,/g, '');

    console.log(num1, num2, total);
    let l3 = ListNode(total[0]);
    cur = l3;

    for (let i = 1; i < total.length; i++) {
        let node = ListNode(total[i]);
        cur.next = node;
        cur = node;
    }

    return l3;
}
```

