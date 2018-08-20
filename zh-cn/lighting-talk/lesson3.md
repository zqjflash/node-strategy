# 第三篇 前端web测试、上报、监控体系构建

## 0. 前言

我们需要明确一个观点:监控只是手段,容灾才是核心

### 展开思考

* 需要找到自己内部或行业比较好用的上报系统;
* 明确我们需要监控的基础方法,使用这些上报系统完成测试demo,熟悉整体流程;
* 找到业界公认的行业标准,进行差异化补充;
* 将团队和业务的定制功能,合并整合进来;
* 需要满足:业务的灵活上报、支持上报类型(如:合并上报、自动上报)、上报的灵活配置;
* 单元测试:选取一个测试框架,进行用例的编写,提高代码质量.

### 制定公用的上报指标

* 首屏上报
* 页面测速上报
* 返回码上报
* js error上报
* 用户行为数据上报
* 实时监控上报

### 针对的用户群体和

* 针对开发者使用:首屏、测速、返回码、js异常、监控

  * 首屏: 是作为一种长期持续优化的专题性方式,需要持续关注,定期迭代优化;
  * 测速和返回码: 是对接口级别的监控,这样可以发现单个接口的问题,失败率,速度,分析是网络原因,还是服务稳定性,核心价值:是批量统计,可以看不同地区服务的稳定性.
  * js异常:快速发现和定位js问题,核心价值是实现;
  * 用户行为: 对用户操作的数据,进行统计,分析,指引产品优化方向;
  * 监控:实时监控失败率,进行报警,包括邮件、短信提醒;

## 1. 首页上报 页面初始化性能体验

> 目前的测速上报体系依赖于浏览器"performance"属性,绝大部分浏览器都支持;

站在巨人的肩膀,可以基于[timing.js](https://github.com/addyosmani/timing.js/blob/master/timing.js)

关于performance的各个接口描述就不在这里列举了,可以去查看阮大大的博客[Performance API](http://javascript.ruanyifeng.com/bom/performance.html)

## 2. 几个比较重要的统计阶段

* 页面加载完成的时间,这几乎代表了用户等待页面可用的时间

```js
loadPage = loadEventEnd - navigationStart;
```

* 解析DOM树结构的时间

```js
domReady = domComplete - responseEnd;
```

* 重定向的时间,拒绝重定向! 比如http://m.baidu.com/不能写成http://m.baidu.com

```js
redirect = redirectEnd - redirectStart;
```

* DNS查询时间,页面内是不是使用了太多不同的域名导致域名查询的时间太长

```js
lookupDomain = domainLoopupEnd - domainLookupStart;
```

* 读取页面第一个字节的时间,可以理解为用户拿到你的资源占用的时间

```js
ttfb = responseStart - navigatorStart; // TTFB即Time To First Byte
```

* 内容加载完成的时间,页面内容经过gzip压缩了吗,静态资源css/js等压缩

```js
request = responseEnd - requestStart;
```

* 执行onload回调函数的时间

是否太多不必要的操作都放到onload回调函数里执行了,考虑过延迟加载、按需加载的策略么?

```js
loadEvent = loadEventEnd - loadEventStart;
```

* DNS缓存时间

```js
appcache = domainLookupStart - fetchStart;
```

* 卸载页面的时间

```js
unloadEvent = unloadEventEnd - unloadEventStart;
```

* TCP建立连接完成握手时间

```js
connect = connectEnd - connectStart;
```
