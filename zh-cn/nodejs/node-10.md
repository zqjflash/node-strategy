# 第十节 框架与类库

## No.1 Express 与 koa 差异有哪些?

Express:基于 Connect 中间件,并且自身封装了路由,视图处理等功能.
Koa:主要是基于co中间件,框架自身不包含任何中间件.很多功能需要借助第三方中间件解决.基于 ES6 generator 特性的异步流程控制.移除了 router、view 等功能

* 区别一:路由处理
Express 自身继承;
Koa 需要引入 koa-route;

* 区别二:视图
Express 自身集成视图功能,提供了 consolidate.js(一款js模板引擎整合库,支持现今流行的多种模板引擎) 功能,支持几乎所有 js 模版引擎,并提 供了视图设置等便利方法.
Koa 需要引入 co-views 中间件.

* 区别三:HTTP Request
Express:获取post数据需要body-parser中间件
Koa:获取post数据需要co-body中间件

* 区别四:异步流程控制
Express采用callback来处理异步
Koa:1.0采用generator; 2.0采用async/await

* 区别五:错误处理
Express使用callback捕获异常,对于深层次的异常捕获不了;
Koa使用try-catch,能更好地解决异常捕获

## No.2 第三方类库async库都有哪些常用的方法?

async是一个js类库,它的目的是解决js中异步流程难以控制的问题

1. 并行执行完多个函数后,调用结束函数:

```js
async.parallel([
        function() { console.log("log1"); },
        function() { console.log("log2"); }
    ],
    function() { console.log("log3"); }
);
```

2. 串行执行完多个函数后,调用结束函数:

```js
async.series([
    function() { console.log("log1"); },
    function() { console.log("log2"); }
]);
```

3. 依次执行多个函数,后一个函数以前面的函数结果作为输入参数:

```js
async.waterfall([
    function(callback) {
        callback(null, "one", "two");
    },
    function(arg1, arg2, callback) {
    }
]);
```

4. 异步执行多个数组,返回结果数组

```js
async.map(["file1", "file2"], fs.stat, function(err, results) {
    // ...
});
```

5. 异步过滤多个数组,返回结果数组

```js
async.filter(["file1", "file2"], fs.exists, function(results) {
    // ...
});
```

## No.3 express框架结构是什么样的?

* bin/express: 是在命令行下生成express框架目录文件用的
* lib/express: 是框架的入口文件
* lib/router: 是路由模块,主要是进行路由分发,比对,执行callback
* lib/middleware: 是中间件模块,主要是对response,request进行改写
* lib/request: 请求
* lib/response: 响应
* lib/utils: 工具集函数,是对connect模块的一个补充,比如地址处理正则
* lib/view: 处理视图

整体如下图示:

![node-express](/assets/node-express.png)

## No.4 express都有哪些常用的函数?

* express.Router路由组件;
* app.get路由定向;
* app.configure配置;
* app.set设定参数;
* app.use使用中间件.

## No.5 express中如何获取路由的参数?

* 第一种路由规则: /users/:name, 使用req.params.name来获取;
* 第二种路由规则: 获得表单或post传入的参数name, 使用req.body.username;

express路由支持常用通配符?,+,*,and(),看一段示例代码:

```js
// 此路由路径将匹配 acd 和 abcd
app.get("/ab?cd", function(req, res) {
    res.send("ab?cd");
});
```

## No.6 express response有哪些常用方法?

* res.download() 弹出文件下载
* res.end() 结束response
* res.json() 返回json
* res.jsonp() 返回jsonp
* res.redirect() 重定向请求
* res.send() 返回多种形式数据
* res.sendFile 返回文件
* res.sendStatus() 返回状态

