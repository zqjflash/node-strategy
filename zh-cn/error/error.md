# 第一节 错误处理/调试

## No.1 程序总是奔溃,怎样找出问题在哪里?有什么好的方法可以防止程序崩溃?

从系统层面来排查,常见的思路如下:

* node --prof 查看哪些函数调用次数多;
* memwatch和heapdump获得内存快照进行对比,查找内存溢出;
* 可以使用easy-monitor库来协助定位问题

从业务逻辑层面来排查,常见的思路如下:

* try-catch-finally
* EventEmitter/Stream error事件处理
* domain统一控制
* jshint静态检查
* jasmine/mocha进行单元测试

注:一般我们马上想到的是使用callback(err, data)这种形势处理错误,但是实际处理起来繁琐,并不具备强制性;
另外也会想到使用domain,不过要注意对引入的库不兼容的时候,无法完全覆盖错误.

## No.2 怎么处理未预料的出错?用try/catch,domains还有其它什么?

在Node.js中错误处理的主要有以下几种方式:

* callback(err, data)回调约定;
* throw/try/catch;
* EventEmitter的error事件.

callback(err, data)这种形式的错误处理起来繁琐,并不具备强制性,而domian模块也是半只脚踏进棺材.

那么比较好的处理方式则是下面这些:

1. 基于try/catch保护代码关键位置,以koa为例,可以通过中间件的形式来进行错误处理,之后的async/await均属于这种模式;

```js
app.use(async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});
app.on('error', (err, ctx) => {
    // ...
});
```

2. 通过EventEmitter的错误监听形式为各大关键的对象加上错误监听的回调,例如监听http server,tcp server等对象的error事件以及process对象提供的uncaughtException和unhandledRejection等;
3. 使用Promise来封装异步,并通过Promise的错误处理来handle错误;
4. 在大型项目中,追溯错误是比较麻烦的,可以通过使用verror这样的方式对Error一层层封装,并在每一层将错误的信息一层层的包上,最后拿到的Error直接可以从message中获取用于定位问题的关键信息.

## No.3 unhandledRejection是什么?

当Promise被reject且没有绑定监听处理时,就会触发该事件,该事件对排查和追踪没有处理reject行为的Promise很有用.

该事件的回调函数接收以下参数:

* reason <Error> | <any> : 该Promise被reject的对象(通常为Error对象)
* p: 被reject的Promise本身

```js
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
somePromise.then((res) => {
    return reportToUser(JSON.pasre(res)); // parse故意写成pasre,Promise没有处理catch
});
```

以下代码也会触发unhandledRejection事件:

```js
function SomeResource() {
    this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}
var resource = new SomeResource(); // 没有.catch或.then处理
```

## No.4 uncaughtException有什么作用?

当异常没有被捕获,而一路冒泡到Event Loop时就会触发process对象上的uncaughtException事件,默认情况下,Node.js对于此类异常会直接将其堆栈跟踪信息输出给stderr并结束进程.而为uncaughtException事件添加监听可以覆盖该默认行为,不会直接结束进程.

```js
process.on('uncaughtException', (err) => {
    console.log(`Caught exception: ${err}`);
});
setTimeout(() => {
    console.log('This will still run.');
}, 500);
nonexistentFunc(); // 故意造成异常,但没有捕获它
console.log('This will not run.');
```

__需要合理地使用uncaughtException__

* uncaughtException的初衷是可以让你拿到错误之后做一些回收处理,再执行process.exit,所以使用它其实算是一种非常规手段,应尽量避免使用它来处理错误.

* 如果在.on指定的监听回调中报错不会被捕获,Node.js的进程会直接终止并返回一个非零的退出码,最后输出相应的堆栈信息.否则,会出现无限递归.

* 所以在uncaughtException事件之后执行普通的恢复操作并不安全,官方建议是另外在专门准备一个monitor进程来做健康检查,并通过monitor来管理恢复情况,并在必要时重启.

## No.5 为什么要在cb的第一参数传error? 为什么有的cb第一个参数不是error, 例如http.createServer?

在Node.js约定中,越重要的参数越靠前,错误优先的回调函数用于传递错误和数据.第一个参数始终应该是一个错误对象.http.createServer()不管请求存在或者不存在都不需要对外界发出状态,因此没有错误这一说.

以文件读取错误优先的代码演示: 

```js
fs.readFile(filePath, function(err, data) {
    if (err) {
        // 处理错误
        return console.log(err);
    }
    console.log(data);
```

## No.6 内存泄露通常由哪些原因导致?如何分析以及定位内存泄露?

通常是程序未能释放已经不再使用的内存导致泄露

在Node.js中内存泄露的原因就是本该清除掉的对象,被可到达对象引用以后,未被正确的清除而常驻内存.

内存泄露的几种情况:

1. 全局变量;
2. 闭包;
3. 事件监听也可能出现内存泄露,例如对同一个事件重复监听,忘记移除,将造成内存泄露;
4. 缓存对象非常多;
5. 高CPU同步代码造成请求堆积引发内存占用过高.

定位内存泄露:

1. 重现内存泄露情况:
  
  * 对于只要正常使用就可以重现的内存泄露,测试环境模拟即可排查;
  * 对于偶发的内存泄露,一般会与特殊的输入有关,如果不能通过代码的日志定位,就需要去现网打印内存快照.

2.打印内存快照:

快照工具推荐使用heapdump,可以用它来保存内存快照,使用devtools来查看内存快照,使用heapdump保存内存快照时,只会有Node.js环境中的对象.不会受到干扰,如果使用node-inspector的话,快照中会有前端的变量干扰;

```js
const heapdump = require("heapdump");
const save = function() {
    gc();
    heapdump.writeSnapshot("./" + Date.now() + '.heapsnapshot');
}
```

注: 打印快照之前,node启动时加上--expose-gc, 比如 node --expose-gc index.js

3. 打印3个内存快照

* 内存泄露之前的内存快照;
* 少量测试以后的内存快照;
* 多次测试以后的内存快照;

## No.7 什么是防御性编程?与其相对的let it crash又是什么?

防御性编程是一种细致、谨慎的编程方法.尽可能的通过代码对设想进行检查,防止错误代码产生错误的行为.

防御性编程的技巧:

1. 采用良好的编程风格,来防范大多数编码错误;
2. 不要仓促地写代码;
3. 不要相信任何人;
4. 编码的目标是清晰,不只是简洁;
5. 不要让任何人做让他们不该做的修补工作;
6. 检查所有的返回值;
7. 审慎地处理内存;
8. 使用安全的数据结构;
9. ...

Erlang说的let it crash.是指不必过分担心位置的错误而做极其细致的防御性编程,而是将发生错误的process进行汇报处理,并尝试修复服务.

## No.8 如何调试Node.js程序?

* 使用console.log
* 使用node-inspector
* 使用built-in debugger(类似vscode的debug)

## No.9 IOS与android远程调试的差异在哪里?

主要差异在协议格式上:

ios调试协议使用自己的RPC规范,数据格式只接受bplist格式,就是类xml格式;
android调试协议使用ADB和webSocket,数据格式接受JSON格式;

另外,由于IOS的内核是闭源,导致我们很难对webkit内核进行修改.

## No.10 运算错误与程序员错误的区别?

运算错误是和系统相关的问题,例如请求超时或者硬件故障;
程序员错误:比如变量undefined、异常边界未处理等;

# 参考

## [如何分析 Node.js 中的内存泄漏](https://zhuanlan.zhihu.com/p/25736931?group_id=825001468703674368)

## [防御性编程的介绍与技巧](http://blog.jobbole.com/101651/)