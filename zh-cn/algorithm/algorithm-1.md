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

## No.5 有五个理性到海盗,A,B,C,D和E,找到了100个金币,需要想办法分配金币.海盗们有严格的等级制度;A比B职位高,B比C高,C比D高,D比E高;海盗世界到分配原则是:等级最高的海盗提出一种分配方案.所有的海盗投票决定是否接受分配,包括提议人.并且在票数相同的情况下,提议人有决定权.如果提议通过,那么海盗们按照提议分配金币.如果没有通过,那么提议人将被扔出船外,然后由下一个最高职位的海盗提出新的分配方案.海盗们基于三个因素来做决定:首先,要能存活下来;其次,自己得到的利益最大化;最后,在所有其他条件相同的情况下,优先选择把别人扔出船外.请问,第一位海盗提出什么方案才是最佳?请说出你的思路.

此题公认的标准答案是:A海盗分给C海盗1个金币,D海盗或E海盗2个金币,自己则独得97个金币,即分配方案(97,0,1,2,0)或(97,0,1,0,2).
现在看如下个人的理性分析:(逆向思维、贪心算法)

* 首先从E海盗开始,因为他是最安全的,没有被扔下大海的风险,因此他的策略也最为简单,即最好前面的人全都被扔出船外,那么他就可以独得这100个金币;

* 接下来是D海盗,他的生存机会完全取决于前面还有人存活着,因为如果A海盗到C海盗全都被扔出船外,那么在只剩下D海盗与E海盗的情况下,不管D海盗提出怎样的分配方案,E海盗一定都会投反对票来让D海盗被扔出船外,以独吞全部的金币.哪怕D海盗为了保命而讨好5号,提出(0, 100)这样的方案让E海盗独占金币,但是5号还有可能觉得留着D海盗有危险,而投票反对以让其被扔出船外.因此理性的D海盗是不应该冒这样的风向,把存活的希望寄托在E海盗的随机选择上的.他惟有支持C海盗才能绝对保证自身的性命.

* 再来看C海盗,他经过上述的逻辑推理之后,就会推出(100, 0, 0)这样的分配方案,因为他知道D海盗哪怕一无所获,也还是会无条件的支持他而投赞成票的,那么再加上自己的1票就可以使他稳获这100金币了.

* 但是,B海盗也经过推理得知了C海盗的分配方案,那么他就会提出(98,0,1,1)的方案.因为这个方案相对于C海盗的分配方案,D海盗和E海盗至少可以获得1个金币,理性的D海盗和E海盗自然会觉得此方案对他们来说更有利而支持B海盗,不希望B海盗出局而由C海盗来进行分配.这样,B海盗就可以拿走98个金币.

* 不幸的是,A海盗更聪明,经过一番推理之后,也洞悉了B海盗的分配方案.他将采取的策略是放弃B海盗,而给C海盗1个金币,同时给D海盗或E海盗2个金币,即提出(97,0,1,2,0)或(97,0,1,0,2)的分配方案.由于A海盗的分配方案对于C海盗或D海盗或E海盗来说,相比B海盗的方案可以获得更多的利益.那么他们将会投票支持A海盗,再加上A海盗自身的1票,97个金币就可轻松落入A海盗腰包.

# 参考

![前端工作中遇到的数据结构和算法](https://cloud.tencent.com/developer/article/1005459)
