# 第一节 概述

## No.1 Node.js架构是什么样的?

主要分为三层:应用层(业务代码)->V8 及 node 内置架构->操作系统 V8 是 node 运行的环境,可以理解为 node 虚拟机.
Node 内置架构又可分为三层:
核心模块(JS 实现)->C++绑定->libuv+CAes+http.
如下图:

![node.js-structure](/assets/node-structure.png)

* Node.js标准库:由JS编写,即我们使用过程中直接能调用的API.
* Node bindings:这一层是 Javascript 与底层 C/C++ 能够沟通的关键，前者通过 bindings 调用后者，相互交换数据。
* libuv:它为 Node.js 提供了跨平台，线程池，事件池，异步 I/O 等能力，是 Node.js与os通讯的核心模块。

## No.2 Node.js事件循环机制是什么样的?

当Node.js进程启动时,Node.js会创建一个类似于while(true)的循环,每执行一次循环体的过程我们称之为一次Tick.每次Tick的过程就是查看是否有事件待处理,如果过,就取出事件相关毁掉函数.如果存在关联的回调函数,就执行它们.然后进入下一次循环,如果不再有事件处理,就退出进程.

在Node中,事件主要来源于网络请求、文件I/O等,这些事件对应的观察者有文件I/O观察者、网络I/O观察者等,观察者对事件进行分类.

事件循环是一个典型的生产者/消费者模型.异步I/O、网络请求等则是事件的生产者,源源不断为Node提供不同类型的事件,这些事件被传递到对应的观察者那里,事件循环则从观察者那里取出事件并处理.

Node.js采用的是单线程的处理机制(所有的 I/O 请求都采用非阻塞的工作方式),而在底层 是借助 libuv 来作为抽象封装层
Libuv 库负责 Node API 的执行,它将不同的任务分配给不同的线程,形成一个事件循环, 以异步的方式将任务的执行结果返回给 V8 引擎.如下图示:

![node.js-eventloop](/assets/node-eventloop.png)

事件循环分为6个阶段:timers->I/O callbacks->idle,prepare->poll->check->close callbacks

* timers 阶段:主要执行 setTimeout、setInterval 的回调;
* I/O callbacks 阶段:执行一些系统调用错误,比如网络通信的错误回调;
* idle/prepare 阶段:仅 node 内部使用;
* poll 阶段:获取新的 I/O 事件,适当的条件下 node 将阻塞在这里;
* check 阶段:执行 setImmediate()的回调;
* close callbacks 阶段:执行 socket 的 close 事件的回调.

有一个需要区分的地方:
浏览器的主进程运行机制是:macroTask 和 microTask 交替执行的
node 的主进程运行机制是,按顺序执行6个阶段主任务,每个阶段之间执行一批 microTask 任务队列

## No.3 Node.js 有哪些核心的模块?

* 全局对象:console、process等;
* 常用工具:util
* 事件机制:event,核心对象events.EventEmitter, error事件,以及基于event的stream和buffer.
* 文件系统访问:fs
* 网络模块:net/http

