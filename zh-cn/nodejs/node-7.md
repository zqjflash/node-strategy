# 第七节 IO

## No.1 什么是IO,什么又是IO密集型业务呢?

IO称为输入/输出,分为IO设备和IO接口两个部分.
IO密集型指的是系统的CPU性能相对磁盘、内存要好很多,此时,系统运作大部分的状态是CPU在等I/O(硬盘/内存)的读/写操作,此时CPU loading并不高.

## No.2 什么是Stream,Stream有什么好处,Stream的应用场景是什么?

Stream是基于事件EventEmitter的数据管理模式,由各种不同的抽象接口组成,主要包括可写,可读,可读写,可转换等几种类型.
好处是:非阻塞式数据处理提升效率,片段处理节省内存,管道处理方便可扩展等.
应用场景:文件、网络、数据转换、音频、视频等
针对大文件的使用场景:
比如拷贝一个20G大的文件,如果你一次性将20G的数据读入到内存,你的内存可能会被撑爆,或者严重影响性能.但是你如果使用一个1MB大小的缓存(buf)每次读取1Mb,然后写入1Mb,那么不论这个文件多大都只会占用1Mb的内存.

## No.3 如何捕获Stream的错误事件?

只要监听error事件,方法与EventEmitter相同.

## No.4 有哪些常用的Stream流,分别什么时候使用?

|    类    |   使用场景   |    重写方法    |
| ------ | ------ | ------ |
| Readable | 只读,为可被读流,在作为输入数据源时使用 | 重写_read方法 |
| Writable | 只写,为可被写流,在作为输出源时使用 | 重写_write方法 |
| Duplex   | 读写,为可读写流,它作为输出源接受被写入,同时又作为输入源被后面的流读出. | 重写_read和_write |
| Transform | 与Duplex相似,操作被写入数据, 然后读出结果 | 重新_transform和_flush |

注: Transform机制和Duplex一样,都是双向流,区别是Transform只需要实现一个函数 _transform(chunk,encoding,callback);而Duplex需要分别实现_read(size)函数和_write(chunk,encoding,callback)函数.

## No.5 如何实现一个Writable Stream?

主要思路:

* 创建一个构造函数,使用Writable进行call调用;
* 构造函数继承Writable类;
* 构造函数原型实现_write(chunk,encoding,callback)函数

```js
const Writable = require("stream").Writable;
const util = require("util");
function MyWritable(options) {
    Writable.call(this, options);
}
util.inherits(MyWritable, Writable); // 继承自Writable
// 重写_write方法
MyWritable.prototype._write = function(chunk, encoding, callback) {
    console.log("被写入的数据是:", chunk.toString()); // 此处可对写入的数据进行处理
    callback();
};
process.stdin.pipe(new MyWritable()); // stdin作为输入源, MyWritable作为输出源
```

## No.6 Buffer一般用于处理什么数据?其长度能否动态变化?

Buffer是Node.js中用于处理二进制数据的类,其中与IO相关的操作(网络/文件等)均基于Buffer.Buffer类的实例非常类似整数数组,但其大小是固定不变的,并且其内存在V8堆栈外分配原始内存空间.Buffer类的实例创建之后,其所占用的内存大小就不能再进行调整.
