# 第二节 系统资源监控

## No.1 如何监控CPU?

CPU profiling常用于性能优化.有许多用于做profiling的第三方工具,但是大部分情况下,使用Node.js内置的是最简单的.

* 第一种:使用v8-profiler-node8

```js
const v8Profiler = require("v8-profiler-node8");
v8Profiler.startProfiling(title, true);
setTimeout(() => {
    const profiler = v8Profiler.stopProfiling(title);
    profiler.delete();
    resolve(profiler);
}, profilingTime);
```

* 第二种:os.loadavg()

Node.js提供os.loadavg()可以获取系统的CPU使用率

* 第三种:获取当前进程CPU使用率

```js
process.cpuUsage();
```

* 第四种:使用--prof开启内置的profiling

```js
node --prof app.js
```

程序运行之后会生成一个isolate-0xnnnnnnnn-v8.log在当前运行目录.
同时使用--prof-process查看报告.

```js
node --prof-process isolate-0xnnnnnnnn-v8.log
```


## No.2 如何监控内存?

* 第一种:使用v8-profiler-node8

```js
const v8Profiler = require("v8-profiler-node8");
const snapshot = v8Profiler.takeSnapshot();
const transform = snapshot.export(); // 创建 transform 流
resolve(transform);
// 结束后删除
transform.on('finish', snapshot.delete.bind(snapshot));
```

* 第二种:使用process.memoryUsage

  * rss: Node进程总内存占用量;
  * heapUsed: 实际堆内存使用量;

* 第三种:使用v8的getHeapStatistics接口

  * total_heap_size: 总堆内存占用量,同process.memoryUsage().heapTotal
  * used_heap_size: 实际堆内存使用量,同process.memoryUsage().heapUsed

