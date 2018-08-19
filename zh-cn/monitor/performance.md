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

## No.4 网站性能优化有哪些?

1. http请求方面: 减少请求数量,请求体积,对应的做法是,对项目资源进行压缩,控制项目资源的dns解析在2到4个域名,提取公告的样式,公共的组件,雪碧图,缓存资源;

2. 压缩资源,提供公共资源压缩,提取css,js公共方法;

3. 不要缩放图片,使用雪碧图,使用字体图标(阿里矢量图库);

4. 使用CDN,抛开无用的cookie

5. 减少重绘重排,css属性读写分离,最好不要用js修改样式,dom离线更新,渲染前指定图片的大小;

6. js代码层面的优化,减少对字符串的计算,合理使用闭包,首屏的js资源加载放在最底部.
