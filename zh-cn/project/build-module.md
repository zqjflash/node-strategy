# 从开发一个模块说起

有时候组件和模块是一个不太好区分的概念，特别是在前端领域，大家对于功能、方法的划分粒度都有自己的理解。

在Angular里，module是一些类，函数或者值的集合。component则更像一个区块，比如某一段负责渲染模版到html的代码，多个component可以组成一个app。module之间可以相互引用，module也可以被component引用。

其实在web标准里，也可以看到一些相同的思路，比如ESM(EcmaScript modules)和Web Component，分别归属于ECMAScript规范和W3C规范。在极简的场景下，module负责提供一些方法，component负责渲染到页面上。

不过其实原本不需要太纠结这个问题，比如一个React Component发布到npm就是一个React module。只是在搭建的场景下，我们引入了组件和模块的概念。

* 组件：一个react component或者node.js module，在搭建体系下，都是一个组件；
* 模块：模块是组成页面的最小结构单位，一个模块会包含模版（jsx、xtpl等）、样式(CSS)、脚本逻辑、数据描述（data-schema）、模拟数据（mock-data）、表单描述（form-schema）、数据逻辑（faas-function）、依赖的描述（deps）等。一个模块甚至可以承接一个页面的逻辑。组件加上数据描述就是一个模块。

下图描述一个模块的生产流程：

![module-product.png](/assets/module-product.png)