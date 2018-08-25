# 第一节 如何造一个类PM2的进程管理工具

> 随着前端在边界领域的扩展,前端开发人员逐步在使用Node.js,那么如何像Java、C++这些传统后端语言的高性能、高可靠性,对于前端人员来说机遇与挑战并存.

本文的目的是提出一种Node.js进程管理的思想,希望引起大家的共勉.

## 一、预备基础知识

1. IPC通信方式

IPC通信的方式有: 管道、socket、信号量、共享内存、消息队列、domain socket等;
Node.js中实现IPC通道的是管道(pipe)技术.在Node中管道是个抽象层面的称呼,具体细节实现由libuv提供,在Windows下由命名管道(named pipe)实现,*nix系统则采用Unix Domain Socket实现.表现在应用层上的进程间通信只有简单的message事件和send()方法.

本文所讨论的是在linux系统下的Node.js IPC.我们知道在不同主机上的进程通信可以用套接字(socket)来实现,基于TCP/IP协议,只要指定IP和PORT.那么同一个主机的进程间通信还要指定IP和PORT,并要请求走完4层网络协议栈就太麻烦了.这是就可以用到unix domain socket(UDS).它不需要经过网络协议栈,不需要封包拆包、计算校验和、维护序号和应答等,只是将应用层数据从一个进程拷贝到另一个进程.IPC机制本质上是可靠的通讯,而网络协议是为不可靠的通讯设计等.

Unix Domain Socket也提供面向流和面向数据包两种API接口,类似于TCP和UDP,但是面向消息的Unix Domain Socket也是可靠的,消息既不会丢失也不会顺序错乱.在Node.js中,IPC通道被抽象成stream对象,在调用send()时发送数据,接收到消息会通过message事件触发给应用层.在linux系统中,UDS是通过内核直接将信息拷贝到另一个进程的内存空间中.如下图:

![unix-domain-socket](/assets/unix-domain-socket.png)

2. Node.js的事件驱动+多进程模型

Node.js是靠事件驱动(nginx方式),而不是多进程多线程(apache方式)来实现大量并发请求处理的.多进程多线程模型局限性在于内存资源的消耗、上下文切换的时间消耗,伸缩性不足.而基于事件驱动的服务模型存在两个问题: CPU利用率和进程的健壮性.

* CPU利用率&进程的健壮性

Node.js是单线程的,所有处理都在单线程上进行,影响模型性能的点在于CPU的运算能力,但它不受多进程或多进程模式中资源上限的影响,有更好的伸缩性.CPU多核时代到来后,单进程的Node.js应用无法实现CPU利用率的最大化,所以使用多进程、master-slave模型来尽可能地让CPU利用起来.

在Node v0.8前开发者是用child_process模块来搭建多进程模型,该模块要开发者自己负责多进程的网络端口监听、负载均衡、状态共享等细节问题.但Node v0.8之后引入了cluster模块,用来解决多核CPU的利用率问题.

![node-master-slave](/assets/node-master-slave.png)

master-slave模型,master进程不处理业务逻辑,业务逻辑分发到slave进程(即子进程)来进行处理,master进程只负责消息分发和对子进程的操作(子进程的创建、销毁、重新拉起等).在服务可靠性方面,多个工作进程提升了服务的稳定性,不会因一个进程出现问题而导致服务不可用.

## 二、设计一个Node进程管理

暂且先称呼node天眼(node-eye)
首先需要设计一个底层框架(可以是C++、Java、go)等,同时也需要实现基于JCE协议、ICE协议实现进程IPC;
然后需要设计一个进入引擎来打通框架与进程管理.

![node-architecture](/assets/node-architecture.png)

基于主框架下,考虑设计Node.js天眼的架构拓扑图

![node-topology](/assets/node-topology.png)




