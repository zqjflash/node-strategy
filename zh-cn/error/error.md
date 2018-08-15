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

