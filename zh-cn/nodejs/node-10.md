# 第十节 常用第三方类库async/express/koa

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

