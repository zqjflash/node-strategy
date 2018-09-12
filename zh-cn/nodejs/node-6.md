# 第六节 进程

## No.1 怎样充分利用多个CPU?

Node.js提供了child_process模块,并且也提供了fork()方法来实现进程的复制
注:只要进程的复制都需要一定的资源和时间,Node复制进程需要不小于10M的内存和不小于30ms的时间
这样的解决方案就是*nix系统上最经典的Master-Worker模式，又称为主从模式,如下图:

![node-master-worker](/assets/node-master-worker.png)

另外注意的一点:启动多个进程,只是为了充分将CPU资源利用起来,而不是解决并发问题.

另外还需要考虑稳定性的问题:

* 工作进程存活状态管理;
* 工作进程平滑重启;
* 工作进程限量重启;
* 工作进程性能问题;
* 工作进程负载均衡;
* 工作进程状态共享;

## No.2 怎样调节node执行单元的内存大小?

用--max-old-space-size和--max-new-space-size来设置v8使用内存的上限.

## No.3 进程的当前工作目录是什么?有什么作用?

当前进程启动的目录,通过process.cwd()获取当前工作目录,通常是命令行启动的时候所在的目录(也可以在启动时指定),文件操作等使用相对路径的时候会相对当前工作目录来获取文件.

一些获取配置的第三方模块就是通过你的当前目录来找配置文件的.所以,如果你错误的目录启动脚本,可能没法得到正确的结果.在程序中可以通过process.chdir()来改变当前的工作目录.

## No.4 为什么需要child_process?

Node.js是异步非阻塞的,这对高并发非常有效,可是我们还有其它一些常用需求,比如和操作系统shell命令交互,调用可执行文件,创建子程序进行阻塞式访问或高CPU计算等,child_process就是为满足这些需求而生的,child_process顾名思义,就是把Node阻塞的工作交给子程序去做.

## No.5 child_process.fork与POSIX的fork有什么区别?

Node.js的child_process.fork()在Unix上的实现最终调用了POSIX fork(2),而POSIX的fork需要手动管理子进程的资源释放(waitpid),child_process.fork则不用关心这个问题,Node.js会自动释放,并且可以在option中选择父进程死后是否允许子进程存活.

* spawn()启动一个子进程来执行命令
  * options.detached 父进程死后是否允许子进程存活;
  * options.stdio指定子进程的三个标准流;

* spawnSync()同步版的spawn,可指定超时,返回的对象可获得子进程的情况;
* exec()启动一个子进程来执行命令,带回调参数获知子进程的情况,可指定进程运行的超时时间;
* execSync()同步版的exec(),可指定超时,返回子进程的输出(stdout);
* execFile()启动一个子进程来执行一个可执行文件,可指定进程运行的超时时间;
* execFileSync()同步版的execFile(),返回子进程的输出,如果超时或者exit code不为0,会直接throw Error;
* fork()加强版的spawn(), 返回值是ChildProcess对象可以与子进程交互.

其中exec/execSync方法会直接调用bash来解释命令,所以如果命令有外部参数,则需要注意被注入的情况.

## No.6 两个Node进程之间是怎么交互的?

可以用fork通信,原理是子程序用process.on和process.send,父进程用child.on和child.send进行交互.

进程通信示例代码:

* fork-parent.js

```js
const cp = require('child_process');
const child = cp.fork('./fork-child.js');
child.on('message', function(msg) {
    console.log('父进程接收子进程的数据:', msg);
});
child.send('父进程发送消息给子进程');
```

* fork-child.js

```js
process.on('message', function(msg) {
    console.log("子进程接收父进程的数据:", msg);
    process.send("子进程发送消息给父进程");
});
```

## No.7 child.kill与child.send有什么区别?

child.kill是基于信号系统; child.send是基于IPC;

## No.8 父进程或子进程的死亡是否会影响对方?什么是孤儿进程?

子进程死亡不会影响父进程,不过子进程死亡时(线程组的最后一个线程,通常是“领头”线程死亡时),会向它的父进程发送死亡信号.反之父进程死亡,一般情况下子进程也会随之死亡,但如果此时子进程处于可运行状态、僵死状态,子进程将被进程1(init进程)收养,从而成为孤儿进程.另外,子进程死亡的时候(处于“终止状态”),父进程没有及时调用wait()或waitpid()来返回死亡进程的相关信息,此时子进程还有一个PCB残留在进程表中,被称作僵尸进程.

## No.9 cluster是如何保证负载均衡的?

第一种方式(默认方式,不适用windows),通过时间片轮转法(round-robin)分发连接.主进程监听端口,接收到新连接之后,通过时间轮转法来决定将接收到的客户端的socket句柄传递给指定的worker处理.至于每个连接由哪个worker来处理,完全由内置的循环算法决定.

第二种方式是由主进程创建sokcet监听端口后,将socket句柄直接分发给相应的worker,然后当连接进来时,就直接由相应的worker来接收连接并处理.

使用第二种方式时,理论上性能应该比较高,但是实际上存在负载不均衡的问题,比如通常70%的连接仅被8个进程中的2个进程处理,而其他进程比较清闲.

## No.10 什么是守护进程?如何实现守护进程?

普通的进程在用户退出终端之后就会直接关闭,通过&启动到后台的进程,之后也会由于会话(session组)被回收而终止进程.守护进程是不依赖终端(tty)的进程,不会因为用户退出终端而停止运行的进程.

Node.js可以通过调用setsid来实现守护进程的,示例代码:

```js
const spawn = require("child_process").spawn;
const process = require("process");
const p = spawn('node', ['b.js'], {
    detached: true
});
```

在spawn的第三个参数中,可以设置detached属性,如果该属性为true,则会调用setsid方法.

```js
// 守护进程的C语言版本
void init_daemon()
{
    pid_t pid;
    int i = 0;
    
    if ((pid = fork()) == -1) {
        printf("Fork error !\n");
        exit(1);
    }
    if (pid != 0) {
        exit(0); // 父进程退出
    }
    setsid(); // 子进程开启新会话,并成为会话首进程和组长进程
    if ((pid = fork()) == -1) {
        printf("Fork error !\n");
        exit(-1);
    }

    if (pid != 0) {
        exit(0); // 结束第一子进程,第二子进程不再是会话首进程,避免当前会话组重新与tty连接
    }
    chdir("/tmp"); // 改变工作目录
    umask(0); // 重设文件掩码
    for(; i < getdtablesize(); ++i) {
        close(i); // 关闭打开的文件描述符
    }
    return;
}
```


## No.11 什么时候应该在后台进程中使用消息服务?怎么处理工作线程的任务,怎么给work安排任务?

消息队列适用于后台数据传输服务,比如发送邮件和数据图像处理.消息队列有很多解决方案,比如RabbitMQ和kafka.

# 参考

## [Node.js充分利用CPU以及稳定性](https://segmentfault.com/a/1190000007343993)

