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

## 一. 首页上报 页面初始化性能体验

> 目前的测速上报体系依赖于浏览器"performance"属性,绝大部分浏览器都支持;

站在巨人的肩膀,可以基于[timing.js](https://github.com/addyosmani/timing.js/blob/master/timing.js)

关于performance的各个接口描述就不在这里列举了,可以去查看阮大大的博客[Performance API](http://javascript.ruanyifeng.com/bom/performance.html)

### 1. 几个比较重要的统计阶段

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

### 2. 业务埋点:放在模版中或通过构建工具植入到代码

* 第一个script不受css阻塞,记录开始时间

```js
<head>
    ...
    <!-- 开始计时 -->
    <script>var T = {start: Date.now()};</script>
    ...
</head>
```

* 第二个头部结束的时候,常规此时除了内联样式之外的CSS应该已经加载完成

```js
<head>
...
<!-- header css加载结束-->
<script>T.header=Date.now();</script>
</head>
```

* 第三body dom加载完成

```js
<body>
...
<!--dom body加载完成-->
<script>T.body=Date.now();</script>
</body>
```

* 第四,JS主逻辑开启

```js
<script src="main.js"></script>
<script>T.mainStart=Date.now();</script>
```

* 第五,JS渲染结束

```js
<script>xxxxx</script>
<script>xxxxx</script>
<script>xxxxx</script>
<script>T.mainEnd=Date.now();</script>
```

注:这里面需要区分直出和非直出,原则上,有一些CGI接口是异步获取的,因此mainEnd可能无法作为页面全部都渲染完成的结束时间.但是,如果是react,vue等框架开发,在非web work场景下,首先JS是按顺序加载执行的,webkit内JS代码本身是单线程执行,这样至少已经render一次,此时用户也基本看到页面样式

当然,不同的团队可能制定的标准语义值有差异

```js
domEnd: 20,
cssEnd: 21,
jsEnd: 22,
firstScreen: 23,
dataEnd: 24,
allEnd: 25
```

### 3. 需要注意的事项

* 非同步执行的页面渲染,需要注意如下:

  * 页面存在iframe的情况下也需要判断加载时间;
  * 异步渲染的情况下应在异步获取数据插入之后再计算首屏;
  * css重要背景图片可以通过JS请求图片url来统计(浏览器不会重复加载)
  * 没有图片则以统计JS执行时间为首屏,即认为文字出现时间

* 浏览器白屏时间: 可以理解为dom加载完成记作白屏结束.

* 总下载时间: 默认可以统计onload时间,这样可以统计同步加载的资源全部加载完的耗时.

## 二. 测试,返回码上报

### 1. 关注接口上报的统计维度

比如:appid,platform,domain,cgi,type,code,time,apn等;
为了不浪费code和type,请务必规范业务的返回码.协议规范是统计数据有意义的基础.

### 2. 组织上报的数据

更好的规范,才能发挥数据上报,更有价值的反馈和统计.

```js
let CONFIG = {
    appid: getAppId(),
    platform: getPlatform(),
    domain: "xxx.com",
    apn: "4G"
    //...
}
```

### 3. 上报的频率控制

默认delay一个合理值,如果希望立即上报,那么delay设为0.

```
setTimeout(doReport, delay);
```

## 三. 错误上报

需要跟踪页面实时上报的错误,涉及JS错误以及主动上报.核心就是包装了window.onerror这个事件,进行error stack和message的包装,进行上报,因此使用的时候,自己就不要重写window.onerror,可以使用try catch进行异常捕获.

可以封装一个API便于统一上报

```js
REPORT.init({
    id: xxx, // 可以是业务线id
    combo: 0, // 是否合并上报, 0:关闭, 1 启动(默认)
    delay: 0, // 当combo=1可用,延迟多少毫秒,合并缓冲区中的上报
    url: "xxx.com", // 指定上报地址
    ignore: [], // 忽略某个错误
    level: 1 // 设置默认级别,如:1-debug 2-info 4-error 8-fail
})
```

需要满足:实时性,可染色

## 四、用户行为数据

产品同学更加关注,包括页面点击,用户操作,如何能够统计的更合理,比如热力图,用户操作流程和步骤,用户使用习惯的统计

## 五、监控

监控更偏向后端的上报,monitor对于开发的报警、邮件提醒,短信告知,是一个比较符合行业标准的方式.

* 需要有更合理的报警维度,每天很多条短信,麻木了;
* 立体化等前端监控,多整合,避免重复造轮子,保证监控稳定全面即可;
* 寻找到合理化的web性能标准,不断完善性能指标;
* 完善所有基础库的单元测试和代码稳定;
...


