# 第一节 页面布局相关

## No.1 常见div居中布局方法有哪些?

* 首先制定页面结构

```js
<div class="wrapper">
    <div class="inner"></div>
</div>
```

* 其次就是设定CSS样式
  
1. 使用Flex布局实现

```
.wrapper {
    display: flex;
    width: 500px;
    height: 500px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    justify-content: center;
    align-items: center;
    background-color: #000;
}
.wrapper .inner {
    width: 300px;
    height: 300px;
    background-color: #666;
}
```

2. 流体布局

```
.wrapper {
    position: relative;
    width: 500px;
    height: 500px;
    background-color: #000;
}
.wrapper .inner {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 300px;
    height: 300px;
    background-color: #666;
}
```

3. transform平移

```
.wrapper {
    position: relative;
    width: 500px;
    height: 500px;
    background-color: #000;
}
.wrapper .inner {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    background-color: #666;
}
```

4. 已知宽高绝对定位

```
.wrapper {
    position: relative;
    width: 500px;
    height: 500px;
    background-color: #000;
}
.wrapper .inner {
    position: absolute;
    margin-top: 50%;
    margin-left: 50%;
    top: -150px;
    left: -150px;
    width: 300px;
    height: 300px;
    background-color: #666;
}
```

## No.2 H5有哪些比较实用的新功能?

* File API支持本地文件操作;
* Canvas/SVG支持绘图;
* 拖拽功能支持;
* 本地存储支持;
* 表单多属性验证支持,如(pattern, maxlength等)
* 原生音频视频支持等;

## No.3 Sass与Less的区别?

1. 处理方式不同

Sass是基于ruby的,是在服务端处理的;
Less是需要引入less.js来处理less代码;

2. 变量符不同

Sass采用$符号,less是@符号

3. 输出设置

Sass提供4种输出选项:nested(嵌套),compact(紧凑),compressed(压缩),expanded(扩展)
Less没有

4. 逻辑语法

Sass支持条件或流程控制语句,可以使用if else, for循环,而less没有.

## No.4 如何进行响应式布局

1. 使用css3 media screen

* 宽度匹配内联写法:

```js
@media screen and (max-width:400px) {...}
```

* 宽度匹配外链写法:

```js
<link rel="stylesheet" media="screen and (max-width:400px)" href="xxx.css" />
```

2. 支持移动端的viewport

```js
<media name="viewport" content="width-device-width, initial-scale=1.0" />
```

3. 宽度使用百分比,字号大小使用rem

* 响应式布局需要注意的事项

  * 布局结构不要使用绝对宽度,而要使用百分比;
  * 字体使用em或rem,不要使用px或pt;

4. 图片的响应式处理

```js
img {max-width: 100%; max-height: 100%}
```

## No.4 浮动布局的优缺点是什么?

* 优点:采用float布局,如果宽度太小,后面的元素会自动滚动到下方,不会出现滚动条
* 缺点:浮动元素是脱离文档流,处理不好,会出现高度塌陷等问题.

目前很多时候采用混搭:很多结构可以用display:inline-block或者position:absolute替代.

## No.5 什么是BFC?

BFC中文就是块级作用域,一个HTML元素要创建BFC,需要满足下列任意一个或多个条件即可:

* float的值不是none;
* position的值不是static或者relative;
* display的值为inline-block、table-cell、flex、table-caption或者inline-flex;
* overflow的值不是visible

常见创建BFC的方法如下:

* display: table; // 可能引发响应性问题
* overflow: scroll; // 可能产生多余滚动条
* float: left; // 将把元素移至左侧,并被其他元素环绕
* overflow: hidden; // 将裁切溢出的元素

## No.6 多个html页面如何共享数据?

* 使用jsonp;
* 同域下可以使用cookie, 可以记录用户访问网站的喜好等;
* 同域下也可以也可以使用localStorage或sessionStorage;
* 在范围域内也可以是用Service Worker
* 使用postMessage;
* 使用中转页面传递;
* 使用隐藏的表单post方式.

## No.7 css如何实现立方体？

方案：考虑所有的侧面，通过具有preserve-3d值的transform-style属性使它转变成一个3d对象

```js
<style type="text/css">
.cube { position: relative; transform-style: preserve-3d;}
.side { position: absolute;}
.back { transform: translateZ(-100px); }
.left { transform: translateX(-100px) rotateY(90deg); }
// ...以此类推
</style>
<div class="scene">
  <div class="cube">
    <div class="side back"></div>
    <div class="side left"></div>
    <div class="side right"></div>
    <div class="side top"></div>
    <div class="side bottom"></div>
    <div class="side front"></div>
  </div>
</div>
```

## No.8 描述一下cookie、sessionStorage、localStorage的区别？

* 特性上：Cookie由服务器生成，可设置失效事件。如果在浏览器端生成Cookie，默认是关闭浏览器后生成；localStorage除非被清除，否则永久保存；sessionStorage仅在当前会话下有效，关闭页面或浏览器后被清除。
* 存放数据大小：cookie 4k左右；localStorage和sessionStorage一般在5MB
* 与服务器端通信：cookie每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题；localStorage和sessionStorage仅在客户端（即浏览器）中保存，不参与和服务器的通信
* 易用性：cookie需要程序员自己封装，原生的cookie接口不友好；localStorage和sessionStorage原生接口可以接受，也可再次封装来对Object和Array有更好的支持；

## No.9 * { box-sizing: border-box; } 是用来干什么的？有什么优点？
加了box-sizing:border-box属性，padding和border的值就不会在影响元素的宽高，相当于把padding和border的值都算在content里
盒子模型会自动根据padding和border的值来调整content的值，就不需要手动调整

## No.10 描述一下<script><script async><script defer>的区别?

* 没有defer或async，浏览器会立即加载并执行指定的脚本；
* 有async，加载和渲染后续文档元素的过程将和script.js的加载与执行并行进行;
* 有defer，加载后续文档元素的过程和script.js的加载并行进行（异步），但是script.js的执行要在所有元素解析完成之后，DOMContentLoaded事件触发之前完成。

## No.11 为什么说css放在<head></head>里，而js放在<body>里是一种比较好的实践？有特殊情况吗？

css放在`<head></head>`里，因为放在body里，档DOM树构建完成，渲染树才构建，那么当渲染树构建完成，浏览器不得不再重新渲染整个页面，这样造成资源的浪费，效率也不高，放在head之间，浏览器边构建边渲染，效率要高的多。

js放在body里，因为放在所有body中的标签后面就不会出现网页加载时出现空白的情况，可以持续的给用户提供视觉反馈，同时在有些情况下，会降低错误的发生。

采用非阻塞加载的方案例外。

## No.12 Grid栅格布局是做什么的？实现原理是怎么样的？

* 栅格系统是一种运用固定的格子设计版面布局；
* 在响应式设计大规模使用，栅格系统特点：
  * 提高生产力，通过用网格的划分，元素更容易堆放而且在跨浏览器上面具有一致性，使我们可以专心的注意布局而不是兼容性上；
  * 具有灵活性，无论是什么样的布局，都可以拆分到粒度为一个网格的大小；
  * 支持响应式设计；
* 栅格的组成：container（包裹整个栅格系统的容器），rows：行，columns：列，gutters：各列的间的空隙


