# 第一节 前端工作中遇到的数据结构和算法

## No.1 递归

> 递归:就是自己调用自己,经典的应用场景就是DOM树查找

```js
function getElementById(node, id) {
    if (!node) {
        return null;
    }
    console.log(node.id);
    if (node.id === id) {
        return node;
    }
    for (var i = 0; i < node.childNodes.length; i++) {
        var found = getElementById(node.childNodes[i], id);
        if (found) {
            return found;
        }
    }
    return null;
}
```

## No.2 非递归:深度优先算法

> 深度优先算法最常用的是在DOM树查找中的实现

设计思路:修改nextElement的查找方式,如果有子节点,则下一个元素就是它的第一个子节点,否则,判断是否有相邻节点,如果有返回他的相邻元素.如果即没有子节点也没有相邻节点,就返回父节点的下一个相邻节点,然后重新进入循环队列.

```js
<div id="id-data-structure">
我是body
</div>

function getElementById(node, id) {
    whild(node) {
        if (node.id === id) {
            return node;
        }
        node = nextNode(node);
    }
}

function nextNode(node) {
    if (node.children.length) {
        return node.children(0);
    }

    if (node.nextElementSibling) {
        return node.nextElementSibling;
    }

    while (node.parentNode) {
        if (node.parentNode.nextElementSibling) {
            return node.parentNode.nextElementSibling;
        }
    }
    return null;
}

getElementById(document, "id-data-structure");
```

## No.3 哈希结构及相关算法

哈表表就是一种以键值对(key-indexed)存储数据的结构,我们只要输入待查找的值key,即可查找到其对应的值.

```js
const picArray = [
    {
        picId: '123',
        src: 'hhh'
    },
    {
        picId: '456',
        src: 'mmm'
    }
];
```

由于JavaScript Object数据类型是基于Hashtable实现 ,所以,当使用对象键值查找值时,浏览器引擎已经在底层通过哈希函数将每个键转化为数据的索引,并使用内建对哈希碰撞处理函数处理了碰撞冲突.

Object对象每一个key拥有一个独立无二的index,在javascript底层,我们其实是通过这个index获得想要的src的.
哈希查找算法需要一定的时间和空间,在计算机内存足够大时,哈希查找的时间复杂度趋近于O(1),是一种极有效率的查找算法!

ES6中的Map数据结构就是一种哈希表结构

## No.4 试计算100!.

在不考虑越界的情况下,可以使用递归、for循环等

* 方法一:

```js
function factorial(num) {
    if (num < 0) {
        return -1;
    } else if (num === 0 || num === 1) {
        return 1;
    } else {
        return (num * factorial(num - 1));
    }
}
factorial(100);
```

* 方法二:

```js
function factorial(num) {
    if (num < 0) {
        return -1;
    } else if (num === 0 || num === 1) {
        return 1;
    } else {
        for (var i = num - 1; i >= 1; i--) {
            num *= i;
        }
    }
    return num;
}
factorial(100);
```

* 需要考虑JS大数相乘越界问题: JS的number类型有个最大值(安全值).即2的53次方.如果超过这个值,那么JS会出现不精确的问题.

```js
console.log(bigMut("10", "1234")); // 12340
function bigMut(big, common) {
	big += "";
	common += "";
	if (big.length < common.length) {
		big = [common, common = big][0];
	}
	big = big.split("").reverse();
	var oneMutManyRes = [];
	var i = 0,
	len = big.length;
	for (; i < len; i++) {
		oneMutManyRes[oneMutManyRes.length] = oneMutMany(big[i], common) + getLenZero(i);
	}
	var result = oneMutManyRes[0];
	for (i = 1, len = oneMutManyRes.length; i < len; i++) {
		result = bigNumAdd(result, oneMutManyRes[i]);
	}
	return result;
}
function getLenZero(len) {
	len += 1;
	var ary = [];
	ary.length = len;
	return ary.join("0");
}
function oneMutMany(one, many) {
	one += "";
	many += "";
	if (one.length != 1) {
		one = [many, many = one][0];
	}
	one = parseInt(one, 10);
	var i = 0,
	len = many.length,
	resAry = [],
	addTo = 0,
	curItem,
	curRes,
	toSave;
	many = many.split("").reverse();
	for (; i <= len; i++) {
		curItem = parseInt(many[i] || 0, 10);
		curRes = curItem * one + addTo;
		toSave = curRes % 10;
		addTo = (curRes - curRes % 10) / 10;
		resAry.unshift(toSave);
	}
	if (resAry[0] == 0) {
		resAry.splice(0, 1);
	}
	return resAry.join("");
}
function bigNumAdd(big, common) {
	big += "";
	common += "";
	var maxLen = Math.max(big.length, common.length),
	bAry = big.split("").reverse(),
	cAry = common.split("").reverse(),
	i = 0,
	addToNext = 0,
	resAry = [],
	fn,
	sn,
	sum;
	for (; i <= maxLen; i++) {
		fn = parseInt(bAry[i] || 0);
		sn = parseInt(cAry[i] || 0);
		sum = fn + sn + addToNext;
		addToNext = (sum - sum % 10) / 10;
		resAry.unshift(sum % 10);
	}
	if (resAry[0] == 0) {
		resAry.splice(0, 1);
	}
	return resAry.join("");
}
```

# 参考

![前端工作中遇到的数据结构和算法](https://cloud.tencent.com/developer/article/1005459)
