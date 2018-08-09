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



# 参考

## [Node.js充分利用CPU以及稳定性](https://segmentfault.com/a/1190000007343993)

