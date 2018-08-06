# 第一节 概述

## No.1 Node.js架构是什么样的?

主要分为三层:应用层(业务代码)->V8 及 node 内置架构->操作系统 V8 是 node 运行的环境,可以理解为 node 虚拟机.
Node 内置架构又可分为三层:
核心模块(JS 实现)->C++绑定->libuv+CAes+http.
如下图:
![node.js-structure](/assets/node-structure.png)


