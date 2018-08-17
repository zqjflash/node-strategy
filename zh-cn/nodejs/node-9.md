# 第九节 OS

## No.1 怎样让一个js文件变得像linux命令一样可执行?

* 在对应的xxx.js文件头部加入#!/usr/bin/env node
* chmod命令把js文件改为可执行即可,chmod +x xxx.js
* 进入文件目录,命令行输入xxx文件名,就是相当于运行node xxx.js

## No.2 什么是TTY?如何判断是否处于TTY环境?

"tty"原意是指"teletype"即打字机,"pty"则是"pseudo-teletype"即伪打字机,在Unix中,/dev/tty*是指任何表现的像打字机的设备,例如终端(terminal).
你可以通过w命令查看当前登录的用户情况,你会发现每登录了一个窗口就会有一个新的tty.

在Node.js中你可以通过stdio的isTTY来判断当前进程是否处于TTY(如终端)的环境.

```js
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```

## No.3 Node.js常用的CLI方法有哪些?

主要有以下4种使用方式:

* node [options][v8 options][script.js | -e "script"][arguments]
* node debug [script.js | -e "script" | :]...
* node --v8-options
* 无参数直接启动REPL环境

## No.4 不同操作系统的换行符(EOL)有什么区别?

通常由line feed(LF, \n)和carriage return(CR, \r)组成,常见的情况:

|  符号  | 系统 |
| ------ | ------ |
| LF(\n) | 在Unix或Unix相容系统(GNU/Linux,AIX,Xenix,Mac OSX,...)、BeOS、Amiga、RISC OS |
| CR+LF(\r\n) | MS-DOC、微软视窗操作系统(Microsoft Windows)、大部分非unix的系统 |
| CR(\r) | Apple II家族,Mac OS至版本9 |

如果不了解EOL跨系统的兼容情况,那么在处理文件的行分割/行统计等情况时可能会被坑.

## No.5 服务器负载是什么概念?如何查看负载?

负载是衡量服务器运行状态的一个重要概念,通过负载情况,我们可以了解服务器的运行状态是清闲,良好,繁忙还是即将crash.
通常我们要查看的负载是CPU负载

命令行上可以通过uptime,top命令,Node.js中可以通过os.loadavg()来获取当前系统的负载情况:

```js
load average: 0.09, 0.05, 0.01
```

其中分别是最近1分钟,5分钟,15分钟内系统CPU的平均负载,当CPU的一个核工作饱和的时候负载为1,有几核CPU那么饱和负载就是几.
在Node.js中单个进程的CPU负载查看可以使用pidusage模块;

```js
var pidusage = require("pidusage");
setInterval(function() {
    pidusage(process.pid, function(err, status) {
        console.log(status);
    });
},1000);
```

除了CPU负载,对于服务端还需要了解网络负载,磁盘负载等.

## No.6 ulimit有什么作用?

ulimit用于管理用户对系统资源的访问.

```js
-a 显示目前全部限制情况;
-c 设定core文件的最大值,单位为区块;
-d <数据节点大小>程序数据节区的最大值,单位为KB;
-f <文件大小> shell 所能建立的最大文件,单位为区块;
-H 设定资源的硬性限制,也就是管理员所设下的限制;
-n <文件描述符数目>指定同一时间最多开启的fd数;
-u <进程数目>用户最多可开启的进程数目;
```

注意:open socket等资源拿到的也是fd,所以ulimit -n比较小除了文件打不开,还可能建立不了socket链接.

## No.7 epoll与select的区别是什么?

* select的优点:
1. select目前几乎所有的平台都支持,有良好的跨平台性;

* select的缺点:
1. 单个进程能够监视的文件描述符的数量存在最大限制,在Linux上一般为1024.可以通过修改宏定义甚至重新编译内核的方式提升这一限制;

* epoll的优点:
1. epoll更加灵活,没有描述符限制,不会随着fd的数目增长而降低效率;
2. epoll使用一个文件描述符管理多个描述符,将用户关系的文件描述符的事件存放到内核的一个事件表中,这样在用户空间和内核空间的拷贝只需一次.

# 参考

## [Linux IO模式及 select、poll、epoll详解](https://segmentfault.com/a/1190000003063859#articleHeader15)
