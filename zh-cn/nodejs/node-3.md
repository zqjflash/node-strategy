# 第三节 模块机制

## No.1 Node.js两个js文件互相require,是否会死循环?双方是否可以导出变量?如何从设计上避免这种问题?

不会出现死循环,先执行的导出空对象,后执行的可以导出对方的变量值,通过导出工厂函数让对方从函数取比较好避免这种问题.

* moduleA.js示例代码:
```js
var moduleB = require('./moduleB');
console.log(moduleB);
module.export = {a: 1};
```
* moduleB.js示例代码:
```js
var moduleA = require('./moduleA');
console.log(moduleA);
module.export = {b: 2};
```

执行node moduleA.js
打印结果:
```js
{}
{b: 2}
```

分析原因: 模块A导出的只是var module = {exports: {}}, 启动moduleA.js时,还没执行完exports就是{},所以在moduleB开头拿到的就是{}.

注: exports只是module.exports的一个引用.
