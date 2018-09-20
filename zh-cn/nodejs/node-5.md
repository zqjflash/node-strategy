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

## No.2 Promise如何模拟终止?

1. 当新对象保持"pending"状态时,原Promise链将会中止执行;
2. return new Promise(() => {}); // 返回"pending"状态的Promise对象;
3. 从如何停掉Promise链说起(Promise内存泄露问题)

## No.3 Promise放在try catch里面有什么结果?

1. Promise对象的错误具有冒泡性能,会一直向后传递,直到被捕获为止,也就是说,错误总会被下一个catch语句捕获;
2. 当Promise链中抛出一个错误时,错误信息沿着链路向后传递,直至被捕获.

## No.4 setTimeout与Promise关系?

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

## No.5 什么是EventEmitter?

Events是node.js中一个非常重要的core模块,在node中有许多重要的core API都是依赖其建立的.比如Stream是基于 Events实现的,而fs,net,http 等模块都依赖Stream.

EventEmitter是node中一个实现观察者模式的类,主要功能是监听和发射消息,用于处理多模块交互问题.

通过继承EventEmitter来使得一个具有node提供的基本的event方法,这样的对象可以称作emitter,而触发emit事件的cb则称作listener.

EventEmitter的核心实现:

```js
class EventEmitter {
    constructor() {
        this.events = {};
    }
    checkExistence(event) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
    }
    once(event, cb) {
        this.checkExistence(event);
        const cbWithRemove = (...args) => {
            cb(...args);
            this.off(event, cbWithRemove);
        };
        this.events[event].push(cbWithRemove);
    }
    on(event, cb) {
        this.checkExistence(event);
        this.events[event].push(cb);
    }
    off(event, cb) {
        this.checkExistence(event);
        this.events[event] = this.events[event].filter(
            registeredCallack => registeredCallback !== cb
        );
    }
    emit(event, ...args) {
        this.checkExistence(event);
        this.events[event].forEach(cb => cb(...args));
    }
}
```

## No.6 如何实现一个EventEmitter?

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

## No.7 EventEmitter有哪些典型应用?

* 模块间传递消息;
* 回调函数内外传递消息;
* 处理流数据,因为流是在EventEmitter基础上实现的;
* 观察者模式发射触发机制相关应用

使用emitter处理问题可以处理比较复杂的状态场景,比如TCP的复杂状态机,做多项异步操作的时候每一项都可能报错,这个时候.emit错误并且执行某些.once的操作可以快速定位到问题.

## No.8 怎么捕获EventEmitter的错误事件?

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

## No.9 domain的原理是?为什么要弃用它?

domain本质上是一个EventEmitter对象,捕获异步异常的基本思路是创建一个域,cb函数会在定义时继承上一层的域,报错通过当前域.emit("error", err)方法触发错误事件,将错误传递上去,从而使得异步错误可以被强制捕获.

但是,domain的引入也带来了更多新的问题,比如依赖的模块无法继承你定义的domain,导致写的domain无法cover依赖模块报错,而且,很多人由于不了解Node.js的内存/异步流程等问题,在使用domain处理报错的时候,没有做到完善的处理并盲目的让代码继续走下去,这很可能导致项目完全无法维护.

## No.10 EventEmitter中的newListener事件有什么用处?

newListener可以用来做事件机制的反射,特殊应用,事件管理等,当任何on事件添加到EventEmitter时,就会触发 newListener事件,基于这种模式,我们可以做很多自定义处理.

```js
const util = require("util");
const EventEmitter = require("events").EventEmitter;
function MyEmitter() {
    EventEmitter.call(this); // 定义一个类并实现call调用;
}
util.inherits(MyEmitter, EventEmitter); // 继承EventEmitter;
const emitter3 = new MyEmitter();
emitter3.on("newListener", function(name, listener) {
    console.log("新事件的名字:", name);
    console.log("新事件的代码:", listener);
    setTimeout(function() {
        console.log("我是自定义延时处理机制");
    }, 1000);
});
emitter3.on("hello", function() {
    console.log("hello node");
});
```

## No.11 EventEmitter的emit是同步还是异步?

EventEmitter的emit其实是同步的,在官方文档中有说明,如果有多个callback添加到监视器,最终会按照添加的顺序执行

* 接下来分析一段代码的执行结果是输出hi 1还是hi 2?

```js
const EventEmitter = require("events");
let emitter = new EventEmitter();
emitter.on('myEvent', () => {
    console.log('hi 1');
});
emitter.on('myEvent', () => {
    console.log('hi 2');
});
emitter.emit('myEvent');
// 最终的输出结果是 hi 1 -> hi 2
```

* 下面这段代码会不会死循环?

```js
const EventEmitter = require('events');
let emitter = new EventEmitter();
emitter.on('myEvent', () => {
    console.log('hi');
    emitter.emit('myEvent');
});
emitter.emit('myEvent');
```

// 执行结果会出现死循环,不断emit以及不断on处理

* 再往下这段代码呢?

```js
const EventEmitter = require('events'); 
let emitter = new EventEmitter(); 
emitter.on('myEvent', function sth () {
    emitter.on('myEvent', sth);
    console.log('hi');
});
emitter.emit('myEvent');
```

// 执行结果一次 hi:虽然监听两次on,但实际上是同步执行之后再打印.

## No.12 如何判断接口是否异步?是否只要有回调函数就是异步?

每个写node的人都有一套自己的判断方式: 

* 首先:先看文档说明;
* 其次:通过代码段进行console.log打印;
* 再次:看看是否有 IO 操作.

单纯使用回调函数并不一定是异步,IO的操作才可能是异步,除此之外还有使用setTimeout等方式实现异步.

## No.13 nextTick,setTimeout以及setImmediate三者有什么区别?

Node.js的特点是事件循环,其中不同的事件会分配到不同的事件观察者身上,比如idle观察者,定时器观察者,I/O观察者等等,事件循环每次循环称为一次Tick,每次Tick按照先后顺序从事件观察者中取出事件进行处理.

根据Node.js官方介绍,每次事件循环都包含了6个阶段,对应libuv源码中的实现,如下图:

![node-event-queue](/assets/node-event-queue.png)

* timers阶段:这个阶段执行timer(setTimeout、setInterval)的回调;
* I/O callbacks阶段:执行一些系统调用错误,比如网络通信的错误回调;
* idle,prepare阶段:仅 node 内部使用;
* poll阶段:获取新的 I/O 事件,适当的条件下,node将阻塞在这里;
* check 阶段:执行 setImmediate()的回调;
* close callbacks阶段:执行socket的close事件回调.

以一段示例代码分析三者的区别:

```js
setInterval(function () {
    setTimeout(function () { 
        console.log("setTimeout3");
    }, 0);
    setImmediate(function () { 
        console.log("setImmediate4");
    });
    console.log("console1"); 
    process.nextTick(function () {
        console.log("nextTick2"); 
    });
}, 100);
```

// 代码的执行顺序:console1->nextTick2->setTimeout3->setImmediate4->console1->nextTick2 setImmediate4->setTimeout3
优先级:nextTick->setImmediate/setTimeout(0)

## No.14 有这样一种场景,你在线上使用koa搭建了一个网站,这个网站项目中有一个你同事写的接口A,而A接口中在特殊情况下会变成死循环,那么首先问题是,如果触发了死循环,会对网站造成什么影响?

Node.js中执行js代码的过程是单线程的,只有当前代码都执行完,才会切入事件循环,然后从事件队列中pop出下一个回调函数开始执行代码,所以只要出现死循环,就阻塞整个js的执行流程了.

## No.15 如何实现一个sleep函数?

```js
function sleep(ms) {
    var start = Date.now();
    var expire = start + ms;
    while(Date.now() < expire) {
    }
    return;
}
```
本质上就是利用while(true)阻塞主线程

## No.16 如何实现一个异步的reduce?(注:不是异步完了之后同步reduce)

实现原理:利用promise.then递归执行

```js
function reduce(arr, cb, initial=null) {
    function iterator(res, vals, index) {
        // res为动态数组的首个元素,vals为除首个元素之外的动态数组,index为传入的索引
        if (vals.length == 1) {
            return cb(res, vals[0], index);
        }
        return cb(res, vals[0], index).then((n) => iterator(n, vals.slice(1), index+1));
    }
    if (initial) {
        return iterator(initial, arr, 1);
    } else {
        return iterator(arr[0], arr.slice(1), 0);
    }
}
function cb(res, i, index) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(res + i);
        }, 1000);
    });
}
const result = reduce([1, 2, 3, 4, 5], cb);
result.then((n) => {
    console.log(n);
});
```

## No.17 Node.js中的异步和同步怎么理解?

Node.js是单线程,异步是通过一次次的循环事件队列来实现的,同步则是阻塞式的IO,这在高并发情况下,将会是很大的性能问题,同步一般只在基础框架的启动时使用,用来加载配置文件,初始化程序.

Node.js异步简单划分为两种:硬异步和软异步;
硬异步是指由于IO操作或者外部调用走libuv而需要异步的情况,当然也存在readFileSync、execSync等例外情况.
软异步是指:通过setTimeout、nextTick、setImmediate等方式来实现的异步.

## No.18 有哪些方法可以进行异步流程的控制?

* 多层嵌套回调;
* 为每个回调写单独函数,函数里边再回调;
* 用第三方框架比方说async, q, promise等;
* 用es7 async/await

避免回调地狱的方式:

* 模块化将回调函数转换为独立的函数;
* 使用流程控制库,如async,q等;
* 使用Promise或yield和Generators;
* 使用async/await;

## No.19 怎样绑定Node程序到80端口?

* sudo su切换到root账号,然后启动Node进程;
* 使用apache/nginx做反向代理
  * apache反向代理是通过开启httpd.conf文件来实现
  * nginx反向代理在nginx.conf文件来实现

  ```js
  upstream domain {
      server 10.10.10.10:80, server 10.25,25.10:80
  }
  server {
      listen 80; server_name domain; location / {
      proxy_pass http://domain; }
  }
  ```
* 用操作系统的firewall iptables进行端口重定向;
iptables –A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-port 8080

* Node监听端口调整在1024以上,避开80

## No.20 有哪些方法可以让Node程序遇到错误后自动重启?

* runit 进程管理工具,运行在linux、macos等;
* forever简单的命令式Node.js的守护进程,能够启动、停止、重启,完全基于命令行;
* nohub npm start& 转进程后台运行;
* 使用crontab
* 使用pm2

这里重点描述一下pm2的主要特点:

* 支持进程行为配置;
* 支持集群模式,支持负载均衡,因为采用Node.js的cluster模块实现;
* 支持source map,此项针对js,source map文件是js源文件的信息文件;
* 支持热重启;
* 支持部署工作流,pm2可以依据测试环境和线上环境自动部署到不同的服务器;
* 支持监听重启,在文件更新等情况下实现进程自动重启;

接下来进一步分析PM2整个进程管理,以一张图示来说明:

![node-pm2-manager](/assets/node-pm2-manager.png)

流程分析:

* Client启动关联Daemon;
* Daemon有start、stop、close、kill进程的方法,与God的事件发射器EventEmitter关联;
* Satan ping进程是否活着或者关闭;
* Satan通知God
* God事件监听
* Satan通过God
* God事件监听
* God监听进程方法有ping、notifyKillPM2、duplicateProcessId等;
* God进程运行模式有两种:Cluster集群模式和fork模式;

## No.21 并行与并发有什么区别?

并行指的是同一时刻多个CPU同时执行任务;
并发指的是同一个CPU同时有多个任务竞争执行
Node.js通过事件循环来挨个抽取事件队列中的一个个Task执行,从而避免了传统的多线程情况下2个队列对应一个CPU的时候上下文切换以及资源争抢/同步的问题,所以获得了高并发的成就.

## No.22 async、await vs promise优点:

* async、await代码简洁;
* 对于错误处理,async、await可以同时处理同步和异步错误;
* promise在条件语句上会造成嵌套层级过多,可读性差;
* 中间值过滤问题;
* Promise链返回的错误栈没有给出错误发生位置的线索;
* 调试不能在箭头函数的返回处设置断点;

使用async/await如何避免回调地狱的写法:

```js
async function asyncAwaitIsYourNewBestFriend() {
    const api = new Api();
    const user = await api.getUser();
    const friends = await api.getFriends(user.id);
    const photo = await api.getPhoto(user.id);
    console.log('asyncAwaitIsYourNewBestFriend', {user, friends, photo});
}
```

使用async/await如何实现并行操作:

```js
async function asyncAwaitLoopsParallel() {
    const api = new Api();
    const user = await api.getUser();
    const friends = await api.getFriends(user.id);
    const friendPromises = friends.map(friend => api.getFriends(friend.id));
    const moreFriends = await Promise.all(friendPromises);
    console.log("asyncAwaitLoopsParallel", moreFriends);
}
```

使用async/await如何实现异步错误捕获:

```js
async function asyncAwaitTryCatch() {
    try {
        const api = new Api();
        await api.throwError();
    } catch(err) {
        console.error(err);
    }
}
```

