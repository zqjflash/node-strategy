# 第二节 全局对象

## No.1 Node.js有哪些全局对象?

* 真正的全局对象:

  * Buffer
  * setInterval
  * setTimeout
  * clearInterval
  * clearTimeout
  * console
  * global
  * process

* 模块级别的全局对象:

  * __dirname
  * __filename
  * require()
  * module
  * exports

注:全局对象在使用的时候都不需要require

## No.2 process有哪些常用的方法?

* process.stdin, process.stdout, process.stderr, process.on, process.env,
* process.argv: 返回一个数组,由命令行执行脚本时的各个参数组成;
* process.arch: 返回一个表示操作系统CPU架构的字符串;
* process.platform: 标识Node.js进程运行其上的操作系统平台;
* process.exit: 退出当前进程,接受一个参数,如果参数大于0,表示执行失败;如果等于0,表示执行成功;

## No.3 console有哪些常用的方法?

console.log/info/error/warning/time/timeEnd/trace/table

* time: 启动一个定时器，用以计算一个操作的持续时间。
* timeEnd: 停止之前通过调用 console.time() 启动的定时器，并打印结果到 stdout
* trace: 打印字符串 'Trace :' 到 stderr ，并通过 util.format() 格式化消息与堆栈跟踪在代码中的当前位置。
* table: 以表格的形式展示;

## No.4 Node.js有哪些定时功能?

setTimeout/clearTimeout,setInterval/clearInterval,setImmediate/clearImmediate,process.nextTick

* setImmediate: 属于check观察者
* process.nextTick(): 会在代码运行完成后立即执行
* setTimeout(fn, 0)从源码分析上其实是在执行setTimeout(fn, 1),虽然setTimeout按事件观察者排序,优先级高于setImmediate,实际上执行顺序就不一定谁先谁后.

## No.5 Node.js事件循环是什么样子的?

主线程从“任务队列”中读取事件,这个过程是循环不断的,所以整个的这种运行机制称为Event Loop(事件循环).

Node.js 运行机制如下:
* V8 引擎解析 JS 脚本;
* 解析后的代码,调用 Node API;
* Libuv 库负责 Node API 的执行,它将不同的任务分配给不同的线程,形成一个 Event Loop(事件循环),以异步的方式将任务的执行结果返回给 V8 引擎;
* V8 引擎再将结果返回给用户.

如下图示:
![node-v8-binding-libuv](/assets/node-v8-binding-libuv.png)

## No.6 Node.js中的Buffer如何应用?

Buffer是用来处理二进制数据的,比如与IO相关的操作(网络/文件)、图片、mp3、数据库文件等,Buffer支持各种编码、解码,二进制字符串互转.但其大小是固定不变.

* 申请Buffer常用方法:
  * Buffer.from(): 根据已有数据生成一个Buffer对象;
  * Buffer.alloc(): 创建一个初始化后的Buffer对象;
  * Buffer.allocUnsafe(): 创建一个未初始化的Buffer对象

* ES6增加TypedArray,Node.js因此修改原来的Buffer实现,提高性能

示例代码:

```js
const arr = new Uint16Array(2);
arr[0] = 5000;
arr[1] = 4000;
const buf1 = Buffer.from(arr); // 拷贝了该buffer
console.log(buf1);
```

* String Decoder
字符串解码器(String Decoder)是一个用于将Buffer拿来decode到string到模块,是作为Buffer.toString补充.
防止宽字节处理不当,造成乱码.

```js
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
const buf1 = Buffer.from("我是程序员");
const buf2 = decoder.write(Buffer.from(buf1));
console.log(buf1);
console.log(buf2);
```






