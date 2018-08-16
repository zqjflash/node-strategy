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
