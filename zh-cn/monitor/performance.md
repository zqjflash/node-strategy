# 性能监控

## No.1 常用的页面性能监控有哪些方法?

常见的有4种方法:Performance Timing API, Profile工具,页面埋点计时,资源加载时序图分析.

## No.2 对前端有意义的性能指标有哪些?怎么捕获?

包括:DOM树耗时、load事件耗时、整个加载过程耗时.

```js
var domReadyTime = timing.domComplete - timing.domInteractive;
var loadEventTime = timing.loadEventEnd - timing.loadEventStart;
var loadTime = timing.loadEventEnd - timing.navigationStart;
```

## No.3 如何分析页面JS代码执行时系统的内存或CPU资源的消耗情况?

可以使用console.profile()和console.profileEnd()分析,示例代码如下:

```js
console.profile();
// TODOS, 需要测试的页面逻辑动作
for (let i = 0; i < 100000; i++) {
    console.log(i * 2);
}
console.profileEnd();
```
