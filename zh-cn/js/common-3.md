# 第三节 常见JS代码片段分析

## No.1 Promise引发的故障沉默.

先看一段有问题的代码,此代码段缺少.catch.

```js
new Promise((resolve, reject) => {
    throw new Error("error");
}).then(console.log);
```

改正之后的代码:

```js
new Promise((resolve, reject) => {
    throw new Error("error");
}).then(console.log).catch(console.error);
```

## No.2 js中0.1+0.2===0.3是否为true?在不知道浮点数的位数时应该怎样判断两个浮点数之和与第三个数是否相等?

首先,执行结果0.1+0.2===0.3为false.
在计算机程序中浮点数误差普遍存在,浮点运算本质上只是一个近似计算,因此对比浮点数相等时,我们可以计算浮点数之差,如果结果小于某个可接受的误差值,则可以说明这两个浮点数意义上相等.

扩展:浮点数运算过程
* 对阶:两个浮点数的小数点位置对齐,小的阶码向大的阶码看齐.[误差开始]
* 尾数求和:将对阶后的两尾数按定点加减运算规则求和(或差)
* 规格化:为增加有效数字的位数,提高运算精读,必须将求和(差)后的尾数规格化,右归导致低位丢失
* 舍入(0舍1入)
* 溢出判断:根据阶码判断浮点运算是否溢出.

## No.3 以下代码执行结果是多少?

```js
var a = 6;
setTimeout(function() {
    console.log(0);
    alert(a);
    a = 666;
}, 0);
console.log(1);
a = 66;
```
执行结果: 1->0->alert(66)
分析如下:
* console.log(1) 是同步任务,放入主线程里;
* setTimeout()是异步任务,被放入event table,0秒之后被推入event queue里;
* console.log(0) 是同步任务,放入主线程里;
* alert(a);

## No.4 以下代码执行顺序是什么?(setTimeout、Promise、then)

```js
setTimeout(function() {
    console.log("定时器开始");
}, 0);
new Promise((resolve) => {
    console.log("马上执行for循环");
    for (var i = 0; i < 10000; i++) {
        i == 9 && resolve();
    }
}).then(() => {
    console.log("执行then函数");
});
console.log("代码执行结束");
```
执行顺序:马上执行for循环->代码执行结束->执行then函数->定时器开始
分析如下:
首先执行script下的宏任务,遇到setTimeout,将其放到宏任务的“队列”里;
遇到new Promise直接执行,打印“马上执行for循环”;
遇到then方法,是微任务,将其放到微任务的“队列”里;
打印“代码执行结束”

本轮宏任务执行完毕,查看本轮的微任务,发现有一个then方法里的函数,打印“执行then函数”
到此,本轮的event loop全部完成;

下一轮的循环里,先执行一个宏任务,发现宏任务的“队列”里有一个setTimeout里的函数,执行打印“定时器开始”

## No.5 什么是Promise?

是异步编程的一种解决方案,有三种状态:pending(进行中)、fulfilled(已成功)、rejected(已失败).
它可以帮助我们更好地处理异步操作.

```js
new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("result");
    }, 100);
}).then(console.log)
.catch(console.error);
```

## No.5 Promise在以下代码的执行链路顺序是什么样的?

```js
Promise.resolve(1)
.then((x) => x + 1)
.then((x) => {throw new Error("My Error")})
.catch(() => 1)
.then((x) => x + 1)
.then((x) => console.log(x))
.catch(console.error);
```

分析:
* 创建新的Promise对象,resolve值为1
* x为1, 加1之后返回2
* x为2,但是没有用到,抛出一个错误;
* 捕获错误,但是没有处理,返回1
* x为1,加1之后返回2
* x为2,打印2
* 不会执行最后一行catch,因为没有错误抛出

## No.6 如何用闭包、作用域的角度分析以下代码?

```js
var value1 = 0;
var value2 = 0;
var value3 = 0;
for (var i = 1; i <= 3; i++) {
    var i2 = i;
    (function() {
        var i3 = i;
        console.log(i);
        setTimeout(function() {
            value1 += i;
            value2 += i2;
            value3 += i3;
        },1);
    })();
}
setTimeout(function() {
    console.log(value1, value2, value3);
}, 100);
```
分析结果:
* 匿名自执行函数与闭包的关系作用域与setTimeout的闭包引用i在for循环下对应的是4, 4, 4,执行三次的闭包,value1=4+4+4=12;
* 闭包外部匿名函数的作用域与setTimeout的闭包引用i2在for循环下对应的是3, 3, 3,执行三次闭包value2=3+3+3=9;
* 闭包内部匿名函数的作用域与setTimeout的闭包引用i3在for循环下对应1, 2, 3,不同闭包实例相加value3=1+2+3=6.

## No.7 JS同步和异步代码的区别、变量作用域、闭包的理解

1. 以下代码的执行结果是什么?

```js
for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(new Date, i);
    }, 1000);
}
console.log(new Date, i);
```
执行结果:5,5,5,5,5,5

2. 用肩头函数表示其前后的两次输出之间有1秒的时间间隔

```js
for (var i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(new Date, i);
    }, 1000);
}
console.log(new Date, i);
```

执行结果是:5,5,5,5,5,5

3.如果期望代码的输出变成5->0,1,2,3,4

* 一种做法:

```js
// 采用闭包
for (var i = 0; i < 5; i++) {
    (function(j) {
        setTimeout(function() {
            console.log(new Date, i);
        },1000);
    })(i);
}
console.log(new Date, i);
```

* 另一种做法:采用参数传递时按值传递的特征

```js
// 采用参数传递时按值传递的特征
var output = function(i) {
    setTimeout(function() {
        console.log(new Date, i);
    }, 1000);
}
for (var i = 0; i < 5; i++) {
    output(i);
}
console.log(new Date, i);
```

* 第三种方法:使用ES6块级作用域,不过最后一行代码执行会报错,只能算对一半

```js
for (let i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(new Date, i);
    }, 1000);
}
console.log(new Date, i);
```

4. 期望代码的输出变成0->1->2->3->4->5,且要求原有的代码块中循环和两处console.log不变.

* 第一种方法:

```js
// 0~4的输出结果
for (var i = 0; i < 5; i++) {
    (function(j) {
        setTimeout(function() {
            console.log(new Date, j);
        }, 1000 * j);
    })(i);
}
setTimeout(function() {
    console.log(new Date, i);
}, 1000 * i);
```

* 第二种方法:基于Promise解决方案

```js
const tasks = [];
for (var i = 0; i < 5; i++) {
    ((j) => {
       tasks.push(new Promise((resolve) => {
           setTimeout(() => {
               console.log(new Date, j);
               resolve();
           }, 1000 * j);
       }));
    })(i);
}
Promise.all(tasks).then(() => {
    setTimeout(() => {
        console.log(new Date, i);
    }, 1000);
});
```

* 第三种方法:ES6的代码写法

```js
const tasks = [];
const output = (i) => new Promise((resolve) => {
    setTimeout(() => {
        console.log(new Date, i);
        resolve();
    }, 1000 * i);
});
for (var i = 0; i < 5; i++) {
    tasks.push(output(i));
}
Promise.all(tasks).then(() => {
    setTimeout(() => {
        console.log(new Date, i);
    }, 1000);
});
```

* 第四种:使用ES7 async/await特性来优化代码

```js
const sleep = (timeountMS) => new Promise((resolve) => {
    setTimeout(resolve, timeountMS);
});
(async () => {
    for (var i = 0; i < 5; i++) {
        await sleep(1000);
        console.log(new Date, i);
    }
    await sleep(1000);
    console.log(new Date, i);
})();
```

## No.8 关系型数组如何转成树形结构对象?

> 思路: 先找到它的根元素,然后根据id和parent来判断它们之间的关系.

* 关系型数组

```js
var obj = [
    {id: 3, parent: 2},
    {id: 1, parent: null},
    {id: 2, parent: 1},
];
```

* 期望结果:

```js
o = {
    obj: {
        id: 1,
        parent: null,
        child: {
            id: 2,
            parent:1,
            child: {
                id: 3,
                parent: 2
            }
        }
    }
}
```

实现源码:

```js
var obj = [
    {id: 3, parent: 2},
    {id: 1, parent: null},
    {id: 2, parent: 1},
];
function treeObj(obj) {
    obj.map(item => {
        if (item.parent !== null) {
            obj.map(o => {
                if (item.parent === o.id) {
                    if (!o.child) {
                        o.child = [];
                    }
                    o.child.push(item);
                    o.child = o.child;
                }
            })
        }
    })
    return obj.filter(item => item.parent === null)[0];
}
treeObj(obj);
```

## No.9 请用js实现一个函数parseUrl(url),将一段url字符串解析为Object.

> 思路:需要先了解URL(统一资源定位符),另外还需要了解URI(统一资源标识符),URI最常见的形式是URL.URL一般包括协议、域名、端口、query、param等.可以通过创建一个a标签来将字符串转成URL.

```js
parseUrl("http://www.baidu.com/product/list?id=111&sort=discount#title");
```

期望结果:

```js
{
    protocol: "http",
    host: "www.baidu.com",
    path: "/product/list",
    params: {
        id: "111",
        sort: "discount"
    },
    hash: "title"
}
```

```js
// 实现代码
function parseUrl(url) {
    let a = document.createElement("a");
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (() => {
            let ret = {};
            let querys = [];
            let searchQuery = a.search.replace(/^\?/,'').split('&');
            for (var i = 0; i < searchQuery.length; i++) {
                if (searchQuery[i]) {
                    querys = searchQuery[i].split('=');
                    ret[querys[0]] = querys[1];
                }
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i)),
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}
parseUrl("http://www.baidu.com/product/list?id=111&sort=discount#title");
```

## No.10 数组元素的排列组合问题

> 思路: 每次取数组中的一个数,然后将剩余的数,依次加入到该数的组合数组中

```js
[1, 2, 3]
```

* 期望结果是全排列:

```js
[[1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]]
```

实现代码:

```js
function Permutations(target, size, origin) {
    let _arr = [];
    function getArrange(target, nums, ret) {
        if (nums === 1) {
            for (let i = 0; i < target.length; i++) {
                let tmp = ret.slice();
                tmp.push(target[i]);
                _arr.push(tmp);
            }
        } else {
            nums -= 1;
            for (let i = 0; i < target.length; i++) {
                let tmp = ret.slice();
                let newTarget = target.slice();
                tmp.push(target[i]);
                newTarget.splice(i, 1); // 按i索引读取1个元素
                getArrange(newTarget, nums, tmp);
            }
        }
    }
    getArrange(target, size, origin);
    return _arr;
}
Permutations([1, 2, 3], 2, []); // [[1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]]
```

* 期望结果是

```js
[[1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4]]
```

> 思路:取一个数,加入到数组中,接着再取一个数加入数组,直到需要的num为0.

```js
function Permutations(arr, nums) {
    let ret = [];
    function getRet(origin, target, nums) {
        if (nums === 0) {
            ret[ret.length] = origin;
            return;
        }
        for (let i = 0; i <= target.length - nums; i++) {
            let tmp = origin.slice();
            tmp.push(target[i]);
            getRet(tmp, target.slice(i + 1), nums - 1);
        }
    }
    getRet([], arr, nums);
    return ret;
}
Permutations([1, 2, 3, 4], 3); // [[1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4]]
```

## No.11 JS如何判断一组数字是否连续

```js
// 当出现连续数字的时候以'-'输出
[1, 2, 3, 4, 6, 8, 9, 10]
```

期望结果:

```js
["1-4", 6, "8-10"]
```

* 原理:判断前后数字是否相差为1,如果是则加入同一个数组

* 实现代码,判断是否连续:

```js
var arrange = (arr) => {
    let result = [];
    let temp = [];
    arr.sort((source, dest) => {
        return source - dest;
    }).concat(Infinity).reduce((source, dest) => {
        temp.push(source);
        // 如果后一个元素减去前一个元素大于1,重新用新的临时数组存储
        if (dest - source > 1) {
            result.push(temp);
            temp = [];
        }
        return dest;
    });
    return result;
};
arrange([1, 2, 3, 4, 6, 8, 9, 10]); // [[1, 2, 3, 4], [6], [8, 9, 10]]
```

* 数据格式化

```js
var formatarr = (arr) => {
    let newArr = [];
    let arr1 = arrange(arr);
    for (let i in arr1) {
        let str = "";
        if (arr1[i].length > 1) {
            str = arr1[i][0] + '-' + arr1[i][arr1[i].length - 1]; // 头尾元素用-相连
            newArr.push(str);
        } else {
            newArr.push(arr1[i][0]);
        }
    }
    return newArr;
}
formatarr([1, 2, 3, 4, 6, 8, 9, 10]); // ["1-4", 6, "8-10"]
```

## No.12 异步事件代码段分析

```js
const fs = require('fs');
console.log('beginning of the program');
const promise = new Promise(resolve => {
    console.log('this is promise function!');
    resolve('resolved message');
});
promise.then(() => {
    console.log('this is the first resolved promise');  
}).then(() => {
    console.log('this is the second resolved promise');
});
process.nextTick(() => {
    console.log('this is the process next tick now');
});
fs.readFile('index.html', () => {
    console.log('index.html');
    setTimeout(() => {
        console.log('readFile setTimeout with 0ms delay');
    }, 0);
    setImmediate(() => {
        console.log('readFile setImmediate callback');
    });
});

setTimeout(() => {
    console.log('setTimeout with 0ms delay');
}, 0);

setImmediate(() => {
    console.log('setImmediate callback');
});
```

正确的执行顺序如下:

```js
beginning of the program
this is promise function!
this is the process next tick now
this is the first resolved promise
this is the second resolved promise
setTimeout with 0ms delay
index.html
setImmediate callback
readFile setImmediate callback
readFile setTimeout with 0ms delay
```

## No.13 javascript中数组对象求交集、并集、补集

```js
const a = [
        {
        'categoryId': 1,
        'categoryIdLevelOne': 750611334,
        'categoryIdLevelThree': 750611336,
        'categoryIdLevelTwo': 750611335,
        'id': 2697,
        'level': 3,
        'shopId': 12430,
        'skipLayoutFlag': false,
        'status': 1
    },
    {
        'categoryId': 2,
        'categoryIdLevelOne': 750611472,
        'categoryIdLevelTwo': 750611473,
        'id': 2701,
        'level': 2,
        'shopId': 12430,
        'skipLayoutFlag': false,
        'status': 2
    },
    {
        'categoryId': 3,
        'categoryIdLevelOne': 750611487,
        'categoryIdLevelTwo': 750611488,
        'id': 2702,
        'level': 2,
        'shopId': 12430,
        'skipLayoutFlag': false,
        'status': 1
    }
];
const b = [
    {
        'categoryId': 2,
        'categoryIdLevelOne': 750611334,
        'categoryIdLevelThree': 750611336,
        'categoryIdLevelTwo': 750611335,
        'id': 2697,
        'level': 3,
        'shopId': 12430,
        'skipLayoutFlag': false,
        'status': 1
    },
    {
        'categoryId': 3,
        'categoryIdLevelOne': 750611472,
        'categoryIdLevelTwo': 750611473,
        'id': 2701,
        'level': 2,
        'shopId': 12430,
        'skipLayoutFlag': false,
        'status': 2
    },
    {
        'categoryId': 4,
        'categoryIdLevelOne': 750611487,
        'categoryIdLevelTwo': 750611488,
        'id': 2702,
        'level': 2,
        'shopId': 12430,
        'skipLayoutFlag': false,
        'status': 1
    }
];
```

* 交集：

```js
const c = a.filter( a => b.some(b => b.categoryId  === a.categoryId));
```

* 补集（差集）

```js
const d = a.filter(x => b.every(y => y.categoryId !== x.categoryId));
```

* 并集

```js
const e = b.filter(y => a.every(x => x.categoryId !== y.categoryId)).concat(a);
```

## 14. 下面代码输出什么？

```js
const box = {x: 10, y: 20};
Object.freeze(box);
const shape = box;
shape.x = 100;
console.log(shape); // {x: 10, y: 20}
```

Object.freeze使得无法添加、删除或修改对象的属性（除非属性的值是另一个对象）。

当我们创建变量shape并将其设置为等于冻结对象box时，shape指向的也是冻结对象。你可以使用Object.isFrozen检查一个对象是否被冻结，上述情况，Object.isFrozen(shape)将返回true。

由于shape被冻结，并且x的值不是对象，所以我们不能修改属性x。x仍然等于10，{x: 10, y: 20}被打印。

注意，上述例子我们对属性x进行修改，可能会导致抛出TypeError异常（最常见但不仅限于严格模式下时）。

## 15. 下面代码输出什么？

```js
const { name: myName } = { name: "Lydia" };
console.log(name); // ReferenceError
```

当我们从右侧的对象解构属性name时，我们将其值Lydia分配给名未myName的变量。
使用{name: myName}, 我们是在告诉JavaScript要创建一个名为myName的新变量，并且其值是右侧对象的name属性的值。

当我们尝试打印name，一个未定义的变量时，就会引发ReferenceError。

## 16. 以下是个纯函数么？

```js
function sum(a, b) {
    return a + b;
}
```

是一个纯函数，纯函数一种若输入参数相同，则永远会得到相同输出的函数。
sum函数总是返回相同的结果。如果我们传递1和2，它将总是返回3而没有副作用。如果我们传递5和10，它将总是返回15，依次类推，这是纯函数的定义。

## 17. 下面代码输出什么？

```js
const add = () => {
    const cache = {};
    return num => {
        if (num in cache) {
            return `From cache! ${cache[num]}`;
        } else {
            const result = num + 10;
            cache[num] = result;
            return `Calculated! ${result}`;
        }
    };
}
const addFunction = add();
console.log(addFunction(10));
console.log(addFunction(10));
console.log(addFunction(5*2));
```

add函数是一个记忆函数。通过记忆化，我们可以缓存函数的结果，以加快其执行速度。上述情况，我们创建一个cache对象，用于存储先前返回过的值。

如果我们使用相同的参数多次调用addFunction函数，它首先检查缓存中是否已有该值，如果有，则返回缓存值，这将节省执行时间。如果没有，那么它将计算该值，并存储在缓存中。

我们用相同的值三次调用了addFunction函数：

在第一次调用，num等于10时函数的值尚未缓存，if语句numincache返回false，else块的代码被执行；Calculated!20，并且其结果被添加到缓存对象，Cache现在看起来像{10: 20}.

第二次，cache对象包含10的返回值。if语句numincache返回true，Fromcache!20被打印。

第三次，我们将5*2(值为10)传递给函数。cache对象包含10的返回值。if语句numincache返回true，Fromcache!20被打印。

## 18. 下面代码输出什么？

```js
const myLifeSummedUp = ["a", "b", "c", "d"];
for (let item in myLifeSummedUp) {
    console.log(item); // 0 1 2 3
}
for (let item of myLifeSummedUp) {
    console.log(item); // "a" "b" "c" "d"
}
```

通过for-in循环，我们可以遍历一个对象自有的、继承的、可枚举的、非Symbol的属性。在数组中，可枚举属性是数组的“键”，即它们的索引。类似于下面这个对象：

```js
{0: "a", 1: "b", 2: "c", 3: "d"}
```
其中键则是可枚举属性，因此0，1，2，3被记录。
通过for-of循环，我们可以迭代可迭代对象（包括Array，Map，Set，String, arguments等）。当我们迭代数组时，在每次迭代中，不同属性的值将被分配给变量item，因此"a", "b", "c", "d"被打印。

## 19. 下面代码输出什么？

```js
const list = [1 + 2, 1 * 2, 1 / 2];
console.log(list); // 3, 2, 0.5
```

数组元素可以包含任何值。数字，字符串，布尔值，对象，数组，null, undefined，以及其他表达式，如日期，函数和计算。

元素将等于返回的值。1+2返回3，1*2返回2，1/2返回0.5.

## 20. 下面代码输出什么？

```js
function sayHi(name) {
    return `Hi there, ${name}`;
}
console.log(sayHi()); // Hi there, undefined
```

默认情况下，如果不给函数传参，参数的值为undefined。上述情况，我们没有给参数name传值。name等于undefined，并被打印。

在ES6中，我们可以使用默认参数覆盖此默认的undefined值。例如：

```js
function sayHi(name = "Lydia") {...}
```
在这种情况下，如果我们没有传递值或者如果我们传递undefined，name总是等于字符串Lydia。

## 21. 下面代码输出什么？

```js
var status = "a";
setTimeout(() => {
    const status = "b";
    const data = {
        status: "c",
        getStatus() {
            return this.status
        }
    }
    console.log(data.getStatus()); // c
    console.log(data.getStatus.call(this)); // a
}, 0);
```

this关键字的指向取决于使用它的位置。在函数中，比如getStatus，this指向的是调用它的对象，上述例子中data对象调用了getStatus，因此this指向的就是data对象。当我们打印this.status时，data对象的status属性被打印，即"c"。

使用call方法，可以更改this指向的对象。data.getStatus.call(this)是将this的指向由data对象更改为全剧对象。在全局对象上，有一个名为status的变量，其值为"a"，因此打印this.status时，会打印"a"。

## 22. 下面代码输出什么？

```js
const person = {
    name: "Lydia",
    age: 21
}
let city = person.city;
city = "Amsterdam";
console.log(person); // {name: "Lydia", age: 21}
```

我们将变量city设置为等于person对象上名为city的属性值。这个对象上没有名为city的属性，因此变量city的值为undefined。

请注意，我们没有引用person对象本身，只是将变量city设置为等于person对象上city属性的当前值。

然后，我们将city设置为等于字符串"Amsterdam"。这不会更改person对象，没有对该对象的引用。

因此打印person对象时，会返回未修改的对象。

## 23. 下面代码输出什么？

```js
function checkAge(age) {
    if (age < 18) {
        const message = "xxx";
    } else {
        const message = "yyy";
    }
    return message;
}
console.log(checkAge(21)); // undefined
```

const和let声明的变量是具有块级作用域的，块是大括号({})之间的任何东西，即上述情况if/else语句的花括号。由于块级作用域，我们无法在声明的块之外引用变量，因此抛出ReferenceError。

## 24. 什么样的信息将被打印？

```js
fetch('https://www.website.com/api/user/1')
  .then(res => res.json()) // 第一个.then()中回调方法返回的结果
  .then(res => console.log(res))
```
第二个.then中res的值等于前一个.then中的回调函数返回的值。你可以像这样继续链接.then，将值传递给下一个处理程序。

## 25. 哪个选项是将hasName设置为true的方法，前提是不能将true作为参数传递？

```js
function getName(name) {
    const hasName = //
}
```
A: !!name B: name C: newBoolean(name) D: name.length

使用逻辑非运算符!，将返回一个布尔值，使用!!name，我们可以确定name的值是真的还是假的。如果name是真实的，那么!name返回false，!falase返回为true。

通过将hasName设置为name，可以将hasName设置为等于传递给getName函数的值，而不是布尔值true。

newBoolean(true)返回一个对象包装器，而不是布尔值本身。

name.length返回传递的参数的长度，而不是布尔值true。

## 26. 实现一个事件收发器Event类，继承自此类的对象拥有on,off,once和trigger方法

```js
const event = new Event();
function log(val) { console.log(val);};
event.on('foo_event', log);
event.trigger('foo_event', 'abc'); // 打印出abc
event.off('foo_event', log);
event.trigger('foo_event', 'abc'); // 打印出undefined
```

实现代码

```js
function Event() {
    if (!(this instanceof Event)) {
        return new Event();
    }
    this._callbacks = {};
}
Event.prototype.on = function(type, handler) {
    this._callbacks = this._callbacks || {};
    this._callbacks[type] = this._callbacks[type] || [];
    this._callbacks[type].push(handler);
    return this;
};
Event.prototype.off = function(type, handler) {
    let list = this._callbacks[type];
    if (list) {
        for (let i = list.length; i >= 0; --i) {
            if (list[i] === handler) {
                list.splice(i, 1);
            }
        }
    }
};
Event.prototype.trigger = function(type, data) {
    let list = this._callbacks[type];
    if (list) {
        for (let i = 0, len = list.length; i < len; ++i) {
            list[i].call(this, data);
        }
    }
};
Event.prototype.once = function(type, handler) {
    let self = this;
    function wrapper() {
        handler.apply(self, arguments);
        self.off(type, wrapper);
    }
    this.on(type, wrapper);
    return this;
}
```

# 参考

### [js浮点运算](https://blog.csdn.net/u013347241/article/details/79210840)

### [前端常见面试题](https://zhuanlan.zhihu.com/p/42581858)

