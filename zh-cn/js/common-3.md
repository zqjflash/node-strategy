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

期望结果是全排列:

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
Permutations([1, 2, 3], 2, []);
```



# 参考

### [js浮点运算](https://blog.csdn.net/u013347241/article/details/79210840)

### [前端常见面试题](https://zhuanlan.zhihu.com/p/42581858)

