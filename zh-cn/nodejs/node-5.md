# 第五节 事件/异步

## No.1 promise中.then的第二个参数与.catch有什么区别?

promise.then()的第一个参数是状态从pendding转为resolve时的回调函数,第二个参数是状态从pendding转为reject的回调函数,只是一种状态处理;
而.catch是用于promise流程的异常处理.

另外关于同步与异步流程,以下一段代码进行分析执行结果:
```js
let doSth = new Promise((resolve, reject) => {
    console.log('hello');
    resolve();
});
doSth.then(() => {
    console.log('over');
});
// 结果是 hello over
```
注:Promise封装的代码肯定是同步的,然后then的执行是异步的.

## No.2 setTimeout与Promise关系?

看一个问题:setTimeout到10s之后再.then调用,那么hello是会在10s之后在打印吗?还是一开始就打印?

分析以下这段代码:

```js
let doSth = new Promise((resolve, reject) => {
    console.log("hello");
    resolve();
});
setTimeout(() => {
    doSth.then(()=> {
        console.log('over');
    });
}, 10000);
//先打印 hello,等待 10s 之后打印 over
```

继续查看下面这段代码:

```js
setTimeout(function() {
    console.log(1);
}, 0);
new Promise(function executor(resolve) {
    console.log(2);
    for (var i = 0; i < 10000; i++) {
        i == 9999 && resolve();
    }
    console.log(3);
}).then(function() {
    console.log(4);
});
console.log(5);
```
执行结果:2->3->5->4->1

## No.3 什么是EventEmitter?

Events是node.js中一个非常重要的core模块,在node中有许多重要的core API都是依赖其建立的.比如Stream是基于 Events实现的,而fs,net,http 等模块都依赖Stream.

EventEmitter是node中一个实现观察者模式的类,主要功能是监听和发射消息,用于处理多模块交互问题.

通过继承EventEmitter来使得一个具有node提供的基本的event方法,这样的对象可以称作emitter,而触发emit事件的cb则称作listener.

## No.4 如何实现一个EventEmitter?

主要分三步: 1) 定义一个类并实现call调用; 2) 继承EventEmitter; 3) 实例化调用

```js
const util = require("util");
const EventEmitter = require("events").EventEmitter;
function MyEmitter() {
    EventEmitter.call(this); // 定义一个类并实现call调用;
}
util.inherits(MyEmitter, EventEmitter); // 继承EventEmitter;
const em = new MyEmitter();
em.on("hello", function(data) {
    console.log("收到事件hello的数据:", data);
});
em.emit("hello", "EventEmitter传递消息真方便!");
```

## No.5 EventEmitter有哪些典型应用?

* 模块间传递消息;
* 回调函数内外传递消息;
* 处理流数据,因为流是在EventEmitter基础上实现的;
* 观察者模式发射触发机制相关应用

使用emitter处理问题可以处理比较复杂的状态场景,比如TCP的复杂状态机,做多项异步操作的时候每一项都可能报错,这个时候.emit错误并且执行某些.once的操作可以快速定位到问题.

## No.6 怎么捕获EventEmitter的错误事件?

监听error事件即可,如果有多个EventEmitter,也可以用domain来统一处理错误事件.

```js
const domain = require("domain");
const myDomain = domain.create();
myDomain.on("error", function(err) {
    console.log("domain接收到的错误事件", err);
});
myDomain.run(function() {
    const emitter1 = new MyEmitter();
    emitter.emit("error", "错误事件来自emitter1");
    const emitter2 = new MyEmitter();
    emitter.emit("error", "错误事件来自emitter2");
});
```

## No.20 domain的原理是?为什么要弃用它?

domain本质上是一个EventEmitter对象,捕获异步异常的基本思路是创建一个域,cb函数会在定义时继承上一层的域,报错通过当前域.emit("error", err)方法触发错误事件,将错误传递上去,从而使得异步错误可以被强制捕获.

但是,domain的引入也带来了更多新的问题,比如依赖的模块无法继承你定义的domain,导致写的domain无法cover依赖模块报错,而且,很多人由于不了解Node.js的内存/异步流程等问题,在使用domain处理报错的时候,没有做到完善的处理并盲目的让代码继续走下去,这很可能导致项目完全无法维护.

