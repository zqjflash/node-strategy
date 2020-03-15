# 前端搭建系列-模块
## 一、从开发一个模块说起

有时候组件和模块是一个不太好区分的概念，特别是在前端领域，大家对于功能、方法的划分粒度都有自己的理解。

在Angular里，module是一些类，函数或者值的集合。component则更像一个区块，比如某一段负责渲染模版到html的代码，多个component可以组成一个app。module之间可以相互引用，module也可以被component引用。

其实在web标准里，也可以看到一些相同的思路，比如ESM(EcmaScript modules)和Web Component，分别归属于ECMAScript规范和W3C规范。在极简的场景下，module负责提供一些方法，component负责渲染到页面上。

不过其实原本不需要太纠结这个问题，比如一个React Component发布到npm就是一个React module。只是在搭建的场景下，我们引入了组件和模块的概念。

* 组件：一个react component或者node.js module，在搭建体系下，都是一个组件；
* 模块：模块是组成页面的最小结构单位，一个模块会包含模版（jsx、xtpl等）、样式(CSS)、脚本逻辑、数据描述（data-schema）、模拟数据（mock-data）、表单描述（form-schema）、数据逻辑（faas-function）、依赖的描述（deps）等。一个模块甚至可以承接一个页面的逻辑。组件加上数据描述就是一个模块。

下图描述一个模块的生产流程：

![module-product.png](/assets/module-product.png)

## 二、从组件到模块

组件一直是一个比较纠结的事情。最理想的情况，不应该有组件的概念，“发送时要保守，接收时要开放”，原则上所有npm上的module，都应该低成本的引用。但实际上，低成本本身确是一个很大的挑战。搭建体系本身包含了从研发到线上渲染，所以必须得思考和解决下面的问题：

1. 模块如何引用组件？
2. 如何合理引入npm的资源？
3. 如何引入和编译本地文件系统里的文件？
4. 如何渲染一个页面？

## 三、如何解决研发问题

### 3.1 模块、组件之间的引用

在很多年前，模块加载器是前端工程里非常重要的一部分。加载器本质上就是通过一个去中心化的引用关系来描述细粒度模块之间的依赖，开发者使用模块A的时候，只需要声明我依赖模块A，而模块A本身依赖来模块B，是在模块A自己内部管理的。在最终浏览器端，加载器把一个个引用关系进行合并，最后用合并后的引用关系表来生成一串combo url。

引用关系实际对应的就是搭建体系里的seed文件。seed本身算是一个比较古老的设计，从YUI时代（或者可能更早）就已经有seed的概念。

```js
YUI({
  modules: {
    one: {
      async: false,
      fullpath: './one.js'
    },
    two: {
      async: false,
      fullpath: './two.js',
      requires: ['one']
    }
  }
}).use('two', function(Y) {
  // Module one &amp; two are loaded now.
});
```

因为有一份这样的依赖描述，也可以通过同名取最新版本的策略，来做到同名模块只会加载一次，一定程度上解决js体系过大的问题。同时，如果开发者有能力或者有一个好的策略对combo url进行管理，是可以做到多页面之间共享资源缓存的，提升全链路的用户体验。

这种依赖关系的设计方案，在搭建服务需要具备seed处理的能力，可以在服务端去重输出代码bundle，这部分在Native的情况下还是有重要作用。

![module-invoke.png](/assets/module-invoke.png)

### 3.2 如何引入npm的资源

