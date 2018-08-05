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

# 参考

### [js浮点运算](https://blog.csdn.net/u013347241/article/details/79210840)

