# 第二节 系统资源监控

## No.1 如何监控CPU?

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

