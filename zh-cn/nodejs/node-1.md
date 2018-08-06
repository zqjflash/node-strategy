# 第一节 概述

## No.1 Node.js架构是什么样的?

主要分为三层:应用层(业务代码)->V8 及 node 内置架构->操作系统 V8 是 node 运行的环境,可以理解为 node 虚拟机.
Node 内置架构又可分为三层:
核心模块(JS 实现)->C++绑定->libuv+CAes+http.
如下图:

![node.js-structure](/assets/node-structure.png)

## No.2 Node.js事件循环机制是什么样的?

Node.js采用的是单线程的处理机制(所有的 I/O 请求都采用非阻塞的工作方式),而在底层 是借助 libuv 来作为抽象封装层
Libuv 库负责 Node API 的执行,它将不同的任务分配给不同的线程,形成一个事件循环, 以异步的方式将任务的执行结果返回给 V8 引擎.如下图示:

![node.js-eventloop](/assets/node-eventloop.png)

